import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Helper Components & Interfaces ---

const ChevronRightIcon = () => (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
);

const ChevronLeftIcon = () => (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

// --- Main Component ---

function SlidingBanner({ banners, autoPlayInterval = 5000 }: SlidingBannerProps) {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [itemWidth, setItemWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const startXRef = useRef<number | null>(null);
    const isDraggingRef = useRef<boolean>(false);

    const handleTouchStart = (e: React.TouchEvent) => {
        startXRef.current = e.touches[0].clientX;
        isDraggingRef.current = true;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDraggingRef.current || startXRef.current === null) return;

        const diff = e.touches[0].clientX - startXRef.current;
        if (Math.abs(diff) > 50) {
            isDraggingRef.current = false;
            if (diff > 0) {
                handlePrevious();
            } else {
                handleNext();
            }
        }
    };

    const handleTouchEnd = () => {
        isDraggingRef.current = false;
        startXRef.current = null;
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        startXRef.current = e.clientX;
        isDraggingRef.current = true;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDraggingRef.current || startXRef.current === null) return;

        const diff = e.clientX - startXRef.current;
        if (Math.abs(diff) > 50) {
            isDraggingRef.current = false;
            if (diff > 0) {
                handlePrevious();
            } else {
                handleNext();
            }
        }
    };

    const handleMouseUp = () => {
        isDraggingRef.current = false;
        startXRef.current = null;
    };

    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver(() => {
            if (containerRef.current) {
                setItemWidth(containerRef.current.offsetWidth);
            }
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    const extendedBanners = React.useMemo(() => {
        if (banners.length === 0) return [];
        return [banners[banners.length - 1], ...banners, banners[0]];
    }, [banners]);

    const resetTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    const handleNext = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(prev => prev + 1);
    }, [isTransitioning]);

    const handlePrevious = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(prev => prev - 1);
    }, [isTransitioning]);

    const handleDotClick = (index: number) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(index + 1);
    };

    const startAutoPlay = useCallback(() => {
        if (autoPlayInterval <= 0 || banners.length === 0) return;
        resetTimeout();
        timeoutRef.current = setTimeout(() => {
            handleNext();
        }, autoPlayInterval);
    }, [autoPlayInterval, banners.length, handleNext, resetTimeout]);

    useEffect(() => {
        if (!isTransitioning) {
            startAutoPlay();
        }
        return resetTimeout;
    }, [currentIndex, isTransitioning, startAutoPlay, resetTimeout]);

    const handleTransitionEnd = () => {
        setIsTransitioning(false);
        if (currentIndex === 0) {
            setCurrentIndex(banners.length);
        } else if (currentIndex === extendedBanners.length - 1) {
            setCurrentIndex(1);
        }
    };

    const handleMouseEnter = () => {
        if (autoPlayInterval > 0) resetTimeout();
    };

    const handleMouseLeave = () => {
        if (autoPlayInterval > 0) startAutoPlay();
    };

    const activeDotIndex = (currentIndex - 1 + banners.length) % banners.length;

    if (banners.length === 0) return null;

    return (
        <div className="w-full mx-auto md:py-4">
            <div
                ref={containerRef}
                className="relative group overflow-hidden md:rounded-xl"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    className="flex"
                    style={{
                        transform: `translateX(-${currentIndex * itemWidth}px)`,
                        transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
                    }}
                    onTransitionEnd={handleTransitionEnd}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    {extendedBanners.map((banner, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-full"
                        >
                            <img
                                src={banner.src}
                                alt={banner.alt}
                                className="w-full h-30 md:h-60 md:rounded-xl"
                            />
                        </div>
                    ))}
                </div>

                {/* Left Arrow */}
                <button
                    onClick={handlePrevious}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:outline-none z-10"
                    aria-label="Previous slide"
                >
                    <ChevronLeftIcon />
                </button>

                {/* Right Arrow */}
                <button
                    onClick={handleNext}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:outline-none z-10"
                    aria-label="Next slide"
                >
                    <ChevronRightIcon />
                </button>

                {/* Navigation Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-10 hidden md:block" style={{ background: "#00000073", paddingRight: "5px", paddingLeft: "5px", borderRadius: "10px" }}>
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${activeDotIndex === index
                                ? 'w-6 bg-white'
                                : 'w-2 bg-white/50 hover:bg-white/75'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SlidingBanner;
