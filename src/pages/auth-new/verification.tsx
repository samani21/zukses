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
    const [counter, setCounter] = useState(120);
    const [error, setError] = useState('');
    const [contact, setContact] = useState<string>('');
    const [type, setType] = useState<string>('');

    const formatContactMasked = (contact: string) => {
        if (isEmail(contact)) {
            const [name, domain] = contact.split('@');
            const maskedName = name.length > 2
                ? name.slice(0, 2) + '*'.repeat(name.length - 2)
                : name[0] + '*';
            return maskedName + '@' + domain;
        } else {
            if (contact.length < 3) return contact;
            const lastThree = contact.slice(-3);
            return '****_****_*' + lastThree;
        }
    };

    const isEmail = (value: string) => value.includes('@');

    useEffect(() => {
        if (!router.isReady) return;

        const query = { ...router.query };
        let updated = false;

        if (typeof query.contact === 'string') {
            setContact(query.contact);
            delete query.contact;
            updated = true;
        }

        if (typeof query.type === 'string') {
            setType(query.type);
            delete query.type;
            updated = true;
        }

        if (updated) {
            router.replace(
                {
                    pathname: router.pathname,
                    query,
                },
                undefined,
                { shallow: true }
            );
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
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        if (otp === '123456') {
            if (type === 'daftar') {
                window.location.href = `/auth-new/complete-registration?contact=${contact}`;
            } else {
                window.location.href = `/auth-new/forget-password?contact=${contact}&type=next`;
            }
        } else {
            setError('OTP Salah');
        }

        setLoading(false);
    }, [otp, contact, type]);

    const handleResend = async () => {
        setLoading(true);
        // Simulasi pengiriman ulang
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCounter(90);
        setLoading(false);
    };

    return (
        <AuthNewLayout>
            <div>
                <div className='flex justify-center h-[116px] mb-2'>
                    <img
                        src={isEmail(contact) ? '/icon/gmail.svg' : '/icon/whatsapp.svg'}
                        alt={isEmail(contact) ? 'Email Icon' : 'WhatsApp Icon'}
                    />
                </div>
                <div className="text-center">
                    <h2 className="text-[22px] font-bold text-[#444444]">Masukkan Kode Verifikasi</h2>
                    <p className="mt-2 text-[12px] md:text-[14px] font-medium text-[#444444]">
                        Kode verifikasi telah dikirim melalui {isEmail(contact) ? 'Email' : 'WhatsApp'} ke <br />
                        <span className="font-bold">{formatContactMasked(contact)}</span>
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
                    {error && <p className="text-center text-red-500 text-sm mb-4 mt-[-20px]">{error}</p>}
                    <button
                        onClick={handleSubmit}
                        disabled={otp.length < 6 || loading}
                        className='text-[16px] md:text-[18px]'
                        style={{
                            backgroundColor: "#FF2D60",
                            color: '#fff',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '8px',
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
                    {!counter ? (
                        <span className='font-[500] text-[14px] cursor-pointer text-[#FF2D60]' onClick={handleResend}>
                            Kirim ulang
                        </span>
                    ) : (
                        <span className='font-[500] text-[14px]'>
                            Kirim ulang dalam <strong className='text-[17px] font-bold'>{formatTime(counter)}</strong>
                        </span>
                    )}
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
