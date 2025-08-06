import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { Product } from './types/Product';
import { useRouter } from 'next/router';
import { formatRupiah } from './Rupiah';



const StarIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
);

interface NewProductProps {
    products: Product[];
}

function ProductPromo({ products }: NewProductProps) {
    const router = useRouter()
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    // State untuk mengatur visibilitas tombol panah
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    // Fungsi untuk mengecek posisi scroll dan mengatur visibilitas panah
    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            // Tampilkan panah kiri jika posisi scroll lebih dari 0
            setShowLeftArrow(scrollLeft > 0);
            // Tampilkan panah kanan jika masih ada ruang untuk scroll ke kanan
            // Diberi toleransi 1px untuk mengatasi masalah pembulatan
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    // useEffect untuk menambahkan event listener saat komponen dimuat
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            // Cek posisi scroll saat pertama kali render dan saat ukuran window berubah
            checkScroll();
            container.addEventListener('scroll', checkScroll);
            window.addEventListener('resize', checkScroll);
        }

        // Fungsi cleanup untuk menghapus event listener
        return () => {
            if (container) {
                container.removeEventListener('scroll', checkScroll);
                window.removeEventListener('resize', checkScroll);
            }
        };
    }, [products]); // Dijalankan ulang jika data produk berubah

    // Fungsi untuk menangani klik pada tombol panah
    const handleArrowClick = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            // Gulir sejauh 80% dari lebar kontainer yang terlihat
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth', // Animasi scroll yang halus
            });
        }
    };
    function formatLocation(location: string) {
        return location
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    return (
        <div className="">
            <div className="flex justify-between items-center">
                <h2 className="hidden md:block text-[22px] text-dark mb-[20px] mt-[10px] text-[#09824C] font-[900] tracking-[-0.03em]" style={{ lineHeight: "17px" }}>Super Promo</h2>
                <a href="#" className="flex items-center text-[14px] font-bold text-[#1073F7] hover:text-gray-900 transition-colors">
                    Lihat Lebih Banyak
                    <ChevronDown className="w-4 h-4 ml-1" size={12} strokeWidth={3} />
                </a>
            </div>
            <div className="container mx-auto px-4 py-4 pt-0">
                <section aria-labelledby="super-promo-heading" className="relative">
                    {/* Header Section */}

                    {/* Tombol Panah Kiri */}
                    {showLeftArrow && (
                        <button
                            onClick={() => handleArrowClick('left')}
                            className="absolute left-5 top-[45%] -translate-y-1/2 z-10 bg-[#E7F2FF] h-[40px] w-[40px]  p-2 rounded-full shadow-md cursor-pointer hidden lg:flex items-center justify-center hover:bg-gray-100 transition-all -ml-4"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="text-[#1073F7]" size={28} strokeWidth={3} />
                        </button>
                    )}

                    {/* Product Grid - Scrollable on mobile */}
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-4 pb-4 -mx-4 px-4 pl-0 overflow-x-auto scrollbar-hide"
                    >
                        {products.map((product, index) => (
                            <div key={index} className="flex-shrink-0 w-40 sm:w-48 md:w-[347px] border border-[#DEDEDE] bg-white rounded-[15px]  hover:shadow-lg transition-shadow duration-300 overflow-hidden group cursor-pointer tracking-[-0.03em]" onClick={() => {
                                const slug = product.name
                                    .toLowerCase()
                                    .replace(/[\s/]+/g, '-')
                                    .replace(/-+/g, '-')
                                    .replace(/^-|-$/g, '');
                                router?.push(`/${slug}`);
                                localStorage.setItem('product', JSON.stringify(product));
                            }}>
                                <div className='grid grid-cols-4'>
                                    <div className="col-span-2 relative w-[160px] overflow-hidden">
                                        <div className='relative'>
                                            <div className="absolute top-5 left-1 -right-0 flex flex-col z-10 gap-2">
                                                {
                                                    product?.discount_percent ?
                                                        <div className='flex items-center h-[22px]' style={{ letterSpacing: "-0.04em" }}>
                                                            <span className='bg-[#FAD7D7] border text-[#F02929]  font-[600] text-[12px] rounded-r-full px-2 py-0.5'>Diskon {product?.discount_percent}%</span>
                                                        </div> : ''
                                                }
                                                {
                                                    product?.delivery?.subsidy ?
                                                        <div className='flex items-center h-[22px]' style={{ letterSpacing: "-0.04em" }}>
                                                            <span className='bg-[#C8F7D4] text-[#388F4F]  font-[600] text-[12px] border rounded-r-full px-2 py-0.5'>Gratis Ongkir</span>
                                                        </div> : ''
                                                }
                                            </div>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="md:w-[160px] md:h-[160px]  object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=Produk';
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2 space-y-1 pt-1 -ml-1">
                                        <p
                                            className="text-[14px] md:text-[14px] text-[#111111] line-clamp-2"
                                            style={{
                                                lineHeight: '17px',
                                                minHeight: '17px', // setara 2 baris
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {product.name}
                                        </p>
                                        <div className='flex gap-2 items-center'>
                                            <p className="text-[12px] md:text-[14px] font-bold mt-1 text-[#F74B00] bg-[#FFF7F7] border border-[#F74B00] p-1 px-3 rounded-full" style={{ lineHeight: "18px" }}>{formatRupiah(product.price)}</p>
                                            {/* <p className="text-[12px] md:text-[12px] text-[#555555] mt-1 mb-1  line-through" style={{
                                                lineHeight: "22px",
                                                letterSpacing: "-0.04em"
                                            }}>Rp300.000</p> */}
                                        </div>
                                        {/* <div className='flex'>
                                            {
                                                product?.discount_percent ?
                                                    <div className='bg-[#FAD7D7] border border-[#F02929] h-[20px] text-[10px] font-[700] text-[10px] text-[#F02929]  flex flex-col items-start justify-end px-2 pt-5 rounded-[3px] mr-2' style={{ letterSpacing: "-0.04em" }}>
                                                        Diskon {product?.discount_percent}%
                                                    </div> : <div className=' h-[20px] '>

                                                    </div>
                                            }
                                            {
                                                product?.delivery?.subsidy ?
                                                    <div className='bg-[#C8F7D4] h-[20px] text-[10px] font-[700] text-[10px] border-[#388F4F] border text-[#388F4F]  flex flex-col items-start justify-end px-2 pt-5 rounded-[3px]' style={{ letterSpacing: "-0.04em" }}>
                                                        Gratis Ongkir
                                                    </div> : ''
                                            }
                                        </div> */}
                                        <div className="flex items-center gap-2  justify-start text-xs text-gray-500" style={{ letterSpacing: "-0.04em", lineHeight: "22px" }}>
                                            <div className='flex items-center' style={{ lineHeight: "22px" }}>
                                                <StarIcon className="w-[16px] h-[16px] text-yellow-400" />
                                                <span className='text-[12px] font-semibold text-[#555555] tracking-[-0.04em]'>{product.rating || 4.9}</span>
                                                <span className='ml-2 text-[12px] mt-[-1px] text-[#555555] tracking-[-0.04em]'>{product.sold || "1000"}+ terjual</span>
                                            </div>
                                            {
                                                product?.voucher ?
                                                    <div className={`bg-[#E7F2FF] mt-2 text-[#1073F7] rounded-[3px] font-bold text-[10px] h-[20px] flex flex-col items-start justify-end px-2 pt-5`}>
                                                        Voucher
                                                    </div> : ''
                                            }
                                        </div>
                                        <p className="text-[12px] text-[#555555] -mt-1" style={{
                                            lineHeight: "22px",
                                            letterSpacing: "-0.04em"
                                        }}>{formatLocation(product?.seller?.location)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tombol Panah Kanan */}
                    {showRightArrow && (
                        <button
                            onClick={() => handleArrowClick('right')}
                            className="absolute right-5 top-[45%] -translate-y-1/2 z-10 bg-[#E7F2FF] h-[40px] w-[40px] p-2 rounded-full shadow-md cursor-pointer hidden lg:flex items-center justify-center hover:bg-gray-100 transition-all -mr-4"
                            aria-label="Scroll right"
                            style={{
                                width: "40px",
                                height: "40px"
                            }}
                        >
                            <ChevronRight className="text-[#1073F7]" size={28} strokeWidth={3} />
                        </button>
                    )}
                </section>
            </div>
        </div>
    );
};

export default ProductPromo;

// CSS tambahan untuk menyembunyikan scrollbar (jika diperlukan)
// Anda bisa menambahkan ini di file global.css Anda
/*
@layer utilities {
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
*/
