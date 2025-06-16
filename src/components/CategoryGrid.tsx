import React, { useRef } from 'react';

const ChevronRightIcon = () => (
    <svg className="w-5 h-5 text-gray-400 hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
);
// --- BARU: Komponen Grid Kategori ---
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
        <div className="container mx-auto md:p-4">
            <div className="bg-white rounded-lg shadow p-4 relative">
                <h2 className="text-base font-bold text-gray-700 mb-4">KATEGORI</h2>
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto scroll-smooth scrollbar-hide"
                >
                    <div className="flex flex-row md:grid md:grid-rows-1 md:grid-flow-col md:gap-4">
                        {categories.map((category) => (
                            <button onClick={() => onCategorySelect(category.name)} key={category.name} className="flex flex-col items-center justify-start w-24 text-center group">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-gray-200 transition-colors">
                                    <img src={category.icon} alt={category.name} className="w-10 h-10 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/eee/ccc?text=?'; }} />
                                </div>
                                <span className="text-xs text-gray-600 group-hover:text-blue-600">{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    onClick={() => scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                    className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md border hover:bg-gray-100 hidden md:flex items-center justify-center"
                >
                    <ChevronRightIcon />
                </button>
            </div>
        </div>
    );
}

export default CategoryGrid