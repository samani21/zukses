import React, { FC, useEffect, useState } from 'react'
import ConfirmationModal from './ConfirmationModal';
import { PlusCircle, Trash2 } from 'lucide-react';
import Post from 'services/api/Post';
import { Response } from 'services/api/types';
import { AxiosError } from 'axios';
import Snackbar from 'components/Snackbar';
import Loading from 'components/Loading';

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

interface StoreCourierConfigProps {
    maxDistance: number;
    setMaxDistance: (value: number) => void;
    distanceTiers: DistanceTier[];
    setDistanceTiers: (tiers: DistanceTier[]) => void;
    maxWeight: number;
    setMaxWeight: (value: number) => void;
    weightTiers: WeightTier[];
    setWeightTiers: (tiers: WeightTier[]) => void;
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


const StoreCourierConfig: FC<StoreCourierConfigProps> = ({
    maxDistance: initialMaxDistance,
    setMaxDistance,
    distanceTiers: initialDistanceTiers,
    setDistanceTiers,
    maxWeight: initialMaxWeight,
    setMaxWeight,
    weightTiers: initialWeightTiers,
    setWeightTiers,
    onCancel
}) => {
    // --- STATE LOKAL ---
    const [localMaxDistance, setLocalMaxDistance] = useState(initialMaxDistance);
    const [localDistanceTiers, setLocalDistanceTiers] = useState<DistanceTier[]>(() => JSON.parse(JSON.stringify(initialDistanceTiers)));
    const [localMaxWeight, setLocalMaxWeight] = useState(initialMaxWeight);
    const [localWeightTiers, setLocalWeightTiers] = useState<WeightTier[]>(() => JSON.parse(JSON.stringify(initialWeightTiers)));

    const [distanceErrors, setDistanceErrors] = useState<{ to: boolean; price: boolean }[]>([]);
    const [weightErrors, setWeightErrors] = useState<{ from: boolean; price: boolean }[]>([]);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false)
    const [snackbar, setSnackbar] = useState<{
        message: string;
        type?: 'success' | 'error' | 'info';
        isOpen: boolean;
    }>({ message: '', type: 'info', isOpen: false });

    // --- EFEK UNTUK SINKRONISASI JARAK ---
    useEffect(() => {
        if (localMaxDistance > 0) {
            const currentTiers = [...localDistanceTiers];
            if (currentTiers.length === 0) {
                setLocalDistanceTiers([{ from: 0, to: localMaxDistance, price: '' }]);
            } else {
                const lastTierIndex = currentTiers.length - 1;
                currentTiers[lastTierIndex].to = localMaxDistance;

                const validTiers = currentTiers.filter(tier => Number(tier.from) < localMaxDistance);

                setLocalDistanceTiers(validTiers.length > 0 ? validTiers : [{ from: 0, to: localMaxDistance, price: '' }]);
            }
        } else {
            setLocalDistanceTiers([]);
        }
    }, [localMaxDistance]);


    // --- HANDLER UNTUK JARAK (menggunakan state lokal) ---
    const handleDistanceTierChange = (index: number, field: keyof DistanceTier, value: string) => {
        const newTiers = [...localDistanceTiers];
        let processedValue: number | string = value;

        if (field === 'price') {
            processedValue = parseInt(value.replace(/\./g, ''), 10) || 0;
        }

        newTiers[index] = { ...newTiers[index], [field]: processedValue };
        setLocalDistanceTiers(newTiers);
    };

    const handleDistanceToBlur = (index: number) => {
        const newTiers = [...localDistanceTiers];
        const tier = newTiers[index];
        const fromVal = Number(tier.from);
        let toVal = Number(tier.to);

        if (isNaN(toVal) || toVal <= fromVal || toVal > localMaxDistance) {
            toVal = localMaxDistance;
        }
        tier.to = toVal;

        const trimmedTiers = newTiers.slice(0, index + 1);

        if (toVal < localMaxDistance) {
            trimmedTiers.push({ from: toVal + 1, to: localMaxDistance, price: '' });
        }
        setLocalDistanceTiers(trimmedTiers);
    };

    const handleAddDistanceTier = () => {
        const lastTier = localDistanceTiers[localDistanceTiers.length - 1];
        if (!lastTier || Number(lastTier.to) >= localMaxDistance) return;

        const newFrom = Number(lastTier.to) + 1;

        const updatedTiers = [...localDistanceTiers];
        updatedTiers[localDistanceTiers.length - 1].to = Number(lastTier.to);

        setLocalDistanceTiers([
            ...updatedTiers,
            { from: newFrom, to: localMaxDistance, price: '' }
        ]);
    };

    const handleRemoveDistanceTier = (index: number) => {
        const newTiers = localDistanceTiers.filter((_, i) => i !== index);
        if (newTiers.length > 0) {
            newTiers[newTiers.length - 1].to = localMaxDistance;
        }
        setLocalDistanceTiers(newTiers);
    };

    // --- HANDLER UNTUK BERAT (menggunakan state lokal) ---
    const handleWeightTierChange = (index: number, field: keyof WeightTier, value: string) => {
        const newTiers = [...localWeightTiers];
        let processedValue: number | string = value;

        if (field === 'price') {
            processedValue = parseInt(value.replace(/\./g, ''), 10) || 0;
        } else {
            let numericValue = Number(value);
            if (numericValue < 0) numericValue = 0;
            if (localMaxWeight > 0 && numericValue > localMaxWeight) {
                numericValue = localMaxWeight;
            }
            processedValue = numericValue;
        }

        newTiers[index] = { ...newTiers[index], [field]: processedValue };
        setLocalWeightTiers(newTiers);
    };

    const handleAddWeightTier = () => {
        setLocalWeightTiers([...localWeightTiers, { from: '', price: '' }]);
    };

    const handleRemoveWeightTier = (index: number) => {
        setLocalWeightTiers(localWeightTiers.filter((_, i) => i !== index));
    };

    // --- VALIDASI & SIMPAN ---
    const validateAll = () => {
        let isAllValid = true;

        const distanceErrors = localDistanceTiers.map(tier => {
            const toVal = Number(tier.to);
            const priceVal = Number(tier.price);
            const toError = String(tier.to).trim() === '' || isNaN(toVal) || toVal <= Number(tier.from);
            const priceError = String(tier.price).trim() === '' || isNaN(priceVal) || priceVal <= 0;
            if (toError || priceError) isAllValid = false;
            return { to: toError, price: priceError };
        });
        setDistanceErrors(distanceErrors);

        const weightErrors = localWeightTiers.map(tier => {
            const fromVal = Number(tier.from);
            const priceVal = Number(tier.price);
            const fromError = String(tier.from).trim() === '' || isNaN(fromVal) || fromVal <= 0;
            const priceError = String(tier.price).trim() === '' || isNaN(priceVal) || priceVal <= 0;
            if (fromError || priceError) isAllValid = false;
            return { from: fromError, price: priceError };
        });
        setWeightErrors(weightErrors);

        return isAllValid;
    };

    const handleSaveClick = () => {
        if (validateAll()) {
            setIsConfirmModalOpen(true);
        }
    };

    const confirmAndSaveChanges = async () => {
        // 1. Update state di komponen induk
        setMaxDistance(localMaxDistance);
        setDistanceTiers(localDistanceTiers);
        setMaxWeight(localMaxWeight);
        setWeightTiers(localWeightTiers);

        // 2. Panggil onSave untuk notifikasi
        const payload = {
            isStoreCourierActive: true,
            storeCourierSettings: {
                distance: {
                    max: localMaxDistance,
                    tiers: localDistanceTiers,
                },
                weight: {
                    max: localMaxWeight,
                    tiers: localWeightTiers,
                }
            },
            // enabledCourierServices: [],

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
                window.location.reload()
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

        // 3. Tutup modal
        setIsConfirmModalOpen(false);
    };

    const lastDistanceTier = localDistanceTiers.length > 0 ? localDistanceTiers[localDistanceTiers.length - 1] : null;
    const canAddMoreDistance = !lastDistanceTier || (lastDistanceTier.to && Number(lastDistanceTier.to) < localMaxDistance);

    return (
        <>
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
                                    onChange={(e) => setLocalMaxDistance(Number(e.target.value) || 0)}
                                    placeholder='0'
                                    value={localMaxDistance > 0 ? localMaxDistance : ''}
                                    className="w-24 outline-none"
                                />
                                <span className="text-[#555555] text-[14px] font-[400]">km</span>
                            </div>
                        </div>
                        {localMaxDistance > 0 && (
                            <>
                                <div className="flex items-start space-x-4 mt-4">
                                    <label className="text-[#333333] text-[15px] w-48">Pengaturan Ongkos Kirim</label>
                                    <div className="flex-1 space-y-2">
                                        {localDistanceTiers.map((tier, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <div className='p-2 border border-[#AAAAAA] rounded-md font-bold text-center flex focus-within:border-blue-500 bg-[#EFEFEFEE]'>
                                                    <input
                                                        type="number" value={tier.from}
                                                        readOnly
                                                        className="w-24 outline-none bg-transparent"
                                                    />
                                                    <span className="text-[#555555] text-[14px] font-[400]">km</span>
                                                </div>
                                                <div>
                                                    <div className={`p-2 border ${distanceErrors[index]?.to ? 'border-red-500' : 'border-gray-300'} rounded-md text-[#333333] font-bold text-center flex focus-within:border-blue-500`}>
                                                        <input
                                                            type="number"
                                                            value={tier.to !== '' ? String(tier.to) : ''}
                                                            onChange={(e) => handleDistanceTierChange(index, 'to', e.target.value)}
                                                            onBlur={() => handleDistanceToBlur(index)}
                                                            placeholder="Batas"
                                                            className="w-24 outline-none"
                                                        />
                                                        <span className="text-[#555555] text-[14px] font-[400]">km</span>
                                                    </div>
                                                    {distanceErrors[index]?.to && (
                                                        <p className="text-red-500 text-xs mt-1">Batas akhir tidak valid.</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className={`p-2 border ${distanceErrors[index]?.price ? 'border-red-500' : 'border-gray-300'} rounded-md text-[#333333] font-bold text-center flex gap-2 focus-within:border-blue-500`}>
                                                        <span className="text-[#555555] text-[14px] font-[400]">Rp</span>
                                                        <input
                                                            type="text" placeholder="20.000" value={formatNumber(tier.price)} onChange={(e) => handleDistanceTierChange(index, 'price', e.target.value)}
                                                            className="w-50 outline-none"
                                                        />
                                                    </div>
                                                    {distanceErrors[index]?.price && (
                                                        <p className="text-red-500 text-xs mt-1">Harga wajib diisi.</p>
                                                    )}
                                                </div>
                                                <div className="w-8 text-right">
                                                    {localDistanceTiers.length > 1 && (
                                                        <button onClick={() => handleRemoveDistanceTier(index)} className="text-[#1D1B20] hover:text-red-500">
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
                                    <button onClick={handleAddDistanceTier} disabled={!canAddMoreDistance} className="flex items-center text-[#333333] text-[15px] font-medium disabled:text-gray-400 disabled:cursor-not-allowed" title={!canAddMoreDistance ? "Batas jarak maksimal sudah tercapai" : "Tambah kondisi baru"}>
                                        <PlusCircle size={20} className="mr-2" strokeWidth={3} /> Tambah Kondisi
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Pengaturan Berat */}
                <div className='shadow-[1px_1px_10px_rgba(0,0,0,0.08)] rounded-[5px] border border-[#DFDFDF]'>
                    <div className='px-8 py-6 border-b border-[#BBBBBBCC]/80'>
                        <h3 className="text-[17px] font-bold text-[#333333]">Pengaturan Berat (Opsional)</h3>
                    </div>
                    <div className='px-8 py-6'>
                        <div className="flex items-center space-x-4 mb-4">
                            <label className="text-[#333333] text-[15px] w-48">Batas Berat Pengiriman</label>
                            <div className='p-2 border border-gray-300 rounded-md text-[#333333] font-bold text-center flex focus-within:border-blue-500'>
                                <input
                                    type="number" placeholder="Contoh: 100" value={localMaxWeight || ''} onChange={(e) => setLocalMaxWeight(Number(e.target.value))}
                                    className="w-50 outline-none"
                                />
                                <span className="text-[#555555] text-[14px] font-[400]">kg</span>
                            </div>
                        </div>

                        {localMaxWeight > 0 && (
                            <>
                                <div className="flex items-start space-x-4 mt-4">
                                    <label className="text-gray-600 w-48 pt-2">Biaya Tambahan per Berat</label>
                                    <div className="flex-1 space-y-2">
                                        {localWeightTiers.map((tier, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <div>
                                                    <div className={`p-2 border ${weightErrors[index]?.from ? 'border-red-500' : 'border-gray-300'} rounded-md text-[#333333] font-bold text-center flex gap-4 focus-within:border-blue-500`}>
                                                        <span className="text-[#555555] text-[14px] font-[400]">Berat lebih dari</span>
                                                        <input
                                                            type="number"
                                                            placeholder="2"
                                                            value={tier.from}
                                                            onChange={(e) => handleWeightTierChange(index, 'from', e.target.value)}
                                                            min="0"
                                                            max={localMaxWeight}
                                                            className="w-20 outline-none text-center"
                                                        />
                                                        <span className="text-[#555555] text-[14px] font-[400]">kg</span>
                                                    </div>
                                                    {weightErrors[index]?.from && (
                                                        <p className="text-red-500 text-xs mt-1">Berat awal tidak valid.</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className={`p-2 border ${weightErrors[index]?.price ? 'border-red-500' : 'border-gray-300'} rounded-md text-[#333333] font-bold text-center flex gap-4 focus-within:border-blue-500`}>
                                                        <span className="text-[#555555] text-[14px] font-[400]">Rp </span>
                                                        <input
                                                            type="text"
                                                            placeholder="20.000"
                                                            value={formatNumber(tier.price)}
                                                            onChange={(e) => handleWeightTierChange(index, 'price', e.target.value)}
                                                            className="w-50 outline-none text-left"
                                                        />
                                                    </div>
                                                    {weightErrors[index]?.price && (
                                                        <p className="text-red-500 text-xs mt-1">Harga wajib diisi.</p>
                                                    )}
                                                </div>
                                                <div className="w-8 text-right">
                                                    <button onClick={() => handleRemoveWeightTier(index)} className="text-[#1D1B20] hover:text-red-500">
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 mt-3">
                                    <div className="w-48"></div>
                                    <button onClick={handleAddWeightTier} className="flex items-center text-[#333333] text-[15px] font-medium">
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
                        onClick={handleSaveClick}
                        className="bg-purple-700 text-white font-bold py-2 px-8 rounded-lg hover:bg-purple-800"
                    >
                        Simpan Perubahan
                    </button>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onConfirm={confirmAndSaveChanges}
                onCancel={onCancel}
            />

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
        </>
    );
};

export default StoreCourierConfig