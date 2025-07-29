import ShopProfileForm from 'components/my-store/profil/ShopProfileForm';
import { useShopProfile } from 'components/my-store/ShopProfileContext';
import MyStoreLayout from 'pages/layouts/MyStoreLayout'
import React from 'react'


function BasicInfoForm() {
    const shopProfil = useShopProfile();
    return (
        <div>
            <div className="min-h-screen font-sans text-gray-800">
                <main className="">
                    {/* Header */}
                    <div className="mb-6 border border-[#D2D4D8] bg-[#F3F5F7] p-4 rounded-[8px]">
                        <h1 className="text-[28px] text-[#333333] font-[800] tracking-[-0.02em]">Profil Toko</h1>
                        <p className="text-[#444444] mt-4 text-[14px]" style={{
                            lineHeight: "107%"
                        }}>
                            Ini wajah tokomu. Pastikan tampilannya bagus dan infonya lengkap, ya!
                        </p>
                    </div>

                    <div className='bg-white shadow-[1px_1px_10px_rgba(0,0,0,0.08)] rounded-[5px] border border-[#DFDFDF]'>
                        <ShopProfileForm shopProfil={shopProfil} />
                    </div>
                </main>
            </div>

        </div>
    );
}


export default function ProfileShopePage() {
    return (
        <MyStoreLayout>
            <BasicInfoForm />
        </MyStoreLayout>
    );
}