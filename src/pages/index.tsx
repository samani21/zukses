import React, { ReactNode, useEffect, useState } from 'react';
import MainLayout from './layouts/MainLayout';
import SlidingBanner from 'components/SlidingBanner';
import CategoryGrid from 'components/CategoryGrid';
import UserGreeting from 'components/UserGreeting';
import { getUserInfo } from 'services/api/redux/action/AuthAction';
import ProductList from 'components/ProductList';

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
    { id: 1, src: '/image/banner1.png', alt: 'Banner 1' },
    { id: 2, src: '/image/banner2.png', alt: 'Banner 2' },
    { id: 3, src: '/image/banner3.png', alt: 'Banner 3' },
    { id: 4, src: '/image/banner4.png', alt: 'Banner 4' },
  ];
  const categoryData = [
    { name: "Elektronik", icon: "https://placehold.co/64x64/EBF5FF/3B82F6?text=📺" },
    { name: "Komputer & Aksesoris", icon: "https://placehold.co/64x64/EBF5FF/3B82F6?text=💻" },
    { name: "Handphone & Aksesoris", icon: "https://placehold.co/64x64/EBF5FF/3B82F6?text=📱" },
    { name: "Pakaian Pria", icon: "https://placehold.co/64x64/EBF5FF/3B82F6?text=👕" },
    { name: "Sepatu Pria", icon: "https://placehold.co/64x64/EBF5FF/3B82F6?text=👟" },
    { name: "Tas Pria", icon: "https://placehold.co/64x64/EBF5FF/3B82F6?text=🎒" },
    { name: "Aksesoris Fashion", icon: "https://placehold.co/64x64/EBF5FF/3B82F6?text=🕶️" },
    { name: "Jam Tangan", icon: "https://placehold.co/64x64/EBF5FF/3B82F6?text=⌚" },
    { name: "Kesehatan", icon: "https://placehold.co/64x64/EBF5FF/3B82F6?text=💊" },
    { name: "Hobi & Koleksi", icon: "https://placehold.co/64x64/EBF5FF/3B82F6?text=🎸" },
    { name: "Makanan & Minuman", icon: "https://placehold.co/64x64/FEFCE8/F59E0B?text=🍔" },
    { name: "Perawatan & Kecantikan", icon: "https://placehold.co/64x64/FEFCE8/F59E0B?text=🧴" },
    { name: "Perlengkapan Rumah", icon: "https://placehold.co/64x64/FEFCE8/F59E0B?text=🍳" },
    { name: "Pakaian Wanita", icon: "https://placehold.co/64x64/FEFCE8/F59E0B?text=👗" },
    { name: "Fashion Muslim", icon: "https://placehold.co/64x64/FEFCE8/F59E0B?text=🧕" },
    { name: "Fashion Bayi & Anak", icon: "https://placehold.co/64x64/FEFCE8/F59E0B?text=👶" },
    { name: "Ibu & Bayi", icon: "https://placehold.co/64x64/FEFCE8/F59E0B?text=🍼" },
    { name: "Sepatu Wanita", icon: "https://placehold.co/64x64/FEFCE8/F59E0B?text=👠" },
    { name: "Tas Wanita", icon: "https://placehold.co/64x64/FEFCE8/F59E0B?text=👜" },
    { name: "Otomotif", icon: "https://placehold.co/64x64/FEFCE8/F59E0B?text=🚗" }
  ];

  const allProducts = [
    { id: 1, name: "Smart TV 4K 50 inch", category: "Elektronik", price: "4.500.000", location: "Jakarta Pusat", imageUrl: "https://placehold.co/300x300/EBF5FF/3B82F6?text=TV", rating: 4.9, sold: 100 },
    { id: 2, name: "Keyboard Mechanical RGB", category: "Komputer & Aksesoris", price: "850.000", location: "Kota Bandung", imageUrl: "https://placehold.co/300x300/EBF5FF/3B82F6?text=Keyboard", rating: 4.8, sold: 250 },
    { id: 3, name: "Kemeja Lengan Panjang Pria", category: "Pakaian Pria", price: "220.000", location: "Kota Surabaya", imageUrl: "https://placehold.co/300x300/EBF5FF/3B82F6?text=Kemeja", rating: 4.9, sold: 500 },
    { id: 4, name: "Blouse Wanita Modern", category: "Pakaian Wanita", price: "180.000", location: "DI Yogyakarta", imageUrl: "https://placehold.co/300x300/FEFCE8/F59E0B?text=Blouse", rating: 4.8, sold: 300 },
    { id: 5, name: "Gamis Syar'i Premium", category: "Fashion Muslim", price: "350.000", location: "Kota Medan", imageUrl: "https://placehold.co/300x300/FEFCE8/F59E0B?text=Gamis", rating: 4.9, sold: 150 },
    { id: 6, name: "Setelan Baju Anak Lucu", category: "Fashion Bayi & Anak", price: "120.000", location: "Kota Makassar", imageUrl: "https://placehold.co/300x300/FEFCE8/F59E0B?text=Baju+Anak", rating: 4.9, sold: 400 },
    { id: 7, name: "Serum Wajah Glowing", category: "Perawatan & Kecantikan", price: "150.000", location: "Jakarta Barat", imageUrl: "https://placehold.co/300x300/FEFCE8/F59E0B?text=Serum", rating: 5.0, sold: 1000 },
    { id: 8, name: "Laptop Gaming Core i7", category: "Elektronik", price: "15.500.000", location: "Jakarta Selatan", imageUrl: "https://placehold.co/300x300/EBF5FF/3B82F6?text=Laptop", rating: 4.8, sold: 50 },
  ];
  return (
    <MainLayout>
      <SlidingBanner banners={bannerImages} />
      <UserGreeting isLoggedIn={isLoggedIn} userName={user ? user?.name : ''} />
      <CategoryGrid categories={categoryData} onCategorySelect={setSelectedCategory} />
      <main className="container mx-auto pb-24">
        <ProductList products={allProducts} selectedCategory={selectedCategory} />
      </main>
    </MainLayout>
  );
};

export default Home;
