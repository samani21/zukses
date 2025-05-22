// components/Auth.tsx
import { AuthContainer, Content, ContentContainer, HeaderContainer, HeaderLeft, LogoHeader, NavAuth, TextHelper, TextLogin } from 'components/Auth'
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
    mode?: 'register' | 'login';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, mode }) => {
    return (


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
    );
};

export default AuthLayout;
