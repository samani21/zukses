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


// --- Main SlidingBanner Component ---

function SlidingBanner({ banners, autoPlayInterval = 5000 }: SlidingBannerProps) {
    // We start at index 1 because index 0 is the clone of the last slide.
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(true); // Start with transition enabled for initial load
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // --- State and Ref for Width Calculation ---
    // This makes the component responsive by calculating slide width dynamically
    const [itemWidth, setItemWidth] = useState(0);

    // Callback ref to measure a single banner item's width.
    // This observer updates the width whenever the window is resized.
    const itemRef = useCallback((node: HTMLDivElement | null) => {
        if (node) {
            const resizeObserver = new ResizeObserver(() => {
                setItemWidth(node.offsetWidth);
            });
            resizeObserver.observe(node);
            // Cleanup observer when component unmounts
            return () => resizeObserver.disconnect();
        }
    }, []);


    // Memoize the extended banners array to prevent re-calculations on every render.
    // Clone first and last items for the seamless loop effect.
    // [last, 1, 2, 3, ..., first]
    const extendedBanners = React.useMemo(() => {
        if (banners.length === 0) return [];
        return [banners[banners.length - 1], ...banners, banners[0]];
    }, [banners]);

    // Function to reset the autoplay timer
    const resetTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    // --- Navigation Handlers ---

    const handleNext = useCallback(() => {
        // Prevent navigation while a transition is in progress
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(prevIndex => prevIndex + 1);
    }, [isTransitioning]);

    const handlePrevious = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(prevIndex => prevIndex - 1);
    }, [isTransitioning]);

    const handleDotClick = (index: number) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        // Add 1 to match the extendedBanners index
        setCurrentIndex(index + 1);
    };


    // --- Effects ---

    // Encapsulate the autoplay logic to start it.
    const startAutoPlay = useCallback(() => {
        if (autoPlayInterval <= 0 || banners.length === 0) return;
        resetTimeout();
        timeoutRef.current = setTimeout(() => {
            handleNext();
        }, autoPlayInterval);
    }, [autoPlayInterval, banners.length, handleNext, resetTimeout]);

    // Autoplay effect
    useEffect(() => {
        // Start the timer when the slide changes or when autoplay is re-enabled.
        if (!isTransitioning) {
            startAutoPlay();
        }
        // Cleanup the timer when the component unmounts or dependencies change.
        return resetTimeout;
    }, [currentIndex, isTransitioning, startAutoPlay, resetTimeout]);

    // This effect handles the "magic" of the seamless loop.
    // It runs after the transition to a cloned slide has finished.
    const handleTransitionEnd = () => {
        setIsTransitioning(false);
        // If we have transitioned to the cloned last slide (at the beginning of the array)
        if (currentIndex === 0) {
            setCurrentIndex(banners.length);
        }
        // If we have transitioned to the cloned first slide (at the end of the array)
        else if (currentIndex === extendedBanners.length - 1) {
            setCurrentIndex(1);
        }
    };

    // --- Interaction Handlers ---

    // Handlers to pause autoplay on hover
    const handleMouseEnter = () => {
        if (autoPlayInterval > 0) {
            resetTimeout();
        }
    };

    const handleMouseLeave = () => {
        if (autoPlayInterval > 0) {
            startAutoPlay();
        }
    };

    // Calculate the active index for the dots (0-based for the original banners array)
    const activeDotIndex = (currentIndex - 1 + banners.length) % banners.length;


    if (banners.length === 0) {
        return null; // Don't render anything if there are no banners
    }

    return (
        <div className="w-full mx-auto py-4">
            <div
                className="relative group overflow-hidden rounded-xl"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* This is the sliding container */}
                <div
                    className="flex ml-[-20]"
                    style={{
                        // Move the container horizontally based on the current index and measured item width
                        transform: `translateX(-${currentIndex * itemWidth}px)`,
                        // Apply transition only when we are not on a cloned slide
                        transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
                    }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {extendedBanners.map((banner, index) => (
                        <div
                            // Attach the ref to the first *real* banner to measure its width
                            ref={index === 1 ? itemRef : null}
                            key={index}
                            // Each item now takes up half the container width
                            className="flex-shrink-0  mr-3"
                        >
                            <img
                                src={banner.src}
                                alt={banner.alt}
                                // Reduced height and removed aspect-video for a shorter banner
                                className=" h-40 rounded-xl"
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
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-10">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${activeDotIndex === index ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
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
