import React from 'react';
import { useRouter } from 'next/router';

// --- Icon Components ---
// Anda bisa mengganti path SVG di bawah ini jika memiliki file ikon yang lebih spesifik.

const TocoIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
    </svg>
);

const ClassifiedIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 256 256"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"><path d="M 47.999992,48 H 160 c 17.728,0 32,14.272 32,32 v 96 c 0,17.728 -14.272,32 -32,32 H 47.999992 c -17.728,0 -32,-14.272 -32,-32 V 80 c 0,-17.728 14.272,-32 32,-32 z" /><path d="m 192,160 48,32 V 64 l -48,32" /></g></svg>
);

const TransaksiIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const ProfilIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);


// --- Main NavBar Component ---

function MobileNavBar() {
    const router = useRouter();
    const currentPath = router.pathname;

    const navItems = [
        { name: 'Halam Utama', icon: TocoIcon, href: '/', match: (path: string) => path === '/' },
        { name: 'Transaksi', icon: TransaksiIcon, href: '/transaction', match: (path: string) => path.startsWith('/transaction') },
        { name: 'Video', icon: ClassifiedIcon, href: '/videos', match: (path: string) => path.startsWith('/videos') },
        {
            name: 'Akun Saya',
            icon: ProfilIcon,
            href: '/user-profile', // href fallback
            match: (path: string) => path.startsWith('/user-profile') || path.startsWith('/auth/login'),
            onClick: () => {
                const user = localStorage.getItem('user');
                const token = localStorage.getItem('token');
                if (user && token) {
                    router.push('/user-profile');
                } else {
                    router.push('/auth/login');
                }
            }
        },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
            <div className="flex justify-around items-center h-15">
                {navItems.map((item) => {
                    const isActive = item.match(currentPath);
                    const IconComponent = item.icon;

                    const navItemContent = (
                        <>
                            <div className={`flex items-center justify-center  rounded-full transition-all duration-200 ${isActive ? 'bg-yellow-400 shadow p-2' : 'bg-transparent'}`}>
                                <IconComponent className={`w-6 h-6 ${isActive ? 'text-gray-900' : 'text-gray-500'}`} />
                            </div>
                            <span className={`text-xs mt-1 ${isActive ? 'text-gray-900 font-semibold mb-4' : 'text-gray-500'}`}>
                                {item.name}
                            </span>
                        </>
                    );

                    // Render sebagai button jika ada fungsi onClick
                    if (item.onClick) {
                        return (
                            <button
                                key={item.name}
                                onClick={item.onClick}
                                className="flex flex-col items-center justify-center text-center focus:outline-none"
                            >
                                {navItemContent}
                            </button>
                        );
                    }

                    // Render sebagai link biasa
                    return (
                        <a href={item.href} key={item.name} className="flex flex-col items-center justify-center text-center">
                            {navItemContent}
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

export default MobileNavBar;