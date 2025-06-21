import React from 'react';
import { useRouter } from 'next/router';

const HomeIcon = ({ isActive }: { isActive?: boolean }) => (
    <svg className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);
const FoodIcon = ({ isActive }: { isActive?: boolean }) => (
    <svg className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const PromoIcon = ({ isActive }: { isActive?: boolean }) => (
    <svg className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 8v-5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01" />
    </svg>
);
const TransactionIcon = ({ isActive }: { isActive?: boolean }) => (
    <svg className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const AccountIcon = ({ isActive }: { isActive?: boolean }) => (
    <svg className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

function MobileNavBar() {
    const router = useRouter();
    const currentPath = router.pathname;

    const navItems = [
        { name: 'Home', icon: HomeIcon, href: '/', match: (path: string) => path === '/' },
        { name: 'Video', icon: FoodIcon, href: '/video', match: (path: string) => path.startsWith('/video') },
        { name: 'Promo', icon: PromoIcon, href: '/promo', match: (path: string) => path.startsWith('/promo') },
        { name: 'Transaksi', icon: TransactionIcon, href: '/transactions', match: (path: string) => path.startsWith('/transactions') },
        {
            name: 'Akun',
            icon: AccountIcon,
            href: '/user-profile',
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
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-t-md z-40">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = item.match(currentPath);
                    const IconComponent = item.icon;

                    return item.name === 'Akun' ? (
                        <button
                            key={item.name}
                            onClick={item.onClick}
                            className="flex flex-col items-center justify-center text-center group focus:outline-none"
                        >
                            <IconComponent isActive={isActive} />
                            <span className={`text-xs mt-1 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{item.name}</span>
                        </button>
                    ) : (
                        <a href={item.href} key={item.name} className="flex flex-col items-center justify-center text-center group">
                            <IconComponent isActive={isActive} />
                            <span className={`text-xs mt-1 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{item.name}</span>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

export default MobileNavBar;
