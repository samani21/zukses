import { MapPin, ChevronDown, CheckCircle2 } from 'lucide-react';
import type { FC } from 'react';
import { useState, useMemo, useEffect } from 'react';

// --- INTERFACES & TYPE DEFINITIONS ---
interface Address {
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
}

interface ShippingOption {
    name: string;
    price: number;
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
const initialUserAddress: Address = {
    name: "Andi Gustisari",
    phone: "(+62) 81292651600",
    street: "Jl. rajawali 1 lorong 10 ( samping masjid Nurul Ilham lette belok kiri mentok)",
    city: "KOTA MAKASSAR - MARISO",
    province: "SULAWESI SELATAN",
    postalCode: "90123",
    isPrimary: true,
};

const initialStores: Store[] = [
    {
        id: 'store-abc',
        name: 'Toko ABC',
        products: [
            { id: 1, name: 'Rak Bambu Dapur Multifungsi 2 susun', variant: 'Warna Putih Ukuran Sedang', imageUrl: 'https://placehold.co/150x150/f0f0f0/333?text=Rak+Bambu', originalPrice: 350000, discountedPrice: 290000, quantity: 1 },
            { id: 2, name: 'Rak Bambu Dapur Multifungsi 2 susun', variant: 'Warna Putih Ukuran Sedang', imageUrl: 'https://placehold.co/150x150/f0f0f0/333?text=Rak+Bambu', originalPrice: 350000, discountedPrice: 290000, quantity: 1 },
        ],
        shippingOptions: [{ name: 'JNE REG', price: 58000 }, { name: 'J&T Express', price: 55000 }],
        selectedShipping: { name: 'JNE REG', price: 58000 }
    },
    {
        id: 'store-cde',
        name: 'Toko CDE',
        products: [
            { id: 3, name: 'Rak Bambu Dapur Multifungsi 2 susun', variant: 'Warna Putih Ukuran Sedang', imageUrl: 'https://placehold.co/150x150/333/f0f0f0?text=Rak+Bambu', originalPrice: 150000, discountedPrice: 100000, quantity: 1 },
        ],
        shippingOptions: [{ name: 'JNE REG', price: 30000 }, { name: 'SiCepat', price: 28000 }],
        selectedShipping: { name: 'JNE REG', price: 30000 }
    }
];

// --- UI COMPONENTS ---

const CheckoutAddressCard: FC<{ address: Address }> = ({ address }) => (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-grow">
                <div className="flex items-center mb-3">
                    <MapPin className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0" />
                    <h2 className="text-lg font-bold text-gray-800">Alamat Pengiriman</h2>
                </div>
                <div className="pl-8">
                    <p className="font-semibold text-gray-700">{address.name} ({address.phone})</p>
                    <p className="text-gray-500 text-sm mt-1">{address.street}, {address.city}, {address.province}, ID {address.postalCode}</p>
                    {address.isPrimary && <span className="mt-2 inline-block bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-md">Alamat Utama</span>}
                </div>
            </div>
            <div className="pl-8 sm:pl-4 mt-4 sm:mt-0 flex-shrink-0">
                <button className="text-purple-600 font-semibold hover:text-purple-800 transition-colors duration-200">Ubah</button>
            </div>
        </div>
    </div>
);

const CheckoutProductHeader: FC = () => (
    <div className="bg-white rounded-xl shadow-md w-full">
        <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">Produk Dipesan</h2>
        </div>
        <div className="flex items-center text-center text-sm font-semibold text-gray-600 p-4 sm:px-6">
            <div className="flex-1 text-left">Produk</div>
            <div className="w-1/5 hidden md:block">Harga Satuan</div>
            <div className="w-1/5 hidden sm:block">Kuantitas</div>
            <div className="w-1/4 text-right sm:text-center">Total Harga</div>
            <div className="w-16 text-right">Aksi</div>
        </div>
    </div>
);

const QuantityStepper: FC<{ quantity: number; onUpdate: (newQuantity: number) => void; }> = ({ quantity, onUpdate }) => {
    return (
        <div className="flex items-center">
            <button onClick={() => quantity > 1 && onUpdate(quantity - 1)} className="px-2 py-1 border border-gray-300 rounded-l-md hover:bg-gray-100 disabled:opacity-50" disabled={quantity <= 1}>-</button>
            <span className="px-4 py-1 border-t border-b border-gray-300 text-center">{quantity}</span>
            <button onClick={() => onUpdate(quantity + 1)} className="px-2 py-1 border border-gray-300 rounded-r-md hover:bg-gray-100">+</button>
        </div>
    );
};

const ProductItemRow: FC<{ product: Product; onUpdate: (updatedProduct: Product) => void; onRemove: (productId: number) => void; }> = ({ product, onUpdate, onRemove }) => {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center py-4">
            <div className="flex items-center flex-1 mb-4 sm:mb-0">
                <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md mr-4" onError={(e) => { e.currentTarget.src = 'https://placehold.co/64x64/e2e8f0/e2e8f0?text=Img'; }} />
                <div>
                    <p className="font-semibold text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.variant}</p>
                </div>
            </div>
            <div className="w-full sm:w-1/5 text-left sm:text-center mb-2 sm:mb-0">
                <span className="line-through text-gray-400 text-sm mr-2">{formatCurrency(product.originalPrice)}</span>
                <span className="text-gray-800 font-semibold">{formatCurrency(product.discountedPrice)}</span>
            </div>
            <div className="flex justify-between items-center w-full sm:w-auto">
                <div className="sm:w-28 flex justify-center mr-4">
                    <QuantityStepper quantity={product.quantity} onUpdate={(newQuantity) => onUpdate({ ...product, quantity: newQuantity })} />
                </div>
                <div className="sm:w-28 text-right sm:text-center">
                    <span className="text-red-500 font-bold">{formatCurrency(product.discountedPrice * product.quantity)}</span>
                </div>
                <div className="sm:w-20 text-right ml-4">
                    <button onClick={() => onRemove(product.id)} className="text-red-500 hover:text-red-700 text-sm">Hapus</button>
                </div>
            </div>
        </div>
    );
};

const StoreCheckoutCard: FC<{ storeData: Store; onProductUpdate: (productId: number, updatedProduct: Product) => void; onProductRemove: (productId: number) => void; onShippingChange: (newShipping: ShippingOption) => void; }> = ({ storeData, onProductUpdate, onProductRemove, onShippingChange }) => {
    const productSubtotal = storeData.products.reduce((acc, p) => acc + (p.discountedPrice * p.quantity), 0);
    const totalProducts = storeData.products.reduce((acc, p) => acc + p.quantity, 0);

    return (
        <div className="bg-white rounded-xl shadow-md w-full">
            <div className="p-4 sm:p-6 border-b border-gray-200"><h3 className="font-bold text-gray-800">{storeData.name}</h3></div>
            <div className="p-4 sm:p-6 divide-y divide-gray-200">
                {storeData.products.map(product => <ProductItemRow key={product.id} product={product} onUpdate={(p) => onProductUpdate(product.id, p)} onRemove={onProductRemove} />)}
            </div>
            <div className="p-4 sm:p-6 bg-gray-50 rounded-b-xl">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-800">Pengiriman</h4>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Total ({totalProducts} Produk)</p>
                        <p className="font-bold text-red-500">{formatCurrency(productSubtotal)}</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                    <div className="relative flex-1">
                        <select className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"><option>Reguler (1-4 hari)</option></select>
                        <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <div className="relative flex-1">
                        <select value={storeData.selectedShipping.name} onChange={(e) => { const opt = storeData.shippingOptions.find(o => o.name === e.target.value); if (opt) onShippingChange(opt); }} className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500">
                            {storeData.shippingOptions.map(opt => <option key={opt.name} value={opt.name}>{opt.name} {formatCurrency(opt.price)}</option>)}
                        </select>
                        <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <p className="md:w-32 text-left md:text-right font-semibold text-gray-800">{formatCurrency(storeData.selectedShipping.price)}</p>
                </div>
                <div className="mt-4">
                    <label htmlFor={`note-${storeData.id}`} className="text-sm font-medium text-gray-700 mb-1 block">Tambah Catatan Pesanan</label>
                    <input type="text" id={`note-${storeData.id}`} className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Contoh: Packing lebih aman" />
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
    const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
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

    const AccordionItem: FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
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
        ));
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
        // Reset state and go back to checkout view
        setStores(initialStores);
        setView('checkout');
        setFinalOrder(null);
    }

    const { productSubtotal, shippingSubtotal } = useMemo(() => {
        let productSubtotal = 0;
        let shippingSubtotal = 0;
        stores.forEach(store => {
            productSubtotal += store.products.reduce((acc, p) => acc + p.discountedPrice * p.quantity, 0);
            shippingSubtotal += store.selectedShipping.price;
        });
        return { productSubtotal, shippingSubtotal };
    }, [stores]);

    return (
        <div className="bg-gray-50 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {view === 'checkout' ? (
                    <>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
                        <div className="space-y-6">
                            <CheckoutAddressCard address={initialUserAddress} />
                            <CheckoutProductHeader />
                            {stores.map(store => (
                                <StoreCheckoutCard
                                    key={store.id}
                                    storeData={store}
                                    onProductUpdate={(productId, p) => handleProductUpdate(store.id, productId, p)}
                                    onProductRemove={(productId) => handleProductRemove(store.id, productId)}
                                    onShippingChange={(s) => handleShippingChange(store.id, s)}
                                />
                            ))}
                            <PaymentAndSummaryCard
                                productSubtotal={productSubtotal}
                                shippingSubtotal={shippingSubtotal}
                                onCreateOrder={handleCreateOrder}
                            />
                        </div>
                    </>
                ) : finalOrder && (
                    <PaymentConfirmationPage orderDetails={finalOrder} onBack={handleBackToHome} />
                )}
            </div>
        </div>
    );
}
