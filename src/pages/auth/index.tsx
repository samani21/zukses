// components/Auth.tsx
import { AuthContainer, CardAuth, CardContainer, Content, ContentCard, ContentContainer, HeadCard, HeaderContainer, HeaderLeft, InputAuth, LogoHeader, NavAuth, Rectangle, RightHeaderCard, SwitchLogo, TextHelper, TextLogin, TextSwtichAuth, TitleAuth, WrapperInput } from 'components/Auth'
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
    mode?: 'register' | 'login';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, mode }) => {
    const router = useRouter();
    console.log('router', router?.pathname)
    return (
        <>
            <Head>
                <title>Halaman Auth</title>
                {/* Contoh Google Font */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
            </Head>

            <AuthContainer>
                <NavAuth>
                    <HeaderContainer>
                        <HeaderLeft>
                            <LogoHeader src='/logo/shopee.png' />
                            <TextLogin>{mode === 'register' ? "Daftar" : "Log in"}</TextLogin>
                        </HeaderLeft>
                        <TextHelper>
                            Butuh bantuan?
                        </TextHelper>
                    </HeaderContainer>
                </NavAuth>
                <ContentContainer>
                    <Content>
                        {children}
                    </Content>
                </ContentContainer>
            </AuthContainer>
        </>
    );
};

export default AuthLayout;
