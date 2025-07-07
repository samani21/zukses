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
    { id: 4, src: '/image/3 1.svg', alt: 'Banner 4' },
    { id: 5, src: '/image/3 2.svg', alt: 'Banner 5' },
    { id: 6, src: '/image/3 3.svg', alt: 'Banner 6' },
  ];
  const categoryData = [
    { name: "Pc & Laptop", icon: "/icon/categories/laptop_utama 2.svg" },
    { name: "Handphone", icon: "/icon/categories/mobile 2.svg" },
    { name: "Jam Tangan", icon: "/icon/categories/watch_690411 1.svg" },
    { name: "Pakaian Pria", icon: "/icon/categories/pakaian2 2.svg" },
    { name: "Sepatu", icon: "/icon/categories/sepatu1 1.svg" },
    { name: "Perlengkapan Rumah", icon: "/icon/categories/machine_14852593 1.svg" },
    { name: "Elektronik", icon: "/icon/categories/electronic 2.svg" },
    { name: "Mainan Anak", icon: "/icon/categories/mainan_anak 3.svg" },
    { name: "Tas Wanita", icon: "/icon/categories/bag_9442444 1.svg" },
    { name: "Makanan & Minuman", icon: "/icon/categories/fast-food_2819194 1.svg" },
    { name: "Motor", icon: "/icon/categories/motorcycle_1804617 1.svg" },
    { name: "Buku", icon: "/icon/categories/book 1.svg" },
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
