import React, { useEffect, useState } from 'react';
import Sidebar from 'components/my-store/Sidebar';
import Header from 'components/my-store/Header';
import Get from 'services/api/Get';
import { Response } from 'services/api/types';
import { ShopData, ShopProfileContext } from 'components/my-store/ShopProfileContext';
import Loading from 'components/Loading';

export default function MyStoreLayout({ children }: { children: React.ReactNode }) {
    const [isMobileOpen, setMobileOpen] = useState(false);
    const [isCollapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [shopProfil, setShopProfil] = useState<ShopData | null>(null);
    console.log('shopProfil', shopProfil)
    const fetchShopProfile = async () => {
        setLoading(true);
        const res = await Get<Response>('zukses', `shop/profile`);
        setLoading(false);
        if (res?.status === 'success' && res.data) {
            const data = res?.data as ShopData;
            setShopProfil(data ?? null);
        } else {
            console.warn('User profile tidak ditemukan atau gagal diambil');
        }
    };

    useEffect(() => {
        fetchShopProfile();
    }, []);

    return (
        <ShopProfileContext.Provider value={shopProfil}>
            <div className="flex h-screen">
                <Sidebar
                    isMobileOpen={isMobileOpen}
                    setMobileOpen={setMobileOpen}
                    isCollapsed={isCollapsed}
                    setCollapsed={setCollapsed}
                />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header setMobileOpen={setMobileOpen} />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 md:pt-4">
                        {children}
                    </main>
                </div>
            </div>
            {loading && <Loading />}
        </ShopProfileContext.Provider>
    );
}
