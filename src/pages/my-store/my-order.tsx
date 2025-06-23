import EmptyState from 'components/my-store/MyOrder/EmptyState';
import NavTab from 'components/my-store/MyOrder/NavTab';
import { ChevronDown } from 'lucide-react';
import MyStoreLayout from 'pages/layouts/MyStoreLayout';
import React, { useEffect, useState } from 'react'

// --- Data Dummy untuk Contoh ---
const dummyOrders = [
    {
        id: 'ID240623ABCDE',
        product: {
            name: 'Kemeja Lengan Panjang Pria Premium Quality',
            image: 'https://placehold.co/100x100/e2e8f0/334155?text=Produk',
            variant: 'Warna: Abu-abu, Ukuran: L'
        },
        total: 'Rp185.000',
        status: 'Selesai',
        countdown: '-',
    },
    {
        id: 'ID240622FGHIJ',
        product: {
            name: 'Sepatu Sneakers Pria Casual Original Import',
            image: 'https://placehold.co/100x100/e2e8f0/334155?text=Produk',
            variant: 'Warna: Hitam, Ukuran: 42'
        },
        total: 'Rp250.000',
        status: 'Dikirim',
        countdown: '3 hari lagi',
    },
];


interface Order {
    id: string;
    product: {
        name: string;
        image: string;
        variant: string;
    };
    total: string;
    status: string;
    countdown: string;
}

const MyOrderPage = () => {
    const [activeTab, setActiveTab] = useState('Semua');
    const [orders, setOrders] = useState<Order[]>(dummyOrders);


    const navTabs = ['Semua', 'Belum Bayar', 'Perlu Dikirim', 'Dikirim', 'Selesai', 'Pengembalian/Pembatalan'];
    // HAPUS useEffect ini:
    useEffect(() => {
        setOrders(dummyOrders)
    }, [])

    return (
        <MyStoreLayout>
            <div className="bg-gray-50 min-h-screen font-sans">
                <div className="max-w-screen-xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-md shadow-sm p-4 sm:p-6">

                        {/* Header Utama - Responsif */}
                        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                            <h1 className="text-xl font-semibold text-gray-800">Pesanan Saya</h1>
                            <div className="flex items-center gap-2 sm:gap-4">
                                <button className="flex-1 sm:flex-none text-sm text-gray-700 bg-white border border-gray-300 rounded-sm px-3 sm:px-4 py-1.5 hover:bg-gray-50">
                                    Export
                                </button>
                                <button className="flex-1 sm:flex-none text-sm text-gray-700 bg-white border border-gray-300 rounded-sm px-3 sm:px-4 py-1.5 hover:bg-gray-50">
                                    Riwayat Download
                                </button>
                            </div>
                        </header>

                        {/* Navigasi Tab - Scrollable di Mobile */}
                        <div className="border-b border-gray-200">
                            <nav className="overflow-x-auto -mb-px flex space-x-2" aria-label="Tabs">
                                {navTabs.map((tab) => (
                                    <NavTab key={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)}>
                                        {tab}
                                    </NavTab>
                                ))}
                            </nav>
                        </div>

                        {/* Filter Section - Responsif */}
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mt-5 p-4 bg-gray-50 rounded-md border border-gray-200">
                            <div className="w-full md:w-auto flex flex-col sm:flex-row sm:items-center gap-2">
                                <label htmlFor="order-number" className="text-sm text-gray-600 sm:w-24">No. Pesanan</label>
                                <input
                                    id="order-number"
                                    type="text"
                                    placeholder="Masukkan no. pesanan"
                                    className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="w-full md:w-auto flex flex-col sm:flex-row sm:items-center gap-2">
                                <label htmlFor="shipping-service" className="text-sm text-gray-600 sm:w-24">Jasa Kirim</label>
                                <div className="relative w-full sm:w-48">
                                    <select
                                        id="shipping-service"
                                        className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    >
                                        <option>Semua Jasa Kirim</option>
                                        <option>JNE</option>
                                        <option>J&T</option>
                                        <option>SiCepat</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <button className="flex-1 md:flex-none px-6 py-2 text-sm text-white bg-blue-500 rounded-sm hover:bg-blue-600">
                                    Terapkan
                                </button>
                                <button className="flex-1 md:flex-none px-6 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
                                    Reset
                                </button>
                            </div>
                        </div>

                        {/* Bagian Konten/Tabel */}
                        <div className="mt-6">
                            <h3 className="text-base font-medium text-gray-800 mb-3">{orders.length} Pesanan</h3>

                            {/* Tampilan Tabel untuk Desktop (md dan lebih besar) */}
                            <div className="hidden md:block border rounded-sm overflow-hidden">
                                <div className="grid grid-cols-6 gap-4 bg-gray-50 p-3 text-sm font-semibold text-gray-600 text-left">
                                    <div className="col-span-2">Produk</div>
                                    <div>Total Pesanan</div>
                                    <div>Status</div>
                                    <div>Hitungan Mundur</div>
                                    <div>Aksi</div>
                                </div>
                                <div className="bg-white">
                                    {orders.length > 0 ? (
                                        orders.map(order => (
                                            <div key={order.id} className="grid grid-cols-6 gap-4 items-center p-4 border-b">
                                                <div className="col-span-2 flex items-center gap-3">
                                                    <img src={order.product.image} alt={order.product.name} className="w-16 h-16 object-cover rounded-md" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-800">{order.product.name}</p>
                                                        <p className="text-xs text-gray-500">{order.product.variant}</p>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-800">{order.total}</div>
                                                <div className="text-sm text-gray-800">{order.status}</div>
                                                <div className="text-sm text-gray-800">{order.countdown}</div>
                                                <div>
                                                    <button className="text-sm text-blue-500 hover:underline">Lihat Rincian</button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <EmptyState />
                                    )}
                                </div>
                            </div>

                            {/* Tampilan Kartu untuk Mobile (di bawah md) */}
                            <div className="md:hidden space-y-4">
                                {orders.length > 0 ? (
                                    orders.map(order => (
                                        <div key={order.id} className="bg-white border rounded-lg p-4 space-y-4">
                                            <div className="flex items-center gap-4">
                                                <img src={order.product.image} alt={order.product.name} className="w-20 h-20 object-cover rounded-md" />
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">{order.product.name}</p>
                                                    <p className="text-xs text-gray-500">{order.product.variant}</p>
                                                </div>
                                            </div>
                                            <div className="border-t pt-3 space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Total Pesanan:</span>
                                                    <span className="font-medium text-gray-800">{order.total}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Status:</span>
                                                    <span className="font-medium text-green-600">{order.status}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Hitungan Mundur:</span>
                                                    <span className="font-medium text-gray-800">{order.countdown}</span>
                                                </div>
                                            </div>
                                            <div className="flex border-t pt-3">
                                                <button className="w-full text-center py-2 text-sm text-blue-500 font-medium bg-blue-50 rounded-md hover:bg-blue-100">
                                                    Lihat Rincian Pesanan
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="border rounded-sm"><EmptyState /></div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MyStoreLayout>
    );
}

export default MyOrderPage