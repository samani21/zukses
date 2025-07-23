import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';


export default function AuthNewLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [hiddeLogo, setHiddenLogo] = useState<boolean>(false);
    useEffect(() => {
        if (router.pathname === '/auth/login' || router.pathname === '/auth/register') {
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

            <main className="md:flex flex-col items-center justify-center md:min-h-screen bg-[#F1F5F9] font-sans " style={{ letterSpacing: "-0.04em" }}>
                <div
                    className='bg-white rounded-lg pt-2 bg-red-500 md:shadow-[1px_1px_11px_rgba(0,0,0,0.1)] md:py-8 md:px-8'
                >
                    <div className={`${router?.pathname === '/auth/complete-registration' ? 'px-0 pt-10 md:px-3 md:pt-0' : 'px-3 py-8 pt-10 md:px-0 md:py-0 md:pt-0 '}`}>
                        {/* {
                            !hiddeLogo &&
                            <h1 className="text-[40px] font-semibold text-[#4A52B2] mb-8 text-center">
                                Zukses
                            </h1>
                        } */}
                        {children}
                        {
                            hiddeLogo &&
                            <div className="text-center text-[14px] md:text-[16px] text-[#444444] font-[500] max-w-md mt-4">
                                <p className="font-semibold">Jual Beli mudah, praktis dan aman hanya di zukses</p>
                                <p>Tempatnya Belanja semua kebutuhanmu</p>
                            </div>
                        }
                    </div>
                </div>
            </main>
        </>
    );
};

