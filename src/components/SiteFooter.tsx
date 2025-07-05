import React, { type FC, type ReactNode } from 'react';

// Komponen Ikon SVG untuk keuntungan (bisa diganti dengan ikon yang lebih spesifik)
interface BenefitIconProps {
    children: ReactNode;
}

const BenefitIcon: FC<BenefitIconProps> = ({ children }) => (
    <div className="w-6 h-6 mr-3 flex-shrink-0">{children}</div>
);

const DiscountIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="text-green-500" fill="none" width="24" height="24" viewBox="0 0 16 16">
        <path fill="currentColor" d="M8 8.5h-.07c-1.14-.15-2.51-.68-2.51-2.38C5.42 5.1 6.1 4 7.99 4s2.51 1.36 2.57 2.08c.02.28-.18.52-.46.54a.51.51 0 0 1-.54-.45c-.02-.19-.19-1.16-1.58-1.16c-1.04 0-1.57.38-1.57 1.12c0 .38 0 1.18 1.64 1.39a.503.503 0 0 1-.07 1Z" /><path fill="currentColor" d="M8 12c-1.9 0-2.51-1.36-2.57-2.08c-.02-.28.18-.52.46-.54c.27-.02.51.18.54.45c.02.19.19 1.16 1.58 1.16c1.04 0 1.57-.38 1.57-1.12c0-.38 0-1.18-1.64-1.39a.503.503 0 0 1-.43-.56c.04-.27.29-.47.56-.43c1.14.15 2.51.68 2.51 2.38c0 1.02-.68 2.12-2.57 2.12Z" /><path fill="currentColor" d="M8 15c-3.86 0-7-3.14-7-7s3.14-7 7-7s7 3.14 7 7s-3.14 7-7 7M8 2C4.69 2 2 4.69 2 8s2.69 6 6 6s6-2.69 6-6s-2.69-6-6-6" /><path fill="currentColor" d="M8 13c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5s.5.22.5.5v9c0 .28-.22.5-.5.5" />
    </svg>
);

const PromoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <g fill="none" stroke="currentColor" stroke-width="1"><path stroke-width="1.5" d="M10.51 3.665a2 2 0 0 1 2.98 0l.7.782a2 2 0 0 0 1.601.663l1.05-.058a2 2 0 0 1 2.107 2.108l-.058 1.049a2 2 0 0 0 .663 1.6l.782.7a2 2 0 0 1 0 2.981l-.782.7a2 2 0 0 0-.663 1.601l.058 1.05a2 2 0 0 1-2.108 2.107l-1.049-.058a2 2 0 0 0-1.6.663l-.7.782a2 2 0 0 1-2.981 0l-.7-.782a2 2 0 0 0-1.601-.663l-1.05.058a2 2 0 0 1-2.107-2.108l.058-1.049a2 2 0 0 0-.663-1.6l-.782-.7a2 2 0 0 1 0-2.981l.782-.7a2 2 0 0 0 .663-1.601l-.058-1.05A2 2 0 0 1 7.16 5.053l1.049.058a2 2 0 0 0 1.6-.663z" /><path stroke-linejoin="round" stroke-width="2.25" d="M9.5 9.5h.01v.01H9.5zm5 5h.01v.01h-.01z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m15 9l-6 6" /></g>
    </svg>
);


const ShippingIcon: FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18h1a1 1 0 001-1v-3l-4-4h-3v5.5" />
    </svg>
);

const ChatIcon: FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.839 8.839 0 01-4.083-.982A4.938 4.938 0 006.6 15.22a.5.5 0 00.5-.279l.433-.866A6.961 6.961 0 0110 14c3.866 0 7-2.686 7-6s-3.134-6-7-6-7 2.686-7 6c0 1.561.623 3.003 1.667 4.118a.5.5 0 00-.16.397l-.23 1.152a.5.5 0 00.584.584l1.152-.23a.5.5 0 00.397-.16A6.96 6.96 0 014 10c0-3.313 3.134-6 7-6s7 2.687 7 6z" clipRule="evenodd" />
    </svg>
);

const SiteFooter: FC = () => {
    const categoriesCol1 = [
        "Pakaian Wanita", "Pakaian Pria", "Elektronik", "Perawatan & Kecantikan",
        "Handphone & Aksesoris", "Fashion Muslim", "Perlengkapan Rumah", "Sepatu Pria",
        "Sepatu Wanita", "Alat Tulis", "Buku & Majalah", "Komputer & Aksesoris",
        "Mobil", "Sepeda Motor", "Tas Wanita", "Tas Pria", "Jam Tangan"
    ];

    const categoriesCol2 = [
        "Ibu & Bayi", "Fashion Bayi & Anak", "Olahraga & Outdoor", "Makanan & Minuman",
        "Audio", "Koper & Tas Travel", "Aksesoris Fashion", "Hewan Peliharaan",
        "Kamera & Drone", "Kesehatan"
    ];

    return (
        <footer className="bg-white mt-8">
            <div className="container mx-auto py-6 px-0 sm:px-6 lg:px-0 relative">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                    <div>
                        <h3 className="font-bold text-base text-gray-800 mb-4">Kategori</h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                            <ul className="space-y-2">
                                {categoriesCol1.map((category) => (
                                    <li key={category}>
                                        <a href="#" className="text-sm text-dark-600 font-bold hover:text-blue-600">{category}</a>
                                    </li>
                                ))}
                            </ul>
                            <ul className="space-y-2">
                                {categoriesCol2.map((category) => (
                                    <li key={category}>
                                        <a href="#" className="text-sm text-dark-600 font-bold hover:text-blue-600">{category}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Kolom Keuntungan Aplikasi */}
                    <div className="space-y-4 flex-shrink-0">
                        <h3 className="font-bold text-base text-gray-800">Nikmatin keuntungan spesial di aplikasi:</h3>
                        <ul className="space-y-3 text-sm text-gray-700">
                            <li className="flex items-center"><BenefitIcon><DiscountIcon /></BenefitIcon> Diskon 70%* hanya di aplikasi</li>
                            <li className="flex items-center"><BenefitIcon><PromoIcon /></BenefitIcon> Promo khusus aplikasi</li>
                            <li className="flex items-center"><BenefitIcon><ShippingIcon /></BenefitIcon> Gratis Ongkir tiap hari</li>
                        </ul>
                        <p className="text-sm text-gray-600 pt-2">Buka aplikasi dengan scan QR atau klik tombol:</p>
                        <div className="flex items-center gap-4">
                            <img
                                src="https://placehold.co/100x100/000000/FFFFFF?text=QR"
                                alt="QR Code"
                                className="w-24 h-24 rounded-lg"
                            />
                            <div className="flex flex-col space-y-2">
                                <a href="#"><img src="/icon/Google_Play_Store_badge_EN.svg.webp" alt="Google Play" className="h-10 mb-4" width={120} /></a>
                                <a href="#"><img src="/icon/apple_apps_store.png" alt="App Store" className="h-10" width={120} /></a>
                            </div>
                        </div>
                        <a href="#" className="text-sm text-green-500 hover:underline pt-2 inline-block">Pelajari Selengkapnya →</a>
                    </div>
                </div>

                <button className="absolute bottom-0 right-0 flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50">
                    <ChatIcon />
                    <span className="font-medium text-sm text-gray-800">Chat</span>
                </button>
            </div>
        </footer>
    );
};

export default SiteFooter;
