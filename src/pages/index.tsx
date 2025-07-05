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
interface Banner {
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
  ];
  const categoryData = [
    { name: "Pc & Laptop", icon: "/icon/categories/laptop_utama.png" },
    { name: "Handphone", icon: "/icon/categories/mobile.png" },
    { name: "Jam Tangan", icon: "/icon/categories/smartwatch_7176529.png" },
    { name: "Pakaian Pria", icon: "/icon/categories/pakaian2.png" },
    { name: "Sepatu", icon: "/icon/categories/sepatu1.png" },
    { name: "Perlengkapan Rumah", icon: "/icon/categories/perabot.png" },
    { name: "Tas Wanita", icon: "/icon/categories/bag_9442444.png" },
    { name: "Elektronik", icon: "/icon/categories/electronic.png" },
    { name: "Mainan Anak", icon: "/icon/categories/mainan_anak.png" },
  ];


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
      <div className='lg:px-0'>
        <main className="md:mx-auto w-[1200px] px-[0px]">
          <SlidingBanner banners={sampleBanners} autoPlayInterval={3000} />
        </main>
        <div className='md:hidden'>
          <UserGreeting isLoggedIn={isLoggedIn} userName={user ? user?.name : ''} />
        </div>
        <main className='md:mx-auto  w-[1200px] px-[0px]'>
          <CategoryGrid categories={categoryData} onCategorySelect={setSelectedCategory} />
        </main>
        <main className="container mx-auto pb-24 md: w-[1200px] px-[0px]">
          {
            products &&
            <ProductList products={products} selectedCategory={selectedCategory} />
          }
        </main>
      </div>
      <div className='border-t border-gray-200'>
        <main className="container mx-auto w-[1200px] px-[0px]">
          <SiteFooter />
        </main>
        <div className="border-t border-gray-200 py-4 mt-8">
          <p className="text-center text-xs text-dark-500 font-bold">
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
