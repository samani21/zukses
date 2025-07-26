import React, { useCallback } from 'react'
import { ArchiveBoxIcon, ArrowLeftIcon, ChevronRightIcon, Cog6ToothIcon, StarIcon, TruckIcon, UserCircleIcon, WalletIcon } from './Icon';
import { useRouter } from 'next/router';
const MobileSettings = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
    const orderIcons = [
        { icon: <WalletIcon className="w-6 h-6 text-gray-600" />, label: "Bayar" },
        { icon: <ArchiveBoxIcon className="w-6 h-6 text-gray-600" />, label: "Diproses" },
        { icon: <TruckIcon className="w-6 h-6 text-gray-600" />, label: "Dikirim" },
        { icon: <StarIcon className="w-6 h-6 text-gray-600" />, label: "Ulasan" },
    ];
    const accountIcons = [
        { icon: <img src='/icon/user.png' />, label: "Profil" },
        { icon: <img src='/icon/alamat.png' />, label: "Alamat" },
        { icon: <img src='/icon/bank.png' />, label: "Rekening" },
        { icon: <img src='/icon/kemanan.png' />, label: "Keamanan" },
    ];
    const router = useRouter();
    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('shopProfile');
        localStorage.removeItem('user');
        router.push('/');
    }, [router]);
    return (
        <div className="w-full bg-gray-50 md:hidden">
            {/* Header */}
            <header className="bg-white p-4 shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button><ArrowLeftIcon className="w-6 h-6" /></button>
                    <h1 className="text-lg font-semibold">Akun Saya</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button><UserCircleIcon className="w-6 h-6 text-gray-600" /></button>
                    <button><Cog6ToothIcon className="w-6 h-6 text-gray-600" /></button>
                </div>
            </header>
            {/* User Info */}
            <div className="p-4 bg-white">
                <div className="flex items-center gap-4 mb-4">
                    <img src="https://placehold.co/60x60/e2e8f0/333?text=IT" alt="Foto Profil" className="w-16 h-16 rounded-full border-2 border-white" />
                    <div className="flex-grow">
                        <h2 className="font-bold text-lg">Irvan Mamala</h2>
                        <button className="w-full bg-blue-600 text-white rounded-lg py-2 px-6 mt-1 font-semibold" onClick={() => router?.push('/my-store')}>Toko Saya</button>
                    </div>
                </div>
                <div className="bg-white p-3 rounded-lg border flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-blue-600">PLUS</h3>
                        <p className="text-xs text-gray-600">Nikmatin Gratis Ongkir tanpa batas!</p>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                </div>
            </div>

            {/* Pesanan Saya */}
            <div className="bg-white p-4 mt-2">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold">Pesanan Saya</h2>
                    <button className="flex items-center text-sm text-gray-500">
                        <span onClick={() => onNavigate('Pesanan Saya')}>Lihat Riwayat</span>
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex justify-around">
                    {orderIcons.map(item => (
                        <button key={item.label} className="flex flex-col items-center gap-1 text-xs text-gray-700">
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Pengaturan Akun */}
            <div className="bg-white p-4 mt-2">
                <h2 className="font-semibold mb-4">Pengaturan Akun</h2>
                <div className="grid grid-cols-4 gap-4">
                    {accountIcons.map(item => (
                        <button key={item.label} onClick={() => onNavigate(item.label)} className="flex flex-col items-center gap-2 p-2 border rounded-lg bg-gray-50 hover:bg-gray-100">
                            {item.icon}
                            <span className="text-xs text-center">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>
            <div className="p-4 mt-2" onClick={handleLogout}>
                <button className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition">
                    Logout
                </button>
            </div>
        </div>
    );
};
export default MobileSettings