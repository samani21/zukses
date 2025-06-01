import React, { ReactNode } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import NavbarBottom from 'components/NavbarBottom';
import { HomeContainer, HomeContainerMobile } from 'components/HomeContainer';

interface HomeLayoutProps {
  children: ReactNode;
  mode?: 'user-profile';
  navbarOn?: boolean;
}

const Home: React.FC<HomeLayoutProps> = ({
  children,
  mode,
  navbarOn = true
}) => {
  const isUserProfile = mode === 'user-profile';
  const shouldShowNavbar = navbarOn;

  return (
    <>
      <Head>
        <title>Zukses Plaza</title>
        <meta name="description" content="Deskripsi singkat situs kamu" />
      </Head>

      <HomeContainer>
        <Header />
        {children}
      </HomeContainer>

      <HomeContainerMobile>
        {!isUserProfile && <Header />}
        {children}
        {shouldShowNavbar && <NavbarBottom />}
      </HomeContainerMobile>
    </>
  );
};

export default Home;
