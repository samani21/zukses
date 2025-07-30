
import CourierSettingsPage from 'components/my-store/delivery/CourierSettingsPage';
import { useShopProfile } from 'components/my-store/ShopProfileContext';
import MyStoreLayout from 'pages/layouts/MyStoreLayout'
import React from 'react'


function DeliveryForm() {
    const shopProfil = useShopProfile();
    console.log('shopProfil', shopProfil)
    return (
        <div>
            <div className="min-h-screen font-sans text-gray-800">
                <main className="">
                    {/* Header */}
                    <div className="mb-6 border border-[#D2D4D8] bg-[#F3F5F7] p-4 rounded-[8px]">
                        <h1 className="text-[28px] text-[#333333] font-[800] tracking-[-0.02em]">Pengaturan Jasa Kirim</h1>
                        <p className="text-[#444444] mt-4 text-[14px]" style={{
                            lineHeight: "107%"
                        }}>
                            Atur kurir sesuai kebutuhan tokomu.<br />Pilih layanan pengiriman yang kamu pakai biar pembeli bisa checkout tanpa ribet.
                        </p>
                    </div>

                    <div className=''>
                        <CourierSettingsPage shopProfil={shopProfil} />
                    </div>
                </main>
            </div>

        </div>
    );
}


export default function DeliveryPage() {
    return (
        <MyStoreLayout>
            <DeliveryForm />
        </MyStoreLayout>
    );
}