import React, { useMemo, useState, useEffect, useRef } from 'react';
import ProductGallery from './ProductGallery';
import ImageLightbox from './ImageLightbox';
import { Media, Product, Thumbnail, variant } from 'components/types/Product';
import { Check, ChevronRightIcon, MinusCircle, PlusCircle, Star } from 'lucide-react';
import { formatRupiahNoRP } from 'components/Rupiah';
import { useRouter } from 'next/router';
const ShoppingCartIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
);

const StarIcon = ({ className = "w-3.5 h-3.5 text-yellow-400" }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);
interface ProductDetailProps {
    product: Product;
    openModalGuide: boolean;
    setOpenModalGuide: (value: boolean) => void;
    titleRef: React.RefObject<HTMLHeadingElement | null>;
}



const ProductDetail: React.FC<ProductDetailProps> = ({ product, setOpenModalGuide, titleRef }) => {
    const [activeVariant, setActiveVariant] = useState<variant | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [quantity, setQuantity] = useState<number>(1);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0);
    const router = useRouter()
    const [activeSelections, setActiveSelections] = useState<Record<number, string>>({});
    const [activeSelectionsArray, setActiveSelectionsArray] = useState<
        { groupId: string; name: string; value: string }[]
    >([]);
    const [expanded, setExpanded] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const descRef = useRef<HTMLDivElement>(null);
    const detailContainerRef = useRef<HTMLDivElement>(null); // Ref untuk seluruh kontainer detail.
    const galleryRef = useRef<HTMLDivElement>(null);

    // STATE: Untuk mengontrol posisi galeri.
    const [isSticky, setIsSticky] = useState(false); // Apakah galeri sedang melayang?
    const [isAtBottom, setIsAtBottom] = useState(false); // Apakah galeri sudah mentok di bawah?

    useEffect(() => {
        const handleScroll = () => {
            if (!detailContainerRef.current || !galleryRef.current) return;

            const detailRect = detailContainerRef.current.getBoundingClientRect();
            const galleryHeight = galleryRef.current.offsetHeight;
            const topOffset = 20;

            const bottomLimit = detailRect.bottom - galleryHeight - topOffset;

            // Kapan mulai sticky
            setIsSticky(detailRect.top <= topOffset);

            // Kapan berhenti sticky (saat akan menabrak elemen di bawah kontainer detail)
            setIsAtBottom(bottomLimit <= 0);
        };

        // Daftarkan event listener saat komponen pertama kali dirender.
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Hapus event listener saat komponen dihancurkan untuk mencegah memory leak.
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const galleryContainerStyle: React.CSSProperties = useMemo(() => {
        if (isAtBottom) {
            return {
                position: 'absolute',
                bottom: '0px',
            };
        }
        if (isSticky) {
            return {
                position: 'fixed',
                top: '150px',
            };
        }
        return {
            position: 'relative',
        };
    }, [isSticky, isAtBottom]);

    useEffect(() => {
        if (descRef.current) {
            const lineHeight = parseFloat(getComputedStyle(descRef.current).lineHeight || '24');
            const maxHeight = lineHeight * 6;
            setShowButton(descRef.current.scrollHeight > maxHeight);
        }
    }, [product?.desc]);
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
    const allMedia = useMemo(() => {
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
        product?.media?.forEach((m, i) => {
            if (/\.(mp4|webm|ogg)$/i.test(m.url)) {
                imageMap.set(m.url, {
                    id: m.id ?? 1000 + i,
                    url: m.url,
                    alt: 'Video produk',
                    type: 'video'
                });
            }
        });

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
            return null;
        }

        const prices = product.variants
            .map(v => v.discount_price)
            .filter(price => price > 0); // Hanya ambil harga diskon > 0

        if (prices.length === 0) {
            return null; // Tidak ada harga diskon yang valid
        }

        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        return {
            min: minPrice,
            max: maxPrice,
            isRange: minPrice !== maxPrice
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
            return formatRupiah(activeVariant.discount_price || activeVariant?.price);
        }
        if (priceDiscountRange) {
            if (priceDiscountRange.isRange) {
                return `${formatRupiah(priceDiscountRange.min)} - ${formatRupiah(priceDiscountRange.max)}`;
            }
            return formatRupiah(priceDiscountRange.min);
        }

        return formatRupiah(product?.price);
    };
    const ProductStock = () => {
        if (activeVariant) {
            return activeVariant?.stock;
        }

        return product?.stock;
    };

    const renderPriceDiscountDisplayMobile = () => {
        if (activeVariant) {
            return <p>Rp <span className='text-[27px]'>{formatRupiahNoRP(activeVariant.discount_price || activeVariant?.price)}</span></p>;
        }
        if (priceDiscountRange) {
            if (priceDiscountRange.isRange) {
                return <p>Rp <span className='text-[27px]'>{formatRupiahNoRP(priceDiscountRange.min)}</span> </p>
            }
            return <p>Rp <span className='text-[27px]'>{formatRupiahNoRP(priceDiscountRange.min)}</span></p>;
        }

        return <p>Rp <span className='text-[27px]'>{formatRupiahNoRP(product?.price)}</span></p>;
    };

    // Letakkan ini di dalam komponen ProductDetail, setelah blok useMemo
    const handleViewVideo = () => {
        // Pastikan ada video sebelum mencoba membukanya
        if (videoProduct && videoProduct.length > 0) {
            const videoUrl = videoProduct[0].url; // Ambil video pertama
            console.log("Membuka video:", videoUrl);
            window.open(videoUrl, '_blank'); // Buka video di tab baru
        } else {
            console.warn("Tidak ada video yang bisa ditampilkan.");
        }
    };


    const handleBuyNow = () => {
        // Cek jika produk memiliki varian
        if (product.variants && product.variants.length > 0) {
            // Cek jika varian aktif sudah terpilih (artinya semua opsi sudah diisi)
            if (activeVariant) {
                console.log("Membeli Varian:", {
                    variantId: activeVariant.id,
                    details: activeVariant,
                    quantity: quantity
                });
                router?.push(`/checkout?variant_id[]=${activeVariant.id}&qty[]=${quantity}&product_id[]=${product?.id}`)
            } else {
                // Jika varian belum lengkap terpilih
                alert("Silakan lengkapi semua pilihan varian terlebih dahulu.");
            }
        } else {
            // Jika produk tidak punya varian
            router?.push(`/checkout?qty[]=${quantity}&product_id[]=${product?.id}`)
        }
    };

    const highestDiscountVariant = useMemo(() => {
        if (!product?.variants || product?.variants.length === 0) return null;

        return product?.variants.reduce((max, variant) => {
            const currentDiscount = parseFloat(String(variant.discount_percent) ?? "0");
            const maxDiscount = parseFloat(String(max.discount_percent) ?? "0");
            return currentDiscount > maxDiscount ? variant : max;
        });
    }, [product?.variants]);
    function formatLocation(location: string) {
        return location
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    const hasImageGuide = !!product?.media?.some((item: Media) => item.type === 'image_guide');

    return (
        <div ref={detailContainerRef} className="relative">
            <div className=" text-sm">
                <div className="grid grid-cols-12 md:flex gap-6">
                    <div className='min-w-[420px]' >
                        <div ref={galleryRef} style={galleryContainerStyle}>
                            <ProductGallery
                                images={allImages}
                                videoProduct={videoProduct}
                                activeIndex={activeImageIndex}
                                setActiveIndex={setActiveImageIndex}
                                onImageClick={handleImageClick}
                                product={product}
                            />
                        </div>
                    </div>
                    <div className="hidden md:block lg:col-span-4 space-y-[16px] pl-4 ">
                        <h1 ref={titleRef} className="text-[22px] font-[700] text-[#333333] tracking-[-0.02em]" style={{
                            lineHeight: "28px",
                        }}>
                            {product?.name}
                        </h1>
                        {/* <div className=" flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-xs">
                            <div className='bg-[#4A52B2] flex items-center px-6 py-2 gap-6'>
                                <div className=" flex items-center">
                                    <span className="text-blue-500 font-medium mr-1">{product?.rating?.toFixed(1)}</span>
                                    <div className="flex items-center"><span className='text-[16px] font-bold text-white mr-2'>4.9</span>{Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} />)}</div>
                                </div>
                                <span className="text-[14px] text-white"><span className='text-[16px] font-bold text-white mr-2'>{product?.reviewsCount || '1.8Rb'}</span> Penilaian</span>
                                <span className="text-[14px] text-white"><span className='text-[16px] font-bold text-white mr-2'>{product?.soldCount || '3Rb+'}</span> Terjual</span>
                            </div>
                        </div> */}
                        <div>
                            <div className="space-y-2 mt-6">
                                {/* <span className="text-gray-500 text-sm line-through">{formatRupiah(product?.originalPrice || 100000)}</span> */}

                                <div className='inline-block px-[15px] py-[8px] text-[30px] font-[800]  text-[#F94D63] rounded-full border-4 border-[#F94D6380]/50 h-[52px]'>
                                    <p className='leading-none'>{renderPriceDiscountDisplay()}</p>
                                </div>


                                {highestDiscountVariant && renderPriceDiscountDisplay() != renderPriceDisplay() && (
                                    <div className='flex items-center gap-4 mt-8'>
                                        <div className=''>
                                            <span className='bg-[#FAD7D7] border border-[#F02929] text-[#F02929] rounded-[5px] px-[8px] py-[4px] text-[14px] font-bold'>Diskon: {highestDiscountVariant.discount_percent}%</span>
                                        </div>
                                        <div className="text-[#888888] text-[18px] font-[400] line-through tracking-[-0.02em]">{renderPriceDisplay()}</div>
                                    </div>
                                )}

                            </div>
                            {/* <div className='space-y-1' style={{
                                letterSpacing: "-0.04em"
                            }}>
                                <p className='text-[#F77000] text-[14px] font-bold'>COD (Bayar ditempat)</p>
                                <div className='flex text-[#222222] items-center font-semibold text-[12px] gap-2'>
                                    <div className='bg-[#CFE3BE] rounded-[5px] p-2'>
                                        Diskon Terpakai 20%
                                    </div>
                                    <div className='bg-[#F0E65F] rounded-[5px] p-2'>
                                        Gratis Ongkir Rp10.000
                                    </div>
                                    <div className='bg-[#D7FFEB] rounded-[5px] p-2'>
                                        Voucher Toko Rp.20.000
                                    </div>
                                </div>
                            </div> */}
                        </div>
                        <div className='bg-[#F1F5F9] h-[54px] border border-[#DADBDB] rounded-[10px] grid grid-cols-7 items-center px-6 gap-4'>
                            <div className='col-span-3 space-y-1 tracking-[0] border-r border-[#CCCCCC] py-1' style={{
                                lineHeight: "100%"
                            }}>
                                <p className='text-[#555555] text-[12px]'>
                                    DIkirim dari
                                </p>
                                <p className='text-[14px] font-semibold text-[#06894E]'>
                                    {formatLocation(product?.seller?.location)}
                                </p>
                            </div>
                            <div className='col-span-2 space-y-1 pt-1 border-r border-[#CCCCCC]'>
                                <p className='text-[#555555] text-[12px] font-semibold tracking-[0]' style={{
                                    lineHeight: "100%"
                                }}>
                                    Penilaian :
                                </p>
                                <div className='flex items-start'>
                                    <StarIcon className='w-[24px] text-[#F74B00]' />
                                    <div className='flex items-center gap-1 -mt-0.5'>
                                        <p className='font-bold text-[16px] text-[#333] tracking-[-0.02em]'>0/5</p>
                                        <p className='text-[12px] text-[#888888] tracking-[-0.03em]'>(0 Ulasan)</p>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-center pt-1 '>
                                <div>
                                    <p className='text-[#555555] text-[12px] font-semibold tracking-[0]' style={{
                                        lineHeight: "100%"
                                    }}>
                                        Terjual
                                    </p>
                                    <p className='text-[#111111] text-[16px] font-bold'>
                                        0
                                    </p>
                                </div>
                            </div>
                            <div className='flex justify-center px-4 pt-1 border-l border-[#CCCCCC]'>
                                <div>
                                    <p className='text-[#555555] text-[12px] font-semibold tracking-[0]' style={{
                                        lineHeight: "100%"
                                    }}>
                                        Stok
                                    </p>
                                    <p className='text-[#111111] text-[16px] font-bold'>
                                        15
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* <div className="flex gap-12 mb-2">
                            <span className="text-[#555555] text-[16px]  font-medium">Kondisi</span>
                            <span className="text-[#4A52B2] text-[16px] font-bold">{product?.is_used ? "Bekas dipakai" : "Baru"}</span>
                        </div> */}
                        {
                            product?.voucher || product?.delivery.subsidy ?
                                <div className='py-2 flex items-center gap-2'>
                                    {
                                        product?.voucher &&
                                        <div className=''>
                                            <span className='bg-[#C8F7D4] h-[25px]  border border-[#388F4F] text-[#388F4F] rounded-[5px] px-[8px] py-[4px] text-[14px] font-bold'>Voucher {formatRupiah(product?.voucher)}</span>
                                        </div>
                                    }
                                    {
                                        product?.delivery.subsidy &&
                                        <div className=''>
                                            <span className='bg-[#FFF9BF]  h-[25px] border border-[#F77000] text-[#F77000] rounded-[5px] px-[8px] py-[4px] text-[14px] font-bold'>Gratis Ongkir    {formatRupiah(product?.delivery.subsidy)}</span>
                                        </div>
                                    }
                                </div>
                                : ''
                        }
                        <div className='space-y-2 -mt-2'>
                            {
                                Number(product?.is_cod_enabled) == 1 && <p className='text-[#F77000] font-bold text-[15px] '>COD (Bayar ditempat)</p>
                            }
                            <p className='tracking-[-0.02em] text-[#555555] text-[14px]'>Kondisi <span className='text-[#1073F7] font-bold'>{Number(product?.is_used) ? 'Bekas Dipakai' : "Baru"}</span></p>
                            <div className="space-y-2">
                                {product?.variant_prices.map((group) =>
                                    <div key={group.id} className='space-y-2 w-[50%]'>
                                        <p className="text-[#555555] text-[14px] font-medium tracking-[-0.02em]">
                                            Pilih <span className="text-[#09824C] font-bold ">{group.variant}</span>
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {group?.options.map((option, idx) => {
                                                return (
                                                    option !== "" && (
                                                        <button
                                                            key={idx}
                                                            onClick={() => {
                                                                const newSelections = {
                                                                    ...activeSelections,
                                                                    [group.id]: option
                                                                };

                                                                const existingIdx = activeSelectionsArray.findIndex(sel => sel.groupId === String(group.id));

                                                                const updatedSelections = [...activeSelectionsArray];

                                                                const newSelection = {
                                                                    groupId: String(group.id),
                                                                    name: group.variant, // contoh: "Warna" atau "Ukuran"
                                                                    value: option         // contoh: "Hitam - Abu" atau "XL"
                                                                };

                                                                if (existingIdx > -1) {
                                                                    updatedSelections[existingIdx] = newSelection;
                                                                } else {
                                                                    updatedSelections.push(newSelection);
                                                                }

                                                                setActiveSelectionsArray(updatedSelections);
                                                                setActiveSelections(newSelections);

                                                                // Cek apakah semua kombinasi sudah dipilih
                                                                const selectedLabels = Object.values(newSelections).join(" - ");

                                                                const matchedVariant = product?.variants?.find((v) =>
                                                                    v.combination_label === selectedLabels
                                                                );

                                                                if (matchedVariant) {
                                                                    handleVariantSelect(matchedVariant);
                                                                }
                                                            }}

                                                            className={`border text-[14px] font-[500] h-[35px] flex items-center transition-all  ${activeSelections[group.id] === option
                                                                ? 'border-none text-white '
                                                                : 'border-[#bbb] bg-white text-black py-1 px-4'}`}
                                                            style={{
                                                                letterSpacing: "-0.04em"
                                                            }}
                                                        >
                                                            {activeSelections[group.id] === option ?
                                                                <div className='bg-[#09824C] h-[35px] flex items-center px-2 border border-[#09824C]'>
                                                                    <Check className='h-[20px] w-[20px]' />
                                                                </div> : option}
                                                            {activeSelections[group.id] === option &&
                                                                <span className="bg-[#C4EDDD] text-[#333333] font-bold text-[14px] border border-[#09824C]  h-[35px] flex items-center px-4">
                                                                    {option}
                                                                </span>}
                                                        </button>
                                                    )
                                                );
                                            })}


                                        </div>
                                        {/* <div className="mt-1 text-end">
                                        <button className="text-[#4A52B2] text-[16px] font-bold text-right">Lihat Lebih Banyak</button>
                                    </div> */}
                                    </div>)}

                                {hasImageGuide &&
                                    <div className='text-[16px] mt-6 font-bold text-[#DE4A53] flex gap-1 items-center cursor-pointer' onClick={() => setOpenModalGuide(true)}>
                                        Lihat Panduan Ukuran
                                        <ChevronRightIcon />
                                    </div>
                                }
                                {activeSelectionsArray.length > 0 && (
                                    <div className="tracking-[-0.02em] -mt-2 text-[16px]" style={{
                                        lineHeight: "150%"
                                    }}>
                                        <p className='text-[#555555] font-medium'>Variasi yang dipilih :</p>
                                        <p className='font-bold text-[#09824C]'>{activeSelectionsArray.map(sel => `${sel.name} ${sel.value}`).join(', ')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid md:flex items-center gap-4 ">
                            <span className="text-[16px] font-[500] text-[#555555] tracking-[-0.02em]">Kuantitas</span>
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className=" hover:bg-gray-100"
                            >
                                <MinusCircle size={32} strokeWidth={2} color='#888888' />
                            </button>
                            <input
                                value={quantity}
                                readOnly
                                className="w-[20px] font-bold text-[21px] text-center"
                            />
                            <button
                                onClick={() => setQuantity(q => q + 1)}
                                className="py-1 text-sm sm:text-base text-gray-600 hover:bg-gray-100"
                                disabled={quantity >= ProductStock()}
                            >
                                <PlusCircle size={32} color='#3EA65A' strokeWidth={2} />
                            </button>
                            <span className="text-[18px] font-[500] text-[#555555]">Tersedia {ProductStock()}</span>
                        </div>
                        <div className='tracking-[-0.02em]' style={{
                            lineHeight: "160%"
                        }}>
                            <p className='text-[22px] font-bold pb-4'>Deskripsi Produk</p>
                            <div>
                                <div
                                    ref={descRef}
                                    className={`${expanded ? '' : 'line-clamp-6'} text-[#000000] text-[14px] tracking-[-0.02em]`}
                                    style={{
                                        lineHeight: "160%"
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: product?.desc.replace(/\r?\n/g, '<br />'),
                                    }}
                                />
                                {showButton && (
                                    <button
                                        className="mt-2 text-[16px] text-[#09824C] font-bold"
                                        onClick={() => setExpanded(prev => !prev)}
                                    >
                                        {expanded ? 'Lihat lebih sedikit' : 'Lihat lebih banyak'}
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="mt-2 hidden sm:flex items-center gap-3 " style={{
                            lineHeight: "22px",
                            letterSpacing: "-0.04em"
                        }}>
                            <button className="mt-[5px] w-[240px] h-[50px] rounded-[10px]  py-2 px-3 bg-[#E7F2FF] text-[#1073F7] text-[16px] font-bold flex items-center justify-center gap-2 hover:bg-[#ccb5c1]/50">
                                <ShoppingCartIcon className='w-[24px] h-[24px]' />
                                <span>Masukkan Keranjang</span>
                            </button>
                            <button onClick={handleBuyNow} className="w-[240px] bg-[#1073F7] h-[50px] rounded-[10px]  py-2 px-3 text-white text-[16px] font-bold  flex items-center justify-center gap-2 hover:bg-[#10316e]/80">
                                <span>Beli Sekarang</span>
                            </button>
                        </div>
                        <div className='bg-[#F1F5F9] rounded-[10px] h-[94px] mt-6'>
                            <div className='flex justify-between items-center  p-3 px-4'>
                                <div className='flex items-center gap-4'>
                                    <img className='border border-[#BBBBBB] rounded-full w-[50px] h-[50px] bg-white' src={product?.seller?.avatarUrl} />
                                    <div>
                                        <p className='text-[#333333] font-bold text-[17px] tracking-[-0.02em]'>
                                            {product?.seller?.name}
                                        </p>
                                        <div className='flex items-end gap-2'>
                                            <Star size={32} strokeWidth={"2px"} color='#F74B00' />
                                            <p className='tracking-[-0.02em] text-[#333333] font-bold text-[17px]'>4.9/5</p>
                                            <p className='tracking-[-0.03em] text-[#888888] text-[14px] '>(150 Ulasan)</p>
                                        </div>
                                    </div>
                                </div>
                                <div className=''>
                                    <p className='text-[#06894E] text-[17px] tracking-[-0.02em] font-bold'>Produk</p>
                                    <p className='text-[#333333] text-[17px] text-left tracking-[-0.02em] font-bold'>284</p>
                                </div>
                                <div className='p-3 px-6  flex items-center justify-center gap-4  '>
                                    <button className='bg-[#C4EDDD] h-[40px] px-8 rounded-[10px] text-[14px] font-bold text-[#09824C]' style={{
                                        lineHeight: "22px"
                                    }}>
                                        Chat Penjual
                                    </button>
                                    <button className='bg-[#09824C] h-[40px] px-8 rounded-[10px] text-[14px] font-bold text-[#fff]' style={{
                                        lineHeight: "22px"
                                    }}>
                                        Kunjungi Toko
                                    </button>
                                </div>
                            </div>
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
                images={allMedia}
                productName={product?.name || "Detail Produk"} // 👈 Tambahkan nama produk
                initialIndex={lightboxInitialIndex}
                // 👇 Hubungkan fungsi handleViewVideo, hanya jika ada video
                onViewVideo={videoProduct.length > 0 ? handleViewVideo : undefined}
            />
        </div>
    );
};

export default ProductDetail;