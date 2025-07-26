import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { getUserInfo } from 'services/api/redux/action/AuthAction';

// Interface untuk data Pengguna
interface User {
    name?: string
    email?: string
    whatsapp?: string
    id?: number
    username?: string
    image?: string
    role?: string
}

// Interface untuk item Navigasi, ditambahkan 'children' opsional untuk item bersarang
interface NavItem {
    name: string;
    url: string;
    children?: NavItem[]; // Untuk sub-menu
}

// --- Data Navigasi dipecah menjadi grup sesuai gambar ---

// Grup Profil
const profileItems: NavItem[] = [
    {
        name: 'Profil saya',
        url: '/user-profile/profil',
    },
    {
        name: 'Alamat Pengiriman',
        url: '/user-profile/address',
    },
    {
        name: 'Rekening Bank',
        url: '/user-profile/bank',
    },
];

// Grup Pesanan (dengan struktur bersarang)
const orderItems: NavItem[] = [
    { name: 'Pesanan Saya', url: '/user-profile/my-order', },
    { name: 'Belum Bayar', url: '/user-profile/my-order/pending', },
    { name: 'Sedang Dikemas', url: '/user-profile/my-order/packing', },
    { name: 'Dikirim', url: '/user-profile/my-order/shipped', },
    { name: 'Selesai', url: '/user-profile/my-order/completed', },
    { name: 'Dibatalkan', url: '/user-profile/my-order/cancelled', },
    { name: 'Pengembalian', url: '/user-profile/my-order/refund', },

];

// Grup Aktivitas Lainnya
const activityItems: NavItem[] = [
    { name: 'Keranjang Belanja', url: '/user-profile/cart' },
    { name: 'Produk Favorit', url: '/user-profile/favorites' },
    { name: 'Terakhir Dilihat', url: '/user-profile/history' },
    { name: 'Saldo zukses', url: '/user-profile/balance' },
    { name: 'Chat', url: '/user-profile/chat' },
    { name: 'Lacak Pengiriman', url: '/user-profile/track' },
];


const DesktopSidebar = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('shopProfile');
        router.push('/');
    }, [router]);

    useEffect(() => {
        const currentUser = getUserInfo()
        if (currentUser) {
            setUser(currentUser)
        }
    }, [])

    // Fungsi untuk me-render setiap item navigasi
    const renderNavItem = (item: NavItem, isSubItem: boolean = false) => (
        <li key={item.name} className='px-2.5'>
            <button
                onClick={() => router.push(item.url)}
                className={` flex items-center text-left mb-[0px] px-4 transition-colors text-[14px] font-[400] my-1 ${isSubItem ? 'pl-6' : '' // Tambahkan indentasi jika ini sub-item
                    } ${router.pathname === item.url
                        ? 'bg-[#00AA5B] w-[209px] rounded-[15px] h-[30px] font-semibold text-[#FFFFFF]' // Contoh styling untuk item aktif
                        : 'text-[#444444] hover:bg-gray-100 rounded-[15px] h-[30px]  w-[209px]'
                    }`}
            >
                <span className="tracking-[0px]" style={{
                    lineHeight: "120%"
                }}>{item.name}</span>
            </button>
        </li>
    );

    return (
        <aside className="w-[230px] mr-[40px] hidden md:flex flex-col bg-white overflow-hidden rounded-[8px] border border-[#DFDFDF] shadow-[1px_1px_10px_rgba(0,0,0,0.08)]">
            {/* Header Profil dengan Latar Belakang Hijau */}
            <div className="flex items-center gap-3 p-4 bg-[#7952B3] h-[60px] text-white">
                {
                    user?.image ? <img src={user?.image} className='w-[40px] h-[40px] rounded-full' /> : <div className='w-[40px] h-[40px] rounded-full border border-[#BBBBBB] bg-[#F2F4F7] text-[#4A52B2] flex items-center justify-center font-bold text-[17px]'>
                        {/* Mengambil inisial nama, contoh: "Irvan Mamala" -> "IM" */}
                        {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                }
                <h4 className="text-[16px] font-bold tracking-[-0.02em]">{user?.name ?? "Zukses"}</h4>
            </div>

            {/* Kontainer untuk semua menu item */}
            <div className='flex flex-col flex-grow mt-4'>
                <nav className="flex-grow">
                    {/* Grup Profil */}
                    <div className='mb-2'>
                        <ul>
                            {profileItems.map(item => renderNavItem(item))}
                        </ul>
                    </div>
                    <div className='h-1 mb-[10px]  border-t border-[#DDDDDD]' />
                    {/* Grup Pesanan */}
                    <div className='mb-2'>
                        <ul>
                            {orderItems.map(item => renderNavItem(item))}
                        </ul>
                    </div>

                    <div className='h-1 mb-[10px]  border-t border-[#DDDDDD]' />

                    {/* Grup Aktivitas */}
                    <div className='mb-2'>
                        <ul>
                            {activityItems.map(item => renderNavItem(item))}
                        </ul>
                    </div>
                </nav>
                <div className='w-full h-1 mb-[10px] border-t border-[#DDDDDD] mb-2' />
                {/* Tombol Aksi di Bagian Bawah */}
                <div className="mt-auto p-2 px-4  space-y-2 mb-[20px]">
                    <button
                        onClick={() => router.push('/my-shop')}
                        className="w-full bg-[#F78900] h-[40px] text-white font-semibold text-[14px] p-2 rounded-[5px] hover:bg-orange-600 transition-colors"
                    >
                        Toko Saya
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full bg-[#F6E9F0] text-[#563D7C]   h-[40px] font-semibold text-[14px] p-2 rounded-[5px] hover:bg-gray-200 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default DesktopSidebar;
