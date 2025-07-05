'use client'
import Header from "components/Header";
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
                        <h3 className="font-bold mb-2">Akun saya</h3>
                        <DesktopSidebar />
                    </div>
                    <main className="flex-grow p-6 bg-white rounded-tl-lg rounded-bl-lg">
                        <div className="border border-gray-300 rounded-lg">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 p-5 border-b border-gray-300">{title}</h2>
                            <div className="p-5">
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
