import React, { useRef } from 'react';

const ChevronLeftIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

const ChevronRightIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
);


interface Thumbnail {
    id: number;
    url: string;
    alt: string;
}

interface ProductGalleryProps {
    images: Thumbnail[];
    activeImage: string;
    onImageSelect: (url: string) => void;
    onImageClick: () => void;
    onNextImage: () => void;
    onPrevImage: () => void;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
    images,
    activeImage,
    onImageSelect,
    onImageClick,
    onNextImage,
    onPrevImage,
}) => {
    const thumbnailContainerRef = useRef<HTMLDivElement>(null);

    const scrollThumbnails = (direction: 'left' | 'right') => {
        const container = thumbnailContainerRef.current;
        if (container) {
            const scrollAmount = container.clientWidth * 0.8;
            container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="lg:col-span-2">
            <div className="mb-3 relative group">
                {/* Back Button */}
                <div
                    onClick={() => window.location.href = '/'}
                    className="flex items-center justify-center w-10 h-10 absolute top-2 left-2 z-20 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow md:hidden"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </div>


                {/* Navigasi gambar utama */}
                <button onClick={onPrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block">
                    <ChevronLeftIcon className="w-7 h-7" />
                </button>
                <button onClick={onNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block">
                    <ChevronRightIcon className="w-7 h-7" />
                </button>

                <img
                    id="main-product-image"
                    src={activeImage}
                    alt="Gambar produk aktif"
                    className="w-full max-w-md h-auto rounded-md object-cover transition-all duration-300 cursor-pointer mx-auto"
                    onClick={onImageClick}
                />
            </div>

            <div className="relative mt-2">
                <button onClick={() => scrollThumbnails('left')} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 z-10 shadow-md">
                    <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
                </button>
                <div ref={thumbnailContainerRef} className="flex space-x-2 overflow-x-auto p-1 scroll-smooth no-scrollbar">
                    {images.map((thumb) => (
                        <button
                            key={thumb.id}
                            onClick={() => onImageSelect(thumb.url)}
                            className={`flex-shrink-0 w-16 h-16 rounded-md border-2 p-1 transition-colors ${activeImage === thumb.url ? 'border-orange-500' : 'border-transparent'}`}
                        >
                            <img
                                src={thumb.url.replace('600x400', '100x100')}
                                alt={thumb.alt}
                                className="w-full h-full object-cover rounded"
                            />
                        </button>
                    ))}
                </div>
                <button onClick={() => scrollThumbnails('right')} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 z-10 shadow-md">
                    <ChevronRightIcon className="w-5 h-5 text-gray-700" />
                </button>
            </div>
        </div>
    );
};

export default ProductGallery;
