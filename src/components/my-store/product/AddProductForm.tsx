import React, { FC, useEffect, useState } from 'react'

// --- Helper Components & Types (for a complete, runnable example) ---

// Define the Variation types
type VariationOption = {
    id: number;
    name: string;
};

type Variation = {
    id: number;
    name: string;
    options: VariationOption[];
};

// Define the type for the generated product list from variations
type ProductVariant = {
    // The key is the variation name (e.g., 'Ukuran'), value is the option name (e.g., 'Besar')
    combination: Record<string, string>;
    price: number | string;
    stock: number | string;
    sku: string;
    imageUrl?: string;
}

// Define the Product type
type Product = {
    id: string;
    name: string;
    description: string;
    sku: string;
    imageUrl: string;
    sales: number;
    price: number;
    stock: number;
    qualityScore: number;
    category: string;
    variations: Variation[];
    productVariants: ProductVariant[];
    minPurchase: number | string;
    maxPurchase: number | string;
};

// Mock Lucide Icons for demonstration purposes
const Camera: FC<{ className?: string; strokeWidth?: number; }> = ({ className, strokeWidth }) => (
    <svg className={className} strokeWidth={strokeWidth} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
        <circle cx="12" cy="13" r="3" />
    </svg>
);

const ImageIcon: FC<{ className?: string; strokeWidth?: number; }> = ({ className, strokeWidth }) => (
    <svg className={className} strokeWidth={strokeWidth} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
);

const Video: FC<{ className?: string; strokeWidth?: number; }> = ({ className, strokeWidth }) => (
    <svg className={className} strokeWidth={strokeWidth} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 8-6 4 6 4V8Z" />
        <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
);

const Edit2: FC<{ className?: string; size?: number; }> = ({ className, size }) => (
    <svg className={className} width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
);

const Trash2: FC<{ className?: string; size?: number; }> = ({ className, size }) => (
    <svg className={className} width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

const PlusSquare: FC<{ className?: string; size?: number; }> = ({ className, size }) => (
    <svg className={className} width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
);


// Helper for section titles
const SectionTitle: FC<{ title: string; required?: boolean; }> = ({ title, required }) => (
    <div className="mb-3">
        <h3 className="text-md font-semibold text-gray-800 flex items-center">
            {title}
            {required && <span className="text-orange-500 ml-1">*</span>}
        </h3>
    </div>
);


// --- The Form Component (now with variations) ---

const AddProductForm: FC<{ onSave: (product: Product) => void; onCancel: () => void; }> = ({ onSave, onCancel }) => {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [photoRatio, setPhotoRatio] = useState<'1:1' | '3:4'>('1:1');
    const [variations, setVariations] = useState<Variation[]>([
        { id: 1, name: 'Ukuran', options: [{ id: 1, name: 'Besar' }, { id: 2, name: 'Kecil' }, { id: 3, name: 'Sedang' }] }
    ]);
    const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
    const [bulkData, setBulkData] = useState({ price: '', stock: '', sku: '' });
    const [minPurchase, setMinPurchase] = useState<number | string>(1);
    const [maxPurchase, setMaxPurchase] = useState<number | string>('Tanpa Batas');

    useEffect(() => {
        const activeVariations = variations.filter(v => v.name && v.options.some(o => o.name));
        if (activeVariations.length === 0) {
            setProductVariants([]);
            return;
        }

        const cartesian = (...args: VariationOption[][]): VariationOption[][] => {
            return args.reduce<VariationOption[][]>((acc, val) => {
                return acc.flatMap(d => val.map(e => [d, e].flat()));
            }, [[]]);
        };

        const optionArrays = activeVariations.map(v => v.options.filter(o => o.name));
        const combinations = cartesian(...optionArrays);

        const newVariants: ProductVariant[] = combinations.map(combo => {
            const combinationName = combo.map(c => c.name).join('-');
            const existingVariant = productVariants.find(p => Object.values(p.combination).join('-') === combinationName);
            const combinationObj: Record<string, string> = {};
            combo.forEach((option, index) => {
                combinationObj[activeVariations[index].name] = option.name;
            });
            return {
                combination: combinationObj,
                price: existingVariant?.price || '',
                stock: existingVariant?.stock || '',
                sku: existingVariant?.sku || '',
            };
        });
        setProductVariants(newVariants);
    }, [variations]);

    const handleSaveClick = () => {
        if (!productName.trim() || !description.trim()) {
            alert('Nama Produk dan Deskripsi Produk tidak boleh kosong.');
            return;
        }

        const newProduct: Product = {
            id: `P${Date.now()}`, name: productName, description: description, sku: 'TEMP-SKU',
            imageUrl: photoRatio === '1:1' ? 'https://placehold.co/400x400/FF9800/FFFFFF?text=1:1' : 'https://placehold.co/300x400/FF9800/FFFFFF?text=3:4',
            sales: 0, price: 0, stock: 0, qualityScore: 90, category: 'Pakaian Wanita > Atasan > Tanktop & Kamisol',
            variations: variations, productVariants: productVariants, minPurchase: minPurchase, maxPurchase: maxPurchase,
        };
        onSave(newProduct);
    };

    const addVariation = () => setVariations([...variations, { id: Date.now(), name: ``, options: [{ id: Date.now(), name: '' }] }]);
    const removeVariation = (id: number) => setVariations(variations.filter(v => v.id !== id));
    const handleVariationNameChange = (id: number, name: string) => setVariations(variations.map(v => v.id === id ? { ...v, name } : v));
    const addOption = (vId: number) => setVariations(variations.map(v => v.id === vId ? { ...v, options: [...v.options, { id: Date.now(), name: '' }] } : v));
    const removeOption = (vId: number, oId: number) => setVariations(variations.map(v => v.id === vId ? { ...v, options: v.options.filter(o => o.id !== oId) } : v));
    const handleOptionNameChange = (vId: number, oId: number, name: string) => setVariations(variations.map(v => v.id === vId ? { ...v, options: v.options.map(o => o.id === oId ? { ...o, name } : o) } : v));
    const handleVariantChange = (
        index: number,
        field: keyof ProductVariant,
        value: ProductVariant[typeof field]
    ) => {
        const updated = [...productVariants];
        updated[index] = {
            ...updated[index],
            [field]: value,
        };
        setProductVariants(updated);
    };

    const handleBulkDataChange = (field: keyof typeof bulkData, value: string) => setBulkData(p => ({ ...p, [field]: value }));
    const applyBulkData = () => {
        setProductVariants(productVariants.map(v => ({
            ...v,
            price: bulkData.price !== '' ? Number(bulkData.price) : v.price,
            stock: bulkData.stock !== '' ? Number(bulkData.stock) : v.stock,
            sku: bulkData.sku !== '' ? bulkData.sku : v.sku,
        })));
    };

    return (
        <div className="bg-gray-50 p-4 sm:p-8 rounded-lg">
            <div className="bg-white rounded-md shadow-sm p-4 sm:p-8 mb-4">
                {/* --- Form sections --- */}
                <SectionTitle title="Foto Produk" required />
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <button onClick={() => setPhotoRatio('1:1')} className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${photoRatio === '1:1' ? 'text-orange-600 bg-orange-100' : 'hover:bg-gray-100'}`}><div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${photoRatio === '1:1' ? 'border-orange-500' : 'border-gray-400'}`}>{photoRatio === '1:1' && <div className="w-2 h-2 bg-orange-500 rounded-full"></div>}</div>Foto 1:1</button>
                    <button onClick={() => setPhotoRatio('3:4')} className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${photoRatio === '3:4' ? 'text-orange-600 bg-orange-100' : 'hover:bg-gray-100'}`}><div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${photoRatio === '3:4' ? 'border-orange-500' : 'border-gray-400'}`}>{photoRatio === '3:4' && <div className="w-2 h-2 bg-orange-500 rounded-full"></div>}</div>Foto 3:4</button>
                    <a href="#" className="text-blue-500 hover:underline">Lihat Contoh</a>
                </div>
                <div className="mt-4"><button className="w-28 h-28 flex flex-col items-center justify-center border-2 border-dashed border-orange-400 rounded-sm bg-white text-center text-orange-500 hover:bg-orange-50 transition-colors"><Camera className="h-8 w-8" strokeWidth={1.5} /><span className="text-xs mt-1">Tambahkan Foto (0/9)</span></button></div>
                <div className="h-8"></div>

                {/* --- Sections made responsive --- */}
                <SectionTitle title="Foto Produk Promosi" required />
                <div className="flex flex-col sm:flex-row items-start gap-4"><button className="w-28 h-28 flex flex-col items-center justify-center border border-gray-300 rounded-sm bg-white text-center text-gray-500 hover:bg-gray-50 flex-shrink-0 transition-colors"><ImageIcon className="h-8 w-8 text-gray-400" strokeWidth={1.5} /><span className="text-xs mt-1">(0/1)</span></button><div className="text-xs text-gray-500 sm:pt-2 space-y-1"><p>&bull; Upload Foto 1:1</p><p>&bull; Foto Produk Promosi akan digunakan di halaman promosi, hasil pencarian, rekomendasi, dll. Meng-upload foto produk promosi, akan meningkatkan minat belanja Pembeli.</p></div></div>
                <div className="h-8"></div>
                <SectionTitle title="Video Produk" />
                <div className="flex flex-col sm:flex-row items-start gap-4"><button className="w-28 h-28 flex flex-col items-center justify-center border border-gray-300 rounded-sm bg-white text-center text-gray-500 hover:bg-gray-50 flex-shrink-0 transition-colors"><Video className="h-8 w-8 text-gray-400" strokeWidth={1.5} /><span className="text-xs mt-1">Tambah Video</span></button><div className="text-xs text-gray-500 sm:pt-2 space-y-1"><p>&bull; File video maks. harus 30MB dengan resolusi tidak melebihi 1280 x 1280px.</p><p>&bull; Durasi: 10-60detik</p><p>&bull; Format: MP4</p><p>&bull; Catatan: Kamu dapat menampilkan produk saat video sedang diproses. Video akan muncul setelah berhasil diproses.</p></div></div>
                <div className="h-8"></div>

                {/* --- Other form sections --- */}
                <SectionTitle title="Nama Produk" required />
                <div className="relative flex-grow"><input type="text" id="productName" value={productName} maxLength={255} onChange={(e) => setProductName(e.target.value)} placeholder="Merek + Tipe + Fitur Produk" className="w-full border-gray-300 rounded-sm shadow-sm focus:ring-orange-500 focus:border-orange-500 pr-16" /><span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-400">{productName.length}/255</span></div>
                <div className="h-8"></div>
                <SectionTitle title="Kategori" required />
                <button className="w-full flex justify-between items-center text-left p-2 border border-gray-300 rounded-sm bg-white hover:bg-gray-50 transition-colors"><span className="text-gray-700">Pakaian Wanita &gt; Atasan &gt; Tanktop & Kamisol</span><Edit2 className="text-gray-400" size={16} /></button>
                <div className="h-8"></div>
                <SectionTitle title="Deskripsi Produk" required />
                <textarea id="description" rows={8} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border-gray-300 rounded-sm shadow-sm focus:ring-orange-500 focus:border-orange-500" />
                <div className="h-8"></div>

                {/* --- Variation Setup Section --- */}
                <SectionTitle title="Variasi" />
                <div className="space-y-4">
                    {variations.map((v, i) => (
                        <div key={v.id} className="bg-gray-50 border border-gray-200 rounded-md p-4">
                            <div className="flex justify-between items-center mb-4"><div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full"><label htmlFor={`v-name-${v.id}`} className="text-sm font-medium text-gray-700">Variasi {i + 1}</label><input type="text" id={`v-name-${v.id}`} value={v.name} onChange={(e) => handleVariationNameChange(v.id, e.target.value)} maxLength={14} placeholder="Nama Variasi (cth: Warna)" className="w-full sm:w-1/3 border-gray-300 rounded-sm shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm" /></div><button onClick={() => removeVariation(v.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button></div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">Opsi</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">{v.options.map(o => (<div key={o.id} className="relative flex items-center"><input type="text" value={o.name} onChange={(e) => handleOptionNameChange(v.id, o.id, e.target.value)} maxLength={20} placeholder="Opsi (cth: Merah)" className="w-full border-gray-300 rounded-sm shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm pr-12" /><span className="absolute inset-y-0 right-8 flex items-center text-xs text-gray-400">{o.name.length}/20</span><button onClick={() => removeOption(v.id, o.id)} className="absolute right-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button></div>))}<button onClick={() => addOption(v.id)} className="w-full border-2 border-dashed border-orange-400 text-orange-500 rounded-sm py-2 text-sm hover:bg-orange-50 transition-colors">+ Tambah Opsi</button></div>
                        </div>
                    ))}
                    <button onClick={addVariation} className="w-full border-2 border-dashed border-gray-300 text-gray-600 rounded-sm py-2 hover:border-orange-400 hover:text-orange-500 transition-colors">+ Tambah Variasi</button>
                </div>
                <div className="h-8"></div>

                {/* --- Responsive Variation List Table --- */}
                {productVariants.length > 0 && (
                    <>
                        <SectionTitle title="Daftar Variasi" />
                        <div className="p-4 border rounded-md">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2 items-end">
                                <div className="col-span-2 sm:col-span-1 text-sm font-medium text-gray-700">Harga</div>
                                <div className="hidden sm:block text-sm font-medium text-gray-700">Stok</div>
                                <div className="hidden sm:block text-sm font-medium text-gray-700">Kode Variasi</div>
                                <div className="col-span-2 sm:col-span-1"><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span><input type="number" value={bulkData.price} onChange={e => handleBulkDataChange('price', e.target.value)} className="w-full border-gray-300 rounded-sm shadow-sm pl-8" /></div></div>
                                <div className="col-span-1"><input type="number" value={bulkData.stock} onChange={e => handleBulkDataChange('stock', e.target.value)} placeholder="Stok" className="w-full border-gray-300 rounded-sm shadow-sm" /></div>
                                <div className="col-span-2 sm:col-span-1"><input type="text" value={bulkData.sku} onChange={e => handleBulkDataChange('sku', e.target.value)} placeholder="Kode Variasi" className="w-full border-gray-300 rounded-sm shadow-sm" /></div>
                                <button onClick={applyBulkData} className="col-span-2 sm:col-span-1 bg-orange-500 text-white rounded-sm py-2 hover:bg-orange-600 transition-colors h-full">Terapkan Ke Semua</button>
                            </div>

                            {/* Desktop Table */}
                            <table className="w-full mt-4 text-sm text-left hidden md:table">
                                <thead className="bg-gray-50"><tr>{variations.filter(v => v.name).map(v => <th key={v.id} className="p-2 font-medium text-gray-600">{v.name}</th>)}<th className="p-2 font-medium text-gray-600">Harga</th><th className="p-2 font-medium text-gray-600">Stok</th><th className="p-2 font-medium text-gray-600">Kode Variasi</th></tr></thead>
                                <tbody>{productVariants.map((variant, index) => (<tr key={index} className="border-b">{Object.values(variant.combination).map((o, i) => (<td key={i} className="p-2 align-top">{o}{i === 0 && (<button className="mt-2 w-16 h-16 flex flex-col items-center justify-center border border-dashed rounded-sm text-gray-400 hover:border-orange-400 hover:text-orange-500"><PlusSquare size={20} /></button>)}</td>))}<td className="p-2 align-top"><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span><input type="number" value={variant.price} onChange={e => handleVariantChange(index, 'price', Number(e.target.value))} className="w-full border-gray-300 rounded-sm shadow-sm pl-8" /></div></td><td className="p-2 align-top"><input type="number" value={variant.stock} onChange={e => handleVariantChange(index, 'stock', Number(e.target.value))} className="w-full border-gray-300 rounded-sm shadow-sm" /></td><td className="p-2 align-top"><input type="text" value={variant.sku} onChange={e => handleVariantChange(index, 'sku', e.target.value)} placeholder="Mohon masukkan" className="w-full border-gray-300 rounded-sm shadow-sm" /></td></tr>))}</tbody>
                            </table>

                            {/* Mobile Card List */}
                            <div className="space-y-4 mt-4 md:hidden">
                                {productVariants.map((variant, index) => (
                                    <div key={index} className="border rounded-md p-4">
                                        <div className="flex justify-between items-start">
                                            <div className="font-semibold text-gray-800">{Object.values(variant.combination).join(' / ')}</div>
                                            <button className="w-16 h-16 flex flex-col items-center justify-center border border-dashed rounded-sm text-gray-400 hover:border-orange-400 hover:text-orange-500 flex-shrink-0 ml-4"><PlusSquare size={20} /></button>
                                        </div>
                                        <div className="mt-4 space-y-3">
                                            <div><label className="text-xs text-gray-500">Harga</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span><input type="number" value={variant.price} onChange={e => handleVariantChange(index, 'price', Number(e.target.value))} className="w-full border-gray-300 rounded-sm shadow-sm pl-8" /></div></div>
                                            <div><label className="text-xs text-gray-500">Stok</label><input type="number" value={variant.stock} onChange={e => handleVariantChange(index, 'stock', Number(e.target.value))} className="w-full border-gray-300 rounded-sm shadow-sm" /></div>
                                            <div><label className="text-xs text-gray-500">Kode Variasi</label><input type="text" value={variant.sku} onChange={e => handleVariantChange(index, 'sku', e.target.value)} placeholder="Mohon masukkan" className="w-full border-gray-300 rounded-sm shadow-sm" /></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="h-8"></div>
                    </>
                )}

                {/* --- Purchase Limit Section (Responsive) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                        <SectionTitle title="Min. Jumlah Pembelian" required />
                        <input type="number" value={minPurchase} onChange={(e) => setMinPurchase(e.target.value ? Number(e.target.value) : '')} className="w-full border-gray-300 rounded-sm shadow-sm focus:ring-orange-500 focus:border-orange-500" />
                        <p className="text-xs text-gray-500 mt-2">Min. jumlah pembelian adalah min. jumlah yang harus dipesan Pembeli untuk membeli produk atau variasi.</p>
                    </div>
                    <div>
                        <SectionTitle title="Maks. Jumlah Pembelian" />
                        <input type="text" value={maxPurchase} onChange={(e) => setMaxPurchase(e.target.value)} placeholder="Tanpa Batas" className="w-full border-gray-300 rounded-sm shadow-sm focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                </div>

            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 sticky bottom-0 bg-gray-50/95 backdrop-blur-sm py-4 border-t border-gray-200 -mx-4 sm:-mx-8 px-4 sm:px-8">
                <button onClick={onCancel} className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-sm text-gray-700 bg-white hover:bg-gray-100 transition-colors">Kembali</button>
                <button className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-sm text-gray-700 bg-white hover:bg-gray-100 transition-colors">Simpan & Arsipkan</button>
                <button onClick={handleSaveClick} className="w-full sm:w-auto px-6 py-2 bg-orange-500 border border-transparent text-white rounded-sm hover:bg-orange-600 transition-colors">Simpan & Tampilkan</button>
            </div>
        </div>
    );
};


export default AddProductForm