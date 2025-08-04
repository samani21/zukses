
import { formatRupiahNoRP } from 'components/Rupiah';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ArrowUpRight, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import type { NextPage } from 'next';
import MyStoreLayout from 'pages/layouts/MyStoreLayout';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';

type StatCardData = {
    title: string;
    value: string;
    description: string;
    category: 'transaction' | 'other';
    paymentType?: 'all' | 'cod' | 'transfer';
};

// Data dummy yang lebih detail untuk filtering
const dummyStats: StatCardData[] = [
    { title: 'Semua Transaksi', value: formatRupiahNoRP(12500000), description: '100 Pesanan, 120 Produk', category: 'transaction', paymentType: 'all' },
    { title: 'Transaksi Selesai', value: formatRupiahNoRP(6500000), description: '12 Pesanan, 20 Produk', category: 'transaction', paymentType: 'all' },
    { title: 'Dikirim (Transfer)', value: formatRupiahNoRP(3450500), description: '4 Pesanan, 4 Produk', category: 'transaction', paymentType: 'transfer' },
    { title: 'Dibatalkan', value: formatRupiahNoRP(3450500), description: '4 Pesanan, 6 Produk', category: 'transaction', paymentType: 'all' },
    { title: 'Dikembalikan (COD)', value: formatRupiahNoRP(350500), description: '1 Pesanan, 1 Produk', category: 'transaction', paymentType: 'cod' },
    { title: 'Produk Dilihat', value: '250 Klik', description: '15 Produk', category: 'other' },
    { title: 'Toko Dikunjungi', value: '150 Kali', description: 'Total', category: 'other' },
];

// Komponen untuk satu kartu statistik
const StatCard = ({ title, value, description }: Omit<StatCardData, 'category' | 'paymentType'>) => (
    <div className="bg-white p-4 rounded-[20px] bg-[#FFFFFF] border border-[#DCDCDC] shadow-[1px_1px_1px_rgba(0,0,0,0.08)] flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
        <div className='py-2'>
            <div className="flex justify-between items-start">
                <h3 className="text-[20px] font-bold text-[#333333]">{title}</h3>
                <div className="rounded-full border-2 p-1 rounded-full cursor-pointer border-[#333333]">
                    <ArrowUpRight className="w-[18px] h-[18px] text-[#333333]" />
                </div>
            </div>
            <p className="text-[14px] text-[#333333] ">{description}</p>
            <p className="text-[16px] font-bold text-[#333333] mt-10">
                {
                    title != 'Produk Dilihat' && title != 'Toko Dikunjungi' && "Rp "
                }<span className='text-[25px] font-bold text-[#333333]'>{value}</span></p>
        </div>
    </div>
);
const PageContent: NextPage = () => {
    const [activeTab, setActiveTab] = useState<'Semua' | 'COD' | 'Transfer'>('Semua');
    const tabs: ('Semua' | 'COD' | 'Transfer')[] = ['Semua', 'COD', 'Transfer'];

    const defaultDate = { from: new Date('2025-07-01'), to: new Date('2025-07-30') };
    const [selectedDate, setSelectedDate] = useState<DateRange | undefined>(defaultDate);
    const [appliedDate, setAppliedDate] = useState<DateRange | undefined>(defaultDate);

    const [isDatePickerOpen, setDatePickerOpen] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setDatePickerOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [datePickerRef]);

    const filteredStats = useMemo(() => {
        console.log("Filtering with date:", appliedDate);
        const otherStats = dummyStats.filter(stat => stat.category === 'other');
        const transactionStats = dummyStats.filter(stat => {
            if (stat.category !== 'transaction') return false;
            switch (activeTab) {
                case 'COD': return stat.paymentType === 'cod' || stat.paymentType === 'all';
                case 'Transfer': return stat.paymentType === 'transfer' || stat.paymentType === 'all';
                default: return true;
            }
        });
        return [...transactionStats, ...otherStats];
    }, [activeTab, appliedDate]);

    const handleReset = () => {
        setSelectedDate(undefined);
        setAppliedDate(undefined);
    };

    const handleApply = () => {
        setAppliedDate(selectedDate);
        setDatePickerOpen(false);
    };
    return (
        <div>
            <div className="font-sans text-gray-800">
                <main className="">
                    {/* Header */}
                    <div className="mb-6 border border-[#D2D4D8] bg-[#F3F5F7] p-4 px-6 rounded-[8px] flex items-start justify-between  mb-8">
                        <div>
                            <h1 className="text-[28px] text-[#333333] font-[800] tracking-[-0.02em]">Dashboard</h1>
                            <p className="text-[#444444] mt-4 text-[14px]" style={{
                                lineHeight: "107%"
                            }}>
                                Toko jalan, kamu tenang. <br /> Semua data penjualan dan laporan keuangan bisa kamu akses langsung di sini.
                            </p>
                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto  rounded-[5px] p-4 sm:p-0 bg-[#FFFFFF] border border-[#DCDCDC] shadow-[1px_1px_1px_rgba(0,0,0,0.08)] mb-10">
                        <div className='border-b border-[#BBBBBBCC] sm:p-6'>
                            <h1 className="text-[17px] font-bold text-[#333333]">Data Statistik</h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 sm:p-6 sm:px-8 mb-8 md:mb-0">
                            <div className="relative flex-grow w-full sm:w-auto" ref={datePickerRef}>
                                <button
                                    onClick={() => setDatePickerOpen(!isDatePickerOpen)}
                                    className="flex items-center bg-[#FFFFFF] w-full  md:w-1/2 border border-[#AAAAAA] rounded-[5px] px-3 py-2 text-sm text-gray-600 h-[40px] text-left"
                                >
                                    <div className='w-full md:w-1/2 flex items-center'>
                                        <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className="text-[#777777] text-[14px] mr-2 hidden sm:inline">Periode Tanggal |</span>
                                    </div>
                                    <div className='text-center w-full text-[14px] text-[#333333]'>
                                        {appliedDate?.from ? (
                                            appliedDate.to ? (
                                                <>
                                                    {format(appliedDate.from, "dd MMM yyyy", { locale: id })} - {format(appliedDate.to, "dd MMM yyyy", { locale: id })}
                                                </>
                                            ) : (
                                                format(appliedDate.from, "dd MMM yyyy", { locale: id })
                                            )
                                        ) : (
                                            <span>Pilih Tanggal</span>
                                        )}
                                    </div>
                                </button>
                                {isDatePickerOpen && (
                                    <div className="absolute top-full mt-2 z-10 bg-white border border-gray-200 rounded-lg shadow-lg">
                                        <DayPicker
                                            mode="range"
                                            selected={selectedDate}
                                            onSelect={setSelectedDate}
                                            locale={id}
                                            numberOfMonths={2}
                                            defaultMonth={selectedDate?.from}
                                            showOutsideDays
                                            pagedNavigation
                                            classNames={{
                                                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 p-3',
                                                month: 'space-y-4',
                                                caption: 'flex justify-center pt-1 relative items-center',
                                                caption_label: 'text-sm font-medium',
                                                nav: 'space-x-1 flex items-center',
                                                nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                                                nav_button_previous: 'absolute left-1',
                                                nav_button_next: 'absolute right-1',
                                                table: 'w-full border-collapse space-y-1',
                                                head_row: 'flex',
                                                head_cell: 'text-gray-500 rounded-md w-9 font-normal text-[0.8rem]',
                                                row: 'flex w-full mt-2',
                                                cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-purple-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                                                day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-full hover:bg-purple-100 transition-colors',
                                                day_selected: 'bg-purple-600 text-white hover:bg-purple-600 hover:text-white focus:bg-purple-600 focus:text-white',
                                                day_today: 'bg-gray-200 text-gray-900',
                                                day_outside: 'text-gray-400 opacity-50',
                                                day_disabled: 'text-gray-400 opacity-50',
                                                day_range_middle: 'aria-selected:bg-purple-100 aria-selected:text-purple-700 rounded-none',
                                                day_hidden: 'invisible',
                                            }}
                                            components={{
                                                IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                                                IconRight: () => <ChevronRight className="h-4 w-4" />,
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <button onClick={handleReset} className="px-6 py-2 h-[40px] border border-[#79747E] text-[14px] font-bold text-[#4A4459] hover:bg-gray-100 transition-colors">
                                    Reset
                                </button>
                                <button onClick={handleApply} className="px-6 py-2 h-[40px] border border-[#79747E] bg-[#19976D] text-[#E8DEF8] text-[14px] font-bold hover:bg-teal-600 transition-colors">
                                    Terapkan
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center sm:p-6 sm:pt-0 sm:px-8" style={{ lineHeight: "115%" }}>
                            {tabs.map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 h-[40px] sm:px-8 py-2 text-[14px] transition-colors focus:outline-none ${activeTab === tab ? 'border-2 border-[#845FF5] text-[#845FF5] bg-[#E9E2FF] font-bold' : 'text-[#333333] border border-[#CCCCCC] hover:text-gray-700 font-medium'}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:p-6 sm:pt-0 sm:px-8">
                            {filteredStats.map((stat, index) => (
                                <StatCard key={index} title={stat.title} value={stat.value} description={stat.description} />
                            ))}
                        </div>
                    </div>
                </main>
            </div>

        </div>
    );
};



export default function StatisticPage() {
    return (
        <MyStoreLayout>
            <PageContent />
        </MyStoreLayout>
    );
}
