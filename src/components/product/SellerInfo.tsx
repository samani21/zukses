import React from 'react';
import { Seller } from 'components/types/Product';

const StarIcon = ({ className = "w-5 h-5 text-yellow-400" }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

interface SellerInfoProps {
    seller: Seller;
}

const SellerInfo: React.FC<SellerInfoProps> = ({ seller }) => {
    return (
        <div className="bg-white shadow-[1px_1px_10px_rgba(0,0,0,0.08)] p-6 flex items-center gap-6">
            {/* Kiri - Avatar & Tombol */}
            <div className="flex items-center gap-4 w-1/2">
                {/* <div className="w-14 h-14 rounded-full border flex items-center justify-center text-indigo-700 font-bold text-xl bg-white">
               
                </div> */}
                <img src={seller?.avatarUrl} className='w-[94px] h-[94px] border border-[#BBBBBB] rounded-full' />
                <div >
                    <p className="text-[20px] font-bold text-[#333333] mb-2">{seller.name}</p>
                    <div className="flex gap-2 mt-4">
                        <button className="text-[14px] text-[#563D7C] font-semibold h-[40px] text-[#7f56d9] border border-[#563D7C80]/50 bg-[#F6E9F0] px-3 py-1 hover:bg-[#e8dbfc]">
                            Chat Sekarang
                        </button>
                        <button className="text-[14px] font-semibold h-[40px] bg-[#4A52B2] text-white px-3 py-1 hover:bg-[#4338ca]">
                            Kunjungi Toko
                        </button>
                    </div>
                </div>
            </div>

            {/* Tengah - Rating */}
            <div className="flex items-start gap-2 px-6 py-1 w-1/3 border-l border-[#DDDDDD]">
                <div className="text-sm text-gray-700">
                    <div className='flex items-center'>
                        <StarIcon className='w-[40px] h-[40px] text-[#F7A200]' />
                        <p className="text-[28px] font-bold text-[#333333]">
                            {seller.stats.rating} <span className="text-[#333333] text-[20px] font-[400]">/ 5</span>
                        </p>
                    </div>
                    <p className="text-[16px] text-[#333333] ml-2">90% pembeli merasa puas</p>
                    <p className="text-[16px] text-[#333333] ml-2">
                        673 rating • 398 ulasan
                    </p>
                </div>
            </div>

            {/* Kanan - Info toko */}
            <div className="text-sm space-y-1 h-[100px] min-w-[160px] w-1/3 border-l border-[#DDDDDD] px-6 flex items-center">
                <table className='w-full'>
                    <tr>
                        <td className='text-[#333333] text-[16px] '>Produk</td>
                        <td></td>
                        <td className='text-[#333333] text-[16px] font-bold'>{seller.stats.products}</td>
                    </tr>
                    <tr>
                        <td className='text-[#333333] text-[16px] '>Penilaian</td>
                        <td></td>
                        <td className='text-[#333333] text-[16px] font-bold'>{seller.stats.reviewsCount}</td>
                    </tr>
                    <tr>
                        <td className='text-[#333333] text-[16px] '>Performa Toko</td>
                        <td></td>
                        <td className='text-[#333333] text-[16px] font-bold'>Sangat Baik</td>
                    </tr>
                </table>
            </div>
        </div >
    );
};

export default SellerInfo;
