import React from 'react'
import ProductDetail from '../../components/product/ProductDetail';
import Header from 'components/Header';
import SellerInfo from 'components/product/SellerInfo';
import ProductSpecification from 'components/product/ProductSpecification';
import ProductDescription from 'components/product/ProductDescription';



interface Thumbnail {
    id: number;
    url: string;
    alt: string;
}

interface Variant {
    id: number;
    name: string;
    imageUrl: string;
}

interface Seller {
    name: string;
    avatarUrl: string;
    lastActive: string;
    location: string;
    stats: {
        rating: number;
        reviewsCount: number;
        reviews: string;
        products: number;
        chatResponseRate: string;
        chatResponseTime: string;
        joined: string;
        followers: string;
    };
}


interface Specification {
    [key: string]: string | string[];
}

interface Description {
    intro: string;
    condition: string[];
    completeness: string[];
    notes: string[];
}

interface Product {
    id: string;
    name: string;
    rating: number;
    reviewsCount: number;
    soldCount: number;
    originalPrice: number;
    discountedPrice: number;
    vouchers: string[];
    variants: Variant[];
    thumbnails: Thumbnail[];
    seller: Seller;
    specifications: Specification;
    description: Description;
}


const ProductPage = () => {
    const sampleProduct: Product = {
        id: 'LP-TPX-270',
        name: 'LAPTOP LENOVO THINKPAD X240 X250 X260 X270 X280 CORE i3 / i5 / i7 ORIGINAL MURAH BERGARANSI',
        rating: 5.0,
        reviewsCount: 12,
        soldCount: 25,
        originalPrice: 2230000,
        discountedPrice: 2210000,
        vouchers: ['Diskon Rp10RB', 'Diskon Rp20RB', 'Cashback 5%'],
        variants: [
            { id: 1, name: 'X260 I3 GEN 6', imageUrl: '/image/L1.webp' },
            { id: 2, name: 'X240 I5 GEN 4', imageUrl: '/image/L2.webp' },
            { id: 3, name: 'X270 I5 GEN 6', imageUrl: '/image/L3.webp' },
            { id: 4, name: 'I5 GEN 7', imageUrl: '/image/L4.webp' },
            { id: 5, name: 'X250 I7 GEN 5', imageUrl: '/image/L5.webp' },
            { id: 6, name: 'B-SSD 256GB', imageUrl: '/image/L6.webp' },
            { id: 7, name: 'X250 I3 GEN 5', imageUrl: '/image/L7.webp' },
        ],
        thumbnails: [

        ],
        seller: {
            name: 'ajkomputer',
            avatarUrl: 'https://placehold.co/80x80/e0e0e0/333333?text=AJK',
            lastActive: '28 Menit Lalu',
            location: 'Banjarmasin',
            stats: {
                reviews: '1,1RB',
                rating: 5,
                reviewsCount: 300,
                products: 93,
                chatResponseRate: '98%',
                chatResponseTime: 'hitungan jam',
                joined: '8 tahun lalu',
                followers: '5,4RB'
            }
        },
        specifications: {
            'Kategori': ['Shopee', 'Komputer & Aksesoris', 'Laptop', '2-in-1'],
            'Kondisi': 'Bekas',
            'Merek': 'Lenovo',
            'Ukuran Layar Laptop': '< 13 inci',
            'Tipe Laptop': '2-in-1, Gaming, Lainnya, Ultrabook',
            'Masa Garansi': '1 Bulan',
            'Jenis Garansi': 'Garansi Supplier',
            'No. Sertifikat (POSTEL)': '-',
            'Dikirim Dari': 'KOTA TANGERANG',
        },
        description: {
            intro: 'Mohon dibaca keterangan di bawah sebelum order, untuk lebih detail bisa cek gambar:',
            condition: [
                'Laptop yang dijual 100% original (bukan servisan, bukan refurbish)',
                'Mesin 100% Normal',
                'Fisik/Body ±90% (Ada baret bekas pemakaian wajar, harap dipahami ini laptop second, jangan ekspektasi seperti baru)',
                'Processor: GOOD',
                'Ram: GOOD',
                'Hardisk / SSD: GOOD',
                'Layar: GOOD',
                'Baterai: GOOD',
                'Fan / Kipas: GOOD',
                'Webcam: GOOD',
                'Wifi: GOOD',
                'Keyboard: GOOD',
                'Touchpad: GOOD',
                'USB Port dan Port-Port yang lain: GOOD',
            ],
            completeness: [
                'Unit laptop',
                'Charger',
                'Free Tas',
                'Terinstall OS Windows 10 Pro 64 Bit',
                'Terinstall aplikasi untuk penggunaan kantor/sekolah/ pribadi (Office, Pdf, Chrome, Mozilla, dll)',
                'Paket dipacking dengan kardus tebal dan bubble tebal dijamin aman (Free packing)',
            ],
            notes: [
                'Harap ditanyakan dulu tipe spesifikasi Laptop yang ingin diorder, kesalahan pembeli dalam memilih tipe bukan tanggung jawab kami',
                'Bagi yang sudah tahu dengan tipe Laptop yang mau diorder, silakan langsung diorder karena stok ready selagi iklan masih tayang',
                'Silakan pilih Varian Tipe, Ram, Ssd yang mau diorder',
                'Belilah barang sesuai kebutuhan',
            ]
        }
    };
    return (
        <div>
            <main className="bg-white-100 min-h-screen">
                <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
       `}</style>
                <div className='hidden md:block'>
                    <Header />
                </div>
                <div className="container mx-auto p-2 sm:p-4 md:px-20">
                    <nav className="hidden md:block text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
                        <ol className="list-none p-0 inline-flex space-x-2">
                            <li className="flex items-center"><a href="#" className="text-blue-600 hover:underline" onClick={() => window.location.href = '/'}>Zuksess</a></li>
                            <li className="flex items-center"><span className="mx-2">›</span><a href="#" className="hover:underline">Komputer & Aksesoris</a></li>
                            <li className="flex items-center"><span className="mx-2">›</span><span className="text-gray-700">LAPTOP LENOVO THINKPAD</span></li>
                        </ol>
                    </nav>

                    <ProductDetail product={sampleProduct} />
                    <SellerInfo seller={sampleProduct.seller} />
                    <ProductSpecification specifications={sampleProduct.specifications} />

                    <ProductDescription description={sampleProduct.description} />
                </div>
            </main>
        </div>
    );
};


export default ProductPage