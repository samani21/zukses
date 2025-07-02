import React, { useEffect, useState } from 'react'
import { ArrowLeftIcon } from './Icon';
import MobileSettings from './MobileSettings';
import DesktopSidebar from './DesktopSidebar';
import ProfileForm from './ProfileForm';
import AddressPage from './AddressPage';
import BankAccountPage from './BankAccountPage';
import MyOrdersPage from './MyOrdersPage';
import Get from 'services/api/Get';
import { Response } from 'services/api/types';
type Props = {
    setHideNavbar: (value: boolean) => void;
}
interface ShopData {
    logo_url?: string;
    shop_name?: string;
    description?: string;
}
const SettingsLayout = ({ setHideNavbar }: Props) => {
    const [activePage, setActivePage] = useState('Profil');
    const [isMobile, setIsMobile] = useState(false);
    const [view, setView] = useState<'main' | 'form'>('main');

    const fetchShopProfile = async () => {
        const res = await Get<Response>('zukses', `shop/profile`)
        if (res?.status === 'success' && res.data) {
            const data = res?.data as ShopData
            localStorage.setItem('shopProfile', JSON.stringify(data));
        } else {
            console.warn('User profile tidak ditemukan atau gagal diambil')
        }
    }
    useEffect(() => {
        fetchShopProfile()
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        if (typeof window !== 'undefined') {
            checkMobile();
            window.addEventListener('resize', checkMobile);
            return () => window.removeEventListener('resize', checkMobile);
        }
    }, []);

    useEffect(() => {
        if (view === 'form') {
            setHideNavbar(true)
        } else {
            setHideNavbar(false)
        }
    }, [view]);

    const renderContent = () => {
        switch (activePage) {
            case 'Profil':
                return <ProfileForm />;
            case 'Alamat':
                return <AddressPage />;
            case 'Rekening Bank':
                return <BankAccountPage />;
            case 'Rekening':
                return <BankAccountPage />;
            case 'Pesanan Saya':
                return <MyOrdersPage />;
            // Add cases for other pages
            default:
                return <div>Konten untuk {activePage}</div>;
        }
    };

    const handleMobileNavigate = (page: string) => {
        setActivePage(page);
        setView('form');
    };

    if (isMobile) {
        if (view === 'main') {
            return <MobileSettings onNavigate={handleMobileNavigate} />;
        }
        return (
            <div className="w-full bg-white min-h-screen">
                <header className="bg-white p-4 shadow-sm sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView('main')}><ArrowLeftIcon className="w-6 h-6" /></button>
                        <h1 className="text-lg font-semibold">{activePage}</h1>
                    </div>
                </header>
                <div className="p-4">
                    {renderContent()}
                </div>
            </div>
        );
    }

    return (
        <div className="flex rounded-lg min-h-[80vh]">
            <DesktopSidebar activePage={activePage} setActivePage={setActivePage} />
            <main className="flex-grow p-6 bg-white rounded-tl-lg rounded-bl-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-6">{activePage}</h2>
                {renderContent()}
            </main>
        </div>
    );
};

export default SettingsLayout