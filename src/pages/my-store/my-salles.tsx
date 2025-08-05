import React, { useState, useMemo, Fragment } from 'react';
import type { NextPage } from 'next';
import { ChevronDown, Calendar, Check, Search, ArrowLeft, ArrowRight } from 'lucide-react';
import MyStoreLayout from 'pages/layouts/MyStoreLayout';
import DatePickerModal from 'components/my-store/DatePickerModal';
import { Listbox, Transition } from '@headlessui/react';

// --- PERUBAHAN 1: Tipe Data Variasi Dinamis ---
// Tipe data untuk setiap atribut variasi (misal: { name: 'Warna', value: 'Merah' })
type Variation = {
    name: string;
    value: string;
};

// Tipe data untuk setiap item produk dalam pesanan, sekarang menggunakan array variasi
type ProductItem = {
    id: number;
    name: string;
    imageUrl: string;
    variations: Variation[]; // Menggantikan 'variation' dan 'size'
    quantity: number;
    price: number;
};

// Tipe data untuk setiap pesanan
type Order = {
    orderId: string;
    customerName: string;
    products: ProductItem[];
    status: 'Selesai' | 'Belum Bayar' | 'Perlu Dikirim' | 'Dibatalkan' | 'Pengembalian' | 'Dikirim';
    shipping: {
        service: string;
        type: string;
        trackingId: string;
    };
    paymentMethod: string;
    date: string; // YYYY-MM-DD
};

// --- PERUBAHAN 2: Pembaruan Data Dummy ---
// Mendefinisikan 4 pesanan pertama dengan struktur variasi baru
const initialOrders: Order[] = [
    {
        orderId: 'Z2025070000120010201', customerName: 'Sulastri',
        products: [{ id: 1, name: 'Rak Bumbu Dapur Multifungsi 2 susun', imageUrl: '/image/image 13.png', variations: [{ name: 'Warna', value: 'Merah' }, { name: 'Ukuran', value: 'Besar' }], quantity: 20, price: 301000 }],
        status: 'Selesai', shipping: { service: 'JNT Standar', type: 'Regular (Cashless)', trackingId: 'JNT22012901201212100' }, paymentMethod: 'COD (Bayar Ditempat)', date: '2025-07-01',
    },
    {
        orderId: 'Z2025070000120010202', customerName: 'Andi Gustisari',
        products: [
            { id: 2, name: 'Rak Bumbu Dapur Multifungsi 2 susun', imageUrl: '/image/image 13.png', variations: [{ name: 'Warna', value: 'Merah' }, { name: 'Ukuran', value: 'Besar' }], quantity: 20, price: 301000 },
            { id: 3, name: 'Panci Listrik Serbaguna', imageUrl: '/image/image 13.png', variations: [{ name: 'Warna', value: 'Hijau' }, { name: 'Ukuran', value: 'Kecil' }], quantity: 10, price: 150000 }
        ],
        status: 'Selesai', shipping: { service: 'JNT Standar', type: 'Regular (Cashless)', trackingId: 'JNT22012901201212122' }, paymentMethod: 'Transfer Bank', date: '2025-07-15',
    },
    {
        orderId: 'Z2025070000120010203', customerName: 'Budi Hartono',
        products: [{ id: 4, name: 'Lampu Belajar LED', imageUrl: '/image/image 13.png', variations: [{ name: 'Warna', value: 'Putih' }, { name: 'Tipe', value: 'Standar' }], quantity: 5, price: 75000 }],
        status: 'Belum Bayar', shipping: { service: 'SiCepat REG', type: 'Regular', trackingId: 'SICEPAT0012345678' }, paymentMethod: 'Virtual Account', date: '2025-07-24',
    },
    {
        orderId: 'Z2025070000120010204', customerName: 'Citra Lestari',
        products: [{ id: 5, name: 'Keyboard Mechanical Gaming', imageUrl: '/image/image 13.png', variations: [{ name: 'Warna', value: 'Hitam' }, { name: 'Switch', value: 'Blue' }], quantity: 2, price: 850000 }],
        status: 'Perlu Dikirim', shipping: { service: 'JNE OKE', type: 'Ekonomi', trackingId: 'JNE00987654321' }, paymentMethod: 'Kartu Kredit', date: '2025-07-30',
    },
];

// Menghasilkan pesanan tambahan dengan variasi dinamis
const generatedOrders: Order[] = [];
const statuses: Order['status'][] = ['Selesai', 'Dikirim', 'Dibatalkan', 'Belum Bayar', 'Perlu Dikirim'];

// Contoh variasi dinamis untuk data yang di-generate
const sampleVariations: Variation[][] = [
    [{ name: 'Warna', value: 'Kuning' }, { name: 'Ukuran', value: 'M' }],
    [{ name: 'Warna', value: 'Hijau' }, { name: 'Ukuran', value: 'L' }],
    [{ name: 'Warna', value: 'Hitam' }, { name: 'Ukuran', value: 'S' }],
    [{ name: 'Tipe', value: 'Model A' }, { name: 'Bahan', value: 'Plastik' }],
    [{ name: 'Warna', value: 'Putih' }, { name: 'Bahan', value: 'Katun' }],
];


for (let i = 0; i < 151; i++) {
    const newOrder: Order = {
        orderId: `Z2025080000120010${205 + i}`,
        customerName: `Pelanggan ke-${i + 5}`,
        products: [{
            id: 6 + i,
            name: `Produk Contoh ${i + 1}`,
            imageUrl: '/image/image 13.png',
            variations: sampleVariations[i % sampleVariations.length], // Menggunakan variasi dinamis
            quantity: 1 + i % 5,
            price: 50000 + (i * 1000)
        }],
        status: statuses[i % 5],
        shipping: {
            service: 'JNT Express',
            type: 'Regular',
            trackingId: `JNTTRACKING${1000 + i}`
        },
        paymentMethod: 'COD (Bayar Ditempat)',
        date: `2025-08-${String(1 + (i % 15)).padStart(2, '0')}`,
    };
    generatedOrders.push(newOrder);
}

// Menggabungkan kedua array
const dummyOrders: Order[] = [...initialOrders, ...generatedOrders];

// --- Helper Functions ---
const formatDate = (date: Date | null, options: Intl.DateTimeFormatOptions = {}): string => {
    if (!date) return '';
    const defaultOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric', month: 'short', year: 'numeric', ...options
    };
    return date.toLocaleDateString('id-ID', defaultOptions);
};

// --- PERUBAHAN 3: Update Komponen OrderCard untuk Menampilkan Variasi Dinamis ---
const OrderCard: React.FC<{ order: Order }> = ({ order }) => (
    <div className="bg-white rounded-[5px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)] border border-[#dcdcdc] mb-4">
        <div className="p-5 px-6 border-b border-[#BBBBBBCC]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h3 className="font-bold text-[#333333] text-[14px]">{order.customerName}</h3>
                <p className="text-[14px] text-[#333333] text-end mt-1 sm:mt-0">Nomor Pesanan {order.orderId}</p>
            </div>
        </div>
        <div className="">
            {order.products.map(product => (
                <div key={product.id} className="flex flex-col lg:flex-row items-start px-4">
                    {/* Kolom Produk */}
                    <div className="w-full lg:w-[40%] py-4 flex items-start pr-4 justify-between space-x-4 ">
                        <div className='flex items-start gap-4'>
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-[67px] h-[67px] object-cover border border-[#AAAAAA] flex-shrink-0"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/80x80/fecaca/991b1b?text=Error'; }}
                            />
                            <div>
                                <p className="font-semibold text-gray-800">{product.name}</p>
                                {/* Menampilkan variasi secara dinamis */}
                                <p className="text-[13px] text-[#333333]">
                                    Variasi:
                                    {product.variations.map((v, index) => (
                                        <span key={index}>
                                            {v.name}: <span className='font-bold'>{v.value}</span>
                                            <br />
                                        </span>
                                    ))}
                                </p>
                            </div>
                        </div>
                        <p className='text-end'>x{product.quantity}</p>
                    </div>

                    {/* Kolom Lainnya */}
                    <div className="w-full lg:w-[60%] flex flex-col lg:flex-row items-start">
                        <div className="w-full lg:w-1/4 py-4  px-2 flex justify-between lg:justify-start items-center">
                            <span className="lg:hidden font-medium text-gray-500">Total Pesanan</span>
                            <div style={{ lineHeight: "115%" }}>
                                <p className="text-[18px] text-[#333333]">Rp{product.price.toLocaleString('id-ID')}</p>
                                <p className="text-[13px] text-[#333333]">{order.paymentMethod}</p>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/4 py-4 px-2 flex justify-between lg:justify-start items-center ">
                            <span className="lg:hidden font-medium text-gray-500">Status</span>
                            <p className='text-[14px] text-[#333333] font-bold'>{order.status}</p>
                        </div>
                        <div className="w-full lg:w-1/4 py-4 px-2 flex justify-between lg:justify-start items-center ">
                            <span className="lg:hidden font-medium text-gray-500">Jasa Kirim</span>
                            <div>
                                <p className="text-[14px] text-[#333333]">{order.shipping.type}</p>
                                <p className="text-[13px] text-[#333333]">{order.shipping.service}</p>
                                <p className="text-[13px] text-[#333333]">{order.shipping.trackingId}</p>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/4 py-4 px-2 flex justify-between lg:justify-center items-center">
                            <span className="lg:hidden font-medium text-gray-500">Aksi</span>
                            <button className="text-[#333333] hover:text-purple-800  text-[14px] text-center">Lihat Rincian</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// Komponen Paginasi (Tidak ada perubahan)
const Pagination: React.FC<{
    currentPage: number; totalPages: number; onPageChange: (page: number) => void;
    itemsPerPage: number; totalItems: number;
}> = ({ currentPage, totalPages, onPageChange, itemsPerPage }) => {
    const pageNumbers = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
        pageNumbers.push(1);
        if (currentPage > 3) pageNumbers.push('...');
        if (currentPage > 2) pageNumbers.push(currentPage - 1);
        if (currentPage !== 1 && currentPage !== totalPages) pageNumbers.push(currentPage);
        if (currentPage < totalPages - 1) pageNumbers.push(currentPage + 1);
        if (currentPage < totalPages - 2) pageNumbers.push('...');
        pageNumbers.push(totalPages);
    }
    const uniquePageNumbers = [...new Set(pageNumbers)];

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center mt-6 text-sm">
            <div>
                <div className="flex items-center space-x-1">
                    <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center text-[#1E1E1E] px-3 py-2 rounded-md hover:bg-gray-100 disabled:text-[#757575] disabled:cursor-not-allowed">
                        <ArrowLeft size={16} color={currentPage === 1 ? '#757575' : '#1E1E1E'} /> <span className="ml-1">Sebelumnya</span>
                    </button>
                    <div className="hidden md:flex items-center space-x-1">
                        {uniquePageNumbers.map((num, index) => (
                            <button key={index} onClick={() => typeof num === 'number' && onPageChange(num)} disabled={typeof num !== 'number'}
                                className={`px-4 py-2 rounded-[12px] ${currentPage === num ? 'bg-[#2C2C2C] text-[#F5F5F5]' : 'text-[#1E1E1E] hover:bg-gray-100'} ${typeof num !== 'number' ? 'cursor-default' : ''}`}>
                                {num}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center px-3 py-2 text-[#1E1E1E] rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span className="mr-1">Berikutnya</span> <ArrowRight size={16} color={currentPage === totalPages ? '#757575' : '#1E1E1E'} />
                    </button>
                </div>
                <p className="text-[#555555] font-bold text-[15px] mb-4 sm:mb-0 text-center sm:mt-2">
                    Menampilkan {itemsPerPage} Penjualan per Halaman
                </p>
            </div>
        </div>
    );
};

// Komponen Halaman Utama (Tidak ada perubahan signifikan pada logika)
const MySallesPage: NextPage = () => {
    const TABS = ['Semua', 'Belum Bayar', 'Perlu Dikirim', 'Dikirim', 'Selesai', 'Dibatalkan', 'Pengembalian'];
    const SEARCH_OPTIONS = ['Nama Produk', 'Nomor Pesanan'];
    const SHIPPING_OPTIONS = ['Semua Jasa Kirim', 'JNT Standar', 'SiCepat REG', 'JNE OKE', 'JNT Express'];
    const [activeTab, setActiveTab] = useState('Semua');
    const [searchType, setSearchType] = useState('Nama Produk');
    const [searchTerm, setSearchTerm] = useState('');
    const [shippingFilter, setShippingFilter] = useState('Semua Jasa Kirim');
    const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({
        start: null, end: null
    });
    const [isDatePickerOpen, setDatePickerOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 20;

    const filteredOrders = useMemo(() => {
        let orders = dummyOrders;
        if (activeTab !== 'Semua') orders = orders.filter(order => order.status === activeTab);
        if (searchTerm) {
            orders = orders.filter(order => {
                const term = searchTerm.toLowerCase();
                if (searchType === 'Nama Produk') return order.products.some(p => p.name.toLowerCase().includes(term));
                if (searchType === 'Nomor Pesanan') return order.orderId.toLowerCase().includes(term);
                return false;
            });
        }
        if (shippingFilter !== 'Semua Jasa Kirim') orders = orders.filter(order => order.shipping.service === shippingFilter);
        if (dateRange.start && dateRange.end) {
            orders = orders.filter(order => {
                const orderDate = new Date(order.date); orderDate.setHours(0, 0, 0, 0);
                const startDate = new Date(dateRange.start!); startDate.setHours(0, 0, 0, 0);
                const endDate = new Date(dateRange.end!); endDate.setHours(0, 0, 0, 0);
                return orderDate >= startDate && orderDate <= endDate;
            });
        }
        return orders;
    }, [activeTab, searchTerm, searchType, shippingFilter, dateRange]);

    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredOrders, currentPage]);

    const handleReset = () => {
        setActiveTab('Semua'); setSearchType('Nama Produk'); setSearchTerm('');
        setShippingFilter('Semua Jasa Kirim');
        setDateRange({ start: null, end: null }); setCurrentPage(1);
    };

    const displayDateRange = useMemo(() => {
        if (dateRange.start && dateRange.end) return `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`;
        return 'Pilih Periode Tanggal';
    }, [dateRange]);

    return (
        <main>
            <DatePickerModal isOpen={isDatePickerOpen} onClose={() => setDatePickerOpen(false)} onApply={setDateRange} initialRange={dateRange} />
            <div className="border border-[#D2D4D8] bg-[#F3F5F7] p-4 px-6 rounded-[8px] flex items-start justify-between">
                <div>
                    <h1 className="text-[28px] text-[#333333] font-[800] tracking-[-0.02em]">Penjualan Saya</h1>
                    <p className="text-[#444444] mt-4 text-[14px]" style={{
                        lineHeight: "107%"
                    }}>
                        Toko jalan, kamu tenang. <br /> Semua data penjualan dan laporan keuangan bisa kamu akses langsung di sini.
                    </p>
                </div>
            </div>
            <div className="mt-6 mb-8">
                <div className="max-w-screen-xl mx-auto">
                    <div className="bg-white rounded-[8px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)] border border-[#dcdcdc]">
                        <div className="border-b border-[#BBBBBBCC]/80 px-12">
                            <nav className="-mb-px flex space-x-6 overflow-x-auto no-scrollbar">
                                {TABS.map(tab => (
                                    <button key={tab} onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                                        className={`whitespace-nowrap py-4 px-1 border-b-3 text-[16px] ${activeTab === tab ? 'border-[#BB2C31] font-bold text-[#BB2C31]' : 'border-transparent text-[#333333] hover:text-gray-700 hover:border-gray-300'}`}>
                                        {tab}
                                    </button>
                                ))}
                            </nav>
                        </div>
                        <div className='space-y-4 px-4 pt-4 sm:flex items-start justify-between gap-4 sm:pt-6 sm:px-0'>
                            <div className="grid grid-cols-1 md:grid-cols-2 w-full  xl:grid-cols-5 gap-4 items-center sm:p-6 sm:pt-0 sm:pr-0">
                                <div className="xl:col-span-3">
                                    <div className="flex gap-2">
                                        <Listbox value={searchType} onChange={setSearchType}>
                                            <div className="relative">
                                                <Listbox.Button className="relative w-full h-[40px] cursor-default rounded-[5px] border border-[#AAAAAA] bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-purple-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-300 sm:text-sm">
                                                    <span className="block truncate text-[14px] text-[#333333]">{searchType}</span>
                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                        <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                    </span>
                                                </Listbox.Button>
                                                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                        {SEARCH_OPTIONS.map((option, optionIdx) => (
                                                            <Listbox.Option key={optionIdx}
                                                                className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-purple-100 text-purple-900' : 'text-gray-900'}`}
                                                                value={option}>
                                                                {({ selected }) => (
                                                                    <>
                                                                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{option}</span>
                                                                        {selected ? (
                                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-600"><Check className="h-5 w-5" aria-hidden="true" /></span>
                                                                        ) : null}
                                                                    </>
                                                                )}
                                                            </Listbox.Option>
                                                        ))}
                                                    </Listbox.Options>
                                                </Transition>
                                            </div>
                                        </Listbox>
                                        <div className='border border-[#AAAAAA] w-full rounded-[5px] flex items-center h-[40px] px-4'>
                                            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder={`Masukkan ${searchType}`}
                                                className="w-full outline-none py-2 text-[14px] palaceholder:text-[#AAAAAA] focus:ring-purple-500 focus:border-purple-500" />
                                            <Search size={18} strokeWidth={2.5} color='#888888' />
                                        </div>
                                    </div>
                                </div>
                                <div className='xl:col-span-2'>
                                    <div className="relative">
                                        <Listbox value={shippingFilter} onChange={setShippingFilter}>
                                            <div className="relative">
                                                <Listbox.Button className="relative w-full h-[40px] cursor-default rounded-[5px] border border-[#AAAAAA] bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-purple-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-300 sm:text-sm">
                                                    <span className="block truncate text-[14px] text-[#333333]">{shippingFilter}</span>
                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                        <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                    </span>
                                                </Listbox.Button>
                                                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                        {SHIPPING_OPTIONS.map((option, optionIdx) => (
                                                            <Listbox.Option key={optionIdx}
                                                                className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-purple-100 text-purple-900' : 'text-gray-900'}`}
                                                                value={option}>
                                                                {({ selected }) => (
                                                                    <>
                                                                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{option}</span>
                                                                        {selected ? (
                                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-600"><Check className="h-5 w-5" aria-hidden="true" /></span>
                                                                        ) : null}
                                                                    </>
                                                                )}
                                                            </Listbox.Option>
                                                        ))}
                                                    </Listbox.Options>
                                                </Transition>
                                            </div>
                                        </Listbox>
                                    </div>
                                </div>
                                <div className='xl:col-span-3'>
                                    <button onClick={() => setDatePickerOpen(true)} className="w-full text-left flex items-center justify-between px-3 py-2 border border-[#AAAAAA] rounded-[5px] h-[40px] bg-white">
                                        <span className="text-sm truncate text-[#777777] text-[14px]">Periode Tanggal  |</span>
                                        <span className="text-sm truncate text-[#333333] text-[14px]">{displayDateRange}</span>
                                        <Calendar className="text-gray-400 ml-2 flex-shrink-0" size={25} />
                                    </button>
                                </div>
                                <div>
                                    <p className="text-[15px] text-[#333333] font-bold tracking-[-0.02em] xl:col-span-2">{filteredOrders.length} Pesanan</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 justify-end pr-6 mb-6">
                                <button onClick={() => setCurrentPage(1)} className="bg-[#52357B] text-white text-[14px] font-bold px-6 py-2 rounded-[5px] h-[40px] hover:bg-purple-700 w-full sm:w-auto">Cari</button>
                                <button onClick={handleReset} className="bg-white text-[#333] text-[14px] font-bold px-6 py-2 border border-[#52357B] rounded-[5px] hover:bg-gray-50 w-full sm:w-auto">Reset</button>
                            </div>
                        </div>

                    </div>
                    <div className='space-y-[10px] mt-[10px] '>
                        <div className="hidden lg:flex  px-6 py-3 h-[50px]  bg-white rounded-[5px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)] border border-[#dcdcdc] text-[16px] font-bold text-[#333333]">
                            <div className="w-[40%]">Produk</div>
                            <div className="w-[60%] flex">
                                <div className="w-1/4 px-2">Total Pesanan</div>
                                <div className="w-1/4 px-2">Status</div>
                                <div className="w-1/4 px-2">Jasa Kirim</div>
                                <div className="w-1/4 px-2 text-center">Aksi</div>
                            </div>
                        </div>

                        {paginatedOrders.length > 0 ? (
                            paginatedOrders.map(order => <OrderCard key={order.orderId} order={order} />)
                        ) : (
                            <div className="text-center py-16 bg-white rounded-lg border border-gray-200"><p className="text-gray-500">Tidak ada pesanan yang cocok dengan filter Anda.</p></div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} itemsPerPage={ITEMS_PER_PAGE} totalItems={filteredOrders.length} />
                    )}
                </div>
            </div>
        </main>
    );
};

export default function MySalles() {
    return (
        <MyStoreLayout>
            <MySallesPage />
        </MyStoreLayout>
    );
}