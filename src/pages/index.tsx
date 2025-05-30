import React, { ReactNode } from 'react'
import Header from '../components/Header'
import NavbarBottom from 'components/NavbarBottom'
import { HomeContainer, HomeContainerMobile } from 'components/HomeContainer';
import Head from 'next/head';
interface HomeLayoutProps {
  children: ReactNode;
  mode?: 'user-profile';
}
const Home: React.FC<HomeLayoutProps> = ({ children, mode }) => {
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
        {
          mode === 'user-profile' ? '' :
            <Header />
        }
        {children}
        <NavbarBottom />
      </HomeContainerMobile>
    </>
  )
}

export default Home