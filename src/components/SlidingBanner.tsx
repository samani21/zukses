import React, { useEffect, useRef, useState } from 'react'

interface Banner {
    id: number;
    src: string;
    alt: string;
}

interface SlidingBannerProps {
    banners: Banner[];
}

function SlidingBanner({ banners }: SlidingBannerProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (scrollRef.current) {
            const scrollLeft = scrollRef.current.scrollLeft;
            const itemWidth = scrollRef.current.children[0]?.clientWidth || 0;
            const newIndex = Math.round(scrollLeft / itemWidth);
            setActiveIndex(newIndex);
        }
    };

    useEffect(() => {
        const currentRef = scrollRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    return (
        <div className="w-full container mx-auto md:px-4 md:pt-4">
            {/* Bungkus scroll area dan indikator dalam container relative */}
            <div className="relative">
                {/* Scrollable banner */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide space-x-4"
                >
                    {banners.map((banner) => (
                        <div key={banner.id} className="snap-start shrink-0 w-full sm:w-1/3">
                            <img
                                src={banner.src}
                                alt={banner.alt}
                                className="w-full h-full object-cover md:rounded-lg"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x200?text=Banner';
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Dot indicator di dalam gambar bagian bawah */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center items-center gap-2 z-10">
                    {banners.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 rounded-full transition-all duration-300 ${activeIndex === index ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300'
                                }`}
                        ></div>
                    ))}
                </div>
            </div>
        </div>

    );
}

export default SlidingBanner