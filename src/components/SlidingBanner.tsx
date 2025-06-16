import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const ChevronRightIcon = () => (
    <svg className="w-5 h-5 text-gray-400 hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
);

const ChevronLeftIcon = () => (
    <svg className="w-5 h-5 text-gray-400 hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isTransitioning = useRef(false);

    const extendedBanners = useMemo(() => {
        if (banners.length === 0) return [];
        return [banners[banners.length - 1], ...banners, banners[0]];
    }, [banners]);

    const resetTimeout = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }, []);

    const goToIndex = useCallback((index: number, behavior: 'smooth' | 'auto' = 'smooth') => {
        if (!scrollRef.current || banners.length === 0) return;
        resetTimeout();

        const container = scrollRef.current;
        const targetBannerIndex = index % banners.length;
        const targetElement = container.children[targetBannerIndex + 1] as HTMLElement;

        if (targetElement) {
            if (behavior === 'auto') {
                container.classList.remove('scroll-smooth');
            } else {
                container.classList.add('scroll-smooth');
            }
            container.scrollTo({ left: targetElement.offsetLeft, behavior });
        }

        setActiveIndex(targetBannerIndex);
    }, [banners.length, resetTimeout]);

    // Auto-play
    useEffect(() => {
        if (autoPlayInterval === 0) return;

        resetTimeout();
        timeoutRef.current = setTimeout(() => {
            goToIndex(activeIndex + 1);
        }, autoPlayInterval);

        return () => resetTimeout();
    }, [activeIndex, autoPlayInterval, goToIndex, resetTimeout]);

    // Handle scroll looping
    const handleScroll = () => {
        if (!scrollRef.current || isTransitioning.current) return;

        const container = scrollRef.current;
        const children = container.children;
        const itemWidth = (children[1] as HTMLElement).offsetWidth;
        const scrollLeft = container.scrollLeft;
        const currentVisibleIndex = Math.round(scrollLeft / itemWidth);

        if (currentVisibleIndex === extendedBanners.length - 1) {
            isTransitioning.current = true;
            setTimeout(() => {
                requestAnimationFrame(() => {
                    goToIndex(0, 'auto');
                    isTransitioning.current = false;
                });
            }, 10);
        } else if (currentVisibleIndex === 0) {
            isTransitioning.current = true;
            setTimeout(() => {
                requestAnimationFrame(() => {
                    goToIndex(banners.length - 1, 'auto');
                    isTransitioning.current = false;
                });
            }, 10);
        } else {
            setActiveIndex(currentVisibleIndex - 1);
        }
    };

    // Set initial scroll position
    useEffect(() => {
        if (scrollRef.current && extendedBanners.length > 1) {
            const firstRealItem = scrollRef.current.children[1] as HTMLElement;
            scrollRef.current.scrollLeft = firstRealItem.offsetLeft;
        }
    }, [extendedBanners.length]);

    return (
        <div className="w-full py-4">
            <div className="relative group">
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar h-40"
                >
                    {extendedBanners.map((banner, index) => (
                        <div
                            key={index}
                            className={`flex-shrink-0 w-[90%] md:w-1/2 px-2 snap-center md:snap-start transition-transform duration-500 ${index === activeIndex + 1 ? 'md:scale-105' : 'md:scale-90'
                                }`}
                        >
                            <img
                                src={banner.src}
                                alt={banner.alt}
                                className="w-full h-full  rounded-xl"
                            />
                        </div>
                    ))}
                </div>

                {/* Arrows */}
                <button
                    onClick={() => goToIndex(activeIndex - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                    <ChevronLeftIcon />
                </button>
                <button
                    onClick={() => goToIndex(activeIndex + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                    <ChevronRightIcon />
                </button>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-10">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToIndex(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${activeIndex === index ? 'w-6 bg-white' : 'w-2 bg-white/50'
                                }`}
                        ></button>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default SlidingBanner;
