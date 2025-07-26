import { ChevronDown, Plus } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { FC } from 'react';


const PageHeader: FC = () => {
    const router = useRouter()
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 px-4 sm:px-6 lg:px-8 pt-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Produk Saya</h1>
            <div className="flex flex-wrap items-center gap-2">
                <button className="flex items-center justify-center text-sm px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
                    <span>Pengaturan Produk</span>
                    <ChevronDown size={16} className="ml-2" />
                </button>
                <button className="flex items-center justify-center text-sm px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
                    <span>Pengaturan Massal</span>
                    <ChevronDown size={16} className="ml-2" />
                </button>
                <button
                    className="flex items-center justify-center text-sm px-4 py-2 border border-transparent rounded-md bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() => router?.push('/my-store/add-product')}
                >
                    <Plus size={16} className="mr-2" />
                    <span>Tambah Produk Baru</span>
                </button>
            </div>
        </div>
    )
};

export default PageHeader;
