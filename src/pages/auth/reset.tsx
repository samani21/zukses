import {
    ButtonAuth,
    CardAuth,
    CardContainer,
    ContentCard,
    HeadCard,
    InputAuth,
    WrapperInput,
    IconInModal,
    TextHeaderCard,
    TextContent,
    OptionReset,
    AlertLogin,
} from 'components/Auth';
import AuthLayout from '.';
import { useState } from 'react';
import Get from 'services/api/Get';
import { Response } from 'services/api/types';
import Post from 'services/api/Post';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';

const Reset = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [nextReset, setNextReset] = useState<boolean>(false);
    const [user, setUser] = useState<{ whatsapp?: string; id?: number; email?: string; name?: string; role?: string } | null>(null);
    const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
    const router = useRouter();

    const maskPhone = (phone?: string | number | null): string => {
        if (!phone) return '';
        const phoneStr = String(phone);
        if (phoneStr.length < 4) return '*'.repeat(phoneStr.length);
        const visibleEnd = phoneStr.slice(-2);
        const masked = '*'.repeat(phoneStr.length - 2);
        return `${masked}${visibleEnd}`;
    };

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

    const normalizePhone = (input: string): string => {
        const digits = input.replace(/\D/g, ''); // Hanya angka
        if (digits.startsWith('62')) return digits;
        if (digits.startsWith('0')) return `62${digits.slice(1)}`;
        if (digits.startsWith('8')) return `62${digits}`; // Tanpa awalan
        return digits;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Normalisasi jika input berupa nomor telepon
        const isEmailInput = email.includes('@');
        const processedInput = isEmailInput ? email : normalizePhone(email);

        try {
            const res = await Get<Response>('zukses', `auth/me?email=${processedInput}`);
            console.log('res', res?.data);
            if (res?.status === 'success') {
                setUser(res?.data as { whatsapp?: string; id?: number; email?: string; name?: string; role?: string });
                const isValid = res?.data?.email?.includes('@gmail') || res?.data?.email?.includes('@mail');
                setIsEmailValid(isValid);
                setNextReset(true);
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
        }
    };

    const handleResendOTPPhone = async () => {
        const formData = new FormData();
        formData.append('whatsapp', user?.whatsapp ? user?.whatsapp : '');
        const res = await Post<Response>('zukses', `otp/${user?.id}/request`, formData);
        console.log('res', res);
        if (res?.data?.status === 'success') {
            const now = Math.floor(Date.now() / 1000);
            localStorage.setItem('timeOtp', now.toString());
            const data = {
                name: user?.name,
                email: user?.email,
                role: user?.role,
                id: user?.id,
                whatsapp: `${user?.whatsapp}`,
                is_active: 0
            };
            localStorage.setItem('user', JSON.stringify(data));
            router.replace('/auth/verification-reset-password');
        }
    };

    return (
        <AuthLayout mode="reset">
            <CardContainer>
                <CardAuth style={{ top: '220px' }}>
                    <HeadCard style={{ justifyContent: 'left' }}>
                        {
                            nextReset ?
                                <IconInModal src="/icon/arrow-left-line.svg" onClick={() => setNextReset(false)} /> :
                                <IconInModal src="/icon/arrow-left-line.svg" onClick={() => router.replace('/auth/login')} />
                        }
                        <TextHeaderCard>Reset Password</TextHeaderCard>
                    </HeadCard>
                    <ContentCard>
                        <TextContent>
                            {nextReset && "Pilih cara untuk mengubah password"}
                        </TextContent>
                        {
                            nextReset ? (
                                <>
                                    {isEmailValid && (
                                        <WrapperInput>
                                            <OptionReset>
                                                <IconInModal src='/icon/mail.svg' />
                                                Email ({maskEmail(user?.email)})
                                            </OptionReset>
                                        </WrapperInput>
                                    )}
                                    <WrapperInput onClick={handleResendOTPPhone}>
                                        <OptionReset>
                                            <IconInModal src='/icon/phone.svg' />
                                            No.Handphone ({maskPhone(user?.whatsapp || '')})
                                        </OptionReset>
                                    </WrapperInput>
                                </>
                            ) : (
                                <form onSubmit={handleSubmit}>

                                    {error &&
                                        <AlertLogin>
                                            <IconInModal src='/icon/alert-error.svg' width={15} />
                                            {error}
                                        </AlertLogin>}
                                    <WrapperInput style={{ marginTop: '10px' }}>
                                        <InputAuth
                                            placeholder='No. Handphone/Username/Email'
                                            value={email}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                        />
                                    </WrapperInput>
                                    <ButtonAuth type="submit">
                                        BERIKUTNYA
                                    </ButtonAuth>
                                </form>
                            )
                        }
                    </ContentCard>
                </CardAuth>
            </CardContainer>
        </AuthLayout>
    );
};

export default Reset;
