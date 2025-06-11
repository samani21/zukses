import React, { ReactNode } from 'react';
import Head from 'next/head';

interface HomeLayoutProps {
  children: ReactNode;
  mode?: 'user-profile';
  navbarOn?: boolean;
}

const Home: React.FC<HomeLayoutProps> = () => {
  return (
    <>
      <Head>
        <title>Zukses Plaza</title>
        <meta name="description" content="Deskripsi singkat situs kamu" />
      </Head>

      Home
    </>
  );
};

export default Home;
