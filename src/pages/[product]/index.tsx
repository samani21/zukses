import React, { useEffect, useRef, useState } from 'react'
import ProductDetail from '../../components/product/ProductDetail';
import Header from 'components/Header';
import { Product } from 'components/types/Product';
import { ArrowLeft, Search, Share2 } from 'lucide-react';
import Get from 'services/api/Get';
import { Response } from 'services/api/types';

import Loading from 'components/Loading';
import OtherProduct from 'components/OtherProduct';
import ProductWithCategories from 'components/ProductWithCategories';
import VariantModal from 'components/product/VariantModal';
import { useRouter } from 'next/router';
import ProductReviewsPage from 'components/product/Comment';
import ModalGuide from 'components/product/ModalGuide';
import InfoZukses from 'components/InfoZukses';
import Payment from 'components/Payment';
import Delivery from 'components/Delivery';
import CategoryFooter from 'components/CategoryFooter';
import ModalChat from 'components/product/ModalChat';



const ProductPage = () => {
    const [otherProducts, setOtherProducts] = useState<Product[] | null>(null);
    const [productsWithCategorie, setProductsWithCategorie] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [detailProduct, setDetailProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [openModalGuide, setOpenModalGuide] = useState<boolean>(false);
    const router = useRouter();
    const [isSticky, setIsSticky] = useState(false);
    const titleRef = useRef<HTMLHeadingElement>(null);

    const [isChatModalOpen, setChatModalOpen] = useState<boolean>(false)
    useEffect(() => {
        const handleScroll = () => {
            if (!titleRef.current) return;
            const { top } = titleRef.current.getBoundingClientRect();
            setIsSticky(top <= 64); // asumsi header tingginya 64px
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    useEffect(() => {
        const dataString = localStorage.getItem('product');
        if (dataString) {
            const parsedData = JSON.parse(dataString);
            setDetailProduct(parsedData)
        }
    }, [])
    const getOtherProduct = async () => {
        const res = await Get<Response>('zukses', `product?seller_id=${detailProduct?.seller_id}`);
        if (res?.status === 'success' && Array.isArray(res.data)) {
            const data = res?.data as Product[];
            setOtherProducts(data);
        } else {
            console.warn('Produk tidak ditemukan atau gagal diambil');

        }
    };
    const getProductIsCategorie = async () => {
        const res = await Get<Response>('zukses', `product?categorie_id=${detailProduct?.category_id}`);
        if (res?.status === 'success' && Array.isArray(res.data)) {
            const data = res?.data as Product[];
            setProductsWithCategorie(data);
        } else {
            console.warn('Produk tidak ditemukan atau gagal diambil');

        }
    };

    interface Payments {
        id: number;
        src: string;
        alt: string;
    }
    interface Deliverys {
        id: number;
        src: string;
        alt: string;
    }

    const samplePayment: Payments[] = [
        { id: 1, src: '/icon/payment/bri 1.svg', alt: 'BRI' },
        { id: 2, src: '/icon/payment/bni 1.svg', alt: 'BNI' },
        { id: 3, src: '/icon/payment/bca 1.svg', alt: 'BCA' },
        { id: 4, src: '/icon/payment/mandiri 1.svg', alt: 'Mandiri' },
        { id: 5, src: '/icon/payment/linkaja 1.svg', alt: 'Link Aja' },
        { id: 6, src: '/icon/payment/qris 1.svg', alt: 'Qris' },
        { id: 7, src: '/icon/payment/bsi 1.svg', alt: 'BSI' },
        { id: 8, src: '/icon/payment/permata 1.svg', alt: 'Permata Bank' },
        { id: 9, src: '/icon/payment/dana 1.svg', alt: 'Dana' },
        { id: 10, src: '/icon/payment/ovo 1.svg', alt: 'Ovo' },
        { id: 11, src: '/icon/payment/shopeepay 1.svg', alt: 'Shopee Pay' },
        { id: 12, src: '/icon/payment/maybank 1.svg', alt: 'My Bank' },
        { id: 13, src: '/icon/payment/danamon 1.svg', alt: 'Danamon' },
    ];
    const sampleDeliverys: Deliverys[] = [
        { id: 1, src: '/icon/delivery/sicepat 1.svg', alt: 'SICEPAT' },
        { id: 2, src: '/icon/delivery/posaja 1.svg', alt: 'POSAJA' },
        { id: 3, src: '/icon/delivery/jnt 1.svg', alt: 'JNT' },
        { id: 4, src: '/icon/delivery/jne 1.svg', alt: 'JNE' },
        { id: 5, src: '/icon/delivery/gosend 1.svg', alt: 'Gosend' },
        { id: 6, src: '/icon/delivery/anteraja 1.svg', alt: 'Anteraja' },
    ];

    useEffect(() => {
        setLoading(true);
        getOtherProduct();
        getProductIsCategorie();
        setLoading(false);
    }, [detailProduct]);
    return (
        <div>
            <main className=" min-h-screen">

                <div className='hidden md:block'>
                    <Header />
                </div>
                {isSticky && detailProduct && (
                    <div className="fixed top-0 left-0 w-full z-40 bg-white px-4 py-2 shadow-sm flex items-center justify-center ">
                        <div className='w-[1200px] flex items-center justify-between gap-2'>
                            <h1 className="text-[14px] font-[700] text-[#333333] tracking-[-0.02em] truncate ">
                                {detailProduct.name}
                            </h1>
                        </div>
                    </div>
                )}
                <div className='h-[50px] flex md:hidden items-center px-4 justify-between'>
                    <div
                        onClick={() => {
                            router.push('/')
                            localStorage.removeItem('product')
                        }}
                        className=""
                    >
                        <ArrowLeft />
                    </div>
                    <div className='flex items-center justify-center w-1/3 gap-3'>
                        <Search className='w-[20px] h-[20px]' />
                        <Share2 className='w-[20px] h-[20px]' />
                        <div className="relative inline-block">
                            <button className="p-1">
                                <img src='/icon/shopping-cart.svg' className='w-[20px] h-[20px]' />
                            </button>
                            <span className="absolute -top-1 -right-3 -mt-0 mr-0 flex h-4 w-4 items-center justify-center text-[10px] bg-red-500 rounded-[5px] text-white px-3">123</span>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto md:p-2 md:p-4 md:px-0 w-[1200px] px-[0px]">
                    {/* <nav
                        className="hidden md:block text-sm text-gray-500 mb-4"
                        aria-label="Breadcrumb"
                    >
                        <ol className="list-none p-0 inline-flex space-x-2 text-[12px] text-[#555555] max-w-full overflow-hidden tracking-[-0.03em]">
                            <li className="flex items-center max-w-[150px]  ">
                                <a
                                    href="#"
                                    className="hover:underline  text-[#1073F7]"
                                    onClick={() => (router.push('/'))}
                                >
                                    Zuksess
                                </a>
                            </li>
                            {detailProduct?.category?.split(' > ').map((cat, index) => (
                                <li
                                    key={index}
                                    className="flex items-center max-w-[150px]  text-[#1073F7]"
                                >
                                    <span className="mx-2 text-[20px] text-[#888888] mr-4">›</span>
                                    <a href="#" className="hover:underline truncate block">
                                        {cat}
                                    </a>
                                </li>
                            ))}
                            <li className="flex items-center  truncate">
                                <span className="mx-2 text-[20px] text-[#888888] mr-4">›</span>
                                <span className="truncate block">{detailProduct?.name}</span>
                            </li>
                        </ol>
                    </nav> */}
                    {
                        detailProduct &&
                        <div className='space-y-6'>
                            <ProductDetail
                                product={detailProduct}
                                openModalGuide={openModalGuide}
                                setOpenModalGuide={setOpenModalGuide}
                                titleRef={titleRef}
                                setChatModalOpen={setChatModalOpen} />
                            {/* <div className='hidden md:block'>
                                <SellerInfo seller={detailProduct?.seller} />
                            </div> */}
                            {/* <div className='hidden'>
                                <ProductSpecification specifications={detailProduct.specifications} />
                            </div>
                           */}
                            <div className='hidden md:block'>
                                <ProductReviewsPage />
                            </div>
                            {
                                otherProducts &&
                                <OtherProduct products={otherProducts} idProduct={detailProduct?.id} />
                            }
                            {
                                productsWithCategorie &&
                                <ProductWithCategories products={productsWithCategorie} idProduct={detailProduct?.id} />
                            }
                        </div>
                    }
                </div>
            </main>
            {
                loading && <Loading />
            }
            <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white shadow p-2 flex items-center space-x-2 z-20 text-sm px-4" style={{
                letterSpacing: "-0.04em"
            }}>
                <button className="h-[40px] rounded-[10px] bg-[#ffffff] text-[#444444]  border border-[#CFCFCF] font-bold text-[14px]  w-1/4">
                    Chat
                </button>
                <button className="h-[40px] rounded-[10px] bg-[#ffffff] text-[#444444] border border-[#CFCFCF]  font-bold text-[14px]  w-1/2" onClick={() => setIsModalOpen(true)}>
                    + Keranjang
                </button>
                <button className="h-[40px] rounded-[10px] bg-[#DE4A53] text-white text-[14px]  font-bold  w-1/2" onClick={() => setIsModalOpen(true)}>
                    Beli Langsung
                </button>
                {/* <button className="flex-1 py-2 px-3 rounded-md text-blue-600 border border-blue-600 hover:bg-blue-50 font-medium">Beli</button>
                <button className="flex-1 py-2 px-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium">+ Keranjang</button> */}
            </div>
            {
                isModalOpen && detailProduct &&
                <VariantModal product={detailProduct} setIsModalOpen={setIsModalOpen} />
            }
            {
                openModalGuide &&
                <ModalGuide setOpenModalGuide={setOpenModalGuide} openModalGuide={openModalGuide} detailProduct={detailProduct} />
            }
            <div className='hidden md:block border-t border-[#dddddd]  bg-white'>
                <div className='border-b border-[#dddddd] py-4'>
                    <div className='container mx-auto flex justify-between itmes-center lg:w-[1200px] '>
                        <InfoZukses />
                    </div>
                </div>
                <div className='py-4'>
                    <div className='container mx-auto flex justify-between itmes-center lg:w-[1200px] '>
                        <div>
                            <Payment samplePayment={samplePayment} />
                        </div>
                        <div>
                            <Delivery sampleDeliverys={sampleDeliverys} />
                        </div>
                    </div>
                </div>
                <div className='py-4 bg-[#C4EDDD]'>
                    <main className="container mx-auto md:px-4 lg:w-[1200px] lg:px-[0px] bg-[#C4EDDD]">
                        <CategoryFooter />
                    </main>

                </div>
                <div className=" py-4 bg-[#0D915E] text-white">
                    <p className="text-center text-[15px] font-semibold" style={{
                        lineHeight: "22px",
                        letterSpacing: "-0.04em"
                    }}>
                        @2025, PT. Zukses Digital Indonesia. All Rights Reserved.
                    </p>
                </div>
            </div>
            <ModalChat isOpen={isChatModalOpen} onClose={() => setChatModalOpen(false)} />
        </div>
    );
};


export default ProductPage