import { ShopProfile } from 'components/types/ShopProfile';
import { Bell, ChevronDown, HelpCircle, Menu, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react'

const Header = ({ setIsSidebarOpen }: { setIsSidebarOpen: (isOpen: boolean) => void; }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [shopProfile, setShopProfile] = useState<ShopProfile | null>(null)
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    // Menutup dropdown saat klik di luar
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);
    useEffect(() => {
        const dataString = localStorage.getItem('shopProfile');
        if (dataString) {
            const parsedData = JSON.parse(dataString);
            setShopProfile(parsedData)
        }
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    }, [router]);
    return (
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 shadow-sm">
            <div className="flex items-center">
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden mr-4 text-gray-600"><Menu size={24} /></button>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-800 cursor-pointer">Zukses Seller Centre</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-6">
                <button className="text-gray-600 hover:text-blue-500 p-2 rounded-full"><Bell size={22} /></button>
                <button className="hidden sm:block text-gray-600 hover:text-blue-500 p-2 rounded-full"><MessageCircle size={22} /></button>
                <button className="hidden sm:block text-gray-600 hover:text-blue-500 p-2 rounded-full"><HelpCircle size={22} /></button>
                <div className="hidden sm:block h-8 border-l border-gray-200"></div>
                <div className="relative" ref={dropdownRef}>
                    <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center cursor-pointer group">
                        <img src={shopProfile?.logo_url || "https://placehold.co/32x32/cccccc/FFFFFF?text=Z"} alt="Avatar Pengguna" className="w-8 h-8 rounded-full" />
                        <div className='hidden md:block ml-3 text-left'>
                            <span className="text-sm font-medium text-gray-800 group-hover:text-blue-500">{shopProfile?.shop_name || "Belum ada Akun"}</span>
                        </div>
                        <ChevronDown size={18} className={`ml-1 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                            <a href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsDropdownOpen(false);
                                    router.push('/my-store/basic-info')
                                }}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Informasi Dasar</a>
                            <a onClick={() => router.push('/user-profile')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Kembali</a>
                            <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100" onClick={handleLogout}>Logout</a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
export default Header