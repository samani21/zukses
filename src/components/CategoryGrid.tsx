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
            <div className="py-5 pb-0 relative">
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto scroll-smooth scrollbar-hide"
                >
                    <div className="flex flex-row md:grid md:grid-rows-1 md:grid-flow-col md:gap-2.5">
                        {categories.map((category) => (
                            <button
                                onClick={() => onCategorySelect(category.name)}
                                key={category.name}
                                className="bg-white flex flex-col items-center justify-start w-[90px] h-[90px] text-center group border-1 border-[#DDDDDD]"
                            >
                                <div className="p-2 flex items-center justify-center mb-2 group-hover:border-blue-500 transition-colors">
                                    <img
                                        src={category.icon}
                                        alt={category.name}
                                        className="w-[40px]"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/eee/ccc?text=?';
                                        }}
                                    />
                                </div>
                                <span className="text-[12px] w-[85px] text-[#555555]  mt-[-6px] leading-none">
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