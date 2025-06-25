import Modal from 'components/common/Modal';
import React, { FC, useEffect, useRef, useState } from 'react';
import Get from 'services/api/Get';
import { Category, FileWithPreview, FormErrors, ProductVariant, Variation, VariationOption } from 'services/api/product';
import { Response } from 'services/api/types';
import CategorySelector from './CategorySelector';
import SectionTitle from 'components/common/SectionTitle';
import { Edit2Icon } from 'components/common/icons';
import { Camera } from 'lucide-react';
import X from 'components/common/icons/X';
import Video from 'components/common/icons/Video';
import Trash2 from 'components/common/icons/Trash2';
import PlusSquare from 'components/common/icons/PlusSquare';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buildFormData = (formData: FormData, data: any, parentKey?: string) => {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
        Object.keys(data).forEach(key => {
            buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
        });
    } else {
        const value = data == null ? '' : data;
        formData.append(parentKey as string, value);
    }
};


type Product = {
    id: string;
    name: string;
    sku: string;
    image_url?: string;
    sales: number;
    price: number;
    stock: number;
    qualityScore: number;
};

const FormProduct: FC<{ onSave: (formData: FormData) => void; onCancel: () => void; productData: Product | null; }> = ({ onSave, onCancel, productData }) => {
    const isEditMode = !!productData;

    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [idCategorie, setIdCategorie] = useState<number>();
    const [isUsed, setIsUsed] = useState<boolean>(false);
    const [price, setPrice] = useState<number | string>('');
    const [stock, setStock] = useState<number | string>('');
    const [sku, setSku] = useState<string>('');
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [tempCategory, setTempCategory] = useState(category);
    const [apiCategories, setApiCategories] = useState<Category[]>([]);
    const [categoryLoading, setCategoryLoading] = useState(true);
    const [categoryError, setCategoryError] = useState<string | null>(null);

    const [productPhotos, setProductPhotos] = useState<FileWithPreview[]>([]);
    const [promoPhoto, setPromoPhoto] = useState<FileWithPreview | null>(null);
    const [productVideo, setProductVideo] = useState<FileWithPreview | null>(null);

    const [variations, setVariations] = useState<Variation[]>([]);
    const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
    const [minPurchase, setMinPurchase] = useState<number | string>(1);
    const [maxPurchase, setMaxPurchase] = useState<number | string>('');
    const [errors, setErrors] = useState<FormErrors>({});

    const productPhotoInputRef = useRef<HTMLInputElement>(null);
    const promoPhotoInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const variantInputRef = useRef<HTMLInputElement>(null);

    const hasVariations = variations.filter(v => v.name && v.options.some(o => o.name)).length > 0;

    useEffect(() => {
        const fetchCategories = async () => {
            setCategoryLoading(true);
            try {
                const res = await Get<Response>('zukses', `category/show`);
                if (res?.status === 'success' && Array.isArray(res.data)) {
                    setApiCategories(res.data as Category[]);
                } else {
                    setCategoryError("Gagal mengambil data kategori.");
                }
            } catch (error) {
                setCategoryError("Gagal memuat kategori.");
                console.error(error);
            } finally {
                setCategoryLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Effect to populate form when in edit mode
    useEffect(() => {
        if (!isEditMode || !apiCategories.length) {
            setProductName('');
            setDescription('');
            setCategory('');
            setIdCategorie(undefined);
            setIsUsed(false);
            setPrice('');
            setStock('');
            setSku('');
            setProductPhotos([]);
            setPromoPhoto(null);
            setProductVideo(null);
            setVariations([]);
            setProductVariants([]);
            setMinPurchase(1);
            setMaxPurchase('');
            setErrors({});
            return;
        };

        setProductName(productData.name || '');
        setDescription(productData.desc || '');
        setIdCategorie(productData.category_id);
        setCategory(productData.category_name);
        setTempCategory(productData.category_name);
        setIsUsed(productData.is_used === 1);
        setPrice(productData.price ? parseFloat(productData.price).toString() : '');
        setStock(productData.stock || '');
        setSku(productData.sku || '');
        setMinPurchase(productData.min_purchase || 1);
        setMaxPurchase(productData.max_purchase || '');

        if (productData.image_url) {
            setPromoPhoto({ file: null, preview: productData.image_url });
        }
        if (productData.media) {
            setProductPhotos(
                productData.media
                    .filter(m => m.type === 'image')
                    .map(m => ({ file: null, preview: m.url }))
            );
            const video = productData.media.find(m => m.type === 'video');
            if (video) setProductVideo({ file: null, preview: video.url });
        }

        const hasApiVariations = productData.variants && productData.variants.length > 0;
        if (hasApiVariations) {
            const variationGroupNames = productData.variant_group_names || ['Warna', 'Ukuran'];
            const variationGroups: { [key: string]: string[] } = {};

            productData.variants.forEach(variant => {
                variant.values.forEach((val, index) => {
                    const groupName = variationGroupNames[index] || `Variasi ${index + 1}`;
                    if (!variationGroups[groupName]) variationGroups[groupName] = [];
                    if (!variationGroups[groupName].includes(val.value)) {
                        variationGroups[groupName].push(val.value);
                    }
                });
            });

            const reconstructedVariations = Object.keys(variationGroups).map((name, index) => ({
                id: index,
                name: name,
                options: variationGroups[name].map((optName, optIndex) => ({
                    id: (index * 1000) + optIndex,
                    name: optName,
                })),
            }));
            setVariations(reconstructedVariations);

            const reconstructedProductVariants = productData.variant_prices.map((variantPrice, index) => {
                const combination: Record<string, string> = {};
                const sourceVariant = productData.variants[index];
                if (sourceVariant && reconstructedVariations.length === sourceVariant.values.length) {
                    reconstructedVariations.forEach((variation, i) => {
                        combination[variation.name] = sourceVariant.values[i].value;
                    });
                }

                return {
                    combination,
                    price: parseFloat(variantPrice.price).toString(),
                    stock: variantPrice.stock,
                    sku: variantPrice.variant_code || '',
                    image: variantPrice.image ? { file: null, preview: variantPrice.image } : null,
                };
            });
            setProductVariants(reconstructedProductVariants);
        }

    }, [isEditMode, productData, apiCategories]);


    // Effect to generate variant combinations (Cartesian product for new products)
    useEffect(() => {
        if (isEditMode) return;

        const activeVariations = variations.filter(v => v.name && v.options.some(o => o.name));
        if (activeVariations.length === 0) {
            if (productVariants.length > 0) setProductVariants([]);
            return;
        }

        const cartesian = <T,>(...args: T[][]): T[][] => args.reduce<T[][]>((acc, val) => acc.flatMap(d => val.map(e => [...d, e])), [[]]);
        const optionArrays = activeVariations.map(v => v.options.filter(o => o.name));
        const combinations = cartesian<VariationOption>(...optionArrays);

        setProductVariants(currentProductVariants => {
            const newVariants: ProductVariant[] = combinations.map(combo => {
                const combinationObj: Record<string, string> = {};
                combo.forEach((option, index) => {
                    const variationName = activeVariations[index].name;
                    combinationObj[variationName] = option.name;
                });

                const existingVariant = currentProductVariants.find(p => JSON.stringify(p.combination) === JSON.stringify(combinationObj));
                return {
                    combination: combinationObj,
                    price: existingVariant?.price || '',
                    stock: existingVariant?.stock || '',
                    sku: existingVariant?.sku || '',
                    image: existingVariant?.image || null
                };
            });

            if (JSON.stringify(currentProductVariants) === JSON.stringify(newVariants)) {
                return currentProductVariants;
            }
            return newVariants;
        });
    }, [variations, isEditMode]);

    useEffect(() => {
        return () => {
            productPhotos.forEach(file => { if (file.file) URL.revokeObjectURL(file.preview) });
            if (promoPhoto && promoPhoto.file) URL.revokeObjectURL(promoPhoto.preview);
            if (productVideo && productVideo.file) URL.revokeObjectURL(productVideo.preview);
            productVariants.forEach(variant => { if (variant.image && variant.image.file) URL.revokeObjectURL(variant.image.preview); });
        };
    }, [productPhotos, promoPhoto, productVideo, productVariants]);

    const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>, callback: (files: File[]) => void) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) callback(files);
        e.target.value = '';
    };

    const handleProductPhotosChange = (files: File[]) => {
        const newPhotos = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
        setProductPhotos(prev => [...prev, ...newPhotos].slice(0, 9));
        if (errors.media) setErrors(prev => ({ ...prev, media: undefined }));
    };

    const removeProductPhoto = (index: number) => {
        const photoToRemove = productPhotos[index];
        if (photoToRemove.file) URL.revokeObjectURL(photoToRemove.preview);
        setProductPhotos(productPhotos.filter((_, i) => i !== index));
    };

    const handlePromoPhotoChange = (files: File[]) => {
        const file = files[0];
        if (promoPhoto && promoPhoto.file) URL.revokeObjectURL(promoPhoto.preview);
        setPromoPhoto({ file, preview: URL.createObjectURL(file) });
        if (errors.promoPhoto) setErrors(prev => ({ ...prev, promoPhoto: undefined }));
    };

    const removePromoPhoto = () => {
        if (promoPhoto && promoPhoto.file) {
            URL.revokeObjectURL(promoPhoto.preview);
        }
        setPromoPhoto(null);
    };

    const handleVideoChange = (files: File[]) => {
        const file = files[0];
        if (file.size > 30 * 1024 * 1024) { alert("Ukuran file video tidak boleh melebihi 30MB."); return; }
        if (productVideo && productVideo.file) URL.revokeObjectURL(productVideo.preview);
        setProductVideo({ file, preview: URL.createObjectURL(file) });
    };

    const removeVideo = () => {
        if (productVideo && productVideo.file) {
            URL.revokeObjectURL(productVideo.preview);
        }
        setProductVideo(null);
    }

    const addVariation = () => setVariations([...variations, { id: Date.now(), name: '', options: [{ id: Date.now(), name: '' }] }]);
    const removeVariation = (id: number) => setVariations(variations.filter(v => v.id !== id));
    const handleVariationNameChange = (id: number, name: string) => setVariations(variations.map(v => v.id === id ? { ...v, name } : v));
    const addOption = (vId: number) => setVariations(variations.map(v => v.id === vId ? { ...v, options: [...v.options, { id: Date.now(), name: '' }] } : v));
    const removeOption = (vId: number, oId: number) => setVariations(variations.map(v => v.id === vId ? { ...v, options: v.options.filter(o => o.id !== oId) } : v));

    const handleOptionNameChange = (vId: number, oId: number, name: string) => {
        setVariations(variations.map(v =>
            v.id === vId
                ? { ...v, options: v.options.map(o => o.id === oId ? { ...o, name } : o) }
                : v
        ));
    };

    const handleVariantChange = (index: number, field: keyof Omit<ProductVariant, 'combination' | 'image'>, value: string | number) => {
        const updated = [...productVariants];
        updated[index] = { ...updated[index], [field]: value };
        setProductVariants(updated);
    };
    const handleVariantImageChange = (files: File[], index: number) => {
        const file = files[0];
        if (!file) return;
        const newImage = { file, preview: URL.createObjectURL(file) };
        setProductVariants(current => current.map((v, i) => {
            if (i === index && v.image && v.image.file) URL.revokeObjectURL(v.image.preview);
            return i === index ? { ...v, image: newImage } : v;
        }));
    };
    const removeVariantImage = (index: number) => {
        setProductVariants(current => current.map((v, i) => {
            if (i === index && v.image) {
                if (v.image.file) URL.revokeObjectURL(v.image.preview);
                return { ...v, image: null };
            }
            return v;
        }));
    };
    const triggerVariantImageUpload = (index: number) => {
        if (variantInputRef.current) {
            variantInputRef.current.dataset.index = String(index);
            variantInputRef.current.click();
        }
    };
    const handleConfirmCategory = () => {
        setCategory(tempCategory);
        setCategoryModalOpen(false);
        if (errors.category_id) setErrors(p => ({ ...p, category_id: undefined }));
    };

    const validateForm = () => { /* ... validation logic ... */ return true };

    const handleSave = (status: 'PUBLISHED' | 'ARCHIVED') => {
        if (!validateForm()) return;
        const formData = new FormData();
        if (isEditMode) {
            formData.append('_method', 'POST');
            formData.append('product_id', productData.id);
        }
        formData.append('status', status);
        formData.append('name', productName);
        formData.append('description', description);
        formData.append('category_id', String(idCategorie));
        formData.append('is_used', isUsed ? '1' : '0');
        formData.append('min_purchase', String(minPurchase));
        formData.append('max_purchase', String(maxPurchase || ''));
        formData.append('has_variation', hasVariations ? '1' : '0');

        productPhotos.forEach((photo, index) => {
            if (photo.file) { // Only append new files
                formData.append(`media[${index}][file]`, photo.file);
                formData.append(`media[${index}][type]`, 'image');
            }
        });
        if (productVideo && productVideo.file) {
            const videoIndex = productPhotos.length;
            formData.append(`media[${videoIndex}][file]`, productVideo.file);
            formData.append(`media[${videoIndex}][type]`, 'video');
        }

        if (promoPhoto && promoPhoto.file) {
            formData.append('image_url', promoPhoto.file);
        }

        if (hasVariations) {
            const activeVariations = variations.filter(v => v.name && v.options.some(o => o.name));
            const variationsData = activeVariations.map(v => ({ name: v.name, options: v.options.filter(o => o.name).map(o => ({ name: o.name })) }));
            buildFormData(formData, variationsData, 'variations');
            productVariants.forEach((variant, index) => {
                const variantData = { price: variant.price, stock: variant.stock, sku: variant.sku, combination: variant.combination };
                buildFormData(formData, variantData, `product_variants[${index}]`);
                if (variant.image && variant.image.file) {
                    formData.append(`product_variants[${index}][image]`, variant.image.file);
                }
            });
        } else {
            formData.append('price', String(price));
            formData.append('stock', String(stock));
            formData.append('sku', sku);
        }
        onSave(formData);
    };

    const handleSaveAndPublish = () => handleSave('PUBLISHED');
    const handleSaveAndArchive = () => handleSave('ARCHIVED');
    return (
        <div className="bg-gray-50 rounded-lg font-sans">
            <input type="file" ref={productPhotoInputRef} onChange={(e) => handleFileSelection(e, handleProductPhotosChange)} accept="image/jpeg,image/png" multiple style={{ display: 'none' }} />
            <input type="file" ref={promoPhotoInputRef} onChange={(e) => handleFileSelection(e, handlePromoPhotoChange)} accept="image/jpeg,image/png" style={{ display: 'none' }} />
            <input type="file" ref={videoInputRef} onChange={(e) => handleFileSelection(e, handleVideoChange)} accept="video/mp4" style={{ display: 'none' }} />
            <input type="file" ref={variantInputRef} className="hidden" accept="image/*" onChange={(e) => { const index = e.currentTarget.dataset.index; if (index) handleFileSelection(e, (files) => handleVariantImageChange(files, parseInt(index, 10))) }} />

            <Modal isOpen={isCategoryModalOpen} onClose={() => setCategoryModalOpen(false)} title="Pilih Kategori">
                <CategorySelector onSelectCategory={setTempCategory} initialCategory={category} categories={apiCategories} isLoading={categoryLoading} error={categoryError} setIdCategorie={setIdCategorie} setCategoryModalOpen={setCategoryModalOpen} handleConfirmCategory={handleConfirmCategory} />
            </Modal>

            <div className="bg-white rounded-md shadow-sm">
                <div className="p-4 sm:p-8 space-y-10">

                    {/* --- Media Upload Section --- */}
                    <div className="space-y-8">
                        {/* 1. Product Photos */}
                        <div>
                            <SectionTitle title="Foto Produk" required />
                            <p className="text-xs text-gray-500 mb-4">Upload 1-9 foto. Foto pertama akan menjadi foto utama produk Anda.</p>
                            <div className="flex flex-wrap gap-4 items-center">
                                {productPhotos.map((photo, index) => (
                                    <div key={photo.preview} className="relative w-28 h-28 flex-shrink-0">
                                        <img src={photo.preview} alt={`preview ${index}`} className="w-full h-full object-cover rounded-sm border" />
                                        <button onClick={() => removeProductPhoto(index)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/80 transition-colors"><X size={14} /></button>
                                        {index === 0 && <div className="absolute bottom-0 left-0 w-full bg-blue-600 text-white text-center text-xs py-0.5">Utama</div>}
                                    </div>
                                ))}
                                {productPhotos.length < 9 && (
                                    <button onClick={() => productPhotoInputRef.current?.click()} className={`w-28 h-28 flex flex-col items-center justify-center border-2 border-dashed rounded-sm bg-white text-center hover:bg-blue-50 transition-colors ${errors.media ? 'border-red-500 text-red-500' : 'border-blue-400 text-blue-500'}`}>
                                        <Camera className="h-8 w-8" strokeWidth={1.5} />
                                        <span className="text-xs mt-1">Tambahkan Foto ({productPhotos.length}/9)</span>
                                    </button>
                                )}
                            </div>
                            {errors.media && <p className="text-red-500 text-xs mt-2">{errors.media}</p>}
                        </div>

                        {/* 2. Promo Photo */}
                        <div>
                            <SectionTitle title="Foto Produk Promosi" required />
                            <p className="text-xs text-gray-500 mb-4">
                                • Upload Foto dengan rasio 1:1. <br />
                                • Foto ini akan digunakan di halaman promosi, hasil pencarian, rekomendasi, dll.
                            </p>
                            <div className="flex flex-wrap gap-4 items-center">
                                {promoPhoto ? (
                                    <div className="relative w-28 h-28 flex-shrink-0">
                                        <img src={promoPhoto.preview} alt="promo preview" className="w-full h-full object-cover rounded-sm border" />
                                        <button onClick={removePromoPhoto} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/80 transition-colors"><X size={14} /></button>
                                    </div>
                                ) : (
                                    <button onClick={() => promoPhotoInputRef.current?.click()} className={`w-28 h-28 flex flex-col items-center justify-center border-2 border-dashed rounded-sm bg-white text-center hover:bg-blue-50 transition-colors ${errors.promoPhoto ? 'border-red-500 text-red-500' : 'border-blue-400 text-blue-500'}`}>
                                        <Camera className="h-8 w-8" strokeWidth={1.5} />
                                        <span className="text-xs mt-1">Upload Foto (0/1)</span>
                                    </button>
                                )}
                            </div>
                            {errors.promoPhoto && <p className="text-red-500 text-xs mt-2">{errors.promoPhoto}</p>}
                        </div>

                        {/* 3. Product Video */}
                        <div>
                            <SectionTitle title="Video Produk" />
                            <p className="text-xs text-gray-500 mb-4">
                                • Ukuran file video maks. 30MB. <br />
                                • Durasi: 10-60 detik. Format: MP4.
                            </p>
                            <div className="flex flex-wrap gap-4 items-center">
                                {productVideo ? (
                                    <div className="relative w-28 h-28 flex-shrink-0">
                                        <video src={productVideo.preview} className="w-full h-full object-cover rounded-sm border" />
                                        <button onClick={removeVideo} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/80 transition-colors"><X size={14} /></button>
                                    </div>
                                ) : (
                                    <button onClick={() => videoInputRef.current?.click()} className="w-28 h-28 flex flex-col items-center justify-center border-2 border-dashed rounded-sm bg-white text-center text-blue-500 border-blue-400 hover:bg-blue-50 transition-colors">
                                        <Video className="h-8 w-8" strokeWidth={1.5} />
                                        <span className="text-xs mt-1">Tambah Video</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* --- End of Media Upload Section --- */}
                    <div className="space-y-8">
                        <div>
                            <SectionTitle title="Nama Produk" required />
                            <div className="relative flex-grow">
                                <input type="text" value={productName} maxLength={255} onChange={(e) => { setProductName(e.target.value); if (errors.productName) setErrors(p => ({ ...p, productName: undefined })); }} placeholder="Merek + Tipe + Fitur Produk" className={`w-full p-2 border rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-16 ${errors.productName ? 'border-red-500' : 'border-gray-300'}`} />
                                <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-400">{productName.length}/255</span>
                            </div>
                            {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName}</p>}
                        </div>
                        <div>
                            <SectionTitle title="Kategori" required />
                            <button onClick={() => { setTempCategory(category); setCategoryModalOpen(true); }} className={`w-full flex justify-between items-center text-left p-2 border rounded-sm bg-white hover:bg-gray-50 transition-colors ${errors.category_id ? 'border-red-500' : 'border-gray-300'}`}>
                                <span className={category ? 'text-gray-800' : 'text-gray-400'}>{category || "Pilih Kategori"}</span>
                                <Edit2Icon className="text-gray-400" size={16} />
                            </button>
                            {errors.category_id && <p className="text-red-500 text-xs mt-2">{errors.category_id}</p>}
                        </div>
                        <div>
                            <SectionTitle title="Kondisi Produk" required />
                            <div className="flex items-center space-x-6"><label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="is_used" checked={!isUsed} onChange={() => setIsUsed(false)} className="form-radio text-blue-600" /><span className="text-sm">Baru</span></label><label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="is_used" checked={isUsed} onChange={() => setIsUsed(true)} className="form-radio text-blue-600" /><span className="text-sm">Bekas</span></label></div>
                        </div>
                    </div>
                    <div>
                        <SectionTitle title="Deskripsi Produk" required />
                        <textarea id="description" rows={8} value={description} onChange={(e) => { setDescription(e.target.value); if (errors.description) setErrors(p => ({ ...p, description: undefined })); }} className={`w-full border p-2 rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`} placeholder="Deskripsikan produkmu secara lengkap di sini..." />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    <div className="space-y-8">
                        <div>
                            <SectionTitle title="Variasi Produk" />
                            <p className="text-xs text-gray-500 mb-4">Aktifkan jika produk memiliki variasi. Jika tidak, biarkan kosong dan isi harga di bagian bawah.</p>
                            <div className="space-y-4">
                                {variations.map((v, i) => (<div key={v.id} className="bg-gray-50 border border-gray-200 rounded-md p-4"><div className="flex justify-between items-center mb-4"><div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full"><label htmlFor={`v-name-${v.id}`} className="text-sm font-medium text-gray-700">Variasi {i + 1}</label><input type="text" id={`v-name-${v.id}`} value={v.name} onChange={(e) => handleVariationNameChange(v.id, e.target.value)} maxLength={14} placeholder="Nama Variasi (cth: Warna)" className="p-2 w-full sm:w-1/3 border-gray-300 rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" /></div><button onClick={() => removeVariation(v.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button></div><label className="text-sm font-medium text-gray-700 block mb-2">Opsi</label><div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">{v.options.map(o => (<div key={o.id} className="relative flex items-center"><input type="text" value={o.name} onChange={(e) => handleOptionNameChange(v.id, o.id, e.target.value)} maxLength={20} placeholder="Opsi (cth: Merah)" className="w-full p-2 border-gray-300 rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm pr-12" /><span className="absolute inset-y-0 right-8 flex items-center text-xs text-gray-400">{o.name.length}/20</span><button onClick={() => removeOption(v.id, o.id)} className="absolute right-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button></div>))}<button onClick={() => addOption(v.id)} className="w-full border-2 border-dashed border-blue-400 text-blue-500 rounded-sm py-2 text-sm hover:bg-blue-50 transition-colors">+ Tambah Opsi</button></div></div>))}
                                {variations.length < 2 && <button onClick={addVariation} className="w-full border-2 border-dashed border-gray-300 text-gray-600 rounded-sm py-2 hover:border-blue-400 hover:text-blue-500 transition-colors">+ Tambah Grup Variasi</button>}
                            </div>
                        </div>
                        {hasVariations && productVariants.length > 0 && (
                            <div>
                                <SectionTitle title="Daftar Variasi" required />
                                <div className="overflow-x-auto rounded-md"><table className="w-full text-sm text-left"><thead className="bg-gray-100"><tr>{variations.filter(v => v.name).map(v => <th key={v.id} className="p-2 font-medium text-gray-600">{v.name}</th>)}<th className="p-2 font-medium text-gray-600">Harga</th><th className="p-2 font-medium text-gray-600">Stok</th><th className="p-2 font-medium text-gray-600">Kode Variasi</th></tr></thead><tbody>{productVariants.map((variant, index) => (<tr key={index} className="border-b border-gray-200 bg-white">{Object.keys(variant.combination).map((key, i) => (<td key={i} className="p-2 align-top">{variant.combination[key]}{i === 0 && (<div className="mt-2">{variant.image ? (<div className="relative w-16 h-16"><img src={variant.image.preview} alt="variant" className="w-full h-full object-cover rounded-sm border" /><button onClick={() => removeVariantImage(index)} className="absolute -top-1 -right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80"><X size={12} /></button></div>) : (<button onClick={() => triggerVariantImageUpload(index)} className="w-16 h-16 flex items-center justify-center border border-dashed rounded-sm text-gray-400 hover:border-blue-400 hover:text-blue-500"><PlusSquare size={20} /></button>)}</div>)}</td>))}<td className="p-2 align-top"><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span><input type="number" value={variant.price} onChange={e => handleVariantChange(index, 'price', e.target.value)} className={`w-full p-2 border rounded-sm shadow-sm pl-8 ${errors[`product_variants_${index}_price`] ? 'border-red-500' : 'border-gray-300'}`} /></div>{errors[`product_variants_${index}_price`] && <p className="text-red-500 text-xs mt-1">{errors[`product_variants_${index}_price`]}</p>}</td><td className="p-2 align-top"><input type="number" value={variant.stock} onChange={e => handleVariantChange(index, 'stock', e.target.value)} className={`w-full p-2 border rounded-sm shadow-sm ${errors[`product_variants_${index}_stock`] ? 'border-red-500' : 'border-gray-300'}`} />{errors[`product_variants_${index}_stock`] && <p className="text-red-500 text-xs mt-1">{errors[`product_variants_${index}_stock`]}</p>}</td><td className="p-2 align-top"><input type="text" value={variant.sku} onChange={e => handleVariantChange(index, 'sku', e.target.value)} placeholder="SKU" className="w-full p-2 border-gray-300 rounded-sm shadow-sm" /></td></tr>))}</tbody></table></div>
                            </div>
                        )}
                    </div>
                    {!hasVariations && (
                        <div><SectionTitle title="Harga, Stok, & SKU" required /><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div><label className="text-sm font-medium text-gray-700 block mb-1">Harga Satuan</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span><input type="number" value={price} onChange={e => setPrice(e.target.value)} className={`w-full p-2 border rounded-sm shadow-sm pl-8 ${errors.price ? 'border-red-500' : 'border-gray-300'}`} /></div>{errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}</div><div><label className="text-sm font-medium text-gray-700 block mb-1">Stok</label><input type="number" value={stock} onChange={e => setStock(e.target.value)} className={`w-full p-2 border rounded-sm shadow-sm ${errors.stock ? 'border-red-500' : 'border-gray-300'}`} />{errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}</div><div><label className="text-sm font-medium text-gray-700 block mb-1">Kode SKU (Opsional)</label><input type="text" value={sku} onChange={e => setSku(e.target.value)} placeholder="Masukkan SKU" className="w-full p-2 border-gray-300 rounded-sm shadow-sm" /></div></div></div>
                    )}
                    <div>
                        <SectionTitle title="Pengaturan Pembelian" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div><label className="text-sm font-medium text-gray-700 block mb-1">Min. Jumlah Pembelian</label><input type="number" value={minPurchase} onChange={(e) => setMinPurchase(e.target.value ? Number(e.target.value) : '')} className={`w-full p-2 border rounded-sm shadow-sm ${errors.min_purchase ? 'border-red-500' : 'border-gray-300'}`} /><p className="text-xs text-gray-500 mt-2">Jumlah minimum produk yang harus dibeli.</p>{errors.min_purchase && <p className="text-red-500 text-xs mt-1">{errors.min_purchase}</p>}</div>
                            <div><label className="text-sm font-medium text-gray-700 block mb-1">Maks. Jumlah Pembelian</label><input type="number" value={maxPurchase} onChange={(e) => setMaxPurchase(e.target.value)} placeholder="Tanpa Batas" className="w-full p-2 border-gray-300 rounded-sm shadow-sm" /><p className="text-xs text-gray-500 mt-2">Kosongkan jika tanpa batas.</p></div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 sticky bottom-0 bg-gray-50/95 backdrop-blur-sm py-4 mt-6 px-4 border-t">
                    <button onClick={onCancel} className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-sm text-gray-700 bg-white hover:bg-gray-100 transition-colors">Batal</button>
                    <button onClick={handleSaveAndArchive} className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-sm text-gray-700 bg-white hover:bg-gray-100 transition-colors">Simpan & Arsipkan</button>
                    <button onClick={handleSaveAndPublish} className="w-full sm:w-auto px-6 py-2 bg-blue-600 border border-transparent text-white rounded-sm hover:bg-blue-700 transition-colors">Simpan & Tampilkan</button>
                </div>
            </div>
        </div>
    );
};

export default FormProduct;
