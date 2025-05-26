import {
    AuthWith,
    ButtonAuth,
    CardAuth,
    CardContainer,
    ContentCard,
    Google,
    HeadCard,
    IconPassword,
    IconSocial,
    InputAuth,
    Line,
    OrContainer,
    WrapperInput,
    TextFooter,
    TitleAuth,
    ModalAgreementContainer,
} from 'components/Auth';
import React, { useState } from 'react';
import AuthLayout from '.';
import ModalAgreement from './ModalAgreement';
import Post from 'services/api/Post';
import { UserData } from 'services/api/types';
import Loading from 'components/Loading';

const Register = () => {
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [modalAgreement, setModalAgreement] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [whatsapp, setWhatsapp] = useState<string>('');
    const normalizePhone = (input: string) => {
        const digits = input.replace(/\D/g, '');

        if (digits.startsWith('0')) return '62' + digits.slice(1);
        if (digits.startsWith('8')) return '62' + digits;
        if (digits.startsWith('62')) return digits;
        return digits;
    };

    const formatPhone = (digits: string) => {
        const national = digits.startsWith('62') ? digits.slice(2) : digits;
        return `(+62) ${national.slice(0, 3)} ${national.slice(3, 7)} ${national.slice(7, 11)}`;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const normalized = normalizePhone(phone);

        if (normalized.length < 10 || normalized.length > 15) {
            setError('Nomor telepon tidak valid. Harus antara 10–15 digit.');
            return;
        }

        const formatted = formatPhone(normalized);
        setWhatsapp(normalized);
        setPhone(formatted);
        setModalAgreement(true)
    };


    const handleRegister = async () => {
        setLoading(true)
        const formData = new FormData();
        formData.append('whatsapp', whatsapp);
        formData.append('password', "ZUKSES");
        formData.append('email', whatsapp);
        const res = await Post<RegisterResponse>('zukses', 'auth/register-with-whatsapp', formData);
        if (res?.data?.status == 'success') {
            localStorage.setItem('user', JSON.stringify(res?.data?.data)); // ubah objek jadi string
            localStorage.setItem('token', res?.data?.token || ''); // pastikan string (fallback kalau undefined)
            // Waktu sekarang dalam detik
            const nowInSeconds = Math.floor(Date.now() / 1000);

            // Tambah 2 menit (120 detik)
            const twoMinutesLater = nowInSeconds + 60;

            // Simpan ke localStorage
            localStorage.setItem('timeOtp', twoMinutesLater.toString());
            window.location.href = 'https://zukses-git-main-samanis-projects.vercel.app/auth/verification'
            setLoading(false);
        } else {
            setLoading(false);

        }
    }


    const handleLoginGoogle = () => {
        window.location.href = 'https://zukses.id/v1/auth/google';
    }
    return (
        <AuthLayout mode="register">
            <CardContainer>
                <CardAuth style={{ top: '220px' }}>
                    <HeadCard>
                        <TitleAuth>Daftar</TitleAuth>
                    </HeadCard>
                    <ContentCard>
                        <AuthWith style={{ marginTop: '-20px' }}>
                            <Google onClick={handleLoginGoogle}>
                                <IconSocial src='/icon/google.webp' width={30} />
                                Google
                            </Google>
                        </AuthWith>
                        <OrContainer>
                            <Line />
                            Atau
                            <Line />
                        </OrContainer>
                        <form onSubmit={handleSubmit}>
                            <WrapperInput style={{ marginTop: '10px' }}>
                                <InputAuth
                                    placeholder='No. Telepon'
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    maxLength={25}
                                    required
                                />
                                {phone.replace(/\D/g, '').length >= 10 && (
                                    <IconPassword
                                        src='/icon/circle-tick.svg'
                                        style={{ cursor: 'not-allowed' }}
                                    />
                                )}
                            </WrapperInput>
                            {error && (
                                <p style={{ color: 'red', fontSize: '0.9em', marginTop: '4px' }}>
                                    {error}
                                </p>
                            )}
                            <ButtonAuth type="submit">
                                Daftar
                            </ButtonAuth>
                        </form>
                        <TextFooter>
                            Punya akun?{' '}
                            <span onClick={() => window.location.href = 'https://zukses-git-main-samanis-projects.vercel.app/auth/login'}>
                                Log in
                            </span>
                        </TextFooter>
                    </ContentCard>
                </CardAuth>
            </CardContainer>
            <ModalAgreementContainer open={modalAgreement} onClick={() => setModalAgreement(false)}>
                <ModalAgreement setModalAgreement={setModalAgreement} handleRegister={handleRegister} />
            </ModalAgreementContainer>
            {
                loading && <Loading />
            }
        </AuthLayout>
    );
};

export default Register;

export interface RegisterResponse {
    token: string;
    data: UserData;
    expires_in?: number;
    token_type?: string;
    [key: string]: unknown;
}
