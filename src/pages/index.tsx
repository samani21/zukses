import React, { ReactNode, useEffect, useState } from 'react';
import MainLayout from './layouts/MainLayout';
import SlidingBanner from 'components/SlidingBanner';
import CategoryGrid from 'components/CategoryGrid';
import UserGreeting from 'components/UserGreeting';
import { getUserInfo } from 'services/api/redux/action/AuthAction';
import ProductList from 'components/ProductList';
import Get from 'services/api/Get';
import { Response } from 'services/api/types';
import { Product } from 'components/types/Product';
import Loading from 'components/my-store/addProduct/Loading';
import { useRouter } from 'next/router';
import NewProduct from 'components/NewProduct';
import ProductPromo from 'components/ProductPromo';
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
  const router = useRouter();
  const { query, isReady } = router;

  useEffect(() => {
    if (!isReady) return;

    if (query.token) {
      const email = query.email as string;
      const name = query.name as string;
      const username = query.username as string;
      const whatsapp = query.whatsapp as string;
      const image = query.image as string;
      const is_active = parseInt(query.is_active as string);
      const role = query.role as string;
      const id = parseInt(query.id as string);
      const token = query.token as string;

      const data = {
        name,
        username,
        email,
        role,
        id,
        whatsapp,
        is_active,
        image
      };

      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', token ?? '');

      // Optional redirect to clean URL
      router.replace('/', undefined, { shallow: true }).then(() => {
        window.location.reload(); // ⬅️ ini yang bikin halaman refresh
      });
    }
  }, [isReady, query, router]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!token && !!user);

    const fetchedUser = getUserInfo();
    setUser(fetchedUser);
  }, []);
  const sampleBanners: Banner[] = [
    // { id: 1, src: '/image/banner1.webp', alt: 'Banner 1' },
    // { id: 2, src: '/image/banner2.jpg', alt: 'Banner 2' },
    // { id: 3, src: '/image/banner3.jpg', alt: 'Banner 3' },
    { id: 6, src: '/image/3 3.svg', alt: 'Banner 6' },
    { id: 4, src: '/image/3 1.svg', alt: 'Banner 4' },
    { id: 5, src: '/image/3 2.svg', alt: 'Banner 5' },
  ];
  const categoryData = [
    { name: "Pc & Laptop", icon: "/icon/categories/laptop_utama.svg" },
    { name: "Handphone", icon: "/icon/categories/hp.svg" },
    { name: "Elektronik", icon: "/icon/categories/elektronik.svg" },
    { name: "Pakaian Pria", icon: "/icon/categories/pakaian.svg" },
    { name: "Sepatu", icon: "/icon/categories/sepatu.svg" },
    { name: "Perabot Rumah", icon: "/icon/categories/electronic 6.svg" },
    { name: "Jam Tangan", icon: "/icon/categories/jam_tangan.svg" },
    { name: "Pakaian Wanita", icon: "/icon/categories/bajumuslim 1.svg" },
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
        {/* <main className="hidden md:block md:mx-auto lg:w-[1200px] px-[0px] mt-[28px]">
          <Welcome />
        </main> */}
        <div className='hidden'>
          <UserGreeting isLoggedIn={isLoggedIn} userName={user ? user?.name : ''} />
        </div>
        <main className='md:mx-auto px-[0px] lg:w-[1200px] mt-[28px]'>
          <CategoryGrid categories={categoryData} onCategorySelect={setSelectedCategory} />
        </main>
        <main className="container mx-auto pb-24 md:pb-0 lg:w-[1200px] md:px-[0px] mt-[24px]">
          {
            products &&
            <ProductPromo products={products} />
          }
          {
            products &&
            <ProductList products={products} selectedCategory={selectedCategory} />
          }
          {
            products &&
            <NewProduct products={products} selectedCategory={selectedCategory} />
          }
        </main>
      </div>
      {
        loading && <Loading />
      }
    </MainLayout>
  );
};

export default Home;
