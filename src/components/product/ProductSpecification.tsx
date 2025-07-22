import React from 'react'

interface Specification {
    [key: string]: string | string[];
}
interface ProductSpecificationProps {
    specifications: Specification;
}

const ProductSpecification: React.FC<ProductSpecificationProps> = ({ specifications }) => {
    return (
        <div className="bg-white border border-[#DDDDDD] shadow-[1px_1px_10px_rgba(0,0,0,0.08)] rounded-[5px] mt-4 p-4 sm:p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Spesifikasi Produk</h2>
            <div className="space-y-3">
                {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="flex flex-col sm:flex-row text-sm">
                        <span className="w-full sm:w-1/4 text-gray-500 mb-1 sm:mb-0">{key}</span>
                        <div className="w-full sm:w-3/4 text-gray-800">
                            {Array.isArray(value) ? (
                                <div>
                                    {value.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <a href="#" className="text-blue-600 hover:underline">{item}</a>
                                            {index < value.length - 1 && <span className="mx-1">›</span>}
                                        </React.Fragment>
                                    ))}
                                </div>
                            ) : (
                                <span>{value}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default ProductSpecification