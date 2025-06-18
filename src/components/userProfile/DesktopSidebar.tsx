import React from 'react'
import { CreditCardIcon, CubeIcon, MapPinIcon, ShieldCheckIcon, StoreIcon, UserCircleIcon } from './Icon';

const DesktopSidebar = ({ activePage, setActivePage }: { activePage: string, setActivePage: (page: string) => void }) => {
    const navItems = [
        { name: 'Profil', icon: <UserCircleIcon className="w-5 h-5" /> },
        { name: 'Alamat', icon: <MapPinIcon className="w-5 h-5" /> },
        { name: 'Rekening Bank', icon: <CreditCardIcon className="w-5 h-5" /> },
        { name: 'Pesanan Saya', icon: <CubeIcon className="w-5 h-5" /> },
        { name: 'PIN Toko', icon: <ShieldCheckIcon className="w-5 h-5" /> },
        { name: 'Toko Saya', icon: <StoreIcon className="w-5 h-5" /> }
    ];

    return (
        <aside className="w-64 border-r border-gray-300 p-4 hidden md:flex flex-col">
            <div className="flex items-center gap-3 p-3 border-b border-gray-300 mb-4">
                <img src="https://placehold.co/40x40/e2e8f0/333?text=I" alt="User Avatar" className="w-10 h-10 rounded-full" />
                <div>
                    <h4 className="font-bold text-sm">Irvan Mamala</h4>
                    <button onClick={() => setActivePage('Profil')} className="text-xs text-gray-500 hover:text-blue-600">Edit Profil</button>
                </div>
            </div>
            <nav>
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
        </aside>
    );
};

export default DesktopSidebar