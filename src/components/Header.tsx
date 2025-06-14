"use client"; // Diperlukan karena menggunakan hook useState

import React, { useState } from 'react'
import ProvinceModal from './ProvinceModal';

// --- Komponen Ikon (SVG Inline) ---
const PhoneIcon = () => (
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

const SearchIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const CartIcon = () => (
    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const FilterIcon = () => (
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L12 14.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 016 17v-2.586L3.293 6.707A1 1 0 013 6V4z"></path></svg>
);

const ChevronRightIcon = () => (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
);



const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isProvinceModalOpen, setProvinceModalOpen] = useState(false);
    // State sekarang menjadi array untuk multi-seleksi
    const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);

    const topLinks = ["Tentang Tokopedia", "Mulai Berjualan", "Promo", "Tokopedia Care"];
    const provinces = [
        "Aceh", "Bali", "Banten", "Bengkulu", "DI Yogyakarta", "DKI Jakarta",
        "Gorontalo", "Jambi", "Jawa Barat", "Jawa Tengah", "Jawa Timur",
        "Kalimantan Barat", "Kalimantan Selatan", "Kalimantan Tengah", "Kalimantan Timur", "Kalimantan Utara",
        "Kepulauan Bangka Belitung", "Kepulauan Riau", "Lampung", "Maluku", "Maluku Utara",
        "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Papua", "Papua Barat", "Riau",
        "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tengah", "Sulawesi Tenggara", "Sulawesi Utara",
        "Sumatera Barat", "Sumatera Selatan", "Sumatera Utara"
    ];

    return (
        <>
            <header className="bg-white shadow-sm sticky top-0 z-40">
                {/* Banner Promo Atas */}
                <div className="bg-gray-100 text-xs text-gray-600 py-1 hidden md:block">
                    <div className="container mx-auto px-4 flex justify-between items-center">
                        <a href="#" className="flex items-center hover:text-blue-600">
                            <PhoneIcon />
                            Gratis Ongkir + Banyak Promo belanja di aplikasi
                            <ChevronRightIcon />
                        </a>
                        <nav className="flex items-center gap-6">
                            {topLinks.map(link => (
                                <a key={link} href="#" className="hover:text-blue-600">{link}</a>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Main Header */}
                <div className="container mx-auto px-4 py-3">
                    {/* --- Tampilan Desktop --- */}
                    <div className="hidden md:block">
                        <div className="flex flex-row items-center gap-4">
                            <a href="#" className="text-4xl font-bold text-blue-600 shrink-0">
                                <img src='/logo/logo.png' width={100} />
                            </a>
                            <button
                                onClick={() => setProvinceModalOpen(true)}
                                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50"
                            >
                                <FilterIcon />
                                Filter
                            </button>
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <SearchIcon />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari di zukses"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex items-center gap-4 shrink-0">
                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                    <CartIcon />
                                </button>
                                <div className="h-6 w-px bg-gray-200"></div>
                                <button className="px-6 py-2 border border-gray-300 rounded-lg font-bold text-blue-600 hover:bg-gray-50 text-sm">
                                    Masuk
                                </button>
                                <button className="px-6 py-2 bg-blue-600 border border-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 text-sm">
                                    Daftar
                                </button>
                            </div>
                        </div>
                        {/* --- REVISI: List Provinsi di bawah pencarian --- */}
                        <div className="mt-2 flex items-center gap-x-4 gap-y-1 flex-wrap">
                            <span className="text-sm text-gray-500">Pencarian di:</span>
                            {selectedProvinces.length > 0 ? (
                                selectedProvinces.map(province => (
                                    <a key={province} href="#" className="text-sm font-bold text-gray-800 hover:text-blue-600">
                                        {province}
                                    </a>
                                ))
                            ) : (
                                <span className="text-sm font-bold text-gray-800">Semua Provinsi</span>
                            )}
                        </div>
                    </div>
                    {/* PERBAIKAN: Tata letak baru untuk mobile */}
                    <div className="md:hidden flex items-center gap-2">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari di Tokopedia"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-20 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                className="absolute inset-y-0 right-0 px-4 text-black font-semibold rounded-r-lg text-sm"
                                onClick={() => console.log('Cari:', searchTerm)}
                            >
                                Cari
                            </button>
                        </div>
                        <button
                            onClick={() => setProvinceModalOpen(true)}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                        >
                            <FilterIcon />
                            Filter
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg ">
                            <CartIcon />
                        </button>
                    </div>

                </div>
            </header>

            <ProvinceModal
                isOpen={isProvinceModalOpen}
                onClose={() => setProvinceModalOpen(false)}
                provinces={provinces}
                selectedProvinces={selectedProvinces}
                onApply={setSelectedProvinces}
            />
        </>
    );
}

export default Header