'use client';

// Impor yang diperlukan
import { ArrowUpRight, ChevronDown, Calendar, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import DatePickerModal from 'components/my-store/DatePickerModal';
import MyStoreLayout from 'pages/layouts/MyStoreLayout';
import { formatRupiahNoRP } from 'components/Rupiah';

interface StatCardData {
    title: string;
    label: string;
    amount: number;
    color: 'green' | 'red' | 'blue' | 'white';
    href: string;
}

// --- Tipe Data untuk Detail Pengiriman ---
interface ShippingStatus {
    timestamp: string;
    status: string;
    description: string;
    isLatest: boolean;
}

// --- Tipe Data untuk Produk ---
interface Product {
    id: number;
    name: string;
    image: string;
    variant: {
        color: string;
        size: string;
    };
    price: number;
    originalPrice: number;
    quantity: number;
}

// --- Tipe Data untuk Tabel Transaksi ---
interface Transaction {
    id: string;
    invoice: string;
    customerName: string;
    releaseEstimate: string;
    paymentMethod: 'COD' | 'Transfer';
    status: 'Pending' | 'Sudah Dilepas';
    amount: number;
    date: Date;
    products: Product[];
    details: {
        subTotal: number;
        productProtection: number;
        shippingFee: number;
        shippingInsurance: number;
        serviceFee: number;
        adminFee: number;
        storeVoucher: number;
    };
    shippingDetails: {
        courier: string;
        trackingNumber: string;
        address: string;
        timeline: ShippingStatus[];
    }
}
interface TrackingEvent {
    time: string;
    title: string;
    description: string;
}

interface TimelineItemProps {
    time: string;
    title: string;
    description: string;
    isLast: boolean;
    isFirst: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ time, title, description, isLast, isFirst }) => (
    <div className="relative flex items-start mb-[-10px]">
        {/* Vertical line */}
        {!isLast && (
            <div className="absolute left-[11px] top-5 h-full w-0.5 bg-gray-300"></div>
        )}

        {/* Dot */}
        <div className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full ${isFirst ? 'bg-purple-600' : 'bg-gray-300'}`}>
            {isFirst && <Check size={14} color='#fff' strokeWidth={3} />}
        </div>

        {/* Content */}
        <div className="ml-4 flex-1 pb-8 tracking-[-0.02em] flex items-star">
            {/* <div className='w-1/2'>
                <p className={`text-[14px] ${isFirst ? 'text-[#333333] font-bold' : 'text-[#333333]'}`}>{time}</p>
            </div>
            <div>
                <h4 className={`text-[14px] ${isFirst ? 'text-[#7952B3] font-bold' : title === 'Sedang Dikemas' || title === 'Pesanan Dibuat' ? "text-[#333333] font-bold" : 'text-[#333333]'}`}>{title}</h4>
                <p className={`text-[14px] ${isFirst ? 'text-[#7952B3]' : 'text-[#333333]'}`}>{description}</p>
            </div> */}
            <table>
                <tbody>
                    <tr>
                        <td width={130}>
                            <p className={`text-[14px] ${isFirst ? 'text-[#333333] font-bold' : 'text-[#333333]'}`}>{time}</p>
                        </td>
                        <td >
                            <h4 className={`text-[14px] ${isFirst ? 'text-[#7952B3] font-bold' : title === 'Sedang Dikemas' || title === 'Pesanan Dibuat' ? "text-[#333333] font-bold" : 'text-[#333333]'}`}>{title}</h4>
                            <p className={`text-[14px] ${isFirst ? 'text-[#7952B3]' : 'text-[#333333]'}`}>{description}</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);


// --- Data Dummy untuk Kartu Statistik ---
const dummyStats: StatCardData[] = [
    { title: 'Pending', label: 'Total', amount: 1740000, color: 'green', href: '#pending' },
    { title: 'Sudah Dilepas', label: 'Minggu ini', amount: 500000, color: 'red', href: '#released' },
    { title: 'Sudah Dilepas', label: 'Bulan ini', amount: 30000000, color: 'blue', href: '#released' },
    { title: 'Sudah Dilepas', label: 'Total', amount: 5320000000, color: 'white', href: '#released' },
];

// --- Fungsi untuk membuat data dummy timeline pengiriman ---
const generateShippingDetails = (): ShippingStatus[] => {
    const statuses = [
        {
            status: "Terkirim",
            description: "Pesanan tiba di alamat tujuan,diterima oleh Yang bersangkutan.Penerima: Andi Gustisari."
        },
        {
            status: "",
            description: "Pesanan dalam Pengiriman"
        },
        {
            status: "",
            description: "Pesanan dalam proses pengantaran."
        },
        {
            status: "",
            description: "Kurir sudah ditugaskan. Pesanan akan dikirim."
        },
        {
            status: "",
            description: "Pesanan diproses di lokasi transit Kota Makassar,Mamajang Hub."
        },
        {
            status: "",
            description: "Pesanan tiba di lokasi transit Kota Makassar, Mamajang Hub."
        },
        {
            status: "",
            description: "Pesanan dikirim dari lokasi sortir Kota Makassar,Tamalanrea DC ke Kota Makassar, Mamajang Hub via darat dengan estimasi waktu 1 hari."
        },
        {
            status: "",
            description: "Pesanan tiba di lokasi transit Kota Makassar,Tamalanrea DC."
        },
        {
            status: "",
            description: "Pesanan diproses di lokasi sortir Kota Cimahi, Bandung DC."
        },
        {
            status: "Sedang Dikemas",
            description: "Kurir ditugaskan untuk menjemput pesanan."
        },
        {
            status: "Pesanan Dibuat",
            description: "Pengirim telah mengatur pengiriman. Menunggu pesanan diserahkan ke pihak jasa kirim."
        },
    ];
    const date = new Date(2025, 7, 10, 20, 42); // Diubah ke Agustus
    return statuses.map((s, index) => {
        date.setHours(date.getHours() - Math.floor(Math.random() * 5));
        date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 59));
        return { ...s, timestamp: format(date, "dd-MM-yyyy HH:mm"), isLatest: index === 0, };
    });
};

// --- Fungsi untuk Membuat Data Dummy Transaksi (100 data) ---
const generateDummyTransactions = (): Transaction[] => {
    const transactions: Transaction[] = [];
    const names = [
        "Andi Gustisari",
        "Syamsuriani",
        "Budi Santoso",
        "Citra Lestari",
        "Eko Prasetyo",
        "Fitriani",
        "Gunawan",
        "Herlina",
        "Ika Putri",
        "Adi Setiawan"];
    const statusOptions: ('Pending' | 'Sudah Dilepas')[] = ['Pending', 'Sudah Dilepas'];
    const paymentMethods: ('COD' | 'Transfer')[] = ['COD', 'Transfer'];

    const dummyProducts: Product[] = [
        {
            id: 1,
            name: "Rak Bumbu Dapur Multifungsi 2 susun",
            image: "/image/image 13.png",
            variant: {
                color: "Merah",
                size: "Besar"
            },
            price: 350000,
            originalPrice: 500000,
            quantity: 2
        },

        {
            id: 2,
            name: "Rak Bumbu Dapur Multifungsi 2 susun",
            image: "/image/image 13.png",
            variant: {
                color: "Merah",
                size: "Besar"
            },
            price: 350000,
            originalPrice: 500000,
            quantity: 2
        }
    ];

    for (let i = 1; i <= 100; i++) {
        const subTotal = dummyProducts.reduce((acc, p) => acc + (p.price * p.quantity), 0);
        const totalAmount = subTotal + 4000 + 10000 + 32000 - 22000 - 22000 - 2500;

        transactions.push({
            id: `trans-${i}`,
            invoice: `Inv. 1234567890${i.toString().padStart(2, '0')}`,
            customerName: names[i % names.length],
            releaseEstimate: `${i % 3 + 1} hari setelah pesanan selesai`,
            paymentMethod: paymentMethods[i % paymentMethods.length],
            status: statusOptions[i % statusOptions.length],
            amount: totalAmount,
            date: new Date(2025, 7, Math.floor(Math.random() * 30) + 1), // Diubah ke Agustus
            products: dummyProducts,
            details: {
                subTotal: subTotal,
                productProtection: 4000,
                shippingFee: 10000,
                shippingInsurance: 32000,
                serviceFee: 2500,
                adminFee: 30000,
                storeVoucher: 22000,
            },
            shippingDetails: {
                courier: "TIKI Standard",
                trackingNumber: `SPX123456789`,
                address: "Jl.rajawali 1 lorong 10 ( samping masjid Nurul ilham lette belok kiri mentok), KOTA MAKASSAR, MARISO, SULAWESI SELATAN, ID, 90123",
                timeline: generateShippingDetails(),
            }
        });
    }
    return transactions;
};

const allTransactions = generateDummyTransactions();

const formatCurrency = (value: number) => { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0, }).format(value); };


const StatCard: React.FC<StatCardData> = ({ title, label, amount, color, href }) => {
    const colorStyles = { green: 'bg-[#208563] text-white', red: 'bg-gradient-to-b from-[#D82F5A] to-[#E83C68] bg-rose-600 text-white', blue: 'bg-[#196AD6] text-white', white: 'bg-white text-[#333]', };
    const iconStyles = { green: 'border-white/40 group-hover:bg-white/20', red: 'border-white/40 group-hover:bg-white/20', blue: 'border-white/40 group-hover:bg-white/20', white: ' group-hover:bg-gray-100', };
    return (
        <a href={href} className="group block ">
            <div className={`p-5 border border-[#DCDCDC] rounded-[20px] h-[150px] flex flex-col justify-between transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg ${colorStyles[color]}`}>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-[20px]">{title}</p>
                        <p className="text-[16px] ">{label}</p>
                    </div>
                    <div className={`p-1.5 border rounded-full transition-colors duration-300 ${iconStyles[color]}`}>
                        <ArrowUpRight size={18} />
                    </div>
                </div>
                <p className="mt-4 text-[16px] font-bold tracking-tight">Rp <span className='text-[25px]'>{formatRupiahNoRP(amount)}</span></p>
            </div>
        </a>
    );
};

const TransactionRow: React.FC<{ transaction: Transaction; isExpanded: boolean; onToggle: () => void; onShowDetail: () => void; }> = ({ transaction, isExpanded, onToggle, onShowDetail }) => {
    const totalPembayaran = transaction.details.subTotal + transaction.details.productProtection + transaction.details.shippingFee + transaction.details.shippingInsurance + transaction.details.serviceFee;
    const totalPenghasilan = totalPembayaran - transaction.details.adminFee - transaction.details.serviceFee - transaction.details.storeVoucher;
    return (
        <>
            <tr className={`${!isExpanded && "border-b border-[#BBBBBB]"} bg-white hover:bg-gray-50`}>
                <td className="p-4 align-top">
                    <div className="flex items-start gap-3 cursor-pointer  tracking-[-0.02em]" onClick={onToggle}>
                        <div className="w-[44px] h-[44px] bg-[#EBEAFC] border-border-[#EBEAFC] text-[#4A52B2] font-bold rounded-full flex items-center justify-center text-[16px] flex-shrink-0">
                            {transaction.customerName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-bold text-[#333333] text-[14px]">{transaction.customerName}</p>
                            <p className="text-[14px] text-[#333333]">{transaction.invoice}</p>
                        </div>
                    </div>
                </td>
                <td className="p-4 align-top text-[#333333] text-[14px]" style={{
                    lineHeight: "115%"
                }}>{transaction.releaseEstimate}</td>
                <td className="p-4 align-top text-[#333333] text-[14px]" style={{
                    lineHeight: "115%"
                }}>{transaction.paymentMethod}</td>
                <td className="p-4 align-top text-[#333333] text-[14px]" style={{
                    lineHeight: "115%"
                }}>Menunggu Pesanan Selesai</td>
                <td className="p-4 align-top">
                    <div className="flex items-center justify-end gap-2 cursor-pointer" onClick={onToggle}>
                        <span className="text-[#333333] text-[14px]" style={{
                            lineHeight: "115%"
                        }}  >{formatCurrency(transaction.amount)}</span>
                        <ChevronDown size={20} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                </td>
            </tr>
            {isExpanded && (
                <>
                    <tr className="">
                        <td colSpan={5} className="p-0">
                            <div className="p-5">
                                <div className="sm:hidden grid grid-cols-1 gap-x-8 text-sm">
                                    <div className="space-y-2">
                                        <div className="flex justify-end"><span className="text-gray-500">Sub Total Pesanan</span><span className="text-gray-800">{formatCurrency(transaction.details.subTotal)}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Product Protection</span><span className="text-gray-800">{formatCurrency(transaction.details.productProtection)}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Ongkir Dibayar Pembeli</span><span className="text-gray-800">{formatCurrency(transaction.details.shippingFee)}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Ongkos Kirim yang Dibayarkan ke Jasa Kirim</span><span className="text-gray-800">{formatCurrency(transaction.details.shippingInsurance)}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Potongan Ongkos Kirim</span><span className="text-red-500">-{formatCurrency(transaction.details.storeVoucher)}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Voucher Toko</span><span className="text-red-500">-{formatCurrency(transaction.details.storeVoucher)}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Biaya Layanan</span><span className="text-red-500">-{formatCurrency(transaction.details.serviceFee)}</span></div>
                                        <div className="flex justify-between font-bold"><span className="text-gray-800">Total Pembayaran Pembeli</span><span className="text-gray-800">{formatCurrency(totalPembayaran)}</span></div>
                                        <p className="font-bold text-gray-800">Biaya Lainnya</p>
                                        <div className="flex justify-between"><span className="text-gray-500">Biaya Administrasi</span><span className="text-red-500">-{formatCurrency(transaction.details.adminFee)}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Biaya Layanan</span><span className="text-red-500">-{formatCurrency(transaction.details.serviceFee)}</span></div>
                                        <div className="flex justify-between font-bold text-lg mt-4"><span className="text-gray-800">Total Penghasilan</span><span className="text-red-500 font-extrabold">{formatCurrency(totalPenghasilan)}</span></div>
                                    </div>
                                    <div className="space-y-2 mt-4 md:mt-0">
                                    </div>
                                </div>
                                <div className="hidden sm:grid grid-cols-1 gap-x-8 text-sm">
                                    <div className="space-y-2 grid grid-cols-4 tracking-[-0.02em] text-[#333333] text-[15px]">
                                        <div className='col-span-3 text-end'>
                                            <span className="">Sub Total Pesanan</span>
                                        </div>
                                        <div className='text-end'>
                                            <span className="font-bold">{formatCurrency(transaction.details.subTotal)}</span>
                                        </div>
                                        <div className='col-span-3 text-end'>
                                            <span className="">Product Protection</span>
                                        </div>
                                        <div className='text-end'>
                                            <span className="">{formatCurrency(transaction.details.productProtection)}</span>
                                        </div>
                                        <div className='col-span-3 text-end'>
                                            <span className="">Ongkir Dibayar</span>
                                        </div>
                                        <div className='text-end'>
                                            <span className="">{formatCurrency(transaction.details.shippingFee)}</span>
                                        </div>
                                        <div className='col-span-3 text-end'>
                                            <span className="">Ongkos Kirim yang Dibayarkan ke Jasa Kirim</span>
                                        </div>
                                        <div className='text-end'>
                                            <span className="">{formatCurrency(transaction.details.shippingInsurance)}</span>
                                        </div>
                                        <div className='col-span-3 text-end'>
                                            <span className="">Potongan Ongkos Kirim</span>
                                        </div>
                                        <div className='text-end'>
                                            <span className="">-{formatCurrency(transaction.details.storeVoucher)}</span>
                                        </div>
                                        <div className='col-span-3 text-end'>
                                            <span className="">Voucher Toko</span>
                                        </div>
                                        <div className='text-end'>
                                            <span className="">-{formatCurrency(transaction.details.storeVoucher)}</span>
                                        </div>
                                        <div className='col-span-3 text-end'>
                                            <span className="">Biaya Layanan</span>
                                        </div>
                                        <div className='text-end'>
                                            <span className="">-{formatCurrency(transaction.details.serviceFee)}</span>
                                        </div>
                                        <div className='col-span-3 text-end'>
                                            <span className="font-bold">Total Pembayaran Pembeli</span>
                                        </div>
                                        <div className='text-end'>
                                            <span className="font-bold">{formatCurrency(totalPembayaran)}</span>
                                        </div>
                                        <div className='col-span-3 text-end'>
                                            <span className="font-bold">Biaya Lainnya</span>
                                        </div>
                                        <div className='text-end'>
                                        </div>
                                        <div className='col-span-3 text-end'>
                                            <span className="">Biaya Administrasi</span>
                                        </div>
                                        <div className='text-end'>
                                            <span className="">-{formatCurrency(transaction.details.adminFee)}</span>
                                        </div>
                                        <div className='col-span-3 text-end'>
                                            <span className="">Biaya Layanan</span>
                                        </div>
                                        <div className='text-end'>
                                            <span className="">-{formatCurrency(transaction.details.serviceFee)}</span>
                                        </div>
                                        <div className='col-span-3 text-end'>
                                            <span className="">Total Penghasilan</span>
                                        </div>
                                        <div className='text-end'>
                                            <span className="text-[#E33947] text-[23px] font-bold tracking-[-0.04]" style={{
                                                lineHeight: "108%"
                                            }}>{formatCurrency(totalPenghasilan)}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2 mt-4 md:mt-0">
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr className='border-b border-[#BBBBBB] '>
                        <td className='border-t border-[#BBBBBB]/80' colSpan={5}>
                            <div className="text-end  px-6 py-4 ">
                                <button onClick={onShowDetail} className="text-[14px] text-[#5E5ED3] hover:underline">Lihat Detail Pesanan</button>
                            </div>
                        </td>
                    </tr>
                </>
            )}
        </>
    );
};

const Pagination: React.FC<{ currentPage: number; totalPages: number; onPageChange: (page: number) => void; itemsPerPage: number; }> = ({ currentPage, totalPages, onPageChange, itemsPerPage }) => {
    const paginationRange = useMemo(() => { const siblingCount = 1; const totalPageNumbers = siblingCount + 5; if (totalPageNumbers >= totalPages) { return Array.from({ length: totalPages }, (_, i) => i + 1); } const leftSiblingIndex = Math.max(currentPage - siblingCount, 1); const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages); const shouldShowLeftDots = leftSiblingIndex > 2; const shouldShowRightDots = rightSiblingIndex < totalPages - 2; const firstPageIndex = 1; const lastPageIndex = totalPages; if (!shouldShowLeftDots && shouldShowRightDots) { const leftItemCount = 3 + 2 * siblingCount; const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1); return [...leftRange, '...', totalPages]; } if (shouldShowLeftDots && !shouldShowRightDots) { const rightItemCount = 3 + 2 * siblingCount; const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + 1 + i); return [firstPageIndex, '...', ...rightRange]; } if (shouldShowLeftDots && shouldShowRightDots) { const middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i); return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex]; } }, [totalPages, currentPage]);
    if (currentPage === 0 || (paginationRange && paginationRange.length < 2)) { return null; }
    return (
        <div className="flex flex-col items-center mt-6 space-y-2 mb-4">
            <div className="flex items-center justify-center flex-wrap gap-2">
                <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center text-[#1E1E1E] px-3 py-2 rounded-md hover:bg-gray-100 gap-1  disabled:text-[#757575] disabled:cursor-not-allowed">
                    <ArrowLeft size={16} color={currentPage === 1 ? '#757575' : '#1E1E1E'} /> Sebelumnya
                </button>
                <div className="flex items-center gap-1 flex-wrap">
                    {paginationRange?.map((pageNumber, index) => {
                        if (pageNumber === '...') {
                            return <span key={`dots-${index}`} className="px-3 py-1.5 text-sm text-gray-500">...</span>;
                        }
                        return (
                            <button key={pageNumber} onClick={() => onPageChange(pageNumber as number)}
                                className={`px-4 py-2 rounded-[12px] ${currentPage === pageNumber ? 'bg-[#2C2C2C] text-[#F5F5F5]' : 'text-[#1E1E1E] hover:bg-gray-100'} ${typeof pageNumber !== 'number' ? 'cursor-default' : ''}`}>
                                {pageNumber}
                            </button>
                        );
                    })}
                </div>
                <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center px-3 py-2 text-[#1E1E1E] rounded-md  gap-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                    Berikutnya <ArrowRight size={16} color={currentPage === totalPages ? '#757575' : '#1E1E1E'} />
                </button>
            </div>
            <p className="text-[#555555] font-bold text-[15px] mb-4 sm:mb-0 text-center sm:mt-2">
                Menampilkan {itemsPerPage} Penjualan per Halaman
            </p>
        </div >
    );
};




// --- Komponen Halaman Detail Pesanan ---
const OrderDetailPage: React.FC<{ transaction: Transaction; onBack: () => void; }> = ({ transaction, onBack }) => {
    const totalPembayaran = transaction.details.subTotal + transaction.details.productProtection + transaction.details.shippingFee + transaction.details.shippingInsurance + transaction.details.serviceFee;
    const totalPenghasilan = totalPembayaran - transaction.details.adminFee - transaction.details.serviceFee - transaction.details.storeVoucher;

    const trackingData: TrackingEvent[] = [
        { time: '10-07-2025 20:42', title: 'Terkirim', description: 'Pesanan tiba di alamat tujuan, diterima oleh Yang bersangkutan. Penerima: Andi Gustisari.' },
        { time: '10-07-2025 08:54', title: 'Pesanan dalam Pengiriman', description: 'Pesanan dalam proses pengantaran.' },
        { time: '10-07-2025 08:54', title: '', description: 'Kurir sudah ditugaskan. Pesanan akan dikirim.' },
        { time: '10-07-2025 06:27', title: '', description: 'Pesanan diproses di lokasi transit Kota Makassar, Mamajang Hub.' },
        { time: '10-07-2025 05:17', title: '', description: 'Pesanan tiba di lokasi transit Kota Makassar, Mamajang Hub.' },
        { time: '10-07-2025 05:17', title: '', description: 'Pesanan dikirim dari lokasi sortir Kota Makassar Tamalanrea DC ke Kota Makassar, Mamajang Hub via darat dengan estimasi waktu 1 hari.' },
        { time: '09-07-2025 12:46', title: '', description: 'Pesanan tiba di lokasi transit Kota Makassar, Tamalanrea DC.' },
        { time: '09-07-2025 12:46', title: '', description: 'Pesanan diproses di lokasi sortir Kota Cimahi, Bandung DC.' },
    ];

    const fullTrackingData: TrackingEvent[] = [
        ...trackingData,
        { time: '07-07-2025 17:20', title: '', description: 'Pesanan dikirim dari lokasi transit Kab. Bandung Barat, Padalarang First Mile Hub.' },
        { time: '07-07-2025 16:22', title: '', description: 'Pesanan tiba di lokasi transit Kab. Bandung Barat, Padalarang First Mile Hub.' },
        { time: '07-07-2025 12:56', title: '', description: 'Pesanan telah diserahkan ke jasa kirim untuk diproses.' },
        { time: '07-07-2025 09:15', title: 'Sedang Dikemas', description: 'Kurir ditugaskan untuk menjemput pesanan.' },
        { time: '07-07-2025 07:11', title: '', description: 'Penjual telah mengatur pengiriman. Menunggu pesanan diserahkan ke pihak jasa kirim.' },
        { time: '07-07-2025 05:19', title: 'Pesanan Dibuat', description: '' },
    ];

    const [showAll, setShowAll] = useState(false);
    const displayedTrackingData = showAll ? fullTrackingData : trackingData;
    const censorName = (name: string) => {
        if (name.length <= 2) return name[0] + '*'.repeat(name.length - 1);
        return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
    };

    const censorPhone = (phone: string) => {
        const clean = phone.replace(/\D/g, ''); // hanya angka
        if (clean.length <= 4) return '*'.repeat(clean.length);
        return '*'.repeat(clean.length - 2) + clean.slice(-2);
    };
    return (
        <>
            <div className="border border-[#D2D4D8] bg-[#F3F5F7] p-4 px-6 rounded-[8px] flex items-start justify-between">
                <div>
                    <h1 className="text-[28px] text-[#333333] font-[800] tracking-[-0.02em]">Rincian Pesanan</h1>
                    <p className="text-[#444444] mt-4 text-[14px]" style={{
                        lineHeight: "107%"
                    }}>
                        Atur kurir sesuai kebutuhan tokomu.<br />
                        Pilih layanan pengiriman yang kamu pakai biar pembeli bisa checkout tanpa ribet.
                    </p>
                </div>
            </div>
            <div className="space-y-6 mt-4">
                <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft size={18} />
                    Kembali ke Rincian Penghasilan
                </button>

                <div className="p-5 sm:p-0 bg-white rounded-[5px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)] tracking-[-0.02em] border border-[#dcdcdc]">
                    <div className='border-b border-[#BBBBBB]/80 px-8 py-4'>
                        <h2 className="text-[18px] font-bold text-[#333333]">Informasi Pesanan</h2>
                    </div>
                    <div className='px-8 py-4'>
                        <div className='space-y-2'>
                            <p className='text-[#333333] text-[14px] font-bold'>Dipesan Oleh</p>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-[44px] h-[44px] bg-[#EBEAFC] border border-[#EBEAFC] text-[#4A52B2] font-bold rounded-full flex items-center justify-center text-[16px] flex-shrink-0">{transaction.customerName.substring(0, 2).toUpperCase()}</div>
                                    <div>
                                        <p className="font-bold text-[#333333] text-[14px]">{transaction.customerName}</p>
                                        <p className="text-[14px] text-[#333333]">Pesanan Selesai</p>
                                    </div>
                                </div>
                                <button className="bg-[#19976D] border-[#79747E] border text-[#E8DEF8] px-8 py-2 text-[14px] font-semibold hover:bg-teal-600">Chat</button>
                            </div>
                        </div>
                        <div className=" my-4"></div>
                        <p className="text-[14px] font-bold text-[#333333]">Nomor Pesanan</p>
                        <p className="text-[14px] text-[#333333]">{transaction.shippingDetails.trackingNumber}</p>
                    </div>
                </div>

                <div className="bg-white border border-[#DCDCDC] rounded-[5px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)]">
                    <div className="p-4 border-b border-[#CCCCCC] flex justify-between items-center tracking-[-0.02em] px-8">
                        <h2 className="text-[18px] font-bold text-[#333333]">Detail Pengiriman</h2>
                        <div className="text-right">
                            <p className="font-[500] text-[14px] text-[#666666]">TIKI Standard</p>
                            <p className="font-[500] text-[14px] text-[#666666]">SPX123456789</p>
                        </div>
                    </div>
                    <div className="md:grid md:grid-cols-12 md:gap-8">
                        <div className="py-6 px-8 md:col-span-4 mb-8 md:mb-0 border-[#CCCCCC] border-r tracking-[-0.02em]">
                            <h3 className="font-[500] text-[14px] text-[#333333] mb-2">Alamat Pengiriman</h3>
                            <div className="font-[500] text-[14px] text-[#333333] space-y-2">
                                <p>{censorName('Andi Gustisarim')}, {censorPhone('(+62) 81292651600')}</p>
                                <p>Jl.rajawali 1 lorong 10 ( samping masjid nurul ihsan lorong belok kiri mentok), KOTA MAKASSAR, MARISO, SULAWESI SELATAN, ID, 90123</p>
                            </div>
                            {/* <div className='h-full border-r border-red-500 col-span-1' /> */}
                        </div>
                        <div className="px-6 md:px-0 md:col-span-8 py-6 pr-6">
                            {displayedTrackingData.map((item, index) => (
                                <TimelineItem
                                    key={index}
                                    time={item.time}
                                    title={item.title}
                                    description={item.description}
                                    isFirst={index === 0}
                                    isLast={index === displayedTrackingData.length - 1}
                                />
                            ))}
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="text-sm font-semibold text-red-500 hover:text-red-600 mt-2 ml-10"
                            >
                                {showAll ? 'Tampilkan Lebih Sedikit' : 'Tampilkan Lebih Banyak'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-[#DCDCDC] rounded-[5px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)]">
                    <div className='border-b border-[#BBBBBB]/80 px-8 py-4'>
                        <h2 className="text-[18px] font-bold text-[#333333]">Informasi Produk</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="uppercase border-b border-[#BBBBBB]/80">
                                <tr className='tracking-[-0.02em] text-[14px] text-[#333333]'>
                                    <td scope="col" className="px-8 py-3">No</td>
                                    <td scope="col" className="px-6 py-3">Produk</td>
                                    <td scope="col" className="px-6 py-3 text-right">Harga Satuan</td>
                                    <td scope="col" className="px-6 py-3 text-center">Jumlah</td>
                                    <td scope="col" className="px-8 py-3 text-right">Sub Total</td>
                                </tr>
                            </thead>
                            <tbody>
                                {transaction.products.map((product, index) => (
                                    <tr key={product.id} className="bg-white border-b border-[#DDDDDDCC]/80">
                                        <td className="px-8 py-4">{index + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={product.image} alt={product.name} className="w-[67px] h-[67px] object-cover border border-[#AAAAAA]" />
                                                <div className=''>
                                                    <p className="font-bold text-[15px] text-[#333333]" style={{
                                                        lineHeight: "108%"
                                                    }}>{product.name}</p>
                                                    <p className="text-13  text-[#333333] mt-2">Variasi Warna: <span className='font-bold'>{product.variant.color}</span></p>
                                                    <p className="text-13  text-[#333333]">Ukuran: <span className='font-bold'>{product.variant.size}</span></p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-[#333333] text-[14px]">
                                            <p className="">{formatCurrency(product.price)}</p>
                                            <p className="text-[12px] text-[#888888] tracking-[-0.02em] line-through">{formatCurrency(product.originalPrice)}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center text-[#333333] text-[14px] tracking-[-0.02em]">{product.quantity}</td>
                                        <td className="px-8 py-4 text-right text-[#333333] text-[14px] tracking-[-0.02em]">{formatCurrency(product.price * product.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white border border-[#DCDCDC] rounded-[5px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)]">
                    <div className='border-b border-[#BBBBBB]/80 px-8 py-4'>
                        <h2 className="text-[18px] font-bold text-[#333333]">Informasi Pembayaran</h2>
                    </div>
                    <div className=" px-8 py-6">
                        <div className="space-y-2 grid grid-cols-4 tracking-[-0.02em] text-[#333333] text-[15px]">
                            <div className='col-span-3 text-end'>
                                <span className="">Sub Total Pesanan</span>
                            </div>
                            <div className='text-end'>
                                <span className="font-bold">{formatCurrency(transaction.details.subTotal)}</span>
                            </div>
                            <div className='col-span-3 text-end'>
                                <span className="">Product Protection</span>
                            </div>
                            <div className='text-end'>
                                <span className="">{formatCurrency(transaction.details.productProtection)}</span>
                            </div>
                            <div className='col-span-3 text-end'>
                                <span className="">Ongkir Dibayar</span>
                            </div>
                            <div className='text-end'>
                                <span className="">{formatCurrency(transaction.details.shippingFee)}</span>
                            </div>
                            <div className='col-span-3 text-end'>
                                <span className="">Ongkos Kirim yang Dibayarkan ke Jasa Kirim</span>
                            </div>
                            <div className='text-end'>
                                <span className="">{formatCurrency(transaction.details.shippingInsurance)}</span>
                            </div>
                            <div className='col-span-3 text-end'>
                                <span className="">Potongan Ongkos Kirim</span>
                            </div>
                            <div className='text-end'>
                                <span className="">-{formatCurrency(transaction.details.storeVoucher)}</span>
                            </div>
                            <div className='col-span-3 text-end'>
                                <span className="">Voucher Toko</span>
                            </div>
                            <div className='text-end'>
                                <span className="">-{formatCurrency(transaction.details.storeVoucher)}</span>
                            </div>
                            <div className='col-span-3 text-end'>
                                <span className="">Biaya Layanan</span>
                            </div>
                            <div className='text-end'>
                                <span className="">-{formatCurrency(transaction.details.serviceFee)}</span>
                            </div>
                            <div className='col-span-3 text-end'>
                                <span className="font-bold">Total Pembayaran Pembeli</span>
                            </div>
                            <div className='text-end'>
                                <span className="font-bold">{formatCurrency(totalPembayaran)}</span>
                            </div>
                            <div className='col-span-3 text-end'>
                                <span className="font-bold">Biaya Lainnya</span>
                            </div>
                            <div className='text-end'>
                            </div>
                            <div className='col-span-3 text-end'>
                                <span className="">Biaya Administrasi</span>
                            </div>
                            <div className='text-end'>
                                <span className="">-{formatCurrency(transaction.details.adminFee)}</span>
                            </div>
                            <div className='col-span-3 text-end'>
                                <span className="">Biaya Layanan</span>
                            </div>
                            <div className='text-end'>
                                <span className="">-{formatCurrency(transaction.details.serviceFee)}</span>
                            </div>
                        </div>
                    </div>
                    <div className='space-y-2 grid grid-cols-4 tracking-[-0.02em] text-[#333333] text-[15px] border-t border-[#DDDDDD] px-8 py-4'>
                        <div className='col-span-3 text-end'>
                            <span className="">Total Penghasilan</span>
                        </div>
                        <div className='text-end'>
                            <span className="text-[#E33947] text-[23px] font-bold tracking-[-0.04]" style={{
                                lineHeight: "108%"
                            }}>{formatCurrency(totalPenghasilan)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// --- Komponen Dashboard ---
const IncomeView: React.FC<{ onShowDetail: (transaction: Transaction) => void }> = ({ onShowDetail }) => {
    const [activeTab, setActiveTab] = useState<'Pending' | 'Sudah Dilepas'>('Pending');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
    const [isDatePickerOpen, setDatePickerOpen] = useState(false);
    const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });

    const filteredTransactions = useMemo(() => {
        let transactions = allTransactions.filter(t => t.status === activeTab);
        if (dateRange.start && dateRange.end) {
            const startDate = new Date(dateRange.start.setHours(0, 0, 0, 0));
            const endDate = new Date(dateRange.end.setHours(23, 59, 59, 999));
            transactions = transactions.filter(t => t.date >= startDate && t.date <= endDate);
        }
        return transactions;
    }, [activeTab, dateRange]);

    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
    }, [currentPage, itemsPerPage, filteredTransactions]);

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

    const handleTabClick = (tab: 'Pending' | 'Sudah Dilepas') => { setActiveTab(tab); setCurrentPage(1); setExpandedRowId(null); };
    const handleToggleRow = (id: string) => { setExpandedRowId(prevId => (prevId === id ? null : id)); };
    const handleResetFilters = () => { setDateRange({ start: null, end: null }); setCurrentPage(1); };

    const displayDateRange = useMemo(() => {
        if (dateRange.start && dateRange.end) {
            return `${format(dateRange.start, 'd MMM yyyy', { locale: id })} - ${format(dateRange.end, 'd MMM yyyy', { locale: id })}`;
        }
        return 'Semua Waktu';
    }, [dateRange]);

    return (
        <main>
            <div className="border border-[#D2D4D8] bg-[#F3F5F7] p-4 px-6 rounded-[8px] flex items-start justify-between">
                <div>
                    <h1 className="text-[28px] text-[#333333] font-[800] tracking-[-0.02em]">Penghasilan Saya</h1>
                    <p className="text-[#444444] mt-4 text-[14px]" style={{
                        lineHeight: "107%"
                    }}>
                        Atur kurir sesuai kebutuhan tokomu.<br />
                        Pilih layanan pengiriman yang kamu pakai biar pembeli bisa checkout tanpa ribet.
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mt-6">
                {dummyStats.map((stat, index) => (<StatCard key={index} {...stat} />))}
            </div>
            <div className="p-4 sm:p-0">
                <div className=' grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6'>
                    <div className='space-x-2 lg-col-span-1' style={{
                        lineHeight: "115%"
                    }}>
                        <button onClick={() => handleTabClick('Pending')} className={`py-2 px-4 border text-[14px] text-sm ${activeTab === 'Pending' ? 'border-[#845FF5] border-2 bg-[#E9E2FF] text-[#845FF5] font-bold' : ' text-[#CCCCCC] hover:text-gray-700 border-[#CCCCCC] hover:border-gray-300'}`}>Pending</button>
                        <button onClick={() => handleTabClick('Sudah Dilepas')} className={`py-2 px-4 border text-[14px] ${activeTab === 'Sudah Dilepas' ? 'border-[#845FF5] border-2 bg-[#E9E2FF] text-[#845FF5] font-bold' : ' text-[#333] hover:text-gray-700 border-[#CCCCCC] hover:border-gray-300'}`}>Sudah Dilepas</button>
                    </div>
                    <div className='lg:col-span-2'>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className='w-full sm:w-auto flex-grow'>
                                <button onClick={() => setDatePickerOpen(true)} className="w-full text-left flex items-center justify-between px-3 py-2 border border-[#AAAAAA] rounded-[5px] h-[40px] bg-white">
                                    <span className="text-sm truncate text-[#777777] pr-2">Periode Tanggal |</span>
                                    <span className="text-sm truncate text-[#333333] flex-grow text-center">{displayDateRange}</span>
                                    <Calendar className="text-gray-400 ml-2 flex-shrink-0" size={20} />
                                </button>
                            </div>
                            <button className='h-[40px] px-8 bg-[#FFFFFF] rounded-[5px] border border-[#52357B] text-[#333333] font-bold text-[14px]' onClick={handleResetFilters}>
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4">Penghasilan di {activeTab} <span className='text-[14px] font-bold tracking-[-0.02em] text-[#333] ml-8'>{allTransactions?.length} Transaksi</span> </h3>
                <div className="overflow-x-auto py-6">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-[#F3F5F7]">
                            <tr className="border border-[#DDDDDD]" style={{
                                lineHeight: '115%'
                            }}>
                                <th className="p-4 text-[14px] font-bold text-[#333333]">Pesanan</th>
                                <th className="p-4 text-[14px] font-bold text-[#333333]">Perkiraan waktu pelepasan dana</th>
                                <th className="p-4 text-[14px] font-bold text-[#333333]">Metode Pembayaran</th>
                                <th className="p-4 text-[14px] font-bold text-[#333333]">Status</th>
                                <th className="p-4 text-[14px] font-bold text-[#333333] text-right">Dana akan dilepas</th>
                            </tr>
                        </thead>
                        <tbody className='border border-[#DDDDDD]'>
                            {paginatedTransactions.length > 0 ? (
                                paginatedTransactions.map(transaction => (
                                    <TransactionRow key={transaction.id} transaction={transaction} isExpanded={expandedRowId === transaction.id} onToggle={() => handleToggleRow(transaction.id)} onShowDetail={() => onShowDetail(transaction)} />
                                ))
                            ) : (
                                <tr><td colSpan={5} className="text-center p-8 text-gray-500">Tidak ada data untuk periode yang dipilih.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {paginatedTransactions.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} itemsPerPage={itemsPerPage} />}
                <DatePickerModal isOpen={isDatePickerOpen} onClose={() => setDatePickerOpen(false)} onApply={setDateRange} initialRange={dateRange} />
            </div>
        </main>
    );
};

const MyIncomePage: React.FC = () => {
    const [view, setView] = useState<'icome' | 'detail'>('icome');
    const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);

    useEffect(() => {
        const stylesheetId = 'react-day-picker-styles';
        if (document.getElementById(stylesheetId)) { return; }
        const link = document.createElement('link');
        link.id = stylesheetId;
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/react-day-picker/dist/style.css';
        document.head.appendChild(link);
        return () => {
            const stylesheet = document.getElementById(stylesheetId);
            if (stylesheet) {
                stylesheet.remove();
            }
        };
    }, []);

    const handleShowDetail = (transaction: Transaction) => {
        setActiveTransaction(transaction);
        setView('detail');
    };

    const handleBackToDashboard = () => {
        setActiveTransaction(null);
        setView('icome');
    };

    return (
        <MyStoreLayout>
            {view === 'icome' ? (
                <IncomeView onShowDetail={handleShowDetail} />
            ) : activeTransaction ? (
                <OrderDetailPage transaction={activeTransaction} onBack={handleBackToDashboard} />
            ) : null}
        </MyStoreLayout>
    );
};

export default MyIncomePage;
