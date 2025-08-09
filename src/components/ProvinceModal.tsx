import { Check, X } from 'lucide-react';
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
    const MAX_SELECTED = 3;

    const [isMounted, setIsMounted] = useState(false);
    const [tempSelected, setTempSelected] =
        useState<string[]>(selectedProvinces);

    // Mount detection
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Lock scroll when modal is open
    useEffect(() => {
        if (!isMounted) return;

        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';

            return () => {
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [isOpen, isMounted]);

    // Reset selection when modal opened
    useEffect(() => {
        if (isOpen) setTempSelected(selectedProvinces);
    }, [isOpen, selectedProvinces]);

    const handleCheckboxChange = (province: string) => {
        setTempSelected(prev => {
            if (prev.includes(province)) return prev.filter(p => p !== province);
            if (prev.length < MAX_SELECTED) return [...prev, province];
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
                className="relative w-[620px] h-[80vh]  bg-white shadow-2xl m-4"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-5 bg-white flex justify-between" style={{
                    letterSpacing: "-0.05em"
                }}>
                    <h2
                        id="modal-title"
                        className="text-[20px] font-bold text-center text-[#333333]"
                    >
                        Ubah Lokasi Pencarian
                    </h2>
                    <X className="text-[#333333] cursor-pointer" onClick={onClose} />
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto h-[60vh] pt-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2.5 gap-x-6">
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
                                    {/* <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => handleCheckboxChange(province)}
                                        disabled={disableOthers}
                                        className="h-5 w-5 rounded border-gray-300 accent-[#52357B] focus:ring-[#52357B] flex-shrink-0"
                                    /> */}
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => handleCheckboxChange(province)}
                                            disabled={disableOthers}
                                            className="peer hidden"
                                            id="cod"
                                        />
                                        <span className={`${checked ? 'w-[18px] h-[18px] rounded-[4px] border-2 border-[#52357B] bg-[#E7D6FF]' : 'w-[18px] h-[18px] border-2 border-[#888]'} flex items-center justify-center`}>
                                            {checked ? <Check size={16} strokeWidth={4} /> : ''}

                                        </span>
                                    </label>
                                    <span className="text-[#333333] font-bold text-[16px] tracking-[-0.05em]">{province}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center p-4  gap-4">
                    <div className='text-[14px]'>
                        Maksimal 3 Lokasi Pencarian
                    </div>
                    <div className='flex justify-right gap-3'>
                        <button
                            onClick={onClose}
                            className="px-2 w-[100px] py-2 bg-white text-dark border border-[#AAAAAA] rounded-[10px] hover:bg-yellow-600 transition-colors"
                        >
                            Keluar
                        </button>
                        <button
                            onClick={handleApply}
                            className="px-2 py-2 w-[100px] bg-[#563D7C] text-white rounded-lg hover: transition-colors"
                        >
                            Terapkan
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default ProvinceModal;
