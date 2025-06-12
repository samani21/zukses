import {
    Header, IconAuth, IconAuthContainer, IconHeader, Terms,
    Title, VerificationContainer
} from 'components/layouts/auth'
import { useRouter } from 'next/router';
import AuthLayout from 'pages/layouts/AuthLayout'
import React, { useCallback, useEffect, useState } from 'react'
import { OtpInput } from 'reactjs-otp-input';
import Post from 'services/api/Post';
import { Response } from 'services/api/types';
import { theme } from 'styles/theme';

const VerificationAccount = () => {
    const [otp, setOtp] = useState('');
    const [counter, setCounter] = useState(90); // timer 90 detik
    const router = useRouter();
    const { type, email, whatsapp, user_id } = router.query as {
        type?: string;
        email?: string;
        whatsapp?: string;
        user_id?: string;
    };



    // Handle OTP submit
    const handleSubmit = useCallback(async () => {
        const formData = new FormData();
        formData.append('otp', otp);
        const res = await Post<Response>('zukses', `otp-verify/${user_id}`, formData);
        if (res?.data?.status === 'success') {
            localStorage.setItem('user', JSON.stringify(res?.data?.data));
            localStorage.removeItem('timeOtp');
            router.push('/');
        }
    }, [otp, router]);

    // Submit saat OTP lengkap
    useEffect(() => {
        if (otp.length === 6) {
            handleSubmit();
        }
    }, [otp, handleSubmit]);

    // Hitung mundur timer
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (counter > 0) {
            timer = setTimeout(() => setCounter(counter - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [counter]);

    // Format tampilan waktu
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleResend = async () => {
        if (type === 'email') {
            const formData = new FormData();
            const res = await Post<Response>('zukses', `send-email/${user_id}`, formData);
            console.log('res', res)
            if (res?.data?.status === 'success') {
                setCounter(90);
            }
        } else {
            const formData = new FormData();
            formData.append('whatsapp', whatsapp ?? '');
            const res = await Post<Response>('zukses', `otp/${user_id}/request`, formData);
            console.log('res', res)
            if (res?.data?.status === 'success') {
                setCounter(90);
            }
        }
    };

    return (
        <AuthLayout>
            <Header style={{ padding: "0px" }}>
                <IconHeader src='/icon/arrow-left.svg' width={30} style={{ cursor: "pointer" }} onClick={() => router.push('/')} />
            </Header>
            <VerificationContainer>
                <div>
                    <IconAuthContainer>
                        <IconAuth src={type === 'email' ? '/icon/gmail.svg' : '/icon/whatsapp.svg'} width={50} />
                    </IconAuthContainer>
                    <Title style={{ textAlign: "center" }}>Masukkan Kode Verifikasi</Title>
                    <Terms>
                        Kode verifikasi telah dikirim melalui {type === 'email' ? 'E-mail' : 'Whatsapp'} ke {type === 'email' ? email : whatsapp}
                    </Terms>

                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        isInputNum
                        shouldAutoFocus
                        inputStyle={styles.otpInput}
                        containerStyle={styles.otpContainer}
                    />

                    <Terms>
                        {!counter
                            ? <span style={{ color: theme.colors.primary, cursor: 'pointer' }} onClick={handleResend}>Kirim ulang</span>
                            : <>Kirim ulang dalam <strong>{formatTime(counter)}</strong></>
                        }
                        <br />
                        <span>Gunakan metode verifikasi lain</span>.
                    </Terms>
                </div>
            </VerificationContainer>
        </AuthLayout>
    )
}

const styles = {
    otpContainer: {
        justifyContent: 'center',
        marginBottom: '1.2rem',
        marginTop: '50px',
        borderBottom: `2px solid ${theme?.colors?.primary}`,
    },
    otpInput: {
        width: '3rem',
        height: '3rem',
        fontSize: '1.5rem',
        margin: '0 0.25rem',
        outline: 'none'
    },
};

export default VerificationAccount;
