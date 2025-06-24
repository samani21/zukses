import ChevronRight from 'components/common/icons/ChevronRight';
import React, { FC, useState, useEffect } from 'react';
import { Category } from 'services/api/product';

const CategorySelector: FC<{
    onSelectCategory: (path: string) => void;
    initialCategory: string;
    categories: Category[];
    isLoading: boolean;
    error: string | null;
    setIdCategorie: (value: number) => void;
}> = ({ onSelectCategory, initialCategory, categories, isLoading, error, setIdCategorie }) => {
    const [selectionPath, setSelectionPath] = useState<Category[]>([]);
    const [columns, setColumns] = useState<Category[][]>([categories]);
    const [selectedCategoryName, setSelectedCategoryName] = useState(initialCategory);

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
        }
    }, [initialCategory, categories, isLoading]);

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
        setIdCategorie(category?.id ? category.id : 0);
    };

    if (isLoading) {
        return <div className="text-center p-8">Memuat kategori...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-600">{error}</div>;
    }

    return (
        <div>
            <div className="mb-4 p-2 bg-gray-100 rounded-md">
                <span className="text-sm text-gray-500">Kategori Dipilih: </span>
                <span className="font-semibold text-gray-800">{selectedCategoryName || 'Belum ada'}</span>
            </div>
            <div className="flex space-x-4 min-h-[300px]">
                {columns.map((column, colIndex) => (
                    <div key={colIndex} className="w-1/3 border-r pr-2 last:border-r-0 overflow-y-auto">
                        <ul className="space-y-1">
                            {column.map(cat => (
                                <li key={cat.id}>
                                    <button
                                        onClick={() => handleSelect(cat, colIndex)}
                                        className={`w-full flex justify-between items-center text-left p-2 rounded-md text-sm transition-colors ${selectionPath[colIndex]?.id === cat.id ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}
                                    >
                                        <span>{cat.name}</span>
                                        {cat.children && cat.children.length > 0 && <ChevronRight size={16} className="text-gray-400" />}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default CategorySelector;