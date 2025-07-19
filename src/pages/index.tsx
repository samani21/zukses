import React, { ReactNode, useEffect, useState } from 'react';
import MainLayout from './layouts/MainLayout';
import SlidingBanner from 'components/SlidingBanner';
import CategoryGrid from 'components/CategoryGrid';
import UserGreeting from 'components/UserGreeting';
import { getUserInfo } from 'services/api/redux/action/AuthAction';
import ProductList from 'components/ProductList';
import SiteFooter from 'components/SiteFooter';
import Get from 'services/api/Get';
import { Response } from 'services/api/types';
import { Product } from 'components/types/Product';
import Loading from 'components/my-store/addProduct/Loading';
import Payment from 'components/Payment';
import Delivery from 'components/Delivery';
import Welcome from 'components/Welcome';
interface Banner {
  id: number;
  src: string;
  alt: string;
}
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
interface HomeLayoutProps {
  children?: ReactNode;
  mode?: 'user-profile';
  navbarOn?: boolean;
}

const Home: React.FC<HomeLayoutProps> = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ whatsapp?: string, id?: string, email?: string, role?: string, name?: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!token && !!user);

    const fetchedUser = getUserInfo();
    setUser(fetchedUser);
  }, []);

  const sampleBanners: Banner[] = [
    { id: 1, src: '/image/banner1.webp', alt: 'Banner 1' },
    { id: 2, src: '/image/banner2.jpg', alt: 'Banner 2' },
    { id: 3, src: '/image/banner3.jpg', alt: 'Banner 3' },
    { id: 6, src: '/image/3 3.svg', alt: 'Banner 6' },
    { id: 4, src: '/image/3 1.svg', alt: 'Banner 4' },
    { id: 5, src: '/image/3 2.svg', alt: 'Banner 5' },
  ];

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
  const categoryData = [
    { name: "Pc & Laptop", icon: "/icon/categories/laptop_utama.svg" },
    { name: "Handphone", icon: "/icon/categories/hp.svg" },
    { name: "Elektronik", icon: "/icon/categories/elektronik.svg" },
    { name: "Pakaian", icon: "/icon/categories/pakaian.svg" },
    { name: "Sepatu", icon: "/icon/categories/sepatu.svg" },
    { name: "Perlengkapan Rumah", icon: "/icon/categories/peralatan.svg" },
    { name: "Jam Tangan", icon: "/icon/categories/jam_tangan.svg" },
    { name: "Makanan & Minuman", icon: "/icon/categories/makanan.svg" },
    { name: "Mainan Anak", icon: "/icon/categories/mainan_anak 3.svg" },
    { name: "Tas Wanita", icon: "/icon/categories/bag_9442444 1.svg" },
    { name: "Motor", icon: "/icon/categories/motorcycle_1804617 1.svg" },
    { name: "Buku", icon: "/icon/categories/book 1.svg" },
  ];


  // const categoryData = [
  //   { name: "Elektronik", icon: "/icon/Elektronik.png" },
  //   { name: "Komputer & Aksesoris", icon: "/icon/komputer.png" },
  //   { name: "Handphone & Aksesoris", icon: "/icon/Handphone.png" },
  //   { name: "Pakaian Pria", icon: "/icon/pakaian_pria.png" },
  //   { name: "Sepatu Pria", icon: "/icon/shoes.png" },
  //   { name: "Tas Pria", icon: "/icon/tas_pria.png" },
  //   { name: "Aksesoris Fashion", icon: "/icon/" },
  //   { name: "Jam Tangan", icon: "/icon/jam_tangan.png" },
  //   { name: "Kesehatan", icon: "/icon/health.png" },
  //   { name: "Hobi & Koleksi", icon: "/icon/" },
  //   { name: "Makanan & Minuman", icon: "/icon/Makanan.png" },
  //   { name: "Perawatan & Kecantikan", icon: "/icon/" },
  //   { name: "Perlengkapan Rumah", icon: "/icon/rumah.png" },
  //   { name: "Pakaian Wanita", icon: "/icon/" },
  //   { name: "Fashion Muslim", icon: "/icon/moslem.png" },
  //   { name: "Fashion Bayi & Anak", icon: "/icon/fashion_bayi.png" },
  //   { name: "Ibu & Bayi", icon: "/icon/ibudanbayi.png" },
  //   { name: "Sepatu Wanita", icon: "/icon/shoes2.png" },
  //   { name: "Tas Wanita", icon: "/icon/tas_wanita.png" },
  //   { name: "Otomotif", icon: "/icon/otomotif.png" }
  // ];

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
    localStorage.removeItem('product')
    localStorage.removeItem('EditProduct')
    getProduct();
  }, []);
  return (
    <MainLayout>
      <div className='md:block md:px-4  lg:px-0'>
        <main className="hidden md:block md:mx-auto lg:w-[1200px] px-[0px]">
          <SlidingBanner banners={sampleBanners} autoPlayInterval={3000} />
        </main>
        <main className="hidden md:block md:mx-auto lg:w-[1200px] px-[0px] mt-[28px]">
          <Welcome />
        </main>
        <div className='hidden'>
          <UserGreeting isLoggedIn={isLoggedIn} userName={user ? user?.name : ''} />
        </div>
        <main className='md:mx-auto px-[0px] lg:w-[1200px] mt-[28px]'>
          <CategoryGrid categories={categoryData} onCategorySelect={setSelectedCategory} />
        </main>
        <main className="container mx-auto pb-24 lg:w-[1200px] md:px-[0px] mt-[24px]">
          {
            products &&
            <ProductList products={products} selectedCategory={selectedCategory} />
          }
        </main>
      </div>
      <div className='hidden md:block border-t border-[#BBBBBB]  bg-white'>
        <div className='border-b border-[#BBBBBB]  py-10'>
          <div className='container mx-auto flex justify-between itmes-center lg:w-[1200px] px-4 '>
            <div>
              <Payment samplePayment={samplePayment} />
            </div>
            <div>
              <Delivery sampleDeliverys={sampleDeliverys} />
            </div>
          </div>
        </div>
        <main className="container mx-auto md:px-4 lg:w-[1200px] lg:px-[0px]">
          <SiteFooter />
        </main>
        <div className="border-t border-[#BBBBBB] py-4 mt-8">
          <p className="text-center text-[15px] text-dark-500 font-semibold">
            @2025, PT. Zukses Digital Indonesia. All Rights Reserved.
          </p>
        </div>
      </div>
      {
        loading && <Loading />
      }
    </MainLayout>
  );
};

export default Home;
