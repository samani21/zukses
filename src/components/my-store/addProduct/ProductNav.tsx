import React from 'react';
import { Check } from 'lucide-react';
import { ValidationStatus } from 'types/product';

interface ProductNavProps {
    activeSection: string;
    onNavigate: (id: string) => void;
    validationStatus: ValidationStatus;
}

const ProductNav = ({ activeSection, onNavigate, validationStatus }: ProductNavProps) => {
    const navItems = [
        { id: 'informasi-produk-section', label: 'Informasi Produk', status: validationStatus.produk },
        { id: 'informasi-penjualan-section', label: 'Informasi Penjualan', status: validationStatus.penjualan },
        { id: 'informasi-pengiriman-section', label: 'Informasi Pengiriman', status: validationStatus.pengiriman },
        { id: 'informasi-lainnya-section', label: 'Informasi Lainnya', status: validationStatus.lainnya },
    ];

    const getStatusIndicator = (status: number | 'valid') => {
        if (status === 'valid') {
            return (
                <div className="w-[24px] h-[24px] flex items-center justify-center bg-[#C7FCE4] rounded-full">
                    <Check className="w-5 h-5 text-[#388F4F]" />
                </div>
            );
        }
        if (status > 0) {
            return (
                <div className={`w-[24px] h-[24px] flex items-center justify-center text-[14px] font-bold rounded-full text-[#C71616] bg-[#FACACA]`}>
                    {status}
                </div>
            );
        }
        return <div className="w-6 h-6 rounded-full"></div>;
    };

    return (
        <div className="bg-white rounded-[10px] shadow-sm border border-[#DDDDDD] w-[236px]">
            <ul className="space-y-1">
                {navItems.map((item, index) => {
                    const isActive = activeSection === item.id;
                    return (
                        <li key={index}>
                            <button
                                onClick={() => onNavigate(item.id)}
                                className={`w-full text-left px-4 py-2 ${index == 0 ? 'rounded-t-[10px]' : index === navItems?.length - 1 ? "rounded-b-[10px]" : ""} text-[14px] flex justify-between items-center transition-colors duration-200 font-medium ${isActive
                                    ? 'bg-[#52357B] text-white'
                                    : 'text-[#444444] hover:bg-gray-100'
                                    }`}

                                style={{
                                    lineHeight: "120%",
                                    letterSpacing: "-0.02em"
                                }}
                            >
                                <span>{item.label}</span>
                                {getStatusIndicator(item.status)}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ProductNav;