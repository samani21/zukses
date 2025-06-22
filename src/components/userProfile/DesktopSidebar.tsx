import React, { useCallback, useEffect, useState } from 'react'
import { LogoutIcon } from './Icon';
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

const DesktopSidebar = ({ activePage, setActivePage }: { activePage: string, setActivePage: (page: string) => void }) => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const navItems = [
        { name: 'Profil', icon: <img src='/icon/user-1.png' className="w-5 h-5" /> },
        { name: 'Alamat', icon: <img src='/icon/alamat-1.png' className="w-5 h-5" /> },
        { name: 'Rekening Bank', icon: <img src='/icon/bank-1.png' className="w-5 h-5" /> },
        { name: 'Pesanan Saya', icon: <img src='/icon/pesanan_saya-1.png' className="w-5 h-5" /> },
        { name: 'PIN Toko', icon: <img src='/icon/pin-1.png' className="w-5 h-5" /> },
        { name: 'Toko Saya', icon: <img src='/icon/toko_saya-1.png' className="w-5 h-5" /> }
    ];
    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    }, [router]);

    useEffect(() => {
        const currentUser = getUserInfo()
        if (currentUser) {
            setUser(currentUser)
        }
    }, [])
    return (
        <aside className="w-64 mr-[10px] p-4 hidden md:flex flex-col rounded-tr-lg rounded-br-lg bg-white">
            <div className="flex items-center gap-3 p-3 border-b mb-4">
                <img src={user?.image ?? "https://placehold.co/40x40/e2e8f0/333?text=Z"} alt="User Avatar" className="w-10 h-10 rounded-full" />
                <div>
                    <h4 className="font-bold text-sm">{user?.name ?? "Nama Anda"}</h4>
                    <button onClick={() => setActivePage('Profil')} className="text-xs text-gray-500 hover:text-blue-600">Edit Profil</button>
                </div>
            </div>
            <nav className="flex-grow">
                <ul>
                    {navItems.map(item => (
                        <li key={item.name}>
                            <button
                                onClick={() => setActivePage(item.name)}
                                className={`w-full flex items-center gap-3 text-left py-2 px-3 rounded-lg transition-colors ${activePage === item.name
                                    ? 'bg-blue-100 text-blue-600 font-semibold'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="mt-4 pt-4 border-t border-gray-300">
                <button className="w-full flex items-center gap-3 text-left py-2 px-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-100 text-red-600" onClick={handleLogout}>
                    <LogoutIcon className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default DesktopSidebar