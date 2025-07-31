'use client';

import React, { useState, FC, ReactNode, useEffect } from 'react';
import { Square } from 'lucide-react';
import { ShopData } from '../ShopProfileContext';
import Post from 'services/api/Post';
import { Response } from 'services/api/types';
import Loading from 'components/Loading';
import { AxiosError } from 'axios';
import Get from 'services/api/Get';
import Snackbar from 'components/Snackbar';
import StoreCourierConfig from './StoreCourierConfig';

// --- Definisi Tipe Data (TypeScript) ---
interface DistanceTier {
    from: number | string;
    to: number | string;
    price: number | string;
}

// Mengembalikan struktur WeightTier ke bentuk semula
interface WeightTier {
    from: number | string;
    price: number | string;
}

type Service = {
    id: string;
    name: string;
};

interface Courier {
    id: string;
    name: string;
    logo: string;
    services: Service[];
}

// --- Komponen Ikon Centang Kustom ---
const CustomCheckIcon: FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`flex items-center justify-center w-[21px]h-[21px] bg-[#6871F1] ${className}`}>
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    </div>
);

// --- Props untuk Komponen Checkbox Kustom ---
interface CustomCheckboxProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: () => void;
    children?: ReactNode;
    logo?: string;
    className?: string;
}

interface ShippingSettings {
    is_store_courier_active: boolean;
    distance_tiers: DistanceTier[];
    weight_tiers: WeightTier[];
    enabled_service_ids: number[];
    max_distance: number,
    max_weight: number
}


const CustomCheckboxParent: FC<CustomCheckboxProps> = ({ id, label, checked, onChange, logo, className = '' }) => (
    <div className={`flex items-start ${className}`}>
        <input type="checkbox" id={id} checked={checked} onChange={onChange} className="hidden" />
        <label htmlFor={id} className="cursor-pointer flex items-center">
            {checked ? <CustomCheckIcon /> : <Square className="w-5 h-5 text-gray-300" />}
            <div className="ml-3 flex items-center">
                {logo && (
                    <img
                        src={logo}
                        alt={`${label} logo`}
                        width={84}
                        className=" mr-2 object-contain"
                    // Memberi background pada logo J&T agar terlihat jelas

                    />
                )}
                <span className="font-bold text-[18px] text-[#52357B]" style={{
                    lineHeight: "108%"
                }}>{label}</span>
            </div>
        </label>
    </div>
);
const CustomCheckboxChild: FC<CustomCheckboxProps> = ({ id, label, checked, onChange, className = '' }) => (
    <div className={`flex items-start ${className}`}>
        <input type="checkbox" id={id} checked={checked} onChange={onChange} className="hidden" />
        <label htmlFor={id} className="cursor-pointer flex items-center">
            {checked ? <CustomCheckIcon /> : <Square className="w-5 h-5 text-gray-300" />}
            <div className="ml-3 flex items-center">

                <span className="text-[17 px] text-[#333333]">{label}</span>
            </div>
        </label>
    </div>
);


// --- Komponen Utama ---
type Props = {
    shopProfil: ShopData | null;
};

export default function CourierSettingsPage({ shopProfil }: Props) {
    const [view, setView] = useState<'main' | 'config'>('main');
    const [isStoreCourierActive, setIsStoreCourierActive] = useState(true);
    const [loading, setLoading] = useState<boolean>(false)
    const [maxDistance, setMaxDistance] = useState(0);
    const [distanceTiers, setDistanceTiers] = useState<DistanceTier[]>([]);
    const [maxWeight, setMaxWeight] = useState(0);
    const [weightTiers, setWeightTiers] = useState<WeightTier[]>([]);
    const [courierServices, setCourierServices] = useState<Courier[]>([])
    const [selectedServices, setSelectedServices] = useState<{ [key: string]: boolean }>(() => {
        const allServices: { [key: string]: boolean } = {};
        courierServices.forEach(c => c.services.forEach(s => { allServices[`${c.id}-${s}`] = true; }));
        return allServices;
    });
    const [snackbar, setSnackbar] = useState<{
        message: string;
        type?: 'success' | 'error' | 'info';
        isOpen: boolean;
    }>({ message: '', type: 'info', isOpen: false });

    console.log('selectedServices', selectedServices)
    useEffect(() => {
        getCourier()
        fetchData()
    }, [shopProfil]);

    const getCourier = async () => {
        // setLoading(true);
        const res = await Get<Response>('zukses', `courier-service`);
        if (res?.status === 'success' && Array.isArray(res.data)) {
            const data = res?.data as Courier[];
            // setProducts(data);
            setCourierServices(data);
        } else {
            console.warn('Produk tidak ditemukan atau gagal diambil');

        }
        // setLoading(false);
    };

    const fetchData = async () => {
        setLoading(true);
        const res = await Get<Response>('zukses', `shop/shipping-settings`);
        setLoading(false);

        if (res?.status === 'success' && res.data) {
            const data = res.data as unknown as ShippingSettings;
            console.log('data', data)
            setIsStoreCourierActive(data.is_store_courier_active);
            setDistanceTiers(data.distance_tiers || []);
            setWeightTiers(data.weight_tiers || []);
            setMaxDistance(data?.max_distance)
            setMaxWeight(data?.max_weight)

            // courierServices.forEach(courier => {
            //     courier.services.forEach(service => {
            //         const key = `${courier.id}-${service.name}`;
            //         initialSelected[key] = enabledIds.has(service.id);
            //     });
            // });
            const couriers = courierServices;
            const result: Record<string, boolean> = {};

            data?.enabled_service_ids.forEach(id => {
                for (const courier of couriers) {
                    const found = courier.services.find(service => String(service.id) === String(id));

                    if (found) {
                        const key = `${courier.id}-${found.id}`;
                        result[key] = true;
                        break;
                    }
                }
            });



            setSelectedServices(result);
        } else {
        }
    };



    const handleServiceChange = (key: string) => {
        setSelectedServices(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };
    const handleCourierChange = (courier: Courier) => {
        const updated = { ...selectedServices };
        const allServiceKeys = courier.services.map(service => `${courier.id}-${service.id}`);
        const isAllSelected = allServiceKeys.every(key => selectedServices[key]);

        allServiceKeys.forEach(key => {
            updated[key] = !isAllSelected; // toggle: jika semua sudah aktif, maka off-kan
        });

        setSelectedServices(updated);
    };

    const formatPrice = (price: number | string) => {
        if (typeof price === 'string' && price.trim() === '') return 'Rp-';
        return `Rp${Number(price).toLocaleString('id-ID')}`;
    }

    if (view === 'config') {
        return (
            <div className="">
                <div className="">
                    <StoreCourierConfig
                        maxDistance={maxDistance}
                        setMaxDistance={setMaxDistance}
                        distanceTiers={distanceTiers}
                        setDistanceTiers={setDistanceTiers}
                        maxWeight={maxWeight}
                        setMaxWeight={setMaxWeight}
                        weightTiers={weightTiers}
                        setWeightTiers={setWeightTiers}
                        onCancel={() => setView('main')}
                    />
                </div>
            </div>
        );
    }

    const handleSave = async () => {
        // 1. Menyusun data layanan kurir pihak ketiga yang aktif
        // Perubahan ada di baris ini:
        const enabledCourierServices: { [key: string]: string[] } = {};
        console.log('enabledCourierServices', enabledCourierServices)
        for (const key in selectedServices) {
            if (selectedServices[key]) {
                const [courierId, serviceName] = key.split('-');
                if (!enabledCourierServices[courierId]) {
                    enabledCourierServices[courierId] = [];
                }
                enabledCourierServices[courierId].push(serviceName);
            }
        }

        // 2. Menyusun keseluruhan payload
        const payload = {
            isStoreCourierActive: isStoreCourierActive,
            storeCourierSettings: {
                distance: {
                    max: maxDistance,
                    tiers: distanceTiers,
                },
                weight: {
                    max: maxWeight,
                    tiers: weightTiers,
                }
            },
            enabledCourierServices: enabledCourierServices,
        };
        setLoading(true);
        try {
            const res = await Post<Response>(
                'zukses',
                `shop/shipping-settings`,
                payload
            );
            setLoading(false);

            if (res?.data?.status === 'success') {
                setSnackbar({
                    message: 'Data berhasil dikirim!',
                    type: 'success',
                    isOpen: true,
                });
                setTimeout(() => window.location.reload(), 1500);
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
            const error = err as AxiosError<{ message?: string }>;
            setSnackbar({
                message: error.response?.data?.message || 'Terjadi kesalahan',
                type: 'error',
                isOpen: true,
            });
        }
    };
    return (
        <div className="space-y-6">
            <div className="bg-white shadow-[1px_1px_10px_rgba(0,0,0,0.08)] rounded-[5px] border border-[#DFDFDF]">
                <div className="flex justify-between items-center border-b border-[#BBBBBBCC]">
                    <label htmlFor="store-courier-toggle" className="flex items-center cursor-pointerp py-6 px-12">
                        <input id="store-courier-toggle" type="checkbox" checked={isStoreCourierActive} onChange={() => setIsStoreCourierActive(!isStoreCourierActive)} className="hidden" />
                        {isStoreCourierActive ? <CustomCheckIcon /> : <Square className="w-5 h-5 text-gray-300" />}
                        <span className="ml-3 text-[17px] font-bold text-[#333333]">Aktifkan Jasa Kurir Toko</span>
                    </label>
                    <button onClick={() => setView('config')} className="text-[#4A52B2] font-bold text-[15px] hover:underline px-12">Atur Kurir Toko</button>
                </div>
                <div className={`py-6 px-12 text-sm transition-opacity duration-300 ${isStoreCourierActive ? 'opacity-100' : 'opacity-50'}`}>
                    <div className="flex flex-col md:flex-row mb-6">
                        <div className="w-full lg:w-1/4  mb-2 md:mb-0">
                            <h3 className="font-bold text-[17px] text-[#333333]" style={{
                                lineHeight: "108%"
                            }}>Pengaturan Jarak</h3>
                            <p className="text-[#333333] text-[15px]">Batas Jarak Pengiriman : {maxDistance} Km</p>
                        </div>
                        <div className="w-full md:w-2/3">
                            {distanceTiers.map((tier, index) => (
                                <div key={index} className="flex mt-1">
                                    <span className="w-1/2 md:w-1/2 text-[#333333] text-[16px]">{tier.from} km sampai {tier.to} km</span>
                                    <span className="w-1/2 text-[#333333] font-medium text-[18px]" style={{
                                        lineHeight: "115%"
                                    }}>{formatPrice(tier.price)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row">
                        <div className="w-full lg:w-1/4  mb-2 md:mb-0">
                            <h3 className="font-bold text-[17px] text-[#333333]" style={{
                                lineHeight: "108%"
                            }}>Pengaturan Berat</h3>
                            <p className="text-[#333333] text-[15px]">Batas Berat Pengiriman : {maxWeight} kg</p>
                        </div>
                        <div className="w-full md:w-2/3">
                            {weightTiers.map((tier, index) => (
                                <div key={index} className="flex mt-1">
                                    <span className="w-1/2 md:w-1/2 text-[#333333] text-[16px]">Lebih dari {tier.from} kg</span>
                                    <span className="w-1/2 text-[#333333] font-medium text-[18px]" style={{
                                        lineHeight: "115%"
                                    }}>{formatPrice(tier.price)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Kartu Pilihan Jasa Pengiriman */}
            <div className="bg-white shadow-[1px_1px_10px_rgba(0,0,0,0.08)] rounded-[5px] border border-[#DFDFDF]">
                <div className='px-12 py-6 border-b border-[#BBBBBBCC]/80'>
                    <h2 className="text-[17px] font-bold text-[#333333]">Pilih jasa pengiriman</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-12 py-6">
                    {courierServices.map((courier) => {
                        const allServiceKeys = courier.services.map(service => `${courier.id}-${service.id}`);
                        const isAllSelected = allServiceKeys.every(key => selectedServices[key]);

                        return (
                            <div key={courier.id}>
                                <CustomCheckboxParent
                                    id={`courier-${courier.id}`}
                                    label={courier.name}
                                    logo={courier.logo}
                                    checked={isAllSelected}
                                    onChange={() => handleCourierChange(courier)}
                                    className="mb-3"
                                />
                                <div className="pl-8 mt-2 space-y-2 ml-2">
                                    {courier.services.map((service) => {
                                        const serviceKey = `${courier.id}-${service.id}`;
                                        return (
                                            <CustomCheckboxChild
                                                key={serviceKey}
                                                id={serviceKey}
                                                label={service.name}
                                                checked={!!selectedServices[serviceKey]}
                                                onChange={() => handleServiceChange(serviceKey)}
                                                className="mb-2"
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>

            {/* Tombol Aksi Utama */}
            {
                shopProfil &&
                <div className="flex justify-end mt-8 bg-white shadow-[1px_1px_10px_rgba(0,0,0,0.08)] rounded-[5px] border border-[#DFDFDF] px-12 py-6 mb-12">
                    <button className="bg-[#52357B] h-[40px] text-white font-bold py-2 px-8 rounded-[5px] tracking-[-0.03em] text-[16px] hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors" onClick={handleSave} >
                        Simpan Perubahan
                    </button>
                </div>
            }
            {
                loading && <Loading />
            }
            {
                snackbar.isOpen && (
                    <Snackbar
                        message={snackbar.message}
                        type={snackbar.type}
                        isOpen={snackbar.isOpen}
                        onClose={() => setSnackbar((prev) => ({ ...prev, isOpen: false }))}
                    />
                )
            }
        </div>
    );
}
