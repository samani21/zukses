import React, { useState, useMemo } from 'react';
// Impor komponen UI kustom telah dihapus
import { Plus, Minus } from 'lucide-react';
import MainLayout from 'pages/layouts/MainLayout';

// --- INTERFACES & TIPE DATA ---
interface Product {
    id: number;
    name: string;
    variant: string;
    imageUrl: string;
    originalPrice: number;
    discountedPrice: number;
    quantity: number;
    selected: boolean;
}

interface Store {
    id: string;
    name: string;
    products: Product[];
    selected: boolean;
}

// --- DATA CONTOH (MOCK DATA) ---
const initialCartData: Store[] = [
    {
        id: 'toko-abc',
        name: 'Toko ABC',
        selected: true,
        products: [
            {
                id: 1,
                name: 'Rak Bumbu Dapur Multifungsi 2 susun Multifungsi',
                variant: 'Warna Putih Ukuran Sedang',
                imageUrl: '/image/image 13.png',
                originalPrice: 350000,
                discountedPrice: 290000,
                quantity: 1,
                selected: true,
            },
        ],
    },
    {
        id: 'toko-cde',
        name: 'Toko CDE',
        selected: true,
        products: [
            {
                id: 2,
                name: 'Rak Bumbu Dapur Multifungsi 2 susun Multifungsi',
                variant: 'Warna Putih Ukuran Sedang',
                imageUrl: '/image/image 13.png',
                originalPrice: 350000,
                discountedPrice: 290000,
                quantity: 1,
                selected: true,
            },
            {
                id: 3,
                name: 'Rak Bumbu Dapur Multifungsi 2 susun Multifungsi',
                variant: 'Warna Putih Ukuran Sedang',
                imageUrl: '/image/image 13.png',
                originalPrice: 350000,
                discountedPrice: 280000,
                quantity: 2,
                selected: true,
            },
        ],
    },
];

const ShoppingCartPage: React.FC = () => {
    const [stores, setStores] = useState<Store[]>(initialCartData);

    // --- FUNGSI-FUNGSI LOGIKA ---

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleQuantityChange = (storeId: string, productId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        setStores(prevStores =>
            prevStores.map(store =>
                store.id === storeId
                    ? {
                        ...store,
                        products: store.products.map(p =>
                            p.id === productId ? { ...p, quantity: newQuantity } : p
                        ),
                    }
                    : store
            )
        );
    };

    const handleProductSelect = (storeId: string, productId: number, isSelected: boolean) => {
        setStores(prevStores => {
            const newStores = prevStores.map(store => {
                if (store.id === storeId) {
                    const newProducts = store.products.map(p =>
                        p.id === productId ? { ...p, selected: isSelected } : p
                    );
                    const allProductsSelected = newProducts.every(p => p.selected);
                    return { ...store, products: newProducts, selected: allProductsSelected };
                }
                return store;
            });
            return newStores;
        });
    };

    const handleStoreSelect = (storeId: string, isSelected: boolean) => {
        setStores(prevStores =>
            prevStores.map(store =>
                store.id === storeId
                    ? {
                        ...store,
                        selected: isSelected,
                        products: store.products.map(p => ({ ...p, selected: isSelected })),
                    }
                    : store
            )
        );
    };

    const handleSelectAll = (isSelected: boolean) => {
        setStores(prevStores =>
            prevStores.map(store => ({
                ...store,
                selected: isSelected,
                products: store.products.map(p => ({ ...p, selected: isSelected }))
            }))
        );
    };

    const handleDeleteProduct = (storeId: string, productId: number) => {
        setStores(prevStores => {
            const newStores = prevStores.map(store => {
                if (store.id === storeId) {
                    return {
                        ...store,
                        products: store.products.filter(p => p.id !== productId)
                    };
                }
                return store;
            }).filter(store => store.products.length > 0); // Hapus toko jika tidak ada produk lagi
            return newStores;
        });
    };

    const handleDeleteSelected = () => {
        setStores(prevStores => {
            const newStores = prevStores.map(store => ({
                ...store,
                products: store.products.filter(p => !p.selected)
            })).filter(store => store.products.length > 0);
            return newStores;
        });
    };

    // --- KALKULASI TOTAL ---
    const cartSummary = useMemo(() => {
        let totalItems = 0;
        let totalPrice = 0;
        let totalSavings = 0;
        const allSelected = stores.length > 0 && stores.every(s => s.selected);

        stores.forEach(store => {
            store.products.forEach(product => {
                if (product.selected) {
                    totalItems += product.quantity;
                    totalPrice += product.discountedPrice * product.quantity;
                    totalSavings += (product.originalPrice - product.discountedPrice) * product.quantity;
                }
            });
        });

        return { totalItems, totalPrice, totalSavings, allSelected };
    }, [stores]);


    // --- RENDER KOMPONEN ---
    return (
        <MainLayout>
            <div className="min-h-screen px-2 mb-24 md:mb-0 md:px-40">
                <div className="container mx-auto mt-4">
                    <div className='rounded-[5px] shadow-[1px_1px_10px_rgba(0,0,0,0.1)] border border-[#DCDCDC] mb-4'>
                        <p className='text-[#7952B3] text-[20px] font-bold p-6 border-b border-[#DDDDDD]'>Keranjang Belanjar</p>
                        <div className="hidden md:grid grid-cols-12 gap-4 items-center bg-white p-6 text-[#333333] text-[16px] font-semibold">
                            <div className="col-span-5 flex items-center gap-4">
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 rounded border-gray-300 accent-[#52357B] focus:ring-[#52357B] cursor-pointer"
                                    checked={cartSummary.allSelected}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                />
                                <span>Produk</span>
                            </div>
                            <div className="col-span-2">Harga Satuan</div>
                            <div className="col-span-2">Kuantitas</div>
                            <div className="col-span-2">Total Harga</div>
                            <div className="col-span-1">Aksi</div>
                        </div>
                    </div>

                    {/* Daftar Produk */}
                    <div className="space-y-4">
                        {stores.map(store => (
                            <div key={store.id} className="bg-white rounded-lg shadow-sm overflow-hidden rounded-[5px] shadow-[1px_1px_10px_rgba(0,0,0,0.1)] border border-[#DCDCDC]">
                                {/* Header Toko */}
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="checkbox"
                                            className="h-5 w-5 rounded border-gray-300 accent-[#52357B] focus:ring-[#52357B] cursor-pointer"
                                            checked={store.selected}
                                            onChange={(e) => handleStoreSelect(store.id, e.target.checked)}
                                        />
                                        <span className="font-semibold text-[#333333] text-[16px]">{store.name}</span>
                                    </div>
                                </div>

                                {/* Produk dalam Toko */}
                                <div className="divide-y divide-gray-200">
                                    {store.products.map(product => (
                                        <div key={product.id} className="p-6 grid grid-cols-12 gap-4 items-center">
                                            {/* Info Produk */}
                                            <div className="col-span-12 md:col-span-5 flex items-start md:items-center gap-4">
                                                <input
                                                    type="checkbox"
                                                    className="h-5 w-5 rounded border-gray-300 accent-[#52357B] focus:ring-[#52357B] cursor-pointer"
                                                    checked={product.selected}
                                                    onChange={(e) => handleProductSelect(store.id, product.id, e.target.checked)}
                                                />
                                                <img src={product.imageUrl} alt={product.name} className="w-[80px] h-[80px] md:w-20 md:h-20 object-cover rounded-md" />
                                                <div className="flex-1">
                                                    <p className="text-[#333333] text-[16px]" style={{
                                                        letterSpacing: "-0.03em",
                                                        lineHeight: "108%"
                                                    }}>{product.name}</p>
                                                    <p className="text-[#333333] text-[13px]" style={{
                                                        letterSpacing: "-0.04em"
                                                    }}>{product.variant}</p>
                                                </div>
                                            </div>

                                            {/* Harga Satuan */}
                                            <div className="col-span-6 md:col-span-2">
                                                <span className="md:hidden text-gray-500 text-sm">Harga: </span>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[#666666] line-through text-[16px]" style={{ lineHeight: "108%" }}>{formatCurrency(product.originalPrice)}</span>
                                                    <span className="text-[#333333] text-[16px]" style={{ lineHeight: "108%" }}>{formatCurrency(product.discountedPrice)}</span>
                                                </div>
                                            </div>

                                            {/* Kuantitas */}
                                            <div className="col-span-6 md:col-span-2 flex items-center justify-end md:justify-start">
                                                <div className="flex items-center border border-[#BBBBBB]">
                                                    <button className="h-8 w-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors border-r border-[#BBBBBB]" onClick={() => handleQuantityChange(store.id, product.id, product.quantity - 1)}>
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <span className="px-4 text-center w-12 font-medium">{product.quantity}</span>
                                                    <button className="h-8 w-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors  border-l border-[#BBBBBB]" onClick={() => handleQuantityChange(store.id, product.id, product.quantity + 1)}>
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Total Harga Produk */}
                                            <div className="col-span-6 md:col-span-2">
                                                <span className="md:hidden text-gray-500 text-sm">Total: </span>
                                                <span className="text-[#E33947] text-[16px]" style={{ lineHeight: "108%" }}>{formatCurrency(product.discountedPrice * product.quantity)}</span>
                                            </div>

                                            {/* Aksi */}
                                            <div className="col-span-6 md:col-span-1 flex justify-end">
                                                <button className="text-[#E33947] text-[16px] font-semibold hover:text-red-600 hover:underline transition-colors" onClick={() => handleDeleteProduct(store.id, product.id)} style={{ lineHeight: "108%" }}>
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Checkout */}
                    <div className="sticky bottom-0 mt-8 rounded-[5px] shadow-[1px_1px_10px_rgba(0,0,0,0.1)] p-6 bg-white border border-[#DCDCDC]">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4 self-start md:self-center">
                                <input
                                    id="selectAllFooter"
                                    type="checkbox"
                                    className="h-5 w-5 rounded border-gray-300 accent-[#52357B] focus:ring-[#52357B] cursor-pointer"
                                    checked={cartSummary.allSelected}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                />
                                <label htmlFor="selectAllFooter" className="cursor-pointer text-[#333333] text-[16px] font-semibold" style={{ letterSpacing: "-0.03em" }}>
                                    Pilih Semua {cartSummary.totalItems} item
                                </label>
                                <button className="text-[#E33947] text-[16px] font-semibold hover:text-red-600 hover:underline transition-colors" onClick={handleDeleteSelected} style={{ lineHeight: "108%" }}>
                                    Hapus
                                </button>
                            </div>

                            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
                                <div className="text-right">
                                    <p className="text-[#333333] text-[16px] font-bold mb-2">
                                        Total ({cartSummary.totalItems} Produk) <span className="font-bold text-[25px] text-[#E75864] ml-4" style={{
                                            letterSpacing: "-0.04em",
                                            lineHeight: "108%"
                                        }}>{formatCurrency(cartSummary.totalPrice)}</span>
                                    </p>
                                    {cartSummary.totalSavings > 0 && (
                                        <p className="text-[16px] text-[#333333]" style={{
                                            letterSpacing: "-0.04em"
                                        }}>Hemat {formatCurrency(cartSummary.totalSavings)}</p>
                                    )}
                                </div>
                                <button className="bg-[#563D7C] text-[16px] hover:bg-purple-700 text-white font-bold w-full md:w-48 py-3 rounded-[5px] transition-colors" style={{
                                    letterSpacing: "-0.04em"
                                }}>
                                    Check Out
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
};

export default ShoppingCartPage