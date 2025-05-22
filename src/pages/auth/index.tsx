import {
    AuthContainer, Content, ContentContainer, HeaderContainer,
    HeaderLeft, LogoHeader, NavAuth, TextHelper, TextLogin
} from 'components/Auth';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
    mode?: 'register' | 'login' | 'verification';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, mode }) => {
    const router = useRouter();
    const [checkedAuth, setCheckedAuth] = useState(false);

    useEffect(() => {
        const isActive = localStorage.getItem('is_active');
        const token = localStorage.getItem('token');

        if (token) {
            if (isActive === '0' && router.pathname !== '/auth/verification') {
                router.replace('/auth/verification');
            } else if (isActive !== '0' && router.pathname !== '/auth/register' && mode === 'register') {
                router.replace('/auth/register');
            }
        } else {
            router.replace('/auth/register');
        }

        setCheckedAuth(true); // Mark auth check as complete
    }, [router.pathname]);

    // Prevent rendering until auth check is complete
    if (!checkedAuth) return null;

    return (
        <AuthContainer>
            <NavAuth>
                <HeaderContainer>
                    <HeaderLeft>
                        <LogoHeader src='/logo/shopee.png' />
                        <TextLogin>{mode === 'register' ? "Daftar" : "Log in"}</TextLogin>
                    </HeaderLeft>
                    <TextHelper>Butuh bantuan?</TextHelper>
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
