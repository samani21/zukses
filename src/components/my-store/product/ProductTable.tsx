import React, { FC } from 'react'
import HeaderWithInfo from './HeaderWithInfo';
import { Edit2 } from 'lucide-react';
import EmptyState from './EmptyState';
type Media = { id: string; url: string; type: string; };
type VarianPrice = { id: number; product_id: number; image: string; price: number | string; stock: number; variant_code?: string; };
type Value = { id: number; variant_id: number; value: string; ordinal: number; }
type Variant = { id: number; product_id: number; ordinal: number; values?: Value[] | null; };
type Product = { id: number; saller_id: number; name: string; category_id: number; category_name: string; is_used: number; price: number; stock: number; sales: number; desc: string; sku: string; min_purchase: number; max_purchase: string | number; image: string; media?: Media[] | null; status: string; variant_prices?: VarianPrice[] | null; variants?: Variant[]; variant_group_names?: string[]; };


const ProductTable: FC<{
    products: Product[] | null;
}> = ({ products }) => {
    if (products?.length === 0) return <EmptyState />;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="pl-4 pr-2 py-3">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Produk
                        </th>
                        <HeaderWithInfo title="Penjualan" />
                        <HeaderWithInfo title="Harga" />
                        <HeaderWithInfo title="Stok" />
                        <HeaderWithInfo title="Kualitas Info" />
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products?.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                            <td className="pl-4 pr-2 py-4">
                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-16 w-16 sm:h-20 sm:w-20">
                                        <img className="h-full w-full rounded-md object-cover" src={product.image} alt={product.name} />
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-sm font-medium text-gray-900 line-clamp-2 max-w-[150px] sm:max-w-xs">{product.name}</div>
                                        <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{product.sales || 0}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                Rp{product?.price?.toLocaleString('id-ID') || 0}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm">
                                {product.stock > 0 ? (
                                    <span className="text-gray-900">{product.stock}</span>
                                ) : (
                                    <span className="text-red-600 font-medium">Habis</span>
                                )}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    0%
                                </span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-blue-600 hover:text-blue-900">
                                    <Edit2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable