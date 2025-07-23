import { MapPin, ChevronDown, CheckCircle2, Minus, Plus, X } from 'lucide-react';
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

interface OrderDetails {
    totalAmount: number;
    paymentMethod: string;
    virtualAccount: string;
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
    { id: 'pos-reg', courierName: 'POS', serviceName: 'Regular', price: 52500, range: 'Reguler', logoUrl: 'https://www.posindonesia.co.id/_next/image?url=https%3A%2F%2Fadmin-piol.posindonesia.co.id%2Fmedia%2Fpages-pos-reguler.png&w=1920&q=75   ' },
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
            { id: 2, name: 'Rak Bambu Dapur Multifungsi 2 susun', variant: 'Warna Putih Ukuran Sedang', imageUrl: '/image/image 13.png', originalPrice: 350000, discountedPrice: 290000, quantity: 1, codAvailable: true, vouchers: ['Voucher Toko Rp.20.000'] },
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
                {/* Header Modal */}
                <div className="flex justify-between items-center p-6">
                    <h3 className="text-[20px] text-[#333333] font-bold">Ubah Alamat</h3>
                    <button onClick={onClose} className="text-[#555555] hover:text-gray-800">
                        <X size={20} />
                    </button>
                </div>

                {/* Body Modal */}
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
                                            <p className="font-bold text-[#333333] text-[15xpx] line-clamp-1 w-[140px]">
                                                {address.name}</p>
                                            <p className=''>{address.phone}</p>
                                        </div>
                                        <a href="#" className="text-[#F77000]  w-1/8 font-bold text-[15px] text-end text-sm hover:underline">Ubah</a>
                                    </div>
                                    <p className="text-[#333333] text-[15px] mt-1" style={{
                                        letterSpacing: "-0.04em",
                                        lineHeight: '121%'
                                    }}>{address.street}, {address.city}, {address.province}, ID {address.postalCode}</p>
                                </div>
                            </label>
                        </div>
                    ))}
                </div>

                {/* Footer Modal */}
                <div className="flex justify-end items-center p-4 space-x-3">
                    <button onClick={onClose} className="px-6 py-2 text-[#333333] text-[14px] font-semibold rounded-[10px] border border-[#AAAAAA] hover:bg-gray-100">
                        Batalkan
                    </button>
                    <button onClick={handleApplyClick} className="px-6 py-2 bg-[#4A52B2] text-[14px] font-semibold  text-white rounded-md hover:bg-purple-700">
                        Terapkan
                    </button>
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

// Tambahkan onOpenModal ke props
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
                        {/* Ubah menjadi button dan tambahkan onClick */}
                        <button onClick={onOpenModal} className='text-[16px] font-bold text-[#7952B3] hover:underline'>
                            Ubah
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const QuantityStepper: FC<{ quantity: number; onUpdate: (newQuantity: number) => void; }> = ({ quantity, onUpdate }) => {
    return (
        // <div className="flex items-center rounded-md overflow-hidden border border-gray-300">
        //     <button onClick={() => quantity > 1 && onUpdate(quantity - 1)} className="w-7 h-7 flex items-center justify-center text-lg bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed" disabled={quantity <= 1}>-</button>
        //     <span className="w-10 h-7 flex items-center justify-center bg-white text-center text-sm font-medium">{quantity}</span>
        //     <button onClick={() => onUpdate(quantity + 1)} className="w-7 h-7 flex items-center justify-center text-lg bg-green-500 text-white hover:bg-green-600">+</button>
        // </div>
        <div className="col-span-6 md:col-span-2 flex items-center justify-center">
            <div className="flex items-center border border-[#3EA65A] overflow-hidden">
                <button className="h-8 w-8 flex items-center justify-center text-white bg-[#3EA65A] hover:bg-green-700 transition-colors" onClick={() => quantity > 1 && onUpdate(quantity - 1)}>
                    <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 text-center w-12 font-medium bg-white">{quantity}</span>
                <button className="h-8 w-8 flex items-center justify-center text-white bg-[#3EA65A] hover:bg-green-700 transition-colors" onClick={() => onUpdate(quantity + 1)}>
                    <Plus className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

const ProductItemRow: FC<{ product: Product; onUpdate: (updatedProduct: Product) => void; onRemove: (productId: number) => void; }> = ({ product, onUpdate, onRemove }) => {
    return (
        // <div className="flex flex-col md:flex-row md:items-center py-4 space-y-4 md:space-y-0">
        //     <div className="w-full md:w-5/12 flex items-start space-x-4">
        //         <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded-md flex-shrink-0" onError={(e) => { e.currentTarget.src = 'https://placehold.co/80x80/e2e8f0/e2e8f0?text=Img'; }} />
        //         <div className="flex-grow">
        //             <p className="font-semibold text-gray-800 text-sm leading-tight">{product.name}</p>
        //             <p className="text-xs text-gray-500 mt-1">{product.variant}</p>
        //             {product.codAvailable && <p className="text-xs text-orange-500 font-semibold mt-2">COD (Bayar ditempat)</p>}
        //             <div className="flex flex-wrap gap-1 mt-2">
        //                 {product.vouchers?.map((voucher, index) => {
        //                     const isVoucherToko = voucher.toLowerCase().includes('toko');
        //                     const isGratisOngkir = voucher.toLowerCase().includes('ongkir');
        //                     const bgColor = isVoucherToko ? 'bg-green-100' : isGratisOngkir ? 'bg-yellow-100' : 'bg-red-100';
        //                     const textColor = isVoucherToko ? 'text-green-600' : isGratisOngkir ? 'text-yellow-700' : 'text-red-600';
        //                     return (
        //                         <span key={index} className={`text-xs font-semibold px-2 py-0.5 rounded ${bgColor} ${textColor}`}>
        //                             {voucher}
        //                         </span>
        //                     );
        //                 })}
        //             </div>
        //         </div>
        //     </div>
        //     <div className="w-full md:w-2/12 flex justify-between md:justify-center items-center text-center">
        //         <span className="md:hidden font-medium text-gray-600">Harga Satuan</span>
        //         <div>
        //             <p className="text-gray-800 font-semibold">{formatCurrency(product.discountedPrice)}</p>
        //             <p className="line-through text-gray-400 text-xs">{formatCurrency(product.originalPrice)}</p>
        //         </div>
        //     </div>
        //     <div className="w-full md:w-2/12 flex justify-between md:justify-center items-center">
        //         <span className="md:hidden font-medium text-gray-600">Kuantitas</span>
        //         <QuantityStepper quantity={product.quantity} onUpdate={(newQuantity) => onUpdate({ ...product, quantity: newQuantity })} />
        //     </div>
        //     <div className="w-full md:w-2/12 flex justify-between md:justify-center items-center text-center">
        //         <span className="md:hidden font-medium text-gray-600">Total Harga</span>
        //         <span className="text-red-500 font-bold">{formatCurrency(product.discountedPrice * product.quantity)}</span>
        //     </div>
        //     <div className="w-full md:w-1/12 flex justify-end">
        //         <button onClick={() => onRemove(product.id)} className="text-red-500 hover:text-red-700 text-sm">Hapus</button>
        //     </div>
        // </div>
        <div className="p-4 grid grid-cols-12 gap-4 items-center">
            {/* Info Produk */}
            <div className="col-span-12 md:col-span-5 flex items-start gap-4">
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
                        {product.vouchers?.map((voucher, index) => {
                            const isVoucherToko = voucher.toLowerCase().includes('toko');
                            const isGratisOngkir = voucher.toLowerCase().includes('ongkir');
                            const bgColor = isVoucherToko ? 'bg-[#3EA65A]' : isGratisOngkir ? 'bg-[#F7C800]' : 'bg-[#F74F4F]';
                            const textColor = isVoucherToko ? 'text-white' : isGratisOngkir ? 'text-balck' : 'text-white';
                            return (
                                <span key={index} className={`text-[12px] font-semibold px-2 py-2 rounded ${bgColor} ${textColor}`}>
                                    {voucher}
                                </span>
                            );
                        })}
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
                <QuantityStepper quantity={product.quantity} onUpdate={(newQuantity) => onUpdate({ ...product, quantity: newQuantity })} />
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
                <button className="text-[#E33947] text-[14px] font-semibold hover:underline" onClick={() => onRemove(product.id)}>
                    Hapus
                </button>
            </div>
        </div>
    );
};

const CustomCourierSelect: FC<{
    options: ShippingOption[];
    selected: ShippingOption;
    onSelect: (option: ShippingOption) => void;
    placeholder?: string;
    setPriceShipping: (value: number) => void;
}> = ({ options, selected, onSelect, placeholder = "Pilih Kurir", setPriceShipping }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useOutsideClick(dropdownRef as RefObject<HTMLElement>, () => setIsOpen(false));

    const handleSelect = (option: ShippingOption) => {
        onSelect(option);
        setPriceShipping(option?.price)
        setIsOpen(false);
    };

    return (
        // ✅ FIX: Tambahkan z-index di sini untuk mengangkat stacking context komponen
        <div className="relative w-full z-20" ref={dropdownRef}>
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
                // z-index di sini memastikan menu berada di atas tombol dalam komponen yang sama
                <div className="absolute z-10 top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
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
    const [priceShipping, setPriceShipping] = useState<number>(0)
    const [selectedRange, setSelectedRange] = useState<ShippingRange>(storeData.selectedShipping.range);

    const availableRanges = useMemo(() => {
        const ranges = storeData.shippingOptions.map(opt => opt.range);
        return [...new Set(ranges)];
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
        // ✅ FIX: Kelas `overflow-hidden` telah dihapus dari div ini
        <div className="w-full">
            {/* ✅ FIX: Kelas `overflow-hidden` juga dihapus dari div pembungkus ini */}
            <div className="">
                {/* Header Toko */}
                <div className="p-4 border-b border-gray-200 grid grid-cols-12 gap-4 items-center">
                    <div className='col-span-12 md:col-span-5 flex items-start gap-4'>
                        <span className="font-semibold text-gray-800">{storeData.name}</span>
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
                    {storeData.products.map(product => <ProductItemRow key={product.id} product={product} onUpdate={(p) => onProductUpdate(product.id, p)} onRemove={onProductRemove} />)}
                </div>
            </div>
            <div className="flex justify-end items-center space-x-4 p-4 sm:px-6 border-t border-gray-200">
                <p className="text-[16px] font-bold text-[#333333]">Total ({totalProducts} Produk)</p>
                <p className="font-bold text-[25px] text-[#E75864]" style={{
                    lineHeight: "108%",
                    letterSpacing: "-0.04em"
                }}>{formatCurrency(productSubtotal)}</p>
            </div>
            <div className='flex bg-gray-50/70 border-t border-gray-200'>
                <div className="p-4 sm:p-6 w-full">
                    <div className='font-bold text-[#7952B3] text-[20px]'>Pengiriman</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mt-4">
                        <div className="relative md:col-span-1">
                            <label className="text-[16px] font-bold text-[#333333] mb-2 block">Pilih Pengiriman :</label>
                            <select
                                value={selectedRange}
                                onChange={handleRangeChange}
                                className="w-full h-[50px] appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm">
                                {availableRanges.map(range => <option key={range} value={range}>{range} ({range === 'Reguler' ? '1-3 hari' : range === 'Next Day' ? '1 hari' : 'Beberapa jam'})</option>)}
                            </select>
                            <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 bottom-2.5 pointer-events-none" />
                        </div>
                        <div className="relative md:col-span-2">
                            {/* ✅ FIX: Div wrapper yang tidak perlu sudah dihapus dari sini */}
                            <div className='mt-7'>
                                <CustomCourierSelect options={filteredOptions} selected={storeData.selectedShipping} onSelect={onShippingChange} setPriceShipping={setPriceShipping} />
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <label htmlFor={`note-${storeData.id}`} className="text-[16px] font-bold text-[#333333] mb-2 block">Tambah Catatan Pesanan</label>
                        <input type="text" id={`note-${storeData.id}`} className="w-full h-[50px] border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Contoh: Packing lebih aman" />
                    </div>
                </div>
                <div className='py-22 w-1/4 text-right px-8 text-[22px] font-bold text-[#333333]'>
                    {priceShipping > 0 ? formatCurrency(priceShipping) : ""}
                </div>
            </div>
        </div>
    );
};

const PaymentAndSummaryCard: FC<{ productSubtotal: number; shippingSubtotal: number; onCreateOrder: (details: OrderDetails) => void; }> = ({ productSubtotal, shippingSubtotal, onCreateOrder }) => {
    const [activeTab, setActiveTab] = useState<PaymentMethod>('Transfer Bank');
    const [selectedPayment, setSelectedPayment] = useState('BCA Virtual Account');

    const paymentTabs: PaymentMethod[] = ['COD', 'Transfer Bank', 'QRIS', 'E-Wallet'];
    const paymentOptions: { [K in PaymentMethod]?: string[] } = {
        'Transfer Bank': ['BCA Virtual Account', 'BRI Virtual Account', 'BNI Virtual Account', 'BSI Virtual Account', 'Mandiri Virtual Account'],
        'QRIS': ['QRIS'],
        'E-Wallet': ['Gopay', 'Dana', 'Ovo', 'LinkAja']
    };

    const biayaLayanan = 2500;
    const biayaTransfer = 4000;
    const totalPesanan = productSubtotal + shippingSubtotal + biayaLayanan + biayaTransfer;

    const handleCreateOrder = () => {
        onCreateOrder({
            totalAmount: totalPesanan,
            paymentMethod: selectedPayment,
            virtualAccount: '1234 4578 1234 5678'
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-md w-full">
            <div className="p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-800">Metode Pembayaran</h3>
                <div className="flex flex-wrap gap-2 border-b border-gray-200 mt-4 pb-4">
                    {paymentTabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-colors ${activeTab === tab ? 'bg-orange-100 text-orange-600 border-orange-500' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}>
                            {activeTab === tab && <CheckCircle2 className="inline w-4 h-4 mr-2" />} {tab}
                        </button>
                    ))}
                </div>
                <div className="mt-4">
                    {paymentOptions[activeTab]?.map(option => (
                        <div key={option} className="flex items-center p-3 rounded-lg hover:bg-gray-50">
                            <input type="radio" id={option} name="payment" value={option} checked={selectedPayment === option} onChange={() => setSelectedPayment(option)} className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500" />
                            <label htmlFor={option} className="ml-3 block text-sm font-medium text-gray-700">{option}</label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="p-4 sm:p-6 bg-gray-50 rounded-b-xl border-t border-gray-200">
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Subtotal Pesanan</span><span className="font-medium text-gray-800">{formatCurrency(productSubtotal)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Subtotal Pengiriman</span><span className="font-medium text-gray-800">{formatCurrency(shippingSubtotal)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Biaya Layanan</span><span className="font-medium text-gray-800">{formatCurrency(biayaLayanan)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Biaya Transfer</span><span className="font-medium text-gray-800">{formatCurrency(biayaTransfer)}</span></div>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-300">
                    <span className="text-base font-bold text-gray-800">Total Pesanan</span>
                    <span className="text-xl font-bold text-red-500">{formatCurrency(totalPesanan)}</span>
                </div>
                <button onClick={handleCreateOrder} className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg mt-6 hover:bg-purple-700 transition-colors">Buat Pesanan</button>
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

    const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const handleCopy = () => {
        navigator.clipboard.writeText(orderDetails.virtualAccount.replace(/\s/g, ''));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const AccordionItem: FC<{ title: string; children: ReactNode }> = ({ title, children }) => (
        <div className="border-b border-gray-200">
            <button onClick={() => setExpandedSection(expandedSection === title ? null : title)} className="w-full flex justify-between items-center py-4 text-left font-semibold text-gray-700">
                <span>{title}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSection === title ? 'rotate-180' : ''}`} />
            </button>
            {expandedSection === title && <div className="pb-4 text-gray-600 text-sm">{children}</div>}
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Pembayaran</h2>
            <div className="space-y-4 border-b border-gray-200 pb-6">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Pembayaran</span>
                    <span className="font-bold text-lg text-red-500">{formatCurrency(orderDetails.totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bayar dalam</span>
                    <div className="text-right">
                        <span className="font-bold text-red-500">{`${hours} jam ${minutes} menit ${seconds} detik`}</span>
                        <p className="text-xs text-gray-500">Jatuh tempo {dueDate}</p>
                    </div>
                </div>
            </div>
            <div className="py-6 border-b border-gray-200">
                <p className="font-semibold text-gray-800 mb-1">Bank BCA (Virtual Account)</p>
                <p className="text-sm text-gray-500 mb-3">No. Rekening</p>
                <div className="flex items-center">
                    <p className="text-2xl font-bold text-gray-800 tracking-wider">{orderDetails.virtualAccount}</p>
                    <button onClick={handleCopy} className="ml-4 text-purple-600 font-semibold text-sm">
                        {copied ? 'Tersalin' : 'SALIN'}
                    </button>
                </div>
                <p className="text-xs text-green-600 mt-3">Proses verifikasi kurang dari 10 menit setelah pembayaran berhasil</p>
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
            <button onClick={onBack} className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg mt-6 hover:bg-red-600 transition-colors">OK</button>
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---
export default function CheckoutPage() {
    const [view, setView] = useState<'checkout' | 'confirmation'>('checkout');
    const [stores, setStores] = useState<Store[]>(initialStores);
    const [finalOrder, setFinalOrder] = useState<OrderDetails | null>(null);

    // --- STATE UNTUK ALAMAT & MODAL ---
    const initialUserAddress = allUserAddresses.find(addr => addr.isPrimary) || allUserAddresses[0];
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [currentAddress, setCurrentAddress] = useState<Address>(initialUserAddress);
    // --- ---

    const handleAddressChange = (newAddress: Address) => {
        setCurrentAddress(newAddress);
        setIsAddressModalOpen(false); // Tutup modal setelah menerapkan
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

    const handleBackToHome = () => {
        setStores(initialStores);
        setView('checkout');
        setFinalOrder(null);
    }

    const { productSubtotal, shippingSubtotal } = useMemo(() => {
        let productSubtotal = 0;
        let shippingSubtotal = 0;
        stores.forEach(store => {
            productSubtotal += store.products.reduce((acc, p) => acc + p.discountedPrice * p.quantity, 0);
            if (store.products.length > 0) {
                shippingSubtotal += store.selectedShipping.price;
            }
        });
        return { productSubtotal, shippingSubtotal };
    }, [stores]);

    return (
        <MainLayout>
            <div className="container mx-auto py-8 lg:w-[1200px] space-y-4">
                <div className=" mx-auto">
                    {view === 'checkout' ? (
                        <>
                            <h1 className="text-[#7952B3] sm:text-3xl font-bold text-[25px] mb-6">Checkout</h1>
                            <div className="space-y-6 ">
                                <CheckoutAddressCard
                                    address={currentAddress}
                                    onOpenModal={() => setIsAddressModalOpen(true)}
                                />

                                {stores.map(store => (
                                    <div className='rounded-[5px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)] border border-[#DCDCDC]'>
                                        <StoreCheckoutCard
                                            key={store.id}
                                            storeData={store}
                                            onProductUpdate={(productId, p) => handleProductUpdate(store.id, productId, p)}
                                            onProductRemove={(productId) => handleProductRemove(store.id, productId)}
                                            onShippingChange={(s) => handleShippingChange(store.id, s)}
                                        />
                                    </div>
                                ))}

                                {stores.length > 0 ? (
                                    <PaymentAndSummaryCard
                                        productSubtotal={productSubtotal}
                                        shippingSubtotal={shippingSubtotal}
                                        onCreateOrder={handleCreateOrder}
                                    />
                                ) : (
                                    <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
                                        <h3 className="text-lg font-semibold">Keranjang Anda kosong</h3>
                                        <p className="mt-2">Silakan tambahkan produk untuk melanjutkan.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : finalOrder && (
                        <PaymentConfirmationPage orderDetails={finalOrder} onBack={handleBackToHome} />
                    )}
                </div>
            </div>

            {/* --- RENDER MODAL DI SINI --- */}
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