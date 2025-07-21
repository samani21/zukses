import React, { useMemo, useState, useEffect } from 'react';
import ProductGallery from './ProductGallery';
import ImageLightbox from './ImageLightbox';
import { Product, Thumbnail, variant } from 'components/types/Product';
import { Check } from 'lucide-react';
import { formatRupiahNoRP } from 'components/Rupiah';

const ShoppingCartIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
);

const StarIcon = ({ className = "w-3.5 h-3.5 text-yellow-400" }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);
interface ProductDetailProps {
    product: Product;
}



const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
    const [activeVariant, setActiveVariant] = useState<variant | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [quantity, setQuantity] = useState<number>(1);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0);
    const [activeSelections, setActiveSelections] = useState<Record<number, string>>({});
    const allImages = useMemo(() => {
        // ... (logika `allImages` tidak berubah)
        const imageMap = new Map<string, Thumbnail>();

        // 1. Gambar utama dari product.image (jika ada)
        if (product?.image) {
            imageMap.set(product.image, {
                id: -1,
                url: product.image,
                alt: 'Gambar utama produk',
                type: 'image'
            });
        }

        // // 2. Tambahkan media video (jika ada)
        // product?.media?.forEach((m, i) => {
        //     if (/\.(mp4|webm|ogg)$/i.test(m.url)) {
        //         imageMap.set(m.url, {
        //             id: m.id ?? 1000 + i,
        //             url: m.url,
        //             alt: 'Video produk',
        //             type: 'video'
        //         });
        //     }
        // });

        // 3. Tambahkan dari variants
        product?.variants?.forEach((v, i) => {
            if (v.image) {
                imageMap.set(v.image, {
                    id: v?.id + i,
                    url: v.image,
                    alt: v.combination_label,
                    type: 'image',
                });
            }
        });

        // 4. Tambahkan dari thumbnails
        product?.thumbnails?.forEach((t) => {
            imageMap.set(t.url, t);
        });

        // 5. Tambahkan media gambar (non-video)
        product?.media?.forEach((m, i) => {
            if (!/\.(mp4|webm|ogg)$/i.test(m.url)) {
                imageMap.set(m.url, {
                    id: m.id ?? 2000 + i,
                    url: m.url,
                    alt: m.url,
                    type: m.type,
                });
            }
        });

        return Array.from(imageMap.values());
    }, [product?.image, product?.variants, product?.thumbnails, product?.media]);
    const videoProduct = useMemo(() => {
        // ... (logika `allImages` tidak berubah)
        const video = new Map<string, Thumbnail>();

        // // 2. Tambahkan media video (jika ada)
        product?.media?.forEach((m, i) => {
            if (/\.(mp4|webm|ogg)$/i.test(m.url)) {
                video.set(m.url, {
                    id: m.id ?? 1000 + i,
                    url: m.url,
                    alt: 'Video produk',
                    type: 'video'
                });
            }
        });


        return Array.from(video.values());
    }, [product?.media]);


    // ✨ BARU: Hitung rentang harga dari varian
    const priceRange = useMemo(() => {
        if (!product?.variants || product.variants.length === 0) {
            return null; // Tidak ada varian, tidak ada rentang harga
        }

        const prices = product.variants.map(v => v.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        return {
            min: minPrice,
            max: maxPrice,
            isRange: minPrice !== maxPrice // Tentukan apakah perlu ditampilkan sebagai rentang
        };
    }, [product?.variants]);
    const priceDiscountRange = useMemo(() => {
        if (!product?.variants || product.variants.length === 0) {
            return null; // Tidak ada varian, tidak ada rentang harga
        }

        const prices = product.variants.map(v => v.discount_price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        return {
            min: minPrice,
            max: maxPrice,
            isRange: minPrice !== maxPrice // Tentukan apakah perlu ditampilkan sebagai rentang
        };
    }, [product?.variants]);
    const DiscountRange = useMemo(() => {
        if (!product?.variants || product.variants.length === 0) {
            return null; // Tidak ada varian, tidak ada rentang harga
        }

        const prices = product.variants.map(v => v.discount_percent);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        return {
            min: minPrice,
            max: maxPrice,
            isRange: minPrice !== maxPrice // Tentukan apakah perlu ditampilkan sebagai rentang
        };
    }, [product?.variants]);


    useEffect(() => {
        if (!product?.variants || product.variants.length === 0) return;

        const activeImageUrl = allImages[activeImageIndex]?.url;
        if (!activeImageUrl) return;

        const correspondingVariant = product.variants.find(
            (v) => v.image === activeImageUrl
        );

        if (correspondingVariant) {
            // Cek untuk menghindari loop render yang tidak perlu
            if (activeVariant?.id !== correspondingVariant.id) {
                setActiveVariant(correspondingVariant);
            }
        }

    }, [activeImageIndex, allImages, product?.variants, activeVariant]);


    const handleVariantSelect = (variant: variant) => {
        setActiveVariant(variant);
        const foundIndex = allImages.findIndex(img => img.url === variant.image);
        if (foundIndex !== -1) {
            setActiveImageIndex(foundIndex);
        }
    };

    const handleImageClick = (index: number) => {
        if (window.innerWidth < 1024) return;
        setLightboxInitialIndex(index);
        setIsLightboxOpen(true);
    };

    const formatRupiah = (amount: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);

    const renderPriceDisplay = () => {
        if (activeVariant) {
            return formatRupiah(activeVariant.price);
        }
        if (priceRange) {
            if (priceRange.isRange) {
                return `${formatRupiah(priceRange.min)} - ${formatRupiah(priceRange.max)}`;
            }
            return formatRupiah(priceRange.min);
        }

        return formatRupiah(product?.price);
    };
    const renderPriceDisplayMobile = () => {
        if (activeVariant) {
            return <p>Rp {formatRupiah(activeVariant.price)}</p>;
        }
        if (priceRange) {
            if (priceRange.isRange) {
                return <p>Rp {formatRupiahNoRP(priceRange.max)}</p>
            }
            return <p>Rp {formatRupiahNoRP(priceRange.max)}</p>;
        }

        return <p>Rp {formatRupiahNoRP(product?.price)}</p>;

    };
    const renderPriceDiscountDisplay = () => {
        if (activeVariant) {
            return formatRupiah(activeVariant.discount_price);
        }
        if (priceDiscountRange) {
            if (priceDiscountRange.isRange) {
                return `${formatRupiah(priceDiscountRange.min)} - ${formatRupiah(priceDiscountRange.max)}`;
            }
            return formatRupiah(priceDiscountRange.min);
        }

        return formatRupiah(product?.price);
    };
    const renderPriceDiscountDisplayMobile = () => {
        if (activeVariant) {
            return <p>Rp <span className='text-[27px]'>{formatRupiahNoRP(activeVariant.discount_price)}</span></p>;
        }
        if (priceDiscountRange) {
            if (priceDiscountRange.isRange) {
                return <p>Rp <span className='text-[27px]'>{formatRupiahNoRP(priceDiscountRange.min)}</span> </p>
            }
            return <p>Rp <span className='text-[27px]'>{formatRupiahNoRP(priceDiscountRange.min)}</span></p>;
        }

        return <p>Rp <span className='text-[27px]'>{formatRupiahNoRP(product?.price)}</span></p>;
    };


    return (
        <>
            <div className="bg-white rounded-lg md:p-4 text-sm">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <ProductGallery
                        images={allImages}
                        videoProduct={videoProduct}
                        activeIndex={activeImageIndex}
                        setActiveIndex={setActiveImageIndex}
                        onImageClick={handleImageClick}
                    />
                    <div className="hidden md:block lg:col-span-3 mt-2">
                        <h1 className="text-base text-[22px] font-[500] text-gray-800">{product?.name}</h1>
                        <div className=" flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-xs">
                            <div className='bg-[#4A52B2] flex items-center px-6 py-2 gap-6'>
                                <div className=" flex items-center">
                                    <span className="text-blue-500 font-medium mr-1">{product?.rating?.toFixed(1)}</span>
                                    <div className="flex items-center"><span className='text-[16px] font-bold text-white mr-2'>4.9</span>{Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} />)}</div>
                                </div>
                                <span className="text-[14px] text-white"><span className='text-[16px] font-bold text-white mr-2'>{product?.reviewsCount || '1.8Rb'}</span> Penilaian</span>
                                <span className="text-[14px] text-white"><span className='text-[16px] font-bold text-white mr-2'>{product?.soldCount || '3Rb+'}</span> Terjual</span>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-md my-3">
                            <div className="flex items-center space-x-4 ">
                                {/* <span className="text-gray-500 text-sm line-through">{formatRupiah(product?.originalPrice || 100000)}</span> */}
                                <div className="text-dark text-[30px] font-[500]">{renderPriceDiscountDisplay()}</div>
                                <div className="text-[#888888] text-[16px] font-[500] line-through">{renderPriceDisplay()}</div>
                                <p className='text-[16px] font-[500] text-[#FF0000]'>{DiscountRange?.max}%</p>
                            </div>
                        </div>
                        <div className="flex gap-12 mb-2">
                            <span className="text-[#555555] text-[16px]  font-medium">Kondisi</span>
                            <span className="text-[#4A52B2] text-[16px] font-bold">{product?.is_used ? "Bekas dipakai" : "Baru"}</span>
                        </div>
                        <div className="space-y-3 w-1/2">
                            {product?.variant_prices.map((group) =>
                                <div key={group.id}>
                                    <span className="text-[#555555] text-[16px] font-medium">
                                        Pilih <span className="text-[#4A52B2] font-bold ml-3">{group.variant}</span>
                                    </span>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {group?.options.map((option, idx) => {
                                            return (
                                                option !== "" && (
                                                    <button
                                                        key={idx}
                                                        onClick={() => {
                                                            setActiveSelections((prev) => ({
                                                                ...prev,
                                                                [group.id]: option
                                                            }));

                                                            // Jika ini varian pertama, update gambar
                                                            if (product?.variant_prices?.[0]?.id === group.id) {
                                                                const matchedVariant = product.variants?.find((v) =>
                                                                    v.combination_label?.includes(option)
                                                                );
                                                                if (matchedVariant) {
                                                                    handleVariantSelect(matchedVariant);
                                                                }
                                                            }
                                                        }}

                                                        className={` bg-[#FFFFFF] border border-[#BBBBBB] text-[14px] font-[500] flex items-center gap-1 ${activeSelections[group.id] === option
                                                            ? 'border-orange-500 bg-orange-500 text-white py-0.5 pr-[3px] pl-[3px]'
                                                            : 'border-gray-400 bg-white text-black py-1 px-4'}`}
                                                        style={{
                                                            letterSpacing: "-0.04em"
                                                        }}
                                                    >
                                                        {activeSelections[group.id] === option ? <Check className='h-20px w-20px' /> : option}
                                                        {activeSelections[group.id] === option &&
                                                            <div className='bg-white text-[#333333] font-bold text-[14px] p-4 py-1'>
                                                                {option}
                                                            </div>}
                                                    </button>
                                                )
                                            );
                                        })}

                                    </div>
                                    <div className="mt-1 text-end">
                                        <button className="text-[#4A52B2] text-[16px] font-bold text-right">Lihat Lebih Banyak</button>
                                    </div>
                                </div>)}

                            <div className='text-[16px] font-bold text-[#DE4A53] flex gap-2 items-center'>
                                Panduan Ukuran
                                <img src='/icon/right.svg' />
                            </div>
                            <div className="grid md:flex items-center gap-4">
                                <span className="text-[16px] font-[500] text-[#555555]">Kuantitas</span>
                                <div className="flex items-center border border-[#BBBBBB] w-[157px] rounded overflow-hidden justify-between">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="px-4 py-1 text-sm sm:text-base text-gray-600 hover:bg-gray-100"
                                    >
                                        -
                                    </button>
                                    <input
                                        value={quantity}
                                        readOnly
                                        className="w-full text-center border-l border-r border-gray-300 text-xs sm:text-sm"
                                    />
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="px-4 py-1 text-sm sm:text-base text-gray-600 hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-[16px] font-[500] text-[#555555]">Tersedia 2</span>
                            </div>
                        </div>
                        <div className="mt-6 hidden sm:grid grid-cols-2 gap-3 w-1/2" style={{
                            lineHeight: "22px",
                            letterSpacing: "-0.04em"
                        }}>
                            <button className="w-full bg-[#F6E9F0] border border-[#563D7C]/50 py-2 px-3 text-[#563D7C] text-[16px] font-semibold flex items-center justify-center gap-2 hover:bg-[#ccb5c1]/50">
                                <ShoppingCartIcon className='w-[24px] h-[24px]' />
                                <span>Keranjang</span>
                            </button>
                            <button className="w-full bg-[#DE4A53] py-2 px-3 text-white text-[16px] font-semibold flex items-center justify-center gap-2 hover:bg-[#6e1017]/80">
                                <span>Beli Sekarang</span>
                            </button>
                        </div>
                    </div>
                    <div className='md:hidden px-4 space-y-2'>
                        <div className='flex items-center gap-4'>
                            <div className='text-[#CD0030] text-[20px] font-[500]'>
                                {renderPriceDiscountDisplayMobile()}
                            </div>
                            <div className="text-[#888888] text-[19px] font-[500] line-through">
                                {renderPriceDisplayMobile()}
                            </div>
                        </div>
                        <h1 className="text-[14px] text-[#111111]">{product?.name}</h1>
                        <div className='flex items-center gap-4'>
                            <div className='flex items-end'>
                                <StarIcon className='w-[20px] h-[20px] text-[#F7A200]' />
                                <span className='text-[#555555] text-[10px] font-semibold'>4.9</span>
                            </div>
                            <span className="text-[10px] text-[#555555]"><span className='text-[10px] text-[#555555]'>{product?.soldCount || '1000+'}</span> Terjual</span>
                        </div>
                        <div className='space-y-4'>
                            {product?.variant_prices.map((group) =>
                                <div key={group.id}>
                                    <div className='flex justify-between items-center'>
                                        <p className="text-[#555555] text-[12px] font-medium">
                                            Pilih <span className="text-[#4A52B2] font-bold ml-3">{group.variant}</span>
                                        </p>
                                        <div className='flex items-center gap-2 text-[#555555] text-[12px]'>
                                            selengkapnya
                                            <img src='/icon/right-dark.svg' />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {group?.options.map((option, idx) => {
                                            return (
                                                option !== "" && (
                                                    <button
                                                        key={idx}
                                                        onClick={() => {
                                                            setActiveSelections((prev) => ({
                                                                ...prev,
                                                                [group.id]: option
                                                            }));

                                                            // Jika ini varian pertama, update gambar
                                                            if (product?.variant_prices?.[0]?.id === group.id) {
                                                                const matchedVariant = product.variants?.find((v) =>
                                                                    v.combination_label?.includes(option)
                                                                );
                                                                if (matchedVariant) {
                                                                    handleVariantSelect(matchedVariant);
                                                                }
                                                            }
                                                        }}

                                                        className={` bg-[#FFFFFF] border border-[#BBBBBB] text-[12px] font-[500] flex items-center gap-1 ${activeSelections[group.id] === option
                                                            ? 'border-orange-500 bg-orange-500 text-white py-0.5 pr-[3px] pl-[3px]'
                                                            : 'border-gray-400 bg-white text-black py-1 px-4'}`}
                                                        style={{
                                                            letterSpacing: "-0.04em"
                                                        }}
                                                    >
                                                        {activeSelections[group.id] === option ? <Check className='h-20px w-20px' /> : option}
                                                        {activeSelections[group.id] === option &&
                                                            <div className='bg-white text-[#333333] font-bold text-[12px] p-4 py-1'>
                                                                {option}
                                                            </div>}
                                                    </button>
                                                )
                                            );
                                        })}

                                    </div>
                                </div>)}
                        </div>
                        <div className='text-[12px] font-bold text-[#DE4A53] flex gap-2 items-center mt-5'>
                            Panduan Ukuran
                            <img src='/icon/right.svg' />
                        </div>
                    </div>
                </div>
            </div>


            <ImageLightbox
                isOpen={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
                images={allImages}
                initialIndex={lightboxInitialIndex}
            />
        </>
    );
};

export default ProductDetail;