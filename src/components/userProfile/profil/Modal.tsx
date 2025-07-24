import { X } from 'lucide-react';
import React from 'react'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-[5px] shadow-xl">
                {
                    title != 'Verifikasi Kode' &&
                    <div className="flex justify-between items-center p-6">
                        <h3 className="text-[20px] font-bold text-[#333333]" style={{
                            letterSpacing: "-0.05em"
                        }}>{title}</h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close modal">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                }
                <div className="p-6 pt-0">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal