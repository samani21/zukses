import React, { useRef } from 'react';
import { Camera, X } from 'lucide-react';

interface ProductImageUploaderProps {
    selectedImages: (File | string)[];
    promoImage: File | string | null;
    onSelectMainImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onReplaceMainImage: (index: number, file: File) => void;
    onRemoveMainImage: (index: number) => void;
    errorPromo?: string;
    errorImages?: string;
    onReplacePromoImage: (file: File) => void;
    onRemovePromoImage: () => void;
}

const ProductImageUploader = React.memo(({
    selectedImages,
    promoImage,
    onSelectMainImage,
    onReplaceMainImage,
    onRemoveMainImage,
    onReplacePromoImage,
    onRemovePromoImage,
    errorImages,
    errorPromo
}: ProductImageUploaderProps) => {
    const replaceInputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const promoAddInputRef = useRef<HTMLInputElement | null>(null);
    const promoReplaceInputRef = useRef<HTMLInputElement | null>(null);

    console.log('Rendering ProductImageUploader...');

    return (
        <div className="rounded-lg mb-6">
            {/* FOTO PRODUK UTAMA */}
            <div>
                <label className="text-[#333333] font-bold text-[14px] ml-[-2px]">
                    <span className="text-red-500">*</span> Foto Produk
                </label>
                <ul className="text-[12px] text-[#555555] list-disc list-inside mb-4 mt-1">
                    <li style={{ letterSpacing: "-2%" }}>Upload Foto 1:1</li>
                    <li>Foto Produk yang baik akan meningkatkan minat belanja Pembeli.</li>
                </ul>

                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedImages.map((img, index) => (
                        <div key={index} className="relative w-[80px] h-[80px]">
                            <img
                                src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                                alt={`preview-${index}`}
                                className="w-full h-full object-cover border rounded cursor-pointer"
                                onClick={() => replaceInputRefs.current[index]?.click()}
                            />
                            <button
                                className="absolute top-[-6px] right-[-6px] bg-white border border-gray-300 rounded-full p-[2px] hover:bg-gray-100"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveMainImage(index);
                                }}
                                type="button"
                            >
                                <X className="w-4 h-4 text-gray-600" />
                            </button>
                            <input
                                ref={(el) => {
                                    replaceInputRefs.current[index] = el;
                                }}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        onReplaceMainImage(index, e.target.files[0]);
                                    }
                                }}
                                onClick={(e) => (e.currentTarget.value = '')}
                            />
                        </div>
                    ))}

                    {selectedImages.length < 10 && (
                        <label className="flex flex-col items-center justify-center w-[80px] h-[80px] border-2 border-[#BBBBBB] rounded-[5px] text-center cursor-pointer hover:bg-gray-50">
                            <Camera className="w-[29px] h-[29px] mb-1 text-[#7952B3]" />
                            <span className="text-[12px] text-[#333333]">Tambah</span>
                            <span className="text-[12px] text-[#333333]">{selectedImages.length}/10</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={onSelectMainImage}
                                onClick={(e) => (e.currentTarget.value = '')}
                            />
                        </label>
                    )}
                </div>
                {errorImages && (
                    <div className="text-red-500 text-sm mt-1">{errorImages}</div>
                )}
            </div>

            {/* FOTO PROMOSI */}
            <div className="mt-4">
                <label className="text-[#333333] font-bold text-[14px] ml-[-2px]">
                    <span className="text-red-500">*</span> Foto Produk Promosi
                </label>
                <ul className="text-[12px] text-[#555555] list-disc list-inside mb-4 mt-1">
                    <li style={{ letterSpacing: "-2%" }}>Upload Foto 1:1</li>
                    <li>Foto Produk Promosi untuk menampilkan di hasil pencarian SEO</li>
                </ul>

                <div
                    className="relative flex flex-col items-center justify-center w-[80px] h-[80px] border-2 border-[#BBBBBB] rounded-[5px] text-center cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                        if (promoImage) {
                            promoReplaceInputRef.current?.click();
                        } else {
                            promoAddInputRef.current?.click();
                        }
                    }}
                >
                    {promoImage ? (
                        <>
                            <img
                                src={typeof promoImage === 'string' ? promoImage : URL.createObjectURL(promoImage)}
                                alt="Promo Preview"
                                className="w-full h-full object-cover rounded"
                            />
                            <button
                                className="absolute top-[-6px] right-[-6px] bg-white border border-gray-300 rounded-full p-[2px] hover:bg-gray-100"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemovePromoImage();
                                }}
                                type="button"
                            >
                                <X className="w-4 h-4 text-gray-600" />
                            </button>
                        </>
                    ) : (
                        <>
                            <Camera className="w-[29px] h-[29px] mb-1 text-[#7952B3]" />
                            <span className="text-[12px] text-[#333333]">Tambahkan</span>
                            <span className="text-[12px] text-[#333333]">0/1</span>
                        </>
                    )}

                    {/* Tambah gambar promo */}
                    <input
                        ref={promoAddInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                onReplacePromoImage(e.target.files[0]);
                            }
                        }}
                        onClick={(e) => (e.currentTarget.value = '')}
                    />

                    {/* Ganti gambar promo */}
                    <input
                        ref={promoReplaceInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                onReplacePromoImage(e.target.files[0]);
                            }
                        }}
                        onClick={(e) => (e.currentTarget.value = '')}
                    />
                </div>
                {errorPromo && (
                    <div className="text-red-500 text-sm mt-1">{errorPromo}</div>
                )}
            </div>
        </div>
    );
});

ProductImageUploader.displayName = 'ProductImageUploader';
export default ProductImageUploader;
