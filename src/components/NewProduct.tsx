import React from 'react';
import { Product } from './types/Product';
import { formatRupiah } from './Rupiah';
import { useRouter } from 'next/router';
import { ChevronDown } from 'lucide-react';

const StarIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
);

interface NewProductProps {
    products: Product[];
    selectedCategory: string;
}

function NewProduct({ products, selectedCategory }: NewProductProps) {
    const router = useRouter()
    const filteredProducts = selectedCategory === 'Semua'
        ? products
        : products.filter(p => p.category === selectedCategory);

    const list = [
        'Produk Terbaru', 'Terpopuler', 'Brand'
    ]
    function formatLocation(location: string) {
        return location
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    return (
        <div className="container mx-auto px-0 mt-6">
            <div className='flex items-center justify-between'>
                <h2 className="hidden md:block text-[22px] text-dark mb-[20px] mt-[10px] text-[#09824C] font-[900] tracking-[-0.03em]" style={{ lineHeight: "17px" }}>Produk Terbaru</h2>
                <a href="#" className="flex items-center text-[14px] font-bold text-[#1073F7] hover:text-gray-900 transition-colors">
                    Lihat Lebih Banyak
                    <ChevronDown className="w-4 h-4 ml-1" size={12} strokeWidth={3} />
                </a>
            </div>
            <div className="md:hidden flex overflow-x-auto scroll-smooth scrollbar-hide pl-2">
                <div className='flex flex-row md:grid md:grid-rows-1 md:grid-flow-col gap-2 px-2 md:px-0'>
                    <h2 className="w-full text-[13px] mb-[10px] mt-[10px] text-[#DE4A53] font-bold whitespace-nowrap">
                        Rekomendasi Untukmu
                    </h2>
                    {
                        list?.map((l, index) => (

                            <h2 key={index} className="w-full text-[13px] mb-[10px] mt-[10px] text-[#111111] font-[500] whitespace-nowrap">
                                {l}
                            </h2>
                        ))
                    }
                </div>
            </div>
            <div className="px-4 md:px-0 grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {filteredProducts?.slice(0, 6).map((product, index) => (
                    <a
                        key={product.id}
                        className="bg-white cursor-pointer w-full h-[311px] rounded-[15px] overflow-hidden group lg:w-[190px]  border border-[#DDDDDD]"
                        onClick={() => {
                            const slug = product.name
                                .toLowerCase()
                                .replace(/[\s/]+/g, '-')
                                .replace(/-+/g, '-')
                                .replace(/^-|-$/g, '');
                            router?.push(`/${slug}`);
                            localStorage.setItem('product', JSON.stringify(product));
                        }}
                        style={{
                            letterSpacing: "-0.03em"
                        }}
                    >
                        {/* Bungkus gambar dan label dalam container relatif */}
                        <div className="relative">
                            {/* Label Gratis Ongkir & Voucher */}
                            <div className="absolute top-3 left-0 -right-0 flex flex-col z-10 gap-1">
                                {
                                    product?.discount_percent ?
                                        <div className='flex items-center h-[22px]' style={{ letterSpacing: "-0.04em" }}>
                                            <span className='bg-[#F94D63]   font-[700] text-[12px] text-white rounded-r-full px-2 py-0.5'>Diskon {product?.discount_percent}%</span>
                                        </div> : ''
                                }
                                {
                                    product?.delivery?.subsidy ?
                                        <div className='flex items-center h-[22px]' style={{ letterSpacing: "-0.04em" }}>
                                            <span className='bg-[#388F4F]   font-[700] text-[12px] text-white rounded-r-full px-2 py-0.5'>Gratis Ongkir</span>
                                        </div> : ''
                                }
                            </div>

                            {/* Gambar produk */}
                            <img
                                src={product.image}
                                alt={product.name}
                                className="md:w-[190px] md:h-[190px] rounded-[10px] object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=Produk';
                                }}
                            />
                        </div>

                        {/* Informasi produk lainnya */}
                        <div className="p-2">
                            <p className="text-[12px] md:text-[14px] w-full text-dark line-clamp-2 h-8.5 text-[#111111]" style={{ lineHeight: '17px' }}>
                                {product.name}
                            </p>
                            <div className='flex gap-2 items-center'>
                                <p className="text-[12px] md:text-[14px] font-bold mt-1.5  text-[#F74B00] bg-[#FFF7F7] border border-[#F74B00] p-1 px-3 rounded-[12px]" style={{ lineHeight: "18px" }}>{formatRupiah(product.price)}</p>
                                {/* <p className="text-[12px] md:text-[12px] text-[#555555] mt-1  line-through" style={{
                                                 lineHeight: "22px",
                                                 letterSpacing: "-0.04em"
                                             }}>Rp300.000</p> */}
                            </div>

                            {/* <div className='flex justify-left items-center  gap-2'>
                                             {product.is_cod_enabled && (
                                                 <div className="mt-1 w-[48px] h-[24px] bg-[#F77000] flex justify-center items-center rounded-[10px]">
                                                     <p className="text-[12px] text-white font-bold">COD</p>
                                                 </div>
                                             )}
                                             <div className="mt-1 w-[48px] h-[24px] bg-[#DE4A53] flex justify-center items-center rounded-[10px]">
                                                 <p className="text-[12px] text-white font-bold">-31%</p>
                                             </div>
                                         </div> */}

                            <div className="flex items-start gap-1 justify-between text-xs text-gray-500 " style={{ letterSpacing: "-0.04em", lineHeight: "22px" }}>
                                <div className='flex items-center' style={{ lineHeight: "22px" }}>
                                    <StarIcon className="w-[16px] h-[16px] text-yellow-400" />
                                    <span className='text-[12px] font-semibold text-[#555555] tracking-[-0.04em]'>{product.rating || 4.9}</span>
                                    <span className='ml-2 text-[12px] mt-1 text-[#555555] tracking-[-0.04em]'>{product.sold || "1000"}+ terjual</span>
                                </div>
                                {
                                    product?.voucher ?
                                        <div className={`bg-[#E7F2FF] mt-2 text-[#1073F7] rounded-[3px] font-bold text-[10px] h-[20px] flex flex-col items-start justify-end px-2 pt-5`}>
                                            Voucher
                                        </div> : ''
                                }
                            </div>

                            <p className="text-[10px] text-[#555555] -mt-2" style={{
                                lineHeight: "22px",
                                letterSpacing: "-0.04em"
                            }}>{formatLocation(product?.seller?.location)}</p>
                        </div>
                    </a>

                ))}
            </div>
            {/* <div className='px-4 md:px-0 mt-10 flex justify-center items-center'>
                <div className='bg-[#238744] text-white w-[383px] h-[50px] flex justify-center items-center rounded-[20px] cursor-pointer'>
                    <p className='text-[16px] font-semibold'>Muat lebih Banyak</p>
                </div>
            </div> */}
        </div >
    );
}

export default NewProduct