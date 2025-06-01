import Loading from 'components/Loading';
import {
    ButtonNext,
    Content,
    ContentContainer,
    HeaderContainer,
    IconBack,
    OtpContainer,
    Title
} from 'components/Verfication/Otp';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { OtpInput } from 'reactjs-otp-input';
import Post from 'services/api/Post';
import { RegisterResponse } from 'services/api/types';

type Props = {
    setOpenOTP: (value: boolean) => void;
    handleResendOTPMail: () => Promise<void>;
    email: string;
    whatsapp: string;
    type: string;
    userId: string;
};

const OtpPage = ({ setOpenOTP, handleResendOTPMail, userId, email, type, whatsapp }: Props) => {
    const [otp, setOtp] = useState('');
    const [counter, setCounter] = useState(60);
    const [resendAvailable, setResendAvailable] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    useEffect(() => {
        if (counter > 0) {
            const timer = setTimeout(() => setCounter(counter - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setResendAvailable(true);
        }
    }, [counter]);

    // Auto submit OTP if length is 6
    useEffect(() => {
        if (otp.length === 6) {
            handleSubmit();
        }
    }, [otp]);

    const handleResend = () => {
        if (!resendAvailable) return;

        console.log('OTP dikirim ulang');
        handleResendOTPMail()
        setCounter(60);
        setResendAvailable(false);
    };

    const handleSubmit = async () => {
        setLoading(true)
        const formData = new FormData();
        formData.append('otp', otp);
        formData.append('email', email);
        formData.append('whatsapp', whatsapp);
        formData.append('type', type);
        const res = await Post<RegisterResponse>('zukses', `otp-verify/${userId}/verification`, formData);
        console.log('res', res);

        if (res?.data?.status === 'success') {
            localStorage.setItem('user', JSON.stringify(res?.data?.data));
            localStorage.setItem('token', res?.data?.token || '');
            localStorage.removeItem('dataUser');
            router.replace('/user-profile/profil');
            setLoading(false);
        }
    };

    const isOtpComplete = otp.length === 6;

    return (
        <OtpContainer>
            <ContentContainer>
                <Content>
                    <HeaderContainer>
                        <IconBack src='/icon/arrow-left-red.svg' onClick={() => setOpenOTP(false)} />
                        <Title>Masukkan Kode OTP</Title>
                    </HeaderContainer>

                    <p>Kode OTP telah dikirim via e-mail ke</p>
                    <b>{type === 'email' ? email : whatsapp}</b>

                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        isInputNum
                        shouldAutoFocus
                        inputStyle={styles.otpInput}
                        containerStyle={styles.otpContainer}
                    />

                    {resendAvailable ? (
                        <p>
                            Tidak menerima kode?{' '}
                            <span
                                onClick={handleResend}
                                style={{ color: '#e74c3c', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Kirim ulang
                            </span>
                        </p>
                    ) : (
                        <p style={{ color: '#bbbbbb' }}>
                            Mohon tunggu {counter} detik untuk mengirim ulang
                        </p>
                    )}

                    <ButtonNext
                        onClick={handleSubmit}
                        style={{
                            opacity: isOtpComplete ? 1 : 0.5,
                            pointerEvents: isOtpComplete ? 'auto' : 'none',
                            transition: 'opacity 0.3s ease',
                        }}
                    >
                        Lanjut
                    </ButtonNext>
                </Content>
            </ContentContainer>
            {
                loading && <Loading />
            }
        </OtpContainer>
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

export default OtpPage;
