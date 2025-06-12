import {
    ButtonAuth,
    ContentCard,
    IconInModal,
    TextContent,
    WhatsAppContainer,
} from 'components/Auth';
import Loading from 'components/Loading';
import {
    ChangePasswordContent,
    CheckPasswordContainer,
} from 'components/Profile/ResetPassword';
import React, { useEffect, useState, useCallback } from 'react';
import { OtpInput } from 'reactjs-otp-input';
import Post from 'services/api/Post';
import { getUserInfo } from 'services/api/redux/action/AuthAction';
import { RegisterResponse, Response } from 'services/api/types';

type Props = {
    setOpen: (value: string) => void;
    password?: string
};
interface User {
    name?: string
    email?: string
    whatsapp?: string
    id?: number
    username?: string
    image?: string
    role?: string
}

const OTPPassword = ({ setOpen, password }: Props) => {
    const [otp, setOtp] = useState('');
    const [canResend, setCanResend] = useState(false);
    const [counter, setCounter] = useState(60);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null)
    useEffect(() => {
        const currentUser = getUserInfo()
        if (currentUser) {
            setUser(currentUser)
        }
    }, [])
    // Simulasi penghitungan mundur
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (counter > 0) {
            timer = setTimeout(() => {
                setCounter(counter - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }
        return () => clearTimeout(timer);
    }, [counter]);

    const handleResend = async () => {
        setLoading(true);
        // Simulasi kirim ulang OTP
        console.log('Simulasi kirim OTP ulang');
        setCounter(60);
        setCanResend(false);
        setLoading(false);
        requestOTP()
    };

    const handleSubmit = useCallback(async () => {
        setLoading(true)
        const formData = new FormData();
        formData.append('otp', otp);
        formData.append('password', password ?? '');
        const res = await Post<Response>('zukses', `otp/${user?.id}/verify-change-password`, formData);
        if (res?.data?.status === 'success') {
            setOpen('change-password'); // Simulasi navigasi
            setLoading(false);
        }
    }, [otp, setOpen]);

    const requestOTP = async () => {
        try {
            setLoading(true)
            const email = user?.email ?? '';
            const formData = new FormData();
            formData.append('email', email.includes('@') ? email : '');
            formData.append('whatsapp', String(user?.whatsapp || 0));
            formData.append('name', String(user?.name || 0));

            const res = await Post<RegisterResponse>('zukses', `otp/${user?.id}/request-change-password`, formData);
            if (res?.data?.status === 'success') {
                setLoading(false)
            }
        } catch {
            setLoading(false)
        }
    }
    useEffect(() => {
        if (otp.length === 6) {
            handleSubmit();
        }
    }, [otp, handleSubmit]);

    return (
        <CheckPasswordContainer
            style={{
                alignItems: 'start',
                justifyContent: 'center',
                paddingTop: '20px',
            }}
        >
            <ChangePasswordContent
                style={{ justifyContent: 'center', display: 'flex' }}
            >
                <ContentCard>
                    <TextContent>
                        Kode OTP telah dikirim via WhatsApp ke
                    </TextContent>
                    <WhatsAppContainer>
                        <IconInModal src="/icon-old/whatsapp.svg" />
                        {
                            user?.whatsapp ?
                                <span>+62xxxxxxx</span> :
                                <span>******** @gmail.com</span>
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
                            <span
                                onClick={handleResend}
                                style={{ color: 'blue', cursor: 'pointer' }}
                            >
                                Kirim Ulang
                            </span>
                        ) : (
                            <span style={{ color: 'gray' }}>
                                Kirim Ulang dalam {counter} detik
                            </span>
                        )}{' '}
                        atau coba <span style={{ color: 'blue' }}>Metode Lain</span>
                    </TextContent>

                    <ButtonAuth onClick={handleSubmit} disabled={loading || otp.length !== 6}>
                        LANJUT
                    </ButtonAuth>
                </ContentCard>
            </ChangePasswordContent>
            {
                loading && <Loading />
            }
        </CheckPasswordContainer>
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
        textAlign: 'center' as const,
    },
};

export default OTPPassword;
