import {
    AlertLogin,
    AuthWith,
    ButtonAuth,
    CardAuth,
    CardContainer,
    ContentCard,
    Facebook,
    ForgetPassword,
    Google,
    HeadCard,
    IconInModal,
    IconPassword,
    IconSocial,
    InputAuth,
    Line,
    OrContainer,
    Rectangle,
    RightHeaderCard,
    SwitchLogo,
    TextFooter,
    TextSwtichAuth,
    TitleAuth,
    WrapperInput,
} from 'components/Auth'

import React, { useState } from 'react'
import AuthLayout from '.'
import Post from 'services/api/Post'
import { RegisterResponse } from 'services/api/types'
import { useRouter } from 'next/router'
import { AxiosError } from 'axios'
import Loading from 'components/Loading'

const Login = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false)

    const formatToIndoPhoneRaw = (input: string): string => {
        const phone = input.trim().replace(/\D/g, ''); // hanya angka
        if (phone.startsWith('0')) {
            return '62' + phone.slice(1);
        } else if (phone.startsWith('62')) {
            return phone;
        } else if (phone.startsWith('+62')) {
            return phone.slice(1); // hilangkan +
        }
        return '62' + phone;
    };

    // Format tampilan input menjadi: (+62) 812 7887 9032
    const formatPhoneForDisplay = (raw: string): string => {
        let digits = raw.replace(/\D/g, '');

        if (digits.startsWith('0')) {
            digits = digits.slice(1);
        } else if (digits.startsWith('62')) {
            digits = digits.slice(2);
        } else if (digits.startsWith('+62')) {
            digits = digits.slice(3);
        }

        // Pisah: (812) 7887 9032
        const part1 = digits.slice(0, 3);      // 812
        const part2 = digits.slice(3, 7);      // 7887
        const part3 = digits.slice(7, 11);     // 9032

        let result = `(+62)`;
        if (part1) result += ` ${part1}`;
        if (part2) result += ` ${part2}`;
        if (part3) result += ` ${part3}`;
        return result;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        const isEmail = email.includes('@');
        let rawToSend = email;

        if (!isEmail) {
            rawToSend = formatToIndoPhoneRaw(email);
            const displayFormat = formatPhoneForDisplay(email);
            setEmail(displayFormat); // Update tampilan input
        }

        try {
            setLoading(true)
            const formData = new FormData();
            formData.append('email', rawToSend); // tetap kirim format 62xxxxxxxxxx
            formData.append('password', password);

            const res = await Post<RegisterResponse>('zukses', 'auth/login', formData);
            console.log('res', res)

            if (res?.data?.status === 'success') {
                localStorage.setItem('user', JSON.stringify(res?.data?.data));
                localStorage.setItem('token', res?.data?.token || '');
                router.replace('/')
                setLoading(false)
            }
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;

            if (error.response?.status === 422) {
                const errorMessage = error.response.data?.message || 'Data tidak valid';
                console.log('error', errorMessage);
                setError(errorMessage);
            } else {
                console.error('Unexpected error', error);
            }
            setLoading(false)
        }
    };


    const handleLoginGoogle = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    }
    return (
        <AuthLayout mode="login">
            <CardContainer>
                <CardAuth>
                    <HeadCard>
                        <TitleAuth>Log in</TitleAuth>
                        <RightHeaderCard>
                            <TextSwtichAuth>Log in dengan QR</TextSwtichAuth>
                            <Rectangle />
                            <SwitchLogo src='/icon/qr-code.svg' />
                        </RightHeaderCard>
                    </HeadCard>
                    <ContentCard>
                        <form onSubmit={handleLogin}>
                            {error && (
                                <AlertLogin>
                                    <IconInModal src='/icon/alert-error.svg' width={15} />
                                    {error}
                                </AlertLogin>
                            )}

                            <WrapperInput style={{ marginTop: "0px" }}>
                                <InputAuth
                                    placeholder='No. Handphone/Username/Email'
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                />
                            </WrapperInput>
                            <WrapperInput>
                                <InputAuth
                                    placeholder='Password'
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                />
                                <IconPassword
                                    src={showPassword ? '/icon/eye.svg' : '/icon/eye-close.svg'}
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </WrapperInput>
                            <ButtonAuth type='submit'>
                                LOG IN
                            </ButtonAuth>
                        </form>

                        <ForgetPassword>
                            <p onClick={() => router.replace('/auth/reset')} style={{ cursor: "pointer" }}>
                                Lupa Password
                            </p>
                        </ForgetPassword>

                        <OrContainer>
                            <Line />
                            Atau
                            <Line />
                        </OrContainer>

                        <AuthWith>
                            <Facebook>
                                <IconSocial src='/icon/facebook.svg' width={20} />
                                Facebook
                            </Facebook>
                            <Google onClick={handleLoginGoogle}>
                                <IconSocial src='/icon/google.svg' width={30} />
                                Google
                            </Google>
                        </AuthWith>

                        <TextFooter>
                            Baru di Zukses? <span onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/register`}>Daftar</span>
                        </TextFooter>
                    </ContentCard>
                </CardAuth>
            </CardContainer>
            {
                loading && <Loading />
            }
        </AuthLayout>
    )
}

export default Login
