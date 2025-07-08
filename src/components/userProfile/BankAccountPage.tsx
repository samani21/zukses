import React, { useEffect, useState } from 'react'
import AddBankAccountModal from './AddBankAccountModal';
import Loading from 'components/Loading';
import Post from 'services/api/Post';
import { getUserInfo } from 'services/api/redux/action/AuthAction';
import { Response } from 'services/api/types';
import { AxiosError } from 'axios';
import Snackbar from 'components/Snackbar';
import Get from 'services/api/Get';
import { ModalContainer } from 'components/Profile/ModalContainer';
import ModalDeleteBank from './ModalDeleteBank';
import Delete from 'services/api/Delete';

type BankAccountData = {
    bank_id: number;
    account_holder_name: string;
    account_number: string;
};

interface User {
    name?: string;
    email?: string;
    whatsapp?: string;
    id?: number;
    username?: string;
    image?: string;
    role?: string;
}
type GetAccountBank = {
    name_bank?: string;
    account_name?: string;
    icon?: string;
    account_number?: number;
    id?: number;
};
const BankAccountPage = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [bankAccount, setBankAccount] = useState<GetAccountBank[]>([]);
    const [openDelete, setOpenDelete] = useState<number>(0);
    const [snackbar, setSnackbar] = useState<{
        message: string;
        type?: 'success' | 'error' | 'info';
        isOpen: boolean;
    }>({ message: '', type: 'info', isOpen: false });

    useEffect(() => {
        const currentUser = getUserInfo();
        if (currentUser) {
            setUser(currentUser);
            getBankAccounts(currentUser?.id)
        }
    }, []);
    const getBankAccounts = async (userId?: number) => {
        if (!userId) return;
        console.log('userId', userId);
        setLoading(true);
        const res = await Get<Response>('zukses', `bank-accounts/${userId}/show`);
        setLoading(false);

        console.log('data', res)
        if (res?.status === 'success' && Array.isArray(res.data)) {
            const data = res.data as GetAccountBank[];
            setBankAccount(data);
        } else {
            console.warn('Account Bank tidak ditemukan atau bukan array:');
        }
    };

    const handleAdd = async (data: BankAccountData): Promise<void> => {
        try {
            console.log('data', data)
            setLoading(true);
            const formData = new FormData();
            formData.append('bank_id', data.bank_id.toString());
            formData.append('account_name', data.account_holder_name);
            formData.append('account_number', data.account_number);
            const res = await Post<Response>('zukses', `bank-accounts/${user?.id}`, formData);

            if (res?.data?.status === 'success') {
                setLoading(false);
                setIsModalOpen(false)
                getBankAccounts(user?.id); // refresh address list
            }
        } catch (err) {
            setLoading(false);
            const error = err as AxiosError<{ message?: string }>;
            setSnackbar({ message: error.response?.data?.message || 'Terjadi kesalahan', type: 'error', isOpen: true });
        }
    };

    const handleDelete = async (id?: number): Promise<void> => {
        try {
            setLoading(true);
            const res = await Delete<Response>('zukses', `bank-accounts/${id}`);
            setLoading(false);

            if (res?.data?.status === 'success') {
                getBankAccounts(user?.id); // refresh address list
                setOpenDelete(0)
            }
        } catch (err) {
            setLoading(false);
            const error = err as AxiosError<{ message?: string }>;
            setSnackbar({ message: error.response?.data?.message || 'Terjadi kesalahan', type: 'error', isOpen: true });
        }
    };
    return (
        <div className="w-full">
            <div className="md:flex justify-between items-center mb-6 p-3">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Kamu bisa simpan maks. 3 rekening bank</h3>
                    <p className="text-sm text-gray-500">Saldo Zukses kamu bisa ditarik ke rekening ini.</p>
                </div>
                <button className="bg-[#52357B] text-white rounded-md px-4 py-2 hover:bg-blue-700 transition font-semibold flex-shrink-0 mt-4 md:mt-0" onClick={() => setIsModalOpen(true)}>
                    Tambah Rekening Lain
                </button>
            </div>
            <div className='py-4 mt-[-10px]'>
                {
                    bankAccount?.map((ab, i) => (
                        <div className="border-t border-gray-300 px-4 pt-4 flex flex-col md:flex-row gap-4 items-start" key={i}>
                            <img src={ab?.icon} alt={ab?.name_bank} className="" width={100} />
                            <div className="flex-grow">
                                <p className="text-sm text-gray-800 font-semibold">{ab?.name_bank}</p>
                                <p className="text-gray-700">{ab?.account_number}</p>
                                <p className="text-sm text-gray-500">a.n {ab?.account_name}</p>
                            </div>
                            <button className="border border-gray-300 rounded px-6 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition" onClick={() => setOpenDelete(ab?.id ?? 0)}>Hapus</button>
                        </div>
                    ))
                }
            </div>
            {isModalOpen && <AddBankAccountModal onClose={() => setIsModalOpen(false)} handleAdd={handleAdd} />}
            {
                loading && <Loading />
            }
            <ModalContainer open={openDelete > 0 ? true : false}>
                <ModalDeleteBank id={openDelete} handleDelete={handleDelete} setOpenDelete={setOpenDelete} />
            </ModalContainer>
            {snackbar.isOpen && (
                <Snackbar
                    message={snackbar.message}
                    type={snackbar.type}
                    isOpen={snackbar.isOpen}
                    onClose={() => setSnackbar((prev) => ({ ...prev, isOpen: false }))}
                />
            )}

        </div>
    );
};
export default BankAccountPage