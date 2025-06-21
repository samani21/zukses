import React, { useEffect, useState } from 'react';
import {
    Content,
    HeaderModal,
    IconAbsolute,
    IconModal,
    ImageModalContainer,
    ModalProtectContainer,
    ResendVerification,
    Typograph
} from 'components/Profile/ModalContainer';
import Post from 'services/api/Post';
import { Response } from 'services/api/types';
import Loading from 'components/Loading';

type Props = {
    setOpenModal: (value: boolean) => void;
    setVerifikasi: (value: boolean) => void;
    typeVerifikasi: string;
    user?: {
        whatsapp?: string;
        email?: string;
        id?: number;
    } | null;
};

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

const ModalResponse = ({ setOpenModal, typeVerifikasi, user, setVerifikasi }: Props) => {
    const [countdown, setCountdown] = useState(60);
    const [isResendAvailable, setIsResendAvailable] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        if (countdown <= 0) {
            setIsResendAvailable(true);
            return;
        }

        const timer = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    const handleResend = () => {
        if (!isResendAvailable) return;
        // Call your resend verification logic here
        console.log(`Resending verification via ${typeVerifikasi}`);
        setCountdown(60);
        setIsResendAvailable(false);
        if (typeVerifikasi === 'Email') {
            handleResendOTPMail()
        } else {
            handleResendVerificationWhatsapp()
        }
    };

    const handleResendOTPMail = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('type', typeVerifikasi.toLowerCase());
        const res = await Post<Response>('zukses', `send-email-verification/${user?.id}`, formData);
        console.log('res', res);
        if (res?.data?.status === 'success') {
            setLoading(false)
        }
    };
    const handleResendVerificationWhatsapp = async () => {
        // Simulasi: Kirim OTP dan simpan waktu sekarang + 60 detik
        setLoading(true);
        const formData = new FormData();
        formData.append('type', typeVerifikasi.toLowerCase());
        const res = await Post<Response>('zukses', `otp/${user?.id}/request-verification`, formData);
        console.log('res', res)
        if (res?.data?.status === 'success') {
            setLoading(false)
        }
    };

    const maskedContact =
        typeVerifikasi === 'Email'
            ? maskEmail(user?.email || '')
            : maskPhone(user?.whatsapp);

    return (
        <ModalProtectContainer>
            <HeaderModal>
                <IconAbsolute
                    src='/icon-old/arrow-left-red.svg'
                    onClick={() => {
                        setOpenModal(false)
                        setVerifikasi(false)
                    }}
                />
                <p>Respon melalui {typeVerifikasi === 'Whatsapp' ? 'handphone-mu' : 'email-mu'}</p>
            </HeaderModal>
            <Content>
                <Typograph>
                    Link verifikasi telah dikirim melalui {typeVerifikasi} ke
                </Typograph>
                <div>{maskedContact}</div>
                <ImageModalContainer>
                    {typeVerifikasi === 'Email' ? (
                        <IconModal src='/icon-old/send-mail.svg' width={100} />
                    ) : (
                        <IconModal src='/icon-old/phone-chat.svg' width={100} />
                    )}
                </ImageModalContainer>
                <ResendVerification>
                    {!isResendAvailable ? (
                        <>Mohon menunggu {countdown} detik sebelum mengirim ulang.</>
                    ) : (
                        <>
                            <p>
                                Tidak menerima {typeVerifikasi}?{' '}
                                <span onClick={handleResend}>
                                    Kirim ulang
                                </span>
                            </p>
                        </>
                    )}
                </ResendVerification>
            </Content>
            {
                loading && <Loading />
            }
        </ModalProtectContainer>
    );
};

export default ModalResponse;
