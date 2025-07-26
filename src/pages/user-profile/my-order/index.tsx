'use client';

import CancelOrderModal from 'components/userProfile/MyOrder/CancelOrderModal';
import { mockOrders } from 'components/userProfile/MyOrder/mockOrders';
import ReturnOrderModal from 'components/userProfile/MyOrder/ReturnOrderModal';
import UserProfile from 'pages/layouts/UserProfile';
import React, { useState } from 'react';

const SearchIcon = () => (
    <svg className="w-5 h-5 text-[#888888]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
    </svg>
);

interface variant {
    variant: string,
    option: string
}

// --- Definisi Tipe Data ---
interface Product {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    variant?: variant[]
}

interface Order {
    id: string;
    storeName: string;
    status: 'SELESAI' | 'DIBATALKAN' | 'BELUM_BAYAR' | 'SEDANG_DIKEMAS' | 'DIKIRIM' | 'PENGEMBALIAN';
    products: Product[];
    totalPrice: number;
    receiver?: string;
    arrived?: boolean
}


interface Props {
    tab?: string;
}

const MyOrderPage = ({ tab = 'Semua' }: Props) => {

    const [searchInput, setSearchInput] = useState(''); // State untuk input field
    const [searchQuery, setSearchQuery] = useState(''); // State untuk filter yang aktif
    const [isModalOpen, setModalOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

    const [isReturnModalOpen, setReturnModalOpen] = useState(false);
    const [orderToReturn, setOrderToReturn] = useState<string | null>(null);
    // Fungsi untuk menjalankan pencarian
    const performSearch = () => {
        setSearchQuery(searchInput);
        console.log(`Mencari untuk: "${searchInput}" di semua tab`);
    };

    const handleButtonClick = (action: string, orderId: string) => {
        if (action === 'batalkan_pesanan') {
            setOrderToCancel(orderId);
            setModalOpen(true);
        } else if (action === 'ajukan_pengembalian') { // NEW: Handle return action
            setOrderToReturn(orderId);
            setReturnModalOpen(true);
        } else {
            // alert(`Aksi: ${action} untuk Pesanan: ${orderId}\n(Cek console browser untuk detail)`);
            console.log({ pesan: `Tombol '${action}' ditekan.`, orderId: orderId, timestamp: new Date().toISOString() });
        }
    };

    const handleConfirmCancellation = (reason: string) => {
        // alert(`Pesanan ${orderToCancel} dibatalkan dengan alasan: "${reason}"`);
        console.log({ pesan: 'Pesanan Dibatalkan', orderId: orderToCancel, alasan: reason, timestamp: new Date().toISOString() });
        setModalOpen(false);
        setOrderToCancel(null);
    };
    const handleConfirmReturn = (reason: string) => {
        console.log({ pesan: 'Pengembalian Diajukan', orderId: orderToReturn, alasan: reason, timestamp: new Date().toISOString() });
        setReturnModalOpen(false);
        setOrderToReturn(null);
    };

    const getStatusStyles = (status: Order['status'], arrived: Order['arrived']) => {
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
                            disable: true
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
        { name: 'Belum Bayar', url: '/user-profile//my-order/pending' },
        { name: 'Dikemas', url: '/user-profile//my-order/packing' },
        { name: 'Dikirim', url: '/user-profile//my-order/shipped' },
        { name: 'Selesai', url: '/user-profile//my-order/completed' },
        { name: 'Dibatalkan', url: '/user-profile//my-order/cancelled' },
        { name: 'Pengembalian', url: '/user-profile//my-order/refund' },
    ];


    const filteredOrders = mockOrders.filter(order => {
        const statusMap: { [key: string]: Order['status'] } = { 'belum bayar': 'BELUM_BAYAR', 'dikemas': 'SEDANG_DIKEMAS', 'dikirim': 'DIKIRIM', 'selesai': 'SELESAI', 'dibatalkan': 'DIBATALKAN', 'pengembalian': 'PENGEMBALIAN' };
        const lowerCaseQuery = searchQuery.toLowerCase();
        const matchesTab = tab.toLowerCase() === 'semua' || order.status === statusMap[tab.toLowerCase()];
        const matchesSearch = searchQuery === '' || order.storeName.toLowerCase().includes(lowerCaseQuery) || order.products.some(product => product.name.toLowerCase().includes(lowerCaseQuery)) || order.id.toLowerCase().includes(lowerCaseQuery);
        return matchesTab && matchesSearch;
    });

    return (
        <UserProfile>
            <h2 className="text-[22px] font-bold text-[#7952B3] mb-2 mt-2">Pesanan Saya</h2>
            <p className="text-gray-500 mb-3">Semua belanjaanmu ada di sini! Cek status, lihat detail, atau ulangi pembelian dengan sekali klik.</p>
            <CancelOrderModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onConfirm={handleConfirmCancellation} />
            <ReturnOrderModal isOpen={isReturnModalOpen} onClose={() => setReturnModalOpen(false)} onConfirm={handleConfirmReturn} />
            <div className='space-y-6'>
                <div className='bg-white border border-[#DCDCDC] rounded-[5px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)]'>
                    <div className='px-8 border-b border-[#BBBBBBCC]/80'>
                        <div className="">
                            <div className="overflow-x-auto">
                                <nav className="flex space-x-2 sm:space-x-6 px-4" aria-label="Tabs">
                                    {
                                        tabs.map((item) => (
                                            <button key={item?.name} onClick={() => window.location.href = item?.url} className={`${tab == item?.name ? 'border-[#BB2C31] border-b-[3px] text-[16px] font-bold text-[#BB2C31]' : 'border-transparent text-[#333333] hover:text-gray-700 hover:border-gray-300'} text-[16px] whitespace-nowrap py-4  pb-2 px-1 border-b-2 text-sm transition-colors duration-200 focus:outline-none tracking-[-0.05em]`}>
                                                {item?.name}
                                            </button>
                                        ))}
                                </nav>
                            </div>
                        </div>
                    </div>
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
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => {
                            const statusInfo = getStatusStyles(order.status, order?.arrived);
                            return (
                                <div key={order.id} className="bg-white border border-[#DCDCDC] rounded-[5px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)]">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-[#BBBBBBCC] px-6">
                                        <div className="flex items-center mb-2 sm:mb-0">
                                            {/* <StoreIcon /> */}
                                            <h2 className="text-[16px] font-bold text-[#333333]">{order.storeName}</h2>
                                        </div>
                                        <div>
                                            {
                                                order?.arrived && <span className='text-right text-[#555555] text-[12px] font-bold mr-6'>Pesanan tiba di alamat tujuan</span>
                                            }
                                            <span className={`font-bold text-[16px] uppercase ${statusInfo.color}`}>{statusInfo.text}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 px-6 ">
                                        {order.products.map((product, index) => (
                                            <div key={product.id} className={`flex items-start ${index > 0 ? 'mt-4' : ''}`}>
                                                <img src={product.image} alt={product.name} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-   mr-4 flex-shrink-0" onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100?text=Error'; }} />
                                                <div className="flex-grow">
                                                    <p className="text-[#333333] text-[15px] font-bold leading-tight">{product.name}</p>
                                                    <div className="text-[#333333] text-[13px] leading-tight flex">
                                                        {product?.variant?.map((v, iv) => (
                                                            <p key={iv}>
                                                                Variasi   {v?.variant}: <span className='font-bold'>{v?.option}</span>
                                                            </p>
                                                        ))}
                                                    </div>
                                                    <p className="text-[#333] text-[13px] mt-1">X {product.quantity}</p>
                                                </div>
                                                <div className="text-[#333333] text-[15px] text-right ml-4">Rp {product.price.toLocaleString('id-ID')}</div>
                                            </div>))}
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 p-4  rounded-b-[5px] border-t border-[#BBBBBBCC] px-6">
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
            </div>
        </UserProfile >
    );
};

export default MyOrderPage;
