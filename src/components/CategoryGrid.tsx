import React, { useRef, useState, useEffect } from 'react';

const ChevronRightIcon = () => (
    <svg className="w-5 h-5 text-gray-400 hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
    </svg>
);

const ChevronLeftIcon = () => (
    <svg className="w-5 h-5 text-gray-400 hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
    </svg>
);
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
            setCanScrollRight(container.scrollLeft + container.offsetWidth < container.scrollWidth - 1);
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        updateScrollButtons();

        const handleScroll = () => updateScrollButtons();
        const handleResize = () => updateScrollButtons(); 
        container.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        return () => {
            container.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, [categories]);

    const scrollByAmount = 300;

    return (
        <div className="container mx-auto md:p-4">
            <div className="bg-white rounded-lg shadow p-4 relative">
                {canScrollLeft && (
                    <button
                        onClick={() => {
                            scrollContainerRef.current?.scrollBy({ left: -scrollByAmount, behavior: 'smooth' });
                        }}
                        className="absolute top-1/3 left-0 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md border hover:bg-gray-100 hidden md:flex items-center justify-center z-10"
                    >
                        <ChevronLeftIcon />
                    </button>
                )}

                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto scroll-smooth scrollbar-hide"
                >
                    <div className="flex flex-row md:grid md:grid-rows-1 md:grid-flow-col md:gap-4">
                        {categories.map((category) => (
                            <button
                                onClick={() => onCategorySelect(category.name)}
                                key={category.name}
                                className="flex flex-col items-center justify-start w-24 text-center group border-2 border-[#7952B3] rounded-[10px]"
                            >
                                <div className="w-16 h-16 flex items-center justify-center mb-2 group-hover:border-blue-500 transition-colors">
                                    <img
                                        src={category.icon}
                                        alt={category.name}
                                        className="w-10 h-10 object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/eee/ccc?text=?';
                                        }}
                                    />
                                </div>
                                <span className="text-xs text-gray-600 group-hover:text-blue-600">{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {canScrollRight && (
                    <button
                        onClick={() => {
                            scrollContainerRef.current?.scrollBy({ left: scrollByAmount, behavior: 'smooth' });
                        }}
                        className="absolute top-1/3 right-0 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md border hover:bg-gray-100 hidden md:flex items-center justify-center"
                    >
                        <ChevronRightIcon />
                    </button>
                )}
            </div>
        </div>
    );
}

export default CategoryGrid;