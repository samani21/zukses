'use client'
import Header from "components/Header";
import MobileNavBar from "components/MobileNavBar";
import Head from "next/head";

export default function MainLayout({ children }: { children: React.ReactNode }) {


    return (
        <div className="bg-gray-100 font-sans">
            <Head>
                <title>Zukses Plaza</title>
                <meta name="description" content="Deskripsi singkat situs kamu" />
                <link rel="icon" href="/logo/favicon.ico" type="image/x-icon"></link>
            </Head>
            <Header />
            <main className="container mx-auto">
                <div className="bg-white  rounded-lg shadow">
                    {children}
                </div>
            </main>
            <MobileNavBar />
        </div>
    );
}
