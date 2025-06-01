import React, { useState, useEffect } from 'react';
import AuthLayout from '.';
import {
    AlertChangePassword,
    ButtonAuth,
    CardAuth,
    CardContainer,
    ContentCard,
    HeadCard,
    IconInModal,
    IconPassword,
    InputAuth,
    ListAlert,
    TextContent,
    TextHeaderCard,
    WhatsAppContainer,
    WrapperInput,
} from 'components/Auth';
import { getUserInfo } from 'services/api/redux/action/AuthAction';
import Post from 'services/api/Post';
import { RegisterResponse } from 'services/api/types';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import Loading from 'components/Loading';

const ChangePassword = () => {
    const [user, setUser] = useState<{ whatsapp?: string, id?: string, email?: string } | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string>('');
    const [type, setType] = useState<string>('');
    const router = useRouter()
    const [validations, setValidations] = useState({
        hasLowercase: false,
        hasUppercase: false,
        hasLength: false,
        hasValidChars: false,
    });

    const searchParams = useSearchParams();
    useEffect(() => {
        if (searchParams.get('token')) {
            const email = searchParams.get('email');
            const name = searchParams.get('name');
            const username = searchParams.get('username');
            const whatsapp = searchParams.get('whatsapp');
            const is_active = parseInt(searchParams.get('is_active') || '');
            const role = searchParams.get('role');
            const id = parseInt(searchParams.get('id') || '');
            const data = {
                name: name,
                username: username,
                email: email,
                role: role,
                id: id,
                whatsapp: `${whatsapp}`,
                is_active: is_active
            };
            const token = searchParams.get('token');
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('token', token ? token : '');
        }
    }, [searchParams]);
    const formatPhoneNumber = (raw: string): string => {
        const phone = raw.replace(/\D/g, '');
        const local = phone.startsWith('62') ? phone.slice(2) : phone;
        const masked = '**********';
        const suffix = local.slice(-2);
        return `${masked}${suffix}`;
    };

    useEffect(() => {
        const fetchedUser = getUserInfo();
        setUser(fetchedUser);
        const type = localStorage.getItem('typeOtp');
        setType(type ? type : '')
    }, []);

    useEffect(() => {
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasLength = password.length >= 8 && password.length <= 16;
        const hasValidChars = /^[a-zA-Z0-9@!#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/.test(password);

        setValidations({
            hasLowercase,
            hasUppercase,
            hasLength,
            hasValidChars,
        });
    }, [password]);

    const maskEmail = (email?: string | null): string => {
        if (!email || !email.includes('@')) return '';
        const [localPart, domain] = email.split('@');
        if (localPart.length <= 2) {
            return `${localPart[0] || ''}${'*'.repeat(localPart.length - 1)}@${domain}`;
        }
        const visible = localPart.slice(0, 2);
        const masked = '*'.repeat(localPart.length - 2);
        return `${visible}${masked}@${domain}`;
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        const { hasLowercase, hasUppercase, hasLength, hasValidChars } = validations;

        if (!hasLowercase || !hasUppercase || !hasLength || !hasValidChars) {
            setLoading(false)
            setError('Semua kriteria password harus dipenuhi sebelum melanjutkan.');
            return;
        }

        setError(''); // clear error
        const fetchedUser = getUserInfo();
        const formData = new FormData();
        formData.append('password', password);
        formData.append('email', fetchedUser?.email);

        const res = await Post<RegisterResponse>('zukses', 'auth/change-password', formData);
        if (res?.data?.status == 'success') {
            const data = {
                name: fetchedUser?.name,
                username: fetchedUser?.username,
                email: fetchedUser?.name,
                role: fetchedUser?.role,
                whatsapp: fetchedUser?.whatsapp,
                id: fetchedUser?.id
            };
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.removeItem('typeOtp')
            localStorage.removeItem('timeOtp')
            router.replace('/auth')
            setLoading(false)
        } else {
            setError('Terjadi kesalahan saat mengganti password.');
            setLoading(false)
        }
    };

    const handleBack = () => {
        router.replace('/auth/register');
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    return (
        <AuthLayout mode="change-password">
            <CardContainer>
                <CardAuth style={{ top: '160px' }}>
                    <HeadCard style={{ justifyContent: 'left' }}>
                        <IconInModal src="/icon/arrow-left-line.svg" onClick={handleBack} />
                        <TextHeaderCard>Atur Password Kamu</TextHeaderCard>
                    </HeadCard>
                    <ContentCard>
                        <TextContent>Buat password baru untuk</TextContent>
                        <WhatsAppContainer>
                            {
                                type === 'email' ?
                                    <b>{user?.email ? maskEmail(user.email) : '...'}</b> :
                                    <b>{user?.whatsapp ? formatPhoneNumber(user.whatsapp) : user?.email ? maskEmail(user.email) : '...'}</b>
                            }
                        </WhatsAppContainer>
                        <form onSubmit={handleSubmit}>
                            <WrapperInput>
                                <InputAuth
                                    placeholder='Atur password'
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <IconPassword
                                    src={showPassword ? '/icon/eye.svg' : '/icon/eye-close.svg'}
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </WrapperInput>

                            {error && (
                                <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
                            )}

                            <AlertChangePassword>
                                <ListAlert>Min. satu karakter huruf kecil {validations.hasLowercase && <IconInModal src='/icon/circle-tick.svg' width={20} />}</ListAlert>
                                <ListAlert>Min. satu karakter huruf besar {validations.hasUppercase && <IconInModal src='/icon/circle-tick.svg' width={20} />}</ListAlert>
                                <ListAlert>8-16 karakter {validations.hasLength && <IconInModal src='/icon/circle-tick.svg' width={20} />}</ListAlert>
                                <ListAlert>Hanya huruf, angka, dan tanda baca umum yang dapat digunakan {validations.hasValidChars && <IconInModal src='/icon/circle-tick.svg' width={20} />}</ListAlert>
                            </AlertChangePassword>

                            <ButtonAuth type='submit'>BERIKUTNYA</ButtonAuth>
                        </form>
                    </ContentCard>
                </CardAuth>
            </CardContainer>
            {
                loading &&
                <Loading />
            }
        </AuthLayout>
    );
};

export default ChangePassword;
