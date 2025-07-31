'use client';

import React, { useState, FC, ReactNode, useEffect } from 'react';
import { Square, PlusCircle, Trash2 } from 'lucide-react';
import { ShopData } from '../ShopProfileContext';
import Post from 'services/api/Post';
import { Response } from 'services/api/types';
import Loading from 'components/Loading';
import { AxiosError } from 'axios';
import Get from 'services/api/Get';
import Snackbar from 'components/Snackbar';

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



// --- Props untuk Komponen Konfigurasi Kurir Toko ---
interface StoreCourierConfigProps {
    maxDistance: number;
    setMaxDistance: (value: number) => void;
    distanceTiers: DistanceTier[];
    setDistanceTiers: (tiers: DistanceTier[]) => void;
    maxWeight: number;
    setMaxWeight: (value: number) => void;
    weightTiers: WeightTier[];
    setWeightTiers: (tiers: WeightTier[]) => void;
    onSave: () => void;
    onCancel: () => void;
}

const formatNumber = (num: number | string) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// const generateAutoDistanceTiers = (start: number, end: number): DistanceTier[] => {
//     if (start >= end) return [];
//     return [{
//         from: start,
//         to: end,
//         price: ''
//     }];
// };

// --- Komponen Modal/Halaman Konfigurasi Kurir Toko ---
const StoreCourierConfig: FC<StoreCourierConfigProps> = ({
    maxDistance, setMaxDistance, distanceTiers, setDistanceTiers,
    maxWeight, setMaxWeight, weightTiers, setWeightTiers,
    onSave, onCancel
}) => {
    const [distanceErrors, setDistanceErrors] = useState<{ to: boolean; price: boolean }[]>([]);
    const [weightErrors, setWeightErrors] = useState<{ from: boolean; price: boolean }[]>([]);

    useEffect(() => {
        if (maxDistance > 0 && distanceTiers.length === 0) {
            setDistanceTiers([{ from: 0, to: '', price: '' }]);
        } else if (maxDistance <= 0) {
            setDistanceTiers([]);
        }
    }, [maxDistance, distanceTiers.length, setDistanceTiers]);

    useEffect(() => {
        if (maxDistance > 0) {
            // Jika tidak ada tier, buat default 0 - maxDistance
            if (distanceTiers.length === 0) {
                setDistanceTiers([{ from: 0, to: maxDistance, price: '' }]);
            } else {
                // Koreksi tier terakhir jika maxDistance berubah
                const updated = distanceTiers.map((tier, i) => {
                    // const from = tier.from;
                    const to = i === distanceTiers.length - 1 ? maxDistance : tier.to;
                    return { ...tier, to };
                });
                setDistanceTiers(updated);
            }
        } else {
            setDistanceTiers([]);
        }
    }, [maxDistance]);



    const handleDistanceTierChange = (
        index: number,
        field: keyof DistanceTier,
        value: string
    ) => {
        const newTiers = [...distanceTiers];

        if (field === 'price') {
            const priceNumber = parseInt(value.replace(/\./g, ''), 10) || 0;
            newTiers[index] = { ...newTiers[index], price: priceNumber };
        } else if (field === 'to') {
            // Jangan validasi dulu, tunggu onBlur
            newTiers[index] = { ...newTiers[index], to: value };
        }

        setDistanceTiers(newTiers);
    };


    const handleDistanceToBlur = (index: number) => {
        const newTiers = [...distanceTiers];
        const tier = newTiers[index];

        const rawTo = tier.to;
        const fromVal = Number(tier.from);
        let toVal = Number(rawTo);

        if (rawTo === '' || isNaN(toVal) || toVal <= fromVal || toVal > maxDistance) {
            toVal = maxDistance;
        }

        tier.to = toVal;
        newTiers[index] = tier;

        const nextFrom = toVal + 1;

        // Hapus semua tier setelah index
        const trimmedTiers = newTiers.slice(0, index + 1);

        // Tambahkan 1 tier baru jika masih ada sisa
        if (nextFrom <= maxDistance) {
            trimmedTiers.push({
                from: nextFrom,
                to: maxDistance,
                price: ''
            });
        }

        setDistanceTiers(trimmedTiers);
    };


    const handleAddDistanceTier = () => {
        const lastTier = distanceTiers[distanceTiers.length - 1];
        const newFrom = lastTier && lastTier.to ? Number(lastTier.to) + 1 : 0;


        setDistanceTiers([
            ...distanceTiers,
            { from: newFrom, to: '', price: '' }
        ]);
    };
    useEffect(() => {
        if (distanceTiers.length > 1) {
            const lastIndex = distanceTiers.length - 1;
            const last = distanceTiers[lastIndex];

            // Cegah baris pertama auto terisi
            if (last.to === '') {
                const newTiers = [...distanceTiers];
                newTiers[lastIndex].to = maxDistance;
                setDistanceTiers(newTiers);
            }
        }
    }, [distanceTiers.length, maxDistance]);



    const handleRemoveDistanceTier = (index: number) => {
        setDistanceTiers(distanceTiers.filter((_, i) => i !== index));
    };

    // --- LOGIKA UNTUK BERAT DIKEMBALIKAN DAN DIPERBAIKI ---
    const handleWeightTierChange = (
        index: number,
        field: keyof WeightTier,
        value: string
    ) => {
        const newTiers = [...weightTiers];

        let processedValue: number = 0;

        if (field === 'price') {
            // Hapus titik ribuan → jadi angka asli
            processedValue = parseInt(value.replace(/\./g, ''), 10) || 0;
        } else if (field === 'from') {
            // Validasi angka untuk 'from'
            let numericValue = Number(value);
            if (numericValue < 0) numericValue = 0;
            if (maxWeight > 0 && numericValue > maxWeight) {
                numericValue = maxWeight;
            }
            processedValue = numericValue;
        } else {
            // Default: langsung parse
            processedValue = Number(value) || 0;
        }

        newTiers[index] = { ...newTiers[index], [field]: processedValue };
        setWeightTiers(newTiers);
    };

    const handleAddWeightTier = () => {
        setWeightTiers([...weightTiers, { from: '', price: '' }]);
    };

    const handleRemoveWeightTier = (index: number) => {
        setWeightTiers(weightTiers.filter((_, i) => i !== index));
    };

    const lastDistanceTier = distanceTiers.length > 0 ? distanceTiers[distanceTiers.length - 1] : null;
    const canAddMoreDistance = !lastDistanceTier || (lastDistanceTier.to && Number(lastDistanceTier.to) < maxDistance);
    const validateDistanceTiers = () => {
        const errors = distanceTiers.map((tier) => {
            const fromVal = Number(tier.from);
            const toVal = Number(tier.to);
            const priceVal = Number(tier.price);

            return {
                to:
                    String(tier.to).trim() === '' ||
                    isNaN(toVal) ||
                    isNaN(fromVal) ||
                    toVal < fromVal ||
                    toVal > maxDistance,

                price:
                    String(tier.price).trim() === '' ||
                    isNaN(priceVal) ||
                    priceVal <= 0,
            };
        });

        setDistanceErrors(errors);
        return errors.every((e) => !e.to && !e.price);
    };

    const validateWeightTiers = () => {
        const errors = weightTiers.map((tier) => {
            const fromVal = Number(tier.from);
            const priceVal = Number(tier.price);

            return {
                from:
                    String(tier.from).trim() === '' ||
                    isNaN(fromVal) ||
                    fromVal <= 0 || // ⛔ TIDAK BOLEH 0
                    fromVal > maxWeight,

                price:
                    String(tier.price).trim() === '' ||
                    isNaN(priceVal) ||
                    priceVal <= 0,
            };
        });

        setWeightErrors(errors);
        return errors.every((e) => !e.from && !e.price);
    };


    return (
        <div className="">
            {/* Pengaturan Jarak */}
            <div className="mb-8 shadow-[1px_1px_10px_rgba(0,0,0,0.08)] rounded-[5px] border border-[#DFDFDF] ">
                <div className='px-8 py-6 border-b border-[#BBBBBBCC]/80'>
                    <h3 className="text-[17px] font-bold text-[#333333]">Pengaturan Jarak</h3>
                </div>
                <div className='py-6 px-8'>
                    <div className="flex items-center space-x-4 mb-4">
                        <label className="text-[#333333] text-[15px] w-48">Batas Jarak Pengiriman</label>
                        <div className='p-2 border border-gray-300 rounded-md text-[#333333] font-bold text-center flex focus-within:border-blue-500'>
                            <input
                                type="number"
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    const numericValue = inputValue === '' ? '' : String(Number(inputValue));
                                    setMaxDistance(numericValue === '' ? 0 : Number(numericValue));
                                }}
                                placeholder='0'
                                value={maxDistance > 0 ? maxDistance : ''}
                                className="w-24 outline-none"
                            />
                            <span className="text-[#555555] text-[14px] font-[400]">km</span>
                        </div>

                    </div>
                    <div className="flex-1 space-y-2">
                        {maxDistance > 0 && (
                            <>
                                <div className="flex items-start     space-x-4 mt-4">
                                    <label className="text-[#333333] text-[15px] w-48">Pengaturan Ongkos Kirim</label>
                                    <div className="flex-1 space-y-2">
                                        {distanceTiers.map((tier, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <div className='p-2 border border-[#AAAAAA] rounded-md font-bold text-center flex focus-within:border-blue-500 bg-[#EFEFEFEE]'>
                                                    <input
                                                        type="number" value={tier.from} onChange={(e) => handleDistanceTierChange(index, 'from', e.target.value)} disabled={true}
                                                        className="w-24 outline-none"
                                                        max={maxDistance}
                                                    />
                                                    <span className="text-[#555555] text-[14px] font-[400]">km</span>
                                                </div>
                                                <div>
                                                    <div className='p-2 border border-gray-300 rounded-md text-[#333333] font-bold text-center flex focus-within:border-blue-500'>
                                                        <input
                                                            type="number"
                                                            value={tier.to !== '' ? String(tier.to) : ''}
                                                            onChange={(e) => handleDistanceTierChange(index, 'to', e.target.value)}
                                                            onBlur={() => handleDistanceToBlur(index)}
                                                            placeholder="Masukkan batas"
                                                            className="w-24 outline-none"
                                                        />

                                                        <span className="text-[#555555] text-[14px] font-[400]">km</span>
                                                    </div>
                                                    {distanceErrors[index]?.to && (
                                                        <p className="text-red-500 text-sm">Batas akhir wajib diisi dan valid</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className='p-2 border border-gray-300 rounded-md text-[#333333] font-bold text-center flex gap-2 focus-within:border-blue-500'>
                                                        <span className="text-[#555555] text-[14px] font-[400]">Rp</span>
                                                        <input
                                                            type="text" placeholder="20.0000" value={formatNumber(tier.price)} onChange={(e) => handleDistanceTierChange(index, 'price', e.target.value)}
                                                            className="w-50 outline-none"
                                                        />
                                                    </div>
                                                    {distanceErrors[index]?.price && (
                                                        <p className="text-red-500 text-sm">Harga wajib diisi & lebih dari 0</p>
                                                    )}
                                                </div>
                                                <div className="w-8 text-right">{index > 0 && (<button onClick={() => handleRemoveDistanceTier(index)} className="text-text-[#1D1B20] hover:text-red-500"><Trash2 size={20} /></button>)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 mt-3">
                                    <div className="w-48"></div>
                                    <button onClick={handleAddDistanceTier} disabled={!canAddMoreDistance} className="flex items-center text-[#333333] text-[15px] font-medium disabled:text-gray-400 disabled:cursor-not-allowed" title={!canAddMoreDistance ? "Batas jarak maksimal sudah tercapai" : "Tambah kondisi baru"}>
                                        <PlusCircle size={20} className="mr-2" strokeWidth={3} /> Tambah Kondisi
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Pengaturan Berat */}
            <div className='shadow-[1px_1px_10px_rgba(0,0,0,0.08)] rounded-[5px] border border-[#DFDFDF]'>
                <div className='px-8 py-6 border-b border-[#BBBBBBCC]/80'>
                    <h3 className="text-[17px] font-bold text-[#333333]">Pengaturan Berat (Boleh tidak diisi)</h3>
                </div>
                <div className='px-8 py-6'>
                    <div className="flex items-center space-x-4 mb-4">
                        <label className="text-[#333333] text-[15px] w-48">Batas Berat Pengiriman</label>
                        <div className='p-2 border border-gray-300 rounded-md text-[#333333] font-bold text-center flex focus-within:border-blue-500'>
                            <input
                                type="number" placeholder="Contoh: 100" value={maxWeight || ''} onChange={(e) => setMaxWeight(Number(e.target.value))}
                                className="w-50 outline-none"
                            />
                            <span className="text-[#555555] text-[14px] font-[400]">kg</span>
                        </div>
                    </div>

                    {maxWeight > 0 && (
                        <>
                            <div className="flex items-center space-x-4 mt-4">
                                <label className="text-gray-600 w-48">Pengaturan Ongkos Kirim</label>
                                <div className="flex-1 space-y-2">
                                    {weightTiers.map((tier, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <div>
                                                <div className='p-2 border border-gray-300 rounded-md text-[#333333] font-bold text-center flex gap-4 focus-within:border-blue-500'>
                                                    <span className="text-[#555555] text-[14px] font-[400]">Berat lebih dari</span>
                                                    <input
                                                        type="number"
                                                        placeholder="2"
                                                        value={tier.from}
                                                        onChange={(e) => handleWeightTierChange(index, 'from', e.target.value)}
                                                        min="0"
                                                        max={maxWeight}
                                                        className="w-20 outline-none text-center"
                                                    />
                                                    <span className="text-[#555555] text-[14px] font-[400]">kg</span>
                                                </div>
                                                {weightErrors[index]?.from && (
                                                    <p className="text-red-500 text-sm">Berat awal tidak valid</p>
                                                )}
                                            </div>
                                            <div>
                                                <div className='p-2 border border-gray-300 rounded-md text-[#333333] font-bold text-center flex gap-4 focus-within:border-blue-500'>
                                                    <span className="text-[#555555] text-[14px] font-[400]">Rp </span>
                                                    <input
                                                        type="text"
                                                        placeholder="20.000"
                                                        value={formatNumber(tier.price)}
                                                        onChange={(e) =>
                                                            handleWeightTierChange(index, 'price', e.target.value)
                                                        }
                                                        className="w-50 outline-none text-left"
                                                    />

                                                </div>
                                                {weightErrors[index]?.price && (
                                                    <p className="text-red-500 text-sm">Harga wajib diisi & lebih dari 0</p>
                                                )}
                                            </div>
                                            <div className="w-8 text-right">
                                                {index > 0 && (
                                                    <button onClick={() => handleRemoveWeightTier(index)} className="text-[#1D1B20] hover:text-red-500">
                                                        <Trash2 size={20} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 mt-3">
                                <div className="w-48"></div>
                                <button onClick={handleAddWeightTier} className="flex items-center  text-[#333333] text-[15px] font-medium">
                                    <PlusCircle size={20} className="mr-2" strokeWidth={3} />
                                    Tambah Kondisi
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Tombol Aksi Modal */}
            <div className="flex justify-end mt-8 pt-6 border-t border-gray-200 space-x-4">
                <button onClick={onCancel} className="bg-gray-200 text-gray-700 font-bold py-2 px-8 rounded-lg hover:bg-gray-300">
                    Batal
                </button>
                <button
                    onClick={() => {
                        const isDistanceValid = validateDistanceTiers();
                        const isWeightValid = validateWeightTiers();
                        if (isDistanceValid && isWeightValid) {
                            onSave();
                        }
                    }}
                    className="bg-purple-700 text-white font-bold py-2 px-8 rounded-lg hover:bg-purple-800"
                >
                    Simpan Perubahan
                </button>
            </div>
        </div>
    );
};

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
                        onSave={() => setView('main')}
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
