import React, { FC, useEffect, useMemo, useRef, useState } from 'react';

// --- MOCK DATA & SERVICES ---
const mockCategories = [
    {
        id: 1, name: 'Pakaian Wanita', children: [
            { id: 11, name: 'Atasan', children: [{ id: 111, name: 'Kaos' }, { id: 112, name: 'Kemeja' }] },
            { id: 12, name: 'Bawahan', children: [{ id: 121, name: 'Celana Panjang' }, { id: 122, name: 'Rok' }] },
        ]
    },
    {
        id: 2, name: 'Pakaian Pria', children: [
            { id: 21, name: 'Atasan Pria' },
            { id: 22, name: 'Bawahan Pria' },
        ]
    },
    { id: 3, name: 'Kesehatan', children: [] },
    {
        id: 4, name: 'Aksesoris Fashion', children: [
            { id: 41, name: 'Cincin' },
            { id: 42, name: 'Anting' },
            {
                id: 43, name: 'Aksesoris Rambut', children: [
                    { id: 431, name: 'Bando & Bandana' },
                    { id: 432, name: 'Ikat Rambut, Pita & Scrunchie' },
                    { id: 433, name: 'Jepitan & Pin Rambut' },
                    { id: 434, name: 'Rambut Palsu & Extension' },
                    { id: 435, name: 'Hiasan Kepala, Tiara & Mahkota' },
                ]
            },
            { id: 44, name: 'Gelang Tangan & Bangle' },
        ]
    },
    { id: 5, name: 'Elektronik', children: [] },
];

const Get = async <T,>(type: string, endpoint: string): Promise<{ status: string; data: any; } | null> => {
    if (endpoint === 'category/show') {
        await new Promise(resolve => setTimeout(resolve, 500));
        return Promise.resolve({ status: 'success', data: mockCategories });
    }
    return Promise.resolve(null);
};

// --- ICONS ---
const Edit2Icon: FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>;
const Camera: FC<{ size?: number; className?: string, strokeWidth?: number }> = ({ size = 24, className = '', strokeWidth = 2 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>;
const X: FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const Video: FC<{ size?: number; className?: string, strokeWidth?: number }> = ({ size = 24, className = '', strokeWidth = 2 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m22 8-6 4 6 4V8z"></path><rect x="2" y="6" width="14" height="12" rx="2" ry="2"></rect></svg>;
const Trash2: FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const CheckCircle: FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const Lightbulb: FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 3.03 1.54 5.5 4 6.5V20a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4.5c2.46-1 4-3.47 4-6.5a7 7 0 0 0-7-7z"></path></svg>;
const ShoppingBag: FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
const MessageCircleIcon: FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
const ShoppingCartIcon: FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const ChevronLeft: FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="15 18 9 12 15 6"></polyline></svg>;
const ChevronRight: FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"></polyline></svg>;
const Search: FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const Plus: FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const Move: FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>;
const LayersIcon: FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>;
const Calendar: FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;

// --- TYPE DEFINITIONS ---
type Category = { id: number; name: string; children?: Category[] };
type FileWithPreview = { file: File | null; preview: string; id?: string; type: 'image' | 'video' };
type Specification = { name: string; value: string; };
type Variation = { id: number; name: string; options: string[]; };
type ProductVariant = {
    id: number;
    combination: Record<string, string>;
    price: string;
    stock: string;
    sku: string;
    image: FileWithPreview | null;
    dikirimDalam?: string;
    weight?: string;
    length?: string;
    width?: string;
    height?: string;
};
type Product = { id: number; name: string; desc: string; category_id: number; };
type Response<T> = { status: string; data?: T; message?: string; };
type ActiveDropdown = { type: 'name' | 'option'; id: number; optionIndex?: number; };
type MaxPurchaseMode = 'unlimited' | 'per_order' | 'per_period';
type MaxPurchasePerPeriod = { startDate: string; maxQty: string; days: string; recurring: boolean };
type PackageDimensions = { length: string; width: string; height: string };


// --- CONSTANTS ---
const variationNameRecommendations = ['Warna', 'Ukuran', 'Model', 'Bahan'];
const variationOptionRecommendations: { [key: string]: string[] } = {
    'Warna': ['Merah', 'Oranye', 'Kuning', 'Hijau', 'Biru', 'Ungu', 'Merah Muda', 'Hijau Tua', 'Biru Muda', 'Hitam', 'Putih', 'Abu-abu'],
    'Ukuran': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'All Size'],
    'Model': ['Lengan Panjang', 'Lengan Pendek', 'Tanpa Lengan', 'Crop Top'],
    'Bahan': ['Katun', 'Poliester', 'Sutra', 'Denim', 'Kulit']
};

// --- HELPERS ---
const formatRupiah = (value: string | number): string => {
    if (value === null || value === undefined || value === '') return '';
    const stringValue = String(value).replace(/[^0-9]/g, '');
    if (stringValue === '') return '';
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(Number(stringValue));
};

const parseRupiah = (formattedValue: string): string => {
    return formattedValue.replace(/[^0-9]/g, '');
};


// --- UI COMPONENTS ---
const Loading: FC = () => (<div className="fixed inset-0 bg-black/20 z-50 flex justify-center items-center"><div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-3"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div><span className="text-gray-700">Loading...</span></div></div>);
const TipsCard: FC<{ activeField: string | null }> = ({ activeField }) => {
    let title = '';
    let content = null;

    switch (activeField) {
        case 'photo':
            title = 'Tips Foto Produk';
            content = (<ul className="list-disc list-inside space-y-1 text-xs text-gray-600"> <li>Gunakan foto dengan cahaya cukup & background jelas.</li> <li>Rasio 1:1 (persegi).</li> <li>Hindari penambahan teks atau watermark pada foto produk.</li> </ul>);
            break;
        case 'productName':
            title = 'Tips Nama Produk';
            content = (<ul className="list-disc list-inside space-y-1 text-xs text-gray-600"> <li>Masukkan nama yang sesuai dengan produk & mudah dibaca (contoh: merek, model & spesifikasi)</li> <li>Pastikan produk kamu telah sesuai dengan undang-undang serta kebijakan produk yang dilarang.</li> <li>Pastikan produk yang sama tidak diunggah berulang kali.</li> </ul>);
            break;
        default:
            title = 'Tips';
            content = (<p className="text-xs text-gray-500">Arahkan kursor ke input untuk melihat tips yang relevan.</p>);
    }

    return (
        <div className="fixed bg-white p-4 rounded-lg shadow-sm w-[274px] top-[280px]">
            <div className="flex justify-between items-start">
                <h3 className="font-semibold mb-2 text-blue-600">{title}</h3>
                <Lightbulb className="text-yellow-400" size={20} />
            </div>
            {content}
        </div>
    );
};
const CategorySelector: FC<{ onSelectCategory: (name: string) => void; initialCategory: string; categories: Category[]; isLoading: boolean; error: string | null; setIdCategorie: (id: number) => void; handleConfirmCategory: () => void; onClose: () => void }> = ({ onSelectCategory, initialCategory, categories, isLoading, error, setIdCategorie, handleConfirmCategory, onClose }) => {
    const [path, setPath] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const handleSelect = (category: Category, level: number) => { const newPath = [...path.slice(0, level), category]; setPath(newPath); const finalCategoryName = newPath.map(p => p.name).join(' > '); onSelectCategory(finalCategoryName); setIdCategorie(category.id); };
    const getColumns = () => { const columns = [{ items: categories }]; let currentLevelItems = categories; for (const selected of path) { const found = currentLevelItems?.find(item => item.id === selected.id); if (found && found.children && found.children.length > 0) { columns.push({ items: found.children }); currentLevelItems = found.children; } else { break; } } return columns; };
    const columns = getColumns();
    const finalSelection = path.length > 0 && (!path[path.length - 1].children || (path[path.length - 1].children?.length ?? 0) === 0);
    return (<div className="flex flex-col h-[60vh]"><div className="p-4 border-b"><h3 className="text-lg font-semibold text-gray-800">Ubah Kategori</h3><div className="relative mt-2"><input type="text" placeholder="Masukkan min. 1 karakter" className="w-full p-2 pl-8 border rounded-md" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /><Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" /></div></div><div className="flex-grow flex overflow-x-auto border-b">{columns.map((col, level) => (<div key={level} className="w-60 border-r flex-shrink-0">{col.items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (<button key={item.id} onClick={() => handleSelect(item, level)} className={`w-full text-left p-3 text-sm flex justify-between items-center hover:bg-blue-50 ${path[level]?.id === item.id ? 'bg-blue-100 text-blue-600 font-semibold' : ''}`}><span>{item.name}</span>{item.children && item.children.length > 0 && <ChevronRight size={16} />}</button>))}</div>))}</div><div className="p-4 flex justify-between items-center bg-gray-50"><div className="text-sm overflow-hidden whitespace-nowrap text-ellipsis"><span className="text-gray-500">Dipilih: </span><span className="font-semibold text-gray-800">{path.map(p => p.name).join(' > ')}</span></div><div className="flex gap-2 flex-shrink-0"><button onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700">Batal</button><button onClick={handleConfirmCategory} disabled={!finalSelection} className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-blue-300 disabled:cursor-not-allowed">Konfirmasi</button></div></div></div>);
};
const Modal: FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
                {children}
            </div>
        </div>
    );
};


// --- MAIN FORM COMPONENT ---
const AddProductPage: FC<{ onSave: (formData: FormData) => void; onCancel: () => void; productData: Product | null; }> = ({ onSave, onCancel, productData }) => {
    // State
    const [productName, setProductName] = useState('Baju Sasirangan Khas Banjarmasin');
    const [description, setDescription] = useState('Ini adalah deskripsi produk baju sasirangan yang sangat bagus dan berkualitas tinggi, dibuat oleh pengrajin lokal dari Banjarmasin.');
    const [category, setCategory] = useState('');
    const [idCategorie, setIdCategorie] = useState<number | undefined>();
    const [productPhotos, setProductPhotos] = useState<FileWithPreview[]>([]);
    const [productVideo, setProductVideo] = useState<FileWithPreview | null>(null);
    const [activeFormTab, setActiveFormTab] = useState('informasi-produk');
    const [price, setPrice] = useState('150000');
    const [variations, setVariations] = useState<Variation[]>([]);
    const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
    const [specifications, setSpecifications] = useState<{ [key: string]: string }>({
        'Merek': 'Tidak Ada Merek',
        'Jenis Kelamin': 'Pria',
        'Negara Asal': 'Jepang',
        'Produk Custom': 'Ya',
        'Mystery Box': 'Ya',
    });
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [previewMediaIndex, setPreviewMediaIndex] = useState(0);
    const [isVariationActive, setIsVariationActive] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown | null>(null);
    const [newOptionValues, setNewOptionValues] = useState<{ [key: number]: string }>({});
    const [bulkPrice, setBulkPrice] = useState('');
    const [bulkStock, setBulkStock] = useState('');
    const [bulkSku, setBulkSku] = useState('');
    const [isPreOrder, setIsPreOrder] = useState(false);
    const [minPurchase, setMinPurchase] = useState('1');
    const [selectedPreviewOption, setSelectedPreviewOption] = useState<string | null>(null);
    const [maxPurchaseMode, setMaxPurchaseMode] = useState<MaxPurchaseMode>('unlimited');
    const [maxPurchasePerOrder, setMaxPurchasePerOrder] = useState('');
    const [maxPurchasePerPeriod, setMaxPurchasePerPeriod] = useState<MaxPurchasePerPeriod>({
        startDate: '',
        maxQty: '',
        days: '',
        recurring: false,
    });
    const [shippingWeight, setShippingWeight] = useState('');
    const [packageDimensions, setPackageDimensions] = useState<PackageDimensions>({ length: '', width: '', height: '' });
    const [isHazardous, setIsHazardous] = useState(false);
    const [shippingPerVariation, setShippingPerVariation] = useState(false);
    const [isProductPreOrder, setIsProductPreOrder] = useState(false);
    const [shippingInsurance, setShippingInsurance] = useState(false);
    const [condition, setCondition] = useState('Baru');
    const [scheduledDate, setScheduledDate] = useState('');
    const [parentSku, setParentSku] = useState('');


    // Other states...
    const [loading, setLoading] = useState<boolean>(false);
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [tempCategory, setTempCategory] = useState(category);
    const [apiCategories, setApiCategories] = useState<Category[]>([]);
    const [categoryLoading, setCategoryLoading] = useState(true);
    const [editingPhotoIndex, setEditingPhotoIndex] = useState<number | null>(null);
    const [editingVariantImageIndex, setEditingVariantImageIndex] = useState<number | null>(null);
    const [isWeightInvalid, setIsWeightInvalid] = useState(false);

    // Refs
    const productPhotoInputRef = useRef<HTMLInputElement>(null);
    const replacePhotoInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const variationsRef = useRef<HTMLDivElement>(null);
    const variantImageInputRef = useRef<HTMLInputElement>(null);
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);
    const dragVariationId = useRef<number | null>(null);
    const daftarVariasiRef = useRef<HTMLHeadingElement>(null);


    // Effects
    useEffect(() => { async function fetchCategories() { setCategoryLoading(true); try { const res = await Get<Response<Category[]>>('zukses', 'category/show'); if (res?.status === 'success' && Array.isArray(res.data)) { setApiCategories(res.data as Category[]); } } catch (error) { console.error(error); } finally { setCategoryLoading(false); } } fetchCategories(); }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activeDropdown && variationsRef.current && !variationsRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeDropdown]);

    const activeVariations = useMemo(() =>
        variations.filter(v => v.name.trim() !== '' && v.options.some(opt => opt.trim() !== '')),
        [variations]
    );

    useEffect(() => {
        if (activeVariations.length === 0) {
            setProductVariants([]);
            return;
        }

        const getCombinations = (arrays: string[][]): string[][] => {
            if (arrays.length === 0) return [[]];
            const firstArr = arrays[0];
            const rest = getCombinations(arrays.slice(1));
            const result: string[][] = [];
            firstArr.forEach(item => {
                rest.forEach(r => {
                    result.push([item, ...r]);
                });
            });
            return result;
        };

        const variationOptions = activeVariations.map(v => v.options.filter(opt => opt.trim() !== ''));
        const combinations = getCombinations(variationOptions);

        setProductVariants(prevVariants => {
            return combinations.map((combo, index) => {
                const combinationObject: Record<string, string> = {};
                activeVariations.forEach((v, i) => {
                    combinationObject[v.name] = combo[i];
                });

                const comboStr = JSON.stringify(combinationObject);
                const existingVariant = prevVariants.find(p => JSON.stringify(p.combination) === comboStr);

                return {
                    id: existingVariant?.id || Date.now() + index,
                    combination: combinationObject,
                    price: existingVariant?.price || '',
                    stock: existingVariant?.stock || '',
                    sku: existingVariant?.sku || '',
                    image: existingVariant?.image || null,
                    weight: existingVariant?.weight || '',
                    length: existingVariant?.length || '',
                    width: existingVariant?.width || '',
                    height: existingVariant?.height || '',
                };
            });
        });

    }, [variations]);

    const previewMedia = useMemo(() => {
        if (selectedPreviewOption) {
            const firstVarName = activeVariations[0]?.name;
            if (firstVarName) {
                const variant = productVariants.find(p => p.combination[firstVarName] === selectedPreviewOption);
                if (variant?.image) {
                    return [variant.image];
                }
            }
        }
        return (productVideo ? [productVideo] : []).concat(productPhotos);
    }, [selectedPreviewOption, productVariants, productPhotos, productVideo, activeVariations]);

    // Handlers
    const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>, callback: (files: File[]) => void) => { const files = Array.from(e.target.files || []); if (files.length > 0) callback(files); e.target.value = ''; };
    const handleProductPhotosChange = (files: File[]) => { const newPhotos = files.map(file => ({ file, preview: URL.createObjectURL(file), type: 'image' as const })); setProductPhotos(prev => [...prev, ...newPhotos].slice(0, 9)); };
    const triggerProductPhotoReplace = (index: number) => { setEditingPhotoIndex(index); replacePhotoInputRef.current?.click(); };
    const handleProductPhotoReplace = (files: File[]) => { const file = files[0]; if (!file || editingPhotoIndex === null) return; const newPhoto: FileWithPreview = { file, preview: URL.createObjectURL(file), type: 'image' }; setProductPhotos(currentPhotos => currentPhotos.map((photo, index) => { if (index === editingPhotoIndex) { if (photo.file) URL.revokeObjectURL(photo.preview); return newPhoto; } return photo; })); setEditingPhotoIndex(null); };
    const removeProductPhoto = (index: number) => { const photoToRemove = productPhotos[index]; if (photoToRemove.file) URL.revokeObjectURL(photoToRemove.preview); setProductPhotos(productPhotos.filter((_, i) => i !== index)); };
    const handleVideoChange = (files: File[]) => { const file = files[0]; setProductVideo({ file, preview: URL.createObjectURL(file), type: 'video' }); setPreviewMediaIndex(0); };
    const handleRemoveVideo = () => { if (productVideo?.file) { URL.revokeObjectURL(productVideo.preview) }; setProductVideo(null); setPreviewMediaIndex(0); };

    const handleConfirmCategory = () => { setCategory(tempCategory); setCategoryModalOpen(false); };
    const handleSave = (status: 'PUBLISHED' | 'ARCHIVED') => {
        setLoading(true)
        if (!shippingPerVariation && !shippingWeight) {
            setLoading(true)
            setIsWeightInvalid(true);
            return;
        }
        console.log("Saving...");
        setLoading(false)

    };
    const handleSaveAndPublish = () => handleSave('PUBLISHED');
    const handleSaveAndArchive = () => handleSave('ARCHIVED');

    const handleSpecChange = (name: string, value: string) => {
        setSpecifications(prev => ({ ...prev, [name]: value }));
    };

    const nextPreview = () => setPreviewMediaIndex(prev => (prev + 1) % previewMedia.length);
    const prevPreview = () => setPreviewMediaIndex(prev => (prev - 1 + previewMedia.length) % previewMedia.length);

    // --- Variation Handlers ---
    const addVariation = () => {
        setVariations([...variations, { id: Date.now(), name: '', options: [] }]);
    };

    const removeVariation = (id: number) => {
        setVariations(variations.filter(v => v.id !== id));
    };

    const updateVariationName = (id: number, name: string) => {
        setVariations(variations.map(v => v.id === id ? { ...v, name } : v));
    };

    const handleNewOptionChange = (id: number, value: string) => {
        setNewOptionValues(prev => ({ ...prev, [id]: value }));
    };

    const handleAddNewOption = (id: number) => {
        const value = newOptionValues[id];
        if (value && value.trim() !== '') {
            setVariations(variations.map(v => {
                if (v.id === id && !v.options.includes(value)) {
                    return { ...v, options: [...v.options, value] };
                }
                return v;
            }));
            setNewOptionValues(prev => ({ ...prev, [id]: '' }));
        }
    };

    const updateVariationOption = (id: number, optionIndex: number, value: string) => {
        setVariations(variations.map(v => {
            if (v.id === id) {
                const newOptions = [...v.options];
                newOptions[optionIndex] = value;
                return { ...v, options: newOptions };
            }
            return v;
        }));
    };

    const removeVariationOption = (id: number, optionIndex: number) => {
        setVariations(variations.map(v => {
            if (v.id === id) {
                const newOptions = v.options.filter((_, i) => i !== optionIndex);
                return { ...v, options: newOptions };
            }
            return v;
        }));
    };

    // --- Drag and Drop Handlers ---
    const handleDragStart = (variationId: number, position: number) => {
        dragVariationId.current = variationId;
        dragItem.current = position;
    };

    const handleDragEnter = (variationId: number, position: number) => {
        if (variationId === dragVariationId.current) {
            dragOverItem.current = position;
        }
    };

    const handleDrop = (variationId: number) => {
        if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
            dragItem.current = null;
            dragOverItem.current = null;
            dragVariationId.current = null;
            return;
        }

        setVariations(prev => {
            const newVariations = [...prev];
            const variationToUpdate = newVariations.find(v => v.id === variationId);

            if (variationToUpdate) {
                const updatedOptions = [...variationToUpdate.options];
                const dragItemContent = updatedOptions.splice(dragItem.current!, 1)[0];
                updatedOptions.splice(dragOverItem.current!, 0, dragItemContent);
                variationToUpdate.options = updatedOptions;
            }

            dragItem.current = null;
            dragOverItem.current = null;
            dragVariationId.current = null;
            return newVariations;
        });
    };

    const handleApplyToAll = () => {
        setProductVariants(prev => prev.map(variant => ({
            ...variant,
            price: bulkPrice !== '' ? parseRupiah(bulkPrice) : variant.price,
            stock: bulkStock !== '' ? bulkStock : variant.stock,
            sku: bulkSku !== '' ? bulkSku : variant.sku,
        })));
    };

    const handleVariantChange = (variantId: number, field: keyof ProductVariant, value: string) => {
        const processedValue = field === 'price' ? parseRupiah(value) : value;
        setProductVariants(prev => prev.map(v => v.id === variantId ? { ...v, [field]: processedValue } : v));
    };


    const handleVariantImageChange = (files: File[]) => {
        const file = files[0];
        if (!file || editingVariantImageIndex === null) return;

        const variantToUpdate = productVariants[editingVariantImageIndex];

        // Find all other variants that share the same first option and update their image too
        const firstVarName = activeVariations[0]?.name;
        const firstVarOptionValue = variantToUpdate.combination[firstVarName];

        const newImage = {
            file,
            preview: URL.createObjectURL(file),
            type: 'image' as const
        };

        setProductVariants(prev => prev.map(v => {
            if (v.combination[firstVarName] === firstVarOptionValue) {
                if (v.image?.preview) {
                    URL.revokeObjectURL(v.image.preview);
                }
                return { ...v, image: newImage };
            }
            return v;
        }));

        setEditingVariantImageIndex(null);
    };

    const triggerVariantImageUpload = (index: number) => {
        setEditingVariantImageIndex(index);
        variantImageInputRef.current?.click();
    };

    const PriceRangeWarning = () => {
        if (productVariants.length < 2) return null;

        const prices = productVariants.map(v => Number(parseRupiah(v.price))).filter(p => p > 0);
        if (prices.length < 2) return null;

        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        if (maxPrice > minPrice * 7) {
            return (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm mt-4">
                    Batas harga produk termahal dibagi harga produk termurah: 7
                </div>
            );
        }
        return null;
    }

    const handleShippingPerVariationToggle = (checked: boolean) => {
        setShippingPerVariation(checked);
        if (checked) {
            setTimeout(() => {
                daftarVariasiRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    };

    const renderSalesInformation = () => {
        if (!isVariationActive) {
            return (
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2 text-gray-700">Harga</h4>
                        <input
                            type="text"
                            value={formatRupiah(price)}
                            onChange={e => setPrice(parseRupiah(e.target.value))}
                            className="w-full p-2 border rounded-md"
                            placeholder="Rp"
                        />
                    </div>
                    <button
                        onClick={() => setIsVariationActive(true)}
                        className="w-full text-center py-3 border-2 border-dashed border-gray-300 rounded-lg text-blue-600 font-semibold hover:bg-blue-50 transition"
                    >
                        + Aktifkan Varian Produk
                    </button>
                </div>
            )
        }

        const usedVariationNames = variations.map(v => v.name);

        let lastFirstVarOption: string | null = null;

        return (
            <div className="space-y-6" ref={variationsRef}>
                <input type="file" ref={variantImageInputRef} onChange={(e) => handleFileSelection(e, handleVariantImageChange)} accept="image/jpeg,image/png" style={{ display: 'none' }} />
                <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-gray-700">Variasi</h4>
                    <button onClick={() => setIsVariationActive(false)} className="text-sm text-blue-600 hover:underline">Ubah</button>
                </div>

                {variations.map((variation, vIndex) => {
                    const filteredNameRecs = variationNameRecommendations.filter(
                        rec => !usedVariationNames.includes(rec) || rec === variation.name
                    );

                    const availableOptionRecs = (variationOptionRecommendations[variation.name] || []).filter(
                        rec => !variation.options.includes(rec)
                    );

                    return (
                        <div key={variation.id} className="p-4 bg-gray-50 rounded-lg border space-y-4">
                            <div className="flex items-center gap-4">
                                <label className="w-16 text-sm text-gray-600 shrink-0">Variasi {vIndex + 1}</label>
                                <div className="relative flex-grow">
                                    <input
                                        type="text"
                                        placeholder="Ketik atau pilih"
                                        maxLength={14}
                                        value={variation.name}
                                        onChange={(e) => updateVariationName(variation.id, e.target.value)}
                                        onFocus={() => setActiveDropdown({ type: 'name', id: variation.id })}
                                        className="w-full p-2 border rounded-md pr-12"
                                    />
                                    <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-400">{variation.name.length}/14</span>
                                    {activeDropdown?.type === 'name' && activeDropdown?.id === variation.id && (
                                        <div className="absolute top-full left-0 w-full bg-white border rounded-md shadow-lg z-20 mt-1 max-h-48 overflow-y-auto">
                                            <p className="text-xs text-gray-500 p-2 font-semibold">Nilai yang direkomendasikan</p>
                                            {filteredNameRecs.map(rec => (
                                                <button key={rec} type="button" onMouseDown={() => { updateVariationName(variation.id, rec); setActiveDropdown(null); }} className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100">{rec}</button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => removeVariation(variation.id)} className="text-gray-400 hover:text-red-500">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex items-start gap-4">
                                <label className="w-16 text-sm text-gray-600 shrink-0 pt-2">Opsi</label>
                                <div className="flex-grow flex flex-wrap gap-2">
                                    {variation.options.map((option, oIndex) => (
                                        <div
                                            key={oIndex}
                                            className="relative group"
                                            draggable
                                            onDragStart={() => handleDragStart(variation.id, oIndex)}
                                            onDragEnter={() => handleDragEnter(variation.id, oIndex)}
                                            onDragEnd={() => handleDrop(variation.id)}
                                            onDragOver={(e) => e.preventDefault()}
                                        >
                                            <input
                                                type="text"
                                                maxLength={20}
                                                value={option}
                                                onChange={(e) => updateVariationOption(variation.id, oIndex, e.target.value)}
                                                className="p-2 border rounded-md pr-24 w-48"
                                            />
                                            <div className="absolute inset-y-0 right-2 flex items-center text-sm text-gray-400 space-x-1">
                                                <span>{option.length}/20</span>
                                                <button type="button" className="text-gray-400 cursor-grab group-hover:text-gray-700">
                                                    <Move size={16} />
                                                </button>
                                                <button type="button" onClick={() => removeVariationOption(variation.id, oIndex)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Ketik atau pilih"
                                            maxLength={20}
                                            value={newOptionValues[variation.id] || ''}
                                            onChange={(e) => handleNewOptionChange(variation.id, e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddNewOption(variation.id); } }}
                                            onBlur={() => handleAddNewOption(variation.id)}
                                            onFocus={() => setActiveDropdown({ type: 'option', id: variation.id })}
                                            className="p-2 border rounded-md pr-10 w-48"
                                        />
                                        <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-400">
                                            {(newOptionValues[variation.id] || '').length}/20
                                        </span>
                                        {activeDropdown?.type === 'option' && activeDropdown?.id === variation.id && (
                                            <div className="absolute top-full left-0 w-full bg-white border rounded-md shadow-lg z-20 mt-1 max-h-48 overflow-y-auto">
                                                <p className="text-xs text-gray-500 p-2 font-semibold">Nilai yang direkomendasikan</p>
                                                {(availableOptionRecs.length > 0) && (
                                                    availableOptionRecs
                                                        .map(rec => (
                                                            <button key={rec} type="button" onMouseDown={() => { setNewOptionValues(prev => ({ ...prev, [variation.id]: rec })); handleAddNewOption(variation.id); setActiveDropdown(null); }} className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100">{rec}</button>
                                                        ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}

                <button
                    onClick={addVariation}
                    className="w-full text-center py-3 border-2 border-dashed border-gray-300 rounded-lg text-blue-600 font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2"
                >
                    <Plus size={18} /> Tambah Variasi {variations.length + 1}
                </button>

                {variations.length > 0 && (
                    <div className="space-y-4 mt-6">
                        <h4 ref={daftarVariasiRef} className="font-semibold text-gray-700">Daftar Variasi</h4>
                        <div className="flex items-center gap-4">
                            <div className="grid grid-cols-3 border rounded-md flex-grow">
                                <input type="text" placeholder="Harga" value={formatRupiah(bulkPrice)} onChange={e => setBulkPrice(parseRupiah(e.target.value))} className="p-2 border-r" />
                                <input type="text" placeholder="Stok" value={bulkStock} onChange={e => setBulkStock(e.target.value)} className="p-2 border-r" />
                                <input type="text" placeholder="Kode Variasi" value={bulkSku} onChange={e => setBulkSku(e.target.value)} className="p-2" />
                            </div>
                            <button onClick={handleApplyToAll} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shrink-0">Terapkan Ke Semua</button>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="preOrder" checked={isPreOrder} onChange={e => setIsPreOrder(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                            <label htmlFor="preOrder" className="text-sm">Atur Dikirim Dalam untuk variasi</label>
                        </div>
                        {productVariants.length > 0 && (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-max text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                        <tr>
                                            {activeVariations.map(v => <th key={v.id} scope="col" className="px-4 py-3">{v.name}</th>)}
                                            <th scope="col" className="px-4 py-3">*Harga</th>
                                            <th scope="col" className="px-4 py-3">*Stok</th>
                                            {shippingPerVariation && <th scope="col" className="px-4 py-3">*Berat (gr)</th>}
                                            {shippingPerVariation && <th scope="col" className="px-4 py-3">Ukuran Paket (cm)</th>}
                                            <th scope="col" className="px-4 py-3">Kode Variasi</th>
                                            {isPreOrder && <th scope="col" className="px-4 py-3">Dikirim Dalam</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productVariants.map((variant, index) => {
                                            const firstVarName = activeVariations[0]?.name;
                                            const showFirstVarCell = firstVarName && (index === 0 || variant.combination[firstVarName] !== productVariants[index - 1].combination[firstVarName]);

                                            let rowSpan = 1;
                                            if (showFirstVarCell) {
                                                const firstVarValue = variant.combination[firstVarName];
                                                for (let i = index + 1; i < productVariants.length; i++) {
                                                    if (productVariants[i].combination[firstVarName] === firstVarValue) {
                                                        rowSpan++;
                                                    } else {
                                                        break;
                                                    }
                                                }
                                            }

                                            return (
                                                <tr key={variant.id} className="bg-white border-b">
                                                    {activeVariations.map((v, vIndex) => {
                                                        if (vIndex === 0) {
                                                            if (showFirstVarCell) {
                                                                return (
                                                                    <td key={`${variant.id}-${v.id}`} className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap" rowSpan={rowSpan}>
                                                                        <div className="flex flex-col items-start gap-2">
                                                                            <span>{variant.combination[v.name]}</span>
                                                                            <button type="button" onClick={() => triggerVariantImageUpload(index)} className="w-20 h-20 border-2 border-dashed rounded-md flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500">
                                                                                {variant.image ? <img src={variant.image.preview} alt="variant" className="w-full h-full object-cover rounded-md" /> : <Camera size={24} />}
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                )
                                                            }
                                                            return null;
                                                        }
                                                        return (
                                                            <td key={`${variant.id}-${v.id}`} className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                                {variant.combination[v.name]}
                                                            </td>
                                                        )
                                                    })}
                                                    <td className="px-2 py-2">
                                                        <input type="text" value={formatRupiah(variant.price)} onChange={e => handleVariantChange(variant.id, 'price', e.target.value)} className="w-full p-2 border rounded-md" placeholder="Rp" />
                                                    </td>
                                                    <td className="px-2 py-2">
                                                        <input type="text" value={variant.stock} onChange={e => handleVariantChange(variant.id, 'stock', e.target.value)} className="w-24 p-2 border rounded-md" />
                                                    </td>
                                                    {shippingPerVariation && (
                                                        <>
                                                            <td className="px-2 py-2">
                                                                <input type="number" value={variant.weight} onChange={e => handleVariantChange(variant.id, 'weight', e.target.value)} className="w-24 p-2 border rounded-md" placeholder="gr" />
                                                            </td>
                                                            <td className="px-2 py-2">
                                                                <div className="flex gap-1">
                                                                    <input type="number" value={variant.length} onChange={e => handleVariantChange(variant.id, 'length', e.target.value)} className="w-16 p-2 border rounded-md" placeholder="L" />
                                                                    <input type="number" value={variant.width} onChange={e => handleVariantChange(variant.id, 'width', e.target.value)} className="w-16 p-2 border rounded-md" placeholder="P" />
                                                                    <input type="number" value={variant.height} onChange={e => handleVariantChange(variant.id, 'height', e.target.value)} className="w-16 p-2 border rounded-md" placeholder="T" />
                                                                </div>
                                                            </td>
                                                        </>
                                                    )}
                                                    <td className="px-2 py-2">
                                                        <input type="text" value={variant.sku} onChange={e => handleVariantChange(variant.id, 'sku', e.target.value)} className="w-full p-2 border rounded-md" />
                                                    </td>
                                                    {isPreOrder && (
                                                        <td className="px-2 py-2">
                                                            <input type="text" value={variant.dikirimDalam || ''} onChange={e => handleVariantChange(variant.id, 'dikirimDalam', e.target.value)} className="w-full p-2 border rounded-md" />
                                                        </td>
                                                    )}
                                                </tr>
                                            )
                                        }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <PriceRangeWarning />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div>
                                <label htmlFor="min-purchase" className="block text-sm font-medium text-gray-700 mb-1">* Min. Jumlah Pembelian</label>
                                <input id="min-purchase" type="number" value={minPurchase} onChange={e => setMinPurchase(e.target.value)} className="w-full p-2 border rounded-md" />
                                <p className="text-xs text-gray-500 mt-1">Min. jumlah pembelian adalah min. jumlah yang harus dipesan Pembeli untuk membeli produk atau variasi.</p>
                            </div>
                            <div>
                                <label htmlFor="max-purchase" className="block text-sm font-medium text-gray-700 mb-1">Maks. Jumlah Pembelian</label>
                                <select
                                    id="max-purchase"
                                    value={maxPurchaseMode}
                                    onChange={e => setMaxPurchaseMode(e.target.value as MaxPurchaseMode)}
                                    className="w-full p-2 border rounded-md bg-white"
                                >
                                    <option value="unlimited">Tanpa Batas</option>
                                    <option value="per_order">Per Pesanan</option>
                                    <option value="per_period">Per Periode</option>
                                </select>
                            </div>
                        </div>

                        {maxPurchaseMode === 'per_order' && (
                            <div className="p-4 bg-gray-50 rounded-lg border">
                                <label htmlFor="max-purchase-per-order" className="block text-sm font-medium text-gray-700 mb-1">* Jumlah</label>
                                <input id="max-purchase-per-order" type="number" value={maxPurchasePerOrder} onChange={e => setMaxPurchasePerOrder(e.target.value)} className="w-full p-2 border rounded-md" />
                            </div>
                        )}

                        {maxPurchaseMode === 'per_period' && (
                            <div className="p-4 bg-gray-50 rounded-lg border space-y-4">
                                <div className="relative">
                                    <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">* Tanggal Mulai</label>
                                    <input
                                        id="start-date"
                                        type="date"
                                        value={maxPurchasePerPeriod.startDate}
                                        onChange={e => setMaxPurchasePerPeriod(p => ({ ...p, startDate: e.target.value }))}
                                        className="w-full p-2 border rounded-md pr-10"
                                    />
                                    <Calendar size={18} className="absolute right-3 top-9 text-gray-400" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">* Maks. Jumlah Pembelian</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={maxPurchasePerPeriod.maxQty}
                                            onChange={e => setMaxPurchasePerPeriod(p => ({ ...p, maxQty: e.target.value }))}
                                            className="w-full p-2 border rounded-md"
                                        />
                                        <span className="text-sm">produk untuk</span>
                                        <input
                                            type="number"
                                            value={maxPurchasePerPeriod.days}
                                            onChange={e => setMaxPurchasePerPeriod(p => ({ ...p, days: e.target.value }))}
                                            className="w-24 p-2 border rounded-md"
                                        />
                                        <span className="text-sm">hari</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Periode</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center">
                                            <input
                                                id="non-recurring"
                                                name="period-type"
                                                type="radio"
                                                checked={!maxPurchasePerPeriod.recurring}
                                                onChange={() => setMaxPurchasePerPeriod(p => ({ ...p, recurring: false }))}
                                                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                            />
                                            <label htmlFor="non-recurring" className="ml-2 block text-sm text-gray-900">Tidak Berulang</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                id="recurring"
                                                name="period-type"
                                                type="radio"
                                                checked={maxPurchasePerPeriod.recurring}
                                                onChange={() => setMaxPurchasePerPeriod(p => ({ ...p, recurring: true }))}
                                                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                            />
                                            <label htmlFor="recurring" className="ml-2 block text-sm text-gray-900">Berulang</label>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">Batas pembelian akan berlaku mulai - 00:00 dan setiap Pembeli hanya dapat membeli maks. - produk ini setiap - hari. Pengaturan ini akan berulang 1 kali dan maks. batas pembelian akan berakhir pada - 23:59.</p>
                            </div>
                        )}

                        <div className="pt-4">
                            <h4 className="font-semibold text-gray-700">Grosir</h4>
                            <p className="text-sm text-gray-500">Harga grosir hanya tersedia untuk semua variasi yang memiliki harga yang sama.</p>
                        </div>
                    </div>
                )}
            </div>
        )
    };

    const renderShippingInformation = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Berat & Dimensi berbeda untuk tiap variasi</span>
                <label htmlFor="shipping-per-variation-toggle" className="inline-flex relative items-center cursor-pointer">
                    <input type="checkbox" checked={shippingPerVariation} onChange={e => handleShippingPerVariationToggle(e.target.checked)} id="shipping-per-variation-toggle" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
            </div>

            {!shippingPerVariation && (
                <>
                    <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">* Berat</label>
                        <div className="relative">
                            <input
                                id="weight"
                                type="number"
                                value={shippingWeight}
                                onChange={e => {
                                    setShippingWeight(e.target.value);
                                    setIsWeightInvalid(!e.target.value);
                                }}
                                className={`w-full p-2 border rounded-md pr-12 ${isWeightInvalid ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Mohon masukkan"
                            />
                            <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">gr</span>
                        </div>
                        {isWeightInvalid && <p className="text-xs text-red-600 mt-1">Kolom wajib diisi.</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ukuran Paket</label>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="relative">
                                <input type="number" placeholder="L" value={packageDimensions.length} onChange={e => setPackageDimensions(p => ({ ...p, length: e.target.value }))} className="w-full p-2 border rounded-md pr-10" />
                                <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">cm</span>
                            </div>
                            <div className="relative">
                                <input type="number" placeholder="P" value={packageDimensions.width} onChange={e => setPackageDimensions(p => ({ ...p, width: e.target.value }))} className="w-full p-2 border rounded-md pr-10" />
                                <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">cm</span>
                            </div>
                            <div className="relative">
                                <input type="number" placeholder="T" value={packageDimensions.height} onChange={e => setPackageDimensions(p => ({ ...p, height: e.target.value }))} className="w-full p-2 border rounded-md pr-10" />
                                <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">cm</span>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">* Produk Berbahaya</label>
                <div className="flex items-center gap-6">
                    <div className="flex items-center">
                        <input id="hazardous-no" name="hazardous" type="radio" checked={!isHazardous} onChange={() => setIsHazardous(false)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                        <label htmlFor="hazardous-no" className="ml-2 block text-sm text-gray-900">Tidak</label>
                    </div>
                    <div className="flex items-center">
                        <input id="hazardous-yes" name="hazardous" type="radio" checked={isHazardous} onChange={() => setIsHazardous(true)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                        <label htmlFor="hazardous-yes" className="ml-2 block text-sm text-gray-900">Mengandung baterai/magnet/cairan/bahan mudah terbakar</label>
                    </div>
                </div>
            </div>

            <hr />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pre-Order</label>
                <div className="flex items-center gap-6">
                    <div className="flex items-center">
                        <input id="preorder-no" name="preorder" type="radio" checked={!isProductPreOrder} onChange={() => setIsProductPreOrder(false)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                        <label htmlFor="preorder-no" className="ml-2 block text-sm text-gray-900">Tidak</label>
                    </div>
                    <div className="flex items-center">
                        <input id="preorder-yes" name="preorder" type="radio" checked={isProductPreOrder} onChange={() => setIsProductPreOrder(true)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                        <label htmlFor="preorder-yes" className="ml-2 block text-sm text-gray-900">Ya</label>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Kirimkan produk dalam 2 hari (tidak termasuk hari Sabtu, Minggu, libur nasional dan non-operasional jasa kirim).</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Asuransi Pengiriman</label>
                <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                        <h5 className="font-semibold">Enroll Insurance</h5>
                        <p className="text-xs text-gray-600">100% penggantian untuk barang hilang/rusak saat proses pengiriman</p>
                    </div>
                    <label htmlFor="insurance-toggle" className="inline-flex relative items-center cursor-pointer">
                        <input type="checkbox" checked={shippingInsurance} onChange={e => setShippingInsurance(e.target.checked)} id="insurance-toggle" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">Dengan mendaftar, Penjual setuju untuk membayar premi sebesar 0.5% untuk pesanan yang diasuransikan</p>
            </div>
        </div>
    );

    const renderLainnyaInformation = () => (
        <div className="space-y-6">
            <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">Kondisi</label>
                <select id="condition" value={condition} onChange={e => setCondition(e.target.value)} className="w-full p-2 border rounded-md bg-white">
                    <option>Baru</option>
                    <option>Pernah Dipakai</option>
                </select>
            </div>
            <div className="relative">
                <label htmlFor="schedule-date" className="block text-sm font-medium text-gray-700 mb-1">Jadwal Ditampilkan</label>
                <input
                    id="schedule-date"
                    type="date"
                    value={scheduledDate}
                    onChange={e => setScheduledDate(e.target.value)}
                    className="w-full p-2 border rounded-md pr-10"
                />
                <Calendar size={18} className="absolute right-3 top-9 text-gray-400" />
            </div>
            <div>
                <label htmlFor="parent-sku" className="block text-sm font-medium text-gray-700 mb-1">SKU Induk</label>
                <input id="parent-sku" type="text" value={parentSku} onChange={e => setParentSku(e.target.value)} className="w-full p-2 border rounded-md" />
            </div>
        </div>
    );

    const renderSection = (title: string, content: React.ReactNode, onMouseEnter?: () => void, onMouseLeave?: () => void) => (
        <div className="bg-white rounded-lg shadow-sm" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">{title}</h3>
                {content}
            </div>
        </div>
    );
    const renderDisabledSection = (title: string) => (<div className="bg-white rounded-lg shadow-sm"> <div className="p-6"> <h3 className="text-xl font-bold text-gray-400 mb-6">{title}</h3> <p className="text-sm text-gray-400">Tersedia setelah memilih kategori produk</p> </div> </div>);

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <input type="file" ref={productPhotoInputRef} onChange={(e) => handleFileSelection(e, handleProductPhotosChange)} accept="image/jpeg,image/png" multiple style={{ display: 'none' }} />
            <input type="file" ref={replacePhotoInputRef} onChange={(e) => handleFileSelection(e, handleProductPhotoReplace)} accept="image/jpeg,image/png" style={{ display: 'none' }} />
            <input type="file" ref={videoInputRef} onChange={(e) => handleFileSelection(e, handleVideoChange)} accept="video/mp4" style={{ display: 'none' }} />
            <Modal isOpen={isCategoryModalOpen} onClose={() => setCategoryModalOpen(false)}>
                <CategorySelector onSelectCategory={setTempCategory} initialCategory={category} categories={apiCategories} isLoading={categoryLoading} error={null} setIdCategorie={setIdCategorie} handleConfirmCategory={handleConfirmCategory} onClose={() => setCategoryModalOpen(false)} />
            </Modal>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Sidebar */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="fixed bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="bg-blue-600 p-3">
                                <h3 className="font-semibold text-white">Rekomendasi</h3>
                            </div>
                            <ul className="space-y-3 text-sm text-gray-600 p-4">
                                <li className="flex items-center gap-2"><CheckCircle className={productPhotos.length >= 3 ? "text-green-500" : "text-gray-400"} /> Tambah min. 3 foto produk</li>
                                <li className="flex items-center gap-2"><CheckCircle className={productVideo ? "text-green-500" : "text-gray-400"} /> Tambah video</li>
                                <li className="flex items-center gap-2"><CheckCircle className={productName.length >= 25 ? "text-green-500" : "text-gray-400"} /> Buat nama dengan 25-100 karakter</li>
                                <li className="flex items-center gap-2"><CheckCircle className={description.length >= 100 && productPhotos.length > 0 ? "text-green-500" : "text-gray-400"} /> Buat deskripsi min. 100 karakter</li>
                                <li className="flex items-center gap-2"><CheckCircle className={Object.values(specifications).some(v => v) ? "text-green-500" : "text-gray-400"} /> Tambah informasi merek</li>
                            </ul>
                        </div>
                        <TipsCard activeField={focusedField} />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-6 space-y-4 overflow-y-auto">
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="border-b border-gray-200">
                                <nav className="flex space-x-6 px-6">
                                    {['Informasi Produk', 'Spesifikasi', 'Informasi Penjualan', 'Pengiriman', 'Lainnya'].map(tab => (
                                        <button key={tab} onClick={() => setActiveFormTab(tab.toLowerCase().replace(/ /g, '-'))} className={`py-4 px-1 text-sm font-semibold whitespace-nowrap transition-colors duration-150 ${activeFormTab === tab.toLowerCase().replace(/ /g, '-') ? 'border-b-2 border-blue-500 text-blue-600' : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'}`}>
                                            {tab}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                            <div className="p-6 space-y-8">
                                <h3 className="text-xl font-bold text-gray-800">Informasi Produk</h3>
                                {/* Photo Section */}
                                <div
                                    onMouseEnter={() => setFocusedField('photo')}
                                    onMouseLeave={() => setFocusedField(null)}
                                >
                                    <h4 className="font-semibold mb-2 text-gray-700">Foto Produk <span className="text-red-500">*</span></h4>
                                    <div className="flex flex-wrap gap-4 items-center">
                                        {productPhotos.map((photo, index) => (<div key={photo.preview} className="relative w-24 h-24 flex-shrink-0 group"><button type="button" onClick={() => triggerProductPhotoReplace(index)} className="w-full h-full rounded-md border-2 border-transparent hover:border-blue-500 overflow-hidden p-0 bg-gray-100"><img src={photo.preview} alt={`preview ${index}`} className="w-full h-full object-cover" /></button><button onClick={() => removeProductPhoto(index)} className="absolute -top-1.5 -right-1.5 bg-gray-700 text-white rounded-full p-0.5 hover:bg-red-600 z-10 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button></div>))}
                                        {productPhotos.length < 9 && (<button onClick={() => productPhotoInputRef.current?.click()} className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed rounded-md bg-gray-50 text-center hover:bg-gray-100 transition-colors border-gray-300 text-gray-500"><Camera className="h-7 w-7 text-red-500" strokeWidth={1.5} /><span className="text-xs mt-1">Tambahkan Foto ({productPhotos.length}/9)</span></button>)}
                                    </div>
                                </div>

                                {/* Video Section */}
                                <div
                                    onMouseEnter={() => setFocusedField('photo')}
                                    onMouseLeave={() => setFocusedField(null)}
                                >
                                    <h4 className="font-semibold mb-2 text-gray-700">Video Produk</h4>
                                    <div className="flex items-start gap-4">{productVideo ? (<div className="relative w-48 h-27 group"><video src={productVideo.preview} className="w-full h-full object-cover rounded-md border" controls /><button onClick={handleRemoveVideo} className="absolute -top-1.5 -right-1.5 bg-gray-700 text-white rounded-full p-0.5 hover:bg-red-600 z-10 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button></div>) : (<button onClick={() => videoInputRef.current?.click()} className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed rounded-md bg-gray-50 text-center hover:bg-gray-100 transition-colors border-gray-300 text-gray-500"><Video className="h-7 w-7" strokeWidth={1.5} /><span className="text-xs mt-1">Tambah Video</span></button>)}</div>
                                </div>

                                <hr />

                                {/* Product Info */}
                                <div onFocus={() => setFocusedField('productName')} onBlur={() => setFocusedField(null)}>
                                    <h4 className="font-semibold mb-2 text-gray-700">Nama Produk <span className="text-red-500">*</span></h4>
                                    <div className="relative flex-grow"><input type="text" value={productName} maxLength={255} onChange={(e) => setProductName(e.target.value)} placeholder="Nama Merek + Tipe Produk (Bahan, Warna, Ukuran, Variasi)" className={`w-full p-2 border rounded-md shadow-sm pr-16 border-gray-300`} /><span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-400">{productName.length}/255</span></div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2 text-gray-700">Kategori <span className="text-red-500">*</span></h4>
                                    <button onClick={() => { setTempCategory(category); setCategoryModalOpen(true); }} className={`w-full flex justify-between items-center text-left p-2 border rounded-md bg-white border-gray-300`}><span className={category ? 'text-gray-800' : 'text-gray-400'}>{category || "Pilih Kategori"}</span><Edit2Icon className="text-gray-400" size={16} /></button>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2 text-gray-700">Deskripsi Produk <span className="text-red-500">*</span></h4>
                                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className="w-full p-2 border rounded-md shadow-sm border-gray-300" placeholder="Jelaskan deskripsi produkmu di sini..."></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Conditional Sections */}
                        {idCategorie ? (
                            <>
                                {renderSection("Spesifikasi",
                                    <div onMouseEnter={() => setFocusedField('specs')} onMouseLeave={() => setFocusedField(null)}>
                                        <p className="text-sm text-gray-500 mb-4">Lengkap: 5 / 5 Lengkapi atribut produkmu agar dapat lebih banyak dilihat oleh Pembeli. <a href="#" className="text-blue-600">Cara mengatur atribut.</a></p>
                                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Merek <span className="text-red-500">*</span></label>
                                                <select value={specifications['Merek']} onChange={e => handleSpecChange('Merek', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                                                    <option>Tidak Ada Merek</option>
                                                    <option>Sasirangan Idola</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                                                <select value={specifications['Jenis Kelamin']} onChange={e => handleSpecChange('Jenis Kelamin', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                                                    <option>Pria</option>
                                                    <option>Wanita</option>
                                                    <option>Unisex</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Negara Asal</label>
                                                <select value={specifications['Negara Asal']} onChange={e => handleSpecChange('Negara Asal', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                                                    <option>Indonesia</option>
                                                    <option>Jepang</option>
                                                    <option>Korea</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Produk Custom</label>
                                                <select value={specifications['Produk Custom']} onChange={e => handleSpecChange('Produk Custom', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                                                    <option>Ya</option>
                                                    <option>Tidak</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Mystery Box</label>
                                                <select value={specifications['Mystery Box']} onChange={e => handleSpecChange('Mystery Box', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                                                    <option>Ya</option>
                                                    <option>Tidak</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {renderSection("Informasi Penjualan", renderSalesInformation())}
                                {renderSection("Pengiriman", renderShippingInformation())}
                                {renderSection("Lainnya", renderLainnyaInformation())}
                            </>
                        ) : (
                            <>
                                {renderDisabledSection("Spesifikasi")}
                                {renderDisabledSection("Informasi Penjualan")}
                                {renderDisabledSection("Pengiriman")}
                                {renderDisabledSection("Lainnya")}
                            </>
                        )}
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 z-20">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex justify-end items-center h-16 gap-3">
                                    <button className="px-6 py-2 border border-gray-300 rounded-md text-gray-800 bg-white hover:bg-gray-100 transition-colors">Kembali</button>
                                    <button className="px-6 py-2 border border-blue-500 rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors" onClick={handleSaveAndArchive}>Simpan & Arsipkan</button>
                                    <button className="px-6 py-2 bg-blue-500 border border-transparent text-white rounded-md hover:bg-blue-600 transition-colors" onClick={handleSaveAndPublish}>Simpan & Tampilkan</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Preview */}
                    <div className="lg:col-span-3">
                        <div className="fixed top-8">
                            <div className="bg-white rounded-lg shadow-sm">
                                <div className="p-4 border-b">
                                    <h3 className="font-semibold">Preview</h3>
                                    <p className="text-sm text-gray-500">Rincian Produk</p>
                                </div>
                                <div className="p-3">
                                    <div className={`relative bg-gray-200 aspect-square rounded-md mb-3 flex h-50 items-center justify-center w-full overflow-hidden transition-all duration-200 ${(focusedField === 'photo') ? 'border-2 border-blue-500 p-0.5' : 'border-2 border-transparent'}`}>
                                        {previewMedia.length > 0 ? (<> <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-full z-10">{previewMediaIndex + 1}/{previewMedia.length}</div> <div className="flex transition-transform duration-500 ease-in-out h-full" style={{ transform: `translateX(-${previewMediaIndex * 100}%)` }}> {previewMedia.map((media, index) => (<div key={index} className="w-full h-full flex-shrink-0"> {media.type === 'video' ? (<video src={media.preview} className="w-full h-full object-cover" controls />) : (<img src={media.preview} alt="Preview" className="w-full h-full object-cover" />)} </div>))} </div> {previewMedia.length > 1 && (<> <button onClick={prevPreview} className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-0.5 hover:bg-black/70 z-10"><ChevronLeft size={18} /></button> <button onClick={nextPreview} className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-0.5 hover:bg-black/70 z-10"><ChevronRight size={18} /></button> </>)} </>) : (<ShoppingBag size={48} className="text-gray-400" />)}
                                    </div>
                                    <p className="font-semibold truncate text-sm">{productName || 'Nama Produk Anda'}</p>
                                    {activeVariations.length > 0 ? (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-600">{productVariants.length} Variasi Tersedia</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {activeVariations[0].options.filter(opt => opt.trim() !== '').map(option => {
                                                    const variant = productVariants.find(p => p.combination[activeVariations[0].name] === option);
                                                    return (
                                                        <button
                                                            key={option}
                                                            onClick={() => setSelectedPreviewOption(selectedPreviewOption === option ? null : option)}
                                                            className={`w-10 h-10 rounded-md border-2 flex items-center justify-center
                                                                ${selectedPreviewOption === option ? 'border-blue-500' : 'border-gray-300'}`
                                                            }
                                                        >
                                                            {variant?.image ? (
                                                                <img src={variant.image.preview} alt={option} className="w-full h-z object-cover rounded-sm" />
                                                            ) : (
                                                                <LayersIcon size={20} className="text-gray-400" />
                                                            )}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center mt-2">
                                            <div className="flex items-center gap-1">
                                                <div className="w-5 h-5 rounded-full bg-gray-300"></div>
                                                <p className="font-semibold text-xs text-gray-600">special-moment.info</p>
                                            </div>
                                            <button className="px-3 py-1 border border-blue-500 text-blue-500 text-xs font-semibold rounded-sm hover:bg-blue-50">Kunjungi</button>
                                        </div>
                                    )}
                                    <hr className="my-3" />
                                    <div
                                        className="relative"
                                        onMouseEnter={() => setFocusedField('specs')}
                                        onMouseLeave={() => setFocusedField(null)}
                                    >
                                        <div className="flex justify-between text-sm text-gray-600 cursor-pointer">
                                            <span>Spesifikasi</span>
                                            <div className="flex items-center gap-1 text-blue-500">
                                                <span>{specifications['Merek']}</span>
                                                <ChevronRight size={16} />
                                            </div>
                                        </div>
                                        {focusedField === 'specs' && (
                                            <div className="absolute top-full right-0 mt-1 w-full bg-white border rounded-lg shadow-lg z-20">
                                                <div className="p-3 border-b text-center"><h4 className="font-semibold text-sm">Spesifikasi</h4></div>
                                                <div className="p-3 space-y-2">
                                                    {Object.entries(specifications).map(([key, value]) => (
                                                        <div key={key} className="flex justify-between text-xs">
                                                            <span className="text-gray-500">{key}</span>
                                                            <span className="text-gray-800 text-right">{value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="p-2 border-t">
                                                    <button onClick={() => setFocusedField(null)} className="w-full py-1.5 bg-blue-500 text-white font-semibold rounded-md text-sm hover:bg-blue-600">OK</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <hr className="my-3" />
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2">Deskripsi</h4>
                                        <p className="text-sm text-gray-600 line-clamp-3">{description || 'Deskripsi produk akan tampil di sini.'}</p>
                                    </div>
                                </div>
                                <div className="p-3 border-t">
                                    <div className="flex gap-2">
                                        <button className="flex-1 py-2 border border-teal-500 text-teal-600 rounded-md text-sm hover:bg-teal-50 flex items-center justify-center gap-1"><MessageCircleIcon size={16} /> Chat</button>
                                        <button className="px-4 py-2 border border-teal-500 text-teal-600 rounded-md hover:bg-teal-50"><ShoppingCartIcon size={18} /></button>
                                        <button className="flex-1 py-2 bg-blue-500 text-white font-semibold rounded-md text-sm hover:bg-blue-600">Beli Sekarang</button>
                                    </div>
                                </div>
                                <p className="text-center text-xs text-gray-400 p-3 pt-0">Hanya untuk referensi saja, tampilan di aplikasi mungkin akan sedikit berbeda.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            {loading && <Loading />}
        </div>
    );
};

export default AddProductPage;
