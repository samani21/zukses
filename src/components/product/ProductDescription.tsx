import React from 'react'

interface ProductDescriptionProps {
    description: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => {
    return (
        <div className="bg-white rounded-lg shadow-md mt-4 p-4 sm:p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Deskripsi Produk</h2>
            <div className="text-sm text-gray-700 space-y-4">
                <p>{description}</p>
            </div>
        </div>
    );
};


export default ProductDescription