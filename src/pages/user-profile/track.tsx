import React, { useState } from 'react';
import {  X } from 'lucide-react';
import UserProfile from 'pages/layouts/UserProfile';

// --- TYPE DEFINITIONS ---

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

interface TimelineItemProps {
    time: string;
    title: string;
    description: string;
    isLast: boolean;
    isFirst: boolean;
}

interface StepperStep {
    id: number;
    icon: string;
    title: string;
    date: string;
    completed: boolean;
}

interface TrackingEvent {
    time: string;
    title: string;
    description: string;
}

interface Product {
    id: number;
    name: string;
    variant: string;
    quantity: number;
    price: number;
    originalPrice: number;
    imageUrl: string;
}

interface SummaryItem {
    label: string;
    value: number | string;
    isTotal?: boolean;
}


// --- HELPER COMPONENTS ---

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-xl relative max-w-sm w-full" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
                {children}
            </div>
        </div>
    );
};

const TimelineItem: React.FC<TimelineItemProps> = ({ time, title, description, isLast, isFirst }) => (
    <div className="relative flex items-start mb-[-10px]">
        {/* Vertical line */}
        {!isLast && (
            <div className="absolute left-[11px] top-5 h-full w-0.5 bg-gray-300"></div>
        )}

        {/* Dot */}
        <div className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full ${isFirst ? 'bg-purple-600' : 'bg-gray-300'}`}>
            {isFirst && <div className="h-3 w-3 rounded-full bg-white"></div>}
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


// --- MAIN APP COMPONENT ---
const TrackPage: React.FC = () => {
    // State for modal
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', body: '' });

    // Function to open modal with specific content
    const openModal = (title: string, body: string) => {
        setModalContent({ title, body });
        setModalOpen(true);
    };

    // Function to close modal
    const closeModal = () => {
        setModalOpen(false);
    };

    // Mock data with types
    const stepperData: StepperStep[] = [
        { id: 1, icon: '/icon/parcel_3639524 1.svg', title: 'Pesanan Dibuat', date: '30-06-2025 14:21', completed: true },
        { id: 2, icon: '/icon/credit-card_9492827 1.svg', title: 'Pesanan Dibayarkan (Rp225.000)', date: '30-06-2025 14:21', completed: true },
        { id: 3, icon: '/icon/delivery-truck_9019176 1.svg', title: 'Pesanan Dikirimkan', date: '01-07-2025 20:03', completed: true },
        { id: 4, icon: '/icon/shipping_16917225 1.svg', title: 'Pesanan Selesai', date: '07-07-2025 17:29', completed: true },
        { id: 5, icon: '/icon/nilai 1.svg', title: 'Belum Dinilai', date: '', completed: false },
    ];

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

    const productData: Product[] = [
        { id: 1, name: 'Maystar Sarung Tangan Winter Musim Dingin Touch Screen Pria Wanita Sarung 7', variant: 'Warna Putih Ukuran Sedang', quantity: 2, price: 290000, originalPrice: 350000, imageUrl: '/image/gambar23.svg' },
        { id: 2, name: 'Maystar Sarung Tangan Winter Musim Dingin Touch Screen Pria Wanita Sarung 7', variant: 'Warna Putih Ukuran Sedang', quantity: 2, price: 290000, originalPrice: 350000, imageUrl: '/image/gambar23.svg' }
    ];

    const summaryData: SummaryItem[] = [
        { label: 'Subtotal Produk', value: 400000 },
        { label: 'Subtotal Pengiriman', value: 100000 },
        { label: 'Subtotal Diskon Pengiriman', value: 0 },
        { label: 'Biaya Layanan', value: 2500 },
        { label: 'Biaya Transfer', value: 4000 },
        { label: 'Total Pesanan', value: 590000, isTotal: true },
        { label: 'Metode Pembayaran', value: 'Bank BRI' },
    ];

    const formatRupiah = (amount: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount).replace('IDR', 'Rp');
    };


    return (
        <UserProfile>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className="text-center">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">{modalContent.title}</h3>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">{modalContent.body}</p>
                    </div>
                    <div className="mt-4">
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-purple-100 px-4 py-2 text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                            onClick={closeModal}
                        >
                            Mengerti
                        </button>
                    </div>
                </div>
            </Modal>

            <div className="">
                <div className="mx-auto space-y-4">
                    <div className='bg-white border border-[#DCDCDC] rounded-[20px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)]'>
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:border-b border-[#CCCCCC] px-6 py-4 tracking-[-0.05em]">
                            <h1 className="text-[20px] font-bold text-[#7952B3] mb-2 sm:mb-0">Lacak Pengiriman</h1>
                            <div className="flex items-center space-x-3 text-sm">
                                <span className="text-[#555555] text-[16px] font-[500]">Nomor Pesanan 250630VXXX94Q3</span>
                                <span className="text-[#EE4D2D] font-bold px-3 py-1 rounded-full text-[16px]">PESANAN SELESAI</span>
                            </div>
                        </div>

                        {/* Main Content Card */}
                        <div className="">
                            {/* Stepper */}
                            <div className='w-full px-10'>
                                <div className="flex items-start justify-between relative mb-8">
                                    <div className='px-0'>
                                        <div className="absolute top-10 left-1/10 h-0.5 bg-gray-200" style={{ width: "80%" }} />
                                        <div className="absolute top-10 left-1/10 h-0.5 bg-purple-300" style={{ width: '80%' }} />
                                    </div>
                                    {stepperData.map((step) => (
                                        <div key={step.id} className="flex flex-col items-center justify-end text-center w-1/5 z-10">
                                            <div className={`w-[80px] h-[80px] border-[3px] border-[#7952B3] rounded-full bg-white flex items-center justify-center`}>
                                                <img className='w-[50px] h-[50px]' src={step?.icon} />
                                            </div>
                                            <p className={`mt-2 text-[15px] font-[500] text-[#555555]`}>{step.title}</p>
                                            <p className="text-[14px] text-[#777777] mt-1">{step.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Bar */}
                            <div className="px-8 py-2 border-b border-[#CCCCCC]">
                                <p className="text-sm text-gray-500 text-center md:text-left">Ajukan Pengembalian Barang/Dana sebelum 12-07-2025 jika perlu.</p>
                            </div>
                            <div className="flex flex-wrap gap-3 justify-end p-6">
                                <button onClick={() => openModal('Lihat Tagihan', 'Ini adalah simulasi rincian tagihan untuk pesanan 250630VXXX94Q3.')} className="px-5 py-2 text-[14px] font-semibold  text-[14px] text-white bg-[#563D7C] hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">Lihat Tagihan</button>
                                <button onClick={() => openModal('Beri Nilai', 'Anda akan diarahkan ke halaman penilaian produk untuk memberikan rating dan ulasan.')} className="px-5 py-2 text-[14px] font-semibold  text-[14px] text-black bg-[#F6E9F0] border border-[#563D7C] hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">Beri Nilai</button>
                                <button onClick={() => openModal('Beli Lagi', 'Produk dari pesanan ini akan ditambahkan kembali ke keranjang belanja Anda.')} className="px-5 py-2 text-[14px] font-semibold  text-[14px] text-black bg-[#F6E9F0] border border-[#563D7C] hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">Beli Lagi</button>
                                <button className="px-5 py-2 text-[14px] font-semibold bg-[#E5E4E1] text-[14px] text-[#BBBBBB]  border border-[#AAAAAA] cursor-not-allowed">Ajukan Pengembalian</button>
                                <button onClick={() => openModal('Hubungi Penjual', 'Simulasi membuka jendela chat untuk menghubungi Toko Hati Senang.')} className="px-5 py-2 text-[14px] font-semibold  text-[14px] text-white bg-[#0A452A] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Hubungi Penjual</button>
                            </div>
                        </div>
                    </div>

                    {/* Shipment Details Card */}
                    <div className="bg-white border border-[#DCDCDC] rounded-[20px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)]">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center tracking-[-0.02em] px-8">
                            <h2 className="font-bold text-[#7952B3] text-[20px]">Detail Pengiriman</h2>
                            <div className="text-right">
                                <p className="font-[500] text-[14px] text-[#666666]">TIKI Standard</p>
                                <p className="font-[500] text-[14px] text-[#666666]">SPX123456789</p>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-12 md:gap-8">
                            <div className="py-6 px-8 md:col-span-4 mb-8 md:mb-0 border-[#CCCCCC] border-r tracking-[-0.02em]">
                                <h3 className="font-[500] text-[14px] text-[#333333] mb-2">Alamat Pengiriman</h3>
                                <div className="font-[500] text-[14px] text-[#333333] space-y-2">
                                    <p>Andi Gustisari</p>
                                    <p>(+62) 81292651600</p>
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

                    {/* Order Items Card */}
                    <div className="bg-white border border-[#DCDCDC] rounded-[5px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)]">
                        <div className="flex justify-between items-center tracking-[-0.02em] px-8 border-b border-[#CCCCCC] py-4">
                            <h2 className="text-[20px] font-bold text-[#7952B3]">Barang Dikirim</h2>
                            <div className="text-right text-sm">
                                <p className="font-[500] text-[14px] text-[#666666]">Toko Hati Senang</p>
                                <p className="font-[500] text-[14px] text-[#666666]">INV. 123456789</p>
                            </div>
                        </div>
                        <div className="">
                            {productData.map((product) => (
                                <div key={product.id} className="flex items-start gap-4 py-4 border-b px-8 border-b border-[#CCCCCC]  last:border-b-0">
                                    <div className="relative">
                                        <img src={product.imageUrl} alt={product.name} className="w-[82px] h-[82px] object-cover" onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/e2e8f0/333?text=Gagal+Muat'; }} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[14px] text-[#333333] tracking-[-0.02em]">{product.name}</p>
                                        <p className="text-[13px] text-[#333333] mt-1 tracking-[-0.04em]">{product.variant}</p>
                                        <p className="text-[13px] text-[#333333] mt-1 tracking-[-0.04em]">x{product.quantity}</p>
                                    </div>
                                    <div className="text-right tracking-[-0.04em]" style={{
                                        lineHeight: "108%"
                                    }}>
                                        <p className="text-[16px] font-bold text-[#E33947]">{formatRupiah(product.price)}</p>
                                        <p className="font-bold text-[14px] text-[#888888] line-through">{formatRupiah(product.originalPrice)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-[#CCCCCC]">
                            {summaryData.map((item, index) => (
                                <div key={index} className="grid grid-cols-5 items-center px-8 border-b border-[#CCCCCC] text-sm last:border-b-0">
                                    <div className='col-span-3 py-4 text-right border-r border-[#CCCCCC] px-4'>
                                        <p className="text-[#333333] text-[13px]">{item.label}</p>
                                    </div>
                                    <div className='col-span-2 text-right'>
                                        <p className={`${item.isTotal ? 'text-[#E33947] text-[20px] font-bold' : 'text-[#333333] text-[13px]'}`}>
                                            {typeof item.value === 'number' ? formatRupiah(item.value) : item.value}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </UserProfile>
    );
};

export default TrackPage;
