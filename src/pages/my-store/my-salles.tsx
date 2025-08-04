import React, { useState, useMemo } from 'react';
import type { NextPage } from 'next';
import { ChevronDown, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import MyStoreLayout from 'pages/layouts/MyStoreLayout';
import DatePickerModal from 'components/my-store/DatePickerModal';

// Tipe data untuk setiap item produk dalam pesanan
type ProductItem = {
    id: number;
    name: string;
    imageUrl: string;
    variation: string;
    size: string;
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

// --- DATA DUMMY ---
// Mendefinisikan 4 pesanan pertama secara statis
const initialOrders: Order[] = [
    {
        orderId: 'Z2025070000120010201', customerName: 'Sulastri',
        products: [{ id: 1, name: 'Rak Bumbu Dapur Multifungsi 2 susun', imageUrl: 'https://placehold.co/80x80/e2e8f0/64748b?text=Produk', variation: 'Merah', size: 'Besar', quantity: 20, price: 301000 }],
        status: 'Selesai', shipping: { service: 'JNT Standar', type: 'Regular (Cashless)', trackingId: 'JNT22012901201212100' }, paymentMethod: 'COD (Bayar Ditempat)', date: '2025-07-01',
    },
    {
        orderId: 'Z2025070000120010202', customerName: 'Andi Gustisari',
        products: [
            { id: 2, name: 'Rak Bumbu Dapur Multifungsi 2 susun', imageUrl: 'https://placehold.co/80x80/e2e8f0/64748b?text=Produk', variation: 'Merah', size: 'Besar', quantity: 20, price: 301000 },
            { id: 3, name: 'Panci Listrik Serbaguna', imageUrl: 'https://placehold.co/80x80/e2e8f0/64748b?text=Produk', variation: 'Hijau', size: 'Kecil', quantity: 10, price: 150000 }
        ],
        status: 'Selesai', shipping: { service: 'JNT Standar', type: 'Regular (Cashless)', trackingId: 'JNT22012901201212122' }, paymentMethod: 'Transfer Bank', date: '2025-07-15',
    },
    {
        orderId: 'Z2025070000120010203', customerName: 'Budi Hartono',
        products: [{ id: 4, name: 'Lampu Belajar LED', imageUrl: 'https://placehold.co/80x80/e2e8f0/64748b?text=Produk', variation: 'Putih', size: 'Standar', quantity: 5, price: 75000 }],
        status: 'Belum Bayar', shipping: { service: 'SiCepat REG', type: 'Regular', trackingId: 'SICEPAT0012345678' }, paymentMethod: 'Virtual Account', date: '2025-07-24',
    },
    {
        orderId: 'Z2025070000120010204', customerName: 'Citra Lestari',
        products: [{ id: 5, name: 'Keyboard Mechanical Gaming', imageUrl: 'https://placehold.co/80x80/e2e8f0/64748b?text=Produk', variation: 'Hitam', size: 'Full-size', quantity: 2, price: 850000 }],
        status: 'Perlu Dikirim', shipping: { service: 'JNE OKE', type: 'Ekonomi', trackingId: 'JNE00987654321' }, paymentMethod: 'Kartu Kredit', date: '2025-07-30',
    },
];

// Menghasilkan 56 pesanan tambahan secara dinamis dengan loop
const generatedOrders: Order[] = [];
const statuses: Order['status'][] = ['Selesai', 'Dikirim', 'Dibatalkan', 'Belum Bayar', 'Perlu Dikirim'];

for (let i = 0; i < 151; i++) {
    const newOrder: Order = {
        orderId: `Z2025080000120010${205 + i}`,
        customerName: `Pelanggan ke-${i + 5}`,
        products: [{
            id: 6 + i,
            name: `Produk Contoh ${i + 1}`,
            imageUrl: 'https://placehold.co/80x80/e2e8f0/64748b?text=Produk',
            variation: 'Random',
            size: 'M',
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

// Menggabungkan kedua array untuk mendapatkan total 60 pesanan
const dummyOrders: Order[] = [...initialOrders, ...generatedOrders];


// --- Helper Functions ---
const formatDate = (date: Date | null, options: Intl.DateTimeFormatOptions = {}): string => {
    if (!date) return '';
    const defaultOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric', month: 'short', year: 'numeric', ...options
    };
    return date.toLocaleDateString('id-ID', defaultOptions);
};
// Komponen untuk setiap kartu pesanan yang di-refactor
const OrderCard: React.FC<{ order: Order }> = ({ order }) => (
    <div className="bg-white rounded-lg border border-gray-200 mb-4">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h3 className="font-bold text-gray-800">{order.customerName}</h3>
                <p className="text-xs text-gray-500 mt-1 sm:mt-0">Nomor Pesanan {order.orderId}</p>
            </div>
        </div>
        <div className="divide-y divide-gray-200">
            {order.products.map(product => (
                <div key={product.id} className="flex flex-col lg:flex-row items-stretch px-4">
                    {/* Kolom Produk */}
                    <div className="w-full lg:w-[40%] py-4 flex items-center space-x-4 border-b lg:border-b-0 lg:border-r border-gray-200">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-md border flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/80x80/fecaca/991b1b?text=Error'; }}
                        />
                        <div>
                            <p className="font-semibold text-gray-800">{product.name}</p>
                            <p className="text-sm text-gray-500">Variasi: {product.variation}, Ukuran: {product.size}</p>
                        </div>
                    </div>

                    {/* Kolom Lainnya */}
                    <div className="w-full lg:w-[60%] flex flex-col lg:flex-row">
                        <div className="w-full lg:w-1/4 py-4 px-2 flex justify-between lg:justify-start items-center lg:border-r border-gray-200">
                            <span className="lg:hidden font-medium text-gray-500">Total Pesanan</span>
                            <div>
                                <p className="font-semibold text-gray-800">x{product.quantity} Rp{product.price.toLocaleString('id-ID')}</p>
                                <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/4 py-4 px-2 flex justify-between lg:justify-start items-center lg:border-r border-gray-200">
                            <span className="lg:hidden font-medium text-gray-500">Status</span>
                            <p className={`font-semibold ${order.status === 'Selesai' ? 'text-green-600' : 'text-yellow-600'}`}>{order.status}</p>
                        </div>
                        <div className="w-full lg:w-1/4 py-4 px-2 flex justify-between lg:justify-start items-center lg:border-r border-gray-200">
                            <span className="lg:hidden font-medium text-gray-500">Jasa Kirim</span>
                            <div>
                                <p className="text-sm text-gray-800">{order.shipping.type}</p>
                                <p className="text-sm text-gray-600">{order.shipping.service}</p>
                                <p className="text-xs text-gray-500">{order.shipping.trackingId}</p>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/4 py-4 px-2 flex justify-between lg:justify-start items-center">
                            <span className="lg:hidden font-medium text-gray-500">Aksi</span>
                            <button className="text-purple-600 hover:text-purple-800 font-semibold text-sm">Lihat Rincian</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// Komponen Paginasi
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
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 text-sm">
            <p className="text-gray-600 mb-4 sm:mb-0">
                Menampilkan {itemsPerPage} Penjualan per Halaman
            </p>
            <div className="flex items-center space-x-1">
                <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronLeft size={16} /> <span className="ml-1">Sebelumnya</span>
                </button>
                <div className="hidden md:flex items-center space-x-1">
                    {uniquePageNumbers.map((num, index) => (
                        <button key={index} onClick={() => typeof num === 'number' && onPageChange(num)} disabled={typeof num !== 'number'}
                            className={`px-4 py-2 rounded-md ${currentPage === num ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'} ${typeof num !== 'number' ? 'cursor-default' : ''}`}>
                            {num}
                        </button>
                    ))}
                </div>
                <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span className="mr-1">Berikutnya</span> <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

const MySallesPage: NextPage = () => {
    const TABS = ['Semua', 'Belum Bayar', 'Perlu Dikirim', 'Dikirim', 'Selesai', 'Dibatalkan', 'Pengembalian'];
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
            <div className="mb-6 border border-[#D2D4D8] bg-[#F3F5F7] p-4 px-6 rounded-[8px] flex items-start justify-between  mb-8">
                <div>
                    <h1 className="text-[28px] text-[#333333] font-[800] tracking-[-0.02em]">Penjualan Saya</h1>
                    <p className="text-[#444444] mt-4 text-[14px]" style={{
                        lineHeight: "107%"
                    }}>
                        Toko jalan, kamu tenang. <br /> Semua data penjualan dan laporan keuangan bisa kamu akses langsung di sini.
                    </p>
                </div>
            </div>
            <div className="p-4 sm:p-0">
                <div className="max-w-screen-xl mx-auto">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 my-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 items-end">
                            <div className="xl:col-span-2">
                                <div className="flex rounded-md border border-gray-300">
                                    <div className="relative">
                                        <select value={searchType} onChange={e => setSearchType(e.target.value)} className="h-full rounded-l-md border-r border-gray-300 bg-gray-50 pl-3 pr-8 text-sm focus:ring-0 focus:border-gray-300">
                                            <option>Nama Produk</option>
                                            <option>Nomor Pesanan</option>
                                        </select>
                                    </div>
                                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder={`Masukkan ${searchType}`}
                                        className="w-full pl-4 pr-4 py-2 border-none rounded-r-md focus:ring-purple-500 focus:border-purple-500" />
                                </div>
                            </div>
                            <div>
                                <div className="relative">
                                    <select value={shippingFilter} onChange={(e) => setShippingFilter(e.target.value)} className="w-full appearance-none pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">
                                        <option>Semua Jasa Kirim</option>
                                        <option>JNT Standar</option> <option>SiCepat REG</option>
                                        <option>JNE OKE</option> <option>JNT Express</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><ChevronDown className="text-gray-400" size={20} /></div>
                                </div>
                            </div>
                            <div>
                                <button onClick={() => setDatePickerOpen(true)} className="w-full text-left flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white">
                                    <span className="text-sm truncate">{displayDateRange}</span>
                                    <Calendar className="text-gray-400 ml-2 flex-shrink-0" size={16} />
                                </button>
                            </div>
                            <div className="flex items-center space-x-2 justify-end">
                                <button onClick={() => setCurrentPage(1)} className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 w-full sm:w-auto">Cari</button>
                                <button onClick={handleReset} className="bg-white text-gray-700 px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 w-full sm:w-auto">Reset</button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-4">{filteredOrders.length} Pesanan</p>
                    </div>

                    <div className='space-y-6'>
                        <div className="hidden lg:flex bg-white px-4 py-3 rounded-t-lg border border border-gray-200 text-sm font-bold text-gray-600">
                            <div className="w-[40%]">Produk</div>
                            <div className="w-[60%] flex">
                                <div className="w-1/4 px-2">Total Pesanan</div>
                                <div className="w-1/4 px-2">Status</div>
                                <div className="w-1/4 px-2">Jasa Kirim</div>
                                <div className="w-1/4 px-2">Aksi</div>
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