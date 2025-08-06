import React, { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import MainLayout from 'pages/layouts/MainLayout';
import Get from 'services/api/Get';
import { Response } from 'services/api/types';
import { Product } from 'components/types/Product';
import Loading from 'components/Loading';
import { useRouter } from 'next/router';


const StarIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
);

const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

interface Province {
    id: number;
    name: string;
}

interface FilterSidebarProps {
    province: Province[];
    setIdProv: (value: string[]) => void;
    setPaymentMethods: (methods: string[]) => void;
    setConditions: (conds: string[]) => void;
}

// --- Sub-components ---
const toTitleCase = (text: string) =>
    text
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
const FilterCheckbox = ({
    id,
    label,
    onChange,
}: {
    id: string;
    label: string;
    onChange?: (checked: boolean) => void;
}) => (
    <div className="flex items-center mb-2">
        <input
            id={id}
            type="checkbox"
            className="h-[15px] w-[16px] rounded border-gray-300 text-indigo-600 accent-[#52357B] focus:ring-[#52357B] flex-shrink-0"
            onChange={(e) => onChange?.(e.target.checked)}
        />
        <label htmlFor={id} className="ml-3 text-[14px] text-[#555555]" style={{ letterSpacing: "-0.05em" }}>
            {toTitleCase(label)}
        </label>
    </div>
);


const FilterSidebar = ({ province, setIdProv, setPaymentMethods, setConditions }: FilterSidebarProps) => {
    const [showAll, setShowAll] = useState(false);

    const visibleLocations = showAll ? province : province?.slice(0, 14);
    const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
    const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
    console.log(selectedPayments, selectedConditions)
    const handleProvinceChange = (id: string, checked: boolean) => {
        setSelectedProvinces(prev =>
            checked ? [...prev, id] : prev.filter(pid => pid !== id)
        );
    };
    useEffect(() => {
        setIdProv(selectedProvinces);
    }, [selectedProvinces, setIdProv]);
    const handleChange = (
        value: string,
        checked: boolean,
        setLocalState: React.Dispatch<React.SetStateAction<string[]>>,
        setParentState: (value: string[]) => void
    ) => {
        setLocalState(prev => {
            const updated = checked ? [...prev, value] : prev.filter(v => v !== value);
            setParentState(updated);
            return updated;
        });
    };
    return (
        <aside className="w-full">
            {/* Location Filter */}
            <div className="mb-3">
                <h3 className="font-semibold text-[#555555] text-[14px] mb-3" style={{ letterSpacing: "-0.04em" }}>
                    Lokasi
                </h3>
                {visibleLocations.map((loc) => (
                    <FilterCheckbox
                        key={loc.id}
                        id={`loc-${loc.id}`}
                        label={loc.name}
                        onChange={(checked) => handleProvinceChange(String(loc.id), checked)}
                    />
                ))}
                {!showAll && (
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowAll(true);
                        }}
                        className="ml-7 text-[14px] font-bold text-[#555555] hover:text-gray-800 mt-2 inline-block"
                        style={{ letterSpacing: "-0.04em" }}
                    >
                        Lainnya &gt;
                    </a>
                )}
            </div>

            <div className='h-1 w-full border-t border-gray-400 mb-3' />

            <div className="mb-3">
                <h3 className="font-semibold text-[#555555] text-[14px] mb-3" style={{ letterSpacing: "-0.04em" }}>
                    Metode Pembayaran
                </h3>
                <FilterCheckbox
                    id="payment-cod"
                    label="COD (Bayar di Tempat)"
                    onChange={(checked) => handleChange('cod', checked, setSelectedPayments, setPaymentMethods)}
                />
                <FilterCheckbox
                    id="payment-transfer"
                    label="Transfer"
                    onChange={(checked) => handleChange('transfer', checked, setSelectedPayments, setPaymentMethods)}
                />
            </div>

            <div className='h-1 w-full border-t border-gray-400 mb-3' />

            <div>
                <h3 className="font-semibold text-[#555555] text-[14px] mb-3" style={{ letterSpacing: "-0.04em" }}>
                    Kondisi Barang
                </h3>
                <FilterCheckbox
                    id="condition-new"
                    label="Baru"
                    onChange={(checked) => handleChange('new', checked, setSelectedConditions, setConditions)}
                />
                <FilterCheckbox
                    id="condition-used"
                    label="Bekas di Pakai"
                    onChange={(checked) => handleChange('used', checked, setSelectedConditions, setConditions)}
                />
            </div>
        </aside>
    );
};

function formatLocation(location: string) {
    return location
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
const ProductCard = ({ product }: { product: Product }) => {
    const router = useRouter();
    console.log('product', product)
    return (
        <div key={product.id}
            className="bg-white cursor-pointer w-full h-[311px] rounded-[15px] overflow-hidden group lg:w-[190px]  border border-[#DDDDDD]"
            onClick={() => {
                const slug = product.name
                    .toLowerCase()
                    // ganti spasi ATAU karakter “/” dengan "-"
                    .replace(/[\s/]+/g, '-')
                    // hapus tanda minus ganda di tengah/tengah akhir, opsional
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '');        // buang minus di awal/akhir

                router.push(`/${slug}`);
                localStorage.setItem('product', JSON.stringify(product));
            }}
            style={{
                letterSpacing: "-0.03em"
            }}>
            <div className="relative">
                {/* Label Gratis Ongkir & Voucher */}
                <div className="absolute top-5 left-1 -right-0 flex flex-col z-10 gap-1.5">
                    {
                        product?.discount_percent ?
                            <div className='flex items-center h-[22px]' style={{ letterSpacing: "-0.04em" }}>
                                <span className='bg-[#FAD7D7] border text-[#F02929]  font-[600] text-[12px] rounded-r-full px-2 py-0.5'>Diskon {product?.discount_percent}%</span>
                            </div> : ''
                    }
                    {
                        product?.delivery?.subsidy ?
                            <div className='flex items-center h-[22px]' style={{ letterSpacing: "-0.04em" }}>
                                <span className='bg-[#C8F7D4] text-[#388F4F]  font-[600] text-[12px] border rounded-r-full px-2 py-0.5'>Gratis Ongkir</span>
                            </div> : ''
                    }
                </div>

                {/* Gambar produk */}
                <img
                    src={product.image}
                    alt={product.name}
                    className="md:w-[190px] md:h-[190px] rounded-t-[10px] object-center"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=Produk';
                    }}
                />
            </div>

            {/* Informasi produk lainnya */}
            <div className="p-2">
                <p
                    className="text-[14px] md:text-[14px] text-[#111111] line-clamp-2"
                    style={{
                        lineHeight: '17px',
                        minHeight: '17px', // setara 2 baris
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {product.name}
                </p>
                <div className='flex gap-2 items-center'>
                    <p className="text-[12px] md:text-[14px] font-bold mt-1.5  text-[#F94D63] bg-[#FFF7F7] border border-[#F94D63] py-[3px] px-[12px] rounded-[12px]" style={{ lineHeight: "18px" }}>{formatRupiah(product.price)}</p>
                    {/* <p className="text-[12px] md:text-[12px] text-[#555555] mt-1  line-through" style={{
                                               lineHeight: "22px",
                                               letterSpacing: "-0.04em"
                                           }}>Rp300.000</p> */}
                </div>

                {/* <div className='flex justify-left items-center  gap-2'>
                                           {product.is_cod_enabled && (
                                               <div className="mt-1 w-[48px] h-[24px] bg-[#F77000] flex justify-center items-center rounded-[10px]">
                                                   <p className="text-[12px] text-white font-bold">COD</p>
                                               </div>
                                           )}
                                           <div className="mt-1 w-[48px] h-[24px] bg-[#DE4A53] flex justify-center items-center rounded-[10px]">
                                               <p className="text-[12px] text-white font-bold">-31%</p>
                                           </div>
                                       </div> */}

                <div className="flex items-start gap-1 justify-between text-xs text-gray-500 " style={{ letterSpacing: "-0.04em", lineHeight: "22px" }}>
                    <div className='flex items-center' style={{ lineHeight: "22px" }}>
                        <StarIcon className="w-[16px] h-[16px] text-yellow-400" />
                        <span className='text-[12px] font-semibold text-[#555555] tracking-[-0.04em]'>{product.rating || 4.9}</span>
                        <span className='ml-2 text-[12px] mt-1 text-[#555555] tracking-[-0.04em]'>{product.sold || "1000"}+ terjual</span>
                    </div>
                    {
                        product?.voucher ?
                            <div className={`bg-[#E7F2FF] mt-2 text-[#1073F7] rounded-[3px] font-bold text-[10px] h-[20px] flex flex-col items-start justify-end px-2 pt-5`}>
                                Voucher
                            </div> : ''
                    }
                </div>

                <p className="text-[10px] text-[#555555] -mt-2" style={{
                    lineHeight: "22px",
                    letterSpacing: "-0.04em"
                }}>{formatLocation(product?.seller?.location)}</p>
            </div>
        </div>
    );
};


const ProductGrid = ({ products }: { products: Product[] }) => (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map(product => (
            <ProductCard key={product.id} product={product} />
        ))}
    </div>
);


// --- Main App Component ---

export default function App() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const router = useRouter();
    const { product } = router.query
    const [products, setProducts] = useState<Product[] | null>(null);
    const [province, setProvince] = useState<Province[]>([]);
    const [idProv, setIdProv] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
    const [conditions, setConditions] = useState<string[]>([]);
    const getProduct = async () => {
        setLoading(true);

        const queryParams: string[] = [];

        if (product) queryParams.push(`search=${product}`);
        idProv.forEach(id => queryParams.push(`province_id[]=${id}`));

        // Perbaikan bagian pembayaran
        paymentMethods.forEach(method => {
            if (method === 'cod') queryParams.push(`payment[]=1`);
            if (method === 'transfer') queryParams.push(`payment[]=0`);
        });

        // Perbaikan bagian kondisi
        conditions.forEach(cond => {
            if (cond === 'new') queryParams.push(`condition[]=0`);
            if (cond === 'used') queryParams.push(`condition[]=1`);
        });

        const queryString = queryParams.join('&');
        const res = await Get<Response>('zukses', `product?${queryString}`);


        if (res?.status === 'success' && Array.isArray(res.data)) {
            console.log(res.data)
            setProducts(res.data as Product[]);
        } else {
            console.warn('Produk tidak ditemukan atau gagal diambil');
        }
        setLoading(false);
    };

    const getProvince = async () => {
        setLoading(true);
        const res = await Get<Response>('zukses', `province`);
        if (res?.message === 'success' && Array.isArray(res.data)) {
            const data = res?.data as Province[];
            console.log('data', data)
            setProvince(data);
        } else {
            console.warn('Produk tidak ditemukan atau gagal diambil');

        }
        setLoading(false);
    };

    useEffect(() => {
        getProduct();
        getProvince();
    }, [product, paymentMethods, conditions]);
    useEffect(() => {
        getProduct();
    }, [idProv]);
    return (
        <MainLayout>
            <div className="min-h-screen font-sans container mx-auto pb-24 md:pb-0 lg:w-[1200px] md:px-[0px] mt-[24px]">
                <div className="container mx-auto px-0 ">
                    <div className="mb-6 flex justify-between items-center">
                        {/* <h1 className="text-xl md:text-2xl text-gray-800">
                            Hasil Pencarian untuk <span className="font-bold">Laptop</span>
                        </h1> */}
                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="lg:hidden flex items-center p-2 rounded-md border bg-white text-gray-600 hover:bg-gray-100"
                        >
                            <Menu className="w-5 h-5 mr-2" />
                            Filter
                        </button>
                    </div>
                    <div className='flex flex-row gap-8'>
                        <h2 className="text-[#333333] text-[20px] font-bold mb-4 w-1/7" style={{
                            letterSpacing: "-0.04em"
                        }}>Filter</h2>
                        <p className='text-[#333333] font-semibold' style={{
                            lineHeight: '17px',
                            letterSpacing: "-0.03em"
                        }}>
                            Hasil Pencarian untuk <span className='text-[#E67514] text-[20px]'>{product}</span>
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block w-1/7`}>
                            <FilterSidebar province={province} setIdProv={setIdProv} setPaymentMethods={setPaymentMethods}
                                setConditions={setConditions} />
                        </div>

                        {/* Main Content */}
                        <main className="flex-1">
                            {
                                products &&
                                <ProductGrid products={products} />
                            }
                            <div className='px-4 md:px-0 mt-10 flex justify-center items-center'>
                                <div className='bg-[#238744] text-white w-[383px] h-[50px] flex justify-center items-center rounded-[20px] cursor-pointer'>
                                    <p className='text-[16px] font-semibold'>Muat lebih Banyak</p>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
            {loading && <Loading />}
        </MainLayout>
    );
}
