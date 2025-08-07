import { Product } from 'components/types/Product';
import { Star } from 'lucide-react';
import React, { useRef, useState } from 'react';

const ChevronLeftIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

const ChevronRightIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
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
    product: Product;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, activeIndex, setActiveIndex, onImageClick, product }) => {
    const thumbnailContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    // const [previewVideo, setPreviewVideo] = useState<boolean>(false);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const updateArrowVisibility = () => {
        if (!thumbnailContainerRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = thumbnailContainerRef.current;

        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1); // toleransi pixel
    };

    React.useEffect(() => {
        updateArrowVisibility();
        const ref = thumbnailContainerRef.current;
        if (!ref) return;

        ref.addEventListener('scroll', updateArrowVisibility);
        return () => ref.removeEventListener('scroll', updateArrowVisibility);
    }, []);

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
        <div className="lg:col-span-2 w-full md:px-0" >
            <div className="mb-2 relative group overflow-hidden w-full ">
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
                    {/* {previewVideo ? videoProduct.map((media, index) => (
                        <div key={index} className="flex-shrink-0 w-full" style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
                            <video
                                src={media.url}
                                controls
                                className="w-full md:w-[420px] h-full md:h-[420px] rounded-[8px] object-cover shadow-sm select-none max-h-[420px]"
                            />
                        </div>
                    )) : images.map((media, index) => (
                        <div key={media.id} className="flex-shrink-0 w-full" style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
                            <img
                                src={media.url}
                                alt={media.alt}
                                className="w-full md:w-[420px] h-full md:h-[420px] rounded-[8px] object-cover shadow-sm select-none"
                                onClick={() => !isDragging && dragOffset === 0 && onImageClick(index)}
                            />
                        </div>
                    ))} */}

                    {images.map((media, index) => (
                        <div key={media.id} className="flex-shrink-0 w-full" style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
                            <img
                                src={media.url}
                                alt={media.alt}
                                className="w-full md:w-[420px] h-full md:h-[420px] rounded-[8px] object-cover shadow-sm select-none"
                                onClick={() => !isDragging && dragOffset === 0 && onImageClick(index)}
                            />
                        </div>
                    ))}
                </div>
                {/* {!previewVideo && <>
                    <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Gambar sebelumnya">
                        <ChevronLeftIcon className="w-8 h-8" />
                    </button>
                    <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Gambar berikutnya">
                        <ChevronRightIcon className="w-8 h-8" />
                    </button>
                </>} */}
            </div>

            <div className="relative">
                <div
                    ref={thumbnailContainerRef}
                    className="flex space-x-1 overflow-x-auto p-1 scroll-smooth no-scrollbar relative pl-0"
                >
                    {/* {previewVideo ? videoProduct.map((thumb, index) => (
                        <button
                            key={thumb.id}
                            onClick={() => setActiveIndex(index)}
                            className={`flex-shrink-0 w-[20%] border-3 rounded-[8px]  transition-colors ${activeIndex === index ? 'border-[#DE4A53]' : 'border-transparent'}`}
                        >
                            <video
                                src={thumb.url}
                                className="w-full h-auto object-cover rounded-[8px]"
                                muted
                                playsInline
                            />
                        </button>
                    )) : images.map((thumb, index) => (
                        <button
                            key={thumb.id}
                            onClick={() => setActiveIndex(index)}
                            className={`flex-shrink-0 w-[20%] border-3 rounded-[8px]  transition-colors ${activeIndex === index ? 'border-[#DE4A53]' : 'border-transparent'}`}
                        >
                            <img
                                src={thumb.url.replace('600x400', '100x100')}
                                alt={thumb.alt}
                                className="w-full h-auto rounded-[8px]"
                            />
                        </button>
                    ))} */}
                    {
                        images.map((thumb, index) => (
                            <button
                                key={thumb.id}
                                onClick={() => setActiveIndex(index)}
                                className={`flex-shrink-0 w-[75px] border-3 rounded-[8px]  transition-colors ${activeIndex === index ? 'border-[#DE4A53]' : 'border-transparent'}`}
                            >
                                <img
                                    src={thumb.url.replace('600x400', '100x100')}
                                    alt={thumb.alt}
                                    className="w-full h-auto rounded-[8px]"
                                />
                            </button>
                        ))
                    }
                </div>
                {showLeftArrow && (
                    <button
                        onClick={() => thumbnailContainerRef.current?.scrollBy({ left: -100, behavior: 'smooth' })}
                        className="absolute left-5 top-11 border-2 text-[#1073F7] h-[35px] w-[35px] -translate-y-1/2 z-10 bg-white shadow rounded-full p-1"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                )}
                {showRightArrow && (
                    <button
                        onClick={() => thumbnailContainerRef.current?.scrollBy({ left: 100, behavior: 'smooth' })}
                        className="absolute right-5 top-11 border-2 text-[#1073F7] h-[35px] w-[35px] -translate-y-1/2 z-10 bg-white shadow rounded-full p-1"
                    >
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                )}
                {/* {
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
                } */}


                <div className="hidden md:flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-4 text-[#4A52B2]">
                    <button className="w-full h-[37px] rounded-[10px]  py-2 px-3 bg-[#E7F2FF] text-[#1073F7] text-[15px] font-bold flex items-center justify-center gap-2 hover:bg-[#ccb5c1]/50">
                        <span>Tambahkan ke Favorit</span>
                    </button>
                    <button className="w-full bg-[#1073F7] h-[37px] rounded-[10px]  py-2 px-3 text-white text-[15px] font-bold  flex items-center justify-center gap-2 hover:bg-[#10326e]/80">
                        <span>Bagikan Link</span>
                    </button>
                </div>
                <div className='bg-[#F1F5F9] rounded-[10px] h-[165px] mt-4'>
                    <div className='flex justify-between items-center border-b border-[#C5D7E9] p-3 px-6'>
                        <div className='flex items-center gap-4'>
                            <img className='border border-[#BBBBBB] rounded-full w-[70px] h-[70px] bg-white' src={product?.seller?.avatarUrl} />
                            <div>
                                <p className='text-[#333333] font-bold text-[17px] tracking-[-0.02em]'>
                                    {product?.seller?.name}
                                </p>
                                <div className='flex items-center gap-2'>
                                    <Star size={32} strokeWidth={2} color='#F74B00' />
                                    <p className='tracking-[-0.02em] font-bold text-[17px]'>4.9/5</p>
                                    <p className='tracking-[-0.03em] text-[#888888] '>(150 Ulasan)</p>
                                </div>
                            </div>
                        </div>
                        <div className=''>
                            <p className='text-[#06894E] text-[17px] tracking-[-0.02em] font-bold'>Produk</p>
                            <p className='text-[#333333] text-[17px] text-center tracking-[-0.02em] font-bold'>284</p>
                        </div>
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
    );
};

export default ProductGallery;
