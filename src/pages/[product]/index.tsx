import React, { useEffect, useState } from 'react'
import ProductDetail from '../../components/product/ProductDetail';
import Header from 'components/Header';
import SellerInfo from 'components/product/SellerInfo';
import ProductSpecification from 'components/product/ProductSpecification';
import ProductDescription from 'components/product/ProductDescription';
import ProductReviews from 'components/product/ProductReviews';
import { Product } from 'components/types/Product';



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
                <div className="container mx-auto p-2 sm:p-4 md:px-0 w-[1200px] px-[0px]">
                    <nav className="hidden md:block text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
                        <ol className="list-none p-0 inline-flex space-x-2">
                            <li className="flex items-center"><a href="#" className="text-blue-600 hover:underline" onClick={() => window.location.href = '/'}>Zuksess</a></li>
                            <li className="flex items-center"><span className="mx-2">›</span><a href="#" className="hover:underline">{detailProduct?.category?.split(" > ")[0]}</a></li>
                            <li className="flex items-center"><span className="mx-2">›</span><span className="text-gray-700">{detailProduct?.name}</span></li>
                        </ol>
                    </nav>

                    {
                        detailProduct &&
                        <>
                            <ProductDetail product={detailProduct} />
                            <SellerInfo seller={detailProduct?.seller} />
                            <ProductSpecification specifications={detailProduct.specifications} />
                            <ProductDescription description={detailProduct.desc} />

                            <ProductReviews reviews={detailProduct.reviews} productRating={detailProduct.rating} />
                        </>
                    }
                </div>
            </main>
        </div>
    );
};


export default ProductPage