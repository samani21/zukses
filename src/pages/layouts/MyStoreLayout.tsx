import React, { useState } from 'react';
import Sidebar from 'components/my-store/Sidebar';
import Header from 'components/my-store/Header';

// Anda perlu menginstal lucide-react: npm install lucide-react


// Komponen Utama (Contoh halaman Dashboard)
export default function MyStoreLayout({ children }: { children: React.ReactNode }) {
    const [isMobileOpen, setMobileOpen] = useState(false);
    const [isCollapsed, setCollapsed] = useState(false);

    return (
        <div className="flex h-screen">
            <Sidebar
                isMobileOpen={isMobileOpen}
                setMobileOpen={setMobileOpen}
                isCollapsed={isCollapsed}
                setCollapsed={setCollapsed}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header setMobileOpen={setMobileOpen} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
