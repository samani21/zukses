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

type Props = {
    setOpenModal: (value: boolean) => void;
    typeVerifikasi: string;
    user?: {
        whatsapp?: string;
        email?: string;
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

const ModalResponse = ({ setOpenModal, typeVerifikasi, user }: Props) => {
    const [countdown, setCountdown] = useState(60);
    const [isResendAvailable, setIsResendAvailable] = useState(false);

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
    };

    const maskedContact =
        typeVerifikasi === 'Email'
            ? maskEmail(user?.email || '')
            : maskPhone(user?.whatsapp);

    return (
        <ModalProtectContainer>
            <HeaderModal>
                <IconAbsolute
                    src='/icon/arrow-left-red.svg'
                    onClick={() => setOpenModal(false)}
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
                        <IconModal src='/icon/send-mail.svg' width={100} />
                    ) : (
                        <IconModal src='/icon/phone-chat.svg' width={100} />
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
        </ModalProtectContainer>
    );
};

export default ModalResponse;
