import React, { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface HomeLayoutProps {
  children: ReactNode;
  mode?: 'user-profile';
  navbarOn?: boolean;
}

const Home: React.FC<HomeLayoutProps> = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Zukses Plaza</title>
        <meta name="description" content="Deskripsi singkat situs kamu" />
      </Head>

      <p style={{ cursor: "pointer" }} onClick={() => router.push('/auth/login')}>Login</p>
    </>
  );
};

export default Home;
