import React, { useEffect, useState } from 'react'
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

const XIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

interface Thumbnail {
    id: number;
    url: string;
    alt: string;
}

interface ImageLightboxProps {
    images: Thumbnail[];
    initialIndex?: number;
    isOpen: boolean;
    onClose: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ images, initialIndex = 0, isOpen, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="relative w-full h-full p-4 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300 z-10" aria-label="Tutup"><XIcon className="w-8 h-8" /></button>
                <div className="flex w-full max-w-6xl h-full max-h-[90vh]">
                    <div className="flex-grow h-full flex items-center justify-center relative">
                        <button onClick={handlePrev} className="absolute left-0 sm:left-4 text-white p-2 bg-black/30 rounded-full hover:bg-black/50" aria-label="Gambar sebelumnya"><ChevronLeftIcon className="w-8 h-8" /></button>
                        <img src={images[currentIndex].url} alt={images[currentIndex].alt} className="max-w-full max-h-full object-contain" />
                        <button onClick={handleNext} className="absolute right-0 sm:right-4 text-white p-2 bg-black/30 rounded-full hover:bg-black/50" aria-label="Gambar berikutnya"><ChevronRightIcon className="w-8 h-8" /></button>
                    </div>
                    <div className="hidden md:flex flex-col space-y-2 p-4 bg-black/20 overflow-y-auto no-scrollbar">
                        {images.map((img, index) => (
                            <button key={img.id} onClick={() => setCurrentIndex(index)}>
                                <img src={img.url.replace('600x400', '100x100')} alt={img.alt} className={`w-20 h-20 object-cover rounded-md border-2 transition-colors ${currentIndex === index ? 'border-blue-500' : 'border-transparent'}`} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ImageLightbox