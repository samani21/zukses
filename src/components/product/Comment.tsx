// /app/page.tsx atau /pages/index.tsx

// WAJIB: Menandakan ini adalah Client Component karena menggunakan hooks (useState, useMemo) dan event handlers (onClick).
'use client';

import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, StarIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';

// --- DEFINISI TIPE DATA (TYPESCRIPT) ---
// Mendefinisikan struktur objek untuk setiap ulasan
interface Review {
    id: number;
    user: string;
    initials: string;
    rating: number;
    date: string;
    variant: string;
    comment: string;
    images: string[];
    reply: {
        seller: string;
        text: string;
    } | null;
}

// --- DUMMY DATA GENERATION ---
// Fungsi ini menghasilkan data ulasan palsu untuk tujuan demonstrasi
const generateDummyReviews = (count: number): Review[] => {
    const reviews: Review[] = [];
    const users = ['Andi', 'Budi', 'Citra', 'Dewi', 'Eka', 'Fajar', 'Gita', 'Hadi'];
    const variants = ['Hitam,M', 'Putih,L', 'Biru,XL', 'Merah,S'];
    const comments = [
        'Pesanan sudah sampai, sesuai dengan yang diinginkan, dengan kualitas yang baik dan harga yang terjangkau. Pas unboxing tiba2 mamah saya juga mau 1 yg warna hitam, jadinya pesen lagi deh. Mantap!',
        'Kualitas produk sangat baik. Produk original. Harga produk sangat baik. Kecepatan pengiriman sangat baik. Respon penjual sangat baik. Recommended seller!',
        'Barang bagus, pengiriman cepat, seller ramah. Tidak mengecewakan belanja di toko ini. Next time order lagi.',
        'Agak sedikit kecewa karena ada noda, tapi setelah dicuci hilang. Selebihnya oke, bahan adem dan nyaman dipakai.',
        'Sesuai ekspektasi. Ukurannya pas dan warnanya juga bagus. Terima kasih seller.',
    ];

    for (let i = 1; i <= count; i++) {
        const rating = Math.floor(Math.random() * 5) + 1;
        const hasReply = Math.random() > 0.5;
        const date = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30));

        reviews.push({
            id: i,
            user: `${users[i % users.length].charAt(0)}*****${users[i % users.length].slice(-1)}`,
            initials: users[i % users.length].substring(0, 2).toUpperCase(),
            rating,
            date: date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0],
            variant: variants[i % variants.length],
            comment: comments[i % comments.length],
            images: Math.random() > 0.3 ? Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => `/image/image 13.png`) : [],
            reply: hasReply ? {
                seller: 'Toko Hati Senang',
                text: 'Terima kasih telah berbelanja di Advan Official Store. Bagikan link toko kami <b>https://www.zukses.com/<br/>Tokosenang</b> kepada teman-teman Anda dan favoritkan Toko kami untuk terus update mengenai stok dan produk terbaru'
            } : null,
        });
    }
    return reviews;
};

// Tipe untuk props ReviewCard
interface ReviewCardProps {
    review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isReplyVisible, setIsReplyVisible] = useState(true);
    const isLongComment = review.comment.length > 150;
    return (
        <div className="py-6 px-4  last:border-b-0">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center font-bold text-[#4A52B2] text-[20px] border border-[#BBBBBB]">
                    {review.initials}
                </div>
                <div className="flex-grow mt-1 space-y-2">
                    <p className=" text-[#000000] text-[14px]">{review.user}</p>
                    <div className='flex items-end gap-2 text-[#333333] font-bold text-[17px] tracking-[-0.02em]'>
                        <StarIcon size={24} color='#F74B00' strokeWidth={2.5} />
                        {review.rating}/2
                    </div>
                    <p className="text-[14px] text-[#000000] mt-1">{review.date} | Variasi: {review.variant}</p>
                    <p className="text-[14px] tracking-[-0.02em] mt-2" style={{
                        lineHeight: '137%'
                    }}>
                        {isLongComment && !isExpanded ? `${review.comment.substring(0, 150)}...` : review.comment}
                        {isLongComment && (
                            <button onClick={() => setIsExpanded(!isExpanded)} className="text-[#24B572] font-bold text-[15px] ml-1">
                                {isExpanded ? 'Sembunyikan' : 'Selengkapnya'}
                            </button>
                        )}
                    </p>
                    {review.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {review.images.map((img, index) => (
                                <img key={index} src={img} alt={`Ulasan gambar ${index + 1}`} className="w-[64px] h-[64px] md:w-[64px] md:h-[64px] border border-[#DDDDDD] object-cover " />
                            ))}
                        </div>
                    )}
                    {
                        review.reply &&
                        <button onClick={() => setIsReplyVisible(!isReplyVisible)} className="flex items-center gap-1 text-[#09824C] font-bold text-[14px] mt-3 ml-auto">
                            {isReplyVisible ? 'Tutup Balasan' : 'Lihat Balasan'}
                            {isReplyVisible ? <ChevronUp size={18} strokeWidth={2} /> : <ChevronDown size={18} strokeWidth={2} />}
                        </button>
                    }
                    {review.reply && (
                        <>
                            {isReplyVisible && (
                                <div className="mt-4 p-4 py-6 bg-[#F2F4F7] rounded-[10px] flex items-start gap-4">
                                    <div className="flex-shrink-0 w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center font-bold text-[#4A52B2] text-[20px] border border-[#BBBBBB]">
                                        HS
                                    </div>
                                    <div>
                                        <div className='flex items-center gap-5'>
                                            <p className="font-bold text-[17px] tracking-[-0.02em] text-[#333333] mt-3">{review.reply.seller}
                                                <span className="text-[#06894E] ml-4">Penjual</span>
                                            </p>
                                            <p className="text-[14px] text-[#000000] mt-3">{review.date} | Variasi: {review.variant}</p>
                                        </div>
                                        <div
                                            className='text-[14px] tracking-[-0.02em] mt-2'
                                            dangerouslySetInnerHTML={{
                                                __html: review.reply.text.replace(/\r?\n/g, '<br />'),
                                            }}
                                            style={{
                                                lineHeight: "137%"
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// Tipe untuk props Pagination
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            if (currentPage > 2) pages.push(currentPage - 1);
            if (currentPage !== 1 && currentPage !== totalPages) pages.push(currentPage);
            if (currentPage < totalPages - 1) pages.push(currentPage + 1);
            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return [...new Set(pages)];
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav className="flex items-center justify-left pl-17 flex-wrap gap-2">
            {pageNumbers.map((page, index) => (
                <React.Fragment key={index}>
                    {page === '...' ? (
                        <span className="px-4 py-2  font-bold text-[14px] tracking-[0] text-black" style={{
                            lineHeight: '140%'
                        }}>...</span>
                    ) : (
                        <button
                            onClick={() => onPageChange(page as number)}
                            className={cn(
                                "px-4 py-2 text-[16px] h-[32px] font-medium rounded-lg transition-colors",
                                currentPage === page
                                    ? "bg-[#1073F7] text-[#F5F5F5]"
                                    : "bg-white text-[#1E1E1E] hover:bg-gray-100"
                            )}
                            aria-current={currentPage === page ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};


// --- MAIN PAGE COMPONENT ---
export default function ProductReviewsPage() {
    const [allReviews] = useState(() => generateDummyReviews(120));
    const [activeFilter, setActiveFilter] = useState('semua');
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5;

    const filteredReviews = useMemo(() => {
        if (activeFilter === 'semua') return allReviews;
        const starFilter = parseInt(activeFilter); // Ini aman karena value sekarang '1', '2', dst.
        return allReviews.filter(review => review.rating === starFilter);
    }, [allReviews, activeFilter]);

    const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

    const currentReviews = useMemo(() => {
        const startIndex = (currentPage - 1) * reviewsPerPage;
        return filteredReviews.slice(startIndex, startIndex + reviewsPerPage);
    }, [filteredReviews, currentPage, reviewsPerPage]);

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        setCurrentPage(1); // Selalu kembali ke halaman 1 saat filter diubah
    };

    const overallRating = useMemo(() => {
        if (allReviews.length === 0) return 0;
        const total = allReviews.reduce((acc, review) => acc + review.rating, 0);
        return (total / allReviews.length).toFixed(1);
    }, [allReviews]);

    // Menggunakan array of objects untuk filter agar lebih aman dan scalable
    const filterButtons = [
        { label: 'Semua', value: 'semua' },
        { label: '5 Bintang', value: '5' },
        { label: '4 Bintang', value: '4' },
        { label: '3 Bintang', value: '3' },
        { label: '2 Bintang', value: '2' },
        { label: '1 Bintang', value: '1' },
    ];

    return (
        <div className="mt-8">
            <div className="max-w-7xl mx-auto bg-white border border-[#DDDDDD] rounded-[8px] shadow-sm overflow-hidden">
                <div className="p-6">
                    <h1 className="text-[20px] font-semibold text-[#333333]">Ulasan Pembeli</h1>
                </div>
                <div className="flex flex-col md:flex-row border-t border-[#DDDDDD]">
                    {/* Sidebar Filter */}
                    <aside className="w-full md:w-1/4 lg:w-1/5 p-6 border-b md:border-b-0 md:border-r border-[#DDDDDD]">
                        <div className="mb-6">
                            <h2 className="font-bold text-[#333333]">Penilaian Produk</h2>
                            <div className="flex items-center gap-2 mt-2">
                                <StarIcon size={32} strokeWidth={2} color='#F74B00' />
                                <span className="text-[17px] font-bold text-[#333333] tracking-[-0.02em]">{overallRating}/5</span>
                                <p className="text-[14px] text-[#888888] tracking-[-0.03em]">({allReviews.length} Ulasan)</p>
                            </div>
                        </div>
                        <div className='pt-4 px-6'>
                            <h3 className="font-bold text-center text-[#333333] tracking-[-0.02em] mb-4">Filter Ulasan</h3>
                            <div className="flex flex-wrap md:flex-col gap-2 space-y-2 ">
                                {filterButtons.map(filter => (
                                    <button
                                        key={filter.value}
                                        onClick={() => handleFilterChange(filter.value)}
                                        className={cn(
                                            "w-full px-4 py-2 rounded-[10px] border border-[#0D915E] font-[500] text-[15px] text-[#333333] transition-colors",
                                            activeFilter === filter.value
                                                ? "bg-[#0D915E] font-bold text-white"
                                                : "bg-[#C4EDDD] "
                                        )}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Konten Ulasan */}
                    <main className="w-full md:w-3/4 lg:w-4/5 p-6">
                        {currentReviews.length > 0 ? (
                            <>
                                {currentReviews.map(review => (
                                    <ReviewCard key={review.id} review={review} />
                                ))}
                                {totalPages > 1 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-gray-500">Tidak ada ulasan untuk filter ini.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
