import Head from 'next/head';


export default function AuthNewLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Head>
                <title>Masuk ke Zukses</title>
                <meta name="description" content="Halaman login Zukses" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex flex-col items-center justify-center min-h-screen bg-[#F1F5F9] font-sans p-4" style={{ letterSpacing: "-0.04em" }}>
                {/* Logo Utama */}
                <h1 className="text-[40px] font-semibold text-[#4A52B2] mb-8">
                    Zukses
                </h1>

                {/* Kotak Form Login */}
                {children}

                {/* Teks Footer */}
                <div className="mt-8 text-center text-[17px] text-[#444444] font-[500] max-w-md">
                    <p className="font-semibold">Jual Beli mudah, praktis dan aman hanya di zukses</p>
                    <p>Tempatnya Belanja semua kebutuhanmu</p>
                </div>
            </main>
        </>
    );
};

