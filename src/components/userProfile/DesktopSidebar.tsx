import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { getUserInfo } from 'services/api/redux/action/AuthAction';
interface User {
    name?: string
    email?: string
    whatsapp?: string
    id?: number
    username?: string
    image?: string
    role?: string
}
interface NavItem {
    name: string;
    // icon: JSX.Element;
    url: string;
}

export const navItems: NavItem[] = [
    {
        name: 'Dashboard',
        // icon: <HomeIcon className="w-5 h-5" />,   // ← tag ditutup
        url: '/user-profile',
    },
    {
        name: 'Profil Saya',
        // icon: <ProfilIcon className="w-5 h-5" />,
        url: '/user-profile/profil',
    },
    {
        name: 'Alamat',
        // icon: <PinIcon className="w-5 h-5" />,
        url: '/user-profile/address',
    },
    {
        name: 'Rekening Bank',
        // icon: <CardIcon className="w-5 h-5" />,
        url: '/user-profile/bank',
    },
    {
        name: 'Pesanan Saya',
        // icon: <CartIcon className="w-5 h-5" />,
        url: '/user-profile/my-order',
    },
    {
        name: 'Menunggu Pembayaran',
        // icon: <CartIcon className="w-5 h-5" />,
        url: '/user-profile/payment',
    },
    {
        name: 'Keranjang Belanja',
        // icon: <CartIcon className="w-5 h-5" />,
        url: '/user-profile/cart',
    },
];
const DesktopSidebar = () => {
    const router = useRouter();
    console.log(router.pathname)
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
    return (
        <aside
            className="w-[243px] mr-[40px] hidden md:flex flex-col rounded-br-lg rounded-bl-lg bg-white border border-gray-300 border-t-0"
            style={{ boxShadow: '1px 1px 30px rgba(0, 0, 0, 0.1)' }}

        >
            <p className='font-bold text-[16px] text-[#333333] text-center pb-5 pt-7 border-b border-[#DDDDDD]' style={{ letterSpacing: "-4%", lineHeight: '121%' }}>Akun saya</p>
            <div className="flex items-center justify-center gap-3 p-3 border-b border-[#DDDDDD]">
                <div className='mt-2 mb-2'>
                    <div className='flex justify-center items-center'>
                        <img src={user?.image ?? "https://placehold.co/40x40/e2e8f0/333?text=Z"} alt="User Avatar" className="w-[49px] h-[49px] rounded-full" />
                    </div>
                    <h4 className="text-[16px] text-[#444444] font-[500] mt-1 text-center">{user?.name ?? "Nama Anda"}</h4>
                </div>
            </div>
            <nav className="flex-grow p-4 mt-[-5px]">
                <ul>
                    {navItems.map(item => (
                        <li key={item.name}>
                            <button
                                onClick={() => router.push(item?.url)}
                                className={`w-[209px] h-[32px] leading-[121%] flex items-center gap-3 text-left py-2 px-3 rounded-lg transition-colors ${router.pathname === item.url
                                    ? 'text-white  text-[14px] font-[500] bg-[#7952B3]'
                                    : 'text-[#444444] text-[14px]'
                                    }`}
                                style={
                                    router.pathname === item.url
                                        ? { boxShadow: '0 2 10px rgba(0, 0, 0, 0.39)' }
                                        : undefined
                                }
                            >
                                <span>{item.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="mt-10 px-4 py-6">
                {/* <button className="w-full flex items-center gap-3 text-left py-2 px-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-100 text-red-600" onClick={handleLogout}>
                    <LogoutIcon className="w-5 h-5" />
                    <span>Logout</span>
                </button> */}
                <div className='flex justify-center itmes-center'>
                    <button className="w-full border border-[#AAAAAA] p-2 rounded-[10px]" onClick={handleLogout}>
                        <span className='font-semibold text-[14px]'>Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default DesktopSidebar