import React, { useState } from 'react';
import {
    ButtonVerifikasi,
    Content,
    IconModal,
    IconModalContainer,
    ModalProtectContainer
} from 'components/Profile/ModalContainer';
import ModalResponse from './ModalResponse';

type Props = {
    setOpenModal: (value: boolean) => void;
    typeModal: string;
    user?: {
        whatsapp?: string;
        email?: string;
    } | null;
};

function ModalProtect({ setOpenModal, typeModal, user }: Props) {
    const [verifikasi, setVerifikasi] = useState<boolean>(false);
    const [typeVerifikasi, setTypeVerifikasi] = useState<string>('');
    const handleVerifikasi = () => {
        const email = user?.email;
        const whatsapp = user?.whatsapp; // pastikan `user` punya properti ini

        if (typeModal === 'email') {
            if (email && email.includes('@gmail.com')) {
                console.log('Email valid:', email);
                setTypeVerifikasi('Email')
            } else {
                console.log('Konsulkan WhatsApp');
                setTypeVerifikasi('Whatsapp')
            }
        } else if (typeModal === 'whatsapp') {
            if (whatsapp && /^[0-9]{10,15}$/.test(whatsapp)) {
                setTypeVerifikasi('Whatsapp')
            } else {
                setTypeVerifikasi('Email')
            }
        }
        setVerifikasi(true)
    };


    return (
        verifikasi ? <ModalResponse setOpenModal={setOpenModal} typeVerifikasi={typeVerifikasi} user={user} /> :
            <ModalProtectContainer>
                <Content>
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
            </ModalProtectContainer>
    );
}

export default ModalProtect;
