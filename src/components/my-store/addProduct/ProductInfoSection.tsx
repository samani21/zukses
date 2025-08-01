import React from 'react';
import ProductImageUploader from 'components/my-store/addProduct/ProductImageUploader';
import VideoUploader from 'components/my-store/addProduct/VideoUploader';
import { Pencil } from 'lucide-react';
import { TextInput, TextAreaInput } from './FormInputs';
import { TipKey } from './tipsStore';

interface ProductInfoSectionProps {
    setTipKey: (key: TipKey) => void;
    selectedImages: (File | string)[];
    promoImage: File | null | string;
    onSelectMainImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onReplaceMainImage: (index: number, file: File) => void;
    onRemoveMainImage: (index: number) => void;
    onReplacePromoImage: (file: File) => void;
    onRemovePromoImage: () => void;
    errorPromo?: string;
    errorImages?: string;
    videoFile: File | null | string | string[];
    urlvideoFile: string | null;
    onVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    productName: string;
    setProductName: (name: string) => void;
    errors: { [key: string]: string };
    category: string;
    setTempCategory: (category: string) => void;
    setCategoryModalOpen: (isOpen: boolean) => void;
    description: string;
    setDescription: (desc: string) => void;
    brand: string;
    setBrand: (brand: string) => void;
    countryOrigin: string;
    setCountryOrigin: (origin: string) => void;
}

const ProductInfoSection = (props: ProductInfoSectionProps) => {
    const {
        setTipKey, selectedImages, promoImage, onSelectMainImage, onReplaceMainImage, onRemoveMainImage,
        onReplacePromoImage, onRemovePromoImage, errorPromo, errorImages, videoFile, urlvideoFile, onVideoChange,
        productName, setProductName, errors, category, setTempCategory, setCategoryModalOpen,
        description, setDescription
    } = props;

    return (
        <div id="informasi-produk-section" className='border border-[#DCDCDC] py-6 rounded-[5px]'>
            <h1 className="font-bold text-[20px] text-[#483AA0] mb-4 px-7.5">Informasi Produk</h1>

            <div className="rounded-lg mb-6">
                <div onMouseEnter={() => setTipKey('photo')} onMouseLeave={() => setTipKey('default')}>
                    <ProductImageUploader
                        selectedImages={selectedImages}
                        promoImage={promoImage}
                        onSelectMainImage={onSelectMainImage}
                        onReplaceMainImage={onReplaceMainImage}
                        onRemoveMainImage={onRemoveMainImage}
                        onReplacePromoImage={onReplacePromoImage}
                        onRemovePromoImage={onRemovePromoImage}
                        errorPromo={errorPromo}
                        errorImages={errorImages}
                    />
                </div>
                <hr className="mt-2 mb-4 border-[#CCCCCC]" />
                <div onMouseEnter={() => setTipKey('video')} onMouseLeave={() => setTipKey('default')} className='px-8'>
                    <VideoUploader videoFile={videoFile} onVideoChange={onVideoChange} urlvideoFile={urlvideoFile} />
                </div>
            </div>
            <hr className="mt-2 mb-4 border-[#CCCCCC]" />

            <div className="space-y-4 px-8">
                <div id="productName" onMouseEnter={() => setTipKey('name')} onMouseLeave={() => setTipKey('default')}>
                    <TextInput label="Nama Produk" placeholder="Masukkan Nama Produk" maxLength={255} value={productName} setValue={setProductName} required />
                    {errors.productName && <div className="text-red-500 text-sm mt-1">{errors.productName}</div>}
                </div>
                <div className="mt-[-15px] rounded-md text-[12px] text-[#333333]">
                    <span className="font-bold text-[14px]">Tips!. </span> Masukkan Nama Merek + Tipe Produk + Fitur Produk (Bahan, Warna, Ukuran, Variasi)
                </div>
                <div id="category" onMouseEnter={() => setTipKey('category')} onMouseLeave={() => setTipKey('default')}>
                    <label className="text-[#333333] font-bold text-[16px]">
                        Kategori <span className='bg-[#FACACA] p-1 px-3 rounded-full text-[#C71616] text-[10px] ml-3 tracking-[0]'>Wajib</span>
                    </label>
                    <div className="flex items-center border border-[#AAAAAA] rounded-[5px] mt-2" onClick={() => { setTempCategory(category); setCategoryModalOpen(true); }}>
                        <div className={`w-full px-3 py-2 ${category ? '#555555' : 'text-[#AAAAAA]'} text-[14px] tracking-[-0.02em]`}>
                            {category || "Pilih Kategori Produk"}
                        </div>
                        <button className="ml-2 p-2 text-gray-600 hover:bg-gray-100 rounded-md">
                            <Pencil className="w-5 h-5" />
                        </button>
                    </div>
                    {errors.category && <div className="text-red-500 text-sm mt-1">{errors.category}</div>}
                </div>
                <div id="description" onMouseEnter={() => setTipKey('description')} onMouseLeave={() => setTipKey('default')}>
                    <TextAreaInput label="Deskripsi / Spesifikasi Produk" placeholder="Jelaskan secara detil mengenai produkmu" maxLength={3000} value={description} setValue={setDescription} required />
                    {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                </div>
                {/* <div id="brand" onMouseEnter={() => setTipKey('brand')} onMouseLeave={() => setTipKey('default')}>
                    <TextInput label="Merek Produk" placeholder="Masukkan Merek Produkmu" maxLength={255} value={brand} setValue={setBrand} />
                    {errors.brand && <div className="text-red-500 text-sm mt-1">{errors.brand}</div>}
                </div>
                <div id="countryOrigin" onMouseEnter={() => setTipKey('brand')} onMouseLeave={() => setTipKey('default')}>
                    <label className="block text-[#333333] font-bold text-[14px]"><span className="text-red-500">*</span> Negara Asal</label>
                    <select className="w-full px-3 py-2 border border-[#AAAAAA] rounded-[5px] text-[#555555] text-[14px] mt-1" value={countryOrigin}
                        onChange={(e) => setCountryOrigin(e.target.value)}>
                        <option>Pilih Negara Asal</option>
                        <option>Indonesia</option>
                    </select>
                    {errors.countryOrigin && <div className="text-red-500 text-sm mt-1">{errors.countryOrigin}</div>}
                </div> */}
            </div>
        </div>
    );
};

export default ProductInfoSection;