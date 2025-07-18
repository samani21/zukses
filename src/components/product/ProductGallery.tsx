import React, { useRef, useState } from 'react';

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
    activeIndex: number;
    setActiveIndex: (index: number) => void;
    onImageClick: (index: number) => void;
}

const isVideo = (url: string): boolean => {
    return url.match(/\.(mp4|webm|ogg)$/i) !== null;
};

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, activeIndex, setActiveIndex, onImageClick }) => {
    const thumbnailContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);

    const handleNext = () => {
        setActiveIndex((activeIndex + 1) % images.length);
    };

    const handlePrev = () => {
        setActiveIndex((activeIndex - 1 + images.length) % images.length);
    };

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true);
        setDragStart('touches' in e ? e.touches[0].clientX : e.clientX);
        setDragOffset(0);
        e.preventDefault();
    };

    const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging) return;
        const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        setDragOffset(currentX - dragStart);
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        const swipeThreshold = 50;
        if (dragOffset < -swipeThreshold) {
            handleNext();
        } else if (dragOffset > swipeThreshold) {
            handlePrev();
        }
        setDragOffset(0);
    };

    return (
        <div className="lg:col-span-2">
            <div className="mb-4 relative group overflow-hidden w-[450px]">
                <div
                    onClick={() => {
                        window.location.href = '/'
                        localStorage.removeItem('product')
                    }}
                    className="flex items-center justify-center w-10 h-10 absolute top-2 left-2 z-20 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow md:hidden"
                >
                    <ChevronLeftIcon />
                </div>
                <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                    onMouseMove={handleDragMove}
                    onTouchMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchEnd={handleDragEnd}
                >
                    {images.map((media, index) => (
                        <div key={media.id} className="flex-shrink-0 w-full" style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
                            {isVideo(media.url) ? (
                                <video
                                    src={media.url}
                                    controls
                                    className=" w-[450px] h-[450px] object-cover shadow-sm select-none"
                                />
                            ) : (
                                <img
                                    src={media.url}
                                    alt={media.alt}
                                    className=" w-[450px] h-[450px] object-cover shadow-sm select-none"
                                    onClick={() => !isDragging && dragOffset === 0 && onImageClick(index)}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Gambar sebelumnya">
                    <ChevronLeftIcon className="w-8 h-8" />
                </button>
                <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Gambar berikutnya">
                    <ChevronRightIcon className="w-8 h-8" />
                </button>
            </div>

            <div className="relative">
                <button onClick={() => thumbnailContainerRef.current?.scrollBy({ left: -100, behavior: 'smooth' })} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 z-10 shadow-md">
                    <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
                </button>
                <div ref={thumbnailContainerRef} className="flex space-x-2 overflow-x-auto p-1 scroll-smooth no-scrollbar">
                    {images.map((thumb, index) => (
                        <button
                            key={thumb.id}
                            onClick={() => setActiveIndex(index)}
                            className={`flex-shrink-0 w-1/5 rounded-md border-2 p-1 transition-colors ${activeIndex === index ? 'border-blue-500' : 'border-transparent'}`}
                        >
                            {isVideo(thumb.url) ? (
                                <video
                                    src={thumb.url}
                                    className="w-full h-auto rounded object-cover"
                                    muted
                                    playsInline
                                />
                            ) : (
                                <img
                                    src={thumb.url.replace('600x400', '100x100')}
                                    alt={thumb.alt}
                                    className="w-full h-auto rounded"
                                />
                            )}
                        </button>
                    ))}
                </div>
                <button onClick={() => thumbnailContainerRef.current?.scrollBy({ left: 100, behavior: 'smooth' })} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 z-10 shadow-md">
                    <ChevronRightIcon className="w-6 h-6 text-gray-700" />
                </button>
            </div>
        </div>
    );
};

export default ProductGallery;