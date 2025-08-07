import React from 'react';
import { Product } from './types/Product';
import CardProduct from './CardProduct';



interface OtherProductProps {
    products: Product[];
    idProduct?: number
}

function OtherProduct({ products, idProduct }: OtherProductProps) {

    return (
        <div className="container mx-auto md:px-0 py-4">
            {
                products?.length > 0 && products?.some(product => product.id != idProduct) &&
                <h2 className="text-[22px] text-[#333333] mb-[40px]   font-[900] px-4 md:px-0 tracking-[-0.03em]" style={{
                    lineHeight: "17px"
                }}>Produk lain dari toko ini</h2>
            }
            <div className="overflow-x-auto scroll-smooth scrollbar-hide ">
                <div className="flex gap-4 px-4 md:px-0 w-max">
                    {products?.map((product, index) => (
                        product.id != idProduct &&
                        <CardProduct product={product} index={index} key={index} />

                    ))}
                </div>
            </div>


        </div >
    );
}

export default OtherProduct