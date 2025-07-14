import React, { useRef } from 'react';
import { Camera } from 'lucide-react';

// Definisikan props yang dibutuhkan oleh komponen ini
interface ProductImageUploaderProps {
    selectedImages: File[];
    promoImage: File | null;
    onSelectMainImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectPromoImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProductImageUploader = React.memo(({
    selectedImages,
    promoImage,
    onSelectMainImage,
    onSelectPromoImage
}: ProductImageUploaderProps) => {

    // useRef untuk promo image input agar bisa di-trigger secara manual
    const promoInputRef = useRef<HTMLInputElement | null>(null);

    // Debugging: Cek kapan komponen ini render
    console.log('Rendering ProductImageUploader...');

    return (
        <div className="rounded-lg mb-6">
            {/* BAGIAN FOTO PRODUK UTAMA */}
            <div>
                <label className="text-[#333333] font-bold text-[14px] ml-[-2px]">
                    <span className="text-red-500">*</span> Foto Produk
                </label>
                <div className="mt-1">
                    <ul className="text-[12px] text-[#555555] list-disc list-inside mb-4">
                        <li style={{ letterSpacing: "-2%" }}>Upload Foto 1:1</li>
                        <li className=''>Foto Produk yang baik akan meningkatkan minat belanja Pembeli.</li>
                    </ul>
                    <div className="flex flex-wrap gap-2 mt-2 ">
                        {selectedImages.map((img, index) => (
                            <img
                                key={index}
                                src={URL.createObjectURL(img)}
                                alt={`preview-${index}`}
                                className="w-[80px] h-[80px] object-cover border rounded"
                            />
                        ))}
                        <label className="flex flex-col items-center justify-center w-[80px] h-[80px] border-2 border-[#BBBBBB] rounded-[5px] text-center cursor-pointer hover:bg-gray-50">
                            <Camera className="w-[29px] h-[29px] mb-1 text-[#7952B3]" />
                            <span className="text-[12px] text-[#333333]">Tambah</span>
                            <span className="text-[12px] text-[#333333]">{selectedImages.length}/10</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={onSelectMainImage}
                                // Reset value agar bisa upload file yang sama lagi
                                onClick={(e) => (e.currentTarget.value = '')}
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* BAGIAN FOTO PRODUK PROMOSI */}
            <div className='mt-4'>
                <label className="text-[#333333] font-bold text-[14px] ml-[-2px]">
                    <span className="text-red-500">*</span> Foto Produk Promosi
                </label>
                <div className="mt-1">
                    <ul className="text-[12px] text-[#555555] list-disc list-inside mb-4">
                        <li style={{ letterSpacing: "-2%" }}>Upload Foto 1:1</li>
                        <li className=''>Foto Produk Promosi untuk menampilkan dihasil pencarian SEO</li>
                    </ul>
                    <div
                        className="flex flex-col items-center justify-center w-[80px] h-[80px] border-2 border-[#BBBBBB] rounded-[5px] text-center cursor-pointer hover:bg-gray-50"
                        onClick={() => promoInputRef.current?.click()}
                    >
                        {promoImage ? (
                            <img
                                src={URL.createObjectURL(promoImage)}
                                alt="Promo Preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <>
                                <Camera className="w-[29px] h-[29px] mb-1 text-[#7952B3]" />
                                <span className="text-[12px] text-[#333333]">Tambahkan</span>
                                <span className="text-[12px] text-[#333333]">0/1</span>
                            </>
                        )}
                        <input
                            ref={promoInputRef}
                            type="file"
                            accept="image/*"
                            onChange={onSelectPromoImage}
                            className="hidden"
                            // Reset value agar bisa upload file yang sama lagi
                            onClick={(e) => (e.currentTarget.value = '')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ProductImageUploader;