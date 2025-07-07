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
        name: 'Profil',
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
        <aside className="w-55 mr-[40px]  hidden md:flex flex-col rounded-br-lg rounded-bl-lg bg-white border border-gray-300">
            <div className="flex items-center justify-center gap-3 p-3 border-b border-gray-300">
                <div >
                    <img src={user?.image ?? "https://placehold.co/40x40/e2e8f0/333?text=Z"} alt="User Avatar" className="w-20 h-20 rounded-full" />
                    <h4 className=" text-lg mt-3 text-center">{user?.name ?? "Nama Anda"}</h4>
                </div>
            </div>
            <nav className="flex-grow p-2">
                <ul>
                    {navItems.map(item => (
                        <li key={item.name}>
                            <button
                                onClick={() => router.push(item?.url)}
                                className={`w-full flex items-center gap-3 text-left py-2 px-3 rounded-lg transition-colors ${router.pathname === item.url
                                    ? 'text-dark-600 font-bold'
                                    : 'text-dark-600 hover:bg-gray-100'
                                    }`}
                            >
                                {/* {item.icon} */}
                                <span>{item.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="mt-4 pt-4 px-3 p-2">
                {/* <button className="w-full flex items-center gap-3 text-left py-2 px-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-100 text-red-600" onClick={handleLogout}>
                    <LogoutIcon className="w-5 h-5" />
                    <span>Logout</span>
                </button> */}
                <div className='flex justify-center itmes-center'>
                    <button className="w-full border border-gray-300 p-2 rounded-sm" onClick={handleLogout}>
                        <span className='font-bold'>Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default DesktopSidebar