
import { useMediaQuery } from '@mui/material';
import { ArrowLeftIcon, ChevronRightIcon, SearchIcon, XIcon } from 'lucide-react';
import React, { FC, useState, useEffect } from 'react';
import { Category } from 'services/api/product';

const CategorySelector: FC<{
    onSelectCategory: (path: string) => void;
    setCategoryModalOpen: (path: boolean) => void;
    initialCategory: string;
    categories: Category[];
    isLoading: boolean;
    error: string | null;
    handleConfirmCategory: () => void;
    setIdCategorie: (value: number) => void;
}> = ({ onSelectCategory, initialCategory, categories, isLoading, error, setIdCategorie, setCategoryModalOpen, handleConfirmCategory }) => {
    const [selectionPath, setSelectionPath] = useState<Category[]>([]);
    const [columns, setColumns] = useState<Category[][]>([categories]);
    const [selectedCategoryName, setSelectedCategoryName] = useState(initialCategory);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [currentMobileList, setCurrentMobileList] = useState<Category[]>(categories);
    useEffect(() => {
        setColumns([categories]);
        if (!isLoading && categories.length > 0) {
            const pathParts = initialCategory.split(' > ').filter(p => p);
            let currentLevelCategories = categories;
            const initialPath: Category[] = [];
            const initialColumns: Category[][] = [categories];

            for (const part of pathParts) {
                const foundCat = currentLevelCategories.find(c => c.name === part);
                if (foundCat) {
                    initialPath.push(foundCat);
                    if (foundCat.children && foundCat.children.length > 0) {
                        initialColumns.push(foundCat.children);
                        currentLevelCategories = foundCat.children;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
            setSelectionPath(initialPath);
            setColumns(initialColumns);
            setCurrentMobileList(initialPath.length > 0 ? initialPath[initialPath.length - 1].children || [] : categories);
        }
    }, [initialCategory, categories, isLoading]);

    const handleSelect = (category: Category, level: number) => {
        const newPath = [...selectionPath.slice(0, level), category];
        const newPathString = newPath.map(c => c.name).join(' > ');

        onSelectCategory(newPathString);
        setSelectedCategoryName(newPathString);
        setSelectionPath(newPath);

        // Logic untuk Desktop View (sudah benar)
        const newColumns = [...columns.slice(0, level + 1)];
        if (category.children && category.children.length > 0) {
            newColumns.push(category.children);
        }
        setColumns(newColumns);

        // --- PERBAIKAN DI SINI ---
        // Tambahkan baris ini untuk update list di mobile view
        setCurrentMobileList(category.children || []);
        // -------------------------

        setIdCategorie(category?.id ? category.id : 0);

        // Auto-confirm di mobile jika sudah tidak ada turunan
        if (isMobile && (!category.children || category.children.length === 0)) {
            handleConfirmCategory();
        }
    };

    const handleTabClick = (level: number) => {
        const newPath = selectionPath.slice(0, level + 1);
        setSelectionPath(newPath);

        const listToShow = level < 0 ? categories : newPath[level].children || [];
        setCurrentMobileList(listToShow);
    };

    if (isLoading) {
        return <div className="text-center p-8">Memuat kategori...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-600">{error}</div>;
    }

    if (isMobile) {
        return (
            <div className="fixed inset-0 z-50 bg-white flex flex-col font-sans">
                {/* Mobile Header */}
                <div className="flex items-center p-3 border-b shadow-sm sticky top-0 bg-white z-10">
                    <button onClick={() => setCategoryModalOpen(false)} className="p-1"><ArrowLeftIcon size={24} /></button>
                    <h2 className="text-lg font-semibold mx-auto">Pilih Kategori</h2>
                    <button className="p-1"><SearchIcon size={24} /></button>
                </div>

                {/* Mobile Tabs */}
                <div className="flex items-center border-b overflow-x-auto whitespace-nowrap text-sm">
                    <button
                        onClick={() => handleTabClick(-1)}
                        className={`py-3 px-4 ${selectionPath.length === 0 ? 'text-[#EE4D2D] border-b-2 border-[#EE4D2D]' : ''}`}
                    >
                        {categories.find(c => c.id === selectionPath[0]?.id)?.name || 'Kategori'}
                    </button>
                    {selectionPath.map((cat, index) => (
                        <React.Fragment key={cat.id}>
                            <ChevronRightIcon size={16} className="text-gray-300" />
                            <button
                                onClick={() => handleTabClick(index)}
                                className={`py-3 px-4 ${index === selectionPath.length - 1 ? 'text-[#EE4D2D] border-b-2 border-[#EE4D2D]' : ''}`}
                            >
                                {cat.name}
                            </button>
                        </React.Fragment>
                    ))}
                </div>

                {/* Mobile List */}
                <ul className="overflow-y-auto flex-grow">
                    {currentMobileList.map(cat => (
                        <li key={cat.id}>
                            <button
                                onClick={() => handleSelect(cat, selectionPath.length)}
                                className="w-full flex justify-between items-center text-left p-4 border-b"
                            >
                                <span>{cat.name}</span>
                                {cat.children && cat.children.length > 0 && <ChevronRightIcon size={20} className="text-gray-400" />}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-60 font-sans">
            <div className="bg-white rounded-md shadow-lg w-full max-w-4xl h-[700px] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Ubah Kategori</h2>
                    <button
                        onClick={() => setCategoryModalOpen(false)}
                        className="text-gray-500 hover:text-gray-800">
                        <XIcon size={24} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Masukkan nama kategori"
                            // value={searchTerm}
                            // onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-10 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <SearchIcon size={20} className="text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Category Columns */}
                <div className="flex-grow flex flex-row overflow-x-auto min-h-0">
                    {columns.map((column, colIndex) => (
                        <div
                            key={colIndex}
                            className="w-1/4 h-full border-r overflow-y-auto flex-shrink-0"
                        >
                            <ul>
                                {column.map((cat) => (
                                    <li key={cat.id}>
                                        <button
                                            onClick={() => handleSelect(cat, colIndex)}
                                            className={`w-full flex justify-between items-center text-left p-3 text-sm transition-colors ${selectionPath[colIndex]?.id === cat.id
                                                ? 'bg-[#FFFBF8] border-l-2 border-[#EE4D2D] text-[#EE4D2D] font-semibold'
                                                : 'hover:bg-gray-100'
                                                }`}
                                        >
                                            <span className="truncate pr-2">{cat.name}</span>
                                            {cat.children && cat.children.length > 0 && (
                                                <ChevronRightIcon size={16} className="text-gray-400 flex-shrink-0" />
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t mt-auto">
                    <div className="flex justify-between items-center">
                        <div className="text-sm truncate pr-4">
                            <span className="text-gray-500">Dipilih: </span>
                            <span className="font-semibold text-gray-800">{selectedCategoryName || 'Pilih kategori untuk melanjutkan'}</span>
                        </div>
                        <div>
                            <button
                                onClick={() => setCategoryModalOpen(false)}
                                className="px-6 py-2 mr-2 border rounded-sm text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmCategory}
                                disabled={selectionPath.length === 0}
                                className="px-6 py-2 bg-[#EE4D2D] text-white rounded-sm disabled:bg-opacity-70 disabled:cursor-not-allowed"
                            >
                                Konfirmasi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategorySelector;