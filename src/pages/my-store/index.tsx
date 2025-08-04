
import { ArrowUpRight } from 'lucide-react';
import type { NextPage } from 'next';
import MyStoreLayout from 'pages/layouts/MyStoreLayout';

// Untuk membuat komponen lebih rapi, kita bisa definisikan tipe data untuk props
type StatCardProps = {
    value: string;
    label: string;
    className?: string;
};

type PerformanceMetricProps = {
    title: string;
    value: string;
    change: string;
    changeColorClass: string;
};

// Komponen untuk kartu statistik individual (Pesanan, Bayar, Kirim, dll.)
const StatCard: React.FC<StatCardProps> = ({ value, label, className }) => (
    <div className={`relative  rounded-[12px] h-[170px] ${className} flex flex-col justify-between`}>
        <div className='flex items-start justify-between'>
            <div className='text-[#FFFFFF] p-4 px-6 space-y-1' style={{
                lineHeight: "100%"
            }}>
                <p className='text-[15px] '>Pesanan</p>
                <p className='font-bold text-[20px]'>{label}</p>
            </div>
            <div className="absolute top-3 right-4 border-2 border-[#EEEEEE] rounded-full">
                <ArrowUpRight size={27} color='#EEEEEE' />
            </div>
        </div>
        <p className="text-[46px] font-[900] p-6">{value}</p>
    </div>
);

// Komponen untuk metrik performa individual (Penjualan, Pesanan, dll.)
const PerformanceMetric: React.FC<PerformanceMetricProps> = ({ title, value, change, changeColorClass }) => (
    <div className="flex flex-col space-y-2">
        <p className="text-[16px] font-bold text-[#333333]">{title}</p>
        <p className="text-[22px] font-regular text-[#333333] mt-1">{value}</p>
        <div className={`flex items-center text-[#F77000] text-[15px] font-bold mt-1 ${changeColorClass}`}>
            <img src='/icon/treangle.svg' className="mr-1" />
            <span>{change}</span>
        </div>
    </div>
);


const PageContent: NextPage = () => {
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
                        <div className='text-center space-y-4 pr-6' style={{
                            lineHeight: "110%"
                        }}>
                            <p className='text-[#444444] text-[17px]'>Peringkat Toko</p>
                            <h3 className='text-[#00AA5B] text-[33px] font-bold'>Start</h3>
                        </div>
                    </div>


                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mb-8">
                        <StatCard value="12" label="Bulan ini" className="bg-[#25AE88] text-white" />
                        <StatCard value="8" label="Belum Bayar" className="bg-[#EF476F] text-white" />
                        <StatCard value="10" label="Perlu Dikirim" className="bg-[#118AEF] text-white" />
                        <StatCard value="5" label="Dalam Pengiriman" className="bg-[#5E3BB4] text-white" />
                    </div>

                    {/* Kartu Performa Toko */}
                    <div className="bg-white rounded-[8px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)]">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-[#BBBBBBCC] p-6">
                            <div className='md:flex items-end gap-4'>
                                <h3 className="text-[23px] text-[#444444] font-bold" style={{
                                    lineHeight: '110%'
                                }}>Performa Toko</h3>
                                <p className="text-[14px] text-[#333333]">Periode 01 Juli 2025 s.d 25 Juli 2025</p>
                            </div>
                            <p className="text-[14px] text-[#333333] mt-2 sm:mt-0">Update Terbaru 25-07-2025 jam 20:00</p>
                        </div>

                        {/* Grid Metrik Performa */}
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-8 p-6">
                            <PerformanceMetric title="Penjualan" value="Rp1.750.000" change="45,32%" changeColorClass="text-orange-500" />
                            <PerformanceMetric title="Pesanan" value="15" change="120%" changeColorClass="text-orange-500" />
                            <PerformanceMetric title="Konversi Pesanan" value="85%" change="45,32%" changeColorClass="text-orange-500" />
                            <PerformanceMetric title="Total Pengunjung" value="1.500" change="45,32%" changeColorClass="text-orange-500" />
                            <PerformanceMetric title="Produk Diklik" value="2.000 Kali" change="45,32%" changeColorClass="text-orange-500" />

                        </div>
                    </div>
                </main>
            </div>

        </div>
    );
};



export default function DashboardPage() {
    return (
        <MyStoreLayout>
            <PageContent />
        </MyStoreLayout>
    );
}
