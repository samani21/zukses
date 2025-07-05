import React, { useRef } from 'react';

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

    return (
        <div className="container mx-auto md:p-0">
            <div className="py-5 relative">
                {/* {canScrollLeft && (
                    <button
                        onClick={() => {
                            scrollContainerRef.current?.scrollBy({ left: -scrollByAmount, behavior: 'smooth' });
                        }}
                        className="absolute top-1/3 left-0 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md border hover:bg-gray-100 hidden md:flex items-center justify-center z-10"
                    >
                        <ChevronLeftIcon />
                    </button>
                )} */}

                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto scroll-smooth scrollbar-hide"
                >
                    <div className="flex flex-row md:grid md:grid-rows-1 md:grid-flow-col md:gap-4">
                        {categories.map((category) => (
                            <button
                                onClick={() => onCategorySelect(category.name)}
                                key={category.name}
                                className="flex flex-col items-center justify-start w-[119px] h-[119px] text-center group border-2 border-[#7952B3] rounded-[10px]"
                            >
                                <div className="p-2 flex items-center justify-center mb-2 group-hover:border-blue-500 transition-colors">
                                    <img
                                        src={category.icon}
                                        alt={category.name}
                                        className="w-16"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/eee/ccc?text=?';
                                        }}
                                    />
                                </div>
                                <span className="text-sm text-gray-600 group-hover:text-blue-600 mt-[-12px]">{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* {canScrollRight && (
                    <button
                        onClick={() => {
                            scrollContainerRef.current?.scrollBy({ left: scrollByAmount, behavior: 'smooth' });
                        }}
                        className="absolute top-1/3 right-0 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md border hover:bg-gray-100 hidden md:flex items-center justify-center"
                    >
                        <ChevronRightIcon />
                    </button>
                )} */}
            </div>
        </div>
    );
}

export default CategoryGrid;