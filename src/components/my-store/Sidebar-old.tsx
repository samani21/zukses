'use client';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import SidebarSection from './SidebarSection';

const SubNavLink = ({ text, url }: { text: string; url?: string }) => {
    const [currentPath, setCurrentPath] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentPath(window.location.pathname);
        }
    }, []);

    const isActive = currentPath === url;

    return (
        <a
            href={url ?? '#'}
            className={`block py-2 pr-4 pl-8 text-sm relative transition-colors duration-200 ${isActive ? 'text-blue-500' : 'text-gray-500 hover:text-gray-900'}`}
        >
            {isActive && <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-blue-500"></div>}
            <span className={isActive ? 'font-semibold' : 'font-normal'}>{text}</span>
        </a>
    );
};


const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void; }) => (
    <>
        <div
            className={`fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsOpen(false)}
        ></div>

        <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col z-40 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-bold text-blue-500">Menu Penjual</h2>
                <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-800">
                    <X size={24} />
                </button>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
                <SidebarSection title="Pesanan" defaultOpen={true}>
                    <SubNavLink text="Pesanan Saya" url="/my-store/my-order" />
                    <SubNavLink text="Pengiriman Massal" />
                    <SubNavLink text="Kelola Faktur Pesanan" />
                    <SubNavLink text="Pengembalian/Pembatalan" url="/my-store/return" />
                    <SubNavLink text="Pengaturan Pengiriman" />
                </SidebarSection>
                <SidebarSection title="Produk" defaultOpen={true}>
                    <SubNavLink text="Produk Saya" url="/my-store/product" />
                    <SubNavLink text="Tambah Produk Baru" url="/my-store/add-product" />
                    <SubNavLink text="Manajemen Merek" url="/my-store/brand" />
                </SidebarSection>

                <SidebarSection title="Pusat Promosi" defaultOpen={true}>
                    <SubNavLink text="Promosi Saya" />
                </SidebarSection>
            </nav>
        </aside>
    </>
);
export default Sidebar