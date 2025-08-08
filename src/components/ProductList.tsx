import React from 'react';
import { Product } from './types/Product';
import { ChevronDown } from 'lucide-react';
import CardProduct from './CardProduct';



interface ProductListProps {
    products: Product[];
    selectedCategory: string;
}

function ProductList({ products, selectedCategory }: ProductListProps) {

    const filteredProducts = selectedCategory === 'Semua'
        ? products
        : products.filter(p => p.category === selectedCategory);

    const list = [
        'Produk Terbaru', 'Terpopuler', 'Brand'
    ]

    return (
        <div className="container mx-auto px-0">
            <div className='flex items-center justify-between'>
                <h2 className="hidden md:block text-[22px] mb-[20px] mt-[10px] text-[#09824C] font-[800] tracking-[-0.03em]" style={{ lineHeight: "17px" }}>Rekomendasi untuk Anda</h2>
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
                    <CardProduct product={product} index={index} key={index} />
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

export default ProductList