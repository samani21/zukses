import React, { useState, useEffect, useRef, useCallback } from 'react';

const ChevronRightIcon = () => (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
);

const ChevronLeftIcon = () => (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    </svg>
);

interface Banner {
    id: number;
    src: string;
    alt: string;
}

interface SlidingBannerProps {
    banners: Banner[];
    autoPlayInterval?: number;
}

function SlidingBanner({ banners, autoPlayInterval = 5000 }: SlidingBannerProps) {
    const extendedBanners = React.useMemo(() => {
        if (banners.length === 0) return [];
        return [banners[banners.length - 1], ...banners, banners[0]];
    }, [banners]);

    const [currentIndex, setCurrentIndex] = useState(1); 
    const [disableTransition, setDisableTransition] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const startXRef = useRef<number | null>(null);
    const isDraggingRef = useRef<boolean>(false);

    // --- Navigasi ---
    const handleNext = useCallback(() => {
        if (disableTransition) return;
        setCurrentIndex(prev => prev + 1);
    }, [disableTransition]);

    const handlePrevious = useCallback(() => {
        if (disableTransition) return;
        setCurrentIndex(prev => prev - 1);
    }, [disableTransition]);

    const handleDotClick = (index: number) => {
        setCurrentIndex(index + 1);
    };

    const resetTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    useEffect(() => {
        if (autoPlayInterval > 0 && banners.length > 1) {
            resetTimeout();
            timeoutRef.current = setTimeout(() => {
                handleNext();
            }, autoPlayInterval);
        }
        return resetTimeout;
    }, [currentIndex, autoPlayInterval, banners.length, handleNext, resetTimeout]);

    const handleTransitionEnd = () => {
        if (currentIndex <= 0) {
            setDisableTransition(true);
            setCurrentIndex(banners.length);
        } else if (currentIndex >= extendedBanners.length - 1) {
            setDisableTransition(true);
            setCurrentIndex(1);
        }
    };

    useEffect(() => {
        if (disableTransition) {
            const timer = setTimeout(() => setDisableTransition(false), 50);
            return () => clearTimeout(timer);
        }
    }, [disableTransition]);
    const handleInteractionStart = (clientX: number) => {
        resetTimeout();
        isDraggingRef.current = true;
        startXRef.current = clientX;
    };

    const handleInteractionMove = (clientX: number) => {
        if (!isDraggingRef.current || startXRef.current === null) return;
        const diff = clientX - startXRef.current;
        if (Math.abs(diff) > 50) { 
            if (diff > 0) {
                handlePrevious();
            } else {
                handleNext();
            }
            isDraggingRef.current = false;
        }
    };

    const handleInteractionEnd = () => {
        isDraggingRef.current = false;
        startXRef.current = null;
        if (autoPlayInterval > 0) {
            resetTimeout();
            timeoutRef.current = setTimeout(() => handleNext(), autoPlayInterval);
        }
    };

    const transformStyle = {
        transform: `translateX(calc(-${currentIndex} * (70% + 1rem) + 15% - 0.5rem))`,
        transition: disableTransition ? 'none' : 'transform 0.5s ease-in-out',
    };

    if (banners.length === 0) return null;

    return (
        <div
            className="w-full mx-auto select-none pt-10"
            onMouseEnter={resetTimeout}
            onMouseLeave={handleInteractionEnd}
        >
            <div
                ref={containerRef}
                className="relative group overflow-hidden rounded-xl"
                onTouchStart={(e) => handleInteractionStart(e.touches[0].clientX)}
                onTouchMove={(e) => handleInteractionMove(e.touches[0].clientX)}
                onTouchEnd={handleInteractionEnd}
                onMouseDown={(e) => handleInteractionStart(e.clientX)}
                onMouseMove={(e) => handleInteractionMove(e.clientX)}
                onMouseUp={handleInteractionEnd}
                onMouseLeave={() => { if (isDraggingRef.current) handleInteractionEnd() }}
            >
                <div
                    className="flex items-center gap-4" // `gap-4` memberi jarak antar slide
                    style={transformStyle}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {extendedBanners.map((banner, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0"
                            style={{ width: '70%' }} // Lebar setiap slide
                        >
                            <img
                                src={banner.src}
                                alt={banner.alt}
                                className={`w-full h-40 md:h-60 object-cover rounded-xl transition-opacity duration-500 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-60'
                                    }`}
                                draggable="false"
                            />
                        </div>
                    ))}
                </div>

                {/* Tombol Panah Kiri */}
                <button
                    onClick={handlePrevious}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:outline-none z-10"
                    aria-label="Previous slide"
                >
                    <ChevronLeftIcon />
                </button>

                {/* Tombol Panah Kanan */}
                <button
                    onClick={handleNext}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:outline-none z-10"
                    aria-label="Next slide"
                >
                    <ChevronRightIcon />
                </button>

                {/* Tombol Navigasi Titik */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-10">
                    <div className="bg-black/40 px-2 py-1 rounded-full flex items-center space-x-2">
                        {banners.map((_, index) => {
                            const activeDotIndex = (currentIndex - 1 + banners.length) % banners.length;
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleDotClick(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${activeDotIndex === index ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Komponen Aplikasi untuk Contoh Penggunaan ---
export default SlidingBanner;