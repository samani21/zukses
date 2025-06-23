import ActionItem from 'components/my-store/ActionItem'
import Card from 'components/my-store/Card'
import CardHeader from 'components/my-store/CardHeader'
import { Box, ChevronRight, Star, Target } from 'lucide-react'
import MyStoreLayout from 'pages/layouts/MyStoreLayout'
import React from 'react'


const index = () => {
    return (
        <MyStoreLayout>
            {/* --- Bar Notifikasi --- */}
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm mb-6 flex items-start">
                <Star size={18} className="mr-3 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Notifikasi data demo diaktifkan. Mohon lakukan verifikasi data ulang dengan tim terkait.</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* --- Kolom Utama (Kiri & Tengah) --- */}
                <div className="col-span-1 lg:col-span-2 space-y-6">
                    {/* Yang Perlu Dilakukan */}
                    <Card>
                        <CardHeader title="Yang Perlu Dilakukan" />
                        <div className="flex flex-wrap justify-center md:justify-around divide-y md:divide-y-0 md:divide-x divide-gray-200 mt-2">
                            <div className="w-1/2 md:w-auto p-2"><ActionItem value="0" title="Perlu Diproses" /></div>
                            <div className="w-1/2 md:w-auto p-2"><ActionItem value="0" title="Telah Diproses" /></div>
                            <div className="w-1/2 md:w-auto p-2"><ActionItem value="0" title="Dibatalkan" /></div>
                            <div className="w-1/2 md:w-auto p-2"><ActionItem value="0" title="Pengembalian" /></div>
                        </div>
                    </Card>

                    {/* Performa Toko */}
                    <Card>
                        <CardHeader title="Performa Toko" linkText="Lihat Semua" />
                        <div className="flex flex-wrap justify-center divide-y md:divide-y-0 md:divide-x divide-gray-200 mt-4">
                            <div className="w-1/2 md:flex-1 text-center p-2"><p className="text-xl sm:text-2xl font-bold">Rp0</p><p className="text-xs mt-1">Penjualan</p></div>
                            <div className="w-1/2 md:flex-1 text-center p-2"><p className="text-xl sm:text-2xl font-bold">0</p><p className="text-xs mt-1">Pesanan</p></div>
                            <div className="w-1/2 md:flex-1 text-center p-2"><p className="text-xl sm:text-2xl font-bold">0</p><p className="text-xs mt-1">Produk Dilihat</p></div>
                            <div className="w-1/2 md:flex-1 text-center p-2"><p className="text-xl sm:text-2xl font-bold">0</p><p className="text-xs mt-1">Kunjungan</p></div>
                            <div className="w-full md:flex-1 text-center p-2"><p className="text-xl sm:text-2xl font-bold">0,00%</p><p className="text-xs mt-1">Tingkat Konversi</p></div>
                        </div>
                    </Card>

                    {/* Iklan Shopee */}
                    <Card>
                        <CardHeader title="Iklan Shopee" linkText="Lainnya" />
                        <div className="flex flex-col sm:flex-row items-center">
                            <div className="flex-1 text-center sm:text-left">
                                <h4 className="font-semibold text-gray-800">Maksimalkan penjualanmu dengan Iklan Shopee</h4>
                                <p className="text-sm text-gray-500 mt-2">Dengan Iklan Shopee, tokomu bisa menarik lebih banyak pengunjung.</p>
                            </div>
                            <button className="bg-blue-500 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-600 transition-colors duration-200 mt-4 sm:mt-0 sm:ml-8 flex-shrink-0">
                                Pasang Iklan
                            </button>
                        </div>
                    </Card>

                    {/* Affiliate & Livestream */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader title="Affiliate Marketing Solution" linkText="Lainnya" />
                            <h4 className="font-semibold text-blue-500">Tingkatkan penjualan dengan promosi dari Affiliate</h4>
                            <p className="text-sm text-gray-500 mt-2 mb-4">Atur Komisi untuk Mempromosikan Tokomu.</p>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p>• <span className="font-bold">50%</span> maks. komisi</p>
                                <p>• <span className="font-bold">4%</span> Komisi Penjual +25% Komisi Ekstra</p>
                            </div>
                        </Card>
                        <Card className="bg-blue-50">
                            <CardHeader title="Livestream" linkText="Lihat semua" />
                            <div className="flex items-center">
                                <div className="flex-1" style={{ backgroundImage: "url(/image/ilustrasi-live.png)", height: "350px", backgroundSize: "cover", backgroundPosition: "center",padding:"10px" }}>
                                    <h4 className="font-semibold text-dark">Buat Livestream</h4>
                                    <p className="text-sm text-white mt-1">Tingkatkan konversi hingga 2x!</p>
                                    <button className="mt-4 bg-blue-500 text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-blue-600">
                                        Mulai Live
                                    </button>
                                </div>
                                {/* <img src="/image/ilustrasi-live.png" alt="Ilustrasi Livestream" className="w-24 sm:w-28 h-auto flex-shrink-0" /> */}
                            </div>
                        </Card>
                    </div>

                    {/* Promosi */}
                    <Card>
                        <CardHeader title="Promosi" linkText="Lainnya" />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <img src="/image/banner1.webp" alt="Promosi 1" className="rounded-md w-full h-auto object-cover" />
                            <img src="/image/banner2.jpg" alt="Promosi 2" className="rounded-md w-full h-auto object-cover" />
                            <img src="/image/banner3.jpg" alt="Promosi 3" className="rounded-md w-full h-auto object-cover" />
                        </div>
                    </Card>

                </div>

                {/* --- Kolom Samping (Kanan) --- */}
                <div className="col-span-1 lg:col-span-1 space-y-6">
                    {/* Performa Toko */}
                    <Card>
                        <CardHeader title="Performa Toko" />
                        <a href="#" className="flex items-center space-x-4 group p-2 rounded-lg hover:bg-gray-50">
                            <Target size={32} className="text-green-500 flex-shrink-0" />
                            <div className='flex-1'>
                                <h4 className="font-semibold text-green-600">Sangat Baik</h4>
                                <p className="text-sm text-gray-500">Performa Toko memenuhi target.</p>
                            </div>
                            <ChevronRight size={20} className="text-gray-400 group-hover:text-gray-600" />
                        </a>
                    </Card>

                    {/* Berita */}
                    <Card>
                        <CardHeader title="Berita" linkText="Lihat Semua" />
                        <div className="text-center py-8">
                            <Box size={48} className="mx-auto text-gray-300" />
                            <p className="mt-4 text-sm text-gray-500">Belum ada informasi baru.</p>
                        </div>
                    </Card>

                    {/* Misi Penjual */}
                    <Card>
                        <CardHeader title="Misi Penjual" linkText="Lainnya" />
                        <div className="space-y-4">
                            <div className="border p-4 rounded-lg">
                                <p className="text-sm font-semibold text-gray-700">Selesaikan 1 pesanan</p>
                                <p className="text-xs text-gray-500 mt-1">Dapatkan 2 koin untuk fitur Naikkan Produk.</p>
                                <button className="mt-3 w-full text-center text-sm py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Mulai</button>
                            </div>
                            <div className="border p-4 rounded-lg">
                                <p className="text-sm font-semibold text-gray-700">Buat 1 Voucher Toko</p>
                                <p className="text-xs text-gray-500 mt-1">Dapatkan koin untuk semua misi.</p>
                                <button className="mt-3 w-full text-center text-sm py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Mulai</button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </MyStoreLayout>
    )
}

export default index