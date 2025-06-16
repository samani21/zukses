import React, {  useRef, useState } from 'react'

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

    // State untuk fungsionalitas drag
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseLeaveOrUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Sensitivitas drag
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div className="w-full overflow-hidden md:py-4">
            <div
                className="relative cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeaveOrUp}
                onMouseUp={handleMouseLeaveOrUp}
                onMouseMove={handleMouseMove}
            >
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
                >
                    <div className="flex space-x-4 px-4 sm:px-8 md:px-[15%] lg:px-[1%]">
                        {banners.map((banner) => (
                            <div
                                key={banner.id}
                                className="snap-center shrink-0 w-[90vw] md:w-[70vw] lg:w-[60vw]"
                            >
                                <img
                                    src={banner.src}
                                    alt={banner.alt}
                                    className="w-full h-40 md:h-100 rounded-lg pointer-events-none select-none"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://placehold.co/800x400?text=Banner';
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-4 right-4 md:right-8 bg-black/40 backdrop-blur-sm p-1 rounded-full z-10 hidden md:block">
                    <div className="w-16 h-1.5 bg-white/40 rounded-full">
                        <div className="h-full bg-white rounded-full" style={{ width: '33%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default SlidingBanner