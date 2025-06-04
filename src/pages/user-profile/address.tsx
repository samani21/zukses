// pages/address.tsx
import React, { useEffect, useState } from 'react';
import UserProfile from '.';
import {
    Action, AddAddressMobile, Address, AddressComponent, AddressContent,
    AddressTop, ButtonAddAddress, ContentAddress, HeaderAddress,
    IconAddAddress, InfoUser, ListAddressContainer, ListAddressContainerMobile, ModalAddAdressDescktop, ModalAddAdressMobile, SetAddress,
    StatusAddress, Title, TypographAddress
} from 'components/Profile/AddressComponent';
import { ModalContainer } from 'components/Profile/ModalContainer';
import ModalAddAddress from './Components/ModalAddAddress';
import Post from 'services/api/Post';
import { Response } from 'services/api/types';
import Snackbar from 'components/Snackbar';
import Loading from 'components/Loading';
import { AxiosError } from 'axios';
import { getUserInfo } from 'services/api/redux/action/AuthAction';
import Get from 'services/api/Get';
import ModalDelete from './Components/ModalDelete';
import Delete from 'services/api/Delete';

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

function AddressPage() {
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

    useEffect(() => {
        const currentUser = getUserInfo();
        if (currentUser) {
            setUser(currentUser);
            getUserAddress(currentUser.id);
        }
    }, []);

    const getUserAddress = async (userId?: number) => {
        if (!userId) return;
        setLoading(true);
        const res = await Get<Response>('zukses', `user-address/${userId}`);
        setLoading(false);

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
        <UserProfile mode="address">
            <AddressComponent>
                <HeaderAddress>
                    <Title>Alamat Saya</Title>
                    <ButtonAddAddress onClick={() => setOpenModalAddAdress(true)}>
                        + Tambah Alamat Baru
                    </ButtonAddAddress>
                </HeaderAddress>
                <ContentAddress>
                    <p className='mobile'>Alamat</p>
                    <ListAddressContainer>
                        {addresses.map((adrs, i) => (
                            <Address key={i}>
                                <AddressTop>
                                    <InfoUser>
                                        <b>{adrs?.name_receiver}</b>
                                        <p>{adrs?.number_receiver}</p>
                                    </InfoUser>
                                    <Action>
                                        <p onClick={() => {
                                            setDataAddress(adrs)
                                            setOpenModalAddAdress(true)
                                        }}>Ubah</p>
                                        {adrs?.is_primary === 0 && (
                                            <p onClick={() => setOpenDelete(adrs?.id || 0)}>Hapus</p>
                                        )}
                                    </Action>
                                </AddressTop>
                                <AddressContent>
                                    <TypographAddress>
                                        <p>{adrs?.full_address}</p>
                                        <p>{`${adrs?.cities}, ${adrs?.provinces}, ${adrs?.postal_codes}`}</p>
                                    </TypographAddress>
                                    {adrs?.is_primary === 0 ? <SetAddress onClick={() => handlePrimary(adrs?.id)}>
                                        Atur Sebagai Utama
                                    </SetAddress> :
                                        <SetAddress style={{ color: "#666666" }}>
                                            Atur Sebagai Utama
                                        </SetAddress>}
                                </AddressContent>

                                <StatusAddress>
                                    {adrs?.is_primary === 1 && (
                                        <span className='primary'>Utama</span>
                                    )}
                                    {adrs?.is_store === 1 && (
                                        <span className=''>Alamat Toko</span>
                                    )}
                                    <span className=''>{adrs?.label}</span>
                                </StatusAddress>
                            </Address>
                        ))}
                    </ListAddressContainer>
                    <ListAddressContainerMobile>
                        {addresses.map((adrs, i) => (
                            <Address key={i} onClick={() => {
                                setDataAddress(adrs)
                                setOpenModalAddAdress(true)
                            }}>
                                <AddressTop>
                                    <InfoUser>
                                        <b>{adrs?.name_receiver}</b>
                                        <p>{adrs?.number_receiver}</p>
                                    </InfoUser>
                                </AddressTop>
                                <AddressContent>
                                    <TypographAddress>
                                        <p>{adrs?.full_address}</p>
                                        <p>{`${adrs?.cities}, ${adrs?.provinces}, ${adrs?.postal_codes}`}</p>
                                    </TypographAddress>
                                </AddressContent>

                                <StatusAddress>
                                    {adrs?.is_primary === 1 && (
                                        <span className='primary'>Utama</span>
                                    )}
                                    {adrs?.is_store === 1 && (
                                        <span className=''>Alamat Toko</span>
                                    )}
                                    <span className=''>{adrs?.label}</span>
                                </StatusAddress>
                            </Address>
                        ))}
                    </ListAddressContainerMobile>
                    <AddAddressMobile onClick={() => setOpenModalAddAdress(true)}>
                        <IconAddAddress src='/icon/add-red.svg' />
                        Tambah Alamat Baru
                    </AddAddressMobile>
                </ContentAddress>
            </AddressComponent>
            <ModalAddAdressDescktop>
                <ModalContainer open={openModalAddAddress}>
                    <ModalAddAddress setOpenModalAddAdress={setOpenModalAddAdress} handleAdd={handleAdd} editData={dataAddress} openModalAddAddress={openModalAddAddress} />
                </ModalContainer>
            </ModalAddAdressDescktop>
            <ModalAddAdressMobile open={openModalAddAddress}>
                <ModalAddAddress setOpenModalAddAdress={setOpenModalAddAdress} handleAdd={handleAdd} editData={dataAddress} openModalAddAddress={openModalAddAddress} />
            </ModalAddAdressMobile>
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
        </UserProfile>
    );
}

export default AddressPage;