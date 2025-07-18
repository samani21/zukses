import React, { useRef, useState, useEffect } from 'react';

const ChevronRightIcon = () => (
    <svg className="w-[20px] h-[20px] text-white hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
    </svg>
);

const ChevronLeftIcon = () => (
    <svg className="w-[20px] h-[20px] text-white hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
    </svg>
);

// --- Komponen Grid Kategori ---
interface Category {
    name: string;
    icon: string;
}

interface CategoryGridProps {
    categories: Category[];
    onCategorySelect: (category: string) => void;
}

function CategoryGrid({ categories, onCategorySelect }: CategoryGridProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollButtons = () => {
        const container = scrollContainerRef.current;
        if (container) {
            setCanScrollLeft(container.scrollLeft > 0);
            setCanScrollRight(container.scrollLeft + container.offsetWidth < container.scrollWidth);
        }
    };

    useEffect(() => {
        updateScrollButtons();
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => updateScrollButtons();
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollByAmount = 300;

    return (
        <div className="container mx-auto">
            <div className="relative">
                {/* Tombol kiri */}
                {canScrollLeft && (
                    <button
                        onClick={() => {
                            scrollContainerRef.current?.scrollBy({ left: -scrollByAmount, behavior: 'smooth' });
                        }}
                        className="absolute top-[60px] left-4 transform -translate-y-1/2 bg-black/40 rounded-full p-1 shadow-md  hover:bg-black/60 hidden md:flex items-center justify-center group-hover:opacity-100 "
                    >
                        <ChevronLeftIcon />
                    </button>
                )}

                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto scroll-smooth scrollbar-hide"
                >
                    <div className="flex flex-row md:grid md:grid-rows-1 md:grid-flow-col gap-2 px-2 md:px-0">
                        {categories.map((category, index) => {
                            const bgColors = ['#E9E2FF', '#C4EDDD', '#FFDFDF', '#F4EFC0'];
                            const bgColor = bgColors[index % bgColors.length];

                            return (
                                <button
                                    onClick={() => onCategorySelect(category.name)}
                                    key={category.name}
                                    className="w-[80px] md:w-[120px] h-[80px] md:h-[120px] rounded-[10px] flex flex-col items-center justify-start w-24 text-center group"
                                    style={{ backgroundColor: bgColor }}
                                >
                                    <img
                                        src={category.icon}
                                        alt={category.name}
                                        className="w-[30px] md:w-[57px] h-[30px] md:h-[57px] object-contain mt-4 md:mt-5"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/eee/ccc?text=?';
                                        }}
                                    />
                                    <span className="text-[10px] md:text-[14px]  text-[#222222] leading-[99%] tracking-[-0.02em] mt-2">{category.name}</span>
                                </button>
                            );
                        })}

                    </div>
                </div>

                {/* Tombol kanan */}
                {canScrollRight && (

                    <button
                        onClick={() => {
                            scrollContainerRef.current?.scrollBy({ left: scrollByAmount, behavior: 'smooth' });
                        }}
                        className="absolute top-[60px] right-4 transform -translate-y-1/2 bg-black/40 rounded-full p-1 shadow-md  hover:bg-black/60 hidden md:flex items-center justify-center group-hover:opacity-100 "
                    >
                        <ChevronRightIcon />
                    </button>
                )}
            </div>
        </div>
    );
}

export default CategoryGrid;
