import React from 'react';

const StarIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
);

interface Product {
    id: number;
    name: string;
    category: string;
    price: string;
    location: string;
    imageUrl: string;
    rating: number;
    sold: number;
}

interface ProductListProps {
    products: Product[];
    selectedCategory: string;
}

function ProductList({ products, selectedCategory }: ProductListProps) {
    const filteredProducts = selectedCategory === 'Semua'
        ? products
        : products.filter(p => p.category === selectedCategory);

    return (
        <div className="container mx-auto p-4 md:px-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Produk untuk Anda</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {filteredProducts.map(product => (
                    <a key={product.id} className="bg-white rounded-lg overflow-hidden group" onClick={() => window.location.href = `/${product.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        <img src={product.imageUrl} alt={product.name} className="w-full group-hover:opacity-90" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=Produk'; }} />
                        <div className="p-4 pl-0">
                            <h3 className="text-sm text-gray-700 truncate">{product.name}</h3>
                            <p className="text-base font-bold mt-1">Rp{product.price}</p>
                            <p className="text-xs text-gray-500 mt-2">{product.location}</p>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                                <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                                <span>{product.rating} | Terjual {product.sold}+</span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

export default ProductList