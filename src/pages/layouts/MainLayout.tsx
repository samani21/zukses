'use client'
import Header from "components/Header";
import MobileNavBar from "components/MobileNavBar";
export default function MainLayout({ children }: { children: React.ReactNode }) {


    return (
        <div className="font-sans">

            <Header />
            <main className="hidden md:block container mx-auto">
                <div className="rounded-lg shadow">
                    {children}
                </div>
            </main>
            <MobileNavBar />
        </div>
    );
}
