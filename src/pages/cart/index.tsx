import React, { useState, useMemo } from 'react';
import { Plus, Minus } from 'lucide-react';
import MainLayout from 'pages/layouts/MainLayout';

// --- INTERFACES & TIPE DATA ---
// Menambahkan properti baru untuk tag diskon dan info lainnya
interface Product {
    id: number;
    name: string;
    variant: string;
    imageUrl: string;
    originalPrice: number;
    discountedPrice: number;
    quantity: number;
    selected: boolean;
    codAvailable?: boolean;
    diskonTerpakai?: string;
    gratisOngkir?: string;
    voucherToko?: string;
}

interface Store {
    id: string;
    name: string;
    products: Product[];
    selected: boolean;
}

// --- DATA CONTOH (MOCK DATA) ---
// Menambahkan data baru sesuai gambar
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
                codAvailable: true,
                diskonTerpakai: '20%',
                gratisOngkir: 'Rp10.000',
                voucherToko: 'Rp.20.000',
            },
            {
                id: 2,
                name: 'Rak Bumbu Dapur Multifungsi 2 susun Multifungsi',
                variant: 'Warna Putih Ukuran Sedang',
                imageUrl: '/image/image 13.png',
                originalPrice: 380000,
                discountedPrice: 290000,
                quantity: 1,
                selected: true,
                codAvailable: true,
                diskonTerpakai: '20%',
                gratisOngkir: 'Rp10.000',
                voucherToko: 'Rp.20.000',
            },
        ],
    },
    {
        id: 'toko-cde',
        name: 'Toko CDE',
        selected: true,
        products: [
            {
                id: 3,
                name: 'Rak Bumbu Dapur Multifungsi 2 susun Multifungsi ',
                variant: 'Warna Putih Ukuran Sedang',
                imageUrl: '/image/image 13.png',
                originalPrice: 350000,
                discountedPrice: 290000,
                quantity: 1,
                selected: true,
                codAvailable: true,
                diskonTerpakai: '20%',
                gratisOngkir: 'Rp10.000',
                voucherToko: 'Rp.20.000',
            },
            {
                id: 4,
                name: 'Rak Bumbu Dapur Multifungsi 2 susun Multifungsi',
                variant: 'Warna Putih Ukuran Sedang',
                imageUrl: '/image/image 13.png',
                originalPrice: 350000,
                discountedPrice: 290000,
                quantity: 1,
                selected: true,
                codAvailable: true,
                diskonTerpakai: '20%',
                gratisOngkir: 'Rp10.000',
                voucherToko: 'Rp.20.000',
            },
        ],
    },
];

// Komponen utama halaman keranjang belanja
const ShoppingCartPage: React.FC = () => {
    const [stores, setStores] = useState<Store[]>(initialCartData);

    // --- FUNGSI-FUNGSI LOGIKA (Tidak diubah) ---

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
            }).filter(store => store.products.length > 0);
            return newStores;
        });
    };

    const handleDeleteSelected = () => {
        setStores(prevStores => {
            const newStores = prevStores.map(store => ({
                ...store,
                products: store.products.filter(p => !p.selected)
            })).filter(store => store.products.length > 0);
            // After deleting, uncheck "select all"
            const allStillSelected = newStores.length > 0 && newStores.every(s => s.selected && s.products.every(p => p.selected));
            if (!allStillSelected) {
                handleSelectAll(false);
            }
            return newStores;
        });
    };


    // --- KALKULASI TOTAL ---
    const cartSummary = useMemo(() => {
        let totalItems = 0;
        let totalPrice = 0;
        let totalSavings = 0;
        let selectedProductsCount = 0;

        stores.forEach(store => {
            store.products.forEach(product => {
                if (product.selected) {
                    totalItems += product.quantity;
                    totalPrice += product.discountedPrice * product.quantity;
                    totalSavings += (product.originalPrice - product.discountedPrice) * product.quantity;
                    selectedProductsCount++;
                }
            });
        });

        const allSelected = stores.length > 0 && stores.every(s => s.selected);

        return { totalItems, totalPrice, totalSavings, allSelected, selectedProductsCount };
    }, [stores]);


    // --- RENDER KOMPONEN ---
    return (
        <MainLayout>
            <div className="container mx-auto py-8 lg:w-[1200px] space-y-4">

                <h1 className="text-[#7952B3] text-[25px] font-bold">Keranjang Belanja</h1>

                <div className="space-y-4 mt-8">
                    {stores.map(store => (
                        <div key={store.id} className="bg-white rounded-[5px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)] border border-[#DCDCDC] overflow-hidden">
                            {/* Header Toko */}
                            <div className="p-4 border-b border-gray-200 grid grid-cols-12 gap-4 items-center">
                                <div className='col-span-12 md:col-span-5 flex items-start gap-4'>
                                    <input
                                        type="checkbox"
                                        className="h-[21px] w-[21px] rounded border-gray-300 accent-[#52357B] focus:ring-[#52357B] cursor-pointer"
                                        checked={store.selected}
                                        onChange={(e) => handleStoreSelect(store.id, e.target.checked)}
                                    />
                                    <span className="font-semibold text-gray-800">{store.name}</span>
                                </div>
                                <div className="col-span-6 md:col-span-2 text-center text-[16px] text-right font-semibold text-[#333333]">
                                    Harga Satuan
                                </div>
                                <div className="col-span-6 md:col-span-2 text-center text-[16px] font-semibold text-[#333333]">
                                    Kuantitas
                                </div>
                                <div className="col-span-6 md:col-span-2 text-center text-[16px] font-semibold text-[#333333]">
                                    Total Harga
                                </div>
                                <div className="col-span-6 md:col-span-1 text-center text-[16px] font-semibold text-[#333333]">
                                    Aksi
                                </div>
                            </div>

                            {/* Produk dalam Toko */}
                            <div className="divide-y divide-gray-200">
                                {store.products.map(product => (
                                    <div key={product.id} className="p-4 grid grid-cols-12 gap-4 items-center">
                                        {/* Info Produk */}
                                        <div className="col-span-12 md:col-span-5 flex items-start gap-4">
                                            <input
                                                type="checkbox"
                                                className="h-[21px] w-[21px] rounded border-gray-300 accent-[#52357B] focus:ring-[#52357B] cursor-pointer mt-1"
                                                checked={product.selected}
                                                onChange={(e) => handleProductSelect(store.id, product.id, e.target.checked)}
                                            />
                                            <img src={product.imageUrl} alt={product.name} className="w-[100px] h-[100px] object-cover border border-[#AAAAAA]" />
                                            <div className="flex-1 space-y-2">
                                                <p className="text-[#333333] text-[16px] line-clamp-1 w-full" style={{
                                                    lineHeight: "108%",
                                                    letterSpacing: "-0.03em"
                                                }}>{product.name}</p>
                                                <p className="text-[#333333] text-[13px] line-clamp-1 w-full" style={{
                                                    lineHeight: "108%",
                                                    letterSpacing: "-0.04em"
                                                }}>{product.variant}</p>
                                                {/* Tags */}
                                                <span className="text-[#F77000] text-[14px] font-bold" style={{
                                                    letterSpacing: "-0.04em",
                                                    lineHeight: "121%"
                                                }}>COD (Bayar ditempat)</span>
                                                <div className="flex flex-wrap gap-2 mt-2" style={{
                                                    letterSpacing: "-0.04em",
                                                    lineHeight: "121%"
                                                }}>
                                                    <span className="text-[12px] text-white font-semibold bg-[#F74F4F] rounded-[5px] px-2 py-2">Diskon Terpakai {product.diskonTerpakai}</span>
                                                    <span className="text-[12px] text-black font-semibold bg-[#F7C800] rounded-[5px] px-2 py-2">Gratis Ongkir {product.gratisOngkir}</span>
                                                    <span className="text-[12px] text-white font-semibold bg-[#3EA65A] rounded-[5px] px-2 py-2">Voucher Toko {product.voucherToko}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Harga Satuan */}
                                        <div className="col-span-6 md:col-span-2 text-center" style={{
                                            lineHeight: "108%",
                                            letterSpacing: "-0.02em"
                                        }}>
                                            <p className="text-[#333333] font-bold text-right text-[16px]">{formatCurrency(product.discountedPrice)}</p>
                                            <p className="text-[#333333] text-right line-through text-[14px]">{formatCurrency(product.originalPrice)}</p>
                                        </div>

                                        {/* Kuantitas */}
                                        <div className="col-span-6 md:col-span-2 flex items-center justify-center">
                                            <div className="flex items-center border border-[#3EA65A] overflow-hidden">
                                                <button className="h-8 w-8 flex items-center justify-center text-white bg-[#3EA65A] hover:bg-green-700 transition-colors" onClick={() => handleQuantityChange(store.id, product.id, product.quantity - 1)}>
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="px-4 text-center w-12 font-medium bg-white">{product.quantity}</span>
                                                <button className="h-8 w-8 flex items-center justify-center text-white bg-[#3EA65A] hover:bg-green-700 transition-colors" onClick={() => handleQuantityChange(store.id, product.id, product.quantity + 1)}>
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Total Harga Produk */}
                                        <div className="col-span-6 md:col-span-2 text-center" style={{
                                            lineHeight: '108%',
                                            letterSpacing: "-0.02em"
                                        }}>
                                            <span className="text-[#E33947] text-[18px] text-right font-bold">{formatCurrency(product.discountedPrice * product.quantity)}</span>
                                        </div>

                                        {/* Aksi */}
                                        <div className="col-span-6 md:col-span-1 flex justify-center" style={{
                                            lineHeight: '108%',
                                            letterSpacing: "-0.02em"
                                        }}>
                                            <button className="text-[#E33947] text-[14px] font-semibold hover:underline" onClick={() => handleDeleteProduct(store.id, product.id)}>
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
                <div className="sticky bottom-0 mt-6">
                    <div className="bg-white rounded-md shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 self-start md:self-center">
                            <input
                                id="selectAllFooter"
                                type="checkbox"
                                className="h-[21px] w-[21px] rounded border-gray-300 accent-[#52357B] focus:ring-[#52357B] cursor-pointer"
                                checked={cartSummary.allSelected}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                            />
                            <label htmlFor="selectAllFooter" className="cursor-pointer text-[#333333] text-[16px] font-semibold" style={{
                                letterSpacing: "-0.03em",
                                lineHeight: '121%'
                            }}>
                                Pilih Semua ({cartSummary.totalItems} item)
                            </label>
                            <button className="text-[#E33947] text-[16px] font-semibold hover:underline" style={{
                                lineHeight: '108%',
                                letterSpacing: "-0.02em"
                            }} onClick={handleDeleteSelected}>
                                Hapus
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
                            <div className="text-right">
                                <div className="text-[#333333] text-[16px] font-semibold flex items-center gap-2" style={{
                                    letterSpacing: "-0.03em",
                                    lineHeight: '121%'
                                }}>
                                    Total ({cartSummary.selectedProductsCount} Produk): <p className="text-[#E75864] text-[25px] font-bold ml-2" style={{
                                        letterSpacing: "-0.04em",
                                        lineHeight: '108%'
                                    }}>{formatCurrency(cartSummary.totalPrice)}</p>
                                </div>
                                {cartSummary.totalSavings > 0 && (
                                    <p className="text-[16px] text-[#333333] mt-1" style={{
                                        lineHeight: '121%',
                                        letterSpacing: "-0.04em"
                                    }}>Hemat {formatCurrency(cartSummary.totalSavings)}</p>
                                )}
                            </div>
                            <button className="bg-[#563D7C] hover:bg-purple-800 text-white font-semibold w-full md:w-48 py-3 rounded-md transition-colors">
                                Beli ({cartSummary.selectedProductsCount})
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
};

export default ShoppingCartPage;
