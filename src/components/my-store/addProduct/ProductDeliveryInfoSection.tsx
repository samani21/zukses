import React, { useEffect, useState } from 'react';
import { RadioGroup } from './FormInputs';
import { TipKey } from './tipsStore';
import { MapPin, X } from 'lucide-react';
import { ShopData } from '../ShopProfileContext';
import Get from 'services/api/Get';
import { Response } from 'services/api/types';
import Loading from 'components/Loading';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { ModalClean } from 'components/ModalClean';
import AddAddressShopModal from '../address/AddAddressShopModal';
import Post from 'services/api/Post';
import { AxiosError } from 'axios';
import Snackbar from 'components/Snackbar';
interface Address {
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
interface Services {
    id?: number;
    courier_id?: string;
    is_active?: string;
    code?: string;
    name?: string;
}
interface Courier {
    id?: string;
    logo?: string;
    name?: string;
    services?: Services[];
}
interface ProductDeliveryInfoSectionProps {
    setTipKey: (key: TipKey) => void;
    isHazardous: string;
    setIsHazardous: (val: string) => void;
    isCodEnabled: string;
    setIsCodEnabled: (val: string) => void;
    isProductPreOrder: string;
    setIsProductPreOrder: (val: string) => void;
    sectionRefs: React.RefObject<HTMLDivElement | null>;
    shopProfil?: ShopData | null;
}

const ProductDeliveryInfoSection = (props: ProductDeliveryInfoSectionProps) => {
    const {
        setTipKey, isHazardous, setIsHazardous, isProductPreOrder, setIsProductPreOrder, sectionRefs, shopProfil
    } = props;
    const [showModal, setShowModal] = useState(false);
    const [dataAddress, setDataAddress] = useState<Address | null>(null);
    const [dataEditAddress, setDataEditAddress] = useState<Address | null>(null);
    const [listAddres, setListAddress] = useState<Address[]>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const [couriers, setCouriers] = useState<Courier[]>([]);
    const [openDetailIds, setOpenDetailIds] = useState<string[]>(couriers.map(c => c.id!).filter(Boolean));
    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [openDelete, setOpenDelete] = useState<number>(0);
    console.log(openDelete)
    const [openModalAddAddress, setOpenModalAddAdress] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<{
        message: string;
        type?: 'success' | 'error' | 'info';
        isOpen: boolean;
    }>({ message: '', type: 'info', isOpen: false });
    useEffect(() => {
        if (shopProfil?.address) {
            getShopAddress()
            setDataAddress(shopProfil?.address)
            getCourier()
        }
    }, [shopProfil])
    const getCourier = async () => {
        // setLoading(true);
        const res = await Get<Response>('zukses', `courier-service/list`);
        console.log('res', res)
        if (res?.status === 'success' && Array.isArray(res.data)) {
            const data = res?.data as Courier[];
            // setProducts(data);
            setCouriers(data);
        } else {
            console.warn('Produk tidak ditemukan atau gagal diambil');

        }
        setLoading(false);
    };

    const getShopAddress = async () => {
        if (!shopProfil?.id) return;
        setLoading(true);
        const res = await Get<Response>('zukses', `shop/address/${shopProfil?.id}`);
        setLoading(false);

        console.log('data', res)
        if (res?.status === 'success' && Array.isArray(res.data)) {
            const data = res.data as Address[];
            setListAddress(data);
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
                    setOpenModalAddAdress(false)
                    getShopAddress()
                }
            } else {
                const res = await Post<Response>('zukses', `shop/address/create/${shopProfil?.id}`, formData);
                setLoading(false);

                if (res?.data?.status === 'success') {
                    setOpenModalAddAdress(false)
                    getShopAddress()
                }
            }
        } catch (err) {
            setLoading(false);
            const error = err as AxiosError<{ message?: string }>;
            setSnackbar({ message: error.response?.data?.message || 'Terjadi kesalahan', type: 'error', isOpen: true });
        }
    };

    return (
        <div id="informasi-pengiriman-section" ref={sectionRefs} className="mb-6 space-y-6 border border-[#DCDCDC] py-6 rounded-[5px] px-8">
            <h1 className="font-bold text-[20px] text-[#483AA0] mb-4">Informasi Pengiriman</h1>
            <div onMouseEnter={() => setTipKey('dangerousGoods')} onMouseLeave={() => setTipKey('default')}>
                <RadioGroup
                    label="Produk Berbahaya?"
                    name="dangerous"
                    options={['Tidak', 'Mengandung Baterai / Magnet / Cairan / Bahan Mudah Terbakar']}
                    defaultValue={isHazardous === '1' ? 'Mengandung Baterai / Magnet / Cairan / Bahan Mudah Terbakar' : 'Tidak'}
                    onChange={(value) => setIsHazardous(value === 'Tidak' ? '0' : '1')}
                />
            </div>
            <div onMouseEnter={() => setTipKey('preorder')} onMouseLeave={() => setTipKey('default')}>
                <RadioGroup label="Pre Order" name="preorder" options={['Tidak', 'Ya']} defaultValue={isProductPreOrder === '1' ? 'Ya' : 'Tidak'} onChange={(value) => setIsProductPreOrder(value === 'Ya' ? '1' : '0')} />
            </div>
            <p className='text-[#333333] text-[14px] -mt-4'>Kirimkan produk dalam 2 hari (tidak termasuk hari Sabtu, Minggu, libur nasional dan non-operasional jasa kirim).</p>
            <div className='-mt-4'>
                {isProductPreOrder == '1' && (
                    <>
                        <div className="flex flex-col sm:flex-row sm:space-x-3 items-start sm:items-center mb-4">
                            <label htmlFor="preorderDuration" className="text-[#333333] text-[14px]">
                                Saya memerlukan
                            </label>
                            <input
                                type="number"
                                id="preorderDuration"
                                name="preorderDuration"
                                min={3}
                                max={30}
                                defaultValue={5}
                                className="no-spinner border border-[#AAAAAA] w-[57px] h-[40px] text-center rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />

                            <span className="text-[#333333] text-[14px]">
                                hari kerja untuk mengemas paket (atur durasi antara 3-30 hari)
                            </span>
                        </div>
                    </>
                )}
            </div>

            <section className='border border-[#DCDCDC] tracking-[-0.02em] p-4 mt-8'>
                <div className='flex gap-2 items-center'>
                    <MapPin size={24} className='text-[#7952B3]' />
                    <h3 className='text-[#7952B3] text-[20px] font-semibold'>Alamat Pickup</h3>
                </div>
                <div className='pl-8 mt-2 flex items-start justify-between'>
                    <p className='text-[#333333] text-[16px]'>{`${dataAddress?.full_address}, ${dataAddress?.subdistricts}, ${dataAddress?.cities}, ${dataAddress?.provinces}, ID, ${dataAddress?.postal_codes}`}</p>
                    <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="text-purple-600 text-sm font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        Ubah
                    </button>
                </div>
                {
                    dataAddress?.is_primary ?
                        <p className='pl-8 text-[16px] font-bold text-[#7952B3] mt-2'>
                            Alamat Utama
                        </p> : ""
                }
            </section>
            <section>
                <label className="text-[#333333] font-bold text-[14px]">
                    Wajib memilih jasa kirim
                    <span className='bg-[#FACACA] p-1 px-3 rounded-full text-[#C71616] text-[10px] ml-3 tracking-[0]'>Wajib</span>
                </label>
                <div className='border border-[#DCDCDC] rounded-[5px] mt-4'>
                    <p className='text-[16px] font-bold tracking-[-0.02em] py-4 px-6 '>Pilih Jasa Kirim</p>
                    <div className='bg-[#EEFFEE] py-2 px-8 flex justify-between items-center mb-4'>
                        <p className='text-[#52357B] font-bold text-[15px]' style={{
                            lineHeight: "108%"
                        }}>Kurir Toko</p>
                        <div>
                            <input type="checkbox" className="toggle-checkbox" />
                        </div>
                    </div>
                    <fieldset className="space-y-4 rounded-[5px]">
                        {couriers.map((courier) => {
                            const isOpen = openDetailIds.includes(courier.id!);
                            return (
                                <details
                                    key={courier.id}
                                    open
                                    className="bg-[#EEFFEE]"
                                    onToggle={(e) => {
                                        const open = (e.target as HTMLDetailsElement).open;
                                        if (!courier.id) return;

                                        setOpenDetailIds((prev) =>
                                            open ? [...prev, courier.id!] : prev.filter((id) => id !== courier.id)
                                        );
                                    }}
                                >
                                    <summary className="py-2 px-4 sm:px-8 flex justify-between items-center cursor-pointer select-none">

                                        <span className="flex items-center space-x-2 font-semibold text-sm">
                                            {isOpen ? (
                                                <ChevronUp className="w-4 h-4 text-gray-600" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 text-gray-600" />
                                            )}
                                            {courier.logo && (
                                                <img
                                                    src={courier.logo}
                                                    alt={`${courier.name} Logo`}
                                                    className="w-[70px] h-[35px] object-contain"
                                                />
                                            )}
                                            <span>{courier.name}</span>
                                        </span>

                                        <div className="flex items-center space-x-3">
                                            <input type="checkbox" className="toggle-checkbox" />
                                        </div>
                                    </summary>

                                    {courier.services && (
                                        <ul className="pl-6 pb-3 text-gray-700 text-sm space-y-1 bg-white">
                                            {courier.services.map((srv, i) => (
                                                <li key={i} className='pl-10'>{srv?.name}</li>
                                            ))}
                                        </ul>
                                    )}
                                </details>
                            );
                        })}

                    </fieldset>
                </div>
            </section>
            <ModalClean isOpen={showModal} onClose={() => setShowModal(false)}>
                <div className=''>
                    <div className="flex justify-between items-center p-6">
                        <h3 className="text-[20px] text-[#333333] font-bold">Ubah Alamat</h3>
                        <button onClick={() => setShowModal(false)} className="text-[#555555] hover:text-gray-800"><X size={20} /></button>
                    </div>
                    <div className="space-y-3">
                        <div className='flex justify-end px-4'>
                            <button className="text-center bg-[#238744] py-3 px-4 text-[14px] font-semibold text-white font-bold rounded-[10px] hover:bg-green-500 transition" onClick={() => {
                                setOpenModalAddAdress(true)
                                setIsAdd(true);
                            }}>
                                Tambah Alamat
                            </button>
                        </div>
                        <div className='max-h-[60vh] overflow-y-auto no-scrollbar'>
                            {listAddres.map(address => (
                                <div key={address.id} className="border-b border-[#BBBBBB] p-6 py-4">
                                    <div className="flex items-start">
                                        {/* Input radio dengan ID */}
                                        <input
                                            id={`address-${address.id}`}
                                            type="radio"
                                            name="address"
                                            className="mt-1 mr-4 accent-[#660077] w-[20px] h-[20px]"
                                            checked={dataAddress?.id === address.id}
                                            onChange={() => setDataAddress(address)}
                                        />

                                        {/* Label terkait input */}
                                        <label
                                            htmlFor={`address-${address.id}`}
                                            className="flex-1 space-y-3 cursor-pointer"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className='flex'>
                                                    <p className="font-bold text-[#333333] text-[15px] line-clamp-1 w-[140px]">{address.name_shop}</p>
                                                    <p className=''>{address.number_shop}</p>
                                                </div>
                                            </div>
                                            <p className='mt-[-5px] text-[14px]'>{`${address?.subdistricts}, ${address?.cities}, ${address?.provinces}, ID, ${address?.postal_codes}`}</p>
                                        </label>

                                        {/* Tombol ubah di luar label, aman */}
                                        <div
                                            className="ml-4 text-[#F77000] w-1/8 font-bold text-[15px] text-end text-sm hover:underline cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation(); // opsional, hanya berjaga-jaga
                                                setDataEditAddress(address);
                                                setOpenModalAddAdress(true);
                                            }}
                                        >
                                            Ubah
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                    <div className="flex justify-end items-center p-4 space-x-3">
                        <button onClick={() => setShowModal(false)} className="px-6 py-2 text-[#333333] text-[14px] font-semibold rounded-[10px] border border-[#AAAAAA] hover:bg-gray-100">Batalkan</button>
                        <button onClick={() => setShowModal(false)} className="px-6 py-2 bg-[#4A52B2] text-[14px] font-semibold text-white rounded-md hover:bg-purple-700">Terapkan</button>
                    </div>

                </div>

            </ModalClean>
            {snackbar.isOpen && (
                <Snackbar
                    message={snackbar.message}
                    type={snackbar.type}
                    isOpen={snackbar.isOpen}
                    onClose={() => setSnackbar((prev) => ({ ...prev, isOpen: false }))}
                />
            )}
            {openModalAddAddress &&
                <AddAddressShopModal setOpenModalAddAdress={setOpenModalAddAdress} handleAdd={handleAdd} editData={dataEditAddress} openModalAddAddress={openModalAddAddress} setOpenDelete={setOpenDelete} isAdd={isAdd} setIsAdd={setIsAdd} />}
            {loading && <Loading />}
        </div >
    );
};

export default ProductDeliveryInfoSection;