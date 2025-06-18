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
    fullAddress: string;
    fullAddressStreet: string;
    lat: number;
    long: number;
    prov: number;
    city: number;
    district: number;
    postCode: number;
    tag: 'Rumah' | 'Kantor';
};

type GetAddressData = {
    name_receiver?: string;
    number_receiver?: string;
    provinces?: string;
    cities?: string;
    subdistricts?: string;
    postal_codes?: string;
    full_address?: string;
    label?: string;
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
            formData.append('label', data.tag);
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
            <div className="flex justify-end mb-6">
                <button className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition font-semibold flex items-center gap-2" onClick={() => setOpenModalAddAdress(true)}>
                    <span className="text-xl">+</span> Tambah Alamat Baru
                </button>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Alamat</h3>
                <div className="space-y-4">
                    {addresses.map(address => (
                        <div key={address.id} className="border-t pt-4 flex flex-col md:flex-row gap-4">
                            <div className="flex-grow space-y-1 text-sm text-gray-700">
                                <div className="flex items-baseline">
                                    <span className="font-semibold text-gray-800">{address.name_receiver}</span>
                                    <div className="w-px h-4 bg-gray-300 mx-3"></div>
                                    <span>{address.number_receiver}</span>
                                </div>
                                <p>{address.full_address}</p>
                                <p>{`${address?.cities}, ${address?.provinces}, ${address?.postal_codes}`}</p>
                                <div className="flex gap-2 mt-1">
                                    {address.is_primary && <span className="text-red-500 border border-red-500 text-xs px-2 py-0.5 rounded-sm">Utama</span>}
                                    <span className="text-gray-500 border border-gray-300 text-xs px-2 py-0.5 rounded-sm">{address?.label}</span>
                                </div>
                            </div>
                            <div className="flex-shrink-0 flex flex-col items-end gap-2">
                                <div className="flex gap-4">
                                    <button className="text-blue-600 text-sm hover:underline" onClick={() => {
                                        setDataAddress(address)
                                        setOpenModalAddAdress(true)
                                    }}>Ubah</button>
                                    {!address.is_primary && <button className="text-blue-600 text-sm hover:underline hidden md:block" onClick={() => setOpenDelete(address?.id || 0)}>Hapus</button>}
                                </div>
                                <button className="border border-gray-300 rounded px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition" onClick={() => handlePrimary(address?.id)}>Atur sebagai utama</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {openModalAddAddress && <AddAddressModal setOpenModalAddAdress={setOpenModalAddAdress} handleAdd={handleAdd} editData={dataAddress} openModalAddAddress={openModalAddAddress} setOpenDelete={setOpenDelete} />}
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