import React from 'react';
import { Product } from './types/Product';
import { formatRupiah } from './Rupiah';

const StarIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
);

interface ProductListProps {
    products: Product[];
    selectedCategory: string;
}

function ProductList({ products, selectedCategory }: ProductListProps) {
    const filteredProducts = selectedCategory === 'Semua'
        ? products
        : products.filter(p => p.category === selectedCategory);

    return (
        <div className="container mx-auto p-0">
            <h2 className="text-[16px] text-dark mb-4">Rekomendasi untuk Anda</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {filteredProducts?.map(product => (
                    <a
                        key={product.id}
                        className="bg-white overflow-hidden group w-[186px]"
                        style={{
                            boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.15)'
                        }}
                        onClick={() => {
                            const slug = product.name
                                .toLowerCase()
                                // ganti spasi ATAU karakter “/” dengan "-"
                                .replace(/[\s/]+/g, '-')
                                // hapus tanda minus ganda di tengah/tengah akhir, opsional
                                .replace(/-+/g, '-')
                                .replace(/^-|-$/g, '');        // buang minus di awal/akhir

                            window.location.href = `/${slug}`;
                            localStorage.setItem('product', JSON.stringify(product));
                        }}
                    >

                        <img src={product.image} alt={product.name} className="w-full h-[188px] group-hover:opacity-90" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=Produk'; }} />
                        <div className="p-2 ">
                            <h3 className="text-[14px] w-full text-dark line-clamp-2 h-10.5">
                                {product.name}
                            </h3>
                            <p className="text-[16px] font-bold mt-1">{formatRupiah(product.price)}</p>
                            <div className='flex justify-left items-center gap-2'>
                                {product.is_cod_enabled ? <div className="mt-1 w-[50px] h-[24px] bg-[#BB2C31] flex justify-center items-center">
                                    <p className="text-[12px] text-white">
                                        COD
                                    </p>
                                </div> : ''}
                                <div className="mt-1 w-[50px] h-[24px] bg-[#E36100] flex justify-center items-center">
                                    <p className="text-[12px] text-white">
                                        -31%
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mt-2">
                                <StarIcon className="w-5 h-5 text-yellow-400" />
                                <span className='text-[12px] mt-[-1px] text-[#333333]'>{product.rating || 4.9}</span> <span className='ml-2 text-[12px] mt-[-1px] text-[#555555]'>{product.sold || " 1000"}+ terjual</span>
                            </div>
                            <p className="text-[12px] text-[#333333] ">Kota Makassar</p>
                        </div>
                    </a>
                ))}
            </div>
            <div className='mt-2 flex justify-center items-center'>
                <div className='bg-[#563D7C] text-white w-[383px] h-[50px] flex justify-center items-center rounded-[10px] cursor-pointer'>
                    <p className='text-[14px] font-semibold'>Muat lebih Banyak</p>
                </div>
            </div>
        </div >
    );
}

export default ProductList