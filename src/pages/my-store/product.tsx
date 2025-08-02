import type { NextPage } from 'next';
import { Search, ArrowLeft, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useEffect, useState, useMemo, JSX } from 'react';
import MyStoreLayout from 'pages/layouts/MyStoreLayout';
import { useRouter } from 'next/router';
import { ListboxDropdown } from 'components/ListboxDropdown';


// const DeleteProductModal = ({ isOpen, onClose, onConfirm, productName }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, productName: string }) => {
//     if (!isOpen) return null;
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
//                 <h3 className="text-lg font-bold">Hapus Item</h3>
//                 <p className="my-4">Anda yakin ingin menghapus &ldquo;{productName}&ldquo;?</p>
//                 <div className="flex justify-end gap-4">
//                     <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-[#AAAAAA]">Batal</button>
//                     <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600">Ya, Hapus</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// --- Tipe Data ---
type VarianPrice = { id: number; product_id: number; image: string; price: number | string; stock: number; variant_code?: string; name?: string; sales?: number; };
type Product = { id: number; name: string; sku: string; price: number | string; stock: number; sales: number; image: string; is_cod_enabled?: number; variant_prices?: VarianPrice[]; };

// --- Helper & Data Awal ---
const formatRupiah = (price: number | string): JSX.Element | string => {
    if (typeof price === 'string' && price.includes(' - ')) {
        const [start, end] = price.split(' - ');
        const formattedStart = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(start.replace(/[^0-9]/g, '')));

        const formattedEnd = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(end.replace(/[^0-9]/g, '')));

        return (
            <>
                {formattedStart} -<br />
                {formattedEnd}
            </>
        );
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(Number(price));
};

const initialProducts: Product[] = [
    {
        id: 1,
        name: 'Rak Bumbu Dapur Multifungsi 2 susun', sku: 'RBD-001', sales: 20, price: '301000 - 400000', stock: 52, image: '/image/image 13.png', is_cod_enabled: 1,
        variant_prices: [
            {
                id: 101, product_id: 1,
                name: 'Hijau', variant_code: 'HJ', price: 301000, stock: 12, sales: 5, image: '/image/image 13.png'
            },
            {
                id: 102, product_id: 1,
                name: 'Tosca', variant_code: 'TS', price: 400000, stock: 32, sales: 10, image: '/image/image 13.png'
            },
            {
                id: 103, product_id: 1,
                name: 'Kuning', variant_code: 'KN', price: 200000, stock: 8, sales: 5,
                image: '/image/image 13.png',
            },
        ],
    },
    {
        id: 2,
        name: 'Panci Listrik Serbaguna', sku: 'PNC-002', sales: 55, price: 150000, stock: 120,
        image: '/image/image 13.png',
        is_cod_enabled: 1, variant_prices: []
    },
    {
        id: 3,
        name: 'Blender Kapsul Portable', sku: 'BLN-003', sales: 120, price: 99000, stock: 80,
        image: '/image/image 13.png',
        is_cod_enabled: 1, variant_prices: []
    },
    {
        id: 4,
        name: 'Set Spatula Silikon Tahan Panas', sku: 'SPT-004', sales: 75, price: '80000 - 120000', stock: 95,
        image: '/image/image 13.png',
        is_cod_enabled: 1, variant_prices: [
            {
                id: 401, product_id: 4,
                name: 'Merah', variant_code: 'MR', price: 80000, stock: 45, sales: 30,
                image: '/image/image 13.png',
            },
            {
                id: 402, product_id: 4,
                name: 'Hitam', variant_code: 'HT', price: 120000, stock: 50, sales: 45,
                image: '/image/image 13.png',
            },
        ]
    },
    {
        id: 5,
        name: 'Timbangan Dapur Digital', sku: 'TMB-005', sales: 210, price: 55000, stock: 150,
        image: '/image/image 13.png',
        is_cod_enabled: 1, variant_prices: []
    },
    {
        id: 6,
        name: 'Botol Minum Motivasi 2 Liter', sku: 'BTL-006', sales: 300, price: 45000, stock: 250,
        image: '/image/image 13.png',
        is_cod_enabled: 1, variant_prices: []
    },
    {
        id: 7,
        name: 'Lampu Meja Belajar LED', sku: 'LMP-007', sales: 90, price: 75000, stock: 60,
        image: '/image/image 13.png',
        is_cod_enabled: 1, variant_prices: []
    },
    {
        id: 8,
        name: 'Gantungan Baju Dinding', sku: 'GNT-008', sales: 150, price: 25000, stock: 300,
        image: '/image/image 13.png',
        is_cod_enabled: 1, variant_prices: []
    },
    {
        id: 9,
        name: 'Sprei Set Katun Jepang', sku: 'SPR-009', sales: 40, price: 250000, stock: 50,
        image: '/image/image 13.png',
        is_cod_enabled: 1, variant_prices: []
    },
    {
        id: 10,
        name: 'Bantal Leher Travel', sku: 'BNT-010', sales: 180, price: 35000, stock: 110,
        image: '/image/image 13.png',
        is_cod_enabled: 1, variant_prices: []
    },
    {
        id: 11,
        name: 'Tas Ransel Laptop Anti Air', sku: 'TAS-011', sales: 65, price: 180000, stock: 70,
        image: '/image/image 13.png',
        is_cod_enabled: 1, variant_prices: []
    },
    {
        id: 12,
        name: 'Mouse Wireless Silent Click', sku: 'MOU-012', sales: 250, price: 85000, stock: 130,
        image: '/image/image 13.png',
        is_cod_enabled: 1, variant_prices: []
    },
];


const kategoriList = ['Semua Kategori', 'Elektronik', 'Pakaian', 'Makanan'];
const urutanList = ['Terbaru', 'Terlama', 'Harga Terendah', 'Harga Tertinggi'];

const PageContent: NextPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    // const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    // const [itemToDelete, setItemToDelete] = useState<{ type: 'product' | 'variant'; data: Product | VarianPrice } | null>(null);

    const [kategori, setKategori] = useState(kategoriList[0]);
    const [urutan, setUrutan] = useState(urutanList[0]);

    const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState('Semua');
    const ITEMS_PER_PAGE = 2;
    const router = useRouter();
    useEffect(() => {
        setTimeout(() => {
            setProducts(initialProducts);
            setLoading(false);
        }, 500);
    }, []);


    // const handleOpenDeleteModal = (type: 'product' | 'variant', data: Product | VarianPrice) => {
    //     setItemToDelete({ type, data });
    //     setDeleteModalOpen(true);
    // };

    // const handleCloseDeleteModal = () => {
    //     setDeleteModalOpen(false);
    //     setItemToDelete(null);
    // };

    // const handleDelete = () => {
    //     if (!itemToDelete) return;
    //     const { type, data } = itemToDelete;
    //     let newProducts = [...products];
    //     if (type === 'product') {
    //         newProducts = products.filter(p => p.id !== data.id);
    //     } else if (type === 'variant') {
    //         const variant = data as VarianPrice;
    //         newProducts = products.map(p => {
    //             if (p.id === variant.product_id) {
    //                 const updatedVariants = p.variant_prices?.filter(v => v.id !== variant.id);
    //                 return { ...p, variant_prices: updatedVariants };
    //             }
    //             return p;
    //         });
    //     }
    //     setProducts(newProducts);
    //     handleCloseDeleteModal();
    // };

    const toggleVariations = (productId: number) => {
        setExpandedProductId(prevId => (prevId === productId ? null : productId));
    };

    const filteredProducts = useMemo(() => {
        if (!searchQuery) return products;
        const lowercasedQuery = searchQuery.toLowerCase();
        return products.filter(product =>
            product.name.toLowerCase().includes(lowercasedQuery) ||
            product.sku.toLowerCase().includes(lowercasedQuery)
        );
    }, [products, searchQuery]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredProducts, currentPage]);

    const handleReset = () => {
        setSearchQuery('');
        setCurrentPage(1);
    }

    const getPaginationItems = () => {
        const items = [];
        const maxPagesToShow = 5;
        const half = Math.floor(maxPagesToShow / 2);

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(i);
            }
        } else {
            if (currentPage <= half + 1) {
                for (let i = 1; i <= maxPagesToShow - 1; i++) {
                    items.push(i);
                }
                items.push('...');
                items.push(totalPages);
            } else if (currentPage >= totalPages - half) {
                items.push(1);
                items.push('...');
                for (let i = totalPages - (maxPagesToShow - 2); i <= totalPages; i++) {
                    items.push(i);
                }
            } else {
                items.push(1);
                items.push('...');
                for (let i = currentPage - half + 1; i <= currentPage + half - 1; i++) {
                    items.push(i);
                }
                items.push('...');
                items.push(totalPages);
            }
        }
        return items;
    };


    const mainTabs = [{ name: 'Semua' }, { name: 'Tayang', count: 100 }, { name: 'Perlu Tindakan', count: 10 }, { name: 'Sedang Ditinjau', count: 15 }, { name: 'Belum Ditampilkan', count: 2 },];
    const subTabs = [{ name: 'Semua', count: 90 }, { name: 'Perlu Perbaikan Data', count: 10 }, { name: 'Perlu Tambah Stock', count: 2 },];

    return (
        <div className="min-h-screen font-sans text-gray-800">
            <main className="">
                <div className="space-y-2 md:space-y-0 md:flex justify-between items-center mb-6 border border-[#D2D4D8] bg-[#F3F5F7] p-4 rounded-[8px]">
                    <div>
                        <h1 className="text-[28px] text-[#333333] font-[800] tracking-[-0.02em]">Produk Saya</h1>
                        <p className="text-[#444444] mt-4 text-[14px]" style={{
                            lineHeight: "107%"
                        }}>
                            Satu tempat buat semua jualanmu.<br />
                            Atur harga, stok, dan info produk dengan cepat & gampang.
                        </p>
                    </div>
                    <button className="bg-[#563D7C] text-white font-semibold text-[14px] rounded-[5px] px-4 py-2 w-[150px] h-[40px]" onClick={() => router?.push('/my-store/add-product')}>
                        Tambah Produk
                    </button>
                </div>
                <div className="mx-auto">
                    <div className='shadow-[1px_1px_10px_rgba(0,0,0,0.08)] bg-white border border-[#DCDCDC] rounded-[8px] '>
                        <div className="border-b border-[#BBBBBBCC]/80">
                            <nav className="flex overflow-x-auto -mb-px px-6" aria-label="Tabs">
                                {mainTabs.map(tab => (
                                    <a key={tab.name} href="#" onClick={() => setActiveTab(tab.name)}
                                        className={`flex-shrink-0 py-3 px-2 sm:px-4 border-b-3 text-[16px] ${activeTab === tab.name ? 'text-[#BB2C31] border-[#BB2C31] font-bold' : 'text-[#333333] border-transparent hover:text-gray-700'}`}>
                                        {tab.name} {tab.count ? `(${tab.count})` : ''}
                                    </a>
                                ))}
                            </nav>
                        </div>

                        <div className="p-6 px-4">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                                <div className="relative md:col-span-2">
                                    <input
                                        type="text"
                                        placeholder="Masukkan Nama Produk atau SKU"
                                        value={searchQuery}
                                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                        className="w-full border border-[#AAAAAA] rounded-[5px] py-2 pl-4 pr-10 pr-4  outline-none focus:ring-purple-500 focus:border-purple-500 text-sm placeholder:text-[#AAAAAA] text-[14px]"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <Search className="h-[24px] w-[24px] text-[#888888]" strokeWidth={2.5} />
                                    </div>
                                </div>
                                <ListboxDropdown
                                    options={kategoriList}
                                    selected={kategori}
                                    onChange={setKategori}
                                />
                                <ListboxDropdown
                                    options={urutanList}
                                    selected={urutan}
                                    onChange={setUrutan}
                                />
                                <div className="flex gap-2 w-full">
                                    <button className="w-[80px] bg-[#52357B] h-[40px] text-white px-6 py-2 rounded-[5px] hover:bg-[#52357B] text-[14px] font-bold">Cari</button>
                                    <button onClick={handleReset} className="w-[80px] h-[40px] border border-[#AAAAAA] text-[#333333] px-4 py-2 rounded-[5px] hover:bg-gray-50 text-[14px] font-bold">Reset</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <main className="mt-6">
                        <div className="space-y-4 overflow-hidden">
                            <div className='shadow-[1px_1px_10px_rgba(0,0,0,0.08)] bg-white border border-[#DCDCDC] rounded-[8px]'>
                                <div className="border-b border-[#BBBBBBCC]/80">
                                    <nav className="flex overflow-x-auto -mb-px px-4" aria-label="Sub Tabs">
                                        {subTabs.map(tab => (
                                            <a key={tab.name} href="#"
                                                className={`flex-shrink-0 py-3 px-2 sm:px-4 border-b-3 font-bold text-[#333333] text-sm ${activeTab === tab.name ? 'border-[#BB2C31]' : 'border-transparent hover:text-gray-700'}`}>
                                                {tab.name} ({tab.count})
                                            </a>
                                        ))}
                                    </nav>
                                </div>

                                <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50 px-4 py-3 text-[13px] font-bold text-[#333333] uppercase md:py-6">
                                    <div className="col-span-4 text-[#333333] text-[15px] font-bold">Produk</div>
                                    <div className="col-span-1 text-center text-[#333333] text-[15px] font-bold">Penjualan</div>
                                    <div className="col-span-2 text-center -ml-2 text-[#333333] text-[15px] font-bold">Harga</div>
                                    <div className="col-span-1 text-left text-[#333333] ml-2 text-[15px] font-bold">Stock</div>
                                    <div className="col-span-3 text-left ml-3 text-[#333333] text-[15px] font-bold">Promo Produk</div>
                                    <div className="col-span-1 text-center text-[#333333] text-[15px] font-bold">Aksi</div>
                                </div>

                            </div>
                            <div className="space-y-4">
                                {loading && <div className="text-center p-8 text-[#333333]">Memuat produk...</div>}
                                {!loading && paginatedProducts.length === 0 && <div className="text-center p-8 text-[#333333]">Produk tidak ditemukan.</div>}
                                {!loading && paginatedProducts.map((product) => (
                                    <div key={product.id} className="md:p-4 md:p-0 md:grid md:grid-cols-12 md:gap-4 md:px-0 md:py-4 items-start text-sm text-gray-800 shadow-[1px_1px_10px_rgba(0,0,0,0.08)] bg-white border border-[#DCDCDC] rounded-[8px] ">
                                        <div className="col-span-12 md:col-span-4 h-full flex flex-col justify-between px-4">
                                            <div className='flex items-start sm:items-start gap-4'>
                                                <img src={product.image} alt={product.name} className="w-[67px] h-[67px] object-cover  flex-shrink-0 border-[#AAAAAA]" />
                                                <div className="flex-grow">
                                                    <p className="font-bold text-[#333333] text-[15px]" style={{
                                                        lineHeight: "108%"
                                                    }}>{product.name}</p>
                                                    <p className="text-[13px] text-[#333333] mt-1">SKU Induk: <span className='font-bold text-[16px]'>{product.sku}</span></p>

                                                </div>
                                            </div>
                                            <div className='flex items-end pl-20'>
                                                {product.variant_prices && product.variant_prices.length > 0 && (
                                                    <button onClick={() => toggleVariations(product.id)} className="text-[14px] font-bold text-[#555555] hover:text-gray-800 font-semibold flex items-center gap-1 mt-2">
                                                        {expandedProductId === product.id ? 'Sembunyikan Variasi' : 'Lihat Variasi'}
                                                        {expandedProductId === product.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-span-12 md:hidden mt-4 space-y-2 px-4">
                                            <div className="flex justify-between border-t pt-2"><span className="font-semibold text-[#333333]">Harga</span><span>{formatRupiah(product.price)}</span></div>
                                            <div className="flex justify-between"><span className="font-semibold text-[#333333]">Penjualan</span><span>{product.sales}</span></div>
                                            <div className="flex justify-between"><span className="font-semibold text-[#333333]">Stok</span><span>{product.stock}</span></div>
                                            <div className="flex justify-between items-center border-t pt-2">
                                                <span className="font-semibold text-[#333333]">Aksi</span>
                                                <div className="flex items-center gap-3">
                                                    <button className="text-gray-400 cursor-not-allowed">Ubah</button>
                                                    <button  className="text-red-600 hover:underline">Hapus</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="hidden md:block col-span-1 text-left text-[#333333] text-[14px] px-4">{product.sales}</div>
                                        <div className="hidden md:block col-span-2 flex jusify-center ml-12 space-y-2 px-4">
                                            <p className='text-[#333333] text-[16px]' style={{
                                                lineHeight: "115%"
                                            }}>
                                                {formatRupiah(product.price)}
                                            </p>
                                            <p className='text-[#666666] text-[13   px] line-through' style={{
                                                lineHeight: "115%"
                                            }}>
                                                {formatRupiah(product.price)}
                                            </p>
                                        </div>
                                        <div className="hidden md:block col-span-1 text-left text-[#333333] text-[14px] px-4">{product.stock}</div>
                                        <div className="hidden md:block col-span-3 text-left space-y-2 font-bold text-[12px] px-4">
                                            <div className="text-[#F77000]">COD (Bayar ditempat)</div>
                                            <div>
                                                <span className="bg-[#FAD7D7] border-[#F02929] border text-center text-[#F02929] rounded-[10px] px-2 py-[2px]">Diskon 20%</span>
                                            </div>
                                            <div>
                                                <span className="bg-[#C8F7D4] border-[#388F4F] border text-center text-[#388F4F] rounded-[10px] px-2 py-[2px]">Voucher Rp.20.000</span>
                                            </div>
                                            <div>
                                                <span className="bg-[#FFF9BF] border-[#F77000] border text-center text-[#F77000] rounded-[10px] px-2 py-[2px]">Gratis Ongkir Rp10.000</span>
                                            </div>
                                        </div>
                                        <div className="hidden md:block col-span-1">
                                            <div className="flex flex-col tracking-[-0.02em]">
                                                <button className="text-[#333333] text-[16px] font-semibold cursor-not-allowed text-left">Ubah</button>
                                                <button  className="text-[#333333] text-[16px] font-semibold hover:underline text-left">Hapus</button>
                                            </div>
                                        </div>
                                        {expandedProductId === product.id && (
                                            <>
                                                <div className='col-span-1 border-t border-[#BBBBBBCC]/80' />
                                                <div className="col-span-11 -ml-4 py-4 mt-4 md:mt-0 border-t border-[#BBBBBBCC]/80 ">
                                                    <p className='text-[#333333] font-bold text-[16px]' style={{
                                                        lineHeight: "108%"
                                                    }}>Variasi Produk</p>
                                                    {product.variant_prices?.map((variant) => (
                                                        <div key={variant.id} className="md:grid md:grid-cols-11 md:gap-4 items-start text-sm text-gray-700  first:border-t-0 py-3">
                                                            <div className="col-span-12 md:col-span-3 flex items-start gap-4 ">
                                                                <img src={variant.image} alt={variant.name} className="w-[67px] h-[67px] object-cover rounded-md flex-shrink-0" />
                                                                <div>
                                                                    <p className="font-bold text-[#333333] text-[15px]" style={{
                                                                        lineHeight: "108%"
                                                                    }}>{variant.name}</p><p className="text-[13px] text-[#333333] mt-1">Kode: <span className='text-[16px] font-bold'>{variant.variant_code}</span></p>
                                                                </div>
                                                            </div>
                                                            <div className="md:hidden mt-3 space-y-2 text-[13px]">
                                                                <div className="flex justify-between border-t pt-2"><span className="font-semibold text-[#333333]">Harga</span><span className="font-semibold">{formatRupiah(variant.price)}</span></div>
                                                                <div className="flex justify-between"><span className="font-semibold text-[#333333]">Stok</span><span>{variant.stock}</span></div>
                                                                <div className="flex justify-between border-t pt-2"><span className="font-semibold text-[#333333]">Aksi</span><button  className="text-red-600 hover:underline">Hapus</button></div>
                                                            </div>
                                                            <div className="hidden md:block col-span-1 ml-4 text-left text-[#333333] text-[14px] px-4">{variant.sales || 0}</div>
                                                            <div className="hidden md:block col-span-2 flex jusify-center ml-12 space-y-2 px-6">
                                                                <p className='text-[#333333] text-[16px]' style={{
                                                                    lineHeight: "115%"
                                                                }}>
                                                                    {formatRupiah(variant.price)}
                                                                </p>
                                                                <p className='text-[#666666] text-[13   px] line-through' style={{
                                                                    lineHeight: "115%"
                                                                }}>
                                                                    {formatRupiah(variant.price)}
                                                                </p>
                                                            </div>
                                                            <div className="hidden md:block col-span-1 text-left text-[#333333] text-[14px] px-4">{variant.stock}</div>
                                                            <div className="hidden md:block col-span-3 text-left space-y-2 font-bold text-[12px] px-4">
                                                                <div className="text-[#F77000]">COD (Bayar ditempat)</div>
                                                                <div>
                                                                    <span className="bg-[#FAD7D7] border-[#F02929] border text-center text-[#F02929] rounded-[10px] px-2 py-[2px]">Diskon 20%</span>
                                                                </div>
                                                                <div>
                                                                    <span className="bg-[#C8F7D4] border-[#388F4F] border text-center text-[#388F4F] rounded-[10px] px-2 py-[2px]">Voucher Rp.20.000</span>
                                                                </div>
                                                                <div>
                                                                    <span className="bg-[#FFF9BF] border-[#F77000] border text-center text-[#F77000] rounded-[10px] px-2 py-[2px]">Gratis Ongkir Rp10.000</span>
                                                                </div>
                                                            </div>
                                                            <div className="hidden md:block col-span-1">
                                                                <div className="flex flex-col tracking-[-0.02em]">
                                                                    <button  className="text-[#333333] text-[16px] font-semibold hover:underline text-left">Hapus</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {totalPages > 1 && (
                            <div className="mt-6 flex flex-col items-center gap-4 mb-6">
                                <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600">
                                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="flex items-center gap-1 hover:text-gray-800 transition-colors disabled:text-[#757575] disabled:cursor-not-allowed">
                                        <ArrowLeft size={16} />
                                        <span>Sebelumnya</span>
                                    </button>
                                    <div className="flex items-center gap-1">
                                        {getPaginationItems().map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={() => typeof item === 'number' && setCurrentPage(item)}
                                                disabled={typeof item !== 'number'}
                                                className={`h-8 w-8 rounded-md flex items-center justify-center transition-colors ${currentPage === item
                                                    ? 'bg-gray-800 text-white'
                                                    : typeof item === 'number'
                                                        ? 'hover:bg-gray-200'
                                                        : 'cursor-default'
                                                    }`}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="flex items-center gap-1 hover:text-gray-800 transition-colors disabled:text-[#757575] disabled:cursor-not-allowed">
                                        <span>Berikutnya</span>
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                                <p className="text-[15px] font-bold text-[#555555]">
                                    Menampilkan {paginatedProducts.length} Produk per Halaman
                                </p>
                            </div>
                        )}
                    </main>
                </div>

            </main >
        </div >
    );
};
export default function ProductPage() {
    return (
        <MyStoreLayout>
            <PageContent />
        </MyStoreLayout>
    );
}

