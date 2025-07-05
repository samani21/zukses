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
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto scroll-smooth scrollbar-hide"
                >
                    <div className="flex flex-row md:grid md:grid-rows-1 md:grid-flow-col md:gap-5">
                        {categories.map((category) => (
                            <button
                                onClick={() => onCategorySelect(category.name)}
                                key={category.name}
                                className="flex flex-col items-center justify-start w-[102px] h-[102px] text-center group border-2 border-[#7952B3] rounded-[10px]"
                            >
                                <div className="p-2 flex items-center justify-center mb-2 group-hover:border-blue-500 transition-colors">
                                    <img
                                        src={category.icon}
                                        alt={category.name}
                                        className="w-13"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/eee/ccc?text=?';
                                        }}
                                    />
                                </div>
                                <span className="text-xs text-dark-600 group-hover:text-blue-600 mt-[-10px] leading-none">
                                    {category.name}
                                </span>

                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default CategoryGrid;