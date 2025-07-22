import React, { useEffect, useState, useRef } from 'react';

// --- Ikon SVG (tidak ada perubahan) ---
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

interface ImageLightboxProps {
    images: Thumbnail[];
    productName: string;
    isOpen: boolean;
    onClose: () => void;
    onViewVideo?: () => void;
    initialIndex?: number;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ images, productName, isOpen, onClose, onViewVideo, initialIndex = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    // 1. Buat ref untuk kontainer thumbnail
    const thumbnailContainerRef = useRef<HTMLDivElement>(null);
    const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
    useEffect(() => {
        const activeThumbnail = thumbnailRefs.current[currentIndex];
        if (activeThumbnail) {
            // Perintahkan browser untuk scroll agar thumbnail ini terlihat
            activeThumbnail.scrollIntoView({
                behavior: 'smooth', // Membuat animasi scroll menjadi halus
                block: 'nearest',   // Scroll secukupnya agar elemen terlihat
            });
        }
    }, [currentIndex]);
    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex, isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.body.style.overflow = 'auto';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, currentIndex]); // Tambahkan currentIndex sebagai dependency

    if (!isOpen) return null;

    // 2. Modifikasi handleNext
    const handleNext = () => {
        // Cek jika saat ini adalah gambar terakhir
        if (currentIndex === images.length - 1) {
            // Jika ya, scroll kontainer thumbnail ke atas
            if (thumbnailContainerRef.current) {
                thumbnailContainerRef.current.scrollTop = 0;
            }
        }
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    // 3. Modifikasi handlePrev
    const handlePrev = () => {
        // Cek jika saat ini adalah gambar pertama
        if (currentIndex === 0) {
            // Jika ya, scroll kontainer thumbnail ke paling bawah
            if (thumbnailContainerRef.current) {
                thumbnailContainerRef.current.scrollTop = thumbnailContainerRef.current.scrollHeight;
            }
        }
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleThumbnailClick = (index: number) => {
        setCurrentIndex(index);
    };
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 h-full" onClick={onClose}>
            <div
                className="relative w-full h-full max-w-5xl max-h-[95vh] flex bg-gray-900 text-white overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Main Image Viewer */}
                <div className="flex-grow h-full flex w-full items-center justify-center relative p-4 bg-white md:w-[calc(100%-380px)]">
                    <button onClick={handlePrev} className="absolute left-0 text-white p-2 bg-black/40 hover:bg-black/60 transition-colors z-10" aria-label="Gambar sebelumnya">
                        <ChevronLeftIcon className="w-8 h-8" />
                    </button>
                    <div className='flex items-center justify-center w-full h-full'>
                        {images[currentIndex].url.endsWith('.mp4') ? (
                            <video
                                key={images[currentIndex].id} // Tambahkan key untuk re-render video
                                src={images[currentIndex].url}
                                controls
                                autoPlay
                                className="max-w-full max-h-full object-contain select-none"
                            />
                        ) : (
                            <img
                                src={images[currentIndex].url}
                                alt={images[currentIndex].alt}
                                className="max-w-full max-h-full object-contain select-none"
                            />
                        )}
                    </div>
                    <button onClick={handleNext} className="absolute right-0 text-white p-2 bg-black/40 hover:bg-black/60 transition-colors z-10" aria-label="Gambar berikutnya">
                        <ChevronRightIcon className="w-8 h-8" />
                    </button>
                </div>

                {/* Sidebar with Thumbnails */}
                <div className="hidden md:flex flex-col w-[380px] bg-white text-black p-4">
                    <h2 className="text-[17px] font-[500] text-[#333333] pb-3 mb-4 mt-4">
                        {productName}
                    </h2>

                    {/* 4. Lampirkan ref ke div ini */}
                    <div
                        ref={thumbnailContainerRef}
                        className="flex-grow overflow-y-auto grid grid-cols-3 gap-3 p-1 no-scrollbar bg-white"
                    >
                        {images.map((img, index) => (
                            <button
                                key={img.id}
                                onClick={() => handleThumbnailClick(index)}
                                className="bg-white relative aspect-square"
                                ref={(el) => { thumbnailRefs.current[index] = el; }}
                            >
                                {img.url.endsWith('.mp4') ? (
                                    <>
                                        <video
                                            src={img.url}
                                            className={`w-full h-full object-cover border-2 transition-all duration-200 ${currentIndex === index ? 'border-purple-600' : 'border-transparent hover:border-gray-300'}`}
                                            muted
                                            playsInline
                                            preload="metadata"
                                        />
                                        {/* Video Play Icon Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path></svg>
                                        </div>
                                    </>
                                ) : (
                                    <img
                                        src={img.url}
                                        alt={img.alt}
                                        className={`w-full h-full object-cover border-2 transition-all duration-200 ${currentIndex === index ? 'border-purple-600 scale-105' : 'border-transparent hover:border-gray-300'}`}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto pt-4 flex">
                        {onViewVideo && (
                            <button
                                onClick={onViewVideo}
                                className="w-full text-center py-2.5 px-4 bg-[#F6E9F0] text-[#563D7C] border border-[#563D7C80]/50 font-semibold hover:bg-purple-50 transition-colors text-[14px]"
                            >
                                Lihat Video
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="w-full text-center py-2.5 px-4 bg-[#563D7C] text-white font-semibold hover:bg-purple-700 transition-colors text-[14px]"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageLightbox;