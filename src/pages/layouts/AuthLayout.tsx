'use client'
import {
    Container, ContentMobile, Description, Footer, Header,
    IconHeader, Left, LeftImage, LeftImageContainer, Logo,
    Right, Root, RootMobile, Title
} from "components/layouts/auth";
import { useRouter } from "next/router";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const path = router.pathname;
    const mode = path.includes('verification-account')
        ? 'verification-account'
        : path.includes('register')
            ? 'register' : path.includes('login')
                ? 'login'
                : 'unknown';

    return (
        <>
            <Root>
                <Logo src="/logo/logo.png" alt="Zukses Logo" />
                <Container>
                    <Left>
                        <LeftImageContainer>
                            <LeftImage src='/image/register.jpg' alt="Ilustrasi Toko" />
                        </LeftImageContainer>
                        <Title>Jual Beli Mudah Hanya di Zukses</Title>
                        <Description>Gabung dan rasakan kemudahan bertransaksi di Zukses</Description>
                    </Left>
                    <Right>
                        {children}
                    </Right>
                </Container>
            </Root>
            <RootMobile style={{ backgroundImage: mode === 'verification-account' ? 'none' : '' }}>
                {
                    mode != 'verification-account' && <Header>
                        <IconHeader src='/icon/arrow-left.svg' width={30} onClick={() => router.push('/')} />
                    </Header>
                }
                <ContentMobile>
                    {children}
                </ContentMobile>
                {
                    mode === 'register' ? <Footer>
                        Sudah punya akun? <span onClick={() => router.push('/auth/login')}>Masuk</span>
                    </Footer> :
                        mode === 'login' ? <Footer>
                            Sudah punya akun? <span onClick={() => router.push('/auth/register')}>Daftar Sekarang</span>
                        </Footer> : ''
                }

            </RootMobile>
        </>
    );
}
