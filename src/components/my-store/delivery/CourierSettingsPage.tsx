'use client';

import React, { useState, FC, ReactNode, useEffect } from 'react';
import { Square, PlusCircle, Trash2 } from 'lucide-react';
import { formatRupiahNoRP } from 'components/Rupiah';
import { ShopData } from '../ShopProfileContext';

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

interface Courier {
    id: string;
    name: string;
    logo: string;
    services: string[];
}

// --- Komponen Ikon Centang Kustom ---
const CustomCheckIcon: FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`flex items-center justify-center w-[21px]h-[21px] bg-purple-700 ${className}`}>
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    </div>
);
// --- Data Awal Kurir (bisa dari API) ---
const courierServices: Courier[] = [
    { id: 'gosend', name: 'Gosend', logo: '/image/gosend 1.png', services: ['Gosend Sameday', 'Gosend Instant'] },
    { id: 'jnt', name: 'J&T', logo: '/image/gosend 2.png', services: ['J&T NextDay', 'J&T SameDay', 'J&T Regular'] },
    { id: 'jne', name: 'JNE', logo: '/image/gosend 3.png', services: ['JNE Trucking', 'JNE Regular', 'JNE Yes', 'JNE Oke'] },
    { id: 'sicepat', name: 'Si Cepat Logistik', logo: '/image/gosend 4.png', services: ['SiCepat BEST', 'SiCepat GOKIL', 'SiCepat SIUNTUNG'] },
    { id: 'anteraja', name: 'Anteraja', logo: '/image/gosend 5.png', services: ['Anteraja Regular', 'Anteraja Next Day', 'Anteraja Same Day'] },
    { id: 'pos', name: 'POS Indonesia', logo: '/image/gosend 6.png', services: ['POS Regular', 'POS Express'] },
    { id: 'paxel', name: 'Paxel', logo: '/image/gosend 7.png', services: ['Paxel Sameday', 'Paxel Big', 'Paxel Instant'] },
];

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

// --- Komponen Modal/Halaman Konfigurasi Kurir Toko ---
const StoreCourierConfig: FC<StoreCourierConfigProps> = ({
    maxDistance, setMaxDistance, distanceTiers, setDistanceTiers,
    maxWeight, setMaxWeight, weightTiers, setWeightTiers,
    onSave, onCancel
}) => {

    useEffect(() => {
        if (maxDistance > 0 && distanceTiers.length === 0) {
            setDistanceTiers([{ from: 0, to: '', price: '' }]);
        } else if (maxDistance <= 0) {
            setDistanceTiers([]);
        }
    }, [maxDistance, distanceTiers.length, setDistanceTiers]);

    useEffect(() => {
        if (maxWeight > 0 && weightTiers.length === 0) {
            setWeightTiers([{ from: '', price: '' }]);
        } else if (maxWeight <= 0) {
            setWeightTiers([]);
        }
    }, [maxWeight, weightTiers.length, setWeightTiers]);


    const handleDistanceTierChange = (index: number, field: keyof DistanceTier, value: string) => {
        const newTiers = [...distanceTiers];
        let processedValue = value;

        if (field === 'to' && Number(value) > maxDistance) {
            processedValue = maxDistance.toString();
        }

        newTiers[index] = { ...newTiers[index], [field]: processedValue };

        if (field === 'to' && index < newTiers.length - 1) {
            const nextFromValue = processedValue ? Number(processedValue) + 1 : '';
            newTiers[index + 1] = { ...newTiers[index + 1], from: nextFromValue };
        }

        setDistanceTiers(newTiers);
    };

    const handleDistanceToBlur = (index: number) => {
        const newTiers = [...distanceTiers];
        const tier = newTiers[index];
        if (tier && tier.to && Number(tier.to) < Number(tier.from)) {
            newTiers[index] = { ...tier, to: tier.from };
            setDistanceTiers(newTiers);
        }
    };

    const handleAddDistanceTier = () => {
        const lastTier = distanceTiers[distanceTiers.length - 1];
        const newFrom = lastTier && lastTier.to ? Number(lastTier.to) + 1 : 0;
        setDistanceTiers([...distanceTiers, { from: distanceTiers.length === 0 ? 0 : newFrom, to: '', price: '' }]);
    };

    const handleRemoveDistanceTier = (index: number) => {
        setDistanceTiers(distanceTiers.filter((_, i) => i !== index));
    };

    // --- LOGIKA UNTUK BERAT DIKEMBALIKAN DAN DIPERBAIKI ---
    const handleWeightTierChange = (index: number, field: keyof WeightTier, value: string) => {
        const newTiers = [...weightTiers];
        let processedValue = value;

        if (field === 'from') {
            const numericValue = Number(value);
            // Validasi tidak boleh kurang dari 0
            if (numericValue < 0) {
                processedValue = '0';
            }
            // Validasi tidak boleh melebihi batas berat
            if (maxWeight > 0 && numericValue > maxWeight) {
                processedValue = maxWeight.toString();
            }
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
                                                    />
                                                    <span className="text-[#555555] text-[14px] font-[400]">km</span>
                                                </div>
                                                <div className='p-2 border border-gray-300 rounded-md text-[#333333] font-bold text-center flex focus-within:border-blue-500'>
                                                    <input
                                                        type="number" value={tier.to} onChange={(e) => handleDistanceTierChange(index, 'to', e.target.value)} onBlur={() => handleDistanceToBlur(index)} max={maxDistance} min={Number(tier.from)}
                                                        className="w-24 outline-none"
                                                    />
                                                    <span className="text-[#555555] text-[14px] font-[400]">km</span>
                                                </div>
                                                <div className='p-2 border border-gray-300 rounded-md text-[#333333] font-bold text-center flex gap-2 focus-within:border-blue-500'>
                                                    <span className="text-[#555555] text-[14px] font-[400]">Rp</span>
                                                    <input
                                                        type="number" placeholder="20.000" value={formatRupiahNoRP(tier.price)} onChange={(e) => handleDistanceTierChange(index, 'price', e.target.value)}
                                                        className="w-24 outline-none"
                                                    />
                                                </div>
                                                <span className="text-gray-500">Rp</span>

                                                <div className="w-8 text-right">{index > 0 && (<button onClick={() => handleRemoveDistanceTier(index)} className="text-gray-400 hover:text-red-500"><Trash2 size={20} /></button>)}</div>
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
                                            <div className='p-2 border border-gray-300 rounded-md text-[#333333] font-bold text-center flex gap-4 focus-within:border-blue-500'>
                                                <span className="text-[#555555] text-[14px] font-[400]">Rp </span>
                                                <input
                                                    type="number" placeholder="20.000" value={formatRupiahNoRP(tier.price)} onChange={(e) => handleWeightTierChange(index, 'price', e.target.value)}
                                                    className="w-50 outline-none"
                                                />
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
                <button onClick={onSave} className="bg-purple-700 text-white font-bold py-2 px-8 rounded-lg hover:bg-purple-800">
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
    console.log('shopProfil', shopProfil)
    const [view, setView] = useState<'main' | 'config'>('main');
    const [isStoreCourierActive, setIsStoreCourierActive] = useState(true);

    const [maxDistance, setMaxDistance] = useState(0);
    const [distanceTiers, setDistanceTiers] = useState<DistanceTier[]>([]);
    const [maxWeight, setMaxWeight] = useState(0);
    const [weightTiers, setWeightTiers] = useState<WeightTier[]>([]);

    const [selectedServices, setSelectedServices] = useState<{ [key: string]: boolean }>(() => {
        const allServices: { [key: string]: boolean } = {};
        courierServices.forEach(c => c.services.forEach(s => { allServices[`${c.id}-${s}`] = true; }));
        return allServices;
    });

    const handleServiceChange = (key: string) => setSelectedServices(p => ({ ...p, [key]: !p[key] }));

    const handleCourierChange = (courier: Courier) => {
        const keys = courier.services.map(s => `${courier.id}-${s}`);
        const allSelected = keys.every(k => selectedServices[k]);
        const newServices = { ...selectedServices };
        keys.forEach(k => { newServices[k] = !allSelected; });
        setSelectedServices(newServices);
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
                        const allServicesForCourier = courier.services.map(s => `${courier.id}-${s}`);
                        const isAllSelected = allServicesForCourier.every(s => selectedServices[s]);
                        return (
                            <div key={courier.id} >
                                <CustomCheckboxParent id={`courier-${courier.id}`} label={courier.name} logo={courier.logo} checked={isAllSelected} onChange={() => handleCourierChange(courier)} className="mb-3" />
                                <div className="pl-8 mt-2 space-y-2 ml-2">
                                    {courier.services.map((service) => {
                                        const serviceKey = `${courier.id}-${service}`;
                                        return <CustomCheckboxChild key={serviceKey} id={serviceKey} label={service} checked={!!selectedServices[serviceKey]} onChange={() => handleServiceChange(serviceKey)} className="mb-2" />;
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Tombol Aksi Utama */}
            <div className="flex justify-end mt-8 bg-white shadow-[1px_1px_10px_rgba(0,0,0,0.08)] rounded-[5px] border border-[#DFDFDF] px-12 py-6 mb-12">
                <button className="bg-[#52357B] h-[40px] text-white font-bold py-2 px-8 rounded-[5px] tracking-[-0.03em] text-[16px] hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors">
                    Simpan Perubahan
                </button>
            </div>
        </div>
    );
}
