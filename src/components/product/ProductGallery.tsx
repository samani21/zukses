import { Image, Video } from 'lucide-react';
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
    videoProduct: Thumbnail[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, activeIndex, setActiveIndex, onImageClick, videoProduct }) => {
    const thumbnailContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const [previewVideo, setPreviewVideo] = useState<boolean>(false);
    console.log(videoProduct)
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
        <div className="lg:col-span-2 w-full md:px-0">
            <div className="mb-2 relative group overflow-hidden w-full max-w-[450px] mx-auto">
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
                    {previewVideo ? videoProduct.map((media, index) => (
                        <div key={index} className="flex-shrink-0 w-full" style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
                            <video
                                src={media.url}
                                controls
                                className="w-full md:w-[450px] h-full md:h-[450px] object-cover shadow-sm select-none max-h-[450px]"
                            />
                        </div>
                    )) : images.map((media, index) => (
                        <div key={media.id} className="flex-shrink-0 w-full" style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
                            <img
                                src={media.url}
                                alt={media.alt}
                                className="w-full md:w-[450px] h-full md:h-[450px] object-cover shadow-sm select-none"
                                onClick={() => !isDragging && dragOffset === 0 && onImageClick(index)}
                            />
                        </div>
                    ))}
                </div>
                {!previewVideo && <>
                    <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Gambar sebelumnya">
                        <ChevronLeftIcon className="w-8 h-8" />
                    </button>
                    <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Gambar berikutnya">
                        <ChevronRightIcon className="w-8 h-8" />
                    </button>
                </>}
            </div>

            <div className="relative">
                <div ref={thumbnailContainerRef} className="flex space-x-1 overflow-x-auto p-1 scroll-smooth no-scrollbar">
                    {previewVideo ? videoProduct.map((thumb, index) => (
                        <button
                            key={thumb.id}
                            onClick={() => setActiveIndex(index)}
                            className={`flex-shrink-0 w-[20%] border-2  transition-colors ${activeIndex === index ? 'border-[#F77000]' : 'border-transparent'}`}
                        >
                            <video
                                src={thumb.url}
                                className="w-full h-auto object-cover"
                                muted
                                playsInline
                            />
                        </button>
                    )) : images.map((thumb, index) => (
                        <button
                            key={thumb.id}
                            onClick={() => setActiveIndex(index)}
                            className={`flex-shrink-0 w-[20%] border-2  transition-colors ${activeIndex === index ? 'border-[#F77000]' : 'border-transparent'}`}
                        >
                            <img
                                src={thumb.url.replace('600x400', '100x100')}
                                alt={thumb.alt}
                                className="w-full h-auto"
                            />
                        </button>
                    ))}
                </div>
                {
                    videoProduct?.length > 0 &&
                    <div className="text-center mt-2 px-2 md:px-0">
                        <button
                            onClick={() => {
                                setPreviewVideo(!previewVideo)
                                setActiveIndex(0)
                            }}
                            className="bg-[#4A52B2] h-[50px] text-white md:h-[40px] w-full border border-[#563D7C]/50 md:bg-[#F6E9F0] text-[16px] md:text-[14px] font-semibold md:text-[#563D7C] px-4 py-2 hover:bg-purple-200 transition flex items-center justify-center gap-2"
                        >

                            {previewVideo ? <Image className='w-[20px]  md:hidden' /> : <Video className='w-[20px]  md:hidden' />}
                            <span>{previewVideo ? "Lihat Gambar" : "Lihat Video"}</span>
                        </button>
                    </div>
                }


                <div className="hidden md:flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-4 text-[#4A52B2]">
                    <div className="text-[14px] font-bold text-center sm:text-left">Bagikan Link</div>
                    <div className="text-[15px] font-bold flex items-center justify-center sm:justify-end gap-2">
                        <img src="/icon/favorit.svg" width={30} height={28} alt="favorit" />
                        <span>Tambahkan ke Favorit (27)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductGallery;
