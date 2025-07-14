import { useMediaQuery } from '@mui/material';
import { ArrowLeftIcon, ChevronRightIcon, SearchIcon, XIcon } from 'lucide-react';
import React, { FC, useState, useEffect, useRef } from 'react';
// Pastikan path import ini sesuai dengan struktur proyek Anda
import { Category } from 'services/api/product';

type SearchResult = {
    id: number;
    name: string;
    path: Category[];
    pathString: string;
}

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
    // State utama
    const [selectionPath, setSelectionPath] = useState<Category[]>([]);
    const [columns, setColumns] = useState<Category[][]>([categories]);
    const [selectedCategoryName, setSelectedCategoryName] = useState(initialCategory);

    // State untuk pencarian
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // State untuk UI
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [currentMobileList, setCurrentMobileList] = useState<Category[]>(categories);
    const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);

    // State untuk fix auto-konfirmasi
    const [autoConfirmPending, setAutoConfirmPending] = useState(false);

    const columnsContainerRef = useRef<HTMLDivElement>(null);
    const mobileSearchInputRef = useRef<HTMLInputElement>(null);
    // --- TAMBAHAN ---
    const mobileTabsRef = useRef<HTMLDivElement>(null); // Ref untuk kontainer tab mobile

    // --- FUNGSI & LOGIKA ---

    const findAllCategoryPaths = (nodes: Category[], term: string, currentPath: Category[] = []): SearchResult[] => {
        let results: SearchResult[] = [];
        const lowercasedTerm = term.toLowerCase();
        for (const node of nodes) {
            const newPath = [...currentPath, node];
            if (node.name.toLowerCase().includes(lowercasedTerm)) {
                results.push({ id: node.id, name: node.name, path: newPath, pathString: newPath.map(p => p.name).join(' > ') });
            }
            if (node.children && node.children.length > 0) {
                results = results.concat(findAllCategoryPaths(node.children, term, newPath));
            }
        }
        return results;
    };

    // --- KUMPULAN useEffect ---

    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        const handler = setTimeout(() => {
            const results = findAllCategoryPaths(categories, searchTerm);
            setSearchResults(results);
            setIsSearching(false);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm, categories]);

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
                    } else break;
                } else break;
            }
            setSelectionPath(initialPath);
            setColumns(initialColumns);

            let listForMobile = categories;
            if (initialPath.length > 1) {
                const parentOfLastSelected = initialPath[initialPath.length - 2];
                listForMobile = parentOfLastSelected.children || [];
            }
            setCurrentMobileList(listForMobile);
        }
    }, [initialCategory, categories, isLoading]);

    useEffect(() => {
        if (columnsContainerRef.current) {
            columnsContainerRef.current.scrollLeft = columnsContainerRef.current.scrollWidth;
        }
    }, [columns]);

    useEffect(() => {
        if (isMobileSearchActive && mobileSearchInputRef.current) {
            mobileSearchInputRef.current.focus();
        }
    }, [isMobileSearchActive]);

    useEffect(() => {
        if (autoConfirmPending) {
            handleConfirmCategory();
            setAutoConfirmPending(false);
        }
    }, [autoConfirmPending, handleConfirmCategory]);

    // --- TAMBAHAN ---
    // Efek untuk auto-scroll tab mobile ke kanan
    useEffect(() => {
        if (mobileTabsRef.current) {
            mobileTabsRef.current.scrollLeft = mobileTabsRef.current.scrollWidth;
        }
    }, [selectionPath]);

    const handleSelect = (category: Category, level: number) => {
        const newPath = [...selectionPath.slice(0, level), category];
        const newPathString = newPath.map(c => c.name).join(' > ');
        onSelectCategory(newPathString);
        setSelectedCategoryName(newPathString);
        setSelectionPath(newPath);

        const newColumns = [...columns.slice(0, level + 1)];
        if (category.children && category.children.length > 0) {
            newColumns.push(category.children);
        }
        setColumns(newColumns);

        setCurrentMobileList(category.children || []);
        setIdCategorie(category?.id ? category.id : 0);

        if (isMobile && (!category.children || category.children.length === 0)) {
            setAutoConfirmPending(true);
        }
    };

    const handleSelectSearchResult = (result: SearchResult) => {
        const finalCategory = result.path[result.path.length - 1];
        setSelectionPath(result.path);
        setSelectedCategoryName(result.pathString);
        setIdCategorie(result.id);
        onSelectCategory(result.pathString);

        const newColumns: Category[][] = [categories];
        result.path.forEach(pathItem => {
            if (pathItem.children && pathItem.children.length > 0) newColumns.push(pathItem.children);
        });
        setColumns(newColumns);

        const parentOfFinal = result.path.length > 1 ? result.path[result.path.length - 2] : null;
        setCurrentMobileList(parentOfFinal ? parentOfFinal.children || [] : categories);

        setSearchTerm('');
        setSearchResults([]);
        setIsMobileSearchActive(false);

        if (!finalCategory.children || finalCategory.children.length === 0) {
            setAutoConfirmPending(true);
        }
    };

    const handleTabClick = (level: number) => {
        const newPath = selectionPath.slice(0, level + 1);
        setSelectionPath(newPath);
        const listToShow = level < 0 ? categories : (selectionPath[level]?.children || []);
        setCurrentMobileList(listToShow);
    };

    const closeMobileSearch = () => {
        setIsMobileSearchActive(false);
        setSearchTerm('');
    };

    if (isLoading) return <div className="p-8 text-center">Memuat kategori...</div>;
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

    if (isMobile) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col bg-white font-sans">
                {/* Mobile Header */}
                <div className="sticky top-0 z-10 flex items-center p-3 bg-white border-b border-gray-500 shadow-sm">
                    {isMobileSearchActive ? (
                        <>
                            <button onClick={closeMobileSearch} className="p-1 mr-2"><ArrowLeftIcon size={24} /></button>
                            <input
                                ref={mobileSearchInputRef}
                                type="text"
                                placeholder="Cari nama kategori"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-full bg-transparent focus:outline-none"
                            />
                        </>
                    ) : (
                        <>
                            <button onClick={() => setCategoryModalOpen(false)} className="p-1"><ArrowLeftIcon size={24} /></button>
                            <h2 className="mx-auto text-lg font-semibold">Pilih Kategori</h2>
                            <button onClick={() => setIsMobileSearchActive(true)} className="p-1"><SearchIcon size={24} /></button>
                        </>
                    )}
                </div>

                {/* Mobile Content */}
                {isMobileSearchActive ? (
                    <div className="flex-grow overflow-y-auto">
                        {isSearching ? <p className="p-4 text-center text-gray-500">Mencari...</p>
                            : searchResults.length > 0 ? (
                                <ul>
                                    {searchResults.map((result) => (
                                        <li key={result.id}>
                                            <button onClick={() => handleSelectSearchResult(result)} className="w-full p-4 text-left border-b hover:bg-gray-100">
                                                <span className="font-semibold text-gray-800">{result.name}</span>
                                                <p className="text-sm text-gray-500">{result.pathString}</p>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                searchTerm && <p className="p-4 text-center text-gray-500">Kategori tidak ditemukan.</p>
                            )}
                    </div>
                ) : (
                    <>
                        <div ref={mobileTabsRef} className="flex items-center text-sm border-b border-gray-300 whitespace-nowrap overflow-x-auto">
                            <button onClick={() => handleTabClick(-1)} className={`py-3 px-4 flex-shrink-0 ${selectionPath.length === 0 ? 'text-[#7952B3] border-b-2 border-[#7952B3]' : ''}`}>
                                Pilihan
                            </button>
                            {selectionPath.map((cat, index) => (
                                <React.Fragment key={cat.id}>
                                    <ChevronRightIcon size={16} className="text-gray-300 flex-shrink-0" />
                                    <button onClick={() => handleTabClick(index)} className={`py-3 px-4 flex-shrink-0 ${index === selectionPath.length - 1 ? 'text-[#7952B3] border-b-2 border-[#7952B3]' : ''}`}>
                                        {cat.name}
                                    </button>
                                </React.Fragment>
                            ))}
                        </div>
                        <ul className="flex-grow overflow-y-auto">
                            {currentMobileList.map(cat => (
                                <li key={cat.id}>
                                    <button onClick={() => handleSelect(cat, selectionPath.length)} className="flex items-center justify-between w-full p-4 text-left border-b border-gray-300">
                                        <span>{cat.name}</span>
                                        {cat.children && cat.children.length > 0 && <ChevronRightIcon size={20} className="text-[#E9E9E9]" />}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 font-sans">
            <div className="bg-white rounded-sm shadow-lg w-[955px] h-[543px] flex flex-col">
                <div className='bg-white w-full h-[480px] flex flex-col'>
                    <div className="flex items-center text-[#555555] text-[20px] font-[500] justify-between p-4 pb-0 px-5">
                        <h2 className="text-[20px]">Pilih Kategori</h2>
                        <button onClick={() => setCategoryModalOpen(false)} className="text-[#E9E9E9] hover:text-gray-600">
                            <XIcon size={24} className='text-[#555555]' />
                        </button>
                    </div>
                    <div className="py-4 w-full px-8 pt-3">
                        <div className="relative bg-white rounded-[5px] flex items-center p-2 gap-2 border border-[#E9E9E9] h-[40px]">
                            <input
                                type="text"
                                placeholder="Masukkan min. 1 karakter"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full text-dark focus:outline-none text-[14px] placeholder:text-[#888888] "
                            />
                            <div className="">
                                <SearchIcon size={20} className="text-[#888888]" />
                            </div>
                        </div>
                    </div>

                    <div className="flex-grow min-h-0 overflow-y-auto  mb-4 bg-white px-8">
                        {searchTerm.trim() !== '' ? (
                            <div>
                                {isSearching ? (
                                    <p className="p-4 text-center text-gray-500">Mencari...</p>
                                ) : searchResults.length > 0 ? (
                                    <ul>
                                        {searchResults.map((result) => (
                                            <li key={result.id}>
                                                <button onClick={() => handleSelectSearchResult(result)} className="w-full p-4 text-left border-b border-[#E9E9E9] hover:bg-gray-100">
                                                    <span className="font-semibold text-gray-800">{result.name}</span>
                                                    <p className="text-sm text-gray-500">{result.pathString}</p>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="p-4 text-center text-gray-500">Kategori tidak ditemukan.</p>
                                )}
                            </div>
                        ) : (
                            // TAMPILAN KOLOM KATEGORI (Default)
                            <div ref={columnsContainerRef} className="flex flex-row h-full overflow-x-auto bg-gray-50/50 border border-[#E9E9E9] custom-scrollbar">
                                {columns.map((column, colIndex) => (
                                    <div key={colIndex} className="w-1/4 h-full bg-white border-r border-[#E9E9E9] overflow-y-auto flex-shrink-0 custom-scrollbar">
                                        <ul>
                                            {column.map((cat) => (
                                                <li key={cat.id}>
                                                    <button onClick={() => handleSelect(cat, colIndex)} className={`w-full flex justify-between text-[14px] items-center text-left p-3 text-sm transition-colors ${selectionPath[colIndex]?.id === cat.id ? 'bg-[#FFFBF8] text-[#7952B3]' : 'text-[#333333] hover:bg-gray-100'}`}>
                                                        <span className={`truncate pr-2 ${selectionPath[colIndex]?.id === cat.id ? 'font-bold' : ''}`}>{cat.name}</span>
                                                        {cat.children && cat.children.length > 0 && <ChevronRightIcon
                                                            size={20}
                                                            className={`${selectionPath[colIndex]?.id === cat.id ? 'text-[#7952B3]' : 'text-dark'} ml-2 flex-shrink-0`}
                                                        />
                                                        }
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
                <div className="px-5 pb-5 mt-auto bg-white">
                    <div className="flex items-center justify-between">
                        <div className="pr-4 text-sm truncate">
                            <span className="text-[14px] text-[#555555] font-bold">Dipilih: {selectedCategoryName || 'Pilih kategori untuk melanjutkan'}</span>
                        </div>
                        <div className='flex justify-right items-center'>
                            <button onClick={() => setCategoryModalOpen(false)} className="px-6 py-2 mr-2 w-[125px] text-[#333333] font-bold bg-white border text-[14px]  border-[#52357B] rounded-[5px] hover:bg-gray-100">Batal</button>
                            <button onClick={handleConfirmCategory} disabled={!selectedCategoryName} className="px-6 py-2 w-[125px] text-white bg-[#F77000] rounded-[5px] text-[14px] font-bold disabled:bg-[#F77000] disabled:cursor-not-allowed">Konfirmasi</button>
                        </div>
                    </div>
                </div>
                {/* Footer */}
            </div>
        </div>
    );
};

export default CategorySelector;