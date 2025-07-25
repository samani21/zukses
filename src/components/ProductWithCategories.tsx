import React from 'react';
import { Product } from './types/Product';
import { formatRupiah } from './Rupiah';
import { useRouter } from 'next/router';

const StarIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
);

interface ProductWithCategoriesProps {
    products: Product[];
    idProduct?: number;
}

function ProductWithCategories({ products, idProduct }: ProductWithCategoriesProps) {
    const router = useRouter()
    return (
        <div className="container mx-auto px-0 mb-24">
            {products?.length > 0 && products?.some(product => product.id != idProduct) &&
                <h2 className="text-[#111111] text-[13px] md:text-[16px] text-dark mb-[10px] mt-[10px] md:text-[#333333] font-semibold px-4 md:px-0">Produk Sejenis</h2>
            }

            <div className="px-4 md:px-0 grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {products?.map(product => (
                    product.id != idProduct &&
                    <a
                        key={product.id}
                        className="bg-white cursor-pointer w-full h-full overflow-hidden group lg:w-[190px] lg:h-[342px] border border-[#DDDDDD]"
                        onClick={() => {
                            const slug = product.name
                                .toLowerCase()
                                // ganti spasi ATAU karakter “/” dengan "-"
                                .replace(/[\s/]+/g, '-')
                                // hapus tanda minus ganda di tengah/tengah akhir, opsional
                                .replace(/-+/g, '-')
                                .replace(/^-|-$/g, '');
                            router?.push(`/${slug}`)
                            localStorage.setItem('product', JSON.stringify(product));
                        }}
                        style={{
                            letterSpacing: "-0.03em"
                        }}
                    >

                        <img src={product.image} alt={product.name} className="md:w-[190px] md:h-[190px] group-hover:opacity-90" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=Produk'; }} />
                        <div className="p-2 ">
                            <p
                                className="text-[12px] md:text-[14px] w-full text-dark line-clamp-2 h-8.5 text-[#111111]"
                                style={{ lineHeight: '17px' }}
                            >
                                {product.name}
                            </p>

                            <p className="text-[14px] md:text-[16px] font-semibold mt-1 text-[#CD0030]">{formatRupiah(product.price)}</p>
                            <div className='flex justify-left items-center mt-1 gap-2'>
                                {product.is_cod_enabled ? <div className="mt-1 w-[48px] h-[24px] bg-[#F77000] flex justify-center items-center rounded-[10px]">
                                    <p className="text-[12px] text-white font-bold">
                                        COD
                                    </p>
                                </div> : ''}
                                <div className="mt-1 w-[48px] h-[24px] bg-[#DE4A53] flex justify-center items-center rounded-[10px]">
                                    <p className="text-[12px] text-white font-bold">
                                        -31%
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mt-1"
                                style={{
                                    letterSpacing: "-0.04em",
                                    lineHeight: "22px"
                                }}>
                                <StarIcon className="w-5 h-5 text-yellow-400" />
                                <span className='text-[12px] font-semibold text-[#555555]'>{product.rating || 4.9}</span> <span className='ml-2 text-[12px] mt-[-1px] text-[#555555]'>{product.sold || " 1000"}+ terjual</span>
                            </div>
                            <p className="text-[12px] text-[#333333] ">Kota Makassar</p>
                        </div>
                    </a>
                ))}
            </div>
        </div >
    );
}

export default ProductWithCategories