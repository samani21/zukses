import React, { useEffect, useState } from 'react'
import ProductDetail from '../../components/product/ProductDetail';
import Header from 'components/Header';
import SellerInfo from 'components/product/SellerInfo';
import ProductSpecification from 'components/product/ProductSpecification';
import ProductDescription from 'components/product/ProductDescription';
import ProductReviews from 'components/product/ProductReviews';
import { Product } from 'components/types/Product';
import { ArrowLeft, Search, Share2 } from 'lucide-react';



const ProductPage = () => {

    const [detailProduct, setDetailProduct] = useState<Product | null>(null);
    useEffect(() => {
        const dataString = localStorage.getItem('product');
        if (dataString) {
            const parsedData = JSON.parse(dataString);
            setDetailProduct(parsedData)
        }
    }, [])
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
                <div className='h-[50px] flex md:hidden items-center px-4 justify-between'>
                    <div
                        onClick={() => {
                            window.location.href = '/'
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
                    <nav className="hidden md:block text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
                        <ol className="list-none p-0 inline-flex space-x-2 text-[16px] text-[#555555]">
                            <li className="flex items-center"><a href="#" className="hover:underline" onClick={() => window.location.href = '/'}>Zuksess</a></li>
                            <li className="flex items-center"><span className="mx-2">›</span><a href="#" className="hover:underline">{detailProduct?.category?.split(" > ")[0]}</a></li>
                            <li className="flex items-center"><span className="mx-2">›</span>{detailProduct?.name}</li>
                        </ol>
                    </nav>

                    {
                        detailProduct &&
                        <div className='space-y-4'>
                            <ProductDetail product={detailProduct} />
                            <div className='hidden md:block'>
                                <SellerInfo seller={detailProduct?.seller} />
                            </div>
                            <div className='hidden'>
                                <ProductSpecification specifications={detailProduct.specifications} />
                            </div>
                            <ProductDescription description={detailProduct.desc} />
                            <div className='hidden md:block'>
                                <ProductReviews reviews={detailProduct.reviews} productRating={detailProduct.rating} />
                            </div>
                        </div>
                    }
                </div>
            </main>
        </div>
    );
};


export default ProductPage