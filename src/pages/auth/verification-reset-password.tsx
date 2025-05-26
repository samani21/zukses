import React, { useState, useEffect, useCallback } from 'react';
import AuthLayout from '.';
import { OtpInput } from 'reactjs-otp-input';
import {
    ButtonAuth,
    CardAuth,
    CardContainer,
    ContentCard,
    HeadCard,
    IconInModal,
    TextContent,
    TextHeaderCard,
    WhatsAppContainer,
} from 'components/Auth';
import { getUserInfo } from 'services/api/redux/action/AuthAction';
import Post from 'services/api/Post';
import { Response } from 'services/api/types';
import { useRouter } from 'next/router';
import Loading from 'components/Loading';

const VerificationResetPassword = () => {
    const [otp, setOtp] = useState('');
    const [user, setUser] = useState<{ whatsapp?: string, id?: string, email?: string, name?: string, role?: string } | null>(null);
    const [counter, setCounter] = useState(0);
    const [type, setType] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const [canResend, setCanResend] = useState(false);
    useEffect(() => {
        const timeOtp = localStorage.getItem('timeOtp');
        if (timeOtp) {
            const now = Math.floor(Date.now() / 1000); // current time in seconds
            const diff = parseInt(timeOtp) - now;
            if (diff > 0) {
                setCounter(diff);
                setCanResend(false);
            } else {
                setCanResend(true);
            }
        } else {
            setCanResend(true); // if no timeOtp found
        }
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!canResend && counter > 0) {
            timer = setTimeout(() => {
                setCounter(prev => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearTimeout(timer);
    }, [counter, canResend]);

    useEffect(() => {
        const type = localStorage.getItem('typeOtp');
        setType(type ? type : '')
    }, []);

    const handleResend = async () => {
        // Simulasi: Kirim OTP dan simpan waktu sekarang + 60 detik
        if (type === 'email') {
            setLoading(true)
            const formData = new FormData();
            formData.append('email', user?.email ? user?.email : '');
            formData.append('name', user?.name ? user?.name : '');
            const res = await Post<Response>('zukses', `send-email/${user?.id}`, formData);
            console.log('res', res);
            if (res?.data?.status === 'success') {
                const now = Math.floor(Date.now() / 1000);
                localStorage.setItem('timeOtp', now.toString());
                setCounter(60);
                setCanResend(false);
                setLoading(false)
            }
        } else {
            setLoading(true)
            const formData = new FormData();
            formData.append('whatsapp', user?.whatsapp ? user?.whatsapp : '');
            const res = await Post<Response>('zukses', `otp/${user?.id}/request`, formData);
            console.log('res', res)
            if (res?.data?.status === 'success') {
                const now = Math.floor(Date.now() / 1000);
                localStorage.setItem('timeOtp', now.toString());
                setCounter(60);
                setCanResend(false);
                setLoading(false)
            }
        }
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

    const formatPhoneNumber = (raw: string): string => {
        const phone = raw.replace(/\D/g, '');

        const local = phone.startsWith('62') ? phone.slice(2) : phone;

        if (local.length < 8) return '(+62) Invalid Number';

        const prefix = local.slice(0, 3);
        const masked = '*****';
        const suffix = local.slice(-3);

        return `(+62) ${prefix}${masked}${suffix}`;
    };

    const handleSubmit = useCallback(async () => {
        setLoading(true)
        const formData = new FormData();
        formData.append('otp', otp);
        const res = await Post<Response>('zukses', `otp-verify-reset-passwrod/${user?.id}`, formData);
        console.log('res', res);

        if (res?.data?.status === 'success') {
            localStorage.setItem('user', JSON.stringify(res?.data?.data));
            localStorage.removeItem('timeOtp');
            router.replace('/auth/change-password')
            setLoading(false)
        }
    }, [otp, user, router]);

    useEffect(() => {
        if (otp.length === 6) {
            handleSubmit();
        }
    }, [otp, handleSubmit]);

    useEffect(() => {
        const fetchedUser = getUserInfo();
        setUser(fetchedUser);
    }, []);

    const handleBack = () => {
        router.replace('/auth/reset');
        localStorage.removeItem('user')
    }

    return (
        <AuthLayout mode="verification-reset-password">
            <CardContainer>
                <CardAuth style={{ top: '220px' }}>
                    <HeadCard style={{ justifyContent: 'left' }}>
                        <IconInModal src="/icon/arrow-left-line.svg" onClick={handleBack} />
                        <TextHeaderCard>Masukkan Kode OTP</TextHeaderCard>
                    </HeadCard>
                    <ContentCard>
                        <TextContent>
                            Kode OTP telah dikirim via WhatsApp ke
                        </TextContent>
                        <WhatsAppContainer>
                            {
                                type === 'email' ?
                                    <>
                                        <IconInModal src="/icon/mail.svg" />
                                        <b>
                                            {user?.email ? maskEmail(user.email) : '...'}
                                        </b>
                                    </> :
                                    <>
                                        <IconInModal src="/icon/whatsapp.svg" />
                                        <b>
                                            {user?.whatsapp ? formatPhoneNumber(user.whatsapp) : '...'}
                                        </b>
                                    </>
                            }
                        </WhatsAppContainer>
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            isInputNum
                            shouldAutoFocus
                            inputStyle={styles.otpInput}
                            containerStyle={styles.otpContainer}
                        />

                        <TextContent>
                            Tidak menerima Kode OTP?
                            <br />
                            {canResend ? (
                                <span onClick={handleResend}>
                                    Kirim Ulang
                                </span>
                            ) : (
                                <span style={{ color: 'gray' }}>
                                    Kirim Ulang dalam {counter} detik
                                </span>
                            )} atau coba <span>Metode Lain</span>
                        </TextContent>

                        <ButtonAuth onClick={handleSubmit}>
                            LANJUT
                        </ButtonAuth>
                    </ContentCard>
                </CardAuth>
            </CardContainer>
            {
                loading && <Loading />
            }
        </AuthLayout>
    );
};

const styles = {
    otpContainer: {
        justifyContent: 'center',
        marginBottom: '1.2rem',
        marginTop: '50px',
    },
    otpInput: {
        width: '3rem',
        height: '3rem',
        fontSize: '1.5rem',
        borderBottom: '1px solid #ccc',
        margin: '0 0.25rem',
    },
};

export default VerificationResetPassword;
