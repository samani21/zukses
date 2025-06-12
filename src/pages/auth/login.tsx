'use client'
import { ErrorMessage, Footer, IconAuth, IconHeader, Input, Terms, Wrapper } from 'components/layouts/auth'
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
import Post from 'services/api/Post';
import { Response } from 'services/api/types';
const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidPhone = (value: string) =>
    /^(\+62|62|0)8[1-9][0-9]{6,9}$/.test(value);
// Convert local phone numbers to 628 format
const formatPhoneNumberTo62 = (phone: string) => {
    const trimmed = phone.trim();
    if (trimmed.startsWith("+62")) return trimmed.replace("+", "");
    if (trimmed.startsWith("62")) return trimmed;
    if (trimmed.startsWith("0")) return "62" + trimmed.slice(1);
    return trimmed;
};

type PayloadType = 'email' | 'whatsapp' | 'unknown';


function getPayloadType(input: string): PayloadType {
    const trimmedInput = input.trim();

    if (trimmedInput.includes('@') && /\S+@\S+\.\S+/.test(trimmedInput)) {
        return 'email';
    } else if (/^\d+$/.test(trimmedInput)) {
        return 'whatsapp';
    }

    return 'unknown';
}

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
    const handleLoginGoogle = () => {
        window.open(`${process.env.NEXT_PUBLIC_API_URL}/auth/google-zukses`, '_blank')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isValid) return;

        try {
            const trimmed = input.trim();
            const isPhone = isValidPhone(trimmed);
            const payload = isPhone ? formatPhoneNumberTo62(trimmed) : trimmed;

            const type = getPayloadType(payload);
            const formData = new FormData();
            formData.append('email_whatsapp', payload);
            formData.append('type', type);

            const res = await Post<Response>('zukses', 'auth/login-otp', formData);

            if (res?.data?.status === 'success') {
                router.push(`/auth/verification-account?${type}=${payload}&type=${type}&user_id=${res?.data?.data}`);
            } else {
                setShowError(true);
            }
        } catch (err) {
            console.error("Error submitting:", err);
            setShowError(true);
        }
    };

    return (
        <RootLogin>
            <Logo
                src="/logo/logo_header.png"
                alt="Zukses Logo"
            />
            <Header>
                <IconHeader src='/icon/arrow-left.svg' width={30} onClick={() => router.push('/')} />
                <IconHeader src='/icon/quest.svg' width={30} />
            </Header>
            <Card>
                <TitleContainer>
                    <div>Masuk ke Zukses</div>
                    <DaftarLink onClick={() => router.push('/auth/register')}>Daftar</DaftarLink>
                </TitleContainer>

                <form onSubmit={handleSubmit}>
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
                <LoginOption onClick={handleLoginGoogle}>
                    <IconAuth
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
