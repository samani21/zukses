'use client'
import { Container, ContentMobile, Description, Footer, Header, IconHeader, Left, LeftImage, LeftImageContainer, Logo, Right, Root, RootMobile, Title } from "components/layouts/auth";
import { useRouter } from "next/router";

// layouts/AuthLayout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (
        <>
            <Root>
                <Logo
                    src="/logo/logo_header.png"
                    alt="Zukses Logo"
                />
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
            <RootMobile>
                <Header>
                    <IconHeader src='/icon/arrow-left.svg' width={30} />
                </Header>
                <ContentMobile>
                    {children}
                </ContentMobile>
                <Footer>
                    Sudah punya akun? <span onClick={() => router.push('/auth/login')}>Masuk</span>
                </Footer>
            </RootMobile>
        </>
    );
}
