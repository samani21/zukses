import {  Menu, User } from 'lucide-react';
import React from 'react'

const Header = ({ setMobileOpen }: { setMobileOpen: (isOpen: boolean) => void; }) => {
    return (
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="flex items-center justify-between h-16 px-4 md:px-8">
                <button
                    className="md:hidden text-gray-600"
                    onClick={() => setMobileOpen(true)}
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="hidden md:flex items-center gap-2 text-gray-500 gap-4">
                    <div className="bg-[#EBEAFC] w-[30px] h-[30px] rounded-full border border-[#EBEAFC] flex items-center justify-center">
                        <p className='font-bold text-[#4A52B2] text-[14px] text-center'>HS</p>
                    </div>
                    <span className="font-bold text-[16px] text-[#333333]">Toko Hati Senang</span>
                </div>
                <div className="flex items-center gap-4 ">
                    <div className="relative">
                        <button className="flex items-center gap-2">
                            <User className="text-[#555555] w-[20px]" strokeWidth={3} />
                            <span className="hidden md:inline font-bold text-[#555555] text-[16px]">Irvan Mamala</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
export default Header