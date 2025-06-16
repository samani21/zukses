import React from 'react'

function SiteFooter() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-8 hidden md:block">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    {/* Logo & Desc */}
                    <div className="md:col-span-1">
                        <img src="/logo/logo.png" alt="Zukses Logo" className="h-8 mb-4" />
                        <p className="text-sm text-gray-500">Toko online dengan sensasi belanja ala mall.</p>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 md:grid-cols-3 col-span-1 md:col-span-3 gap-8">
                        <div>
                            <h3 className="font-bold text-gray-800 mb-4">Bantuan</h3>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li><a href="#" className="hover:text-blue-600">Telepon</a></li>
                                <li><a href="#" className="hover:text-blue-600">Email</a></li>
                                <li><a href="#" className="hover:text-blue-600">Bantuan</a></li>
                                <li><a href="#" className="hover:text-blue-600">Layanan Pengaduan</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 mb-4">Info Zukses</h3>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li><a href="#" className="hover:text-blue-600">Tentang Zukses</a></li>
                                <li><a href="#" className="hover:text-blue-600">Siaran Pers</a></li>
                                <li><a href="#" className="hover:text-blue-600">Kabar Terbaru</a></li>
                                <li><a href="#" className="hover:text-blue-600">Karir</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 mb-4">Kerja Sama</h3>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li><a href="#" className="hover:text-blue-600">Affiliate Program</a></li>
                                <li><a href="#" className="hover:text-blue-600">Jual di Zukses</a></li>
                                <li><a href="#" className="hover:text-blue-600">B2B Program</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Download & Social */}
                    <div>
                        <h3 className="font-bold text-gray-800 mb-4">Download Aplikasi</h3>
                        <div className="space-y-3">
                            <a href="#"><img src="/icon/Google_Play_Store_badge_EN.svg.webp" alt="Google Play" className="h-10 mb-4" width={120} /></a>
                            <a href="#"><img src="/icon/apple_apps_store.png" alt="App Store" className="h-10" width={120} /></a>
                        </div>
                        <h3 className="font-bold text-gray-800 mt-6 mb-4">Ikuti Kami</h3>
                        <div className="flex space-x-4">
                            <img src="/icon/fb.svg" alt="FB" className="h-6" />
                            <img src="/icon/ig.svg" alt="IG" className="h-6" />
                            <img src="/icon/twitter.svg" alt="X" className="h-6" />
                            <img src="/icon/yt.svg" alt="YT" className="h-6" />
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-200 mt-8 pt-6">
                    <h3 className="font-bold text-gray-800 mb-4">Metode Pembayaran</h3>
                    <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4">
                        <img src="/icon/alfamart-2.webp" alt="Alfamart" className="h-6" />
                        <img src="/icon/bni.webp" alt="BNI" className="h-6" />
                        <img src="/icon/bri.webp" alt="BRI" className="h-6" />
                        <img src="/icon/dana.webp" alt="DANA" className="h-6" />
                        <img src="/icon/gopay.webp" alt="GOPAY" className="h-6" />
                        <img src="/icon/home-credit.webp" alt="HOMECREDIt" className="h-6" />
                    </div>
                </div>
                <div className="border-t border-gray-200 mt-8 pt-6">
                    <h3 className="font-bold text-gray-800 mb-4">Jasa Pengiriman</h3>
                    <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4">
                        <img src="/icon/JNE.webp" alt="JNE" className="h-6" />
                        <img src="/icon/ID_express.webp" alt="IDEXPRESS" className="h-6" />
                        <img src="/icon/ID_express.webp" alt="JNT" className="h-6" />
                        <img src="/icon/JNT.webp" alt="JNT" className="h-6" />
                        <img src="/icon/Ninjavan.webp" alt="NINJA" className="h-6" />
                        <img src="/icon/Gosend.webp" alt="GoSend" className="h-6" />
                        <img src="/icon/Grab_Exp.webp" alt="GrabEXP" className="h-6" />
                    </div>
                </div>
            </div>
            <div className="bg-gray-200 py-4">
                <p className="text-center text-xs text-gray-600">© 2024 Zukses. All rights reserved.</p>
            </div>
        </footer>
    );
}


export default SiteFooter