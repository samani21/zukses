import React from 'react';
import { useRouter } from 'next/router';

function MobileNavBar() {
    const router = useRouter();
    const currentPath = router.pathname;

    const navItems = [
        { name: 'Home', icon: '/icon/Home (1).svg', href: '/', match: (path: string) => path === '/' },
        { name: 'Pesanan', icon: '/icon/grid 1.svg', href: '/video', match: (path: string) => path.startsWith('/video') },
        { name: 'Chat', icon: '/icon/chat_bubble.svg', href: '/promo', match: (path: string) => path.startsWith('/promo') },
        {
            name: 'Akun',
            icon: '/icon/user (1) 1.svg',
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

                    return item.name === 'Akun' ? (
                        <button
                            key={item.name}
                            onClick={item.onClick}
                            className="flex flex-col items-center justify-center text-center group focus:outline-none"
                        >
                            <img src={item?.icon} />
                            <span className={`text-[11px] mt-1 ${isActive ? 'text-blue-600' : 'text-[#555555]'}`}>{item.name}</span>
                        </button>
                    ) : (
                        <a href={item.href} key={item.name} className="flex flex-col items-center justify-center text-center group">
                            <img src={item?.icon} />
                            <span className={`text-[11px] mt-1 ${isActive ? 'text-blue-600' : 'text-[#555555]'}`}>{item.name}</span>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

export default MobileNavBar;
