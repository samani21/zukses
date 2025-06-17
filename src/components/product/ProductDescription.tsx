import React from 'react'

interface Description {
    intro: string;
    condition: string[];
    completeness: string[];
    notes: string[];
}

interface ProductDescriptionProps {
    description: Description;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => {
    return (
        <div className="bg-white rounded-lg shadow-md mt-4 p-4 sm:p-6 mb-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Deskripsi Produk</h2>
            <div className="text-sm text-gray-700 space-y-4">
                <p>{description.intro}</p>

                <div>
                    <h3 className="font-semibold mb-1">Kondisi barang:</h3>
                    <ul className="list-disc list-inside space-y-1">
                        {description.condition.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold mb-1">Kelengkapan:</h3>
                    <ul className="list-disc list-inside space-y-1">
                        {description.completeness.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold mb-1">Catatan:</h3>
                    <ul className="list-disc list-inside space-y-1">
                        {description.notes.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
};


export default ProductDescription