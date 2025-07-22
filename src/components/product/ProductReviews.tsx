import { Review } from 'components/types/Product';
import React, { useState } from 'react'

const StarIcon = ({ className = "w-4 h-4 text-blue-400" }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
    </svg>
);

interface ProductReviewsProps {
    reviews: Review[];
    productRating: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ reviews, productRating }) => {
    const [activeFilter, setActiveFilter] = useState('Semua');

    const filters = ['Semua', '5 Bintang (12)', '4 Bintang (0)', '3 Bintang (0)', '2 Bintang (0)', '1 Bintang (0)', 'Dengan Komentar (6)', 'Dengan Media (3)'];
    const maskName = (name: string) => {
        if (name.length <= 2) return name[0] + '*';
        return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
    };

    return (
        <div className="bg-white border border-[#DDDDDD] shadow-[1px_1px_10px_rgba(0,0,0,0.08)] rounded-[5px] mt-4 p-4 sm:p-6">
            <div className='flex items-center gap-4'>
                <div className='w-1/6'>
                    <h2 className="text-[20px] font-semibold text-[#333333] mb-4">Penilaian Produk</h2>
                    <div className='flex items-center'>
                        <StarIcon className="w-[40px] h-[40px] text-yellow-400" />
                        <p className="text-[#333333]"><span className="text-[28px] font-bold">{productRating?.toFixed(1) || 4.9}</span>/ 5</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 text-[14px] border ${activeFilter === filter
                                ? 'border border-[#563D7C] text-white bg-[#563D7C]'
                                : 'bg-[#F6E9F0] text-dark border border-[#563D7C] hover:bg-gray-50'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <div className='flex items-center justify-center'>
                <div className="mt-6 space-y-6 w-[85%]">
                    {reviews.map(review => (
                        <div key={review.id} className="pb-6 last:border-b-0 last:pb-0 flex gap-4">
                            {/* Avatar rotated */}
                            <div className="flex-shrink-0 mt-1">
                                <img
                                    src={review.avatarUrl}
                                    alt={review.author}
                                    className="w-10 h-10 rounded-full transform"
                                />
                            </div>

                            <div className="flex-1">
                                {/* Author & Rating */}
                                <p className="text-[14px] text-[#000000]">{maskName(review.author)}</p>
                                <div className="flex mt-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <StarIcon
                                            key={i}
                                            className={`w-4 h-4 ${i < review.rating ? 'text-red-500' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>

                                {/* Date & Variant */}
                                <p className="text-[12px] text-[#000000] mt-1">
                                    {review.date} | Variasi: {review.variant}
                                </p>

                                {/* Comment */}
                                <p className="mt-2 text-[14px] text-dark line-clamp-3">
                                    {review.comment}
                                </p>

                                <div className='flex items-center mt-2 gap-3'>
                                    <div className='w-[64px] h-[64px] bg-[#D9D9D9] border border-[#555555]' />
                                    <div className='w-[64px] h-[64px] bg-[#D9D9D9] border border-[#555555]' />
                                    <div className='w-[64px] h-[64px] bg-[#D9D9D9] border border-[#555555]' />
                                    <div className='w-[64px] h-[64px] bg-[#D9D9D9] border border-[#555555]' />
                                    <div className='w-[64px] h-[64px] bg-[#D9D9D9] border border-[#555555]' />
                                </div>
                                {/* Photo Thumbnails (grid 5 kolom seperti gambar) */}
                                {review.images && review.images.length > 0 && (
                                    <div className="mt-2 grid grid-cols-5 gap-2">
                                        {review.images.map((img, i) => (
                                            <img
                                                key={i}
                                                src={img.url}
                                                alt={`img-${i}`}
                                                className="w-full h-20 rounded-md object-cover"
                                            />
                                        ))}
                                    </div>
                                )}


                                <div className="mt-4 bg-[#F5E2EE] p-3 border-l-8 border-[#6022A0]">
                                    <p className="text-[14px] font-semibold text-[#6022A0]">Respon Penjual</p>
                                    <p className="text-[14px] text-[#6022A0] mt-1 whitespace-pre-line">
                                        {review.sellerResponse ? review.sellerResponse.comment : 'Allhamdulillah kakaknya puas,,makasih banyak ya kak bintang 5 nya moga berkah'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    )
}
export default ProductReviews