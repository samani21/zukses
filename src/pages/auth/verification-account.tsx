import { AxiosError } from 'axios';
import {
    Header, IconAuth, IconAuthContainer, IconHeader, Terms,
    Title, VerificationContainer
} from 'components/layouts/auth'
import Loading from 'components/Loading';
import { Modal } from 'components/Modal';
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
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const { type, email, whatsapp, user_id } = router.query as {
        type?: string;
        email?: string;
        whatsapp?: string;
        user_id?: string;
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Handle OTP submit
    const handleSubmit = useCallback(async () => {
        setLoading(true)
        try {
            const formData = new FormData();
            formData.append('otp', otp);
            const res = await Post<Response>('zukses', `otp-verify/${user_id}`, formData);
            if (res?.data?.status === 'success') {
                setLoading(false)
                localStorage.setItem('user', JSON.stringify(res?.data?.data));
                localStorage.setItem('token', res?.data?.token as string);
                localStorage.removeItem('timeOtp');
                router.push('/');
            }
        } catch (error) {
            const err = error as AxiosError<Response>;
            console.log('res', err)
            if (err?.response?.status === 422) {
                const msg = String(err.response?.data?.message || 'Data tidak valid.');
                setErrorMessage(msg);
                setIsModalOpen(true);
                setLoading(false)
            } else {
                console.error("Terjadi kesalahan lain:", err);
                setLoading(false)
            }
        }
    }, [otp, router]);


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
        setLoading(true)
        if (type === 'email') {
            const formData = new FormData();
            const res = await Post<Response>('zukses', `send-email/${user_id}`, formData);
            console.log('res', res)
            if (res?.data?.status === 'success') {
                setCounter(90);
                setLoading(false)
            }
        } else {
            const formData = new FormData();
            formData.append('whatsapp', whatsapp ?? '');
            const res = await Post<Response>('zukses', `otp/${user_id}/request`, formData);
            console.log('res', res)
            if (res?.data?.status === 'success') {
                setCounter(90);
                setLoading(false)
            }
        }
    };


    const closeModal = () => {
        setIsModalOpen(false);
    }
    const OtpErrorModalContent = () => (

        <div>
            <p className="mb-6">
                {errorMessage}
            </p>
            <div className="space-y-3">
                <button
                    onClick={closeModal}
                    className="w-full py-3 font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors">
                    Tutup
                </button>
            </div>
        </div>
    );
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

                    <div style={{ width: "100%", display: 'flex', justifyContent: "center" }}>
                        {/* Tombol Verifikasi */}
                        <button
                            onClick={handleSubmit}
                            disabled={otp.length < 6 || loading}
                            style={{
                                marginTop: "20px",
                                backgroundColor: theme.colors.primary,
                                color: '#fff',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                cursor: otp.length < 6 || loading ? 'not-allowed' : 'pointer',
                                opacity: otp.length < 6 || loading ? 0.6 : 1
                            }}
                        >
                            Verifikasi
                        </button>
                    </div>

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
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={'Kode OTP'}
            >
                <OtpErrorModalContent />
            </Modal>
            {loading && <Loading />}
        </AuthLayout>
    )
}

const styles = {
    otpContainer: {
        justifyContent: 'center',
        marginBottom: '1.2rem',
        marginTop: '50px',
    },
    otpInput: {
        border: `2px solid ${theme?.colors?.primary}`,
        width: '3rem',
        height: '3rem',
        fontSize: '1.5rem',
        margin: '0 0.25rem',
        borderRadius: '10px',
        outline: 'none'
    },
};

export default VerificationAccount;
