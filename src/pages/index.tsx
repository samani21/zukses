import React, { ReactNode } from 'react'
import Header from '../components/Header'
import NavbarBottom from 'components/NavbarBottom'
import { HomeContainer, HomeContainerMobile } from 'components/HomeContainer';
interface HomeLayoutProps {
  children: ReactNode;
  mode?: 'user-profile';
}
const Home: React.FC<HomeLayoutProps> = ({ children, mode }) => {
  return (
    <>
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