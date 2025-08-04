import DatePickerModal from 'components/my-store/DatePickerModal';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { ArrowUpRight, Calendar as CalendarIcon } from 'lucide-react';
import type { NextPage } from 'next';
import MyStoreLayout from 'pages/layouts/MyStoreLayout';
import React, { useMemo, useState } from 'react';

// Asumsi formatRupiahNoRP adalah fungsi yang sudah ada di proyek Anda
const formatRupiahNoRP = (number: number) => {
    return new Intl.NumberFormat('id-ID').format(number);
};

type StatCardData = {
    title: string;
    value: string;
    description: string;
    category: 'transaction' | 'other';
    paymentType?: 'all' | 'cod' | 'transfer';
};

const dummyStats: StatCardData[] = [
    { title: 'Semua Transaksi', value: formatRupiahNoRP(12500000), description: '100 Pesanan, 120 Produk', category: 'transaction', paymentType: 'all' },
    { title: 'Transaksi Selesai', value: formatRupiahNoRP(6500000), description: '12 Pesanan, 20 Produk', category: 'transaction', paymentType: 'all' },
    { title: 'Dikirim (Transfer)', value: formatRupiahNoRP(3450500), description: '4 Pesanan, 4 Produk', category: 'transaction', paymentType: 'transfer' },
    { title: 'Dibatalkan', value: formatRupiahNoRP(3450500), description: '4 Pesanan, 6 Produk', category: 'transaction', paymentType: 'all' },
    { title: 'Dikembalikan (COD)', value: formatRupiahNoRP(350500), description: '1 Pesanan, 1 Produk', category: 'transaction', paymentType: 'cod' },
    { title: 'Produk Dilihat', value: '250 Klik', description: '15 Produk', category: 'other' },
    { title: 'Toko Dikunjungi', value: '150 Kali', description: 'Total', category: 'other' },
];

const StatCard = ({ title, value, description }: Omit<StatCardData, 'category' | 'paymentType'>) => (
    <div className="bg-white p-4 rounded-[20px] border border-[#DCDCDC] shadow-[1px_1px_1px_rgba(0,0,0,0.08)] flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
        <div className='py-2'>
            <div className="flex justify-between items-start">
                <h3 className="text-[20px] font-bold text-[#333333]">{title}</h3>
                <div className="rounded-full border-2 p-1 cursor-pointer border-[#333333]">
                    <ArrowUpRight className="w-[18px] h-[18px] text-[#333333]" />
                </div>
            </div>
            <p className="text-[14px] text-[#333333] ">{description}</p>
            <p className="text-[16px] font-bold text-[#333333] mt-10">
                {
                    title !== 'Produk Dilihat' && title !== 'Toko Dikunjungi' && "Rp "
                }<span className='text-[25px] font-bold text-[#333333]'>{value}</span></p>
        </div>
    </div>
);


const PageContent: NextPage = () => {
    const [activeTab, setActiveTab] = useState<'Semua' | 'COD' | 'Transfer'>('Semua');
    const tabs: ('Semua' | 'COD' | 'Transfer')[] = ['Semua', 'COD', 'Transfer'];

    const defaultDate = { start: startOfDay(subDays(new Date(), 6)), end: endOfDay(new Date()) };
    const [appliedDate, setAppliedDate] = useState<{ start: Date | null, end: Date | null }>(defaultDate);
    const [isModalOpen, setModalOpen] = useState(false);

    const filteredStats = useMemo(() => {
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

    return (
        <>
            <div className=" border border-[#D2D4D8] bg-[#F3F5F7] p-4 px-6 rounded-[8px] flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-[28px] text-[#333333] font-[800] tracking-[-0.02em]">Statistik</h1>
                    <p className="text-[#444444] mt-4 text-[14px]" style={{
                        lineHeight: "107%"
                    }}>
                        Atur kurir sesuai kebutuhan tokomu. <br />Pilih layanan pengiriman yang kamu pakai biar pembeli bisa checkout tanpa ribet.
                    </p>
                </div>
            </div>
            <div className="max-w-7xl mx-auto rounded-[5px] p-4 sm:p-0 bg-[#FFFFFF] border border-[#DCDCDC] shadow-[1px_1px_1px_rgba(0,0,0,0.08)] mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4 sm:p-6 sm:px-8 mb-8 md:mb-0">
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center bg-[#FFFFFF] w-full md:w-1/3 border border-[#AAAAAA] rounded-[5px] px-3 py-2 text-sm text-gray-600 h-[40px] text-left"
                    >
                        <div className='flex items-center w-full'>
                            <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-[#777777] text-[14px] mr-2 hidden sm:inline">Periode Tanggal |</span>
                        </div>
                        <div className='text-center w-full text-[14px] text-[#333333]'>
                            {appliedDate?.start ? (
                                appliedDate.end ? (
                                    <>
                                        {format(appliedDate.start, "dd MMM yyyy", { locale: id })} - {format(appliedDate.end, "dd MMM yyyy", { locale: id })}
                                    </>
                                ) : (
                                    format(appliedDate.start, "dd MMM yyyy", { locale: id })
                                )
                            ) : (
                                <span>Pilih Tanggal</span>
                            )}
                        </div>
                    </button>
                    <div className="flex items-center sm:p-0 sm:px-8" style={{ lineHeight: "115%" }}>
                        {tabs.map((tab) => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 h-[40px] sm:px-8 py-2 text-[14px] transition-colors focus:outline-none ${activeTab === tab ? 'border-2 border-[#845FF5] text-[#845FF5] bg-[#E9E2FF] font-bold' : 'text-[#333333] border border-[#CCCCCC] hover:text-gray-700 font-medium'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>


            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:p-0 ">
                {filteredStats.map((stat, index) => (
                    <StatCard key={index} title={stat.title} value={stat.value} description={stat.description} />
                ))}
            </div>

            <DatePickerModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onApply={setAppliedDate}
                initialRange={appliedDate}
            />
        </>
    );
};

export default function StatisticPage() {
    return (
        <MyStoreLayout>
            <PageContent />
        </MyStoreLayout>
    );
}
