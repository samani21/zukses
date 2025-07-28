'use client';

import {
    CreditCard,
    Home,
    LineChart,
    Package,
    Package2,
    PanelLeft,
    Store,
    Truck,
    User,
    Wallet,
} from 'lucide-react';
import React, { useEffect } from 'react';
import NavItem from './NavItem';
import { usePathname } from 'next/navigation';

interface NavItemData {
    title: string;
    icon: React.ElementType;
    href: string;
    active?: boolean;
    children?: NavItemData[];
}

const sidebarNavItems: NavItemData[] = [
    {
        title: 'Dashboard',
        icon: Home,
        href: '/my-store',
    },
    {
        title: 'Data Toko',
        icon: Store,
        href: '#',
        children: [
            { title: 'Profil Toko', icon: User, href: '/my-store/basic-info' },
            { title: 'Alamat Toko', icon: User, href: '#' },
            { title: 'Rekening Bank', icon: CreditCard, href: '#' },
            { title: 'Pengaturan Jasa Kirim', icon: Truck, href: '#' },
            { title: 'Performa Toko', icon: Truck, href: '#' },
            { title: 'Kesehatan Toko', icon: Truck, href: '#' },
        ],
    },

    {
        title: 'Produk',
        icon: Package2,
        href: '#',
        children: [
            { title: 'Produk Saya', icon: Package, href: '#' },
            { title: 'Tambah Produk', icon: Package, href: '#' }
        ],
    },
    {
        title: 'Data Penjualan',
        icon: LineChart,
        href: '#',
        children: [
            { title: 'Penjualan Saya', icon: Wallet, href: '#' },
            { title: 'Belum Bayar', icon: Wallet, href: '#' },
            { title: 'Perlu Dikirim', icon: Package, href: '#' },
            { title: 'Dikirim', icon: Package, href: '#' },
            { title: 'Selesai', icon: Package, href: '#' },
            { title: 'Dibatalkan', icon: Package, href: '#' },
            { title: 'Pengembalian', icon: Package, href: '#' },
        ],
    },
    {
        title: 'Pendapatan',
        icon: Wallet,
        href: '#',
        children: [
            { title: 'Penghasilan Saya', icon: Wallet, href: '#' },
            { title: 'Saldo Saya', icon: Wallet, href: '#' },
        ],
    },
];

const Sidebar = ({
    isMobileOpen,
    setMobileOpen,
    isCollapsed,
    setCollapsed,
}: {
    isMobileOpen: boolean;
    setMobileOpen: (isOpen: boolean) => void;
    isCollapsed: boolean;
    setCollapsed: (isCollapsed: boolean) => void;
}) => {
    const pathname = usePathname();

    // Fungsi pengecekan aktif
    const isItemActive = (item: NavItemData): boolean => {
        // Jika punya children, cek apakah pathname === child.href
        if (item.children?.length) {
            const hasActiveChild = item.children.some((child) =>
                pathname === child.href
            );
            return hasActiveChild;
        }

        // Kalau tidak punya children, aktif hanya jika path persis cocok
        return pathname === item.href;
    };

    useEffect(() => {
        if (isMobileOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }

        // Cleanup ketika unmount
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [isMobileOpen]);

    useEffect(() => {
        const nav = document.querySelector('.navbar-scrollbar');
        if (!nav) return;

        let timeout: NodeJS.Timeout;

        const showScrollbar = () => {
            nav.classList.remove('hide-scrollbar');
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                nav.classList.add('hide-scrollbar');
            }, 2000); // sembunyikan setelah 2 detik tidak ada interaksi
        };

        // Tambahkan event listeners
        nav.addEventListener('scroll', showScrollbar);
        nav.addEventListener('mouseenter', showScrollbar);
        nav.addEventListener('mousemove', showScrollbar);
        nav.addEventListener('mouseleave', () => {
            timeout = setTimeout(() => {
                nav.classList.add('hide-scrollbar');
            }, 2000);
        });

        // Inisialisasi sebagai disembunyikan
        nav.classList.add('hide-scrollbar');

        return () => {
            nav.removeEventListener('scroll', showScrollbar);
            nav.removeEventListener('mouseenter', showScrollbar);
            nav.removeEventListener('mousemove', showScrollbar);
            nav.removeEventListener('mouseleave', () => {
                timeout = setTimeout(() => {
                    nav.classList.add('hide-scrollbar');
                }, 2000);
            });
            clearTimeout(timeout);
        };
    }, []);

    return (
        <>
            {/* Overlay untuk mobile */}
            <div
                className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300 ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setMobileOpen(false)}
            ></div>

            {/* Konten Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-white shadow-[1px_1px_10px_rgba(0,0,0,0.08)] z-40 flex flex-col transition-all duration-300 ease-in-out md:relative
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 ${isCollapsed ? 'w-20' : 'w-64'}`}
            >
                {/* Header Sidebar */}
                <div
                    className={`p-4 bg-[#563D7C] flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'
                        }`}
                >
                    {!isCollapsed && (
                        <h1 className="text-[25px] font-bold text-white">Zukses <span className='font-[400]'>Seller</span></h1>
                    )}
                    <button
                        onClick={() => setCollapsed(!isCollapsed)}
                        className="hidden md:block p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        <PanelLeft
                            className={`transition-transform text-[#D0BBF0] duration-300 ${isCollapsed ? 'rotate-180' : ''
                                }`} strokeWidth={3} size={20}
                        />
                    </button>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="md:hidden p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        <PanelLeft
                            className={`transition-transform text-[#D0BBF0] duration-300 ${isCollapsed ? 'rotate-180' : ''
                                }`} strokeWidth={3} size={20}
                        />
                    </button>
                </div>

                {/* Navigasi */}
                <nav className=" flex-1 md:p-2 space-y-2 overflow-y-auto mt-2 px-3 md:px-3 pb-6 navbar-scrollbar">
                    {sidebarNavItems.map((item) => (
                        <NavItem
                            key={item.title}
                            item={{
                                ...item,
                                active: isItemActive(item),
                                children: item.children?.map((child) => ({
                                    ...child,
                                    active: pathname === child.href,
                                })),
                            }}
                            isCollapsed={isCollapsed}
                        />

                    ))}
                </nav>

                {/* Footer */}
                <div className="hidden p-6 border-t border-[#DFDFDF]/80">
                    <div className={`space-y-2 ${isCollapsed ? 'hidden' : 'block'}`}>
                        <button className="w-full text-center py-2.5 h-[40px] border border-[#CED0E5] text-[#444444] font-semibold terackig-[-0.02em] rounded-[5px] hover:bg-purple-600 hover:text-white transition-colors text-[14px]">
                            Kunjungi Toko
                        </button>
                        <button className="w-full text-center py-2.5 h-[40px] border border-[#CED0E5] text-[#444444] font-semibold terackig-[-0.02em] rounded-[5px] hover:bg-gray-100  transition-colors text-[14px]">
                            Logout
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
