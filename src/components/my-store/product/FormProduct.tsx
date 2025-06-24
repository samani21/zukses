import Modal from 'components/common/Modal';
import React, { FC, useEffect, useRef, useState } from 'react'
import Get from 'services/api/Get';
import { Category, FileWithPreview, FormErrors, ProductVariant, TabName, Variation, VariationOption } from 'services/api/product';
import { Response } from 'services/api/types';
import CategorySelector from './CategorySelector';
import TabButton from 'components/common/TabButton';
import SectionTitle from 'components/common/SectionTitle';
import { Edit2Icon, ImageIcon } from 'components/common/icons';
import { Camera } from 'lucide-react';
import X from 'components/common/icons/X';
import Video from 'components/common/icons/Video';
import Trash2 from 'components/common/icons/Trash2';
import PlusSquare from 'components/common/icons/PlusSquare';

const FormProduct: FC<{ onSave: (formData: FormData) => void; onCancel: () => void; }> = ({ onSave, onCancel }) => {
    // --- State Management ---
    const [activeTab, setActiveTab] = useState<TabName>('dasar');
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Pakaian Wanita > Atasan > Blouse > Blouse Lengan Pendek');
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [tempCategory, setTempCategory] = useState(category);
    const [apiCategories, setApiCategories] = useState<Category[]>([]);
    const [categoryLoading, setCategoryLoading] = useState(true);
    const [categoryError, setCategoryError] = useState<string | null>(null);
    const [productPhotos, setProductPhotos] = useState<FileWithPreview[]>([]);
    const [promoPhoto, setPromoPhoto] = useState<FileWithPreview | null>(null);
    const [productVideo, setProductVideo] = useState<FileWithPreview | null>(null);
    const [variations, setVariations] = useState<Variation[]>([
        { id: 1, name: 'Ukuran', options: [{ id: 1, name: 'Besar' }, { id: 2, name: 'Kecil' }] }
    ]);
    const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
    const [minPurchase, setMinPurchase] = useState<number | string>(1);
    const [maxPurchase, setMaxPurchase] = useState<number | string>('Tanpa Batas');
    const [showSavedMessage, setShowSavedMessage] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [idCategorie, setIdCategorie] = useState<number>(11); // Default ID untuk kategori awal

    // --- Refs untuk Input File ---
    const productPhotoInputRef = useRef<HTMLInputElement>(null);
    const promoPhotoInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const variantInputRef = useRef<HTMLInputElement>(null);

    // --- Effects ---

    // Mengambil data kategori saat komponen dimuat
    useEffect(() => {
        const fetchCategories = async () => {
            setCategoryLoading(true);
            setCategoryError(null);
            try {
                const res = await Get<Response>('zukses', `category/show`);
                if (res?.status === 'success' && Array.isArray(res.data)) {
                    setApiCategories(res.data as Category[]);
                } else {
                    setCategoryError("Gagal mengambil data kategori.");
                    console.warn('Data kategori tidak ditemukan atau format tidak sesuai.');
                }
            } catch (error) {
                setCategoryError("Gagal memuat kategori. Silakan coba lagi.");
                console.error(error);
            } finally {
                setCategoryLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Membuat kombinasi varian produk secara otomatis saat variasi berubah
    useEffect(() => {
        const activeVariations = variations.filter(v => v.name && v.options.some(o => o.name));
        if (activeVariations.length === 0) {
            setProductVariants([]);
            return;
        }

        const cartesian = <T,>(...args: T[][]): T[][] => {
            return args.reduce<T[][]>((acc, val) => acc.flatMap(d => val.map(e => [...d, e])), [[]]);
        };

        const optionArrays = activeVariations.map(v => v.options.filter(o => o.name));
        const combinations = cartesian<VariationOption>(...optionArrays);

        const newVariants: ProductVariant[] = combinations.map(combo => {
            const combinationObj: Record<string, string> = {};
            combo.forEach((option, index) => {
                const variationName = activeVariations[index].name;
                combinationObj[variationName] = option.name;
            });

            // Mencari varian yang sudah ada untuk mempertahankan data harga/stok
            const existingVariant = productVariants.find(p => {
                const pKeys = Object.keys(p.combination);
                const cKeys = Object.keys(combinationObj);
                if (pKeys.length !== cKeys.length) return false;
                return pKeys.every(key => p.combination[key] === combinationObj[key]);
            });

            return {
                combination: combinationObj,
                price: existingVariant?.price || '',
                stock: existingVariant?.stock || '',
                sku: existingVariant?.sku || '',
                image: existingVariant?.image || null
            };
        });

        setProductVariants(newVariants);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [variations]);

    // Membersihkan URL object untuk mencegah kebocoran memori
    useEffect(() => {
        return () => {
            productPhotos.forEach(file => URL.revokeObjectURL(file.preview));
            if (promoPhoto) URL.revokeObjectURL(promoPhoto.preview);
            if (productVideo) URL.revokeObjectURL(productVideo.preview);
            productVariants.forEach(variant => {
                if (variant.image) URL.revokeObjectURL(variant.image.preview);
            });
        };
    }, [productPhotos, promoPhoto, productVideo, productVariants]);


    // --- Handler Fungsi ---

    // Meng-handle pemilihan file
    const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>, callback: (files: File[]) => void) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            callback(files);
        }
        e.target.value = ''; // Reset input agar bisa memilih file yang sama lagi
    };

    const handleProductPhotosChange = (files: File[]) => {
        const newPhotos = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
        setProductPhotos(prev => [...prev, ...newPhotos].slice(0, 9));
        if (errors.productPhotos) {
            setErrors(prev => ({ ...prev, productPhotos: undefined }));
        }
    };

    const removeProductPhoto = (index: number) => {
        const photoToRemove = productPhotos[index];
        URL.revokeObjectURL(photoToRemove.preview);
        setProductPhotos(productPhotos.filter((_, i) => i !== index));
    };

    const handlePromoPhotoChange = (files: File[]) => {
        if (promoPhoto) URL.revokeObjectURL(promoPhoto.preview);
        setPromoPhoto({ file: files[0], preview: URL.createObjectURL(files[0]) });
        if (errors.promoPhoto) {
            setErrors(prev => ({ ...prev, promoPhoto: undefined }));
        }
    };

    const handleVideoChange = (files: File[]) => {
        const file = files[0];
        if (file.size > 30 * 1024 * 1024) { // 30MB limit
            alert("Ukuran file video tidak boleh melebihi 30MB.");
            return;
        }
        if (productVideo) URL.revokeObjectURL(productVideo.preview);
        setProductVideo({ file, preview: URL.createObjectURL(file) });
    };

    // Handler untuk variasi
    const addVariation = () => setVariations([...variations, { id: Date.now(), name: ``, options: [{ id: Date.now(), name: '' }] }]);
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

    // Handler untuk varian (daftar harga, stok, dll)
    const handleVariantChange = (index: number, field: keyof Omit<ProductVariant, 'combination' | 'image'>, value: string | number) => {
        const updated = [...productVariants];
        const currentVariant = { ...updated[index] };
        if (field === 'price' || field === 'stock') {
            currentVariant[field] = value === '' ? '' : Number(value);
        } else {
            currentVariant[field] = String(value);
        }
        updated[index] = currentVariant;
        setProductVariants(updated);
    };

    const handleVariantImageChange = (files: File[], index: number) => {
        const file = files[0];
        if (!file) return;
        setProductVariants(currentVariants =>
            currentVariants.map((variant, i) => {
                if (i === index) {
                    if (variant.image) URL.revokeObjectURL(variant.image.preview);
                    return { ...variant, image: { file, preview: URL.createObjectURL(file) } };
                }
                return variant;
            })
        );
    };

    const removeVariantImage = (index: number) => {
        setProductVariants(currentVariants =>
            currentVariants.map((variant, i) => {
                if (i === index && variant.image) {
                    URL.revokeObjectURL(variant.image.preview);
                    return { ...variant, image: null };
                }
                return variant;
            })
        );
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
    };

    // --- Validasi & Submit Form ---
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!productName.trim()) newErrors.productName = 'Nama Produk harus diisi.';
        if (!description.trim()) newErrors.description = 'Deskripsi Produk harus diisi.';
        if (productPhotos.length === 0) newErrors.productPhotos = 'Mohon unggah minimal 1 Foto Produk.';
        if (!promoPhoto) newErrors.promoPhoto = 'Foto Produk Promosi wajib diisi.';

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            if (newErrors.productName || newErrors.description) {
                setActiveTab('dasar');
            } else if (newErrors.productPhotos || newErrors.promoPhoto) {
                setActiveTab('media');
            }
            return false;
        }
        return true;
    };

    const handleSaveClick = () => {
        if (!validateForm()) return;

        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('description', description);
        formData.append('categoryId', String(idCategorie));
        formData.append('categoryPath', category);
        formData.append('minPurchase', String(minPurchase));
        formData.append('maxPurchase', String(maxPurchase));

        productPhotos.forEach((photo) => {
            formData.append(`productPhotos`, photo.file);
        });

        if (promoPhoto) formData.append('promoPhoto', promoPhoto.file);
        if (productVideo) formData.append('productVideo', productVideo.file);

        // const variantsForUpload = productVariants.map(variant => {
        //     const { image, ...rest } = variant;
        //     return rest;
        // });

        formData.append('variations', JSON.stringify(variations));
        // formData.append('productVariants', JSON.stringify(variantsForUpload));

        productVariants.forEach((variant, index) => {
            if (variant.image) {
                formData.append(`variantImage_${index}`, variant.image.file);
            }
        });

        onSave(formData);
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 3000);
    };


    // --- Render Component ---
    return (
        <div className="bg-gray-50 rounded-lg font-sans">
            {/* Input file tersembunyi */}
            <input type="file" ref={productPhotoInputRef} onChange={(e) => handleFileSelection(e, handleProductPhotosChange)} accept="image/*" multiple style={{ display: 'none' }} />
            <input type="file" ref={promoPhotoInputRef} onChange={(e) => handleFileSelection(e, handlePromoPhotoChange)} accept="image/*" style={{ display: 'none' }} />
            <input type="file" ref={videoInputRef} onChange={(e) => handleFileSelection(e, handleVideoChange)} accept="video/mp4" style={{ display: 'none' }} />
            <input type="file" ref={variantInputRef} className="hidden" accept="image/*" onChange={(e) => {
                const index = e.currentTarget.dataset.index;
                if (index !== undefined) {
                    handleFileSelection(e, (files) => handleVariantImageChange(files, parseInt(index, 10)));
                }
            }} />

            {/* Modal Kategori */}
            <Modal
                isOpen={isCategoryModalOpen}
                onClose={() => setCategoryModalOpen(false)}
                title="Pilih Kategori"
                footer={
                    <button onClick={handleConfirmCategory} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300" disabled={!tempCategory}>
                        Konfirmasi
                    </button>
                }
            >
                <CategorySelector
                    onSelectCategory={setTempCategory}
                    initialCategory={category}
                    categories={apiCategories}
                    isLoading={categoryLoading}
                    error={categoryError}
                    setIdCategorie={setIdCategorie}
                />
            </Modal>

            {/* Notifikasi Simpan */}
            {showSavedMessage && (<div className="fixed top-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg z-50">Produk disimpan! Periksa konsol untuk data FormData.</div>)}

            <div className="bg-white rounded-md shadow-sm">
                {/* Navigasi Tab */}
                <div className="border-b border-gray-200">
                    <div className="px-4 sm:px-8 flex flex-wrap">
                        <TabButton label="Informasi Dasar" isActive={activeTab === 'dasar'} onClick={() => setActiveTab('dasar')} hasError={!!(errors.productName || errors.description)} />
                        <TabButton label="Media" isActive={activeTab === 'media'} onClick={() => setActiveTab('media')} hasError={!!(errors.productPhotos || errors.promoPhoto)} />
                        <TabButton label="Spesifikasi" isActive={activeTab === 'spesifikasi'} onClick={() => setActiveTab('spesifikasi')} hasError={false} />
                        <TabButton label="Lainnya" isActive={activeTab === 'lainnya'} onClick={() => setActiveTab('lainnya')} hasError={false} />
                    </div>
                </div>

                {/* Konten Tab */}
                <div className="p-4 sm:p-8">
                    {activeTab === 'dasar' && (
                        <div className="space-y-8">
                            <div>
                                <SectionTitle title="Nama Produk" required />
                                <div className="relative flex-grow">
                                    <input type="text" id="productName" value={productName} maxLength={255} onChange={(e) => { setProductName(e.target.value); if (errors.productName) setErrors(p => ({ ...p, productName: undefined })); }} placeholder="Merek + Tipe + Fitur Produk" className={`w-full p-2 border rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-16 ${errors.productName ? 'border-red-500' : 'border-gray-300'}`} />
                                    <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-400">{productName.length}/255</span>
                                </div>
                                {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName}</p>}
                            </div>
                            <div>
                                <SectionTitle title="Kategori" required />
                                <button onClick={() => { setTempCategory(category); setCategoryModalOpen(true); }} className="w-full flex justify-between items-center text-left p-2 border border-gray-300 rounded-sm bg-white hover:bg-gray-50 transition-colors">
                                    <span className="text-gray-700">{category || "Pilih Kategori"}</span>
                                    <Edit2Icon className="text-gray-400" size={16} />
                                </button>
                            </div>
                            <div>
                                <SectionTitle title="Deskripsi Produk" required />
                                <textarea id="description" rows={8} value={description} onChange={(e) => { setDescription(e.target.value); if (errors.description) setErrors(p => ({ ...p, description: undefined })); }} className={`w-full border p-2 rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`} placeholder="Deskripsikan produkmu secara lengkap di sini..." />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>
                        </div>
                    )}

                    {activeTab === 'media' && (
                        <div className="space-y-8">
                            <div>
                                <SectionTitle title="Foto Produk" required />
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                    {productPhotos.map((photo, index) => (
                                        <div key={photo.preview} className="relative w-28 h-28">
                                            <img src={photo.preview} alt={`preview ${index}`} className="w-full h-full object-cover rounded-sm border" />
                                            <button onClick={() => removeProductPhoto(index)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/80 transition-colors"><X size={14} /></button>
                                        </div>
                                    ))}
                                    {productPhotos.length < 9 && (
                                        <button onClick={() => productPhotoInputRef.current?.click()} className={`w-28 h-28 flex flex-col items-center justify-center border-2 border-dashed rounded-sm bg-white text-center hover:bg-blue-50 transition-colors ${errors.productPhotos ? 'border-red-500 text-red-500' : 'border-blue-400 text-blue-500'}`}><Camera className="h-8 w-8" strokeWidth={1.5} /><span className="text-xs mt-1">Tambahkan Foto ({productPhotos.length}/9)</span></button>
                                    )}
                                </div>
                                {errors.productPhotos && <p className="text-red-500 text-xs mt-2">{errors.productPhotos}</p>}
                            </div>
                            <div>
                                <SectionTitle title="Foto Produk Promosi" required />
                                <div className="flex flex-col sm:flex-row items-start gap-4">
                                    {promoPhoto ? (
                                        <div className="relative w-28 h-28 flex-shrink-0">
                                            <img src={promoPhoto.preview} alt="promo preview" className="w-full h-full object-cover rounded-sm border" />
                                            <button onClick={() => { if (promoPhoto) URL.revokeObjectURL(promoPhoto.preview); setPromoPhoto(null); }} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/80 transition-colors"><X size={14} /></button>
                                        </div>
                                    ) : (
                                        <button onClick={() => promoPhotoInputRef.current?.click()} className={`w-28 h-28 flex flex-col items-center justify-center border rounded-sm bg-white text-center hover:bg-gray-50 flex-shrink-0 transition-colors ${errors.promoPhoto ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-500'}`}><ImageIcon className={`h-8 w-8 ${errors.promoPhoto ? 'text-red-400' : 'text-gray-400'}`} strokeWidth={1.5} /><span className="text-xs mt-1">Upload Foto (0/1)</span></button>
                                    )}
                                    <div className="text-xs text-gray-500 sm:pt-2 space-y-1"><p>&bull; Upload Foto dengan rasio 1:1.</p><p>&bull; Foto ini akan digunakan di halaman promosi, hasil pencarian, rekomendasi, dll.</p></div>
                                </div>
                                {errors.promoPhoto && <p className="text-red-500 text-xs mt-2">{errors.promoPhoto}</p>}
                            </div>
                            <div>
                                <SectionTitle title="Video Produk" />
                                <div className="flex flex-col sm:flex-row items-start gap-4">
                                    {productVideo ? (
                                        <div className="relative w-28 h-28 flex-shrink-0">
                                            <video src={productVideo.preview} className="w-full h-full object-cover rounded-sm border" controls />
                                            <button onClick={() => { if (productVideo) URL.revokeObjectURL(productVideo.preview); setProductVideo(null); }} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/80 transition-colors"><X size={14} /></button>
                                        </div>
                                    ) : (
                                        <button onClick={() => videoInputRef.current?.click()} className="w-28 h-28 flex flex-col items-center justify-center border border-gray-300 rounded-sm bg-white text-center text-gray-500 hover:bg-gray-50 flex-shrink-0 transition-colors"><Video className="h-8 w-8 text-gray-400" strokeWidth={1.5} /><span className="text-xs mt-1">Tambah Video</span></button>
                                    )}
                                    <div className="text-xs text-gray-500 sm:pt-2 space-y-1"><p>&bull; Ukuran file video maks. 30MB.</p><p>&bull; Durasi: 10-60 detik. Format: MP4.</p></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'spesifikasi' && (
                        <div className="space-y-8">
                            <div>
                                <SectionTitle title="Variasi Produk" />
                                <div className="space-y-4">
                                    {variations.map((v, i) => (<div key={v.id} className="bg-gray-50 border border-gray-200 rounded-md p-4"><div className="flex justify-between items-center mb-4"><div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full"><label htmlFor={`v-name-${v.id}`} className="text-sm font-medium text-gray-700">Variasi {i + 1}</label><input type="text" id={`v-name-${v.id}`} value={v.name} onChange={(e) => handleVariationNameChange(v.id, e.target.value)} maxLength={14} placeholder="Nama Variasi (cth: Warna)" className="p-2 w-full sm:w-1/3 border-gray-300 rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" /></div><button onClick={() => removeVariation(v.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button></div><label className="text-sm font-medium text-gray-700 block mb-2">Opsi</label><div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">{v.options.map(o => (<div key={o.id} className="relative flex items-center"><input type="text" value={o.name} onChange={(e) => handleOptionNameChange(v.id, o.id, e.target.value)} maxLength={20} placeholder="Opsi (cth: Merah)" className="w-full p-2 border-gray-300 rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm pr-12" /><span className="absolute inset-y-0 right-8 flex items-center text-xs text-gray-400">{o.name.length}/20</span><button onClick={() => removeOption(v.id, o.id)} className="absolute right-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button></div>))}<button onClick={() => addOption(v.id)} className="w-full border-2 border-dashed border-blue-400 text-blue-500 rounded-sm py-2 text-sm hover:bg-blue-50 transition-colors">+ Tambah Opsi</button></div></div>))}
                                    {variations.length < 2 && <button onClick={addVariation} className="w-full border-2 border-dashed border-gray-300 text-gray-600 rounded-sm py-2 hover:border-blue-400 hover:text-blue-500 transition-colors">+ Tambah Grup Variasi</button>}
                                </div>
                            </div>

                            {productVariants.length > 0 && (
                                <div>
                                    <SectionTitle title="Daftar Variasi" />
                                    <div className="overflow-x-auto rounded-md bg-gray-50/50">
                                        <table className="w-full text-sm text-left hidden md:table">
                                            <thead className="bg-gray-100"><tr>{variations.filter(v => v.name).map(v => <th key={v.id} className="p-2 font-medium text-gray-600">{v.name}</th>)}<th className="p-2 font-medium text-gray-600">Harga</th><th className="p-2 font-medium text-gray-600">Stok</th><th className="p-2 font-medium text-gray-600">Kode Variasi</th></tr></thead>
                                            <tbody>{productVariants.map((variant, index) => (<tr key={Object.values(variant.combination).join('-')} className="border-b border-gray-200 bg-white">{Object.values(variant.combination).map((o, i) => (<td key={i} className="p-2 align-top">{o}
                                                {i === 0 && (
                                                    <div className="mt-2">
                                                        {variant.image ? (
                                                            <div className="relative w-16 h-16">
                                                                <img src={variant.image.preview} alt="variant preview" className="w-full h-full object-cover rounded-sm border" />
                                                                <button onClick={() => removeVariantImage(index)} className="absolute -top-1 -right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80"><X size={12} /></button>
                                                            </div>
                                                        ) : (
                                                            <button onClick={() => triggerVariantImageUpload(index)} className="w-16 h-16 flex flex-col items-center justify-center border border-dashed rounded-sm text-gray-400 hover:border-blue-400 hover:text-blue-500"><PlusSquare size={20} /></button>
                                                        )}
                                                    </div>
                                                )}
                                            </td>))}<td className="p-2 align-top"><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span><input type="number" value={variant.price} onChange={e => handleVariantChange(index, 'price', e.target.value)} className="w-full p-2 border-gray-300 rounded-sm shadow-sm pl-8" /></div></td><td className="p-2 align-top"><input type="number" value={variant.stock} onChange={e => handleVariantChange(index, 'stock', e.target.value)} className="w-full p-2 border-gray-300 rounded-sm shadow-sm" /></td><td className="p-2 align-top"><input type="text" value={variant.sku} onChange={e => handleVariantChange(index, 'sku', e.target.value)} placeholder="Masukkan SKU" className="w-full p-2 border-gray-300 rounded-sm shadow-sm" /></td></tr>))}</tbody>
                                        </table>
                                        <div className="space-y-4 md:hidden">
                                            {productVariants.map((variant, index) => (<div key={Object.values(variant.combination).join('-')} className="border rounded-md border-gray-200 p-4 bg-white shadow-sm"><div className="flex justify-between items-start"><div className="font-semibold text-gray-800">{Object.values(variant.combination).join(' / ')}</div>
                                                {variant.image ? (
                                                    <div className="relative w-16 h-16 flex-shrink-0 ml-4">
                                                        <img src={variant.image.preview} alt="variant preview" className="w-full h-full object-cover rounded-sm border" />
                                                        <button onClick={() => removeVariantImage(index)} className="absolute -top-1 -right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80"><X size={12} /></button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => triggerVariantImageUpload(index)} className="w-16 h-16 flex flex-col items-center justify-center border border-dashed rounded-sm text-gray-400 hover:border-blue-400 hover:text-blue-500 flex-shrink-0 ml-4"><PlusSquare size={20} /></button>
                                                )}
                                            </div><div className="mt-4 space-y-3"><div><label className="text-xs text-gray-500 block mb-1">Harga</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span><input type="number" value={variant.price} onChange={e => handleVariantChange(index, 'price', e.target.value)} className="w-full p-2 border-gray-300 rounded-sm shadow-sm pl-8" /></div></div><div><label className="text-xs text-gray-500 block mb-1">Stok</label><input type="number" value={variant.stock} onChange={e => handleVariantChange(index, 'stock', e.target.value)} className="w-full p-2 border-gray-300 rounded-sm shadow-sm" /></div><div><label className="text-xs text-gray-500 block mb-1">Kode Variasi</label><input type="text" value={variant.sku} onChange={e => handleVariantChange(index, 'sku', e.target.value)} placeholder="Masukkan SKU" className="w-full p-2 border-gray-300 rounded-sm shadow-sm" /></div></div></div>))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'lainnya' && (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div>
                                    <SectionTitle title="Min. Jumlah Pembelian" required />
                                    <input type="number" value={minPurchase} onChange={(e) => setMinPurchase(e.target.value ? Number(e.target.value) : '')} className="w-full p-2 border-gray-300 rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                                    <p className="text-xs text-gray-500 mt-2">Jumlah minimum produk yang harus dibeli oleh pelanggan dalam satu transaksi.</p>
                                </div>
                                <div>
                                    <SectionTitle title="Maks. Jumlah Pembelian" />
                                    <input type="text" value={maxPurchase} onChange={(e) => setMaxPurchase(e.target.value)} placeholder="Tanpa Batas" className="w-full p-2 border-gray-300 rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                                    <p className="text-xs text-gray-500 mt-2">Jumlah maksimum produk yang dapat dibeli. Kosongkan jika tanpa batas.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 sticky bottom-0 bg-gray-50/95 backdrop-blur-sm py-4 mt-6 px-4">
                <button onClick={onCancel} className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-sm text-gray-700 bg-white hover:bg-gray-100 transition-colors">Kembali</button>
                <button className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-sm text-gray-700 bg-white hover:bg-gray-100 transition-colors">Simpan & Arsipkan</button>
                <button onClick={handleSaveClick} className="w-full sm:w-auto px-6 py-2 bg-blue-600 border border-transparent text-white rounded-sm hover:bg-blue-700 transition-colors">Simpan & Tampilkan</button>
            </div>
        </div>
    );
};
export default FormProduct