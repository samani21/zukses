import {
    AuthContainer, Content, ContentContainer, HeaderContainer,
    HeaderLeft, LogoHeader, NavAuth, TextHelper, TextLogin
} from 'components/Auth';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import { getUserInfo } from 'services/api/redux/action/AuthAction';

interface AuthLayoutProps {
    children: ReactNode;
    mode?: 'register' | 'login' | 'verification' | 'change-password' | 'reset' | 'verification-reset-password';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, mode }) => {
    const router = useRouter();
    const [checkedAuth, setCheckedAuth] = useState(false);
    useEffect(() => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        const fetchedUser = getUserInfo();
        if (user) {
            if (fetchedUser?.is_active == 1) {
                router.replace('/auth/change-password');
            } else if (fetchedUser?.is_active === 0) {
                if (mode === 'verification') {
                    router.replace('/auth/verification');
                } else {
                    router.replace('/auth/verification-reset-password');
                }
            } else {
                if (token) {
                    router.replace('/');
                } else {
                    router.replace('/auth/login');
                    localStorage.removeItem('user');
                }
            }
        } else {
            if (mode === 'login') {
                router.replace('/auth/login');
            } else if (mode === 'reset') {
                router.replace('/auth/reset');
            } else {
                router.replace('/auth/register');
            }

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
                        <LogoHeader src='/logo/Shopee.png' />
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
