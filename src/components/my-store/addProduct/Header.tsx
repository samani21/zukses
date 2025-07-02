import React, { FC } from 'react'
import { ChevronDownIcon, ChevronRight, GridIcon, ListIcon, ShoppingBag } from './Icon';
import { ShopProfile } from 'components/types/ShopProfile';

interface HeaderProps {
    shopProfile: ShopProfile;
}

const Header: FC<HeaderProps> = ({ shopProfile }) => {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-3">
                    {/* Left side: Logo and Breadcrumbs */}
                    <div className="flex items-center gap-4 text-sm">
                        <div className="bg-orange-500 p-1.5 rounded-md flex-shrink-0">
                            <ShoppingBag size={20} className="text-white" />
                        </div>
                        <nav className="hidden md:flex items-center gap-2 text-gray-500 whitespace-nowrap">
                            <a href="#" className="hover:text-orange-500">Beranda</a>
                            <ChevronRight size={16} />
                            <a href="#" className="hover:text-orange-500">Produk Saya</a>
                            <ChevronRight size={16} />
                            <span className="font-semibold text-gray-800">Tambah Produk Baru</span>
                        </nav>
                    </div>

                    {/* Right side: Icons and User Dropdown */}
                    <div className="flex items-center gap-4">
                        <button className="text-gray-500 hover:text-gray-800 p-1 rounded-md hover:bg-gray-100">
                            <GridIcon size={20} />
                        </button>
                        <button className="text-gray-500 hover:text-gray-800 p-1 rounded-md hover:bg-gray-100">
                            <ListIcon size={20} />
                        </button>
                        <div className="w-px h-6 bg-gray-200"></div>
                        <button className="flex items-center gap-2 text-sm p-1 rounded-md hover:bg-gray-100">
                            <img src={shopProfile?.logo_url} className='w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center' />
                            <span className="hidden sm:inline font-semibold text-gray-800">{shopProfile?.shop_name}</span>
                            <ChevronDownIcon size={16} className="text-gray-500" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header