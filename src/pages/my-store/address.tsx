import MyStoreLayout from "pages/layouts/MyStoreLayout";
import { useShopProfile } from "components/my-store/ShopProfileContext";
import { useEffect, useState } from "react";
import Get from "services/api/Get";
import { Response } from "services/api/types";
import Post from "services/api/Post";
import { AxiosError } from "axios";
import Delete from "services/api/Delete";
import { ModalContainer } from "components/Profile/ModalContainer";
import ModalDelete from "components/userProfile/ModalDelete";
import Snackbar from "components/Snackbar";
import Loading from "components/Loading";
import AddAddressShopModal from "components/my-store/address/AddAddressShopModal";

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
    name_shop?: string;
    number_shop?: string;
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


function PageContent() {
    const shopProfil = useShopProfile();
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

    useEffect(() => {
        getShopAddress()
    }, [shopProfil]);


    const getShopAddress = async () => {
        if (!shopProfil?.id) return;
        setLoading(true);
        const res = await Get<Response>('zukses', `shop/address/${shopProfil?.id}`);
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
            formData.append('name_shop', data.name);
            formData.append('number_shop', data.phone);
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
                const res = await Post<Response>('zukses', `shop/address/${id}/edit`, formData);
                setLoading(false);

                if (res?.data?.status === 'success') {
                    getShopAddress(); // refresh address list
                    setOpenModalAddAdress(false)
                }
            } else {
                const res = await Post<Response>('zukses', `shop/address/create/${shopProfil?.id}`, formData);
                setLoading(false);

                if (res?.data?.status === 'success') {
                    getShopAddress(); // refresh address list
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
            const res = await Post<Response>('zukses', `shop/address/${id}/edit-status`, formData);
            setLoading(false);

            if (res?.data?.status === 'success') {
                getShopAddress(); // refresh address list
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
            const res = await Delete<Response>('zukses', `shop/address/${id}/delete`);
            setLoading(false);

            if (res?.data?.status === 'success') {
                getShopAddress(); // refresh address list
                setOpenDelete(0)
            }
        } catch (err) {
            setLoading(false);
            const error = err as AxiosError<{ message?: string }>;
            setSnackbar({ message: error.response?.data?.message || 'Terjadi kesalahan', type: 'error', isOpen: true });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
            <main className="">
                {/* Header */}

                <div className="space-y-2 md:space-y-0 md:flex justify-between items-center mb-6 border border-[#D2D4D8] bg-[#F3F5F7] p-4 rounded-[8px]">
                    <div>
                        <h1 className="text-[28px] text-[#333333] font-[800] tracking-[-0.02em]">Alamat Toko</h1>
                        <p className="text-[#444444] mt-4 text-[14px]" style={{
                            lineHeight: "107%"
                        }}>
                            Biar pembeli tahu kamu di mana.<br /> Lengkapi alamat tokomu untuk pengiriman dan kepercayaan pelanggan.   </p>
                    </div>
                    {
                        shopProfil && <button className="bg-[#563D7C] text-white font-semibold text-[14px] rounded-[5px] px-4 py-2 w-[150px] h-[40px]" onClick={() => {
                            setOpenModalAddAdress(true)
                            setIsAdd(true);
                        }}>
                            Tambah Alamat
                        </button>
                    }
                </div>
                <div className="w-full">
                    <div>
                        <div className="space-y-4 mt-5">
                            {addresses.map(address => (
                                <div key={address.id} className="bg-[#FFFFFF] border border-[#DCDCDC] shadow-[1px_1px_1px_rgba(0,0,0,0.08)] p-6 flex flex-col md:flex-row gap-4 rounded-[5px]">
                                    <div className="flex-grow text-[#333333]">
                                        <div className="flex items-baseline">
                                            <span className="font-bold text-[16px] mr-1">{address.name_shop}</span>
                                            <span className='text-[16px]'> | {address.number_shop}</span>
                                        </div>
                                        <p className='mt-2 text-[14px]'>{address.full_address}</p>
                                        <p className='mt-[-5px] text-[14px]'>{`${address?.subdistricts},${address?.cities}, ${address?.provinces}, ID, ${address?.postal_codes}`}</p>
                                        <div className="flex gap-">
                                            {address.is_primary ? <span className="text-[#E67514] font-bold text-[14px] rounded-sm">Alamat Utama</span> : ''}
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
                                            <button className="border border-[#CCCCCC] h-[40px] rounded-[5px] px-4 py-1.5 text-[14px] font-semibold text-[#333333]" onClick={() => handlePrimary(address?.id)}>Atur sebagai utama</button>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {openModalAddAddress && <AddAddressShopModal setOpenModalAddAdress={setOpenModalAddAdress} handleAdd={handleAdd} editData={dataAddress} openModalAddAddress={openModalAddAddress} setOpenDelete={setOpenDelete} isAdd={isAdd} setIsAdd={setIsAdd} />}
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
            </main>
        </div>
    );
}

export default function AddressPage() {
    return (
        <MyStoreLayout>
            <PageContent />
        </MyStoreLayout>
    );
}
