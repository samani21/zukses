import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import AuthNewLayout from 'pages/layouts/AuthNewLayout';
import { useCallback, useEffect, useState } from 'react';
import { OtpInput } from 'reactjs-otp-input';
import { theme } from 'styles/theme';
const VerificationPage: NextPage = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const [counter, setCounter] = useState(90);
    const [error, setError] = useState('');
    const [contact, setContact] = useState<string>('');
    useEffect(() => {
        if (router.isReady) {
            const contactParam = router.query.contact;

            if (typeof contactParam === 'string') {
                setContact(contactParam);

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { contact: _, ...restQuery } = router.query;
                router.replace(
                    {
                        pathname: router.pathname,
                        query: restQuery,
                    },
                    undefined,
                    { shallow: true }
                );
            }
        }
    }, [router.isReady]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (counter > 0) {
            timer = setTimeout(() => setCounter(counter - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [counter]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleSubmit = useCallback(async () => {
        setLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        if (otp === '123456') {
            window.location.href = `/auth-new/complete-registration?contact=${contact}`
        } else {
            setError('OTP Salah')
        }
        setLoading(false);
    }, [otp, router]);
    const handleResend = async () => {
        setLoading(true)
    };

    return (
        <AuthNewLayout>
            <div >
                <div className='flex justify-center h-[116px] mb-2' >
                    <img src='/icon/whatsapp.svg' />
                </div>
                <div className="text-center">
                    <h2 className="text-[22px] font-bold text-[#444444]">Masukkan Kode Verifikasi</h2>
                    <p className="mt-2 text-[14px] font-medium text-[#444444]">
                        Kode verifikasi telah dikirim melalui Whatsapp ke
                        ****_****_*301
                    </p>
                </div>

                <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    isInputNum
                    shouldAutoFocus
                    inputStyle={styles.otpInput}
                    containerStyle={styles.otpContainer}
                />
                <div className='px-4 pt-8'>
                    {error && <p className="text-center text-red-500 text-sm mb-4 mt-[-20px] ">{error}</p>}
                    <button
                        onClick={handleSubmit}
                        disabled={otp.length < 6 || loading}
                        style={{
                            backgroundColor: "#FF2D60",
                            color: '#fff',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '18px',
                            cursor: otp.length < 6 || loading ? 'not-allowed' : 'pointer',
                            opacity: otp.length < 6 || loading ? 0.6 : 1,
                            width: "100%",
                            height: "50px",
                            fontWeight: "700",
                        }}
                    >
                        Selanjutnya
                    </button>
                </div>
                <div className='text-center text-[#444444] mt-3' style={{ letterSpacing: "-0.04em" }}>
                    {!counter
                        ? <span className='font-[500] text-[14px] cursor-pointer text-[#FF2D60]' onClick={handleResend}>Kirim ulang</span>
                        : <span className='font-[500] text-[14px]'>Kirim ulang dalam <strong className='text-[17px] font-bold'>{formatTime(counter)}</strong></span>
                    }
                    <br />
                    <span className='font-bold text-[14px]'>Gunakan metode verifikasi lain</span>.
                </div>
            </div>
        </AuthNewLayout>
    );
};


const styles = {
    otpContainer: {
        justifyContent: 'center',
        marginTop: '30px',
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


export default VerificationPage;
