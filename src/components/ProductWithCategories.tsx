import React from 'react';
import { Product } from './types/Product';
import CardProduct from './CardProduct';


interface ProductWithCategoriesProps {
    products: Product[];
    idProduct?: number;
}

function ProductWithCategories({ products, idProduct }: ProductWithCategoriesProps) {

    return (
        <div className="container mx-auto px-0 mb-24">
            {products?.length > 0 && products?.some(product => product.id != idProduct) &&
                <h2 className="text-[22px] text-[#333333] mb-[40px]   font-[900] px-4 md:px-0 tracking-[-0.03em]" style={{
                    lineHeight: "17px"
                }}>Produk Sejenis</h2>
            }

            <div className="px-4 md:px-0 grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {products?.map((product, index) => (
                    product.id != idProduct &&
                    <CardProduct product={product} index={index} key={index} />

                ))}
            </div>
        </div >
    );
}

export default ProductWithCategories