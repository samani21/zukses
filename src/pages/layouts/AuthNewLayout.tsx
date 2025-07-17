import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';


export default function AuthNewLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [hiddeLogo, setHiddenLogo] = useState<boolean>(false);
    useEffect(() => {
        if (router.pathname === '/auth-new/login' || router.pathname === '/auth-new/register') {
            setHiddenLogo(true)
        }
    }, [router])
    return (
        <>
            <Head>
                <title>Masuk ke Zukses</title>
                <meta name="description" content="Halaman login Zukses" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex flex-col items-center justify-center md:min-h-screen bg-[#F1F5F9] font-sans md:p-4 " style={{ letterSpacing: "-0.04em" }}>
                <div
                    className={`${router?.pathname === '/auth-new/complete-registration' ? "md:w-[919px]" : "w-[419px]"} bg-white rounded-lg py-4 bg-red-500 md:shadow-[1px_1px_11px_rgba(0,0,0,0.1)] ${router?.pathname === '/auth-new/complete-registration' ? "pb-0 pl-0 pr-0 md:pb-4 md:pl-4 md:pr-4 " : "pb-4 pl-6 md:pl-0 "}`}
                >
                    <div className={`p-8 space-y-6 ${hiddeLogo ? 'pb-2' : ''} ${router?.pathname === '/auth-new/complete-registration' ? "pb-0 pl-0 pr-0 md:pb-4 md:pl-4 md:pr-4" : "pb-4"}`}>
                        {/* {
                            !hiddeLogo &&
                            <h1 className="text-[40px] font-semibold text-[#4A52B2] mb-8 text-center">
                                Zukses
                            </h1>
                        } */}
                        {children}
                    </div>
                    {
                        hiddeLogo &&
                        <div className="text-center text-[14px] md:text-[16px] text-[#444444] font-[500] max-w-md pb-8">
                            <p className="font-semibold">Jual Beli mudah, praktis dan aman hanya di zukses</p>
                            <p>Tempatnya Belanja semua kebutuhanmu</p>
                        </div>
                    }
                </div>
            </main>
        </>
    );
};

