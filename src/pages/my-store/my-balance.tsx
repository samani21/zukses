"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import { format, startOfDay } from 'date-fns';
import { id } from 'date-fns/locale';
import MyStoreLayout from 'pages/layouts/MyStoreLayout';
import DatePickerModal from 'components/my-store/DatePickerModal';
// import 'react-day-picker/dist/style.css'; // Dihapus untuk memperbaiki error build

// --- Komponen untuk Style Kalender ---
// Menambahkan style secara inline untuk menghindari error import CSS
const DayPickerStyles = () => (
    <style>{`
    :root {
      --rdp-cell-size: 40px;
      --rdp-caption-font-size: 18px;
      --rdp-accent-color: #4f46e5;
      --rdp-background-color: #e0e7ff;
      --rdp-outline: 2px solid var(--rdp-accent-color);
      --rdp-outline-selected: 2px solid var(--rdp-accent-color);
      --rdp-selected-color: #fff;
    }
    .rdp {
      margin: 0;
    }
    .rdp-button_reset {
      -webkit-appearance: none; -moz-appearance: none; appearance: none;
      position: relative; margin: 0; padding: 0; cursor: default;
      color: inherit; background: none; font: inherit; border: none;
    }
    .rdp-button {
      border: 2px solid transparent;
      line-height: 1;
      height: var(--rdp-cell-size);
      width: var(--rdp-cell-size);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .rdp-button:focus-visible:not([disabled]) {
      color: inherit; background-color: var(--rdp-background-color);
      border: var(--rdp-outline); z-index: 2;
    }
    .rdp-button:hover:not([disabled]) {
      background-color: var(--rdp-background-color);
    }
    .rdp-months {
      display: flex; gap: 1rem;
    }
    .rdp-month {
      margin: 0;
    }
    .rdp-table {
      margin: 0;
      max-width: calc(var(--rdp-cell-size) * 7);
      border-collapse: collapse;
    }
    .rdp-caption {
      display: flex; align-items: center; justify-content: space-between;
      padding-bottom: 0.5em; text-align: left;
    }
    .rdp-caption_label {
      z-index: 1; font-size: var(--rdp-caption-font-size); font-weight: 700;
    }
    .rdp-nav {
      white-space: nowrap;
    }
    .rdp-nav_button {
      display: inline-flex; align-items: center; justify-content: center;
      width: var(--rdp-cell-size); height: var(--rdp-cell-size);
      padding: 0.25em; border-radius: 100%;
    }
    .rdp-head_cell {
      vertical-align: middle; text-transform: uppercase;
      font-size: 0.75em; font-weight: 700; text-align: center;
      height: var(--rdp-cell-size);
      padding: 0;
    }
    .rdp-cell {
      width: var(--rdp-cell-size); height: var(--rdp-cell-size);
      padding: 0; text-align: center; vertical-align: middle;
    }
    .rdp-day {
      display: flex; overflow: hidden; align-items: center;
      justify-content: center; width: 100%; height: 100%;
      border-radius: 100%;
    }
    .rdp-day_selected,
    .rdp-day_selected:focus-visible,
    .rdp-day_selected:hover {
      color: var(--rdp-selected-color); opacity: 1;
      background-color: var(--rdp-accent-color);
    }
    .rdp-day_selected:focus-visible {
      border: var(--rdp-outline-selected);
    }
    .rdp-day_today {
      font-weight: 700;
    }
    .rdp-day_outside {
      opacity: 0.25;
    }
    .rdp-day_range_start,
    .rdp-day_range_end {
      color: var(--rdp-selected-color);
      background-color: var(--rdp-accent-color) !important;
    }
    .rdp-day_range_middle {
      border-radius: 0;
      background-color: var(--rdp-background-color);
    }
  `}</style>
);


// --- Tipe Data ---
type Transaction = {
    id: string;
    date: Date;
    description: string;
    details?: string;
    type: 'Dana Masuk' | 'Dana Keluar';
    amount: number;
    status: 'Selesai' | 'Diproses' | 'Gagal';
};

// --- Data Dummy ---
const dummyData: Transaction[] = [
    { id: 'trx001', date: new Date('2025-07-12T15:30:00'), description: 'Penarikan', details: 'Ke Rek.: BRI (1234567890)', type: 'Dana Keluar', amount: 350000, status: 'Selesai' },
    { id: 'trx002', date: new Date('2025-07-08T10:00:00'), description: 'Penghasilan dari Pesanan #1234567890', details: 'Samsuriani (Toples bumbu set motif daun)', type: 'Dana Masuk', amount: 350000, status: 'Selesai' },
    { id: 'trx003', date: new Date('2025-07-01T08:45:00'), description: 'Penarikan', details: 'Ke Rek.: BRI (1234567890)', type: 'Dana Keluar', amount: 100000, status: 'Selesai' },
    ...Array.from({ length: 65 }, (_, i) => {
        const type = i % 3 === 0 ? 'Dana Masuk' : 'Dana Keluar';
        return {
            id: `trx${(i + 4).toString().padStart(3, '0')}`,
            date: new Date(2025, 6, 25 - Math.floor(i / 3), 10 + (i % 8), 30 * (i % 2)),
            description: type === 'Dana Masuk' ? `Penghasilan dari Pesanan #${1234567891 + i}` : 'Penarikan',
            details: type === 'Dana Masuk' ? `Pembeli #${i + 1}` : `Ke Rek.: BCA (0987654321)`,
            type: type as 'Dana Masuk' | 'Dana Keluar',
            amount: 50000 + (i * 15000),
            status: 'Selesai' as const,
        };
    })
];

// --- Helper & Ikon ---
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

// --- Komponen Modal Password ---
const PasswordModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: (password: string) => void; }) => {
    const [password, setPassword] = useState('');
    useEffect(() => { if (!isOpen) setPassword(''); }, [isOpen]);
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-8 relative" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-center text-[22px] font-bold text-[#444444]">Masukkan Password</h2>
                <p className="text-center text-[14px] font-[500] text-[#444444] mt-2">Lupa Password? <a href="#" className="font-semibold text-[#FF2D60] hover:underline">Klik disini</a></p>
                <div className="mt-8 space-y-6">
                    <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-[#AAAAAA] rounded-[10px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukkan Password" />
                    <button onClick={() => onConfirm(password)} disabled={!password} className="w-full bg-[#0075C9] h-[50px] text-white font-bold text-[18px] py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400">Selanjutnya</button>
                </div>
            </div>
        </div>
    );
};

// --- Komponen Halaman Penarikan ---
const WithdrawalPage = ({ onBack }: { onBack: () => void; }) => {
    const [amount, setAmount] = useState(0);
    const [selectedAccount, setSelectedAccount] = useState('BCA');
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const withdrawalFee = 0;
    const totalDeducted = amount + withdrawalFee;

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setAmount(Number(value) || 0);
    };

    const handleWithdrawalConfirm = (password: string) => {
        console.log(`Password entered: ${password}`);
        console.log(`Menarik dana sebesar ${formatCurrency(amount)} ke ${selectedAccount}`);
        alert('Penarikan berhasil!');
        setIsPasswordModalOpen(false);
        onBack();
    };

    return (
        <div className='space-y-4'>
            <div className="border border-[#D2D4D8] bg-[#F3F5F7] p-4 px-6 rounded-[8px] flex items-start justify-between">
                <div>
                    <h1 className="text-[28px] text-[#333333] font-[800] tracking-[-0.02em]">Penarikan Saldo</h1>
                    <p className="text-[#444444] mt-4 text-[14px]" style={{
                        lineHeight: "107%"
                    }}>
                        Lakukan penarikan saldo kamu dengan mudah.<br />
                        Pastikan informasi rekening yang dimasukkan benar agar proses penarikan berjalan lancar.
                    </p>
                </div>
            </div>
            <div className="bg-white rounded-[8px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)] border border-[#dcdcdc] p-6 sm:p-0">
                <div className="flex items-center mb-6 border border-[#BBBBBBCC]/80 py-2 px-4">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 mr-4">
                        <ArrowLeft size={20} className="text-gray-700" />
                    </button>
                    <h2 className="text-xl font-bold text-gray-900">Penarikan Dana Saldo</h2>
                </div>
                <div className="space-y-6 py-2 px-6 w-[65%]">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Tarik Dana ke</h3>
                        <div className="space-y-3">
                            <label className={`flex items-center p-3  cursor-pointer`}>
                                <input
                                    type="radio"
                                    name="account"
                                    value="BCA"
                                    checked={selectedAccount === 'BCA'}
                                    onChange={() => setSelectedAccount('BCA')}
                                    className="h-4 w-4 accent-[#660077]"
                                />

                                <span className="ml-3 flex items-center gap-3 text-sm font-medium text-gray-800">
                                    <img src={'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/2560px-Bank_Central_Asia.svg.png'} className='w-[50px] h-[20px]' /> BCA 123********789
                                </span>
                            </label>
                            <label className={`flex items-center p-3 cursor-pointer`}>
                                <input type="radio" name="account" value="Mandiri" checked={selectedAccount === 'Mandiri'} onChange={() => setSelectedAccount('Mandiri')} className="h-4 w-4 accent-[#660077]" />
                                <span className="ml-3 flex items-center gap-3 text-sm font-medium text-gray-800">
                                    <img src={'data:image/png;base64,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'} className='w-[50px] h-[20px]' />  Mandiri 123********789</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="amount" className="text-[16px] font-bold text-black">Jumlah Penarikan</label>
                        <div className="mt-2 relative bg-[#F3F5F7] border-3 border-[#333333] rounded-[10px] flex items-center p-1 focus-within:ring-2 focus-within:ring-indigo-500">
                            <span className="text-[#333333] font-bold text-[22px] pl-4 pr-2 mt-10">Rp</span>
                            <input type="text" id="amount" value={amount === 0 ? '' : new Intl.NumberFormat('id-ID').format(amount)} onChange={handleAmountChange} placeholder="0" className="w-full text-[80px] placeholder:text-[#333333] h-[113px] bg-transparent text-gray-900 font-bold text-4xl h-16 focus:outline-none" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[16px] font-bold text-black">Biaya Penarikan Dana </label>
                        <div className="flex justify-between items-center h-[58px] bg-[#F3F5F7] p-3 border-3 border-[#333333] rounded-[10px] mt-2">
                            <span className="text-[22px] font-bold text-[#333333]">{formatCurrency(withdrawalFee)}</span>
                        </div>
                        <label className="text-[16px] font-bold text-black">Biaya Penarikan Dana </label>
                        <div className="flex justify-between items-center h-[58px] bg-[#F3F5F7] p-3 border-3 border-[#333333] rounded-[10px] mt-2">
                            <span className="text-[22px] font-bold text-[#333333]">{formatCurrency(totalDeducted)}</span>
                        </div>
                    </div>
                    <button className="w-full bg-[#52357B] text-white h-[50px] font-bold py-4 rounded-[5px] text-[16px] font-semibold tracking-[-0.03em] hover:bg-indigo-700 transition-colors shadow-sm disabled:bg-gray-400" disabled={amount <= 0} onClick={() => setIsPasswordModalOpen(true)}>Tarik Dana</button>
                </div>
            </div>
            <PasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} onConfirm={handleWithdrawalConfirm} />
        </div>
    );
};

// --- Komponen Utama ---
function TransactionDashboard() {
    const [activeTab, setActiveTab] = useState<'Semua' | 'Dana Masuk' | 'Dana Keluar'>('Semua');
    const [currentPage, setCurrentPage] = useState(1);
    const [view, setView] = useState<'dashboard' | 'withdraw'>('dashboard');
    const [isDatePickerOpen, setDatePickerOpen] = useState(false);
    const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
    const ITEMS_PER_PAGE = 10;


    const handleResetFilters = () => { setDateRange({ start: null, end: null }); setCurrentPage(1); };

    const displayDateRange = useMemo(() => {
        if (dateRange?.start && dateRange?.end) {
            return `${format(dateRange.start, 'dd MMM yyyy', { locale: id })} - ${format(dateRange.end, 'dd MMM yyyy', { locale: id })}`;
        }
        if (dateRange?.start) {
            return format(dateRange.start, 'dd MMM yyyy', { locale: id });
        }
        return "Semua Periode";
    }, [dateRange]);

    const filteredTransactions = useMemo(() => {
        return dummyData
            .filter(tx => {
                if (activeTab === 'Dana Masuk') return tx.type === 'Dana Masuk';
                if (activeTab === 'Dana Keluar') return tx.type === 'Dana Keluar';
                return true;
            })
            .filter(tx => {
                if (!dateRange?.start) return true;
                const from = startOfDay(dateRange.start);
                const to = dateRange.end ? startOfDay(dateRange.end) : from;
                const txDate = startOfDay(tx.date);
                return txDate >= from && txDate <= to;
            });
    }, [activeTab, dateRange]);

    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredTransactions, currentPage]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getPaginationButtons = () => {
        const buttons = [];
        if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) buttons.push(i); }
        else {
            buttons.push(1);
            if (currentPage > 3) buttons.push('...');
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);
            if (currentPage <= 2) end = 3;
            if (currentPage >= totalPages - 1) start = totalPages - 2;
            for (let i = start; i <= end; i++) buttons.push(i);
            if (currentPage < totalPages - 2) buttons.push('...');
            buttons.push(totalPages);
        }
        return buttons;
    };

    return (
        <main>
            <DayPickerStyles />

            <div>
                <div className="max-w-7xl mx-auto ">
                    {view === 'dashboard' ? (
                        <>
                            <div className="border border-[#D2D4D8] bg-[#F3F5F7] p-4 px-6 rounded-[8px] flex items-start justify-between">
                                <div>
                                    <h1 className="text-[28px] text-[#333333] font-[800] tracking-[-0.02em]">Saldo Saya</h1>
                                    <p className="text-[#444444] mt-4 text-[14px]" style={{
                                        lineHeight: "107%"
                                    }}>
                                        Atur kurir sesuai kebutuhan tokomu.<br />
                                        Pilih layanan pengiriman yang kamu pakai biar pembeli bisa checkout tanpa ribet.
                                    </p>
                                </div>
                            </div>
                            <div className='mt-4'>
                                <section className="bg-white rounded-[8px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)] border border-[#dcdcdc] px-8 py-6">
                                    {/* <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
                                        <div className="space-y-1"><p className="text-sm text-gray-500">Saldo Toko Saya</p><p className="text-2xl font-bold text-gray-900">{formatCurrency(3700000)}</p></div>
                                        <div className="space-y-1"><p className="text-sm text-gray-500">Total Penghasilan</p><p className="text-lg font-semibold text-gray-700">{formatCurrency(12700000)}</p></div>
                                        <div className="space-y-1"><p className="text-sm text-gray-500">Total Penarikan</p><p className="text-lg font-semibold text-gray-700">{formatCurrency(9000000)}</p></div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <div className="text-center sm:text-right w-full sm:w-auto">
                                            <p className="text-sm text-gray-500">Rekening Bank Saya</p>
                                            <div className="flex items-center justify-center sm:justify-end gap-2 mt-1"><BRILogo /><span className="font-semibold text-gray-800">BRI 123********789</span><span className="text-xs bg-green-100 text-green-800 font-medium px-2.5 py-1 rounded-full">Utama</span></div>
                                            <a href="#" className="text-sm text-indigo-600 hover:underline mt-1 inline-block">Ubah Rekening</a>
                                        </div>
                                        <button onClick={() => setView('withdraw')} className="w-full sm:w-auto bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Tarik Dana</button>
                                    </div>
                                </div> */}
                                    <div className='flex items-start w-full'>
                                        <div className='w-full flex gap-4'>
                                            <div className='grid grid-cols-2 gap-4'>
                                                <p className='text-[#333333] text-[16px]'>Saldo Toko Saya</p>
                                                <p className='text-[#333333] text-[18px] font-bold' style={{
                                                    lineHeight: "108%"
                                                }}>{formatCurrency(3700000)}</p>
                                                <p className='text-[#333333] text-[16px]'>Total Penghasilan</p>
                                                <p className='text-[#333333] text-[18px] font-bold' style={{
                                                    lineHeight: "108%"
                                                }}>{formatCurrency(12700000)}</p>
                                                <p className='text-[#333333] text-[16px]'>Total Penarikan</p>
                                                <p className='text-[#333333] text-[18px] font-bold' style={{
                                                    lineHeight: "108%"
                                                }}>{formatCurrency(9000000)}</p>
                                            </div>
                                            <div>
                                                <button onClick={() => setView('withdraw')} className='bg-[#52357B] rounded-[5px] text-white font-bold text-[16px] px-4 py-2'>
                                                    Tarik Dana
                                                </button>
                                            </div>
                                        </div>
                                        <div className='w-full flex justify-end text-[#333333] text-[15px]'>
                                            <div className='flex items-start gap-4'>
                                                <p>Rekening Bank Saya </p>
                                                <div className='space-y-4 space-x-2'>
                                                    <div className='flex items-center gap-4'>
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/2560px-Bank_Central_Asia.svg.png" className='w-[62px] h-[21px]' alt="" />
                                                        <p className='font-bold'>
                                                            BRI 123********789
                                                        </p>
                                                    </div>
                                                    <span className='border border-[#F02929] text-[#F02929] rounded-full bg-[#FAD7D7] px-2 py-1'>
                                                        Utama
                                                    </span>
                                                    <span className='text-[#5E5ED3] text-[14px]' style={{
                                                        fontStyle: "italic"
                                                    }}>Ubah Rekening</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Bagian Riwayat Transaksi */}
                                <section className="p-4 sm:p-0">
                                    <div className="flex flex-col md:grid gap-4 py-6">
                                        <div className="flex flex-col sm:flex-row  items-center gap-4">
                                            <div className='w-full sm:w-auto flex-grow'>
                                                <button onClick={() => setDatePickerOpen(true)} className="w-full text-left flex items-center justify-between px-3 py-2 border border-[#AAAAAA] rounded-[5px] h-[40px] bg-white">
                                                    <span className="text-sm truncate text-[#777777] pr-2">Periode Tanggal |</span>
                                                    <span className="text-sm truncate text-[#333333] flex-grow text-center">{displayDateRange}</span>
                                                    <Calendar className="text-gray-400 ml-2 flex-shrink-0" size={20} />
                                                </button>
                                            </div>

                                            <div className="flex self-start">
                                                {(['Semua', 'Dana Masuk', 'Dana Keluar'] as const).map(tab => (
                                                    <button key={tab} onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                                                        className={`py-2 px-4 border text-[14px] text-sm ${activeTab === tab ? 'border-[#845FF5] border-2 bg-[#E9E2FF] text-[#845FF5] font-bold' : ' text-[#CCCCCC] hover:text-gray-700 border-[#CCCCCC] hover:border-gray-300'}`}>{tab}</button>
                                                ))}
                                            </div>
                                            <button className='h-[40px] px-8 bg-[#FFFFFF] rounded-[5px] border border-[#52357B] text-[#333333] font-bold text-[14px]' onClick={handleResetFilters}>
                                                Reset
                                            </button>
                                        </div>

                                    </div>
                                    <p className="text-[14px] font-bold tracking-[-0.02em] text-[#333] mb-4">{filteredTransactions.length} Transaksi</p>
                                    <div className="flow-root">
                                        {paginatedTransactions.length > 0 ? (
                                            <div className="space-y-4 md:space-y-0">
                                                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-4 bg-[#F3F5F7] border border-[#DDDDDD] text-[14px] font-bold text-[#333] uppercase">
                                                    <div className="col-span-2">Tanggal</div>
                                                    <div className="col-span-4">Uraian</div>
                                                    <div className="col-span-2">Jenis Transaksi</div>
                                                    <div className="col-span-2 text-right">Jumlah</div>
                                                    <div className="col-span-2 text-center">Status</div>
                                                </div>
                                                {paginatedTransactions.map(tx => (
                                                    <div key={tx.id} className="grid grid-cols-1 border-[#DDDDDD] md:grid-cols-12 gap-x-4 gap-y-2 p-4 border rounded-lg md:border md:border md:border md:p-0 md:rounded-none hover:bg-gray-50" style={{
                                                        lineHeight: "115%"
                                                    }}>
                                                        <div className="md:col-span-2 md:px-4 md:py-3 text-[14px] text-[#333333]"><span className="font-bold md:hidden">Tanggal: </span>{format(tx.date, 'dd-MM-yyyy')}</div>
                                                        <div className="md:col-span-4 md:px-4 md:py-3">
                                                            <p className="font-bold text-[14px] text-[#333333]">{tx.description}</p>
                                                            <p className="text-[14px] text-[#333333]">{tx.details}</p>
                                                        </div>
                                                        <div className="md:col-span-2 md:px-4 md:py-3 text-[14px] text-[#333333]"><span className="font-bold md:hidden">Jenis: </span>{tx.type}</div>
                                                        <div className={`md:col-span-2 md:px-4 md:py-3 md:text-right text-[14px] ${tx.type === 'Dana Masuk' ? 'text-[#136CD1] font-bold' : 'text-[#333333]'}`}><span className="font-bold md:hidden">Jumlah: </span>{tx.type === 'Dana Keluar' ? '-' : ''}{formatCurrency(tx.amount)}</div>
                                                        <div className="md:col-span-2 md:px-4 md:py-3 md:text-center"><span className="font-bold md:hidden">Status: </span><span className="text-[#333] text-[14px]  px-2.5 py-1 rounded-full">{tx.status}</span></div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-16 text-gray-500"><p className="font-semibold">Tidak Ada Transaksi</p><p className="text-sm">Coba ubah filter atau rentang tanggal Anda.</p></div>
                                        )}
                                    </div>
                                    {totalPages > 1 && (
                                        // <div className="flex flex-col md:flex-row items-center justify-between pt-4 mt-4 border-t border-gray-200">
                                        //     <p className="text-sm text-gray-600 mb-4 md:mb-0">Menampilkan {paginatedTransactions.length} dari {filteredTransactions.length} hasil</p>
                                        //     <nav className="flex items-center space-x-1">
                                        //         <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft size={18} /></button>
                                        //         {getPaginationButtons().map((page, index) => (
                                        //             typeof page === 'number' ? (<button key={index} onClick={() => handlePageChange(page)} className={`px-3.5 py-1.5 text-sm font-medium rounded-md ${currentPage === page ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}>{page}</button>)
                                        //                 : (<span key={index} className="px-2 py-1.5 text-sm">...</span>)
                                        //         ))}
                                        //         <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight size={18} /></button>
                                        //     </nav>
                                        // </div>
                                        <div className="flex flex-col items-center mt-6 space-y-2 mb-4">
                                            <div className="flex items-center justify-center flex-wrap gap-2">
                                                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center text-[#1E1E1E] px-3 py-2 rounded-md hover:bg-gray-100 gap-1  disabled:text-[#757575] disabled:cursor-not-allowed">
                                                    <ArrowLeft size={16} color={currentPage === 1 ? '#757575' : '#1E1E1E'} /> Sebelumnya
                                                </button>
                                                <div className="flex items-center gap-1 flex-wrap">
                                                    {getPaginationButtons().map((page, index) => (
                                                        typeof page === 'number' ? (<button key={index} onClick={() => handlePageChange(page)} className={`px-4 py-2 rounded-[12px] ${currentPage === page ? 'bg-[#2C2C2C] text-[#F5F5F5]' : 'text-[#1E1E1E] hover:bg-gray-100'} ${typeof page !== 'number' ? 'cursor-default' : ''}`}>{page}</button>)
                                                            : (<span key={index} className="px-2 py-1.5 text-sm">...</span>)
                                                    ))}
                                                </div>
                                                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center px-3 py-2 text-[#1E1E1E] rounded-md  gap-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                                                    Berikutnya <ArrowRight size={16} color={currentPage === totalPages ? '#757575' : '#1E1E1E'} />
                                                </button>
                                            </div>
                                            <p className="text-[#555555] font-bold text-[15px] mb-4 sm:mb-0 text-center sm:mt-2">
                                                Menampilkan  Penjualan per Halaman
                                            </p>
                                        </div >
                                    )}
                                </section>
                            </div>
                        </>
                    ) : (
                        <WithdrawalPage onBack={() => setView('dashboard')} />
                    )}
                </div>
            </div>
            <DatePickerModal isOpen={isDatePickerOpen} onClose={() => setDatePickerOpen(false)} onApply={setDateRange} initialRange={dateRange} />
        </main>
    );
}


function MyBalancePage() {
    return (
        <MyStoreLayout>
            <TransactionDashboard />
        </MyStoreLayout>
    )
}

export default MyBalancePage