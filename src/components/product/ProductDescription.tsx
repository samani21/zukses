import React from 'react'

interface ProductDescriptionProps {
    description: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => {
    return (
        <div className="bg-white rounded-lg shadow-[1px_1px_10px_rgba(0,0,0,0.08)] px-4 sm:p-10">
            <h2 className="text-[12px] md:text-[20px] font-[600] text-[#333333] mb-4">Deskripsi Produk</h2>
            <div className="text-[12px] md:text-[14px] text-[#333333] space-y-4">
                <p
                    dangerouslySetInnerHTML={{
                        __html: description.replace(/\r?\n/g, '<br />')
                    }}
                />

            </div>
        </div>
    );
};


export default ProductDescription