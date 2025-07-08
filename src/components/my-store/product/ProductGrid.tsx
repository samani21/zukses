import { Edit2, Trash2 } from 'lucide-react';
import React, { FC } from 'react'
import EmptyState from './EmptyState';
type Media = { id: string; url: string; type: string; };
type VarianPrice = { id: number; product_id: number; image: string; price: number | string; stock: number; variant_code?: string; };
type Value = { id: number; variant_id: number; value: string; ordinal: number; }
type Variant = { id: number; product_id: number; ordinal: number; values?: Value[] | null; };
type Product = { id: number; saller_id: number; name: string; category_id: number; category_name: string; is_used: number; price: number; stock: number; sales: number; desc: string; sku: string; min_purchase: number; max_purchase: string | number; image: string; media?: Media[] | null; status: string; variant_prices?: VarianPrice[] | null; variants?: Variant[]; variant_group_names?: string[]; is_cod_enabled?: number };


const ProductGrid: FC<{
    products: Product[] | null;
    onDeleteClick: (product: Product) => void;
}> = ({ products, onDeleteClick }) => {
    if (products?.length === 0) return <EmptyState />;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products?.map((product) => (
                <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                    <div className="relative">
                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                        <input type="checkbox" className="absolute top-2 left-2 h-5 w-5 rounded border-gray-400 bg-white/70 text-blue-600 focus:ring-blue-500" />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                        <p className="text-sm font-semibold text-gray-800 line-clamp-2 flex-grow">{product.name}</p>
                        <p className="text-xs text-gray-500 mt-1">SKU: {product.sku}</p>
                        <div className="mt-3">
                            <p className="text-base font-bold text-blue-600">Rp{product.price?.toLocaleString('id-ID') || 0}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 border-t border-gray-200 text-center">
                        <div className="p-2 border-r border-gray-200">
                            <p className="text-xs text-gray-500">Stok</p>
                            <p className={`text-sm font-medium ${product.stock > 0 ? 'text-gray-800' : 'text-red-500'}`}>{product.stock > 0 ? product.stock : 'Habis'}</p>
                        </div>
                        <div className="p-2 border-r border-gray-200">
                            <p className="text-xs text-gray-500">Penjualan</p>
                            <p className="text-sm font-medium text-gray-800">{product.sales || 0}</p>
                        </div>
                        <div className="p-2">
                            <p className="text-xs text-gray-500">Aksi</p>
                            <button
                                onClick={() => onDeleteClick(product)} // Panggil fungsi dari props
                                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                                aria-label={`Hapus ${product.name}`}
                            >
                                <Trash2 size={18} />
                            </button>
                            <button className="text-blue-600 hover:text-blue-900 mx-auto mt-0.5"
                                onClick={() => {
                                    window.location.href = '/my-store/add-product?type=edit'
                                    localStorage.setItem('EditProduct', JSON.stringify(product))
                                }}>
                                <Edit2 size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductGrid