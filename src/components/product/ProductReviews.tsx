import { Review } from 'components/types/Product';
import React, { useState } from 'react'

const ThumbsUpIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053m.076 9.002z" />
    </svg>
);

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

    return (
        <div className="bg-white rounded-lg shadow-md mt-4 p-4 sm:p-6 mb-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Penilaian Produk</h2>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="text-center sm:text-left">
                    <p className="text-blue-600"><span className="text-3xl font-semibold">{productRating?.toFixed(1) || 5}</span> dari 5</p>
                    <div className="flex justify-center sm:justify-start mt-1">
                        {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} className="w-5 h-5 text-blue-500" />)}
                    </div>
                </div>
                <div className="w-full flex flex-wrap gap-2">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 text-sm rounded border ${activeFilter === filter
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-6 space-y-6">
                {reviews.map(review => (
                    <div key={review.id} className="flex gap-4 border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                        <img src={review.avatarUrl} alt={review.author} className="w-10 h-10 rounded-full flex-shrink-0 mt-1" />
                        <div className="w-full">
                            <p className="font-semibold text-sm">{review.author}</p>
                            <div className="flex mt-1">
                                {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-blue-500' : 'text-gray-300'}`} />)}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{review.date} | Variasi: {review.variant}</p>
                            <p className="mt-2 text-sm text-gray-800">{review.comment}</p>
                            {review.videos && review.videos.length > 0 && (
                                <div className="mt-2">
                                    <button className="relative w-24 h-24 bg-black rounded-md overflow-hidden">
                                        <img src={review.videos[0].thumbnailUrl} alt="video thumbnail" className="w-full h-full object-cover opacity-70" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path></svg>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            )}
                            {review.sellerResponse && (
                                <div className="mt-4 bg-gray-100 p-3 rounded-md">
                                    <p className="text-sm font-semibold text-gray-600 mb-1">Respon Penjual:</p>
                                    <p className="text-sm text-gray-700">{review.sellerResponse.comment}</p>
                                </div>
                            )}
                            <div className="mt-2 flex items-center gap-2 text-gray-500">
                                <ThumbsUpIcon className="w-4 h-4" />
                                <span className="text-xs">{review.likes}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default ProductReviews