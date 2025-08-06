import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';

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

    // const [category, setCategory] = useState<Category[]>([]);
    const updateScrollButtons = () => {
        const container = scrollContainerRef.current;
        if (container) {
            setCanScrollLeft(container.scrollLeft > 0);
            setCanScrollRight(container.scrollLeft + container.offsetWidth < container.scrollWidth);
        }
    };
    // const getCategory = async () => {
    //     // setLoading(true);
    //     const res = await Get<Response>('zukses', `category/list`);
    //     if (res?.status === 'success' && Array.isArray(res.data)) {
    //         const data = res?.data as Category[];
    //         // setProducts(data);
    //         setCategory(data);
    //     } else {
    //         console.warn('Produk tidak ditemukan atau gagal diambil');

    //     }
    //     // setLoading(false);
    // };

    // useEffect(() => {
    //     getCategory();
    // }, []);
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
                        className="absolute w-[40px] h-[40px]  top-[50px] left-5 transform -translate-y-1/2 bg-[#E7F2FF]  rounded-full p-1 shadow-md  hover:bg-blue/60 hidden md:flex items-center justify-center group-hover:opacity-1430 "
                    >
                        <ChevronLeftIcon size={26} color='#1073F7' />
                    </button>
                )}

                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto scroll-smooth scrollbar-hide"
                >
                    <div className="flex flex-row md:grid md:grid-rows-1 md:grid-flow-col gap-2 px-2 md:px-0 gap-5">
                        {categories.map((category, index) => {
                            const bgColors = ['#E9E2FF', '#C4EDDD', '#FFDFDF', '#F4EFC0', '#CCEAFF'];
                            const borderColors = ['#845FF5', '#4FBD92', '#FF6363', '#E0CE1B', '#3D98D9'];
                            const bgColor = bgColors[index % bgColors.length];
                            const borderColor = borderColors[index % borderColors.length];

                            return (
                                <div className='text-center h-[110px]' key={index}>
                                    <div className='flex items-center justify-center'>
                                        <div className='w-[70px] h-[70px] rounded-full flex flex-col items-center justify-start w-24 text-center group'
                                            style={{
                                                backgroundColor: bgColor,
                                                border: `2px solid ${borderColor}`,
                                            }}>
                                            <button
                                                onClick={() => onCategorySelect(category.name)}
                                                key={category.name}
                                                className="-mt-2"

                                            >
                                                <img
                                                    src={category.icon}
                                                    alt={category.name}
                                                    className="w-[40px] h-[40px] object-contain mt-4 md:mt-5"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/eee/ccc?text=?';
                                                    }}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                    <span
                                        className="text-[#444444] font-bold text-[14px] block mt-2 w-[100px]"
                                        style={{
                                            lineHeight: '99%',
                                            letterSpacing: '-0.02em',
                                        }}
                                    >
                                        {category.name}
                                    </span>
                                </div>
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
                        className="absolute w-[40px] h-[40px] top-[50px] right-5 transform -translate-y-1/2 bg-[#E7F2FF] rounded-full p-1 shadow-md  hover:bg-blue/60 hidden md:flex items-center justify-center group-hover:opacity-100 "
                    >
                        <ChevronRightIcon size={26} color='#1073F7' />
                    </button>
                )}
            </div>
        </div>
    );
}

export default CategoryGrid;
