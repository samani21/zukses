import React, { useMemo, useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Product, Thumbnail, variant } from 'components/types/Product';
import { formatRupiah, formatRupiahNoRP } from 'components/Rupiah';

interface VariantModalProps {
    product: Product;
    setIsModalOpen: (value: boolean) => void;
}

const VariantModal: React.FC<VariantModalProps> = ({ product, setIsModalOpen }) => {
    const [activeSelections, setActiveSelections] = useState<Record<number, string>>({});
    const [activeVariant, setActiveVariant] = useState<variant | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [displayImage, setDisplayImage] = useState<string>(product?.image);
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);
    const priceDiscountRange = useMemo(() => {
        if (!product?.variants || product.variants.length === 0) {
            return null;
        }
        const prices = product.variants.map(v => v.discount_price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        return { min: minPrice, max: maxPrice, isRange: minPrice !== maxPrice };
    }, [product?.variants]);

    const priceRange = useMemo(() => {
        if (!product?.variants || product.variants.length === 0) {
            return null;
        }
        const prices = product.variants.map(v => v.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        return { min: minPrice, max: maxPrice, isRange: minPrice !== maxPrice };
    }, [product?.variants]);

    const allMedia = useMemo(() => {
        const imageMap = new Map<string, Thumbnail>();
        product?.variants?.forEach((v, i) => {
            if (v.image) {
                imageMap.set(v.image, {
                    id: v?.id + i,
                    url: v.image,
                    alt: v.combination_label, // "Merah - M"
                    type: 'image',
                });
            }
        });
        return Array.from(imageMap.values());
    }, [product?.variants]);

    useEffect(() => {
        const selectedOptions = Object.values(activeSelections);

        if (selectedOptions.length === 0) {
            setDisplayImage(product?.image || '/placeholder.png');
            setActiveVariant(null);
            return;
        }

        const bestMatchImage = allMedia.find(media =>
            selectedOptions.every(opt => media.alt.includes(opt))
        );

        if (bestMatchImage) {
            setDisplayImage(bestMatchImage.url);
        }
        const bestMatchVariant = product.variants?.find(v =>
            selectedOptions.every(opt => v.combination_label.includes(opt))
        );

        setActiveVariant(bestMatchVariant || null);

    }, [activeSelections, allMedia, product]);

    const renderPriceDisplayMobile = () => {
        if (activeVariant) {
            return <p>Rp {formatRupiah(activeVariant.price)}</p>;
        }
        if (priceRange) {
            return <p>Rp {formatRupiahNoRP(priceRange.isRange ? priceRange.max : priceRange.min)}</p>;
        }
        return <p>Rp {formatRupiahNoRP(product?.price)}</p>;
    };

    const renderPriceDiscountDisplayMobile = () => {
        if (activeVariant) {
            return <p>Rp <span className='text-[15px]'>{formatRupiahNoRP(activeVariant.discount_price)}</span></p>;
        }
        if (priceDiscountRange) {
            return <p>Rp <span className='text-[15px]'>{formatRupiahNoRP(priceDiscountRange.min)}</span></p>;
        }
        return <p>Rp <span className='text-[15px]'>{formatRupiahNoRP(product?.price)}</span></p>;
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 sm:items-center">
            <div className="bg-white w-full rounded-t-lg sm:rounded-lg sm:max-w-md space-y-4">
                {/* Tombol Close */}
                <div className="flex justify-start items-center gap-2 p-2 text-[#555555] border-b border-[#DFDFDF]">
                    <X size={24} onClick={() => setIsModalOpen(false)} />
                    <p className='text-[16px] font-bold'>Varian Produk</p>
                </div>

                {/* Header Info Produk */}
                <div className="flex items-start gap-2 px-4 pb-4">
                    <div className="relative w-[120px] h-[120px] flex-shrink-0">
                        {displayImage && (
                            <img
                                src={displayImage}
                                alt={activeVariant?.combination_label || product.name}
                                className='w-[120px] h-[120px]'
                            />
                        )}
                    </div>
                    <div className="">
                        <p className='text-[#111111] text-[14px]'>{product?.name}</p>
                        <div className='flex items-center gap-2'>
                            <div className='text-[#CD0030] text-[12px] font-[700]'>
                                {renderPriceDiscountDisplayMobile()}
                            </div>
                            <div className="text-[#333333] text-[12px] font-[400] line-through" style={{
                                lineHeight: "108%"
                            }}>
                                {renderPriceDisplayMobile()}
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            {/* Stok: {activeVariant ? activeVariant.stock : '...'} */}
                        </p>
                        <p className="text-[12px] text-[#333333] font-bold mt-1">
                            Variant Teripilih
                        </p>
                        <p className='text-[#333333] text-[12px]' style={{
                            letterSpacing: "-0.04em"
                        }}>
                            {Object.values(activeSelections).join(' - ')}
                        </p>
                    </div>
                </div>

                {/* Pilihan Varian */}
                {product?.variant_prices.map((group) =>
                    <div key={group.id} className="px-4">
                        <span className="text-[#555555] text-[14px] font-medium">
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
                                            }}
                                            className={` bg-[#FFFFFF] border border-[#BBBBBB] text-[13px] font-[500] flex items-center gap-1  ${activeSelections[group.id] === option
                                                ? 'border-orange-500 bg-orange-500 text-white py-0.5 pr-[3px] pl-[3px]'
                                                : 'border-gray-400 bg-white text-black py-1 px-4'}`}
                                            style={{
                                                letterSpacing: "-0.04em"
                                            }}
                                        >
                                            {activeSelections[group.id] === option ? <Check className='h-20px w-20px' /> : option}
                                            {activeSelections[group.id] === option &&
                                                <div className='bg-white text-[#333333] font-bold text-[13px] p-4 py-1'>
                                                    {option}
                                                </div>}
                                        </button>
                                    )
                                );
                            })}
                        </div>
                    </div>)}

                {/* Bagian Kuantitas */}
                <div className="p-4 flex justify-start gap-4 items-center">
                    <span className="text-[#555555] text-[14px] font-[500]">Kuantitas</span>
                    <div className="flex items-center border border-[#BBBBBB] w-1/2 rounded overflow-hidden justify-between">
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
                </div>

                <div className="flex items-center space-x-2 z-20 text-sm px-4 mb-2" style={{
                    letterSpacing: "-0.04em"
                }}>
                    <button className="h-[40px] rounded-[5px] bg-[#7BAD42] text-white text-[14px]  w-1/4">
                        Chat
                    </button>
                    <button className="h-[40px] rounded-[5px] bg-[#4A52B2] text-white text-[14px]  w-1/2" onClick={() => setIsModalOpen(false)}>
                        + Keranjang
                    </button>
                    <button className="h-[40px] rounded-[5px] bg-[#DE4A53] text-white text-[14px]  w-1/2" onClick={() => setIsModalOpen(false)}>
                        Beli Langsung
                    </button>
                    {/* <button className="flex-1 py-2 px-3 rounded-md text-blue-600 border border-blue-600 hover:bg-blue-50 font-medium">Beli</button>
                <button className="flex-1 py-2 px-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium">+ Keranjang</button> */}
                </div>
            </div>
        </div>
    );
};

export default VariantModal;