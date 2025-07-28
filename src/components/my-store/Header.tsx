import { Menu, User, ChevronUp, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ShopData } from './ShopProfileContext';
import { getUserInfo } from 'services/api/redux/action/AuthAction';

interface HeaderProps {
    setMobileOpen: (isOpen: boolean) => void;
    shopProfil: ShopData | null;
}
interface User {
    name?: string;
    email?: string;
    whatsapp?: string;
    id?: number;
    username?: string;
    image?: string;
    role?: string;
}


const Header = ({ setMobileOpen, shopProfil }: HeaderProps) => {
    // State untuk mengontrol visibilitas menu dropdown
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Ref untuk menunjuk ke elemen div utama dari dropdown
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fungsi untuk membuka/menutup menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const currentUser = getUserInfo();
        if (currentUser) {
            setUser(currentUser);
        }
    }, []);
    // useEffect untuk menangani klik di luar menu
    useEffect(() => {
        // Fungsi yang akan dijalankan saat ada klik
        const handleClickOutside = (event: MouseEvent) => {
            // Jika menu terbuka dan klik terjadi di luar area dropdownRef
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false); // Tutup menu
            }
        };

        // Tambahkan event listener saat komponen di-mount
        document.addEventListener('mousedown', handleClickOutside);

        // Hapus event listener saat komponen di-unmount (cleanup)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); // Array dependensi kosong agar efek ini hanya berjalan sekali
    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('shopProfile');
        router.push('/');
    }, [router]);
    return (
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="flex items-center justify-between h-16 px-4 md:px-8">
                {/* Tombol menu untuk mobile */}
                <button
                    className="md:hidden text-gray-600"
                    onClick={() => setMobileOpen(true)}
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Logo dan Nama Toko untuk Desktop */}
                <div className="hidden md:flex items-center gap-4">
                    {
                        shopProfil?.logo_url ?
                            <img src={shopProfil?.logo_url} className='w-[30px] h-[30px] rounded-full' />
                            : <div className="bg-[#EBEAFC] w-[30px] h-[30px] rounded-full flex items-center justify-center">
                                <p className='font-bold text-[#4A52B2] text-[14px]'>HS</p>
                            </div>
                    }
                    <span className="font-bold text-[16px] text-[#333333]">{shopProfil?.shop_name}</span>
                </div>

                {/* Area Profil Pengguna */}
                <div className="flex items-center gap-4">
                    {/* Kontainer relatif untuk dropdown. Sekarang menggunakan ref. */}
                    <div
                        className="relative"
                        ref={dropdownRef}
                    >
                        {/* Tombol sekarang menggunakan onClick untuk membuka/menutup menu */}
                        <button
                            onClick={toggleMenu}
                            className="flex items-center gap-2 p-2 rounded-md"
                        >
                            <User className="text-[#555555] w-[20px]" strokeWidth={3} />
                            <span className="hidden md:inline font-bold text-[#555555] text-[16px]">{user?.name}</span>
                            {/* Ikon berubah tergantung pada apakah menu terbuka atau tidak */}
                            {isMenuOpen ? <ChevronUp className="w-4 h-4 text-[#555555]" /> : <ChevronDown className="w-4 h-4 text-[#555555]" />}
                        </button>

                        {/* Menu Dropdown, ditampilkan jika isMenuOpen bernilai true */}
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-1 w-64 bg-white rounded-[10px] shadow-[1px_1px_20px_rgba(0,0,0,0.08)] overflow-hidden border border-[#DDDDDD] z-30">
                                <div className="p-4 flex flex-col items-center border-b border-[#DDDDDD]">
                                    <div className="w-[50px] h-[50px] rounded-full bg-[#EBEAFC] border border-[#EBEAFC] flex items-center justify-center mb-3">
                                        <span className="text[21px] tracking-[-0.02em] font-bold text-[#4A52B2]">IM</span>
                                    </div>
                                    <p className="font-bold text-[17px] text-[#666666] tracking-[0px]" style={{
                                        lineHeight: "120%"
                                    }}>{user?.name}</p>
                                </div>
                                <nav className="py-2 text-[14px] px-4 font-[500] text-[#666666]">
                                    <div onClick={() => router?.push('/')} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">Kembali ke halaman Utama</div>
                                    <div className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">Lihat Toko Onlineku</div>
                                    <div onClick={() => router?.push('/user-profile/profil')} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">Akun Saya</div>
                                    <div onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer border-t border-[#DDDDDD] mt-1 pt-2">Logout</div>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
