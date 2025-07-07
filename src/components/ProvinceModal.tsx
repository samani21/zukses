import { X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ProvinceModalProps {
    isOpen: boolean;
    onClose: () => void;
    provinces: string[];
    selectedProvinces: string[];
    onApply: (provinces: string[]) => void;
}

function ProvinceModal({
    isOpen,
    onClose,
    provinces,
    selectedProvinces,
    onApply,
}: ProvinceModalProps) {
    const MAX_SELECTED = 3;                // <— batas pilihan

    const [isMounted, setIsMounted] = useState(false);
    const [tempSelected, setTempSelected] =
        useState<string[]>(selectedProvinces);

    useEffect(() => {
        setIsMounted(true);
        if (isOpen) setTempSelected(selectedProvinces);
    }, [isOpen, selectedProvinces]);

    const handleCheckboxChange = (province: string) => {
        setTempSelected(prev => {
            // jika sudah ada -> hapus
            if (prev.includes(province)) return prev.filter(p => p !== province);
            // jika kurang dari 3 -> tambahkan
            if (prev.length < MAX_SELECTED) return [...prev, province];
            // jika sudah 3 -> abaikan
            return prev;
        });
    };

    const handleApply = () => {
        onApply(tempSelected);
        onClose();
    };

    if (!isMounted || !isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={onClose}
            style={{ background: '#00000022' }}
        >
            <div
                className="relative w-[640px] h-[615px] bg-white shadow-2xl m-4"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 bg-[#5459AC] flex justify-between h-[60px]">
                    <h2
                        id="modal-title"
                        className="text-[16px] font-semibold text-center text-white"
                    >
                        Pilih Provinsi Lokasi Pencarian
                    </h2>
                    <X className="text-white cursor-pointer" onClick={onClose} />
                </div>

                {/* Body */}
                <div className="p-6 max-h-119 overflow-y-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6">
                        {provinces.map(province => {
                            const checked = tempSelected.includes(province);
                            const disableOthers =
                                tempSelected.length >= MAX_SELECTED && !checked;

                            return (
                                <label
                                    key={province}
                                    className={`flex items-center space-x-3 cursor-pointer ${disableOthers ? 'opacity-40 cursor-not-allowed' : ''
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => handleCheckboxChange(province)}
                                        disabled={disableOthers}
                                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                                    />
                                    <span className="text-gray-700">{province}</span>
                                </label>
                            );
                        })}
                    </div>
                    {tempSelected.length >= MAX_SELECTED && (
                        <p className="mt-4 text-xs text-red-600">
                            Maksimal {MAX_SELECTED} provinsi dapat dipilih.
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-center p-4 py-5 gap-4 border-t border-[#CCCCCC]">
                    <button
                        onClick={onClose}
                        className="px-6 w-[146px] py-2 bg-white text-dark border border-[#AAAAAA] rounded-[10px] hover:bg-yellow-600 transition-colors"
                    >
                        Keluar
                    </button>
                    <button
                        onClick={handleApply}
                        className="px-6 py-2 w-[146px] bg-[#E13C3A] text-white rounded-lg hover: transition-colors"
                    >
                        Terapkan
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}

export default ProvinceModal;
