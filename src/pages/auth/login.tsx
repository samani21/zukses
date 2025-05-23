import { AuthWith, ButtonAuth, CardAuth, CardContainer, ContentCard, Facebook, ForgetPassword, Google, HeadCard, IconPassword, IconSocial, InputAuth, Line, OrContainer, Rectangle, RightHeaderCard, SwitchLogo, TextFooter, TextSwtichAuth, TitleAuth, WrapperInput } from 'components/Auth'
import React, { useState } from 'react'
import AuthLayout from '.'
import Post from 'services/api/Post'
import { RegisterResponse } from 'services/api/types'

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        // Reset error dulu
        setError(null)

        // // Validasi input required
        // if (!email || !password) {
        //     setError('Email dan Password harus diisi.')
        //     return
        // }

        // // Simulasi cek akun/password (misal akun hardcoded)
        // if (email !== 'user@example.com') {
        //     setError('Akun tidak terdaftar.')
        //     return
        // }

        // if (password !== '123456') {
        //     setError('Password salah.')
        //     return
        // }

        // Jika lolos validasi


        try {
            const formData = new FormData();
            formData.append('password', password);
            formData.append('email', email);
            const res = await Post<RegisterResponse>('zukses', 'auth/login', formData);
            console.log('res', res)
            if (res?.data?.status == 'success') {
                localStorage.setItem('user', JSON.stringify(res?.data?.data));
                localStorage.setItem('token', res?.data?.token || '');
                window.location.href = 'http://localhost:3000/'
            }
        } catch (err: any) {
            // Tangani error 422 dan tampilkan ke user
            if (err.response?.status === 422) {
                const errorMessage = err.response.data.message || 'Data tidak valid';
                console.log('error', errorMessage);
                // Tampilkan ke form, contoh:
                setError(errorMessage);
            } else {
                console.error('Unexpected error', err);
            }
        }

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
                                <div style={{ color: 'red', marginTop: '8px', fontSize: '14px' }}>
                                    {error}
                                </div>
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

                        <ForgetPassword>Lupa Password</ForgetPassword>

                        <OrContainer>
                            <Line />
                            Atau
                            <Line />
                        </OrContainer>

                        <AuthWith>
                            <Facebook>
                                <IconSocial src='/icon/facebook.png' width={20} />
                                Facebook
                            </Facebook>
                            <Google>
                                <IconSocial src='/icon/google.webp' width={30} />
                                Google
                            </Google>
                        </AuthWith>

                        <TextFooter>
                            Baru di Shopee? <span onClick={() => window.location.href = 'http://localhost:3000/auth/register'}>Daftar</span>
                        </TextFooter>
                    </ContentCard>
                </CardAuth>
            </CardContainer>
        </AuthLayout>
    )
}

export default Login
