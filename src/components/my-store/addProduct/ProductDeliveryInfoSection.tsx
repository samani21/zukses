import React, { useEffect, useState } from 'react';
import { RadioGroup } from './FormInputs';
import { TipKey } from './tipsStore';
import { Modal } from 'components/Modal';
import { MapPin } from 'lucide-react';
import { ShopData } from '../ShopProfileContext';
import Get from 'services/api/Get';
import { Response } from 'services/api/types';
import Loading from 'components/Loading';
import { ChevronUp, ChevronDown } from 'lucide-react';
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
    const [listAddres, setListAddress] = useState<Address[]>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const [couriers, setCouriers] = useState<Courier[]>([]);
    const [openDetailIds, setOpenDetailIds] = useState<string[]>(couriers.map(c => c.id!).filter(Boolean));
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
            <div>
                {isProductPreOrder == '1' && (
                    <>
                        <p className='text-[#333333] text-[14px]'>Kirimkan produk dalam 2 hari (tidak termasuk hari Sabtu, Minggu, libur nasional dan non-operasional jasa kirim).</p>
                        <div className="flex flex-col sm:flex-row sm:space-x-3 items-start sm:items-center mb-4 mt-2">
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

            <section className='border border-[#DCDCDC] tracking-[-0.02em] p-4'>
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
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={"Ubah Alamat"}>
                <div className='space-y-4 max-h-75 overflow-y-auto no-scrollbar'>
                    {listAddres.map(address => (
                        <div key={address.id} className="bg-[#FFFFFF] border border-[#DCDCDC] shadow-[1px_1px_1px_rgba(0,0,0,0.08)] p-6 flex flex-col md:flex-row gap-4 rounded-[5px] cursor-pointer" onClick={() => {
                            setDataAddress(address)
                            setShowModal(false)
                        }}>
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
                        </div>
                    ))}
                </div>
                {loading && <Loading />}
            </Modal>
        </div >
    );
};

export default ProductDeliveryInfoSection;