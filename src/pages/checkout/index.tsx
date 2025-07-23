import { MapPin, ChevronDown, Minus, Plus, X, Check, DownloadIcon } from 'lucide-react';
import MainLayout from 'pages/layouts/MainLayout';
import type { FC, ReactNode, RefObject } from 'react';
import { useState, useMemo, useEffect, useRef } from 'react';

// --- INTERFACES & TYPE DEFINITIONS ---
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
    name: string;
    variant: string;
    imageUrl: string;
    originalPrice: number;
    discountedPrice: number;
    quantity: number;
    codAvailable?: boolean;
    vouchers?: string[];
}

type ShippingRange = 'Reguler' | 'Next Day' | 'Same Day';

interface ShippingOption {
    id: string; // Unique ID for each option
    courierName: string; // e.g., 'SiCepat'
    serviceName: string; // e.g., 'SIUNTUNG'
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

interface PaymentOption { name: string; logoUrl: string; }
interface OrderDetails {
    totalAmount: number;
    paymentMethod: PaymentOption | null;
    virtualAccount: string;
    imagePayment: string
}

type PaymentMethod = 'COD' | 'Transfer Bank' | 'QRIS' | 'E-Wallet';

// --- HELPER FUNCTIONS ---
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount).replace(/\s/g, '');
};


// --- MOCK DATA ---
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

const allShippingOptions: ShippingOption[] = [
    { id: 'sicepat-reg', courierName: 'SiCepat', serviceName: 'SIUNTUNG', price: 47000, range: 'Reguler', logoUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhnQ_u7_qEjguu0ZqqKrXJKRfi4PHRc5fLw0aCXnYwf-yygcnoXw0yDcIo8A-J_wwQyFH1cSZX9TnLcqOKsjCnKiKmBxkoXvznGOYsY-y6qvVHQSgKKA2qSGraF6x1xRFlP12sqb3ZvUDXUNmV1rSZvePdhXUp98t_uBBBogyC8efTM-KIX-zqNtgdO/s320/GKL5_SiCepat%20Express%20-%20Koleksilogo.com.jpg' },
    { id: 'jne-reg', courierName: 'JNE', serviceName: 'REG', price: 56000, range: 'Reguler', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/92/New_Logo_JNE.png' },
    { id: 'jnt-reg', courierName: 'J&T', serviceName: 'Regular', price: 47000, range: 'Reguler', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/J%26T_Express_logo.svg/972px-J%26T_Express_logo.svg.png' },
    { id: 'pos-reg', courierName: 'POS', serviceName: 'Regular', price: 52500, range: 'Reguler', logoUrl: 'https://www.posindonesia.co.id/_next/image?url=https%3A%2F%2Fadmin-piol.posindonesia.co.id%2Fmedia%2Fpages-pos-reguler.png&w=1920&q=75' },
];

const initialStores: Store[] = [
    {
        id: 'store-abc',
        name: 'Toko ABC',
        products: [
            {
                id: 1,
                name: 'Rak Bambu Dapur Multifungsi 2 susun',
                variant: 'Warna Putih Ukuran Sedang',
                imageUrl: '/image/image 13.png',
                originalPrice: 350000,
                discountedPrice: 290000,
                quantity: 1,
                codAvailable: true,
                vouchers: ['Diskon Terpakai 25%', 'Gratis Ongkir Rp10.000']
            },
            { id: 2, name: 'Rak Bambu Dapur Multifungsi 2 susun', variant: 'Warna Putih Ukuran Sedang', imageUrl: '/image/image 13.png', originalPrice: 350000, discountedPrice: 290000, quantity: 1, codAvailable: true, vouchers: ['Voucher Toko Rp20.000'] },
        ],
        shippingOptions: allShippingOptions,
        selectedShipping: allShippingOptions[0]
    },
    {
        id: 'store-cde',
        name: 'Toko CDE',
        products: [
            { id: 3, name: 'Rak Bambu Dapur Multifungsi 2 susun', variant: 'Warna Putih Ukuran Sedang', imageUrl: '/image/image 13.png', originalPrice: 150000, discountedPrice: 120000, quantity: 1, codAvailable: true, vouchers: ['Gratis Ongkir Rp10.000'] },
            { id: 4, name: 'Rak Bambu Dapur Multifungsi 2 susun', variant: 'Warna Putih Ukuran Sedang', imageUrl: '/image/image 13.png', originalPrice: 150000, discountedPrice: 120000, quantity: 1, codAvailable: true, vouchers: ['Gratis Ongkir Rp10.000'] },
        ],
        shippingOptions: allShippingOptions.filter(opt => opt.courierName !== 'POS'), // Example of a store with fewer options
        selectedShipping: allShippingOptions[0]
    }
];

// --- COMPONENTS ---

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
            <img src={product.imageUrl} alt={product.name} className="w-[100px] h-[100px] object-cover border border-[#AAAAAA]" />
            <div className="flex-1 space-y-2">
                <p className="text-[#333333] text-[16px] line-clamp-1 w-full">{product.name}</p>
                <p className="text-[#333333] text-[13px] line-clamp-1 w-full">{product.variant}</p>
                <span className="text-[#F77000] text-[14px] font-bold">COD (Bayar ditempat)</span>
                <div className="flex flex-wrap gap-2 mt-2">
                    {product.vouchers?.map((voucher, index) => {
                        const isVoucherToko = voucher.toLowerCase().includes('toko');
                        const isGratisOngkir = voucher.toLowerCase().includes('ongkir');
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
            <p className="text-[#333333] text-right line-through text-[14px]">{formatCurrency(product.originalPrice)}</p>
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
    selected: ShippingOption;
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
                        <img src={selected.logoUrl} alt={selected.courierName} className="h-5 w-auto object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
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
                                <img src={option.logoUrl} alt={option.courierName} className="h-6 w-12 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
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

const StoreCheckoutCard: FC<{ storeData: Store; onProductUpdate: (productId: number, updatedProduct: Product) => void; onProductRemove: (productId: number) => void; onShippingChange: (newShipping: ShippingOption) => void; }> = ({ storeData, onProductUpdate, onProductRemove, onShippingChange }) => {
    const productSubtotal = storeData.products.reduce((acc, p) => acc + (p.discountedPrice * p.quantity), 0);
    const totalProducts = storeData.products.reduce((acc, p) => acc + p.quantity, 0);
    const [selectedRange, setSelectedRange] = useState<ShippingRange>(storeData.selectedShipping.range);

    const availableRanges = useMemo(() => {
        const ranges = new Set(storeData.shippingOptions.map(opt => opt.range));
        return Array.from(ranges);
    }, [storeData.shippingOptions]);

    const filteredOptions = useMemo(() => {
        return storeData.shippingOptions.filter(opt => opt.range === selectedRange);
    }, [selectedRange, storeData.shippingOptions]);

    const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRange = e.target.value as ShippingRange;
        setSelectedRange(newRange);
        const newOptionsForRange = storeData.shippingOptions.filter(opt => opt.range === newRange);
        if (newOptionsForRange.length > 0) {
            onShippingChange(newOptionsForRange[0]);
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
                            <CustomCourierSelect options={filteredOptions} selected={storeData.selectedShipping} onSelect={onShippingChange} />
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
        const totalDiskon = itemDiscount + shippingDiscount + storeVoucherDiscount;
        const totalPembayaran = originalProductTotal + shippingSubtotal + biayaLayanan + biayaTransfer - totalDiskon;
        const handleCreateOrder = () => {
            onCreateOrder({
                totalAmount: totalPembayaran,
                paymentMethod: selectedPayment,
                virtualAccount: '1234 4578 1234 5678',
                imagePayment: "s"
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
                        <span className="text-[16px]  text-[#333333] text-end">Total Pembayaran</span>
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
    console.log('orderDetails', orderDetails)
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
                                <p className="text-[16px] mt-1   text-[#333333]">Jatuh tempo {dueDate}</p>
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
                                    <img src='/image/qr 1.svg' />
                                </div>
                                <div className='flex justify-center'>
                                    <img src='/image/qris 2.svg' />
                                </div>
                                <div className='flex justify-center items-center gap-4'>
                                    <DownloadIcon className='h-[24px] w-[24px]' />
                                    <p className='text-[20px] text-[#333333] font-[500px]'>Download QR Code</p>
                                </div>
                                <div className='flex justify-center'>
                                    <button onClick={onBack} className="bg-[#DE4A53] h-[50px] w-[214px] text-white font-semibold text-[16px] py-3 px-4 rounded-[10px]  mt-6 hover:bg-red-700 transition-colors" style={{
                                        lineHeight: "22px",
                                        letterSpacing: "-0.04em"
                                    }}>Cek Status Bayar</button>
                                </div>
                            </div>
                        </div> :
                            <div className='flex justify-center'>
                                <div className='flex items-start p-6 gap-10'>
                                    <img src={orderDetails.paymentMethod?.logoUrl} width={126} />
                                    <div>
                                        <div className="">
                                            <p className="font-[500] text-[20px] text-[#333333] mb-1">{orderDetails.paymentMethod?.name}</p>
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
                                            <button onClick={onBack} className="bg-[#DE4A53] h-[50px] w-[140px] text-white font-semibold text-[16px] py-3 px-4 rounded-[10px]  mt-6 hover:bg-red-700 transition-colors" style={{
                                                lineHeight: "22px",
                                                letterSpacing: "-0.04em"
                                            }}>Ok</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </div>
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---
export default function CheckoutPage() {
    const [view, setView] = useState<'checkout' | 'confirmation'>('checkout');
    const [stores, setStores] = useState<Store[]>(initialStores);
    const [finalOrder, setFinalOrder] = useState<OrderDetails | null>(null);
    const initialUserAddress = allUserAddresses.find(addr => addr.isPrimary) || allUserAddresses[0];
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [currentAddress, setCurrentAddress] = useState<Address>(initialUserAddress);

    const handleAddressChange = (newAddress: Address) => {
        setCurrentAddress(newAddress);
        setIsAddressModalOpen(false);
    };

    const handleProductUpdate = (storeId: string, productId: number, updatedProduct: Product) => {
        setStores(currentStores => currentStores.map(store =>
            store.id === storeId
                ? { ...store, products: store.products.map(p => p.id === productId ? updatedProduct : p) }
                : store
        ));
    };

    const handleProductRemove = (storeId: string, productId: number) => {
        setStores(currentStores => currentStores.map(store =>
            store.id === storeId
                ? { ...store, products: store.products.filter(p => p.id !== productId) }
                : store
        ).filter(store => store.products.length > 0));
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
        shippingSubtotal,
        itemDiscount,
        shippingDiscount,
        storeVoucherDiscount
    } = useMemo(() => {
        let originalTotal = 0;
        let discountedTotal = 0;
        let shippingTotal = 0;
        let shippingDisc = 0;
        let storeVoucher = 0;

        const extractAmount = (voucher: string): number => {
            const matches = voucher.match(/(\d{1,3}(?:[.,]\d{3})*|\d+)/);
            return matches ? parseInt(matches[0].replace(/[.,]/g, '')) : 0;
        };

        stores.forEach(store => {
            if (store.products.length > 0) {
                store.products.forEach(p => {
                    originalTotal += p.originalPrice * p.quantity;
                    discountedTotal += p.discountedPrice * p.quantity;
                    p.vouchers?.forEach(v => {
                        if (v.toLowerCase().includes('ongkir')) {
                            shippingDisc += extractAmount(v);
                        } else if (v.toLowerCase().includes('toko')) {
                            storeVoucher += extractAmount(v);
                        }
                    });
                });
                shippingTotal += store.selectedShipping.price;
            }
        });

        return {
            originalProductTotal: originalTotal,
            shippingSubtotal: shippingTotal,
            itemDiscount: originalTotal - discountedTotal,
            shippingDiscount: shippingDisc,
            storeVoucherDiscount: storeVoucher
        };
    }, [stores]);

    return (
        <MainLayout>
            <div className="container mx-auto py-8 px-4 lg:w-[1200px] space-y-4">
                {view === 'checkout' ? (
                    <>
                        <h1 className="text-[#7952B3] sm:text-3xl font-bold text-[25px] mb-6">Checkout</h1>
                        <div className="space-y-6">
                            <CheckoutAddressCard
                                address={currentAddress}
                                onOpenModal={() => setIsAddressModalOpen(true)}
                            />

                            {stores.map((store, index) => (
                                <div key={index} className='rounded-[5px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)] border border-[#DCDCDC]'>
                                    <StoreCheckoutCard
                                        storeData={store}
                                        onProductUpdate={(productId, p) => handleProductUpdate(store.id, productId, p)}
                                        onProductRemove={(productId) => handleProductRemove(store.id, productId)}
                                        onShippingChange={(s) => handleShippingChange(store.id, s)}
                                    />
                                </div>
                            ))}

                            {stores.length > 0 ? (
                                <div className='rounded-[5px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)] border border-[#DCDCDC]'>
                                    <PaymentAndSummaryCard
                                        originalProductTotal={originalProductTotal}
                                        shippingSubtotal={shippingSubtotal}
                                        itemDiscount={itemDiscount}
                                        shippingDiscount={shippingDiscount}
                                        storeVoucherDiscount={storeVoucherDiscount}
                                        onCreateOrder={handleCreateOrder}
                                    />
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
                                    <h3 className="text-lg font-semibold">Keranjang Anda kosong</h3>
                                    <p className="mt-2">Silakan tambahkan produk untuk melanjutkan.</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : finalOrder && (
                    <div className='rounded-[5px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)] border border-[#DCDCDC]'>
                        <PaymentConfirmationPage orderDetails={finalOrder} onBack={handleBackToCheckout} />
                    </div>
                )}
            </div>

            <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onApply={handleAddressChange}
                addresses={allUserAddresses}
                currentAddressId={currentAddress.id}
            />
        </MainLayout>
    );
}