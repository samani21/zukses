import { Edit2, Search } from 'lucide-react';
import React, { FC } from 'react'
import CustomDropdown from './CustomDropdown';

const FilterBar: FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative md:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
                type="text"
                placeholder="Cari Nama Produk, SKU..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        </div>
        <div className="relative">
            <input
                type="text"
                placeholder="Cari berdasarkan kategori"
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Edit2 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
        <CustomDropdown placeholder="Program Shopee" />
        <CustomDropdown placeholder="Tipe Produk" />
        <div className="flex items-center space-x-3 md:col-span-2 lg:col-span-4">
            <button className="px-6 py-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition-colors">
                Terapkan
            </button>
            <button className="px-6 py-2 text-gray-600 rounded-md hover:bg-gray-100 transition-colors">
                Atur ulang
            </button>
        </div>
    </div>
);

export default FilterBar