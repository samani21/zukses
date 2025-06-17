import { useRouter } from 'next/router';
import MainLayout from 'pages/layouts/MainLayout';
import React from 'react'
import ProductDetail from './Components/ProductDetail';
import Header from 'components/Header';



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

interface ProductDetailProps {
    product: Product;
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
}


const ProductPage = () => {
    const router = useRouter();
    const { product } = router.query;
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
                </div>
            </main>
        </div>
    );
};


export default ProductPage