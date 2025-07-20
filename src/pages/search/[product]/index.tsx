import React, { useState } from 'react';
import { Star, Menu } from 'lucide-react';
import MainLayout from 'pages/layouts/MainLayout';

// Since we are in a self-contained environment, we'll define types here.
// In a real Next.js app, you might put these in a types/index.ts file.
type Product = {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    location: string;
    imageUrl: string;
    codAvailable: boolean;
};

// Mock data simulating an API response
const mockProducts: Product[] = Array(12).fill({
    id: 1,
    name: 'Kemko pendek/Kemeja list songket/Kemeja pria',
    price: 185000,
    originalPrice: 268000,
    rating: 4.9,
    reviews: 1000,
    location: 'Kota Makassar',
    imageUrl: 'https://placehold.co/300x300/8B5CF6/FFFFFF?text=Produk',
    codAvailable: true,
}).map((p, index) => ({ ...p, id: index + 1 })); // Ensure unique IDs

// Helper to format currency
const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

// --- Sub-components ---

const FilterCheckbox = ({ id, label }: { id: string; label: string }) => (
    <div className="flex items-center mb-2">
        <input
            id={id}
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor={id} className="ml-3 text-sm text-gray-600">
            {label}
        </label>
    </div>
);

const FilterSidebar = () => {
    const locations = ['Aceh', 'Banten', 'Bengkulu', 'Bali', 'Kalimantan Barat', 'Kalimantan Timur', 'Papua Barat'];
    return (
        <aside className="w-full lg:w-64 xl:w-72">
            <h2 className="text-lg font-semibold mb-4">Filter</h2>

            {/* Location Filter */}
            <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Lokasi</h3>
                {locations.map(loc => <FilterCheckbox key={loc} id={`loc-${loc}`} label={loc} />)}
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 mt-2 inline-block">Lainnya &gt;</a>
            </div>

            {/* Payment Method Filter */}
            <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Metode Pembayaran</h3>
                <FilterCheckbox id="payment-cod" label="COD (Bayar di Tempat)" />
                <FilterCheckbox id="payment-transfer" label="Transfer" />
            </div>

            {/* Item Condition Filter */}
            <div>
                <h3 className="font-semibold text-gray-800 mb-3">Kondisi Barang</h3>
                <FilterCheckbox id="condition-new" label="Baru" />
                <FilterCheckbox id="condition-used" label="Bekas di Pakai" />
            </div>
        </aside>
    );
};

const ProductCard = ({ product }: { product: Product }) => {
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col">
            <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x300/CCCCCC/FFFFFF?text=Error'; }}
            />
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-sm text-gray-800 mb-2 flex-grow">{product.name}</h3>
                <p className="text-lg font-bold text-gray-900 mb-2">{formatRupiah(product.price)}</p>
                <div className="flex items-center gap-2 mb-2">
                    {product.codAvailable && (
                        <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-0.5 rounded-md">
                            COD
                        </span>
                    )}
                    {discount > 0 && (
                        <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-md">
                            {discount}%
                        </span>
                    )}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span>{product.rating}</span>
                    <span className="mx-1">|</span>
                    <span>{product.reviews >= 1000 ? `${(product.reviews / 1000).toFixed(0)}rb+` : product.reviews} terjual</span>
                </div>
                <p className="text-sm text-gray-500">{product.location}</p>
            </div>
        </div>
    );
};

const ProductGrid = ({ products }: { products: Product[] }) => (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map(product => (
            <ProductCard key={product.id} product={product} />
        ))}
    </div>
);


// --- Main App Component ---

export default function App() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen font-sans px-2 mb-24 md:mb-0 md:px-40">
                <div className="container mx-auto px-0 py-8">
                    {/* Header */}
                    <div className="mb-6 flex justify-between items-center">
                        {/* <h1 className="text-xl md:text-2xl text-gray-800">
                            Hasil Pencarian untuk <span className="font-bold">Laptop</span>
                        </h1> */}
                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="lg:hidden flex items-center p-2 rounded-md border bg-white text-gray-600 hover:bg-gray-100"
                        >
                            <Menu className="w-5 h-5 mr-2" />
                            Filter
                        </button>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar */}
                        {/* Hidden on mobile, shown via state, always visible on desktop */}
                        <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
                            <FilterSidebar />
                        </div>

                        {/* Main Content */}
                        <main className="flex-1">
                            <ProductGrid products={mockProducts} />
                            <div className="text-center mt-8">
                                <button className="bg-white text-indigo-600 border border-indigo-600 px-12 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors duration-200">
                                    Muat Lebih Banyak
                                </button>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
