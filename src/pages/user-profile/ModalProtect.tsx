import React, { useState } from 'react';
import {
    ButtonVerifikasi,
    Content,
    HeaderProtect,
    IconModal,
    IconModalContainer,
    ModalProtectContainer
} from 'components/Profile/ModalContainer';
import ModalResponse from './ModalResponse';
import { Response } from 'services/api/types';
import Post from 'services/api/Post';
import Loading from 'components/Loading';

type Props = {
    setOpenModal: (value: boolean) => void;
    typeModal: string;
    user?: {
        whatsapp?: string;
        email?: string;
        id?: number;
    } | null;
};

function ModalProtect({ setOpenModal, typeModal, user }: Props) {
    const [verifikasi, setVerifikasi] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [typeVerifikasi, setTypeVerifikasi] = useState<string>('');
    const handleResendOTPMail = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('type', typeModal);
        const res = await Post<Response>('zukses', `send-email-verification/${user?.id}`, formData);
        console.log('res', res);
        if (res?.data?.status === 'success') {
            setLoading(false)
            setVerifikasi(true)
        }
    };

    const handleResendVerificationWhatsapp = async () => {
        // Simulasi: Kirim OTP dan simpan waktu sekarang + 60 detik
        setLoading(true);
        const formData = new FormData();
        formData.append('type', typeModal);
        const res = await Post<Response>('zukses', `otp/${user?.id}/request-verification`, formData);
        console.log('res', res)
        if (res?.data?.status === 'success') {
            setLoading(false)
            setVerifikasi(true)
        }
    };

    const handleVerifikasi = () => {
        const email = user?.email;
        const whatsapp = user?.whatsapp; // pastikan `user` punya properti ini

        if (typeModal === 'email') {
            if (email && email.includes('@gmail.com')) {
                console.log('Email valid:', email);
                setTypeVerifikasi('Email')
                handleResendOTPMail()
            } else {
                console.log('Konsulkan WhatsApp');
                setTypeVerifikasi('Whatsapp')
                handleResendVerificationWhatsapp()
            }
        } else if (typeModal === 'whatsapp') {
            if (whatsapp && /^[0-9]{10,15}$/.test(whatsapp)) {
                setTypeVerifikasi('Whatsapp')
                handleResendVerificationWhatsapp()
            } else {
                setTypeVerifikasi('Email')
                handleResendOTPMail()
            }
        }
    };


    return (
        verifikasi ? <ModalResponse setOpenModal={setOpenModal} typeVerifikasi={typeVerifikasi} user={user} setVerifikasi={setVerifikasi} /> :
            <ModalProtectContainer>
                <Content>
                    <HeaderProtect>
                        <IconModal src='/icon/arrow-left-red.svg' style={{ cursor: "pointer" }} onClick={() => setOpenModal(false)} />
                    </HeaderProtect>
                    <IconModalContainer>
                        <IconModal src="/icon/protect-red.svg" width={100} alt="Proteksi" />
                    </IconModalContainer>
                    <p>
                        Untuk keamanan akun, mohon verifikasi identitas kamu dengan salah satu cara di bawah ini.
                    </p>
                    <ButtonVerifikasi onClick={handleVerifikasi}>
                        <IconModal src="/icon/link.svg" alt="Link Icon" />
                        <p>Verifikasi melalui link</p>
                    </ButtonVerifikasi>
                </Content>
                {
                    loading && <Loading />
                }
            </ModalProtectContainer>
    );
}

export default ModalProtect;
