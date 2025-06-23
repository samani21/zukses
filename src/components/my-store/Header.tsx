import { Bell, ChevronDown, HelpCircle, Menu, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react'

const Header = ({ setIsSidebarOpen }: { setIsSidebarOpen: (isOpen: boolean) => void; }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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


    return (
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 shadow-sm">
            <div className="flex items-center">
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden mr-4 text-gray-600"><Menu size={24} /></button>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-800 cursor-pointer">Shopee Seller Centre</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-6">
                <button className="text-gray-600 hover:text-orange-500 p-2 rounded-full"><Bell size={22} /></button>
                <button className="hidden sm:block text-gray-600 hover:text-orange-500 p-2 rounded-full"><MessageCircle size={22} /></button>
                <button className="hidden sm:block text-gray-600 hover:text-orange-500 p-2 rounded-full"><HelpCircle size={22} /></button>
                <div className="hidden sm:block h-8 border-l border-gray-200"></div>
                <div className="relative" ref={dropdownRef}>
                    <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center cursor-pointer group">
                        <img src="https://placehold.co/32x32/cccccc/FFFFFF?text=A" alt="Avatar Pengguna" className="w-8 h-8 rounded-full" />
                        <div className='hidden md:block ml-3 text-left'>
                            <span className="text-sm font-medium text-gray-800 group-hover:text-orange-500">andikafirmanslah</span>
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
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Pengaturan Toko</a>
                            <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
export default Header