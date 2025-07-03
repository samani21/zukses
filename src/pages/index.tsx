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
    { name: "Elektronik", icon: "/icon/Elektronik.png" },
    { name: "Komputer & Aksesoris", icon: "/icon/komputer.png" },
    { name: "Handphone & Aksesoris", icon: "/icon/Handphone.png" },
    { name: "Pakaian Pria", icon: "/icon/pakaian_pria.png" },
    { name: "Sepatu Pria", icon: "/icon/shoes.png" },
    { name: "Tas Pria", icon: "/icon/tas_pria.png" },
    { name: "Aksesoris Fashion", icon: "/icon/" },
    { name: "Jam Tangan", icon: "/icon/jam_tangan.png" },
    { name: "Kesehatan", icon: "/icon/health.png" },
    { name: "Hobi & Koleksi", icon: "/icon/" },
    { name: "Makanan & Minuman", icon: "/icon/Makanan.png" },
    { name: "Perawatan & Kecantikan", icon: "/icon/" },
    { name: "Perlengkapan Rumah", icon: "/icon/rumah.png" },
    { name: "Pakaian Wanita", icon: "/icon/" },
    { name: "Fashion Muslim", icon: "/icon/moslem.png" },
    { name: "Fashion Bayi & Anak", icon: "/icon/fashion_bayi.png" },
    { name: "Ibu & Bayi", icon: "/icon/ibudanbayi.png" },
    { name: "Sepatu Wanita", icon: "/icon/shoes2.png" },
    { name: "Tas Wanita", icon: "/icon/tas_wanita.png" },
    { name: "Otomotif", icon: "/icon/otomotif.png" }
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
      <div className='lg:px-10'>
        <main className="md:px-20 mx-auto">
          <SlidingBanner banners={sampleBanners} autoPlayInterval={3000} />
        </main>
        <div className='md:hidden'>
          <UserGreeting isLoggedIn={isLoggedIn} userName={user ? user?.name : ''} />
        </div>
        <main className='md:px-15'>
          <CategoryGrid categories={categoryData} onCategorySelect={setSelectedCategory} />
        </main>
        <main className="container mx-auto pb-24 md:px-10">
          {
            products &&
            <ProductList products={products} selectedCategory={selectedCategory} />
          }
        </main>
      </div>
      <main className="container mx-auto">
        <SiteFooter />
      </main>
      {
        loading && <Loading />
      }
    </MainLayout>
  );
};

export default Home;
