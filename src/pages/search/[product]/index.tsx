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

// --- Sub-components ---

const FilterCheckbox = ({ id, label }: { id: string; label: string }) => (
    <div className="flex items-center mb-2">
        <input
            id={id}
            type="checkbox"
            className="h-[15px] w-[16px] rounded border-gray-300 text-indigo-600 accent-[#52357B] focus:ring-[#52357B] flex-shrink-0"
        />
        <label htmlFor={id} className="ml-3 text-[14px] text-[#555555]" style={{
            letterSpacing: "-0.05em"
        }}>
            {label}
        </label>
    </div>
);

const FilterSidebar = () => {
    const locations = [
        "Aceh",
        "Sumatera Utara",
        "Sumatera Barat",
        "Riau",
        "Kepulauan Riau",
        "Jambi",
        "Sumatera Selatan",
        "Bangka Belitung",
        "Bengkulu",
        "Lampung",
        "DKI Jakarta",
        "Jawa Barat",
        "Banten",
        "Jawa Tengah",
        "DI Yogyakarta",
        "Jawa Timur",
        "Bali",
        "Nusa Tenggara Barat",
        "Nusa Tenggara Timur",
        "Kalimantan Barat",
        "Kalimantan Tengah",
        "Kalimantan Selatan",
        "Kalimantan Timur",
        "Kalimantan Utara",
        "Sulawesi Utara",
        "Gorontalo",
        "Sulawesi Tengah",
        "Sulawesi Barat",
        "Sulawesi Selatan",
        "Sulawesi Tenggara",
        "Maluku",
        "Maluku Utara",
        "Papua",
        "Papua Tengah",
        "Papua Pegunungan",
        "Papua Selatan",
        "Papua Barat",
        "Papua Barat Daya"
    ];

    const [showAll, setShowAll] = useState(false);

    const visibleLocations = showAll ? locations : locations.slice(0, 14);
    return (
        <aside className="w-full">
            {/* Location Filter */}
            <div className="mb-3">
                <h3 className="font-semibold text-[#555555] text-[14px] mb-3" style={{ letterSpacing: "-0.04em" }}>
                    Lokasi
                </h3>
                {visibleLocations.map(loc => (
                    <FilterCheckbox key={loc} id={`loc-${loc}`} label={loc} />
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
                <h3 className="font-semibold text-[#555555] text-[14px] mb-3" style={{ letterSpacing: "-0.04em" }}>Metode Pembayaran</h3>
                <FilterCheckbox id="payment-cod" label="COD (Bayar di Tempat)" />
                <FilterCheckbox id="payment-transfer" label="Transfer" />
            </div>
            <div className='h-1 w-full border-t border-gray-400 mb-3' />
            <div>
                <h3 className="font-semibold text-[#555555] text-[14px] mb-3" style={{ letterSpacing: "-0.04em" }}>Kondisi Barang</h3>
                <FilterCheckbox id="condition-new" label="Baru" />
                <FilterCheckbox id="condition-used" label="Bekas di Pakai" />
            </div>
        </aside>
    );
};

const ProductCard = ({ product }: { product: Product }) => {
    const router = useRouter()
    return (
        <div key={product.id}
            className="bg-white cursor-pointer w-full h-full overflow-hidden group lg:w-[190px] lg:h-[342px] border border-[#DDDDDD]"
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
            <div className='absolute p-2 flex flex-col space-y-1'>
                <button className='bg-[#F7C800] rounded-[5px] p-1 text-[10px] font-semibold text-black' style={{
                    letterSpacing: "-0.04em"
                }}>
                    Gratis Ongkir
                </button>
                <button className='bg-[#3EA65A] rounded-[5px] p-1 text-[10px] text-white font-semibold' style={{
                    letterSpacing: "-0.04em"
                }}>
                    Voucher Toko
                </button>
            </div>
            <img src={product.image} alt={product.name} className="md:w-[190px] md:h-[190px] " onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=Produk'; }} />
            <div className="p-2 ">
                <p
                    className="text-[12px] md:text-[14px] w-full text-dark line-clamp-2 h-8.5 text-[#111111]"
                    style={{ lineHeight: '17px' }}
                >
                    {product.name}
                </p>

                <p className="text-[14px] md:text-[16px] font-semibold mt-1 text-[#CD0030]">{formatRupiah(product.price)}</p>
                <div className='flex justify-left items-center mt-1 gap-2'>
                    {product.is_cod_enabled ? <div className="mt-1 w-[48px] h-[24px] bg-[#F77000] flex justify-center items-center rounded-[10px]">
                        <p className="text-[12px] text-white font-bold">
                            COD
                        </p>
                    </div> : ''}
                    <div className="mt-1 w-[48px] h-[24px] bg-[#DE4A53] flex justify-center items-center rounded-[10px]">
                        <p className="text-[12px] text-white font-bold">
                            -31%
                        </p>
                    </div>
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-1"
                    style={{
                        letterSpacing: "-0.04em",
                        lineHeight: "22px"
                    }}>
                    <StarIcon className="w-5 h-5 text-yellow-400" />
                    <span className='text-[12px] font-semibold text-[#555555]'>{product.rating || 4.9}</span> <span className='ml-2 text-[12px] mt-[-1px] text-[#555555]'>{product.sold || " 1000"}+ terjual</span>
                </div>
                <p className="text-[12px] text-[#333333] ">Kota Makassar</p>
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
    const [loading, setLoading] = useState<boolean>(false);
    const getProduct = async () => {
        setLoading(true);
        const res = await Get<Response>('zukses', `product`);
        if (res?.status === 'success' && Array.isArray(res.data)) {
            const data = res?.data as Product[];
            setProducts(data);
        } else {
            console.warn('Produk tidak ditemukan atau gagal diambil');

        }
        setLoading(false);
    };

    useEffect(() => {
        getProduct();
    }, []);
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
                            <FilterSidebar />
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
