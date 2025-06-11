'use client'
import { ErrorMessage, Footer, IconHeader, Input, Terms, Wrapper } from 'components/layouts/auth'
import {
    Card,
    TitleContainer,
    Logo,
    RootLogin,
    DaftarLink,
    InputHint,
    HelpText,
    ButtonNext,
    Divider,
    LoginOption,
    InputGroup,
    Header,
} from 'components/layouts/Login'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidPhone = (value: string) =>
    /^(\+62|62|0)8[1-9][0-9]{6,9}$/.test(value);

const Login = () => {
    const [input, setInput] = useState<string>("");
    const [isValid, setIsValid] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const trimmed = input.trim();
        if (trimmed === "") {
            setIsValid(false);
            setShowError(false);
        } else if (isValidEmail(trimmed) || isValidPhone(trimmed)) {
            setIsValid(true);
            setShowError(false);
        } else {
            setIsValid(false);
            setShowError(true);
        }
    }, [input]);

    return (
        <RootLogin>
            <Logo
                src="/logo/logo_header.png"
                alt="Zukses Logo"
            />
            <Header>
                <IconHeader src='/icon/arrow-left.svg' width={30} />
                <IconHeader src='/icon/quest.svg' width={30} />
            </Header>
            <Card>
                <TitleContainer>
                    <div>Masuk ke Zukses</div>
                    <DaftarLink onClick={() => router.push('/auth/register')}>Daftar</DaftarLink>
                </TitleContainer>

                <form>
                    <InputGroup>
                        <Wrapper className={showError ? 'error' : ''}>
                            <Input
                                type="text"
                                placeholder="Nomor HP atau Email"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                        </Wrapper>
                        <InputHint>Contoh: 08123456789</InputHint>
                    </InputGroup>
                    {showError && (
                        <ErrorMessage>
                            Masukkan nomor HP atau email yang valid
                        </ErrorMessage>
                    )}
                    <HelpText>Butuh bantuan?</HelpText>

                    <ButtonNext disabled={!isValid}>Selanjutnya</ButtonNext>
                </form>

                <Divider>
                    <span>atau masuk dengan</span>
                </Divider>
                <LoginOption>
                    <img
                        src="https://img.icons8.com/color/48/000000/google-logo.png"
                        alt="Google"
                    />
                    <span>Google</span>
                </LoginOption>
                <Terms>
                    Dengan masuk di sini, kamu menyetujui{" "}
                    <a href="#">Syarat & Ketentuan</a> serta{" "}
                    <a href="#">Kebijakan Privasi</a> Zukses.
                </Terms>
            </Card>
            <Footer>
                Sudah punya akun? <span onClick={() => router.push('/auth/register')}>Daftar Sekarang</span>
            </Footer>
        </RootLogin>
    );
};

export default Login;
