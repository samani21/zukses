import { ChevronLeftIcon, ChevronRightIcon, X } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';

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

const ImageLightbox: React.FC<ImageLightboxProps> = ({ images, productName, isOpen, onClose, initialIndex = 0 }) => {
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
                className="relative text-white"
                style={{
                    width: 'calc(90% - 120px)',
                    height: 'calc(100% - 20px)',
                    maxWidth: '90%'
                }}

                onClick={(e) => e.stopPropagation()}
            >
                <div className='bg-white h-full rounded-[8px]'>
                    <div className='flex items-center justify-between p-6'>
                        <h5
                            className="font-[800] text-[20px] w-[96%] text-[#080808] truncate"
                            style={{
                                lineHeight: "26px",
                                letterSpacing: "-0.01em",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                            }}
                        >
                            {productName}
                        </h5>
                        <X color='#2E3137' size={24} className='cursor-pointer' onClick={onClose} />
                    </div>
                    <div className='flex w-full l overflow-hidden bg-white rounded-b-[8px]'>
                        <div className="col-span-3 flex-grow h-full flex w-1/2 items-center justify-center relative p-4 pt-0 bg-white md:w-[calc(100%-380px)]">
                            <button onClick={handlePrev} className="absolute left-4 text-white w-[50px] h-[50px] p-3 bg-white  rounded-full transition-colors z-10" aria-label="Gambar sebelumnya" style={{
                                boxShadow: "rgba(0, 0, 0, 0.12) 0px 2px 4px"
                            }}>
                                <ChevronLeftIcon color='#888888' strokeWidth={2} />
                            </button>
                            <div className='flex items-center justify-center w-full h-[78vh]'>
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
                            <button onClick={handleNext} className="absolute right-4  w-[50px] h-[50px] p-3 bg-white  rounded-full transition-colors z-10" aria-label="Gambar berikutnya"
                                style={{
                                    boxShadow: "rgba(0, 0, 0, 0.12) 0px 2px 4px"
                                }}>
                                <ChevronRightIcon color='#888888' strokeWidth={2} />
                            </button>
                        </div>

                        <div className="hidden md:flex flex-col w-1/2 text-black p-4 pt-0 max-h-[300px]">
                            <p className='mb-2 text-[14px] text-bold font-bold'>Gambar Barang </p>
                            <div className='w-1/2 overflow-y-auto overflow-x-hidden pb-2'>
                                <div
                                    ref={thumbnailContainerRef}
                                    className="flex-grow grid grid-cols-3 gap-3  rounded-[8px]"
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
                                                        className={`w-full h-full object-cover border-2 rounded-[8px] transition-all duration-200 ${currentIndex === index ? 'border-green-600' : 'border-transparent hover:border-gray-300'}`}
                                                        muted
                                                        playsInline
                                                        preload="metadata"
                                                    />
                                                    <div className="absolute inset-0 flex items-center rounded-[8px] justify-center bg-black/30">
                                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path></svg>
                                                    </div>
                                                </>
                                            ) : (
                                                <img
                                                    src={img.url}
                                                    alt={img.alt}
                                                    className={`w-full h-full object-cover border-2 rounded-[8px] transition-all duration-200 ${currentIndex === index ? 'border-green-600 scale-105' : 'border-transparent hover:border-gray-300'}`}
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageLightbox;