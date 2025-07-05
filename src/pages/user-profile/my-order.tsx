// pages/MyOrderPage.tsx
'use client'; // Penting untuk menggunakan React Hooks seperti useState jika UserProfile tidak 'use client'

import React, { useState } from 'react';
import UserProfile from 'pages/layouts/UserProfile';
// --- Definisi Tipe Data ---
// Pastikan definisi tipe ini konsisten di seluruh aplikasi Anda
interface Product {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
}

interface Order {
    id: string;
    storeName: string;
    status: 'SELESAI' | 'DIBATALKAN' | 'BELUM_BAYAR' | 'SEDANG_DIKEMAS' | 'DIKIRIM' | 'PENGEMBALIAN';
    deliveryInfo?: string;
    products: Product[];
    totalPrice: number;
}

// --- Data Mockup (contoh data pesanan) ---
const mockOrders: Order[] = [
    {
        id: 'ORDER-001',
        storeName: 'Toko Senang Hati',
        status: 'SELESAI',
        deliveryInfo: 'Paket telah diterima oleh Irvan Mamala',
        products: [
            {
                id: 'PROD-001',
                name: 'Rak Bumbu Dapur Multifungsi 2 susun',
                image: 'https://placehold.co/200x200?text=Rak+Bumbu',
                price: 250000,
                quantity: 20,
            },
            {
                id: 'PROD-002',
                name: 'Kemko Pendek Motif/Kemeja Qurta/Pakaian Muslim',
                image: 'https://placehold.co/200x200?text=Kemko',
                price: 99000,
                quantity: 15,
            },
        ],
        totalPrice: 1580000,
    },
    {
        id: 'ORDER-002',
        storeName: 'Toko Senang Hati',
        status: 'DIBATALKAN',
        products: [
            {
                id: 'PROD-003', // Pastikan ID produk unik jika ini adalah produk berbeda
                name: 'Rak Bumbu Dapur Multifungsi 2 susun',
                image: 'https://placehold.co/200x200?text=Rak+Bumbu',
                price: 250000,
                quantity: 20,
            },
        ],
        totalPrice: 1580000,
    },
    // Tambahkan lebih banyak data dummy jika diperlukan
];

const MyOrderPage = () => {
    const [activeTab, setActiveTab] = useState<'Semua' | 'Belum Bayar' | 'Sedang dikemas' | 'Dikirim' | 'Selesai' | 'Dibatalkan' | 'Pengembalian'>('Semua');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const tabs = ['Semua', 'Belum Bayar', 'Sedang dikemas', 'Dikirim', 'Selesai', 'Dibatalkan', 'Pengembalian'];

    const filteredOrders = mockOrders.filter(order => {
        const matchesTab = activeTab === 'Semua' || order.status.toLowerCase().replace(/_/g, ' ') === activeTab.toLowerCase();
        const matchesSearch = searchQuery === '' ||
            order.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.products.some(product => product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <UserProfile>
            {/* Konten yang sebelumnya ada di app/page.tsx */}
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                {/* Navigasi Atas (Tab Bar) */}
                <div className="flex justify-between items-center border-b border-gray-200 bg-white">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`flex-1 py-3 text-center text-sm font-bold ${activeTab === tab
                                ? 'text-[#7952B3] border-b-2 border-[#7952B3]'
                                : 'text-gray-600 hover:text-[#7952B3]'
                                } transition duration-150`}
                            onClick={() => setActiveTab(tab as typeof activeTab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="p-4 bg-white">
                    <div className="mb-6 relative border-2 border-[#52357B] rounded-lg">
                        <input
                            type="text"
                            placeholder="Pencarian berdasarkan Nama Produk, No. Pesanan atau Nama Penjual"
                            className="w-full p-3 pl-4 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch(searchQuery);
                                }
                            }}
                        />
                        <button
                            className="absolute right-0 top-0 h-[90%] mt-[2px] w-16 bg-[#52357B] rounded-lg flex items-center justify-center text-white hover:bg-purple-700 transition duration-200 mr-[1px]"
                            onClick={() => handleSearch(searchQuery)}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                ></path>
                            </svg>
                        </button>
                    </div>
                    <p className='text-xs px-1 mt-[-10px] text-gray-500'>Pencarian berdasarkan Nama Produk, No.Pemesanan atau Nama Penjual</p>
                </div>
                <div className="p-4 mt-[-10px]">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => {
                            const statusColor = order.status === 'SELESAI' ? 'text-red-600' : 'text-red-600';

                            return (
                                <div key={order.id} className="bg-white rounded-lg shadow-sm mb-4 border-2 border-[#52357B]">
                                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                        <h2 className="text-md font-semibold text-gray-800">{order.storeName}</h2>
                                        <div className="flex items-center space-x-2">
                                            {order.deliveryInfo && (
                                                <span className="text-gray-600 text-sm">{order.deliveryInfo}</span>
                                            )}
                                            <span className={`font-bold text-sm ${statusColor}`}>{order.status}</span>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        {order.products.map((product) => (
                                            <div key={product.id} className="flex items-center py-2">
                                                <div className="relative w-20 h-20 mr-4 flex-shrink-0">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}

                                                        className="rounded-md"
                                                    />
                                                </div>
                                                <div className="flex-grow">
                                                    <p className="text-gray-800 text-sm font-medium">{product.name}</p>
                                                    <p className="text-gray-600 text-xs mt-1">X {product.quantity}</p>
                                                </div>
                                                <div className="text-gray-800 text-sm font-semibold">
                                                    Rp {product.price.toLocaleString('id-ID')}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50 rounded-br-lg rounded-bl-lg">
                                        <div className="flex space-x-2">
                                            <button className="bg-[#52357B] hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md text-sm transition duration-200">
                                                Beli Lagi
                                            </button>
                                            <button className="bg-[#0c5da5] text-white hover:bg-purple-50 hover:text-purple-700 font-medium py-2 px-4 rounded-md text-sm transition duration-200">
                                                Kunjungi Toko
                                            </button>
                                        </div>
                                        <div className="text-gray-800 font-semibold text-md">
                                            Total pesanan : <span className="text-red-600">Rp {order.totalPrice.toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-gray-500 py-8">Tidak ada pesanan yang ditemukan.</p>
                    )}
                </div>
            </div>
        </UserProfile>
    );
};

export default MyOrderPage;