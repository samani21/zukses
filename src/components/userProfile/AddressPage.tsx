import React, { useEffect, useState } from 'react'
import AddAddressModal from './AddAddressModal';
import { AxiosError } from 'axios';
import Delete from 'services/api/Delete';
import { Response } from 'services/api/types';
import Post from 'services/api/Post';
import Get from 'services/api/Get';
import { getUserInfo } from 'services/api/redux/action/AuthAction';
import { ModalContainer } from 'components/Profile/ModalContainer';
import ModalDelete from './ModalDelete';
import Snackbar from 'components/Snackbar';
import Loading from 'components/Loading';
interface User {
    name?: string;
    email?: string;
    whatsapp?: string;
    id?: number;
    username?: string;
    image?: string;
    role?: string;
}

type AddressData = {
    name: string;
    phone: string;
    isPrivate: boolean;
    isStore: boolean;
    detailAddress: string;
    fullAddress: string;
    fullAddressStreet: string;
    lat: number;
    long: number;
    prov: number;
    city: number;
    district: number;
    postCode: number;
};

type GetAddressData = {
    name_receiver?: string;
    number_receiver?: string;
    provinces?: string;
    cities?: string;
    subdistricts?: string;
    postal_codes?: string;
    full_address?: string;
    detail_address?: string;
    id?: number;
    lat?: number;
    long?: number;
    is_primary?: number;
    is_store?: number;
    province_id?: number;
    citie_id?: number;
    subdistrict_id?: number;
    postal_code_id?: number;
};
const AddressPage = () => {
    const [openModalAddAddress, setOpenModalAddAdress] = useState<boolean>(false);
    const [openDelete, setOpenDelete] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [addresses, setAddresses] = useState<GetAddressData[]>([]);
    const [dataAddress, setDataAddress] = useState<GetAddressData | null>(null);
    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<{
        message: string;
        type?: 'success' | 'error' | 'info';
        isOpen: boolean;
    }>({ message: '', type: 'info', isOpen: false });

    const [user, setUser] = useState<User | null>(null);
    console.log('user', user)
    useEffect(() => {
        const currentUser = getUserInfo();
        if (currentUser) {
            setUser(currentUser);
            getUserAddress(currentUser.id);
        }
    }, []);

    const getUserAddress = async (userId?: number) => {
        if (!userId) return;
        console.log('userId', userId);
        setLoading(true);
        const res = await Get<Response>('zukses', `user-address/${userId}`);
        setLoading(false);

        console.log('data', res)
        if (res?.status === 'success' && Array.isArray(res.data)) {
            const data = res.data as GetAddressData[];
            setAddresses(data);
        } else {
            console.warn('User address tidak ditemukan atau bukan array:');
        }
    };

    const handleAdd = async (data: AddressData, id?: number): Promise<void> => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('name_receiver', data.name);
            formData.append('number_receiver', data.phone);
            formData.append('province_id', String(data.prov || 0));
            formData.append('citie_id', String(data.city || 0));
            formData.append('subdistrict_id', String(data.district || 0));
            formData.append('postal_code_id', String(data.postCode || 0));
            formData.append('full_address', data.fullAddressStreet);
            formData.append('full_location', data.fullAddress);
            formData.append('detail_address', data.detailAddress);
            formData.append('lat', String(data.lat || 0));
            formData.append('long', String(data.long || 0));
            formData.append('is_primary', String(data.isPrivate ? 1 : 0));
            formData.append('is_store', String(data.isStore ? 1 : 0));

            if (id) {
                const res = await Post<Response>('zukses', `user-address/${id}/edit`, formData);
                setLoading(false);

                if (res?.data?.status === 'success') {
                    getUserAddress(user?.id); // refresh address list
                    setOpenModalAddAdress(false)
                }
            } else {
                const res = await Post<Response>('zukses', `user-address/create/${user?.id}`, formData);
                setLoading(false);

                if (res?.data?.status === 'success') {
                    getUserAddress(user?.id); // refresh address list
                    setOpenModalAddAdress(false)
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
            const res = await Post<Response>('zukses', `user-address/${id}/edit-status`, formData);
            setLoading(false);

            if (res?.data?.status === 'success') {
                getUserAddress(user?.id); // refresh address list
                setOpenModalAddAdress(false)
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
            const res = await Delete<Response>('zukses', `user-address/${id}/delete`);
            setLoading(false);

            if (res?.data?.status === 'success') {
                getUserAddress(user?.id); // refresh address list
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
            <div className="flex justify-between px-3">
                <h2 className="text-[20px] font-bold text-[#444444] mb-6 ">Alamat Saya</h2>
                <button className="bg-[#563D7C] text-white font-semibold text-[14px] rounded-[5px] px-4 py-2 w-[150px] h-[40px]" onClick={() => {
                    setOpenModalAddAdress(true)
                    setIsAdd(true);
                }}>
                    Tambah Alamat
                </button>
            </div>
            <div>
                <div className="space-y-4 mt-5">
                    {addresses.map(address => (
                        <div key={address.id} className="border-t border-[#CCCCCCCC] pt-4 flex flex-col md:flex-row gap-4 px-5">
                            <div className="flex-grow space-y-1 text-[#333333]">
                                <div className="flex items-baseline">
                                    <span className="font-bold text-[16px] mr-1">{address.name_receiver}</span>
                                    <span className='text-[16px]'> | {address.number_receiver}</span>
                                </div>
                                <p className='mt-2 text-[14px]'>{address.full_address},{address?.detail_address}</p>
                                <p className='mt-[-5px] text-[14px]'>{`${address?.subdistricts},${address?.cities}, ${address?.provinces}, ID, ${address?.postal_codes}`}</p>
                                <div className="flex gap-2 mt-1">
                                    {address.is_primary ? <span className="text-[#E67514] font-bold text-[14px] py-0.5 rounded-sm">Alamat Utama</span> : ''}
                                </div>
                            </div>
                            <div className="flex-shrink-0 flex flex-col items-end gap-2">
                                <div className="flex gap-4">
                                    <button className="text-[#333333] font-semibold text-[14px] hover:underline" onClick={() => {
                                        setDataAddress(address)
                                        setOpenModalAddAdress(true)
                                    }}>Ubah</button>
                                    {!address.is_primary && <button className="text-[#E67514] font-semibold text-[14px] hover:underline hidden md:block" onClick={() => setOpenDelete(address?.id || 0)}>Hapus</button>}
                                </div>
                                {
                                    !address.is_primary &&
                                    <button className="border border-[#CCCCCC] rounded-[5px] px-4 py-1.5 text-[14px] font-semibold text-[#333333]" onClick={() => handlePrimary(address?.id)}>Atur sebagai utama</button>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {openModalAddAddress && <AddAddressModal setOpenModalAddAdress={setOpenModalAddAdress} handleAdd={handleAdd} editData={dataAddress} openModalAddAddress={openModalAddAddress} setOpenDelete={setOpenDelete} isAdd={isAdd} setIsAdd={setIsAdd} />}
            <ModalContainer open={openDelete > 0 ? true : false}>
                <ModalDelete id={openDelete} handleDelete={handleDelete} setOpenDelete={setOpenDelete} />
            </ModalContainer>

            {snackbar.isOpen && (
                <Snackbar
                    message={snackbar.message}
                    type={snackbar.type}
                    isOpen={snackbar.isOpen}
                    onClose={() => setSnackbar((prev) => ({ ...prev, isOpen: false }))}
                />
            )}

            {loading && <Loading />}
        </div>
    );
};

export default AddressPage