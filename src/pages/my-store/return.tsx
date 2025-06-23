import ActionButton from 'components/my-store/return/ActionButton';
import EmptyState from 'components/my-store/return/EmptyState';
import NavTab from 'components/my-store/return/NavTab';
import PriorityButton from 'components/my-store/return/PriorityButton';
import SubNavTab from 'components/my-store/return/SubNavTab';
import { AlertCircle, ChevronDown, FileDown, Search } from 'lucide-react';
import MyStoreLayout from 'pages/layouts/MyStoreLayout';
import React, { useEffect, useState } from 'react'

const dummySubmissions = [
    {
        id: '240623ABC',
        product: {
            name: 'Kemeja Flannel Pria Lengan Panjang',
            image: 'https://placehold.co/100x100/e2e8f0/334155?text=Produk+1',
        },
        jumlah: 1,
        alasan: 'Produk rusak',
        solusi: 'Pengembalian Dana',
        status: 'Sedang ditinjau',
        pengirimanPembeli: 'Resi: SPX123456789',
        pengembalianPenjual: 'Belum dikirim',
    },
    {
        id: '240622DEF',
        product: {
            name: 'Celana Chino Pria Slimfit',
            image: 'https://placehold.co/100x100/e2e8f0/334155?text=Produk+2',
        },
        jumlah: 2,
        alasan: 'Ukuran tidak sesuai',
        solusi: 'Tukar Barang',
        status: 'Disetujui',
        pengirimanPembeli: 'Resi: JNE987654321',
        pengembalianPenjual: 'Resi: JNT555444333',
    }
];

interface Submission {
    id: string;
    product: {
        name: string;
        image: string;
    };
    jumlah: number;
    alasan: string;
    solusi: string;
    status: string;
    pengirimanPembeli: string;
    pengembalianPenjual: string;
}
const ReturnPage = () => {
    const [activeNav, setActiveNav] = useState('Semua');
    const [activeSubNav, setActiveSubNav] = useState('Semua');
    const [activePriority, setActivePriority] = useState('Semua');
    const [submissions, setSubmissions] = useState<Submission[]>(dummySubmissions);


    const navTabs = ['Semua', 'Pengembangan', 'Pembatalan', 'Pengiriman Gagal'];
    const subNavTabs = ['Semua', 'Dalam Pengerjaan', 'Sedang dikembalikan', 'Dana Dikembalikan ke Pembeli', 'Kandang Diajukan', 'Produk dikembalikan', 'Klaim Diajukan'];
    const priorityFilters = ['Semua', 'kurang dari 1 hari', 'kurang dari 2 hari'];
    const actionFilters = ['Perlu Diskusi', 'Kirim Bukti', 'Perlu Blok Penjual', 'Tinjau Pengembalian Dana Disetujui Shopee'];
    // HAPUS useEffect ini:
    useEffect(() => {
        setSubmissions(dummySubmissions)
    }, [])

    return (
        <MyStoreLayout>
            <div className="bg-gray-100 min-h-screen font-sans">
                <div className="max-w-screen-xl mx-auto py-4 px-4 sm:px-6 lg:px-8">

                    {/* Header Atas: Responsif */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                        <div className="w-full sm:w-auto overflow-x-auto">
                            <nav className="flex space-x-4 border-b sm:border-b-0" aria-label="Tabs">
                                {navTabs.map((tab) => (
                                    <NavTab key={tab} active={activeNav === tab} onClick={() => setActiveNav(tab)}>
                                        {tab}
                                    </NavTab>
                                ))}
                            </nav>
                        </div>
                        <a href="#" className="text-sm text-blue-600 hover:underline flex items-center gap-1 flex-shrink-0">
                            <AlertCircle className="w-4 h-4" />
                            <span>Lihat Tingkat Pesanan Tidak Terselesaikan</span>
                        </a>
                    </div>

                    <div className="bg-white rounded-md shadow-sm">
                        {/* Bagian Navigasi Sekunder */}
                        <div className="px-5 py-4 border-b border-gray-200">
                            <nav className="flex items-center gap-3 flex-wrap">
                                {subNavTabs.map((tab) => (
                                    <SubNavTab key={tab} active={activeSubNav === tab} onClick={() => setActiveSubNav(tab)}>
                                        {tab}
                                    </SubNavTab>
                                ))}
                            </nav>
                        </div>

                        <div className="p-5 space-y-5">
                            {/* Bagian Filter */}
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-wrap">
                                    <span className="text-sm text-gray-500 sm:w-16 sm:text-right font-medium">Prioritas</span>
                                    <div className="flex gap-2 flex-wrap">
                                        {priorityFilters.map(filter => (
                                            <PriorityButton key={filter} active={activePriority === filter} onClick={() => setActivePriority(filter)}>
                                                {filter}
                                            </PriorityButton>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-wrap">
                                    <span className="text-sm text-gray-500 sm:w-16 sm:text-right font-medium">Aksi</span>
                                    <div className="flex gap-2 flex-wrap">
                                        {actionFilters.map(filter => (
                                            <ActionButton key={filter}>{filter}</ActionButton>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Bagian Pencarian */}
                            <div className="flex flex-col md:flex-row items-center gap-3 pt-5 mt-5 border-t border-gray-200">
                                <span className="text-sm text-gray-500 w-full md:w-auto">Cari Pengajuan</span>
                                <div className="flex-grow w-full md:w-auto relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type="text" placeholder="Masukkan No. Pengajuan/No. Pesanan/No. Resi..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:ring-red-500 focus:border-red-500" />
                                </div>
                                <div className="relative w-full md:w-48">
                                    <select className="w-full appearance-none bg-white border border-gray-300 text-gray-500 py-2 pl-3 pr-10 rounded-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-sm">
                                        <option>Semua Aksi</option> <option>Pilih Opsi</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                                <div className="flex items-center gap-2 w-full md:w-auto">
                                    <button className="flex-1 md:flex-none justify-center px-8 py-2 text-sm text-white bg-red-500 rounded-sm hover:bg-red-600">Cari</button>
                                    <button className="flex-1 md:flex-none justify-center px-6 py-2 text-sm text-gray-700 bg-gray-100 rounded-sm hover:bg-gray-200">Atur Ulang</button>
                                </div>
                            </div>

                            {/* Bagian Konten/Tabel */}
                            <div className="mt-4 bg-gray-50 p-4 rounded-md">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-sm font-medium text-gray-800">{submissions.length} Pengajuan</h3>
                                    <div className="flex items-center gap-4">
                                        <button className="text-sm text-blue-600 hover:underline">Atur</button>
                                        <button className="flex items-center gap-1.5 px-3 py-1 text-sm border bg-white border-gray-300 rounded-sm hover:bg-gray-100"><FileDown className="w-4 h-4" /> Export</button>
                                    </div>
                                </div>

                                {/* Tampilan Tabel untuk Desktop (md dan lebih besar) */}
                                <div className="hidden md:block border rounded-sm overflow-hidden">
                                    <div className="grid grid-cols-12 gap-4 bg-gray-100 p-3 text-xs font-medium text-gray-500 text-left">
                                        <div className="col-span-3">Produk</div> <div className="col-span-1">Jumlah</div> <div className="col-span-1">Alasan Pengajuan</div> <div className="col-span-1">Solusi</div> <div className="col-span-1">Status</div> <div className="col-span-2">Pengiriman ke Pembeli</div> <div className="col-span-2">Pengembalian ke Penjual</div> <div className="col-span-1">Aksi</div>
                                    </div>
                                    <div className="bg-white">
                                        {submissions.length > 0 ? submissions.map(item => (
                                            <div key={item.id} className="grid grid-cols-12 gap-4 p-3 text-sm items-center border-b last:border-b-0">
                                                <div className="col-span-3 flex items-center gap-2"><img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded" /><span>{item.product.name}</span></div>
                                                <div className="col-span-1">{item.jumlah}</div>
                                                <div className="col-span-1">{item.alasan}</div>
                                                <div className="col-span-1">{item.solusi}</div>
                                                <div className="col-span-1"><span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">{item.status}</span></div>
                                                <div className="col-span-2">{item.pengirimanPembeli}</div>
                                                <div className="col-span-2">{item.pengembalianPenjual}</div>
                                                <div className="col-span-1"><button className="text-red-500 hover:underline">Respon</button></div>
                                            </div>
                                        )) : <EmptyState />}
                                    </div>
                                </div>

                                {/* Tampilan Kartu untuk Mobile (di bawah md) */}
                                <div className="md:hidden space-y-4">
                                    {submissions.length > 0 ? submissions.map(item => (
                                        <div key={item.id} className="bg-white border rounded-lg p-4 space-y-3">
                                            <div className="flex items-start gap-3">
                                                <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-800">{item.product.name}</p>
                                                    <p className="text-sm text-gray-600">{item.solusi} &middot; {item.jumlah} produk</p>
                                                    <p className="mt-1"><span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">{item.status}</span></p>
                                                </div>
                                            </div>
                                            <div className="border-t pt-3 text-xs space-y-1.5 text-gray-600">
                                                <p><span className="font-medium text-gray-800">Alasan:</span> {item.alasan}</p>
                                                <p><span className="font-medium text-gray-800">Pengiriman Pembeli:</span> {item.pengirimanPembeli}</p>
                                                <p><span className="font-medium text-gray-800">Pengembalian Penjual:</span> {item.pengembalianPenjual}</p>
                                            </div>
                                            <div className="border-t pt-3 flex">
                                                <button className="w-full text-center py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100">Respon Pengajuan</button>
                                            </div>
                                        </div>
                                    )) : <div className="border rounded-sm"><EmptyState /></div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MyStoreLayout>
    );
}

export default ReturnPage