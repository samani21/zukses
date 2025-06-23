'use client'
import Header from "components/my-store/Header";
import Sidebar from "components/my-store/Sidebar";
import { useState } from "react";

export default function MyStoreLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <div className="flex">
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <div className="flex-1 flex flex-col min-w-0">
                    <Header setIsSidebarOpen={setIsSidebarOpen} />
                    <main className="flex-1 p-4 sm:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}
