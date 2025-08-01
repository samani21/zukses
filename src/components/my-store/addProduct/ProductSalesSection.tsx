import React, { ChangeEvent, useMemo, useRef, useState } from 'react';
import { Plus, X, Move, Trash2, ImageIcon, Image } from 'lucide-react';
import { formatRupiahNoRP, formatRupiahNoRPHarga } from 'components/Rupiah';
import { Variation, VariantRowData } from 'types/product';
import { TipKey } from './tipsStore';
import { createPortal } from 'react-dom';

// Letakkan semua prop yang dibutuhkan dalam sebuah interface
interface ProductSalesSectionProps {
    setTipKey: (key: TipKey) => void;
    isVariant: boolean;
    setIsVariant: (isVariant: boolean) => void;
    variations: Variation[];
    setVariations: (variations: Variation[]) => void;
    handleVariationNameChange: (index: number, value: string) => void;
    showSuggestionIndex: number | null;
    setShowSuggestionIndex: (index: number | null) => void;
    variationSuggestions: string[];
    handleRemoveVariation: (index: number) => void;
    handleOptionChange: (varIndex: number, optIndex: number, value: string) => void;
    showOptionSuggestIndex: string | null;
    setShowOptionSuggestIndex: (index: string | null) => void;
    optionSuggestions: { [key: string]: string[] };
    handleDragStart: (index: number) => void;
    handleDrop: (varIndex: number, dropIndex: number) => void;
    handleDeleteOption: (varIndex: number, optIndex: number) => void;
    handleAddVariation: () => void;
    globalPrice: string;
    setGlobalPrice: (price: string) => void;
    globalStock: string;
    setGlobalStock: (stock: string) => void;
    globalDiscountPercent: string;
    setGlobalDiscountPercent: (percent: string) => void;
    showPercentSuggest: boolean;
    setShowPercentSuggest: (show: boolean) => void;
    discountOptions: number[];
    globalDiscount: string;
    errors: { [key: string]: string };
    variantData: VariantRowData[];
    setVariantData: (data: VariantRowData[]) => void;
    handleVariantImageUpload: (clickedIndex: number, e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveVariantImage: (clickedIndex: number) => void;
    applyGlobalToAll: () => void;
    showPercentSuggestIndex: number | null;
    setShowPercentSuggestIndex: (index: number | null) => void;
    dropdownPosition: { top: number; left: number; width: number };
    setDropdownPosition: (pos: { top: number; left: number; width: number; }) => void;
    minOrder: number;
    setMinOrder: (min: number) => void;
    maxOrder: number;
    setMaxOrder: (max: number) => void;
    globalWeight: string;
    setGlobalWeight: (weight: string) => void;
    globalWidth: string;
    setGlobalWidth: (width: string) => void;
    globalLength: string;
    setGlobalLength: (length: string) => void;
    globalHeight: string;
    setGlobalHeight: (height: string) => void;
    applyDimensionToAll: () => void;
    showDimensionTable: boolean;
    setShowDimensionTable: (show: boolean) => void;
    tempCategory?: string;
}
function roundLastThreeDigitsToNearestHundred(value: number): number {
    const lastThree = value % 1000;
    const roundedLastThree =
        lastThree % 1000 < 550
            ? Math.floor(lastThree / 100) * 100
            : Math.ceil(lastThree / 100) * 100;

    return value - lastThree + roundedLastThree;
}

// Komponen ini akan sangat besar, namun sudah terisolasi
const ProductSalesSection = (props: ProductSalesSectionProps) => {
    // Destructuring semua props agar mudah digunakan
    const {
        setTipKey, isVariant, setIsVariant, variations, handleVariationNameChange,
        showSuggestionIndex, setShowSuggestionIndex, variationSuggestions, handleRemoveVariation,
        handleOptionChange, showOptionSuggestIndex, setShowOptionSuggestIndex, optionSuggestions,
        handleDragStart, handleDrop, handleDeleteOption, handleAddVariation,
        globalPrice, setGlobalPrice, globalStock, setGlobalStock, globalDiscountPercent, setGlobalDiscountPercent,
        showPercentSuggest, setShowPercentSuggest, discountOptions, globalDiscount, errors,
        variantData, setVariantData, handleVariantImageUpload, handleRemoveVariantImage, applyGlobalToAll,
        showPercentSuggestIndex, setShowPercentSuggestIndex, dropdownPosition, setDropdownPosition,
        minOrder, setMinOrder, maxOrder, setMaxOrder,
        globalWeight, setGlobalWeight, globalWidth, setGlobalWidth, globalLength, setGlobalLength, globalHeight, setGlobalHeight,
        applyDimensionToAll, showDimensionTable, setShowDimensionTable, tempCategory
    } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    console.log('selectedFile', selectedFile)
    const requiredCategories = [
        'Pakaian Wanita',
        'Pakaian Pria',
        'Aksesoris Fashion',
        'Sepatu Pria',
        'Fashion Muslim',
        'Koper & Tas Travel',
        'Tas Wanita',
        'Sepatu Wanita',
        'Tas Pria',
        'Jam Tangan',
        'Fashion Bayi & Anak',
    ];

    // Ekstrak kategori utama (bagian sebelum " > ")
    const mainCategory = tempCategory?.split('>')[0].trim() || '';
    const showSizeGuide = requiredCategories.includes(mainCategory);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Logika yang spesifik untuk rendering (seperti `combinations`) bisa tetap di sini
    const combinations = useMemo(() => {
        const var1 = variations[0]?.options.filter(opt => opt.trim() !== '') || [];
        let var2 = variations[1]?.options.filter(opt => opt.trim() !== '');

        if (!var2 || var2?.length === 0) {
            var2 = ['']; // fallback
        }

        return var1.map(color => ({
            color,
            sizes: var2
        }));
    }, [variations]);

    // Fungsi untuk membuka modal
    const openModal = () => setIsModalOpen(true);
    // Fungsi untuk menutup modal
    const closeModal = () => setIsModalOpen(false);

    // Fungsi yang dijalankan saat pengguna memilih file
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validasi sederhana untuk tipe file
            if (file.type.startsWith('image/')) {
                setSelectedFile(file);
                // Membuat URL objek untuk preview gambar
                setPreviewUrl(URL.createObjectURL(file));
            } else {
                alert("Harap pilih file gambar (JPG, PNG, dll).");
            }
        }
    };

    // Fungsi untuk memicu klik pada input file
    const handleAreaClick = () => {
        fileInputRef.current?.click();
    };

    // Fungsi untuk menghapus gambar yang dipilih
    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        // Reset nilai input file agar bisa memilih file yang sama lagi
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    const parsedDiscount = parseFloat(globalDiscount || '0'); // hasil number
    const rounded = roundLastThreeDigitsToNearestHundred(parsedDiscount); // hasil number

    return (
        <div id="informasi-penjualan-section" className='border border-[#DCDCDC] py-6 rounded-[5px] space-y-4 px-8'>


            <h1 className="font-bold text-[20px] text-[#483AA0] mb-4">Informasi Penjualan</h1>
            <div
                onMouseEnter={() => setTipKey('variation')}
                onMouseLeave={() => setTipKey('default')} >
                <div className="">
                    <div className='flex items-center justify-left gap-3'>
                        <div className="relative w-[12px] h-[12px] ml-1">
                            {/* Lingkaran luar - ping */}
                            <span className="absolute inset-0 m-auto h-full w-full rounded-full bg-[#F77000] opacity-75 animate-ping-custom" />

                            {/* Lingkaran dalam - tetap */}
                            <span className="absolute inset-0 m-auto h-[12px] w-[12px] rounded-full bg-[#F77000]" />
                        </div>
                        <h2 className="text-[16px] font-bold text-[#333333]">Variasi Produk</h2>
                    </div>
                    <div className='flex jusity-left items-center gap-4 mt-3'>
                        {
                            isVariant ?
                                <button className='border border-[#52357B] rounded-[5px] h-[35px] flex items-center px-2 justify-center' onClick={() => setIsVariant(false)}>
                                    <Plus className='text-[#52357B] h-[13px] w-[13px]' strokeWidth={3} />
                                    <span className='text-[#52357B] text-[14px] font-semibold'>Tanpa Variasi</span>
                                </button> :
                                <button className='border border-[#52357B] rounded-[5px] h-[35px] flex items-center px-2' onClick={() => setIsVariant(true)}>
                                    <Plus className='text-[#52357B] h-[13px] w-[13px]' strokeWidth={3} />
                                    <span className='text-[#52357B] text-[14px] font-semibold'>Tambahkan Variasi</span>
                                </button>
                        }
                        <div className='w-1/2 text-[14px] tracking-[-0.02em]'>
                            Tambahkan Variasi Produk jika produk memiliki beberapa pilihan, seperti <span className='text-[#52357B] font-bold'> warna, ukuran, kapasitas, dan lainnya.</span>
                        </div>
                    </div>
                    {
                        isVariant ? <div className='mt-4'>
                            {variations.map((variation, varIndex) => (
                                <div key={varIndex} className="border border-gray-200 rounded-md p-4 space-y-4 mb-4">
                                    <div className='flex justify-between items-center gap-4'>
                                        <div className="grid grid-cols-[100px_1fr] items-center gap-4 w-1/2">
                                            <label className="text-[14px] font-bold text-[#333333]">Variasi {varIndex + 1}</label>
                                            <div className="relative">
                                                <div className="relative">
                                                    <div className="relative w-full">
                                                        <input
                                                            type="text"
                                                            className="w-full px-3 py-2 border border-[#AAAAAA] h-[40px] outline-none focus:border focus:border-blue-500 rounded-md"
                                                            placeholder="Ketik atau pilih"
                                                            value={variation.name}
                                                            onChange={(e) => handleVariationNameChange(varIndex, e.target.value)}
                                                            onFocus={() => setShowSuggestionIndex(varIndex)}
                                                            onBlur={() => setTimeout(() => setShowSuggestionIndex(null), 200)} // biar gak hilang pas klik
                                                        />
                                                        {showSuggestionIndex === varIndex &&
                                                            variationSuggestions.some(s => s.toLowerCase().includes(variation.name.toLowerCase())) && (
                                                                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md">
                                                                    <div className="text-[12px] text-gray-500 px-3 py-1 border-b border-gray-200">Nilai yang direkomendasikan</div>
                                                                    {variationSuggestions
                                                                        .filter(s =>
                                                                            s.toLowerCase().includes(variation.name.toLowerCase()) &&
                                                                            s.toLowerCase() !== (variations[varIndex === 0 ? 1 : 0]?.name?.toLowerCase())
                                                                        )
                                                                        .map((suggestion) => (
                                                                            <div
                                                                                key={suggestion}
                                                                                className="px-3 py-2 text-[14px] text-[#333] hover:bg-gray-100 cursor-pointer"
                                                                                onPointerDown={() => handleVariationNameChange(varIndex, suggestion)}
                                                                            >
                                                                                {suggestion}
                                                                            </div>
                                                                        ))}
                                                                </div>
                                                            )}

                                                    </div>

                                                </div>

                                                <span className="absolute bottom-2 right-3 text-xs text-gray-400">
                                                    {variation.name?.length}/20
                                                </span>
                                            </div>
                                        </div>
                                        {
                                            variations?.length > 1 ?
                                                <div onClick={() => handleRemoveVariation(varIndex)} className=' cursor-pointer'>
                                                    <X className='w-[24px] h-[24px] text text-gray-500' />
                                                </div> :
                                                <div onClick={() => setIsVariant(false)} className=' cursor-pointer'>
                                                    <X className='w-[24px] h-[24px] text text-gray-500' />
                                                </div>
                                        }
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                                        <label className="text-[14px] font-bold text-[#333333] pt-2">Opsi</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                                            {variation.options.map((option, optIndex) => (
                                                <div
                                                    key={optIndex}
                                                    draggable
                                                    onDragStart={() => handleDragStart(optIndex)}
                                                    onDragOver={(e) => e.preventDefault()}
                                                    onDrop={() => handleDrop(varIndex, optIndex)}
                                                    className="flex items-center gap-2">
                                                    <div className="relative w-full">
                                                        <div className="relative w-full">
                                                            <input
                                                                type="text"
                                                                value={option}
                                                                onChange={(e) => handleOptionChange(varIndex, optIndex, e.target.value)}
                                                                placeholder="Ketik atau Pilih"
                                                                className="w-full px-3 py-2 border border-[#AAAAAA] h-[40px] outline-none focus:border focus:border-blue-500 rounded-md"
                                                                onFocus={() => setShowOptionSuggestIndex(`${varIndex}-${optIndex}`)}
                                                                onBlur={() => setTimeout(() => setShowOptionSuggestIndex(null), 200)} // biar bisa diklik suggestion-nya
                                                            />
                                                            {showOptionSuggestIndex === `${varIndex}-${optIndex}` &&
                                                                (optionSuggestions[variations[varIndex].name] || [])
                                                                    .filter(suggestion =>
                                                                        suggestion.toLowerCase().includes(option.toLowerCase()) && // 1. Filter berdasarkan ketikan (tetap ada)
                                                                        !variation.options.includes(suggestion)                     // 2. HANYA tampilkan jika belum ada di daftar opsi yang dipilih
                                                                    )?.length > 0 && (
                                                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md">
                                                                        <div className="text-[12px] text-gray-500 px-3 py-1 border-b border-gray-200">Nilai yang direkomendasikan</div>
                                                                        {(optionSuggestions[variations[varIndex].name] || [])
                                                                            .filter(suggestion =>
                                                                                suggestion.toLowerCase().includes(option.toLowerCase()) &&
                                                                                !variation.options.includes(suggestion)
                                                                            )
                                                                            .map((suggestion) => (
                                                                                <div
                                                                                    key={suggestion}
                                                                                    className="px-3 py-2 text-[14px] text-[#333] hover:bg-gray-100 cursor-pointer"
                                                                                    onPointerDown={() => handleOptionChange(varIndex, optIndex, suggestion)}
                                                                                >
                                                                                    {suggestion}
                                                                                </div>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                )
                                                            }
                                                        </div>

                                                    </div>

                                                    <div className="p-2 text-gray-500 hover:text-gray-700 cursor-move">
                                                        <Move className="w-4 h-4" />
                                                    </div>
                                                    <div
                                                        className="p-2 text-gray-500 hover:text-red-600"
                                                        onClick={() => handleDeleteOption(varIndex, optIndex)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {variations?.length < 2 && (
                                <div className='flex justif-left items-center gap-3'>
                                    <button
                                        type="button"
                                        onClick={handleAddVariation}
                                        className="bg-white  text-[#52357B] border border-[#52357B] px-4 py-2 rounded-[5px] text-[14px] font-semibold flex items-center justify-center gap-1"
                                    >
                                        <Plus className='h-[22px] w-[22px]' />
                                        Tambah Variasi 2
                                    </button>
                                    <div className='w-[508px] text-[14px] text-[#33333]'>
                                        Tambahkan Variasi 2 jika setiap produk memiliki variasi lanjutan berdasarkan Variasi 1, misalnya:<span className='font-bold text-[#52357B]'> Merah Besar, Merah Kecil, atau Merah Sedang.</span>
                                    </div>
                                </div>
                            )}</div> :
                            <>
                                <div
                                    id="globalPrice"
                                    className="flex items-center gap-4 items-end mt-4"
                                    onMouseEnter={() => setTipKey('priceStock')}
                                    onMouseLeave={() => setTipKey('default')}>
                                    <div className="col-span-12 sm:col-span-5">
                                        <label className="block text-[16px] font-bold text-[#333333] mb-1.5">
                                            Harga Produk
                                            <span className='bg-[#FACACA] p-1 px-3 rounded-full text-[#C71616] text-[10px] ml-3 tracking-[0]'>Wajib</span>
                                        </label>
                                        <div className="flex rounded-l-[5px] border border-[#AAAAAA] bg-white">
                                            <span className="inline-flex items-center px-3 text-[#555555] text-[14px]">Rp |</span>
                                            <input type="text" placeholder="Harga" className="flex-1 h-[40px] block w-full px-3 py-2 border-0 rounded-none focus:ring-0 focus:outline-none placeholder:text-[#AAAAAA]"
                                                value={formatRupiahNoRP(globalPrice)}
                                                onChange={(e) => setGlobalPrice(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-span-12 sm:col-span-5 ml-[-20px]">
                                        <label className="block text-[16px] font-bold text-[#333333] mb-1.5">
                                            Stok
                                        </label>
                                        <div className="flex items-center border border-[#AAAAAA] bg-white rounded-r-[5px]">
                                            <input type="number" placeholder="Stock" className="w-24 px-3 h-[40px] py-2 border-0 focus:ring-0 focus:outline-none placeholder:text-[#AAAAAA]"
                                                value={globalStock}
                                                onChange={(e) => setGlobalStock(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-span-1 ">
                                        <label className="block text-[16px] font-bold text-[#333333] mb-1.5">
                                            Persen Diskon
                                        </label>
                                        <div className="relative">
                                            <div className="relative border border-[#AAAAAA] rounded-[5px] ">
                                                <input
                                                    type="number"
                                                    placeholder="Diskon (%)"
                                                    className="w-full px-3 py-2 focus:outline-none h-[40px]"
                                                    value={globalDiscountPercent}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Validasi hanya angka 0–100
                                                        if (
                                                            value === '' ||
                                                            (/^\d+$/.test(value) && Number(value) >= 0 && Number(value) <= 100)
                                                        ) {
                                                            setGlobalDiscountPercent(value);

                                                            // Cek apakah ada saran yang cocok
                                                            const match = discountOptions.some((opt) =>
                                                                opt.toString().includes(value)
                                                            );
                                                            setShowPercentSuggest(match);
                                                        }
                                                    }}
                                                    onFocus={() => {
                                                        const match = discountOptions.some((opt) =>
                                                            opt.toString().includes(globalDiscountPercent)
                                                        );
                                                        setShowPercentSuggest(match);
                                                    }}
                                                    onBlur={() => setTimeout(() => setShowPercentSuggest(false), 200)}
                                                />
                                                {showPercentSuggest && (
                                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-[150px] overflow-auto">
                                                        {discountOptions
                                                            .filter(
                                                                (opt) =>
                                                                    opt.toString().includes(globalDiscountPercent) &&
                                                                    opt.toString() !== globalDiscountPercent
                                                            )
                                                            .map((opt) => (
                                                                <div
                                                                    key={opt}
                                                                    className="px-3 py-2 text-[14px] text-[#333] hover:bg-gray-100 cursor-pointer"
                                                                    onMouseDown={() => setGlobalDiscountPercent(opt.toString())}
                                                                >
                                                                    {opt}%
                                                                </div>
                                                            ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>


                                    </div>
                                    <div className="col-span-12 sm:col-span-3">
                                        <label className="block text-[16px] font-bold text-[#333333] mb-1.5">
                                            Harga Diskon</label>
                                        <div className="flex rounded-[5px] border border-[#AAAAAA] bg-white">
                                            <span className="inline-flex items-center px-3 text-[#555555] text-[14px]">Rp |</span>
                                            <input type="text" placeholder="Harga Diskon" className="h-[40px] flex-1 block w-full rounded-none rounded-[5px] focus:outline-none border-gray-300 px-3 py-2 placeholder:text-[#AAAAAA]" value={formatRupiahNoRPHarga(rounded)}
                                                readOnly />
                                        </div>
                                    </div>
                                </div>
                            </>
                    }
                </div>
            </div>
            {
                isVariant &&
                <div className="my-4">
                    <div className="flex items-center gap-4 items-end " onMouseEnter={() => setTipKey('priceStock')}
                        onMouseLeave={() => setTipKey('default')}>
                        <div className="col-span-12 sm:col-span-5 ">
                            <label className="block text-[16px] font-bold text-[#333333] mb-1.5">

                                Harga Produk
                            </label>
                            <div className="flex rounded-l-[5px] border border-[#AAAAAA] h-[40px] bg-white">
                                <span className="inline-flex items-center px-3 text-[#555555] text-[14px]">Rp |</span>
                                <input type="text" placeholder="Harga" className="flex-1 block w-full px-3 py-2 border-0 rounded-none focus:ring-0 focus:outline-none placeholder:text-[#AAAAAA]" value={formatRupiahNoRP(globalPrice)} onChange={(e) => setGlobalPrice(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-span-12 sm:col-span-5 ml-[-20px] ">
                            <label className="block text-[16px] font-bold text-[#333333] mb-1.5">

                                Stok
                            </label>
                            <div className="flex items-center border border-[#AAAAAA] h-[40px] bg-white rounded-r-[5px]">
                                <input type="number" placeholder="Stock" className="w-24 px-3 py-2 border-0 focus:ring-0 focus:outline-none placeholder:text-[#AAAAAA]" value={globalStock} onChange={(e) => setGlobalStock(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-span-12 sm:col-span-3">
                            <label className="block text-[16px] font-bold text-[#333333] mb-1.5">
                                Persen Diskon</label>
                            <div className="relative border border-[#AAAAAA] rounded-[5px] h-[40px]">
                                <input
                                    type="number"
                                    placeholder="Diskon (%)"
                                    className="w-full px-3 py-2   focus:outline-none "
                                    value={globalDiscountPercent}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        // Validasi: hanya angka 0–100
                                        if (
                                            value === '' ||
                                            (/^\d+$/.test(value) && Number(value) >= 0 && Number(value) <= 100)
                                        ) {
                                            setGlobalDiscountPercent(value);

                                            // Cek apakah ada saran yang cocok
                                            const hasMatch = discountOptions.some((opt) =>
                                                opt.toString().includes(value)
                                            );
                                            setShowPercentSuggest(hasMatch);
                                        }
                                    }}
                                    onFocus={() => {
                                        const hasMatch = discountOptions.some((opt) =>
                                            opt.toString().includes(globalDiscountPercent)
                                        );
                                        setShowPercentSuggest(hasMatch);
                                    }}
                                    onBlur={() => setTimeout(() => setShowPercentSuggest(false), 200)}
                                />

                                {showPercentSuggest && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-[150px] overflow-auto">
                                        {discountOptions
                                            .filter(
                                                (opt) =>
                                                    opt.toString().includes(globalDiscountPercent) &&
                                                    opt.toString() !== globalDiscountPercent
                                            )
                                            .map((opt) => (
                                                <div
                                                    key={opt}
                                                    className="px-3 py-2 text-[14px] text-[#333] hover:bg-gray-100 cursor-pointer"
                                                    onMouseDown={() => setGlobalDiscountPercent(opt.toString())}
                                                >
                                                    {opt}%
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-span-12 sm:col-span-2">
                            <label className="block text-[16px] font-bold text-[#333333] mb-1.5 w-[200px]">
                                Harga Setelah Diskon</label>
                            <div className='flex items-center gap-3'>
                                <div className="flex rounded-[5px] border border-[#AAAAAA] bg-white h-[40px]">
                                    <span className="inline-flex items-center px-3 text-[#555555] text-[14px]">Rp |</span>
                                    <input type="text" placeholder="Harga Diskon" className="flex-1 block w-full rounded-none rounded-[5px] focus:outline-none border-gray-300 px-3 py-2 placeholder:text-[#AAAAAA]" value={formatRupiahNoRPHarga(rounded)} readOnly />
                                </div>
                                {
                                    variations[0]?.options[0] != '' &&
                                    <div className="col-span-12 sm:col-span-2">
                                        <button className="w-[155px] bg-[#52357B] h-[40px] rounded-[5px] text-white font-semibold text-[14px] py-2 hover:bg-purple-800 transition duration-200" onClick={applyGlobalToAll}>Terapkan kesemua</button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
            {errors.globalPrice && errors.globalStock ? (
                <div className="text-red-500 text-sm mt-1">Harga dan Stok wajib diisi</div>
            ) : errors.globalPrice ? (
                <div className="text-red-500 text-sm mt-1">{errors.globalPrice}</div>
            ) : errors?.globalStock && (
                <div className="text-red-500 text-sm mt-1">{errors.globalPrice}</div>
            )}

            <div className="overflow-x-auto"
                id="variant"
                onMouseEnter={() => setTipKey('variation')}
                onMouseLeave={() => setTipKey('default')}>
                {
                    variations[0]?.name && isVariant &&
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-[#EEEEEE] border border-[#AAAAAA]">
                            <tr>
                                {
                                    variations[0]?.name &&
                                    <th className="px-4 py-3 text-[14px] font-bold text-[#333333] uppercase tracking-wider border-r border-[#AAAAAA] text-center align-middle">
                                        {variations[0]?.name}
                                    </th>
                                }
                                {
                                    variations[1]?.name &&
                                    <th className="px-4 py-3 text-[14px] font-bold text-[#333333] uppercase tracking-wider border-r border-[#AAAAAA] text-center align-middle">
                                        {variations[1]?.name}
                                    </th>
                                }

                                <th className="px-4 py-3 text-[14px] font-bold text-[#333333] uppercase tracking-wider border-r border-[#AAAAAA] text-center align-middle">
                                    Harga
                                </th>
                                <th className="px-4 py-3 text-[14px] font-bold text-[#333333] uppercase tracking-wider border-r border-[#AAAAAA] text-center align-middle">
                                    Stok
                                </th>
                                <th className="px-4 py-3 text-[14px] font-bold text-[#333333] uppercase tracking-wider border-r border-[#AAAAAA] text-center align-middle">
                                    Persen Diskon
                                </th>
                                <th className="px-4 py-3 text-[14px] font-bold text-[#333333] uppercase tracking-wider text-center align-middle">
                                    Harga Setelah Diskon
                                </th>
                            </tr>
                        </thead>


                        <tbody className="bg-white divide-y divide-gray-200">
                            {combinations.map((variation, vIndex) =>
                                variation.sizes.map((size, sIndex) => {
                                    const index = vIndex * variation.sizes?.length + sIndex;
                                    const rowData = variantData[index] || { price: '', stock: '', discount: '', discountPercent: '' };
                                    const discountVariant = parseFloat(rowData?.discount || '0'); // hasil number
                                    const roundedVariant = roundLastThreeDigitsToNearestHundred(discountVariant); // hasil number

                                    return (
                                        <tr key={`${vIndex}-${sIndex}`} className="border border-[#AAAAAA]">
                                            {sIndex === 0 &&
                                                variation.color !== '' && (
                                                    <td
                                                        className="px-4 py-4 whitespace-nowrap align-top"
                                                        rowSpan={variation.sizes?.length}
                                                    >
                                                        <div className="grid justify-center">
                                                            <span className="text-center w-full text-[#333333] text-[14px]">
                                                                {variation.color}
                                                            </span>
                                                            <div className="flex justify-center mt-2">
                                                                {rowData.image ? (
                                                                    // --- AWAL PERUBAHAN ---
                                                                    <div className="relative w-[60px] h-[60px]">
                                                                        <label htmlFor={`variant-img-${index}`} className="cursor-pointer">
                                                                            <img
                                                                                // Penanganan src yang lebih aman untuk File object atau string URL
                                                                                src={rowData.image instanceof File ? URL.createObjectURL(rowData.image) : String(rowData.image)}
                                                                                alt="Varian"
                                                                                className="w-full h-full object-cover border rounded-[5px]"
                                                                            />
                                                                        </label>
                                                                        <input
                                                                            type="file"
                                                                            accept="image/*"
                                                                            className="hidden"
                                                                            onChange={(e) => handleVariantImageUpload(index, e)}
                                                                            id={`variant-img-${index}`}
                                                                        />
                                                                        {/* Tombol Hapus Gambar */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRemoveVariantImage(index)} // Memanggil fungsi hapus
                                                                            className="absolute top-[-5px] right-[-5px] bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm font-bold shadow-md hover:bg-red-700"
                                                                            aria-label="Hapus gambar"
                                                                        >
                                                                            &times;
                                                                        </button>
                                                                    </div>
                                                                    // --- AKHIR PERUBAHAN ---
                                                                ) : (
                                                                    <div className="w-[60px] h-[60px] flex items-center justify-center border border-[#BBBBBB] rounded-[5px] bg-white">
                                                                        <input
                                                                            type="file"
                                                                            accept="image/*"
                                                                            className="hidden"
                                                                            onChange={(e) => handleVariantImageUpload(index, e)}
                                                                            id={`variant-img-${index}`}
                                                                        />
                                                                        <label htmlFor={`variant-img-${index}`} className="cursor-pointer">
                                                                            <ImageIcon className="w-[48px] h-[48px] text-[#000000]" />
                                                                        </label>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {errors[`variantImage_${index}`] && (
                                                                <div className="text-red-500 text-sm mt-1">
                                                                    {errors[`variantImage_${index}`]}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                )}

                                            {variations[1]?.name && (
                                                <td className="px-4 py-4 text-[14px] text-[#333333] border border-[#AAAAAA]" align="center">
                                                    {size || '-'}
                                                </td>
                                            )}

                                            <td className="px-4 py-4 border border-[#AAAAAA]">
                                                <div className="flex items-center border border-[#AAAAAA] h-[40px]  rounded-[5px] px-1">
                                                    <span className="text-[15px] text-[#555555] mr-2">Rp</span>
                                                    <input
                                                        type="text"
                                                        placeholder="Harga"
                                                        className="w-full p-1 placeholder:text-[#AAAAAA] text-[15px] focus:outline-none"
                                                        value={formatRupiahNoRP(rowData.price)}
                                                        onChange={(e) => {
                                                            const newData = [...variantData];
                                                            const priceValue = parseFloat(String(e.target.value).replace(/[^0-9]/g, '')) || 0;
                                                            const percentValue = parseInt(newData[index]?.discountPercent, 10) || 0;
                                                            let newDiscountPrice = '';

                                                            if (priceValue > 0 && percentValue > 0) {
                                                                newDiscountPrice = String(priceValue - (priceValue * (percentValue / 100)));
                                                            }

                                                            newData[index] = { ...rowData, price: e.target.value, discount: newDiscountPrice };
                                                            setVariantData(newData);
                                                        }}
                                                    />
                                                </div>
                                                {errors[`variantPrice_${index}`] && (
                                                    <div className="text-red-500 text-sm mt-1">
                                                        {errors[`variantPrice_${index}`]}
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-4 py-4 border border-[#AAAAAA] h-[40px]  text-center align-middle" width={100}>
                                                <input
                                                    type="number"
                                                    placeholder="Stock"
                                                    className="w-full p-1 border border-[#AAAAAA] h-[40px]  rounded-[5px] placeholder:text-[#AAAAAA] text-[15px] text-center focus:outline-none focus:ring-0"
                                                    value={rowData.stock}
                                                    onChange={(e) => {
                                                        const newData = [...variantData];
                                                        newData[index] = { ...rowData, stock: e.target.value };
                                                        setVariantData(newData);
                                                    }}
                                                />
                                                {errors[`variantStock_${index}`] && (
                                                    <div className="text-red-500 text-sm mt-1">
                                                        {errors[`variantStock_${index}`]}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 border border border-[#AAAAAA] h-[40px]  text-center align-middle" width={155}>
                                                {/* Wrapper untuk input, tidak perlu 'relative' lagi tapi tidak apa-apa jika ada */}
                                                <div>
                                                    <input
                                                        type="number"
                                                        placeholder="Diskon (%)"
                                                        className="w-full p-2 border border border-[#AAAAAA] h-[40px]  rounded-[5px] text-[14px] text-center focus:outline-none"
                                                        value={rowData.discountPercent || ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value;

                                                            // Validasi input: hanya 0–100
                                                            if (
                                                                value === '' ||
                                                                (/^\d+$/.test(value) && Number(value) >= 0 && Number(value) <= 100)
                                                            ) {
                                                                const newData = [...variantData];
                                                                const percentValue = parseInt(value, 10) || 0;
                                                                const priceValue =
                                                                    parseFloat(String(newData[index]?.price).replace(/[^0-9]/g, '')) || 0;

                                                                let newDiscountPrice = '';
                                                                if (priceValue > 0 && percentValue > 0) {
                                                                    newDiscountPrice = String(
                                                                        priceValue - priceValue * (percentValue / 100)
                                                                    );
                                                                }

                                                                newData[index] = {
                                                                    ...rowData,
                                                                    discountPercent: value,
                                                                    discount: newDiscountPrice,
                                                                };
                                                                setVariantData(newData);

                                                                // Cek apakah ada opsi yang cocok
                                                                const hasMatch = discountOptions.some((opt) =>
                                                                    opt.toString().includes(value)
                                                                );
                                                                setShowPercentSuggestIndex(hasMatch ? index : null);
                                                            }
                                                        }}
                                                        onFocus={(e) => {
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            setDropdownPosition({
                                                                top: rect.bottom,
                                                                left: rect.left,
                                                                width: rect.width,
                                                            });

                                                            const hasMatch = discountOptions.some((opt) =>
                                                                opt.toString().includes(rowData.discountPercent || '')
                                                            );
                                                            setShowPercentSuggestIndex(hasMatch ? index : null);
                                                        }}
                                                        onBlur={() => setTimeout(() => setShowPercentSuggestIndex(null), 200)}
                                                    />

                                                    {showPercentSuggestIndex === index &&
                                                        createPortal(
                                                            <div
                                                                className="bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
                                                                style={{
                                                                    position: 'fixed',
                                                                    top: `${dropdownPosition.top + 4}px`,
                                                                    left: `${dropdownPosition.left}px`,
                                                                    width: `${dropdownPosition.width}px`,
                                                                    zIndex: 9999,
                                                                }}
                                                            >
                                                                {discountOptions
                                                                    .filter(
                                                                        (opt) =>
                                                                            opt.toString().includes(rowData.discountPercent || '') &&
                                                                            opt.toString() !== rowData.discountPercent
                                                                    )
                                                                    .map((opt) => (
                                                                        <div
                                                                            key={opt}
                                                                            className="px-3 py-2 text-[14px] text-[#333] hover:bg-gray-100 cursor-pointer"
                                                                            onMouseDown={() => {
                                                                                const newData = [...variantData];
                                                                                const priceValue =
                                                                                    parseFloat(
                                                                                        String(newData[index]?.price).replace(/[^0-9]/g, '')
                                                                                    ) || 0;
                                                                                const newDiscountPrice =
                                                                                    priceValue > 0
                                                                                        ? String(priceValue - priceValue * (opt / 100))
                                                                                        : '';

                                                                                newData[index] = {
                                                                                    ...rowData,
                                                                                    discountPercent: opt.toString(),
                                                                                    discount: newDiscountPrice,
                                                                                };
                                                                                setVariantData(newData);
                                                                                setShowPercentSuggestIndex(null);
                                                                            }}
                                                                        >
                                                                            {opt}%
                                                                        </div>
                                                                    ))}
                                                            </div>,
                                                            document.body
                                                        )}
                                                </div>

                                            </td>
                                            <td className="px-4 py-4 border border border-[#AAAAAA] h-[40px] ">
                                                <div className="flex items-center border border border-[#AAAAAA] h-[40px]  rounded-[5px] px-1">
                                                    <span className="text-[15px] text-[#555555] mr-2">Rp</span>
                                                    <input
                                                        type="text"
                                                        placeholder="Harga"
                                                        className="w-full p-1 placeholder:text-[#AAAAAA] text-[15px] focus:outline-none focus:ring-0 focus:border-none"
                                                        value={formatRupiahNoRPHarga(roundedVariant)}
                                                        readOnly
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>



                    </table>
                }
                {errors.variant && (
                    <div className="text-red-500 text-sm mt-1">{errors.variant}</div>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                onMouseEnter={() => setTipKey('purchaseLimit')}
                onMouseLeave={() => setTipKey('default')}>
                <div>
                    <label className="text-[#333333] font-bold text-[16px]">
                        Min. Jumlah Pembelian
                        <span className='bg-[#FACACA] p-1 px-3 rounded-full text-[#C71616] text-[10px] ml-3 tracking-[0]'>Wajib</span>
                    </label>
                    <input type="number" defaultValue="1" className="w-full px-3 py-2 border border-[#AAAAAA] rounded-[5px] h-[40px] text-[17px] text-[#333333]" value={minOrder} onChange={(e) => setMinOrder(Number(e.target.value))} />
                </div>
                <div>
                    <label className="text-[#333333] font-bold text-[16px]">
                        Maks. Jumlah Pembelian
                        <span className='bg-[#FACACA] p-1 px-3 rounded-full text-[#C71616] text-[10px] ml-3 tracking-[0]'>Wajib</span>
                    </label>
                    <input type="number" defaultValue="1000" className="w-full px-3 py-2 border border-[#AAAAAA] rounded-[5px] h-[40px] text-[17px] text-[#333333]" value={maxOrder} onChange={(e) => setMaxOrder(Number(e.target.value))} />
                </div>
            </div>

            <div className='mt-[-15px]'
                id="globalDelivry"
                onMouseEnter={() => setTipKey('weightDimension')}
                onMouseLeave={() => setTipKey('default')}>
                <label className="text-[#333333] font-bold text-[16px]">
                    Berat dan Dimensi Produk
                </label>
                <div className="grid grid-cols-12 items-center gap-3 mt-4 w-full">
                    <div className='col-span-4 border rounded-[5px] px-4 border-[#AAAAAA] h-[40px]'>
                        <input type="number" placeholder="Berat" className="py-2.5 placeholder:text-[#AAAAAA] text-[15px]  focus:outline-none focus:ring-0 focus:border-none" value={globalWeight}
                            onChange={(e) => setGlobalWeight(e.target.value)} />
                        <span className="text-[15px] text-[#555555]">Gr</span>
                    </div>
                    <div className='col-span-6 border rounded-[5px] px-4 border-[#AAAAAA] h-[40px] flex items-center justify-between'>
                        <input type="number" placeholder="Lebar" className="py-2.5 placeholder:text-[#AAAAAA] text-[15px] w-[70px] focus:outline-none focus:ring-0 focus:border-none"
                            value={globalWidth} onChange={(e) => setGlobalWidth(e.target.value)} />
                        <span className="text-[15px] text-[#AAAAAA] mr-[20px]">|</span>
                        <input type="number" placeholder="Panjang" className="py-2.5 placeholder:text-[#AAAAAA] text-[15px] w-[70px] focus:outline-none focus:ring-0 focus:border-none"
                            value={globalLength} onChange={(e) => setGlobalLength(e.target.value)} />
                        <span className="text-[15px] text-[#AAAAAA] mr-[20px]">|</span>
                        <input type="number" placeholder="Tinggi" className="py-2.5 placeholder:text-[#AAAAAA] text-[15px] w-[70px] focus:outline-none focus:ring-0 focus:border-none  focus:outline-none focus:ring-0 focus:border-none"
                            value={globalHeight} onChange={(e) => setGlobalHeight(e.target.value)} />
                        <span className="text-[15px] text-[#AAAAAA] mr-[20px]">|</span>
                        <span className="text-[15px] text-[#555555]">Cm</span>
                    </div>
                    {
                        isVariant && variations[0]?.options[0] != '' &&
                        <div className='col-span-2'>
                            <button className="bg-[#52357B] text-white px-4 py-2 rounded-md text-[15px] font-[500] hover:bg-purple-800 transition duration-200 ml-auto"
                                onClick={applyDimensionToAll}>
                                Terapkan kesemua
                            </button>
                        </div>
                    }
                </div>
                {
                    isVariant &&
                    <div className="mt-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={showDimensionTable}
                                onChange={() => setShowDimensionTable(!showDimensionTable)}
                                className="h-5 w-5 accent-[#52357B] text-white focus:ring-[#52357B]"

                            />
                            <span className="text-[14px] text-[#333333] font-bold">Berat & Dimensi berbeda untuk tiap variasi?</span>
                        </label>
                    </div>
                }
                {errors.globalDelivry && (
                    <div className="text-red-500 text-sm mt-1">{errors?.globalDelivry}</div>
                )}
            </div>
            {variations[0]?.name && showDimensionTable && isVariant && (
                <div className="overflow-x-auto mt-4"
                    onMouseEnter={() => setTipKey('weightDimension')}
                    onMouseLeave={() => setTipKey('default')}>
                    <table className="w-full">
                        <thead className="bg-[#EEEEEE] border border-[#AAAAAA]">
                            <tr>
                                {variations[0]?.options.filter(opt => opt.trim() !== '')?.length > 0 && (
                                    <th className="px-4 py-3 text-[14px] font-bold text-[#333333] uppercase tracking-wider border-r border-[#AAAAAA] text-center align-middle">
                                        {variations[0]?.name || 'Variasi 1'}
                                    </th>
                                )}

                                {variations[1]?.options.filter(opt => opt.trim() !== '')?.length > 0 && (
                                    <th className="px-4 py-3 text-[14px] font-bold text-[#333333] uppercase tracking-wider border-r border-[#AAAAAA] text-center align-middle">
                                        {variations[1]?.name || 'Variasi 2'}
                                    </th>
                                )}

                                <th className="px-4 py-3 text-[14px] font-bold text-[#333333] uppercase tracking-wider border-r border-[#AAAAAA] text-center align-middle">
                                    Berat
                                </th>
                                <th className="px-4 py-3 text-[14px] font-bold text-[#333333] uppercase tracking-wider border-r border-[#AAAAAA] text-center align-middle">
                                    Ukuran
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {combinations.map((variation, vIndex) =>
                                variation.sizes.map((size, sIndex) => {
                                    const index = vIndex * variation.sizes?.length + sIndex;
                                    const rowData = variantData[index] || {};

                                    return (
                                        <tr key={`${vIndex}-${sIndex}`} className="border border-[#AAAAAA]">
                                            {sIndex === 0 && variation.color !== '' && (
                                                <td
                                                    className="px-4 py-4 align-middle border border-[#AAAAAA] align-top text-center"
                                                    rowSpan={variation.sizes?.length}
                                                >
                                                    <span className="font-medium text-gray-900 text-[14px]">{variation.color}</span>
                                                </td>
                                            )}

                                            {variations[1]?.name && (
                                                <td className="px-4 py-4 whitespace-nowrap text-[14px] text-[#333333] align-middle border border-[#AAAAAA] text-center" width={100}>
                                                    {size || ''}
                                                </td>
                                            )}

                                            {/* Berat */}
                                            <td className="px-4 py-4 border border-[#AAAAAA]" width={150}>
                                                <div className="flex items-center border border-[#AAAAAA] h-[40px] rounded-[5px] px-3">
                                                    <input
                                                        type="number"
                                                        placeholder="Berat"
                                                        value={rowData.weight || ''}
                                                        onChange={(e) => {
                                                            const updated = [...variantData];
                                                            updated[index] = { ...rowData, weight: e.target.value };
                                                            setVariantData(updated);
                                                        }}
                                                        className="w-full p-1.5 text-[14px] focus:outline-none focus:ring-0 focus:border-none"
                                                    />
                                                    <span className="text-[14px] text-gray-500 ml-2">gr</span>
                                                </div>
                                                {errors[`variantWeight_${index}`] && (
                                                    <div className="text-red-500 text-sm mt-1">
                                                        {errors[`variantWeight_${index}`]}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Dimensi */}
                                            <td className="px-4 py-4 border border-[#AAAAAA]">
                                                <div className="border rounded-[5px] px-4 border-[#AAAAAA] h-[40px] flex items-center justify-between gap-2">
                                                    <input
                                                        type="number"
                                                        placeholder="Lebar"
                                                        className="w-16 placeholder:text-[#AAAAAA] text-[14px] focus:outline-none placeholder:text-center"
                                                        value={rowData.width || ''}
                                                        onChange={(e) => {
                                                            const updated = [...variantData];
                                                            updated[index] = { ...rowData, width: e.target.value };
                                                            setVariantData(updated);
                                                        }}
                                                    />
                                                    <p className="text-[#AAAAAA]">|</p>
                                                    <input
                                                        type="number"
                                                        placeholder="Panjang"
                                                        className="w-16 placeholder:text-[#AAAAAA] text-[14px] focus:outline-none placeholder:text-center"
                                                        value={rowData?.length || ''}
                                                        onChange={(e) => {
                                                            const updated = [...variantData];
                                                            updated[index] = { ...rowData, length: e.target.value };
                                                            setVariantData(updated);
                                                        }}
                                                    />
                                                    <p className="text-[#AAAAAA]">|</p>
                                                    <input
                                                        type="number"
                                                        placeholder="Tinggi"
                                                        className="w-16 placeholder:text-[#AAAAAA] text-[14px] focus:outline-none placeholder:text-center"
                                                        value={rowData.height || ''}
                                                        onChange={(e) => {
                                                            const updated = [...variantData];
                                                            updated[index] = { ...rowData, height: e.target.value };
                                                            setVariantData(updated);
                                                        }}
                                                    />
                                                    <p className="text-[#AAAAAA]">|</p>
                                                    <p className="text-[#555555]">Cm</p>
                                                </div>
                                                <div>
                                                    {errors[`variantWidth_${index}`] && (
                                                        <span className="text-red-500 text-sm mt-1">
                                                            {errors[`variantWidth_${index}`]},
                                                        </span>
                                                    )}
                                                    {errors[`variantLength_${index}`] && (
                                                        <span className="text-red-500 text-sm mt-1  ml-1">
                                                            {errors[`variantLength_${index}`]},
                                                        </span>
                                                    )}
                                                    {errors[`variantHeight_${index}`] && (
                                                        <span className="text-red-500 text-sm mt-1 ml-1">
                                                            {errors[`variantHeight_${index}`]}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}

                        </tbody>

                    </table>
                    {errors.variant && (
                        <div className="text-red-500 text-sm mt-1">{errors.variant}</div>
                    )}
                </div>
            )}

            {showSizeGuide && (
                <>
                    <label className="text-[#333333] font-bold text-[16px]">
                        Panduan Ukuran
                        <span className='bg-[#FACACA] p-1 px-3 rounded-full text-[#C71616] text-[10px] ml-3 tracking-[0]'>Wajib</span>
                    </label>
                    <div className='mt-2'>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/png, image/jpeg, image/jpg"
                        />

                        <div>
                            {previewUrl ? (
                                // Tampilkan preview gambar jika ada
                                <div>
                                    <img
                                        src={previewUrl}
                                        alt="Preview panduan ukuran"
                                        className="w-[80px] rounded-md object-contain mb-2"
                                    />
                                </div>
                            ) : (
                                // Tampilkan placeholder jika tidak ada gambar
                                <div className=" text-gray-500 flex items-start cursor-pointer gap-4">
                                    <div className='border border-[#BBBBBB] w-[67px] h-[67px] rounded-[5px] flex items-center justify-center' onClick={handleAreaClick}>
                                        <Image size={40} strokeWidth={1.5} />
                                    </div>

                                    <div>
                                        <p className=" text-[#555555] text-[12px]" onClick={handleAreaClick} style={{
                                            lineHeight: "110%",
                                            letterSpacing: "-0.02em"
                                        }}>
                                            Ukuran: Maks. 2MB, pastikan resolusi tidak <br /> boleh melebihi 1280x1280px Format: JPG,<br /> PNG
                                        </p>
                                        <button
                                            type="button"
                                            onClick={openModal}
                                            className="text-[14px] font-bold text-[#555555] transition-colors duration-200 hover:text-indigo-800 focus:outline-none mt-3"
                                        >
                                            Lihat Contoh
                                        </button>
                                    </div>
                                </div>
                            )}

                            {previewUrl && (
                                <button
                                    onClick={handleRemoveImage}
                                    className="flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
                                    aria-label="Hapus gambar"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Hapus
                                </button>
                            )}

                        </div>
                    </div>

                    {/* Modal untuk Menampilkan Contoh Gambar */}
                    {isModalOpen && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                            aria-labelledby="modal-title"
                            role="dialog"
                            aria-modal="true"
                            onClick={closeModal}
                        >
                            <div
                                className="relative w-full max-w-4xl transform rounded-xl bg-white p-4 py-6 shadow-2xl transition-all"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="space-y-4">
                                    <div className='flex justify-between px-8'>
                                        <div className='space-y-2'>
                                            <h3 id="modal-title" className="text-[27px] font-bold text-black tracking-[-0.03em]">
                                                Panduan Ukuran
                                            </h3>
                                            <p className="text-[16px] text-black tracking-[-0.03em]">
                                                Anda bisa meng-upload panduan ukuran seperti gambar berikut
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={closeModal}

                                            aria-label="Tutup modal"
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>
                                    <div className="overflow-hidden">
                                        <img
                                            src="/image/contoh.png"
                                            alt="Contoh Panduan Ukuran Baju"
                                            className="h-auto w-full object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>)}
        </div>
    );
};

export default ProductSalesSection;