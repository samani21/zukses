"use client"; // Diperlukan karena menggunakan hook dan state

import React, { useEffect, useRef, useState } from 'react';
import ProvinceModal from './ProvinceModal';
import { useRouter } from 'next/router';

const SearchIcon = ({ className }: { className?: string }) => (
    <svg className={className || "w-5 h-5 text-gray-500"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
);
const HistoryIcon = ({ className }: { className?: string }) => (
    <svg className={className || "w-5 h-5 text-gray-400"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);
const CartIcon = ({ className }: { className?: string }) => (
    <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
);
const FilterIcon = ({ className }: { className?: string }) => (
    <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L12 14.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 016 17v-2.586L3.293 6.707A1 1 0 013 6V4z"></path></svg>
);
const UserIcon = ({ className }: { className?: string }) => (
    <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
);
const ChevronLeftIcon = ({ className }: { className?: string }) => (
    <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
);

interface Suggestion { type: 'suggestion' | 'store' | 'protection' | 'history'; text: string; location?: string; icon?: string; }
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

// --- Komponen-komponen lainnya (Tidak ada perubahan) ---
const SearchSuggestions = ({ suggestions, searchTerm, onSuggestionClick }: { suggestions: Suggestion[], searchTerm: string, onSuggestionClick: (suggestion: Suggestion) => void }) => {
    const filteredSuggestions = searchTerm ? suggestions.filter(s => s.text.toLowerCase().includes(searchTerm.toLowerCase())) : suggestions;
    if (filteredSuggestions.length === 0) { return null; }
    return (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
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
const MobileSearch = ({ onClose, suggestions, searchHistory, onSearchPerformed }: { onClose: () => void, suggestions: Suggestion[], searchHistory: Suggestion[], onSearchPerformed: (newHistory: string[]) => void }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Suggestion[] | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const handleSearch = () => { if (!searchTerm.trim()) return; const newHistory = saveSearchTerm(searchTerm); onSearchPerformed(newHistory); const results = suggestions.filter(s => s.text.toLowerCase().includes(searchTerm.toLowerCase())); setSearchResults(results); setShowSuggestions(false); };
    const handleSuggestionClick = (suggestion: Suggestion) => { const newHistory = saveSearchTerm(suggestion.text); onSearchPerformed(newHistory); setSearchTerm(suggestion.text); setSearchResults([suggestion]); setShowSuggestions(false); };
    const suggestionsToShow = searchTerm.trim() === '' ? searchHistory : (searchResults === null ? suggestions : searchResults);
    return (
        <div className="fixed inset-0 bg-white z-50">
            <div className="flex items-center p-2 border-b">
                <button onClick={onClose} className="p-2 text-gray-600"><ChevronLeftIcon /></button>
                <div className="relative flex-grow">
                    <input type="text" placeholder="Cari di Zukses..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setSearchResults(null); setShowSuggestions(true); }} onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }} className="w-full h-10 pl-4 pr-10 text-gray-900 focus:outline-none" autoFocus />
                    <button onClick={handleSearch} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"><SearchIcon /></button>
                </div>
            </div>
            <div className="p-4 relative">
                <div className="relative"><div className="absolute w-full -mt-4">{showSuggestions && <SearchSuggestions suggestions={suggestionsToShow} searchTerm={searchTerm} onSuggestionClick={handleSuggestionClick} />}</div></div>
            </div>
        </div>
    );
};


const Header = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [isProvinceModalOpen, setProvinceModalOpen] = useState(false);
    const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [userName, setUserName] = useState('');
    const [searchResults, setSearchResults] = useState<Suggestion[] | null>(null);
    const [searchHistory, setSearchHistory] = useState<Suggestion[]>([]);
    const [dropdownMode, setDropdownMode] = useState<'history' | 'suggestions'>('history');
    const searchContainerRef = useRef<HTMLDivElement>(null);
    console.log('searchResults', searchResults);
    const provinces = ["Aceh", "Bali", "Banten", "Bengkulu", "DI Yogyakarta", "DKI Jakarta", "Gorontalo", "Jambi", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Kalimantan Barat", "Kalimantan Selatan", "Kalimantan Tengah", "Kalimantan Timur", "Kalimantan Utara", "Kepulauan Bangka Belitung", "Kepulauan Riau", "Lampung", "Maluku", "Maluku Utara", "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Papua", "Papua Barat", "Riau", "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tengah", "Sulawesi Tenggara", "Sulawesi Utara", "Sumatera Barat", "Sumatera Selatan", "Sumatera Utara"];
    const searchSuggestions: Suggestion[] = [{ type: 'protection', text: 'Proteksi Gadget' }, { type: 'suggestion', text: 'laptop second' }, { type: 'store', text: 'Laptop Murah ID', location: 'Jakarta', icon: 'https://placehold.co/24x24/7C3AED/FFFFFF?text=L' }, { type: 'suggestion', text: 'laptop rtx' },];

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
        const historySuggestions: Suggestion[] = newHistory.map(term => ({
            type: 'history' as const,
            text: term,
        }));
        setSearchHistory(historySuggestions);
    };
    const handleSearch = () => {
        const newHistory = saveSearchTerm(searchTerm); updateHistoryState(newHistory); if (!searchTerm.trim()) { setSearchResults(searchSuggestions); } else { const results = searchSuggestions.filter(s => s.text.toLowerCase().includes(searchTerm.toLowerCase())); setSearchResults(results); } setIsSearchFocused(false);
    };
    const handleSuggestionClick = (suggestion: Suggestion) => {
        const newHistory = saveSearchTerm(suggestion.text); updateHistoryState(newHistory); setSearchTerm(suggestion.text); setSearchResults([suggestion]); setIsSearchFocused(false);
    };
    const suggestionsForDropdown = dropdownMode === 'history' ? searchHistory : searchSuggestions;

    return (
        <>
            <header className="text-white shadow-lg sticky top-0 z-40 bg-gradient-to-b from-[#52357B] to-[#7952B3] h-27">
                <div className="container mx-auto w-[1200px] px-[0px]">
                    <div className="hidden md:flex flex-col py-2 py-2">
                        <div className="flex justify-between items-center text-xs mb-3">
                            <a onClick={() => router.push('/')} className="hover:underline">Download aplikasinya di Playstore</a>
                            <div className="flex items-center gap-4 font-medium">
                                {isLoggedIn ? (
                                    <div className="flex items-center gap-4">
                                        <a onClick={() => router.push('/my-store')} className="hover:underline">Toko Saya</a>
                                        <div className="h-3 w-px bg-indigo-400"></div>
                                        <a onClick={() => router.push('/user-profile')} className="hover:underline font-semibold">{userName}</a>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <a onClick={() => router.push('/auth/register')} className="hover:underline">Daftar</a>
                                        <div className="h-3 w-px bg-indigo-400"></div>
                                        <a onClick={() => router.push('/auth/login')} className="hover:underline">Masuk</a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <h1 className="text-4xl font-bold cursor-pointer shrink-0 mt-[-20px]" onClick={() => window.location.href = '/'}>Zukses</h1>
                            <div ref={searchContainerRef} className="flex-grow relative">
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-grow">
                                        <input type="text" placeholder="Cari barang yang Anda inginkan" value={searchTerm}
                                            onFocus={() => { setIsSearchFocused(true); setSearchResults(null); setDropdownMode('history'); }}
                                            onChange={(e) => { const newTerm = e.target.value; setSearchTerm(newTerm); setSearchResults(null); setDropdownMode(newTerm.trim() === '' ? 'history' : 'suggestions'); }}
                                            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                                            className="w-full pl-4 pr-12 py-2.5 text-gray-900 bg-white border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        />
                                        <div className="absolute inset-y-0 h-10 right-0 flex items-center mt-[2px] mr-[2px]"><button onClick={handleSearch} className="h-full px-3 bg-gradient-to-b from-[#52357B] to-[#7952B3] rounded-sm hover:bg-indigo-800 flex items-center justify-center" title="Cari"><SearchIcon className="w-5 h-5 text-white" /></button></div>
                                    </div>
                                    <button onClick={() => setProvinceModalOpen(true)} className="p-2 hover:bg-indigo-800 rounded-md" title="Filter Provinsi"><FilterIcon className="w-6 h-6 text-white" /></button>

                                    {isLoggedIn && (
                                        <>
                                            <button className="p-2 hover:bg-indigo-800 rounded-md" title="Keranjang Belanja">
                                                <CartIcon className="w-6 h-6 text-white" />
                                            </button>
                                            <button className="p-2 hover:bg-indigo-800 rounded-md" title="Toko Saya">
                                                <UserIcon className="w-6 h-6 text-white" />
                                            </button>
                                        </>
                                    )}
                                </div>
                                <div className="mt-1.5 text-xs text-indigo-200">Cari di <a onClick={(e) => { e.preventDefault(); setProvinceModalOpen(true); }} className="font-semibold text-white hover:underline">{selectedProvinces.length > 0 ? selectedProvinces.join(', ') : 'semua Provinsi'}</a></div>
                                {isSearchFocused && <SearchSuggestions suggestions={suggestionsForDropdown} searchTerm={searchTerm} onSuggestionClick={handleSuggestionClick} />}
                            </div>
                        </div>
                    </div>

                    <div className="md:hidden flex items-center justify-between py-3">
                        <h1 className="text-2xl font-bold" onClick={() => window.location.href = '/'}>Zukses</h1>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsMobileSearchOpen(true)} className="p-2 hover:bg-indigo-800 rounded-full"><SearchIcon className="w-6 h-6 text-white" /></button>
                            <button className="p-2 hover:bg-indigo-800 rounded-full"><CartIcon className="w-6 h-6 text-white" /></button>
                            {isLoggedIn ? (<button onClick={() => window.location.href = '/user-profile'} className="p-2 hover:bg-indigo-800 rounded-full"><UserIcon className="w-6 h-6 text-white" /></button>) : (<a onClick={() => router.push('/auth/login')} className="bg-indigo-700 px-4 py-1.5 rounded-md text-sm font-semibold">Masuk</a>)}
                        </div>
                    </div>
                </div>
            </header>

            <ProvinceModal isOpen={isProvinceModalOpen} onClose={() => setProvinceModalOpen(false)} provinces={provinces} selectedProvinces={selectedProvinces} onApply={setSelectedProvinces} />
            {isMobileSearchOpen && <MobileSearch onClose={() => setIsMobileSearchOpen(false)} suggestions={searchSuggestions} searchHistory={searchHistory} onSearchPerformed={updateHistoryState} />}
        </>
    );
}

export default Header;