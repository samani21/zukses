import React, { useEffect, useState } from 'react'
import AddBankAccountModal from './AddBankAccountModal';
import Loading from 'components/Loading';
import Post from 'services/api/Post';
import { getUserInfo } from 'services/api/redux/action/AuthAction';
import { Response } from 'services/api/types';
import { AxiosError } from 'axios';
import Snackbar from 'components/Snackbar';

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
const BankAccountPage = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [snackbar, setSnackbar] = useState<{
        message: string;
        type?: 'success' | 'error' | 'info';
        isOpen: boolean;
    }>({ message: '', type: 'info', isOpen: false });

    useEffect(() => {
        const currentUser = getUserInfo();
        if (currentUser) {
            setUser(currentUser);
        }
    }, []);
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
                // getUserAddress(user?.id); // refresh address list
                // setIsModalOpen(false)
            }
        } catch (err) {
            setLoading(false);
            const error = err as AxiosError<{ message?: string }>;
            setSnackbar({ message: error.response?.data?.message || 'Terjadi kesalahan', type: 'error', isOpen: true });
        }
    };
    return (
        <div className="w-full">
            <div className="md:flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Kamu bisa simpan maks. 3 rekening bank</h3>
                    <p className="text-sm text-gray-500">Saldo Zukses kamu bisa ditarik ke rekening ini.</p>
                </div>
                <button className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition font-semibold flex-shrink-0 mt-4 md:mt-0" onClick={() => setIsModalOpen(true)}>
                    Tambah Rekening Lain
                </button>
            </div>
            <div>
                <div className="border-t pt-4 flex flex-col md:flex-row gap-4 items-start">
                    <img src="/icon/bni.webp" alt="BNI Logo" className="" />
                    <div className="flex-grow">
                        <p className="text-sm text-gray-800 font-semibold">PT. BANK NEGARA INDONESIA (BNI) (PERSERO)</p>
                        <p className="text-gray-700">0435866872</p>
                        <p className="text-sm text-gray-500">a.n Ibu ANDI NAIFA</p>
                    </div>
                    <button className="border border-gray-300 rounded px-6 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition">Hapus</button>
                </div>
            </div>
            {isModalOpen && <AddBankAccountModal onClose={() => setIsModalOpen(false)} handleAdd={handleAdd} />}
            {
                loading && <Loading />
            }
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