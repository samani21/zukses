import {
    AuthContainer,
    Content,
    ContentContainer,
    HeaderContainer,
    HeaderLeft,
    LogoHeader,
    NavAuth,
    TextHelper,
    TextLogin
} from 'components/Auth';

import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getUserInfo } from 'services/api/redux/action/AuthAction';

interface AuthLayoutProps {
    children: ReactNode;
    mode?: 'register' | 'login' | 'verification' | 'change-password' | 'reset' | 'verification-reset-password';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, mode }) => {
    const router = useRouter();
    const [checkedAuth, setCheckedAuth] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        const userInfo = getUserInfo();

        const redirectTo = (path: string) => {
            if (router.pathname !== path) {
                router.push(path);
            }
        };

        const handleAuthRedirect = () => {
            if (userStr) {
                if (userInfo?.is_active === 1) {
                    redirectTo('/auth-old/change-password');
                } else if (userInfo?.is_active === 0) {
                    if (mode === 'verification') {
                        redirectTo('/auth-old/verification');
                    } else {
                        redirectTo('/auth-old/verification-reset-password');
                    }
                } else {
                    if (token) {
                        redirectTo('/');
                    } else {
                        localStorage.removeItem('user');
                        redirectTo('/auth-old/login');
                    }
                }
            } else {
                switch (mode) {
                    case 'login':
                        redirectTo('/auth-old/login');
                        break;
                    case 'reset':
                        redirectTo('/auth-old/reset');
                        break;
                    default:
                        redirectTo('/auth-old/register');
                        break;
                }
            }
        };

        handleAuthRedirect();
        setCheckedAuth(true);
    }, [router, mode]);

    if (!checkedAuth) return null;

    return (
        <AuthContainer>
            <NavAuth>
                <HeaderContainer>
                    <HeaderLeft>
                        <LogoHeader src='/logo/logo.png' />
                        <TextLogin>
                            {mode === 'register' ? 'Daftar' : 'Log in'}
                        </TextLogin>
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
