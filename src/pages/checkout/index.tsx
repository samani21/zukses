"use client"; // WAJIB: Memastikan komponen ini hanya dirender di sisi klien.

import { MapPin, ChevronDown, Minus, Plus, X, Check, DownloadIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import MainLayout from 'pages/layouts/MainLayout';
import type { FC, ReactNode, RefObject } from 'react';
import { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import Get from 'services/api/Get';

/**
 * Generic Response Interface untuk semua balasan API.
 * Menggunakan <T> agar tipe data bisa dinamis.
 */
interface Response<T> {
    status: 'success' | 'error';
    message: string;
    data: T | null; // Data bisa null jika terjadi error
}
// Frontend-facing interfaces
interface Address {
    id: string;
    name: string;
    phone: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
    isPrimary: boolean;
}

interface Product {
    id: number;
    seller_id: number;
    category_id: number;
    name: string;
    desc: string;
    image: string;
    originalPrice: number;
    discountedPrice: number;
    quantity: number;
    stock: number;
    is_cod_enabled: 0 | 1;
    voucher?: number;
    subsidy?: number;
    variant: {
        id: number;
        product_id: number;
        variant_code: string;
        price: number;
        discount_percent: number | null;
        discount_price: number | null;
        stock: number;
        image: string;
    };
    height: string;
    insurance: 0 | 1;
    is_cost_by_seller: 0 | 1;
    is_dangerous_product: 0 | 1;
    is_pre_order: 0 | 1;
    is_used: 0 | 1;
    length: string;
    max_purchase: number;
    min_purchase: number;
    preorder_duration: number | null;
    scheduled_date: string | null;
    service_ids: string;
    shop_id: number;
    shop_name: string;
    sku: string;
    weight: string;
    width: string;
    vouchers?: string[];
}

type ShippingRange = 'Reguler' | 'Next Day' | 'Same Day' | 'Instant';


interface ShippingOption {
    id: string;
    courierName: string;
    serviceName: string;
    price: number;
    range: ShippingRange;
    logoUrl: string;
}

interface Store {
    id: string;
    name: string;
    products: Product[];
    shippingOptions: ShippingOption[];
    selectedShipping: ShippingOption;
}

interface PaymentOption {
    name: string;
    logoUrl: string;
}

interface OrderDetails {
    totalAmount: number;
    paymentMethod: PaymentOption | null;
    virtualAccount: string;
    imagePayment: string
}

type PaymentMethod = 'COD' | 'Transfer Bank' | 'QRIS' | 'E-Wallet';

// Backend-specific interfaces for type-safe data fetching
interface BackendVariant {
    id: number;
    product_id: number;
    variant_code: string;
    price: number;
    discount_percent: number | null;
    discount_price: number | null;
    stock: number;
    image: string;
}

interface BackendProduct {
    id: number;
    seller_id: number;
    category_id: number;
    name: string;
    desc: string;
    image: string;
    price: number;
    discount_price: number | null;
    discount_percent: number | null;
    quantity: number;
    stock: number;
    is_cod_enabled: 0 | 1;
    voucher?: number;
    subsidy?: number;
    variant?: BackendVariant;
    is_cost_by_seller: 0 | 1;
    height: string;
    insurance: 0 | 1;
    is_dangerous_product: 0 | 1;
    is_pre_order: 0 | 1;
    is_used: 0 | 1;
    length: string;
    max_purchase: number;
    min_purchase: number;
    preorder_duration: number | null;
    scheduled_date: string | null;
    service_ids: string;
    shop_id: number;
    shop_name: string;
    sku: string;
    weight: string;
    width: string;
}

interface BackendShippingService {
    id: number;
    name: string;
}

interface BackendCourierOption {
    courier: string;
    cost: number;
    logo_url: string;
    services: BackendShippingService[];
}

interface BackendSelectedShipping {
    id: number;
    courier: string;
    service: string;
    cost: number;
    logo_url: string;
}

interface BackendStore {
    id: string;
    name: string;
    products: BackendProduct[];
    shippingOptions: BackendCourierOption[];
    selectedShipping?: BackendSelectedShipping;
}

// --- HELPER FUNCTIONS ---
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount).replace(/\s/g, '');
};

const getShippingRange = (serviceName: string): ShippingRange => {
    const lowerCaseService = serviceName?.toLowerCase();
    if (lowerCaseService?.includes('next day') || lowerCaseService?.includes('yes')) return 'Next Day';
    if (lowerCaseService?.includes('same day')) return 'Same Day';
    if (lowerCaseService?.includes('instant')) return 'Instant';
    return 'Reguler'; // Default to Reguler
};

// --- MOCK DATA & ASSETS ---
// Note: static assets like images must be in the `public` folder for Next.js build.
// E.g., '/image/gosend 5.png' should resolve to `public/image/gosend 5.png`
const allUserAddresses: Address[] = [
    {
        id: 'addr1',
        name: "Andi Gustisari",
        phone: "(+62) 812 1234 1600",
        street: "Jl. rajawali 1 lorong 10 ( samping masjid Nurul Ilham lette belok kiri mentok)",
        city: "MARISO",
        province: "KOTA MAKASSAR, SULAWESI SELATAN",
        postalCode: "90123",
        isPrimary: true,
    },
    {
        id: 'addr2',
        name: "Andi Astutisari",
        phone: "(+62) 812 2345 2121",
        street: "Jalan bajiminasa 2 dalam No.71 (belakang masjid Nurul iman Tamarunang)",
        city: "MARISO",
        province: "KOTA MAKASSAR, SULAWESI SELATAN",
        postalCode: "90126",
        isPrimary: false,
    },
    {
        id: 'addr3',
        name: "Sulastri",
        phone: "(+62) 812 2222 2344",
        street: "Bumi Harapan, Jalan Jend Sudirman, Bumi Harapan, Bacukiki Barat (Belakang BOR PDAM)",
        city: "BACUKIKI BARAT",
        province: "KOTA PAREPARE, SULAWESI SELATAN",
        postalCode: "91123",
        isPrimary: false,
    }
];

const COURIER_LOGOS: { [key: string]: string } = {
    'SiCepat': 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhnQ_u7_qEjguu0ZqqKrXJKRfi4PHRc5fLw0aCXnYwf-yygcnoXw0yDcIo8A-J_wwQyFH1cSZX9TnLcqOKsjCnKiKmBxkoXvznGOYsY-y6qvVHQSgKKA2qSGraF6x1xRFlP12sqb3ZvUDXUNmV1rSZvePdhXUp98t_uBBBogyC8efTM-KIX-zqNtgdO/s320/GKL5_SiCepat%20Express%20-%20Koleksilogo.com.jpg',
    'JNE': 'https://upload.wikimedia.org/wikipedia/commons/9/92/New_Logo_JNE.png',
    'J&T': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/J%26T_Express_logo.svg/972px-J%26T_Express_logo.svg.png',
    'POS': 'https://www.posindonesia.co.id/_next/image?url=https%3A%2F%2Fadmin-piol.posindonesia.co.id%2Fmedia%2Fpages-pos-reguler.png&w=1920&q=75',
    'Instant': 'https://example.com/logo/instant.png',
    'Anteraja': '/image/gosend_5.png' // Pastikan file ada di public/image/gosend_5.png
};


// --- COMPONENTS ---
// No significant changes needed in sub-components, they will work with the dynamic data structure.
// The code for sub-components (AddressModal, CheckoutAddressCard, ProductItemRow, etc.) remains the same.
// For brevity, I'll omit the unchanged component code. Assume they are here.
// ... (Paste all your unchanged components here: AddressModal, useOutsideClick, CheckoutAddressCard, QuantityStepper, ProductItemRow, CustomCourierSelect, StoreCheckoutCard, PaymentAndSummaryCard, PaymentConfirmationPage)
// START OF UNCHANGED COMPONENTS
interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (selectedAddress: Address) => void;
    addresses: Address[];
    currentAddressId: string;
}

const AddressModal: FC<AddressModalProps> = ({ isOpen, onClose, onApply, addresses, currentAddressId }) => {
    const [selectedId, setSelectedId] = useState(currentAddressId);

    if (!isOpen) return null;

    const handleApplyClick = () => {
        const newAddress = addresses.find(addr => addr.id === selectedId);
        if (newAddress) {
            onApply(newAddress);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white shadow-xl w-full max-w-2xl">
                <div className="flex justify-between items-center p-6">
                    <h3 className="text-[20px] text-[#333333] font-bold">Ubah Alamat</h3>
                    <button onClick={onClose} className="text-[#555555] hover:text-gray-800"><X size={20} /></button>
                </div>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar">
                    <div className='flex justify-end px-4'>
                        <button className="text-center bg-[#238744] py-3 px-4 text-[14px] font-semibold text-white font-bold rounded-[10px] hover:bg-green-500 transition">
                            Tambah Alamat
                        </button>
                    </div>
                    {addresses.map(address => (
                        <div key={address.id} className="border-b border-[#BBBBBB] p-6">
                            <label className="flex items-start cursor-pointer">
                                <input
                                    type="radio"
                                    name="address"
                                    className="mt-1 mr-4 accent-[#660077] w-[20px] h-[20px]"
                                    checked={selectedId === address.id}
                                    onChange={() => setSelectedId(address.id)}
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div className='flex'>
                                            <p className="font-bold text-[#333333] text-[15xpx] line-clamp-1 w-[140px]">{address.name}</p>
                                            <p className=''>{address.phone}</p>
                                        </div>
                                        <a href="#" className="text-[#F77000] w-1/8 font-bold text-[15px] text-end text-sm hover:underline">Ubah</a>
                                    </div>
                                    <p className="text-[#333333] text-[15px] mt-1">{address.street}, {address.city}, {address.province}, ID {address.postalCode}</p>
                                </div>
                            </label>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end items-center p-4 space-x-3">
                    <button onClick={onClose} className="px-6 py-2 text-[#333333] text-[14px] font-semibold rounded-[10px] border border-[#AAAAAA] hover:bg-gray-100">Batalkan</button>
                    <button onClick={handleApplyClick} className="px-6 py-2 bg-[#4A52B2] text-[14px] font-semibold text-white rounded-md hover:bg-purple-700">Terapkan</button>
                </div>
            </div >
        </div >
    );
};

const useOutsideClick = (ref: RefObject<HTMLElement>, callback: () => void) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, callback]);
};

const CheckoutAddressCard: FC<{ address: Address; onOpenModal: () => void; }> = ({ address, onOpenModal }) => (
    <div className="bg-white rounded-[5px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)] p-4 sm:p-6 w-full border border-[#DCDCDC]">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-grow">
                <div className="flex items-center mb-3 gap-2">
                    <MapPin className="w-[24px] h-[24px] text-purple-600 flex-shrink-0" />
                    <h2 className="text-[20px] font-semibold text-[#7952B3]">Alamat Pengiriman</h2>
                </div>
                <div className="pl-2">
                    <div className='flex justify-between items-start'>
                        <div className='flex items-start gap-10'>
                            <p className="font-semibold text-[#333333] text-[16px]">{address.name} {address.phone}</p>
                            <div className='w-1/2'>
                                <p className="text-[#333333] text-[16px]">{address.street}, {address.city}, {address.province}, ID {address.postalCode}</p>
                                {address.isPrimary && <span className="mt-2 inline-block text-[#7952B3] text-[16px] font-bold">Alamat Utama</span>}
                            </div>
                        </div>
                        <button onClick={onOpenModal} className='text-[16px] font-bold text-[#7952B3] hover:underline'>Ubah</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const QuantityStepper: FC<{ quantity: number; onUpdate: (newQuantity: number) => void; }> = ({ quantity, onUpdate }) => (
    <div className="col-span-6 md:col-span-2 flex items-center justify-center">
        <div className="flex items-center border border-[#3EA65A] overflow-hidden">
            <button className="h-8 w-8 flex items-center justify-center text-white bg-[#3EA65A] hover:bg-green-700" onClick={() => quantity > 1 && onUpdate(quantity - 1)}>
                <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 text-center w-12 font-medium bg-white">{quantity}</span>
            <button className="h-8 w-8 flex items-center justify-center text-white bg-[#3EA65A] hover:bg-green-700" onClick={() => onUpdate(quantity + 1)}>
                <Plus className="h-4 w-4" />
            </button>
        </div>
    </div>
);


const ProductItemRow: FC<{ product: Product; onUpdate: (updatedProduct: Product) => void; onRemove: (productId: number) => void; }> = ({ product, onUpdate, onRemove }) => (
    <div className="p-4 grid grid-cols-12 gap-4 items-center">
        {/* Product Info */}
        <div className="col-span-12 md:col-span-5 flex items-start gap-4">
            <img src={product.variant?.image || product.image} alt={product.name} className="w-[100px] h-[100px] object-cover border border-[#AAAAAA]" />
            <div className="flex-1 space-y-2">
                <p className="text-[#333333] text-[16px] line-clamp-1 w-full">{product.name}</p>
                <p className="text-[#333333] text-[13px] line-clamp-1 w-full">{product.variant?.variant_code || 'No Variant'}</p>
                {product.is_cod_enabled === 1 && <span className="text-[#F77000] text-[14px] font-bold">COD (Bayar ditempat)</span>}
                <div className="flex flex-wrap gap-2 mt-2">
                    {product.vouchers?.map((voucher, index) => {
                        const isVoucherToko = voucher?.toLowerCase()?.includes('toko');
                        const isGratisOngkir = voucher?.toLowerCase()?.includes('ongkir');
                        const bgColor = isVoucherToko ? 'bg-[#3EA65A]' : isGratisOngkir ? 'bg-[#F7C800]' : 'bg-[#F74F4F]';
                        const textColor = isVoucherToko ? 'text-white' : isGratisOngkir ? 'text-black' : 'text-white';
                        return (
                            <span key={index} className={`text-[12px] font-semibold px-2 py-1 rounded ${bgColor} ${textColor}`}>
                                {voucher}
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
        {/* Unit Price */}
        <div className="col-span-6 md:col-span-2 text-center">
            <p className="text-[#333333] font-bold text-right text-[16px]">{formatCurrency(product.discountedPrice)}</p>
            {product.originalPrice > product.discountedPrice && (
                <p className="text-[#333333] text-right line-through text-[14px]">{formatCurrency(product.originalPrice)}</p>
            )}
        </div>
        {/* Quantity */}
        <div className="col-span-6 md:col-span-2 flex items-center justify-center">
            <QuantityStepper quantity={product.quantity} onUpdate={(newQuantity) => onUpdate({ ...product, quantity: newQuantity })} />
        </div>
        {/* Total Price */}
        <div className="col-span-6 md:col-span-2 text-center">
            <span className="text-[#E33947] text-[18px] text-right font-bold">{formatCurrency(product.discountedPrice * product.quantity)}</span>
        </div>
        {/* Action */}
        <div className="col-span-6 md:col-span-1 flex justify-center">
            <button className="text-[#E33947] text-[14px] font-semibold hover:underline" onClick={() => onRemove(product.id)}>
                Hapus
            </button>
        </div>
    </div>
);

const CustomCourierSelect: FC<{
    options: ShippingOption[];
    selected: ShippingOption | undefined; // Can be undefined initially
    onSelect: (option: ShippingOption) => void;
    placeholder?: string;
}> = ({ options, selected, onSelect, placeholder = "Pilih Kurir" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useOutsideClick(dropdownRef as RefObject<HTMLElement>, () => setIsOpen(false));

    const handleSelect = (option: ShippingOption) => {
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full h-[50px] flex items-center justify-between bg-white border border-gray-300 rounded-md py-2 px-4 text-left">
                {selected ? (
                    <div className="flex items-center space-x-3">
                        {selected.logoUrl && <img src={selected.logoUrl} alt={selected.courierName} className="h-5 w-auto object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />}
                        <span className="text-sm">{selected.courierName} {selected.serviceName}</span>
                    </div>
                ) : (
                    <span className="text-sm text-gray-500">{placeholder}</span>
                )}
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute z-30 top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {options.length > 0 ? options.map(option => (
                        <div key={option.id} onClick={() => handleSelect(option)} className="flex items-center justify-between p-3 hover:bg-gray-100 cursor-pointer">
                            <div className="flex items-center space-x-3">
                                {option.logoUrl && <img src={option.logoUrl} alt={option.courierName} className="h-6 w-12 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />}
                                <span className="text-sm">{option.courierName} {option.serviceName}</span>
                            </div>
                            <span className="text-sm font-semibold">{formatCurrency(option.price)}</span>
                        </div>
                    )) : (
                        <div className="p-3 text-sm text-gray-500 text-center">Tidak ada opsi tersedia.</div>
                    )}
                </div>
            )}
        </div>
    );
};

const StoreCheckoutCard: FC<{ storeData: Store; onProductUpdate: (productId: number, updatedProduct: Product) => void; onProductRemove: (productId: number) => void; onShippingChange: (storeId: string, newShipping: ShippingOption) => void; }> = ({ storeData, onProductUpdate, onProductRemove, onShippingChange }) => {
    const productSubtotal = storeData.products.reduce((acc, p) => acc + (p.discountedPrice * p.quantity), 0);
    const totalProducts = storeData.products.reduce((acc, p) => acc + p.quantity, 0);
    const [selectedRange, setSelectedRange] = useState<ShippingRange>(storeData.selectedShipping.range);

    const availableRanges = useMemo(() => {
        const ranges = new Set<ShippingRange>();
        storeData.shippingOptions.forEach(opt => ranges.add(opt.range));
        return Array.from(ranges);
    }, [storeData.shippingOptions]);

    const filteredOptions = useMemo(() => {
        return storeData.shippingOptions.filter(opt => opt.range === selectedRange);
    }, [selectedRange, storeData.shippingOptions]);

    useEffect(() => {
        // Ensure selectedShipping is consistent with current selectedRange and available options
        if (storeData.selectedShipping && storeData.selectedShipping.range !== selectedRange) {
            const firstOptionInNewRange = storeData.shippingOptions.find(opt => opt.range === selectedRange);
            if (firstOptionInNewRange) {
                onShippingChange(storeData.id, firstOptionInNewRange);
            }
        }
    }, [selectedRange, storeData.shippingOptions, storeData.selectedShipping, onShippingChange, storeData.id]);


    const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRange = e.target.value as ShippingRange;
        setSelectedRange(newRange);
        const newOptionsForRange = storeData.shippingOptions.filter(opt => opt.range === newRange);
        if (newOptionsForRange.length > 0) {
            onShippingChange(storeData.id, newOptionsForRange[0]);
        }
    };

    return (
        <div className="w-full bg-white relative">
            <div className="p-4 border-b border-gray-200 grid grid-cols-12 gap-4 items-center">
                <div className='col-span-12 md:col-span-5'><span className="font-semibold text-gray-800">{storeData.name}</span></div>
                <div className="col-span-6 md:col-span-2 text-right text-[16px] font-semibold text-[#333333]">Harga Satuan</div>
                <div className="col-span-6 md:col-span-2 text-center text-[16px] font-semibold text-[#333333]">Kuantitas</div>
                <div className="col-span-6 md:col-span-2 text-center text-[16px] font-semibold text-[#333333]">Total Harga</div>
                <div className="col-span-6 md:col-span-1 text-center text-[16px] font-semibold text-[#333333]">Aksi</div>
            </div>
            <div className="divide-y divide-gray-200">
                {storeData.products.map(product => <ProductItemRow key={product.id} product={product} onUpdate={(p) => onProductUpdate(product.id, p)} onRemove={onProductRemove} />)}
            </div>
            <div className="flex justify-end items-center space-x-4 p-4 sm:px-6 border-t border-gray-200">
                <p className="text-[16px] font-bold text-[#333333]">Total ({totalProducts} Produk)</p>
                <p className="font-bold text-[25px] text-[#E75864]">{formatCurrency(productSubtotal)}</p>
            </div>
            <div className='flex flex-col md:flex-row bg-gray-50/70 border-t border-gray-200'>
                <div className="p-4 sm:p-6 w-full md:w-3/4">
                    <div className='font-bold text-[#7952B3] text-[20px]'>Pengiriman</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mt-4">
                        <div className="relative md:col-span-1">
                            <label className="text-[16px] font-bold text-[#333333] mb-2 block">Pilih Pengiriman:</label>
                            <select value={selectedRange} onChange={handleRangeChange} className="w-full h-[50px] appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm">
                                {availableRanges.map(range => <option key={range} value={range}>{range}</option>)}
                            </select>
                            <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-[46px] pointer-events-none" />
                        </div>
                        <div className="relative md:col-span-2">
                            {filteredOptions.length > 0 ? (
                                <CustomCourierSelect
                                    options={filteredOptions}
                                    selected={storeData.selectedShipping}
                                    onSelect={(s) => onShippingChange(storeData.id, s)}
                                />
                            ) : (
                                <p className="text-sm text-gray-500">Tidak ada opsi pengiriman tersedia untuk jenis ini.</p>
                            )}
                        </div>
                    </div>
                    <div className="mt-6">
                        <label htmlFor={`note-${storeData.id}`} className="text-[16px] font-bold text-[#333333] mb-2 block">Tambah Catatan Pesanan</label>
                        <input type="text" id={`note-${storeData.id}`} className="w-full h-[50px] border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Contoh: Packing lebih aman" />
                    </div>
                </div>
                <div className='w-full md:w-1/4 text-right px-8 py-6 self-center text-[22px] font-bold text-[#333333]'>
                    {formatCurrency(storeData.selectedShipping.price)}
                </div>
            </div>
        </div>
    );
};

const PaymentAndSummaryCard: FC<{
    originalProductTotal: number;
    shippingSubtotal: number;
    itemDiscount: number;
    shippingDiscount: number;
    storeVoucherDiscount: number;
    onCreateOrder: (details: OrderDetails) => void;
}> = ({
    originalProductTotal,
    shippingSubtotal,
    itemDiscount,
    shippingDiscount,
    storeVoucherDiscount,
    onCreateOrder
}) => {
        const [activeTab, setActiveTab] = useState<PaymentMethod>('Transfer Bank');
        const [selectedPayment, setSelectedPayment] = useState<PaymentOption | null>(null);

        const paymentTabs: PaymentMethod[] = ['COD', 'Transfer Bank', 'QRIS', 'E-Wallet'];

        const paymentOptions: { [K in PaymentMethod]?: PaymentOption[] } = {
            'Transfer Bank': [
                { name: 'BCA Virtual Account', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/2560px-Bank_Central_Asia.svg.png' },
                { name: 'BRI Virtual Account', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/BRI_2020.svg/1280px-BRI_2020.svg.png' },
                { name: 'BNI Virtual Account', logoUrl: 'https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/1280px-BNI_logo.svg.png' },
            ],
            'QRIS': [{ name: 'QRIS', logoUrl: 'https://xendit.co/wp-content/uploads/2020/03/iconQris.png' }],
            'E-Wallet': [
                { name: 'Gopay', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/2560px-Gopay_logo.svg.png' },
                { name: 'Dana', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/2560px-Logo_dana_blue.svg.png' },
            ]
        };

        const biayaLayanan = 2500;
        const biayaTransfer = 4000;
        const totalDiskon = itemDiscount + shippingDiscount;
        const totalPembayaran = originalProductTotal + shippingSubtotal + biayaLayanan + biayaTransfer - totalDiskon;
        const handleCreateOrder = () => {
            // Placeholder virtual account for now. In a real app, this would come from a payment gateway API call.
            const virtualAccountNumber = selectedPayment?.name?.includes('BCA') ? '1234 4578 1234 5678' :
                selectedPayment?.name?.includes('BRI') ? '9876 5432 1098 7654' :
                    selectedPayment?.name?.includes('BNI') ? '1122 3344 5566 7788' :
                        ''; // Or generate a generic one for other methods
            onCreateOrder({
                totalAmount: totalPembayaran,
                paymentMethod: selectedPayment,
                virtualAccount: virtualAccountNumber,
                imagePayment: "" // This would be populated for QRIS, etc.
            });
        };

        return (
            <div className="bg-white rounded-xl shadow-md w-full">
                <div className="p-4 sm:p-6">
                    <div className='flex gap-4 items-center'>
                        <h3 className="text-[20px] text-[#7952B3] font-bold ">Metode Pembayaran</h3>
                        <div className="flex flex-wrap gap-2 pb-4">
                            {paymentTabs.map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm border transition-colors ${activeTab === tab ? 'bg-[#F77000] pr-[1px] text-[#333333] font-bold border-orange-500' : 'bg-white text-[#222222] text-[14px] font-[500] border-[#BBBBBB] hover:bg-gray-100'}`}>
                                    {activeTab === tab && <Check className="inline w-[14px] h-[14px] mr-2 text-white" />} <span className={`${activeTab === tab ? "bg-white p-2 mr-[1px]" : ''}`}>{tab}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4 sm:ml-48">
                        {activeTab !== 'COD' && (
                            <div className='text-[#333333] space-y-1 ml-3 mb-4'>
                                <p className='font-bold text-base'>{activeTab === 'Transfer Bank' ? 'Virtual Account' : activeTab}</p>
                                {activeTab === 'Transfer Bank' && <p className='text-sm text-gray-500'>Min. transaksi Rp10.000</p>}
                            </div>
                        )}
                        {paymentOptions[activeTab]?.map(option => (
                            <div key={option.name} className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedPayment(option)}>
                                <input type="radio" id={option.name} name="payment" value={option.name} checked={selectedPayment?.name === option.name} onChange={() => setSelectedPayment(option)} className="accent-[#660077] w-5 h-5" />
                                <img src={option.logoUrl} alt={`${option.name} logo`} className="h-8 w-10 mx-4 object-contain" />
                                <label htmlFor={option.name} className="block text-sm font-medium text-gray-700 cursor-pointer">{option.name}</label>
                            </div>
                        ))}
                        {activeTab === 'COD' && (
                            <div className="p-3 text-gray-600">
                                <p>Anda akan membayar pesanan secara tunai kepada kurir saat barang diterima.</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-4 sm:p-6 bg-gray-50 rounded-b-xl border-t border-gray-200">
                    <div className="space-y-1 text-sm text-[16px]">
                        <div className="flex justify-end gap-10"><span className="text-[#333333] text-[16px]">Subtotal Pesanan</span><span className="text-right w-1/7 font-bold">{formatCurrency(originalProductTotal)}</span></div>
                        <div className="flex justify-end gap-10"><span className="text-[#333333] text-[16px]">Subtotal Pengiriman</span><span className="text-right w-1/7">{formatCurrency(shippingSubtotal)}</span></div>
                        <div className="flex justify-end gap-10"><span className="text-[#333333] text-[16px]">Biaya Layanan</span><span className="text-right w-1/7">{formatCurrency(biayaLayanan)}</span></div>
                        <div className="flex justify-end gap-10"><span className="text-[#333333] text-[16px]">Biaya Transfer</span><span className="text-right w-1/7">{formatCurrency(biayaTransfer)}</span></div>

                        {totalDiskon > 0 && (
                            <div className="pt-0 text-[16px]">
                                <div className="flex justify-end gap-10"><span className="text-[#333333] text-[16px] font-bold">Diskon</span><span className="text-right w-1/7"></span></div>
                                {itemDiscount > 0 &&
                                    <div className="flex justify-end gap-10 pl-4"><span className="text-[#333333]">Diskon Barang</span><span className="text-[#E82229] text-right w-1/7">-{formatCurrency(itemDiscount)}</span></div>}
                                {shippingDiscount > 0 &&
                                    <div className="flex justify-end gap-10 pl-4"><span className="text-[#333333]">Diskon Ongkir</span><span className="text-[#E82229] text-right w-1/7">-{formatCurrency(shippingDiscount)}</span></div>}
                                {storeVoucherDiscount > 0 &&
                                    <div className="flex justify-end gap-10 pl-4"><span className="text-[#333333]">Voucher Toko</span><span className="text-[#E82229] text-right w-1/7">-{formatCurrency(storeVoucherDiscount)}</span></div>}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-10 items-center mt-4 pt-4 border-t border-gray-300">
                        <span className="text-[16px]  text-[#333333] text-end">Total Pembayaran</span>
                        <span className="text-[24px] font-bold text-[#E33947] w-1/7 text-end" style={{
                            lineHeight: "108%",
                            letterSpacing: "-0.04em"
                        }}>{formatCurrency(totalPembayaran)}</span>
                    </div>
                    {
                        selectedPayment &&
                        <div className='flex justify-end'>
                            <button onClick={handleCreateOrder} className="w-[297px] bg-[#563D7C] text-white font-semibold text-[18px] py-3 px-4 mt-6 hover:bg-purple-700 transition-colors">Buat Pesanan</button>
                        </div>
                    }
                </div>
            </div>
        );
    };

const PaymentConfirmationPage: FC<{ orderDetails: OrderDetails; onBack: () => void; }> = ({ orderDetails, onBack }) => {
    const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);
    const [copied, setCopied] = useState(false);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    useEffect(() => {
        if (timeLeft === 0) return;
        const timerId = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearInterval(timerId);
    }, [timeLeft]);

    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const handleCopy = () => {
        navigator.clipboard.writeText(orderDetails.virtualAccount.replace(/\s/g, ''));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const AccordionItem: FC<{ title: string; children: ReactNode }> = ({ title, children }) => (
        <div className="border-b border-[#333333]">
            <button onClick={() => setExpandedSection(expandedSection === title ? null : title)} className="w-full flex justify-between items-center py-4 text-left font-[500] text-[18px] text-[#333333]">
                <span>{title}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSection === title ? 'rotate-180' : ''}`} />
            </button>
            {expandedSection === title && <div className="pb-4 text-gray-600 text-sm">{children}</div>}
        </div>
    );

    return (
        <div className="p-6">
            <h2 className="text-[25px] font-bold text-[#7952B3] mb-6 text-start">Pembayaran</h2>
            <div className='flex justify-center'>
                <div className='w-[75%]'>
                    <div className="space-y-4 border-b border-gray-200">
                        <div className="flex justify-between items-center border-b border-[#CCCCCC] p-6">
                            <span className="text-[#333333] font-semibold text-[20px]">Total Pembayaran</span>
                            <span className="text-[#333333] font-semibold text-[20px] text-end">{formatCurrency(orderDetails.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-[#CCCCCC] p-6">
                            <span className="text-[#333333] font-[500] text-[20px]">Bayar dalam</span>
                            <div className="text-right">
                                <span className="font-semibold text-[#E30800] text-[20px]">{`${hours} jam ${minutes} menit ${seconds} detik`}</span>
                                <p className="text-[16px] mt-1   text-[#333333]">Jatuh tempo {dueDate}</p>
                            </div>
                        </div>
                    </div>
                    {
                        orderDetails.paymentMethod?.name === 'QRIS' ? <div className='flex justify-center space-y-4 mt-8'>
                            <div>
                                <div className='text-[#333333] text-center w-[415px] px-8'>
                                    Scan QR Code dengan aplikasi e-wallet atau mobile banking yang kamu punya:
                                </div>
                                <div className='flex justify-center'>
                                    {/* Pastikan gambar ada di public/image/qr 1.svg */}
                                    <img src='/image/qr 1.svg' alt="QR Code" />
                                </div>
                                <div className='flex justify-center'>
                                    {/* Pastikan gambar ada di public/image/qris 2.svg */}
                                    <img src='/image/qris 2.svg' alt="QRIS logos" />
                                </div>
                                <div className='flex justify-center items-center gap-4'>
                                    <DownloadIcon className='h-[24px] w-[24px]' />
                                    <p className='text-[20px] text-[#333333] font-[500px]'>Download QR Code</p>
                                </div>
                                <div className='flex justify-center'>
                                    <button onClick={onBack} className="bg-[#DE4A53] h-[50px] w-[214px] text-white font-semibold text-[16px] py-3 px-4 rounded-[10px]  mt-6 hover:bg-red-700 transition-colors" style={{
                                        lineHeight: "22px",
                                        letterSpacing: "-0.04em"
                                    }}>Cek Status Bayar</button>
                                </div>
                            </div>
                        </div> :
                            // Render for Virtual Account / E-Wallet (non-QRIS)
                            orderDetails.paymentMethod && (
                                <div className='flex justify-center'>
                                    <div className='flex items-start p-6 gap-10'>
                                        <img src={orderDetails.paymentMethod.logoUrl} width={126} alt={`${orderDetails.paymentMethod.name} logo`} />
                                        <div>
                                            <div className="">
                                                <p className="font-[500] text-[20px] text-[#333333] mb-1">{orderDetails.paymentMethod.name}</p>
                                                <p className="font-[500] text-[16px] text-[#333333]">No. Rekening Virtual Account</p>
                                                <div className="flex items-center mt-4">
                                                    <p className="text-[23px] font-[500] text-[#E30800] tracking-wider">{orderDetails.virtualAccount}</p>
                                                    <button onClick={handleCopy} className="ml-4 text-purple-600 font-semibold text-sm">{copied ? 'Tersalin' : 'SALIN'}</button>
                                                </div>
                                                <p className="text-[16px] text-[#7952B3] mt-3">Proses verifikasi kurang dari 10 menit setelah pembayaran berhasil</p>
                                            </div>
                                            <div className="py-4">
                                                <AccordionItem title="Petunjuk Transfer mBanking">
                                                    <p>1. Login ke m-BCA. <br /> 2. Pilih menu m-Transfer &gt; BCA Virtual Account. <br /> 3. Masukkan nomor Virtual Account di atas. <br /> 4. Ikuti instruksi untuk menyelesaikan pembayaran.</p>
                                                </AccordionItem>
                                                <AccordionItem title="Petunjuk Transfer iBanking">
                                                    <p>1. Login ke KlikBCA. <br /> 2. Pilih menu Transfer Dana &gt; Transfer ke BCA Virtual Account. <br /> 3. Masukkan nomor Virtual Account di atas. <br /> 4. Ikuti instruksi untuk menyelesaikan pembayaran.</p>
                                                </AccordionItem>
                                                <AccordionItem title="Petunjuk Transfer ATM">
                                                    <p>1. Masukkan kartu ATM dan PIN. <br /> 2. Pilih menu Transaksi Lainnya &gt; Transfer &gt; Ke Rek BCA Virtual Account. <br /> 3. Masukkan nomor Virtual Account di atas. <br /> 4. Ikuti instruksi untuk menyelesaikan pembayaran.</p>
                                                </AccordionItem>
                                            </div>
                                            <div className='flex justify-center'>
                                                <button onClick={onBack} className="bg-[#DE4A53] h-[50px] w-[140px] text-white font-semibold text-[16px] py-3 px-4 rounded-[10px] mt-6 hover:bg-red-700 transition-colors" style={{
                                                    lineHeight: "22px",
                                                    letterSpacing: "-0.04em"
                                                }}>Ok</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                    }
                </div>
            </div>
        </div>
    );
};
// END OF UNCHANGED COMPONENTS


// --- MAIN CONTENT COMPONENT ---
// This component contains the core logic and can safely use client-side hooks.
const CheckoutView = () => {
    const [view, setView] = useState<'checkout' | 'confirmation'>('checkout');
    const [stores, setStores] = useState<Store[]>([]);
    const [finalOrder, setFinalOrder] = useState<OrderDetails | null>(null);
    const initialUserAddress = allUserAddresses.find(addr => addr.isPrimary) || allUserAddresses[0];
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [currentAddress, setCurrentAddress] = useState<Address>(initialUserAddress);
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const params = new URLSearchParams();
        const variantIds = searchParams.getAll('variant_id[]');
        const qtys = searchParams.getAll('qty[]');
        const productIds = searchParams.getAll('product_id[]');

        variantIds.forEach((v) => params.append('variant_id[]', v));
        qtys.forEach((q) => params.append('qty[]', q));
        productIds.forEach((p) => params.append('product_id[]', p));

        const queryString = params.toString();
        if (queryString) {
            getCheckout(queryString);
        } else {
            setLoading(false);
        }
    }, [searchParams]);

    const getCheckout = async (queryString: string) => {
        setLoading(true);
        try {
            const res = await Get<Response<BackendStore[]>>('zukses', `checkout?${queryString}`);
            if (res?.status === 'success' && Array.isArray(res.data)) {
                const transformedStores: Store[] = res.data.map((backendStore: BackendStore) => {
                    const products: Product[] = backendStore.products.map((p: BackendProduct): Product => {
                        const originalPrice = p.price || 0;
                        const discountedPrice = p.variant?.discount_price ?? p.discount_price ?? p.price ?? 0;
                        const discountedPercent = p.variant?.discount_percent ?? p.discount_percent ?? 0;

                        const productVouchers: string[] = [];
                        if (discountedPercent) {
                            productVouchers.push(`Diskon Terpakai ${discountedPercent}%`);
                        }
                        if (p.voucher && p.voucher > 0) {
                            productVouchers.push(`Voucher Toko ${formatCurrency(p.voucher)}`);
                        }
                        if (p.subsidy && p.subsidy > 0) {
                            productVouchers.push(`Gratis Ongkir ${formatCurrency(p.subsidy)}`);
                        }
                        if (p.is_cost_by_seller === 1) {
                            productVouchers.push('Gratis Ongkir');
                        }

                        return {
                            ...p,
                            originalPrice,
                            discountedPrice,
                            image: p.image,
                            variant: { // Ensure variant object is always defined
                                id: p.variant?.id ?? 0,
                                product_id: p.variant?.product_id ?? p.id,
                                variant_code: p.variant?.variant_code ?? '',
                                price: p.variant?.price ?? p.price,
                                discount_percent: p.variant?.discount_percent ?? null,
                                discount_price: p.variant?.discount_price ?? null,
                                stock: p.variant?.stock ?? p.stock,
                                image: p.variant?.image ?? p.image,
                            },
                            vouchers: productVouchers,
                        };
                    });

                    const shippingOptions: ShippingOption[] = backendStore.shippingOptions.flatMap((courierOption: BackendCourierOption) => {
                        if (!Array.isArray(courierOption.services)) {
                            return [];
                        }
                        return courierOption.services.map((service: BackendShippingService) => ({
                            id: `${courierOption.courier}-${service.id}`,
                            courierName: courierOption.courier,
                            serviceName: service.name,
                            price: courierOption.cost || 50000,
                            range: getShippingRange(service.name),
                            logoUrl: courierOption.logo_url || COURIER_LOGOS[courierOption.courier] || ''
                        }));
                    });

                    let initialSelectedShipping: ShippingOption;
                    if (backendStore.selectedShipping) {
                        initialSelectedShipping = {
                            id: `${backendStore.selectedShipping.courier}-${backendStore.selectedShipping.id}`,
                            courierName: backendStore.selectedShipping.courier,
                            serviceName: backendStore.selectedShipping.service,
                            price: backendStore.selectedShipping.cost,
                            range: getShippingRange(backendStore.selectedShipping.service),
                            logoUrl: backendStore.selectedShipping.logo_url || COURIER_LOGOS[backendStore.selectedShipping.courier] || ''
                        };
                    } else if (shippingOptions.length > 0) {
                        initialSelectedShipping = shippingOptions[0];
                    } else {
                        // Fallback dummy shipping option to prevent crashes
                        initialSelectedShipping = {
                            id: 'dummy-shipping',
                            courierName: 'N/A',
                            serviceName: 'Tidak tersedia',
                            price: 0,
                            range: 'Reguler',
                            logoUrl: ''
                        };
                    }

                    return {
                        id: backendStore.id,
                        name: backendStore.name,
                        products,
                        shippingOptions,
                        selectedShipping: initialSelectedShipping
                    };
                });
                setStores(transformedStores);
            } else {
                console.warn('Produk tidak ditemukan atau gagal diambil:', res?.message);
                setStores([]);
            }
        } catch (error) {
            console.error("Failed to fetch checkout data:", error);
            setStores([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddressChange = (newAddress: Address) => {
        setCurrentAddress(newAddress);
        setIsAddressModalOpen(false);
        // Optionally, you might want to re-fetch shipping costs here
    };

    const handleProductUpdate = (storeId: string, productId: number, updatedProduct: Product) => {
        setStores(currentStores => currentStores.map(store =>
            store.id === storeId
                ? { ...store, products: store.products.map(p => p.id === productId ? updatedProduct : p) }
                : store
        ));
    };

    const handleProductRemove = (storeId: string, productId: number) => {
        setStores(currentStores => currentStores.map(store => {
            if (store.id === storeId) {
                const updatedProducts = store.products.filter(p => p.id !== productId);
                return updatedProducts.length > 0 ? { ...store, products: updatedProducts } : null;
            }
            return store;
        }).filter(Boolean) as Store[]);
    };

    const handleShippingChange = (storeId: string, newShipping: ShippingOption) => {
        setStores(currentStores => currentStores.map(store =>
            store.id === storeId
                ? { ...store, selectedShipping: newShipping }
                : store
        ));
    };

    const handleCreateOrder = (details: OrderDetails) => {
        setFinalOrder(details);
        setView('confirmation');
    };

    const handleBackToCheckout = () => {
        setView('checkout');
        setFinalOrder(null);
    }

    const {
        originalProductTotal,
        discountedProductTotal,
        shippingSubtotal,
        shippingDiscount,
        storeVoucherDiscount
    } = useMemo(() => {
        let originalTotal = 0;
        let discountedTotal = 0;
        let shippingTotal = 0;
        let shippingDisc = 0;
        let storeVoucher = 0;

        stores.forEach(store => {
            if (store.products.length > 0) {
                store.products.forEach(p => {
                    originalTotal += p.originalPrice * p.quantity;
                    // FIX: Use += to accumulate the total, not =
                    discountedTotal += p.discountedPrice * p.quantity;

                    if (p.voucher && p.voucher > 0) {
                        storeVoucher += p.voucher;
                    }
                    if (p.subsidy && p.subsidy > 0) {
                        shippingDisc += Number(p.subsidy);
                    }
                });
                shippingTotal += store.selectedShipping.price;
            }
        });

        return {
            originalProductTotal: originalTotal,
            discountedProductTotal: discountedTotal,
            shippingSubtotal: shippingTotal,
            shippingDiscount: shippingDisc,
            storeVoucherDiscount: storeVoucher
        };
    }, [stores]);

    const itemDiscount = originalProductTotal - discountedProductTotal;

    if (loading) {
        return (
            <div className="container mx-auto py-8 px-4 lg:w-[1200px] space-y-4 text-center">
                <p>Memuat data checkout...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 lg:w-[1200px] space-y-4">
            {view === 'checkout' ? (
                <>
                    <h1 className="text-[#7952B3] sm:text-3xl font-bold text-[25px] mb-6">Checkout</h1>
                    <div className="space-y-6">
                        <CheckoutAddressCard
                            address={currentAddress}
                            onOpenModal={() => setIsAddressModalOpen(true)}
                        />

                        {stores.length > 0 ? (
                            stores.map((store) => (
                                <div key={store.id} className='rounded-[5px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)] border border-[#DCDCDC]'>
                                    <StoreCheckoutCard
                                        storeData={store}
                                        onProductUpdate={(productId, p) => handleProductUpdate(store.id, productId, p)}
                                        onProductRemove={(productId) => handleProductRemove(store.id, productId)}
                                        onShippingChange={(storeId, s) => handleShippingChange(storeId, s)}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
                                <h3 className="text-lg font-semibold">Keranjang Anda kosong</h3>
                                <p className="mt-2">Silakan tambahkan produk untuk melanjutkan.</p>
                            </div>
                        )}

                        {stores.length > 0 && (
                            <div className='rounded-[5px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)] border border-[#DCDCDC]'>
                                <PaymentAndSummaryCard
                                    originalProductTotal={originalProductTotal} // Pass the final product total after discounts
                                    shippingSubtotal={shippingSubtotal}
                                    itemDiscount={itemDiscount}
                                    shippingDiscount={shippingDiscount}
                                    storeVoucherDiscount={storeVoucherDiscount}
                                    onCreateOrder={handleCreateOrder}
                                />
                            </div>
                        )}
                    </div>
                </>
            ) : finalOrder && (
                <div className='rounded-[5px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)] border border-[#DCDCDC]'>
                    <PaymentConfirmationPage orderDetails={finalOrder} onBack={handleBackToCheckout} />
                </div>
            )}

            <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onApply={handleAddressChange}
                addresses={allUserAddresses}
                currentAddressId={currentAddress.id}
            />
        </div>
    );
};

// --- PAGE EXPORT ---
// Wrap the main view in Suspense for Next.js pages router to handle client-side hooks gracefully.
export default function CheckoutPage() {
    return (
        <MainLayout>
            <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
                <CheckoutView />
            </Suspense>
        </MainLayout>
    );
}