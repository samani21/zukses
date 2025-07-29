
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
    <div className={`flex px-8  items-center rounded-[8px] p-4 ${className}`} style={{
        lineHeight: "110%"
    }}>
        <p className="text-[#52357B] text-[24px] font-bold font-bold">{value}</p>
        <p className="text-[16px] text-[#52357B] mt-1 px-10">{label}</p>
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
            <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
                <main className="">
                    {/* Header */}
                    <div className="mb-6 border border-[#D2D4D8] bg-[#F3F5F7] p-4 rounded-[8px]">
                        <h1 className="text-[28px] text-[#333333] font-[800] tracking-[-0.02em]">Dashboard</h1>
                        <p className="text-[#444444] mt-4 text-[14px]" style={{
                            lineHeight: "107%"
                        }}>
                            Toko jalan, kamu tenang. <br /> Semua data penjualan dan laporan keuangan bisa kamu akses langsung di sini.
                        </p>
                    </div>

                    {/* Grid Utama: Banner CTA dan Peringkat Toko */}
                    <div className="space-y-4 md:space-y-0 md:grid grid-cols-1 lg:grid-cols-10 gap-6 mb-6">
                        {/* Kartu CTA Utama (Ungu) */}
                        <div className="lg:col-span-7 bg-[#6E62E5] text-white rounded-[8px] p-4 md:p-8 md:px-12 flex items-center tracking-[-0.02em]">
                            <div>
                                <div className='flex flex-col md:flex-row items-start'>
                                    <div className="hidden md:block relative mb-4 md:mb-0 md:mr-6">
                                        <img src='/icon/online-shopping_3081559 1.svg' className='w-[76px] h-[76px]' />
                                    </div>
                                    <div className=''>
                                        <p className="text-[18px] text-white ">Punya produk tapi belum punya toko? <br /> Atau masih jualan lewat chat satu per satu?</p>
                                        <h2 className="text-[21px] font-bold mt-3">Saatnya naik level bersama Zukses!</h2>
                                    </div>
                                </div>
                                <p className="mt-2 text-[19px]">
                                    Buka tokomu sendiri, kelola stok & transaksi, dan nikmati kemudahan <br /> Berjualan tanpa ribet.
                                </p>
                            </div>
                        </div>

                        {/* Kartu Peringkat Toko */}
                        <div className='col-span-3'>
                            <div className="bg-white rounded-[8px] p-6 border-2 border-[#6E62E5] shadow-sm">
                                <h3 className="font-bold text-[20px] text-center text-[#444444]" style={{
                                    lineHeight: "110%"
                                }}>Peringkat Toko</h3>
                                <div className="mt-2 text-center">
                                    <p className="text-[35px] font-bold text-[#00AA5B]" style={{
                                        lineHeight: "110%"
                                    }}>Start</p>
                                </div>
                                <div className=''>
                                    <ul className="mt-4 text-[12px] text-[#333333] space-y-1" style={{
                                        lineHeight: "110%"
                                    }}>
                                        <li>Pesanan Terselesaikan 100%</li>
                                        <li>Produk yang dilarang 0</li>
                                        <li>Ketepatan Pengiriman 99%</li>
                                        <li>Penilaian Pembeli 4.9 dari 5</li>
                                        <li>Pelanggaran Kebijakan 0</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grid Kartu Statistik */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <StatCard value="12" label="Pesanan dalam Bulan ini" className="bg-[#EBEAFC] border border-[#ddd] text-indigo-900" />
                        <StatCard value="5" label="Pesanan yang Belum Bayar" className="bg-purple-100 text-purple-900" />
                        <StatCard value="5" label="Pesanan yang perlu dikirim" className="bg-blue-100 text-blue-900" />
                        <StatCard value="5" label="Pesanan dalam Pengiriman" className="bg-green-200 text-green-900" />
                    </div>

                    {/* Kartu Performa Toko */}
                    <div className="bg-white rounded-[8px] p-6 shadow-[1px_1px_10px_rgba(0,0,0,0.08)]">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                            <div className='md:flex items-end gap-4'>
                                <h3 className="text-[23px] text-[#444444] font-bold" style={{
                                    lineHeight: '110%'
                                }}>Performa Toko</h3>
                                <p className="text-[14px] text-[#333333]">Periode 01 Juli 2025 s.d 25 Juli 2025</p>
                            </div>
                            <p className="text-[14px] text-[#333333] mt-2 sm:mt-0">Update Terbaru 25-07-2025 jam 20:00</p>
                        </div>

                        {/* Grid Metrik Performa */}
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-8">
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
