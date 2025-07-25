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
import ModalDeleteBank from '../ModalDeleteBank';
import Delete from 'services/api/Delete';

type BankAccountData = {
    bank_id: number;
    id?: number;
    is_primary?: boolean;
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
    bank_id?: number;
    is_primary?: boolean;
};
const BankAccountPage = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [bankAccount, setBankAccount] = useState<GetAccountBank[]>([]);
    const [editBank, setEditBank] = useState<GetAccountBank>({});
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
            formData.append('is_primary', data.is_primary ? '1' : '0');

            if (data?.id) {
                const res = await Post<Response>('zukses', `bank-accounts/${data?.id}/edit`, formData);
                if (res?.data?.status === 'success') {
                    console.log('rsasad')
                    setLoading(false);
                    setIsModalOpen(false)
                    getBankAccounts(user?.id); // refresh address list
                }
            } else {
                const res = await Post<Response>('zukses', `bank-accounts/${user?.id}`, formData);

                if (res?.data?.status === 'success') {
                    setLoading(false);
                    setIsModalOpen(false)
                    getBankAccounts(user?.id); // refresh address list
                }
            }
        } catch (err) {
            setLoading(false);
            const error = err as AxiosError<{ message?: string }>;
            setSnackbar({ message: error.response?.data?.message || 'Terjadi kesalahan', type: 'error', isOpen: true });
        }
    };

    const handlePrimary = async (id?: number): Promise<void> => {
        try {
            setLoading(true);
            const formData = new FormData();
            const res = await Post<Response>('zukses', `bank-accounts/${id}/edit-status`, formData);
            setLoading(false);

            if (res?.data?.status === 'success') {
                getBankAccounts(user?.id);
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

    const handleEdit = (data?: GetAccountBank) => {
        if (data) {
            setEditBank(data);
            setIsModalOpen(true)
        }
    }

    console.log('editBank', editBank)
    return (
        <div className="w-full">
            <div className="md:grid grid-cols-4 mb-6">
                <div className='col-span-3'>
                    <p className="text-[20px] font-bold text-[#7952B3]">Rekening Bank Saya</p>
                    <p className='text-[#444444] text-[14px] w-[75%] mt-2' style={{ lineHeight: "115%" }}>Simpan dan kelola informasi rekening bank Anda untuk memudahkan proses pengembalian dana dan transaksi lainnya. (Tambahkan Maks. 3 Rekening)</p>
                </div>
                <div className='col-span-1 flex justify-end'>
                    {
                        bankAccount?.length < 3 &&
                        <button className="bg-[#563D7C] w-[150px] h-[40px] text-white text-[14px] rounded-[5px] font-semibold" onClick={() => setIsModalOpen(true)}>
                            Tambah Rekening
                        </button>
                    }
                </div>
            </div>
            <div className='py-4 mt-[-10px] space-y-4'>
                {
                    bankAccount?.map((ab, i) => (
                        <div className="bg-[#FFFFFF] border border-[#DCDCDC] shadow-[1px_1px_1px_rgba(0,0,0,0.08)] p-6  flex flex-col md:flex-row gap-4 items-start" key={i}>
                            <img src={ab?.icon} alt={ab?.name_bank} className="" width={67.5} height={22} />
                            <div className="flex-grow text-[#333333]">
                                <p className="text-[13px]">{ab?.name_bank}</p>
                                <p className="text-[16px] font-bold">{ab?.account_number}</p>
                                <p className="text-[15px]">a.n {ab?.account_name}</p>
                                {
                                    ab?.is_primary ? <p className='text-[#E67514] text-[14px] font-bold'>Rekening Utama</p> : ''
                                }
                            </div>
                            <div className="flex-shrink-0 flex flex-col items-end gap-2">
                                <div className="flex gap-4">
                                    <button className="text-[#333333] font-semibold text-[14px] hover:underline" onClick={() => handleEdit(ab)}>Ubah</button>
                                    {
                                        !ab?.is_primary && <button className="text-[#E67514] font-semibold text-[14px] hover:underline hidden md:block" onClick={() => setOpenDelete(ab?.id || 0)}>Hapus</button>
                                    }
                                </div>
                                {
                                    ab?.is_primary ? "" : <button className="border h-[40px] border-[#CCCCCC] rounded-[5px] px-4 py-1.5 text-[14px] font-semibold text-[#333333]" onClick={() => handlePrimary(ab?.id)}>Atur sebagai utama</button>
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
            {isModalOpen && <AddBankAccountModal onClose={() => {
                setIsModalOpen(false)
                setEditBank({})
            }} handleAdd={handleAdd} editBank={editBank} />}
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