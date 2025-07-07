'use client'
import Header from "components/Header";
import SiteFooter from "components/SiteFooter";
import DesktopSidebar from "components/userProfile/DesktopSidebar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function UserProfile({ children }: { children: React.ReactNode }) {
    const [title, setTitle] = useState<string>('Dashboard');
    const router = useRouter();
    console.log('router?.pathname', router?.pathname)
    useEffect(() => {
        if (router?.pathname === '/user-profile') {
            setTitle('Dashboard')
        } else if (router?.pathname === '/user-profile/profil') {
            setTitle('Profil Saya')
        } else if (router?.pathname === '/user-profile/address') {
            setTitle('Alamat Saya')
        }
    }, [router])
    return (
        <div className="bg-white">
            <div className='hidden md:block'>
                <Header />
            </div>
            <div className="min-h-screen font-sans p-10">
                <div className="container mx-auto p-0 md:p-0 md:px-0 flex rounded-lg min-h-[70vh] w-[1200px]">
                    <div>
                        <h3 className="font-bold w-55 border-r border-l border-t border-gray-300 text-center py-4 rounded-tl-lg rounded-tr-lg">Akun saya</h3>
                        <DesktopSidebar />
                    </div>
                    <main className="flex-grow bg-white rounded-tl-lg rounded-bl-lg mt-[6px]">
                        <div className="">
                            <h2 className="text-xl font-bold text-[#333333] mb-6 ">{title}</h2>
                            <div>
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <div className='border-t border-gray-200'>
                <main className="container mx-auto w-[1200px] px-[0px]">
                    <SiteFooter />
                </main>
                <div className="border-t border-gray-200 py-4 mt-8">
                    <p className="text-center text-xs text-dark-500 font-bold">
                        @2025, PT. Zukses Digital Indonesia. All Rights Reserved.
                    </p>
                </div>
            </div>
        </div>
    )
}
