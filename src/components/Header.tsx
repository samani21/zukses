"use client";

import React, { useEffect, useRef, useState } from 'react';
import ProvinceModal from './ProvinceModal';
import { useRouter } from 'next/router';

// --- Komponen Ikon (Tidak ada perubahan) ---
const SearchIcon = ({ className }: { className?: string }) => (
    <svg className={className || "w-5 h-5 text-gray-500"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
);
const HistoryIcon = ({ className }: { className?: string }) => (
    <svg className={className || "w-5 h-5 text-gray-400"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);
const ChevronLeftIcon = ({ className }: { className?: string }) => (
    <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
);

interface Suggestion { type: 'suggestion' | 'store' | 'protection' | 'history'; text: string; location?: string; icon?: string; }
interface CartItem { id: number; name: string; variant: string; price: string; originalPrice: string; image: string; quantity: number; }

// --- Komponen Popup Keranjang ---
const CartPopup = ({ items, totalItems }: { items: CartItem[], totalItems: number }) => {
    if (!items || items.length === 0) {
        return (
            // Mengurangi margin atas (mt-1) agar tidak ada celah
            <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-4">
                <p className="text-center text-gray-500">Keranjang Anda kosong.</p>
            </div>
        );
    }

    return (
        // Mengurangi margin atas (mt-1) agar tidak ada celah antara ikon dan popup
        <div className="absolute top-full right-0 mt-1 w-[470px] bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <div className="p-4 border-b">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-[17px] text-gray-800">Keranjang ({totalItems})</h3>
                    <div className="cursor-pointer text-[17px] font-bold text-[#0075C9]">Lihat semua</div>
                </div>
            </div>
            <ul className="p-2 max-h-80 overflow-y-auto">
                {items.slice(0, 4).map((item) => (
                    <li key={item.id} className="flex items-start gap-4 p-2 hover:bg-gray-50 rounded-md">
                        <img src={item.image} alt={item.name} className="w-[47px] h-[47px] object-cover mr-3" />
                        <div className="flex-grow">
                            <p className="text-[12px] font-[500] text-[#111111] line-clamp-2" title={item.name}>{item.name}</p>
                            <p className="text-[12px] text-[#333333]">{item.variant}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                            <p className="text-[13px] font-bold text-[#333333]">1 x {item.price}</p>
                            <p className="text-[11px] text-[#555555] line-through" style={{
                                lineHeight:'99%'
                            }}>{item.originalPrice}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// --- Sisa komponen (tidak ada perubahan signifikan) ---
const saveSearchTerm = (term: string): string[] => {
    if (!term.trim() || typeof window === 'undefined') return [];
    try {
        const HISTORY_KEY = 'searchHistory'; const MAX_HISTORY = 10;
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        const updatedHistory = [term, ...history.filter((item: string) => item !== term)];
        const limitedHistory = updatedHistory.slice(0, MAX_HISTORY);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
        return limitedHistory;
    } catch (error) { console.error("Gagal menyimpan riwayat pencarian:", error); return []; }
};

const SearchSuggestions = ({ suggestions, searchTerm, onSuggestionClick }: { suggestions: Suggestion[], searchTerm: string, onSuggestionClick: (suggestion: Suggestion) => void }) => {
    const filteredSuggestions = searchTerm ? suggestions.filter(s => s.text.toLowerCase().includes(searchTerm.toLowerCase())) : suggestions;
    if (filteredSuggestions.length === 0) { return null; }
    return (
        <div className="absolute top-full left-0 right-0 mt-1 md:-mt-0 bg-white md:border border-gray-200 md:rounded-md md:shadow-lg z-10 md:w-[72%]">
            <ul>
                {filteredSuggestions.map((suggestion, index) => (
                    <li key={index} onClick={() => onSuggestionClick(suggestion)} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        {suggestion.type === 'history' && <HistoryIcon className="w-5 h-5 mr-3 text-gray-400" />}
                        {suggestion.type === 'store' && suggestion.icon && <img src={suggestion.icon} alt={suggestion.text} className="w-6 h-6 mr-3 rounded-full" />}
                        {suggestion.type !== 'history' && suggestion.type !== 'store' && <SearchIcon className="w-5 h-5 mr-3 text-gray-400" />}
                        <div className="text-gray-800">{suggestion.text}{suggestion.location && <span className="text-sm text-gray-500 ml-2">{suggestion.location}</span>}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const MobileSearchSuggestions = ({ suggestions, onSuggestionClick }: { suggestions: Suggestion[], onSuggestionClick: (suggestion: Suggestion) => void }) => {
    if (suggestions.length === 0) {
        return (<div className="px-4 py-3 text-gray-500 text-sm">Tidak ada saran.</div>);
    }
    return (
        <div>
            <ul>
                {suggestions.map((suggestion, index) => (
                    <li key={index} onClick={() => onSuggestionClick(suggestion)} className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100">
                        {suggestion.type === 'history' && <HistoryIcon className="w-5 h-5 mr-3 text-gray-400" />}
                        {suggestion.type === 'store' && suggestion.icon && <img src={suggestion.icon} alt={suggestion.text} className="w-6 h-6 mr-3 rounded-full" />}
                        {suggestion.type !== 'history' && suggestion.type !== 'store' && <SearchIcon className="w-5 h-5 mr-3 text-gray-400" />}
                        <div className="text-gray-800 flex-grow">{suggestion.text}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const MobileSearch = ({ onClose, suggestions, searchHistory, onSearchSubmit }: { onClose: () => void, suggestions: Suggestion[], searchHistory: Suggestion[], onSearchSubmit: (term: string) => void }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearch = () => { if (!searchTerm.trim()) return; onSearchSubmit(searchTerm); };
    const handleSuggestionClick = (suggestion: Suggestion) => { onSearchSubmit(suggestion.text); };
    const suggestionsToShow = searchTerm.trim() === '' ? searchHistory : suggestions.filter(s => s.text.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
            <div className="flex items-center p-2 border-b border-gray-200 flex-shrink-0">
                <button onClick={onClose} className="p-2 text-gray-600"><ChevronLeftIcon /></button>
                <div className="relative flex-grow">
                    <input type="text" placeholder="Cari di Zukses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }} className="w-full h-10 pl-4 pr-10 text-gray-900 focus:outline-none" autoFocus />
                    <button onClick={handleSearch} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"><SearchIcon /></button>
                </div>
            </div>
            <div className="overflow-y-auto">
                <MobileSearchSuggestions suggestions={suggestionsToShow} onSuggestionClick={handleSuggestionClick} />
            </div>
        </div>
    );
};


// --- KOMPONEN UTAMA HEADER ---
const Header = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [isProvinceModalOpen, setProvinceModalOpen] = useState(false);
    const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [searchHistory, setSearchHistory] = useState<Suggestion[]>([]);
    const [dropdownMode, setDropdownMode] = useState<'history' | 'suggestions'>('history');
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const [isCartPopupVisible, setCartPopupVisible] = useState(false);

    const provinces = ["Aceh", "Bali", "Banten", "Bengkulu", "DI Yogyakarta", "DKI Jakarta", "Gorontalo", "Jambi", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Kalimantan Barat", "Kalimantan Selatan", "Kalimantan Tengah", "Kalimantan Timur", "Kalimantan Utara", "Kepulauan Bangka Belitung", "Kepulauan Riau", "Lampung", "Maluku", "Maluku Utara", "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Papua", "Papua Barat", "Riau", "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tengah", "Sulawesi Tenggara", "Sulawesi Utara", "Sumatera Barat", "Sumatera Selatan", "Sumatera Utara"];
    const searchSuggestions: Suggestion[] = [{ type: 'protection', text: 'Proteksi Gadget' }, { type: 'suggestion', text: 'laptop second' }, { type: 'store', text: 'Laptop Murah ID', location: 'Jakarta', icon: 'https://placehold.co/24x24/7C3AED/FFFFFF?text=L' }, { type: 'suggestion', text: 'laptop rtx' },];
    const mockCartItems: CartItem[] = [
        { id: 1, name: 'Tsurayya - (Abaya Saja) Abaya Basic Bahan Mazen Anti UV by Sultan...', variant: 'Warna Merah Ukuran XL', price: 'Rp285.000', originalPrice: 'Rp500.000', image: 'https://placehold.co/48x48/000000/FFFFFF?text=A', quantity: 1 },
        { id: 2, name: 'Tsurayya - (Abaya Saja) Abaya Basic Bahan Mazen Anti UV by Sultan...', variant: 'Warna Merah Ukuran XL', price: 'Rp285.000', originalPrice: 'Rp500.000', image: 'https://placehold.co/48x48/000000/FFFFFF?text=A', quantity: 1 },
        { id: 3, name: 'Tsurayya - (Abaya Saja) Abaya Basic Bahan Mazen Anti UV by Sultan...', variant: 'Warna Merah Ukuran XL', price: 'Rp285.000', originalPrice: 'Rp500.000', image: 'https://placehold.co/48x48/000000/FFFFFF?text=A', quantity: 1 },
        { id: 4, name: 'Tsurayya - (Abaya Saja) Abaya Basic Bahan Mazen Anti UV by Sultan...', variant: 'Warna Merah Ukuran XL', price: 'Rp285.000', originalPrice: 'Rp500.000', image: 'https://placehold.co/48x48/000000/FFFFFF?text=A', quantity: 1 },
    ];
    const totalCartItems = 123;

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        if (token && userString) {
            setIsLoggedIn(true);
            const userData = JSON.parse(userString);
            setUserName(userData.name || 'Pengguna');
        }
        try {
            const storedHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
            const historySuggestions = storedHistory.map((term: string) => ({ type: 'history', text: term } as const));
            setSearchHistory(historySuggestions);
        } catch (error) { console.error("Gagal memuat riwayat pencarian:", error); }
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) { if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) { setIsSearchFocused(false); } }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchContainerRef]);

    const updateHistoryState = (newHistory: string[]) => {
        const historySuggestions: Suggestion[] = newHistory.map(term => ({ type: 'history' as const, text: term, }));
        setSearchHistory(historySuggestions);
    };

    const handleSearch = () => {
        const newHistory = saveSearchTerm(searchTerm);
        updateHistoryState(newHistory);
        if (!searchTerm.trim()) { }
        setIsSearchFocused(false);
    };

    const createSlug = (text: string) => text.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    const handleSuggestionClick = (suggestion: Suggestion) => {
        const newHistory = saveSearchTerm(suggestion.text);
        updateHistoryState(newHistory);
        setSearchTerm(suggestion.text);
        setIsSearchFocused(false);
        window.location.href = `/search/${createSlug(suggestion.text)}`;
    };

    const handleMobileSearchSubmit = (submittedTerm: string) => {
        setSearchTerm(submittedTerm);
        const newHistory = saveSearchTerm(submittedTerm);
        updateHistoryState(newHistory);
        setIsMobileSearchOpen(false);
        window.location.href = `/search/${createSlug(submittedTerm)}`;
    };

    const suggestionsForDropdown = dropdownMode === 'history' ? searchHistory : searchSuggestions;

    return (
        <>
            <header className="h-[60px] md:h-[104px] text-white sticky top-0 z-40 bg-white md:border-b border-[#EEEEEE]">
                {/* --- Tampilan Desktop --- */}
                <div className="hidden md:block">
                    <div className="flex flex-col">
                        <div className="items-center text-xs mb-3 bg-[#F2F4F7] py-[5px] h-[30px]">
                            <div className="container mx-auto lg:w-[1200px] md:px-4 lg:px-[0px] flex justify-between">
                                <a onClick={() => router.push('/')} className="text-[14px] font-[500] text-[#555555] hover:underline">Download aplikasinya di Playstore</a>
                                <div className="flex items-center gap-4 font-medium">
                                    {isLoggedIn ? (
                                        <div className="flex items-center gap-6">
                                            <a onClick={() => router.push('/my-store')} className="font-[500] hover:underline cursor-pointer text-[14px] text-[#555555] ">Toko Saya</a>
                                            <a onClick={() => router.push('/user-profile')} className="font-[500] text-[14px] text-[#555555]  hover:underline cursor-pointer text-right">{userName}</a>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <a onClick={() => router.push('/auth/register')} className="hover:underline cursor-pointer text-[14px] text-[#555555] font-[500]">Daftar</a>
                                            <div className="h-3 w-px bg-indigo-400"></div>
                                            <a onClick={() => router.push('/auth/login')} className="hover:underline cursor-pointer text-[14px] text-[#555555] font-[500]">Masuk</a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-8 container mx-auto lg:w-[1200px] md:px-4 lg:px-[0px] mt-[-3px] justify-between">
                            <h1 className="text-[40px] font-bold cursor-pointer shrink-0 text-[#4A52B2] w-[102px] mt-[0px] mr-7" onClick={() => window.location.href = '/'} style={{ letterSpacing: "-0.05em" }}>Zukses</h1>
                            <div ref={searchContainerRef} className="flex-grow relative">
                                <div className='flex items-center justify-between gap-9 mt-1.5'>
                                    <div className="flex items-start justify-between gap-3 w-full">
                                        <div className="w-full">
                                            <div className='relative flex-grow border border-[0.5px] border-[#555555] rounded-[5px]'>
                                                <input type="text" placeholder="Cari di Zukses" value={searchTerm} onFocus={() => { setIsSearchFocused(true); setDropdownMode('history'); }} onChange={(e) => { const newTerm = e.target.value; setSearchTerm(newTerm); setDropdownMode(newTerm.trim() === '' ? 'history' : 'suggestions'); }} onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }} className="rounded-[5px] w-full pl-4 pr-12 h-[40px] py-2.5 text-gray-900 bg-white border-0 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-[16px] placeholder:text-[#777777]" style={{ letterSpacing: "-0.05em" }} />
                                                <div className="absolute inset-y-0 right-0 flex items-center p-[2px]">
                                                    <button onClick={handleSearch} className="h-[36px] w-[57.9px] bg-[#01BDA4] flex items-center justify-center rounded-[5px]" title="Cari">
                                                        <SearchIcon className="w-[24px] h-[24px] text-white" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex items-center w-[400px] justify-between gap-4'>
                                            <div className='flex items-center jutify-left gap-3'>
                                                <button onClick={() => setProvinceModalOpen(true)} className="p-2 rounded-md pr-0" title="Filter Provinsi"><img src='/icon/filter-dark.svg' width={25} /></button>
                                                <div className="relative inline-block"><button className="p-2 rounded-md pr-0"><img src="/icon/heart.svg" width={25} /></button><span className="absolute bottom-6 left-6 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span></div>
                                                <div className="relative inline-block"><button className="p-2 rounded-md pr-0"><img src='/icon/message.svg' width={25} /></button><span className="absolute bottom-6 left-6 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span></div>

                                                {/* ================================================================== */}
                                                {/* == KUNCI UTAMA: Event handler diletakkan di DIV PEMBUNGKUS ini == */}
                                                {/* ================================================================== */}
                                                <div
                                                    className="relative inline-block"
                                                    onMouseEnter={() => setCartPopupVisible(true)}
                                                    onMouseLeave={() => setCartPopupVisible(false)}
                                                >
                                                    {/* Ikon Keranjang ada DI DALAM div pembungkus */}
                                                    <button className="p-2 rounded-md pr-0" onClick={() => router.push('/cart')}>
                                                        <img src='/icon/shopping-cart.svg' width={25} />
                                                    </button>
                                                    <span className="absolute bottom-5 left-5 bg-red-500 px-1 text-[10px] rounded-[5px] border border-white">{totalCartItems}</span>

                                                    {/* Popup juga ada DI DALAM div pembungkus */}
                                                    {isCartPopupVisible && <CartPopup items={mockCartItems} totalItems={totalCartItems} />}
                                                </div>

                                            </div>
                                            <button className="p-2 rounded-md bg-[#4A52B2] text-[13px] w-[90px] font-semibold text-white" title="Toko Saya">Akun Saya</button>
                                        </div>
                                    </div>
                                </div>
                                {isSearchFocused && <SearchSuggestions suggestions={suggestionsForDropdown} searchTerm={searchTerm} onSuggestionClick={handleSuggestionClick} />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Tampilan Mobile (Tidak ada perubahan) --- */}
                <div className='md:hidden h-full p-2 flex items-center justify-between gap-2 pr-8'>
                    <div className='relative h-[40px] flex items-center gap-2 px-3 border border-[#555555] rounded-[5px] w-full' onClick={() => setIsMobileSearchOpen(true)}>
                        <SearchIcon className='w-[14px] h-[14px] text-[#888888]' />
                        <p className='text-[#555555] text-sm'>{searchTerm || "Cari di Zukses"}</p>
                    </div>
                    <div className='flex items-center justify-left gap-2 w-1/3'>
                        <button onClick={() => setProvinceModalOpen(true)} className="p-1" title="Filter Provinsi"><img src='/icon/filter-dark.svg' className='w-[30px] h-[30px]' /></button>
                        <div className="relative inline-block">
                            <button className="p-1" onClick={() => router.push('/cart')}>
                                <img src='/icon/shopping-cart.svg' className='w-[30px] h-[30px]' />
                            </button>
                            <span className="absolute top-0 -right-3 -mt-0 mr-0 flex h-4 w-4 items-center justify-center text-[10px] bg-red-500 rounded-[5px] text-white px-4">{totalCartItems}</span>
                        </div>
                    </div>
                </div>
            </header >

            <ProvinceModal isOpen={isProvinceModalOpen} onClose={() => setProvinceModalOpen(false)} provinces={provinces} selectedProvinces={selectedProvinces} onApply={setSelectedProvinces} />
            {isMobileSearchOpen && <MobileSearch onClose={() => setIsMobileSearchOpen(false)} suggestions={searchSuggestions} searchHistory={searchHistory} onSearchSubmit={handleMobileSearchSubmit} />}
        </>
    );
}

export default Header;