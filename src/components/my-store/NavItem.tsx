'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface NavItemData {
    title: string;
    icon: React.ElementType;
    href: string;
    active?: boolean;
    children?: NavItemData[];
    onClick?: (e: React.MouseEvent) => void; // tambahkan ini
}

const NavItem = ({ item, isCollapsed }: { item: NavItemData; isCollapsed: boolean }) => {
    const Icon = item.icon;

    // Deteksi apakah ada child yang aktif
    const hasActiveChild = item.children?.some((child) => child.active);

    // State dropdown terbuka
    const [isOpen, setIsOpen] = useState(true);

    // Jika ada child aktif, buka dropdown otomatis
    useEffect(() => {
        if (hasActiveChild) {
            setIsOpen(true);
        }
    }, [hasActiveChild]);

    // Jika item punya anak dan sidebar tidak collapsed
    if (item.children && !isCollapsed) {
        return (
            <div>
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={`w-full flex items-center justify-between text-left px-4 py-2.5 text-[#3D3D4E] text-[14px] font-semibold rounded-[5px] transition-colors hover:bg-purple-100`}
                >
                    <span>{item.title}</span>
                    <ChevronRight
                        className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? 'rotate-90' : ''
                            }`}
                    />
                </button>

                {isOpen && (
                    <div className="pl-4 mt-1 space-y-1">
                        {item.children.map((child) => (
                            <Link
                                key={child.title}
                                href={child.href}
                                onClick={child.onClick}
                                className={`block px-4 py-2  text-[14px] rounded-lg transition-colors
        ${child.active
                                        ? 'bg-[#EFEFFD] text-[#22268B] font-bold border-[#CED0E5] border'
                                        : 'text-[#3D3D4E] hover:bg-purple-100'}`}
                            >
                                {child.title}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Untuk menu utama atau saat sidebar collapse
    return (
        <Link
            href={item.href}
            title={isCollapsed ? item.title : undefined}
            className={`flex items-center px-4 py-2.5 rounded-[5px] text-[#3D3D4E] text-[14px]  transition-colors font-semibold duration-200
        ${item.active ? 'bg-[#EFEFFD] text-[#22268B] font-bold border-[#CED0E5] border' : ' hover:bg-purple-100'}
        ${isCollapsed ? 'justify-center' : ''}`}
        >
            {isCollapsed && (
                <Icon className={`w-5 h-5 ${item.active ? 'text-black' : 'text-gray-500'}`} />
            )}
            {!isCollapsed && <span>{item.title}</span>}
        </Link>
    );
};

export default NavItem;
