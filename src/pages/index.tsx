import React, { ReactNode, useEffect, useState } from 'react';
import MainLayout from './layouts/MainLayout';
import SlidingBanner from 'components/SlidingBanner';
import CategoryGrid from 'components/CategoryGrid';
import UserGreeting from 'components/UserGreeting';
import { getUserInfo } from 'services/api/redux/action/AuthAction';
import ProductList from 'components/ProductList';
import SiteFooter from 'components/SiteFooter';

interface HomeLayoutProps {
  children?: ReactNode;
  mode?: 'user-profile';
  navbarOn?: boolean;
}

const Home: React.FC<HomeLayoutProps> = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ whatsapp?: string, id?: string, email?: string, role?: string, name?: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!token && !!user);

    const fetchedUser = getUserInfo();
    setUser(fetchedUser);
  }, []);

  const bannerImages = [
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

  const allProducts = [
    { id: 1, name: "Smart TV 4K 50 inch", category: "Elektronik", price: "4.500.000", location: "Jakarta Pusat", imageUrl: "/image/televisi.jpg", rating: 4.9, sold: 100 },
    { id: 2, name: "Keyboard Mechanical RGB", category: "Komputer & Aksesoris", price: "850.000", location: "Kota Bandung", imageUrl: "/image/keyboard.png", rating: 4.8, sold: 250 },
    { id: 3, name: "Kemeja Lengan Panjang Pria", category: "Pakaian Pria", price: "220.000", location: "Kota Surabaya", imageUrl: "/image/kemeja.webp", rating: 4.9, sold: 500 },
    { id: 4, name: "Blouse Wanita Modern", category: "Pakaian Wanita", price: "180.000", location: "DI Yogyakarta", imageUrl: "/image/blouse.jpeg", rating: 4.8, sold: 300 },
    { id: 5, name: "Gamis Syar'i Premium", category: "Fashion Muslim", price: "350.000", location: "Kota Medan", imageUrl: "/image/gamis.jpg", rating: 4.9, sold: 150 },
    { id: 6, name: "Setelan Baju Anak Lucu", category: "Fashion Bayi & Anak", price: "120.000", location: "Kota Makassar", imageUrl: "/image/baju anak.jpg", rating: 4.9, sold: 400 },
    { id: 7, name: "Serum Wajah Glowing", category: "Perawatan & Kecantikan", price: "150.000", location: "Jakarta Barat", imageUrl: "/image/serum.jpeg", rating: 5.0, sold: 1000 },
    { id: 8, name: "Laptop Gaming Core i7", category: "Elektronik", price: "15.500.000", location: "Jakarta Selatan", imageUrl: "/image/laptop.jpg", rating: 4.8, sold: 50 },
  ];
  return (
    <MainLayout>
      <div className="md:px-30 mx-auto">
        <SlidingBanner banners={bannerImages} />
      </div>
      <div className='md:hidden'>
        <UserGreeting isLoggedIn={isLoggedIn} userName={user ? user?.name : ''} />
      </div>
      <CategoryGrid categories={categoryData} onCategorySelect={setSelectedCategory} />
      <main className="container mx-auto pb-24 md:px-10">
        <ProductList products={allProducts} selectedCategory={selectedCategory} />
      </main>
      <SiteFooter />
    </MainLayout>
  );
};

export default Home;
