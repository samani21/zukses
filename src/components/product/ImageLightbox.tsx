import React, { useEffect, useState } from 'react';

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
    }, [isOpen]);

    if (!isOpen) return null;

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 h-full" onClick={onClose}>
         
            <div
                className="relative w-full h-full max-w-6xl max-h-[95vh] flex bg-gray-900 text-white overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
             
                <div className="flex-grow h-full flex items-center justify-center relative p-4 bg-white">
                    <button onClick={handlePrev} className="absolute left-0 sm:left-0 text-white p-2 bg-black/40 hover:bg-black/60 transition-colors z-10" aria-label="Gambar sebelumnya">
                        <ChevronLeftIcon className="w-8 h-8" />
                    </button>
                    <div className='w-full h-full'>
                        {images[currentIndex].url.endsWith('.mp4') ? (
                            <video
                                src={images[currentIndex].url}
                                controls
                                className="w-full h-full  select-none"
                            />
                        ) : (
                            <img
                                src={images[currentIndex].url}
                                alt={images[currentIndex].alt}
                                className="w-full h-full  select-none"
                            />
                        )}
                    </div>

                    <button onClick={handleNext} className="absolute right-0 sm:right-0 text-white p-2 bg-black/40 hover:bg-black/60 transition-colors z-10" aria-label="Gambar berikutnya">
                        <ChevronRightIcon className="w-8 h-8" />
                    </button>
                </div>

        
                <div className="hidden md:flex flex-col w-80 lg:w-96 flex-shrink-0 bg-white text-black p-4">
            
                    <h2 className="text-[17px] font-[500] text-[#333333] pb-3 mb-4 mt-4">
                        {productName}
                    </h2>

                    <div className="flex overflow-y-auto grid grid-cols-3 gap-3 p-1 no-scrollbar">
                        {images.map((img, index) => (
                            <button
                                key={img.id}
                                onClick={() => setCurrentIndex(index)}
                                className="aspect-w-1 aspect-h-1"
                            >
                                {
                                    img.url.endsWith('.mp4') ? (
                                        <video
                                            src={img.url}
                                            className={`h-full w-full border-2 transition-all duration-200 ${currentIndex === index
                                                ? 'border-purple-600 scale-105'
                                                : 'border-transparent hover:border-gray-300'
                                                }`}
                                            muted
                                            playsInline
                                            preload="metadata"
                                        />
                                    ) : (
                                        <img
                                            src={img.url}
                                            alt={img.alt}
                                            className={`h-full w-full border-2 transition-all duration-200 ${currentIndex === index
                                                ? 'border-purple-600 scale-105'
                                                : 'border-transparent hover:border-gray-300'
                                                }`}
                                        />
                                    )
                                }
                            </button>
                        ))}


                    </div>

          
                    <div className="mt-auto flex">
                        {onViewVideo && (
                            <button
                                onClick={onViewVideo}
                                className="w-full text-center py-2.5 px-4 bg-[#F6E9F0] text-[#563D7C]  border border-[#563D7C80]/50 font-semibold hover:bg-purple-50 transition-colors text-[14px] font-semibold"
                            >
                                Lihat Video
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="w-full text-center py-2.5 px-4 bg-[#563D7C] text-white font-semibold hover:bg-purple-700 transition-colors text-[14px] font-semibold"
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