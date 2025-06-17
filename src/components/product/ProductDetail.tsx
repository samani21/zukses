import React, { useMemo, useState } from 'react';
import ProductGallery from './ProductGallery';
import ImageLightbox from './ImageLightbox';

const ShoppingCartIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
);

const StarIcon = ({ className = "w-3.5 h-3.5 text-orange-400" }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const ChatBubbleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.195-.883.078-1.707-.126-2.427-.465a4.903 4.903 0 0 1-1.574-1.296c-.443-.534-.928-1.035-1.428-1.49a4.897 4.897 0 0 0-2.12.14c-1.018.41-2.13.256-3.005-.442a4.897 4.897 0 0 1-1.427-1.49c-.443-.534-.928-1.035-1.428-1.49a4.897 4.897 0 0 0-2.12.14c-1.018.41-2.13.256-3.005-.442a4.903 4.903 0 0 1-1.574-1.296C.847 15.1 0 14.136 0 13v-4.286c0-.97.616-1.813 1.5-2.097C3.426 6.166 5.208 6 7 6h10c1.792 0 3.574.166 5.25.511Z" />
    </svg>
);

interface Thumbnail {
    id: number;
    url: string;
    alt: string;
}

interface Variant {
    id: number;
    name: string;
    imageUrl: string;
}

interface Product {
    id: string;
    name: string;
    rating: number;
    reviewsCount: number;
    soldCount: number;
    originalPrice: number;
    discountedPrice: number;
    vouchers: string[];
    variants: Variant[];
    thumbnails: Thumbnail[];
}

interface ProductDetailProps {
    product: Product;
}

const MobileActionFooter: React.FC = () => {
    return (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white shadow p-2 flex items-center space-x-2 z-20 text-sm">
            <button className="p-1 border border-gray-300 rounded-md">
                <ChatBubbleIcon />
            </button>
            <button className="flex-1 py-2 px-3 rounded-md text-blue-600 border border-blue-600 hover:bg-blue-50 font-medium">Beli</button>
            <button className="flex-1 py-2 px-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium">+ Keranjang</button>
        </div>
    );
};

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
    const [activeVariant, setActiveVariant] = useState<Variant>(product.variants[0]);
    const [activeImage, setActiveImage] = useState<string>(product.variants[0].imageUrl);
    const [quantity, setQuantity] = useState<number>(1);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0);

    const allImages = useMemo(() => {
        const imageMap = new Map<string, Thumbnail>();
        product.variants.forEach((v, i) => imageMap.set(v.imageUrl, { id: 1000 + i, url: v.imageUrl, alt: v.name }));
        product.thumbnails.forEach((t) => imageMap.set(t.url, t));
        return Array.from(imageMap.values());
    }, [product.variants, product.thumbnails]);

    const handleVariantSelect = (variant: Variant) => {
        setActiveVariant(variant);
        setActiveImage(variant.imageUrl);
    };

    const handleImageClick = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 1024) return;
        const currentIndex = allImages.findIndex(img => img.url === activeImage);
        setLightboxInitialIndex(currentIndex);
        setIsLightboxOpen(true);
    };


    const handleNextImage = () => {
        const currentIndex = allImages.findIndex(img => img.url === activeImage);
        const nextIndex = (currentIndex + 1) % allImages.length;
        setActiveImage(allImages[nextIndex].url);
    };

    const handlePrevImage = () => {
        const currentIndex = allImages.findIndex(img => img.url === activeImage);
        const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
        setActiveImage(allImages[prevIndex].url);
    };
    const formatRupiah = (amount: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);

    return (
        <>
            <div className="bg-white rounded-lg p-0 sm:p-4 mb-24 sm:mb-0 text-sm">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <ProductGallery
                        images={allImages}
                        activeImage={activeImage}
                        onImageSelect={setActiveImage}
                        onImageClick={handleImageClick}
                        onNextImage={handleNextImage}
                        onPrevImage={handlePrevImage}
                    />
                    <div className="lg:col-span-3">
                        <h1 className="text-base sm:text-lg font-semibold text-gray-800">{product.name}</h1>
                        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-xs">
                            <div className="flex items-center">
                                <span className="text-orange-500 font-medium mr-1">{product.rating.toFixed(1)}</span>
                                <div className="flex">{Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} />)}</div>
                            </div>
                            <span className="font-medium">{product.reviewsCount} Penilaian</span>
                            <span className="text-gray-500">{product.soldCount} Terjual</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md my-3">
                            <div className="flex items-baseline space-x-2">
                                <span className="text-gray-500 text-sm line-through">{formatRupiah(product.originalPrice)}</span>
                                <span className="text-orange-600 text-xl font-semibold">{formatRupiah(product.discountedPrice)}</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="grid md:flex items-start">
                                <span className="w-24 text-gray-500">Voucher</span>
                                <div className="flex flex-wrap gap-1 mt-2 md:mt-0">
                                    {product.vouchers.map(v => (
                                        <span key={v} className="bg-orange-100 text-orange-600 text-xs px-2 py-[2px] rounded">{v}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="grid md:flex items-start">
                                <span className="w-24 text-gray-500">Pilihan</span>
                                <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                                    {product.variants.map(v => (
                                        <button key={v.id} onClick={() => handleVariantSelect(v)} className={`px-3 py-1 rounded text-xs border ${activeVariant.id === v.id ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-300'}`}>
                                            {v.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid md:flex items-center">
                                <span className="w-24 text-gray-500">Kuantitas</span>
                                <div className="flex items-center border border-gray-300 rounded overflow-hidden w-fit">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="px-3 py-1 text-sm sm:text-base text-gray-600 hover:bg-gray-100"
                                    >
                                        -
                                    </button>
                                    <input
                                        value={quantity}
                                        readOnly
                                        className="w-8 sm:w-10 text-center border-l border-r border-gray-300 text-xs sm:text-sm"
                                    />
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="px-3 py-1 text-sm sm:text-base text-gray-600 hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>

                            </div>
                        </div>
                        <div className="mt-6 hidden sm:grid grid-cols-2 gap-3">
                            <button className="w-full py-2 px-3 rounded bg-orange-100 text-orange-600 border border-orange-500 hover:bg-orange-200 flex items-center justify-center gap-1 text-sm">
                                <ShoppingCartIcon />
                                <span>Keranjang</span>
                            </button>
                            <button className="w-full py-2 px-3 rounded bg-orange-600 text-white hover:bg-orange-700 text-sm font-medium">Beli Sekarang</button>
                        </div>
                    </div>
                </div>
            </div>

            <MobileActionFooter />

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
