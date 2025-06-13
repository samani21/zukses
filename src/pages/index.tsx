import React, { ReactNode, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface HomeLayoutProps {
  children?: ReactNode;
  mode?: 'user-profile';
  navbarOn?: boolean;
}

const Home: React.FC<HomeLayoutProps> = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Cek status login dari localStorage saat mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!token && !!user);
  }, []);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      // Logout: hapus token dan user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      router.reload(); // refresh halaman
    } else {
      // Login: arahkan ke halaman login
      router.push('/auth/login');
    }
  };

  return (
    <>
      <Head>
        <title>Zukses Plaza</title>
        <meta name="description" content="Deskripsi singkat situs kamu" />
      </Head>

      <p
        style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
        onClick={handleAuthClick}
      >
        {isLoggedIn ? 'Logout' : 'Login'}
      </p>
    </>
  );
};

export default Home;
