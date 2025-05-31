import {
    ButtonNext,
    Content,
    ContentContainer,
    HeaderContainer,
    IconBack,
    OtpContainer,
    Title
} from 'components/Verfication/Otp';
import React, { useEffect, useState } from 'react';
import { OtpInput } from 'reactjs-otp-input';

const OtpPage = () => {
    const [otp, setOtp] = useState('');
    const [counter, setCounter] = useState(60);
    const [resendAvailable, setResendAvailable] = useState(false);

    // Countdown timer for resend
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
        setCounter(60);
        setResendAvailable(false);
    };

    const handleSubmit = () => {
        console.log('OTP dikirim:', otp);
        // Tambahkan validasi atau pengiriman OTP ke server di sini
    };

    const isOtpComplete = otp.length === 6;

    return (
        <OtpContainer>
            <ContentContainer>
                <Content>
                    <HeaderContainer>
                        <IconBack src='/icon/arrow-left-red.svg' />
                        <Title>Masukkan Kode OTP</Title>
                    </HeaderContainer>

                    <p>Kode OTP telah dikirim via e-mail ke</p>
                    <b>Eksloba21@gmail.com</b>

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
