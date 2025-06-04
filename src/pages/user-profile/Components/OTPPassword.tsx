import {
    ButtonAuth,
    ContentCard,
    IconInModal,
    TextContent,
    WhatsAppContainer,
} from 'components/Auth';
import {
    ChangePasswordContent,
    CheckPasswordContainer,
} from 'components/Profile/ResetPassword';
import React, { useEffect, useState, useCallback } from 'react';
import { OtpInput } from 'reactjs-otp-input';

type Props = {
    setOpen: (value: string) => void;
};

const OTPPassword = ({ setOpen }: Props) => {
    const [otp, setOtp] = useState('');
    const [canResend, setCanResend] = useState(false);
    const [counter, setCounter] = useState(60);
    const [loading, setLoading] = useState(false);

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
    };

    const handleSubmit = useCallback(async () => {
        setLoading(true);
        // Simulasi verifikasi OTP
        console.log('Verifikasi OTP:', otp);
        setTimeout(() => {
            console.log('OTP benar, lanjut ke halaman berikutnya');
            setLoading(false);
            setOpen('change-password'); // Simulasi navigasi
        }, 1000);
    }, [otp, setOpen]);

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
                        <IconInModal src="/icon/whatsapp.svg" />
                        <span>+62xxxxxxx</span>
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
