'use client';

import React, { useState } from 'react';

// Mock data and child components (assuming they exist in these paths)
import CancelOrderModal from 'components/userProfile/MyOrder/CancelOrderModal';
import { mockOrders } from 'components/userProfile/MyOrder/mockOrders';
import ReturnOrderModal from 'components/userProfile/MyOrder/ReturnOrderModal';
import UserProfile from 'pages/layouts/UserProfile';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/router';


// --- SVG Icons ---
const SearchIcon = () => (
    <svg className="w-5 h-5 text-[#888888]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
    </svg>
);


// --- Type Definitions ---
interface Variant {
    variant: string;
    option: string;
}

interface Product {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    variant?: Variant[];
}

interface Order {
    id: string;
    storeName: string;
    status: 'SELESAI' | 'DIBATALKAN' | 'BELUM_BAYAR' | 'SEDANG_DIKEMAS' | 'DIKIRIM' | 'PENGEMBALIAN';
    products: Product[];
    totalPrice: number;
    receiver?: string;
    arrived?: boolean;
}

interface MyOrderPageProps {
    tab?: string;
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

// --- Pagination Component ---
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else if (currentPage <= 3) {
            pages.push(1, 2, 3, '...', totalPages - 1, totalPages);
        } else if (currentPage >= totalPages - 2) {
            pages.push(1, 2, '...', totalPages - 2, totalPages - 1, totalPages);
        } else {
            pages.push(currentPage - 1, currentPage, currentPage + 1, '...', totalPages - 1, totalPages);
        }

        return pages;
    };

    return (
        <div className="flex flex-col items-center justify-center mt-8 space-y-4">
            <nav className="flex items-center space-x-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#1E1E1E] disabled:text-[#757575] bg-white tracking-[0px] rounded-md hover:bg-gray-50 disabled:bg-white disabled:cursor-not-allowed"
                >
                    <ArrowLeft className='w-[16px]' />
                    Sebelumnya
                </button>

                <div className="flex items-center space-x-1">
                    {getPageNumbers().map((page, index) =>
                        typeof page === 'number' ? (
                            <button
                                key={index}
                                onClick={() => onPageChange(page)}
                                className={`px-4 py-2 text-sm font-medium rounded-[8px] ${currentPage === page ? 'bg-[#2C2C2C] text-[#F5F5F5]' : 'text-[#1E1E1E] bg-white  hover:bg-gray-50'}`}
                            >
                                {page}
                            </button>
                        ) : (
                            <span key={index} className="px-2 py-1 text-gray-500">
                                {page}
                            </span>
                        )
                    )}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#1E1E1E] disabled:text-[#757575] bg-white rounded-md hover:bg-gray-50 disabled:bg-white disabled:cursor-not-allowed"
                >
                    Berikutnya
                    <ArrowRight className='w-[16px]' />
                </button>
            </nav>
            <p className="text-[#555555] text-[15px] font-bold">
                Menampilkan 10 Pembelian per Halaman
            </p>
        </div>
    );
};




// --- Main Page Component ---
const MyOrderPage = ({ tab = 'Semua' }: MyOrderPageProps) => {

    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
    const [isReturnModalOpen, setReturnModalOpen] = useState(false);
    const [orderToReturn, setOrderToReturn] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1); // State for pagination
    const ordersPerPage = 10; // Number of orders per page
    const router = useRouter()
    const performSearch = () => {
        setSearchQuery(searchInput);
        setCurrentPage(1); // Reset to first page on new search
        console.log(`Mencari untuk: "${searchInput}" di semua tab`);
    };

    const handleButtonClick = (action: string, orderId: string) => {
        if (action === 'batalkan_pesanan') {
            setOrderToCancel(orderId);
            setModalOpen(true);
        } else if (action === 'ajukan_pengembalian') {
            setOrderToReturn(orderId);
            setReturnModalOpen(true);
        } else {
            console.log({ pesan: `Tombol '${action}' ditekan.`, orderId: orderId, timestamp: new Date().toISOString() });
        }
    };

    const handleConfirmCancellation = (reason: string) => {
        console.log({ pesan: 'Pesanan Dibatalkan', orderId: orderToCancel, alasan: reason, timestamp: new Date().toISOString() });
        setModalOpen(false);
        setOrderToCancel(null);
    };

    const handleConfirmReturn = (reason: string) => {
        console.log({ pesan: 'Pengembalian Diajukan', orderId: orderToReturn, alasan: reason, timestamp: new Date().toISOString() });
        setReturnModalOpen(false);
        setOrderToReturn(null);
    };

    const getStatusStyles = (status: Order['status'], arrived?: Order['arrived']) => {
        // This function remains the same as your original code
        // ... (omitted for brevity, but it's the same as your provided code)
        switch (status) {
            case 'SELESAI': return {
                text: 'SELESAI',
                color: 'text-[#CD0030]',
                buttons: [{
                    text: 'Beri Nilai',
                    style: 'bg-[#FFBB00] border border-[#A48200] hover:bg-yellow-300 text-black',
                    action: 'beli_lagi'
                }, {
                    text: 'Beli Lagi',
                    style: 'bg-[#F6E9F0] border border-[#563D7C] text-dark hover:bg-purple-100',
                    action: 'beli_lagi'
                }, {
                    text: 'Kunjungi Toko',
                    style: 'bg-[#563D7C] text-[#FFFFFF] hover:bg-purple-500',
                    action: 'kunjungi_toko'
                }, {
                    text: 'Hubungi Penjual',
                    style: 'bg-[#227D53] border border-[#0A452A] text-[#FFFFFF] hover:bg-green-500',
                    action: 'chat'
                }]
            };
            case 'DIBATALKAN': return {
                text: 'DIBATALKAN',
                color: 'text-[#CD0030]',
                buttons: [{
                    text: 'Beli Lagi',
                    style: 'bg-[#F6E9F0] border border-[#563D7C] text-dark hover:bg-purple-100',
                    action: 'beli_lagi'
                }, {
                    text: 'Rincian Pembatalan',
                    style: 'bg-[#563D7C] text-[#FFFFFF] hover:bg-purple-500',
                    action: 'rincian_pembatalan'
                }, {
                    text: 'Hubungi Penjual',
                    style: 'bg-[#227D53] border border-[#0A452A] text-[#FFFFFF] hover:bg-green-500',
                    action: 'chat'
                }]
            };
            case 'BELUM_BAYAR': return {
                text: 'BELUM BAYAR',
                color: 'text-[#CD0030]',
                buttons: [{
                    text: 'Bayar Sekarang',
                    style: 'bg-[#EE4D2D] text-[#fff] hover:bg-orange-500',
                    action: 'bayar_sekarang'
                }, {
                    text: 'Ubah Metode Pembayran',
                    style: 'bg-[#563D7C] text-[#FFFFFF] hover:bg-purple-500',
                    action: 'metode_pembayaran'
                }, {
                    text: 'Batalkan Pesanan',
                    style: 'bg-[#FDFDFD] text-[#333] border border-[#BBBBBB] hover:bg-gray-500',
                    action: 'batalkan_pesanan'
                }, {
                    text: 'Hubungi Penjual',
                    style: 'bg-[#227D53] border border-[#0A452A] text-[#FFFFFF] hover:bg-green-500',
                    action: 'chat'
                }]
            };
            case 'SEDANG_DIKEMAS': return {
                text: 'SEDANG DIKEMAS',
                color: 'text-[#CD0030]',
                buttons: [{
                    text: 'Batalkan Pesanan',
                    style: 'bg-[#563D7C] text-[#FFFFFF] hover:bg-purple-500',
                    action: 'batalkan_pesanan'
                }, {
                    text: 'Hubungi Penjual',
                    style: 'bg-[#227D53] border border-[#0A452A] text-[#FFFFFF] hover:bg-green-500',
                    action: 'chat'
                }]
            };
            case 'DIKIRIM':
                switch (arrived) {
                    case true: return {
                        text: 'DIKIRIM',
                        color: 'text-[#CD0030]',
                        buttons: [{
                            text: 'Pesanan Selesai',
                            style: 'bg-[#EE4D2D] text-[#fff] hover:bg-orange-500',
                            action: 'pesanan_selesai'
                        }, {
                            text: 'Ajukan pengembalian',
                            style: 'bg-[#563D7C] text-[#fff] hover:bg-purple-500',
                            action: 'ajukan_pengembalian'
                        }, {
                            text: 'Hubungi Penjual',
                            style: 'bg-[#227D53] border border-[#0A452A] text-[#FFFFFF] hover:bg-green-500',
                            action: 'chat'
                        }]
                    };
                    default: return {
                        text: 'DIKIRIM',
                        color: 'text-[#CD0030]',
                        buttons: [{
                            text: 'Pesanan Selesai',
                            style: 'bg-[#E5E4E1] text-[#BBBBBB] cursor-not-allowed pointer-events-none',
                            disable: true
                        }, {
                            text: 'Ajukan pengembalian',
                            style: 'bg-[#E5E4E1] text-[#BBBBBB] cursor-not-allowed pointer-events-none',
                            disable: true
                        }, {
                            text: 'Hubungi Penjual',
                            style: 'bg-[#227D53] border border-[#0A452A] text-[#FFFFFF] hover:bg-green-500',
                            action: 'chat'
                        }]
                    };
                }

            case 'PENGEMBALIAN': return {
                text: 'PENGEMBALIAN',
                color: 'text-[#CD0030]',
                buttons: [{
                    text: 'Lihat Detail',
                    style: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
                    action: 'lihat_detail_pengembalian'
                }]
            };
            default: return {
                text: '',
                color: 'text-gray-500', buttons: []
            };
        }
    };

    const tabs = [
        { name: 'Semua', url: '/user-profile/my-order' },
        { name: 'Belum Bayar', url: '/user-profile/my-order/pending' },
        { name: 'Dikemas', url: '/user-profile/my-order/packing' },
        { name: 'Dikirim', url: '/user-profile/my-order/shipped' },
        { name: 'Selesai', url: '/user-profile/my-order/completed' },
        { name: 'Dibatalkan', url: '/user-profile/my-order/cancelled' },
        { name: 'Pengembalian', url: '/user-profile/my-order/refund' },
    ];

    const filteredOrders = mockOrders.filter(order => {
        const statusMap: { [key: string]: Order['status'] } = { 'belum bayar': 'BELUM_BAYAR', 'dikemas': 'SEDANG_DIKEMAS', 'dikirim': 'DIKIRIM', 'selesai': 'SELESAI', 'dibatalkan': 'DIBATALKAN', 'pengembalian': 'PENGEMBALIAN' };
        const lowerCaseQuery = searchQuery.toLowerCase();
        const matchesTab = tab.toLowerCase() === 'semua' || order.status === statusMap[tab.toLowerCase()];
        const matchesSearch = searchQuery === '' || order.storeName.toLowerCase().includes(lowerCaseQuery) || order.products.some(product => product.name.toLowerCase().includes(lowerCaseQuery)) || order.id.toLowerCase().includes(lowerCaseQuery);
        return matchesTab && matchesSearch;
    });

    // --- Pagination Logic ---
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    return (
        <UserProfile>
            <h2 className="text-[22px] font-bold text-[#7952B3] mb-2 mt-2">Pesanan Saya</h2>
            <p className="text-gray-500 mb-3">Semua belanjaanmu ada di sini! Cek status, lihat detail, atau ulangi pembelian dengan sekali klik.</p>
            <CancelOrderModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onConfirm={handleConfirmCancellation} />
            <ReturnOrderModal isOpen={isReturnModalOpen} onClose={() => setReturnModalOpen(false)} onConfirm={handleConfirmReturn} />

            <div className='space-y-6'>
                <div className='bg-white border border-[#DCDCDC] rounded-[5px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)]'>
                    {/* Tabs */}
                    <div className='px-8 border-b border-[#BBBBBBCC]/80'>
                        <div className="overflow-x-auto">
                            <nav className="flex space-x-2 sm:space-x-6 px-4" aria-label="Tabs">
                                {tabs.map((item) => (
                                    <button key={item?.name} onClick={() => router?.push(item?.url)} className={`${tab === item?.name ? 'border-[#BB2C31] border-b-[3px] text-[16px] font-bold text-[#BB2C31]' : 'border-transparent text-[#333333] hover:text-gray-700 hover:border-gray-300'} text-[16px] whitespace-nowrap py-4 pb-2 px-1 border-b-2 text-sm transition-colors duration-200 focus:outline-none tracking-[-0.05em]`}>
                                        {item?.name}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                    {/* Search Bar */}
                    <div className="p-4 md:p-6">
                        <div className="flex items-center">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <SearchIcon />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Pencarian berdasarkan Nama Produk, No. Pesanan atau Nama Penjual"
                                    className="w-full h-[40px] py-3 pl-4 pr-4 text-[14px] border border-gray-300 rounded-l-[5px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm placeholder:text-[#888888]"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyPress={(e) => { if (e.key === 'Enter') { performSearch(); } }}
                                />
                            </div>
                            <button
                                onClick={performSearch}
                                className="flex-shrink-0 py-3 border border-[#CCCCCC] px-6 bg-[#7952B3] px-10 text-white font-semibold text-[14px] rounded-r-[5px] hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                                Cari
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Use currentOrders for mapping */}
                    {currentOrders.length > 0 ? (
                        currentOrders.map((order) => {
                            const statusInfo = getStatusStyles(order.status, order?.arrived);
                            return (
                                <div key={order.id} className="bg-white border border-[#DCDCDC] rounded-[5px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)]">
                                    {/* Order Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-[#BBBBBBCC] px-6">
                                        <div className="flex items-center mb-2 sm:mb-0">
                                            <h2 className="text-[16px] font-bold text-[#333333]">{order.storeName}</h2>
                                        </div>
                                        <div>
                                            {order?.arrived && <span className='text-right text-[#555555] text-[12px] font-bold mr-6'>Pesanan tiba di alamat tujuan</span>}
                                            <span className={`font-bold text-[16px] uppercase ${statusInfo.color}`}>{statusInfo.text}</span>
                                        </div>
                                    </div>
                                    {/* Product List */}
                                    <div className="p-4 px-6 ">
                                        {order.products.map((product, index) => (
                                            <div key={product.id} className={`flex items-start ${index > 0 ? 'mt-4' : ''}`}>
                                                <img src={product.image} alt={product.name} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded mr-4 flex-shrink-0" onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100?text=Error'; }} />
                                                <div className="flex-grow">
                                                    <p className="text-[#333333] text-[15px] font-bold leading-tight">{product.name}</p>
                                                    <div className="text-[#333333] text-[13px] leading-tight flex">
                                                        {product?.variant?.map((v, iv) => (
                                                            <p key={iv}>
                                                                Variasi {v?.variant}: <span className='font-bold'>{v?.option}</span>
                                                            </p>
                                                        ))}
                                                    </div>
                                                    <p className="text-[#333] text-[13px] mt-1">X {product.quantity}</p>
                                                </div>
                                                <div className="text-[#333333] text-[15px] text-right ml-4">Rp {product.price.toLocaleString('id-ID')}</div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Order Footer */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 p-4 rounded-b-[5px] border-t border-[#BBBBBBCC] px-6">
                                        <div className='space-y-6'>
                                            <div className="text-left md:text-right flex justify-end items-center gap-10">
                                                <p className="text-[14px] text-[#333333]">Total Pesanan:</p>
                                                <p className="text-[24px] font-[500] text-[#ED4D2D]">Rp {order.totalPrice.toLocaleString('id-ID')}</p>
                                            </div>
                                            <div className="flex items-center justify-end flex-wrap gap-2">
                                                {statusInfo.buttons.map(button => (
                                                    <button key={button.text} className={`font-semibold py-2 px-4 text-[14px] transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${button.style}`} onClick={() => !button?.disable && handleButtonClick(button.action ?? '', order.id)}>{button.text}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center text-gray-500 py-16">
                            <p className="font-semibold mb-2 text-lg">Tidak Ada Pesanan</p>
                            <p className="text-sm">Saat ini tidak ada pesanan yang cocok dengan filter yang Anda pilih.</p>
                        </div>
                    )}
                </div>
                {/* Render Pagination if there are orders */}
                {filteredOrders.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                )}
            </div>
        </UserProfile >
    );
};

export default MyOrderPage;
