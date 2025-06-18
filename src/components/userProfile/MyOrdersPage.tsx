import React, { useState } from 'react'
import { SearchIcon } from './Icon';

const MyOrdersPage = () => {
    const [activeTab, setActiveTab] = useState('Semua');
    const tabs = ['Semua', 'Belum Bayar', 'Sedang Dikemas', 'Dikirim', 'Selesai', 'Dibatalkan', 'Pengembalian Barang'];

    return (
        <div className="w-full">
            <div className="border-b">
                <nav className="flex space-x-4 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-1 whitespace-nowrap text-sm font-medium ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="relative mt-4 mb-4">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Kamu bisa cari berdasarkan Nama Penjual, No. Pesanan atau Nama Produk" className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* Order Item */}
            <div className="bg-white rounded-lg shadow-sm border p-4 border-gray-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b gap-2 border-gray-300">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-sm">Star</span>
                        <h4 className="font-bold text-sm">WA SENDER BLAST PRO</h4>
                        <button className="text-sm text-gray-600 border border-gray-300 rounded px-2 py-0.5 hover:bg-gray-100 hidden sm:block">Chat</button>
                        <button className="text-sm text-gray-600 border border-gray-300 rounded px-2 py-0.5 hover:bg-gray-100 hidden sm:block">Kunjungi Toko</button>
                    </div>
                    <span className="text-sm text-red-500 font-semibold self-end sm:self-center">DIBATALKAN</span>
                </div>
                <div className="flex sm:hidden items-center gap-2 pt-3">
                    <button className="text-sm text-gray-600 border border-gray-300 rounded px-3 py-1 hover:bg-gray-100">Chat</button>
                    <button className="text-sm text-gray-600 border border-gray-300 rounded px-3 py-1 hover:bg-gray-100">Kunjungi Toko</button>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 py-4">
                    <img src="https://placehold.co/100x100/2d3748/ffffff?text=Produk" alt="Product Image" className="w-20 h-20 rounded-md object-cover flex-shrink-0" />
                    <div className="flex-grow">
                        <h5 className="font-semibold text-gray-800">ChatGPT Plus+ Premium 4.0 Private (Resmi OpenAI 1 Bulan)</h5>
                        <p className="text-sm text-gray-500">Variasi: 1 Bulan,Sharing 30 Hari</p>
                        <p className="text-sm text-gray-500">x1</p>
                    </div>
                    <div className="text-left sm:text-right">
                        <p className="text-sm text-gray-400 line-through">Rp374.000</p>
                        <p className="text-gray-800">Rp29.000</p>
                    </div>
                </div>
                <div className="border-t pt-3 border-gray-300">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                        <p className="text-sm text-gray-500">Dibatalkan secara otomatis oleh sistem Shopee</p>
                        <p><span className="text-sm">Total Pesanan:</span> <span className="font-bold text-lg text-blue-600">Rp31.000</span></p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end items-stretch gap-3">
                        <button className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700">Beli Lagi</button>
                        <button className="border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-100">Tampilkan Rincian Pembatalan</button>
                        <button className="border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-100">Hubungi Penjual</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MyOrdersPage