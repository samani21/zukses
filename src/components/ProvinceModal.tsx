import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

// --- Komponen Modal Provinsi yang Diperbarui ---
interface ProvinceModalProps {
    isOpen: boolean;
    onClose: () => void;
    provinces: string[];
    selectedProvinces: string[];
    onApply: (provinces: string[]) => void;
}

function ProvinceModal({ isOpen, onClose, provinces, selectedProvinces, onApply }: ProvinceModalProps) {
    const [isMounted, setIsMounted] = useState(false);
    // State sementara untuk menyimpan pilihan checkbox sebelum diterapkan
    const [tempSelected, setTempSelected] = useState<string[]>(selectedProvinces);

    useEffect(() => {
        setIsMounted(true);
        // Sinkronkan state sementara saat modal dibuka
        if (isOpen) {
            setTempSelected(selectedProvinces);
        }
    }, [isOpen, selectedProvinces]);

    const handleCheckboxChange = (province: string) => {
        setTempSelected(prev =>
            prev.includes(province)
                ? prev.filter(p => p !== province)
                : [...prev, province]
        );
    };

    const handleApply = () => {
        onApply(tempSelected);
        onClose();
    };

    if (!isMounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose} style={{ background: "#00000022" }}>
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl m-4" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b">
                    <h2 id="modal-title" className="text-xl font-bold text-center text-gray-800">Pilih Provinsi Lokasi Pencarian</h2>
                </div>
                <div className="p-6 max-h-80 overflow-y-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6">
                        {provinces.map(province => (
                            <label key={province} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={tempSelected.includes(province)}
                                    onChange={() => handleCheckboxChange(province)}
                                    // PERBAIKAN: Menambahkan flex-shrink-0 untuk mencegah kotak mengecil
                                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                                />
                                <span className="text-gray-700">{province}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end p-4 border-t gap-4">
                    <button onClick={onClose} className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors">
                        Keluar
                    </button>
                    <button onClick={handleApply} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                        Terapkan
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
export default ProvinceModal