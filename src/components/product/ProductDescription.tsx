import React, { useState } from 'react';

interface ProductDescriptionProps {
    description: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        setExpanded(prev => !prev);
    };

    return (
        <div className="bg-white border border-[#DDDDDD] shadow-[1px_1px_10px_rgba(0,0,0,0.08)] rounded-[5px] px-4 sm:p-10">
            <h2 className="text-[12px] md:text-[20px] font-[600] text-[#333333] mb-4">Deskripsi Produk</h2>
            <div
                className={`
                    text-[12px] md:text-[14px] text-[#333333] space-y-4 
                    ${!expanded ? 'line-clamp-[10] md:line-clamp-none overflow-hidden' : ''}
                `}
            >
                <p
                    dangerouslySetInnerHTML={{
                        __html: description.replace(/\r?\n/g, '<br />'),
                    }}
                />
            </div>
            {/* Tombol hanya muncul di mobile */}
            <div
                className="text-[#4A52B2] text-[12px] font-[500] mt-4 md:hidden cursor-pointer"
                onClick={toggleExpanded}
            >
                {expanded ? 'Tampilkan Lebih Sedikit' : 'Baca Selengkapnya'}
            </div>
        </div>
    );
};

export default ProductDescription;
