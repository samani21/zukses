import React, { useEffect, useState } from 'react';
import Sidebar from 'components/my-store/Sidebar';
import Header from 'components/my-store/Header';
import Get from 'services/api/Get';
import { Response } from 'services/api/types';
import { ShopData, ShopProfileContext } from 'components/my-store/ShopProfileContext';
import Loading from 'components/Loading';
import ModalCompleteShopProfile from 'components/my-store/ModalCompleteShopProfile';

export default function MyStoreLayout({ children }: { children: React.ReactNode }) {
    const [isMobileOpen, setMobileOpen] = useState(false);
    const [isCollapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [shopProfil, setShopProfil] = useState<ShopData | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false)
    const fetchShopProfile = async () => {
        setLoading(true);
        const res = await Get<Response>('zukses', `shop-profile`);
        setLoading(false);

        if (res?.status === 'success' && res.data) {
            const data = res.data as unknown as ShopData;
            setShopProfil(data);
            const isModalClosed = localStorage.getItem('modalShopProfileClosed') === 'true';
            if (!data?.address) {
                if (!isModalClosed) {
                    setShowModal(true);
                }
            } else if (!data?.bank) {
                if (!isModalClosed) {
                    setShowModal(true);
                }
            } else if (!data?.delivery) {
                if (!isModalClosed) {
                    setShowModal(true);
                }
            }
        } else {
            const isModalClosed = localStorage.getItem('modalShopProfileClosed') === 'true';
            if (!isModalClosed) {
                setShowModal(true);
            }
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
                    shopProfil={shopProfil}
                    setShowModal={setShowModal}
                />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header setMobileOpen={setMobileOpen} shopProfil={shopProfil} />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 md:pt-4">
                        {children}
                    </main>
                </div>
            </div>
            {loading && <Loading />}
            {showModal && (
                <ModalCompleteShopProfile
                    onClose={() => {
                        setShowModal(false);
                        localStorage.setItem('modalShopProfileClosed', 'true');
                    }}
                    shopProfil={shopProfil}
                />

            )}
        </ShopProfileContext.Provider>
    );
}
