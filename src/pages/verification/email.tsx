import React, { useState, useCallback, useEffect, FormEvent } from 'react';
import {
    ButtonNext,
    Content,
    ContentContainer,
    EmailContainer,
    Error,
    FormContainer,
    FormGroup,
    Input,
    Label,
    Title,
    WrapperInput,
    WrapperInputContainer,
} from 'components/Verfication/EmailContainer';
import Post from 'services/api/Post';
import { Response } from 'services/api/types';
import { AxiosError } from 'axios';
import OtpPage from './OtpPage';
import Loading from 'components/Loading';

interface UserData {
    id: string;
    name: string;
    whatsapp: string;
}

const Email: React.FC = () => {
    const [userId, setUserId] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [whatsapp, setWhatsapp] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [openOTP, setOpenOTP] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    // Ambil data user dari localStorage
    useEffect(() => {
        const storedData = localStorage.getItem('dataUser');
        if (storedData) {
            try {
                const parsedData: UserData = JSON.parse(storedData);
                setUserId(parsedData?.id || '');
                setUserName(parsedData?.name || '');
                setWhatsapp(parsedData?.whatsapp || '');
            } catch (error) {
                console.error('Gagal parsing dataUser dari localStorage', error);
            }
        }
    }, []);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleResendOTPMail = useCallback(async () => {
        setLoading(true);

        const formData = new FormData();
        formData.append('email', email);
        formData.append('name', userName);

        try {
            const res = await Post<Response>('zukses', `send-email/${userId}/verification`, formData);
            if (res?.data?.status === 'success') {
                setOpenOTP(true);
            }
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            setEmailError(error?.response?.data?.message || 'Terjadi kesalahan saat mengirim OTP.');
        } finally {
            setLoading(false);
        }
    }, [email, userId, userName]);

    const handleNext = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEmailError(null);

        if (!validateEmail(email)) {
            setEmailError('Format email salah');
            return;
        }

        handleResendOTPMail();
    }, [email, handleResendOTPMail]);

    // Jika OTP sudah terbuka, tampilkan halaman OTP
    if (openOTP) {
        return (
            <OtpPage
                setOpenOTP={setOpenOTP}
                handleResendOTPMail={handleResendOTPMail}
                email={email}
                type="email"
                userId={userId}
                whatsapp={whatsapp}
            />
        );
    }

    return (
        <EmailContainer>
            <ContentContainer>
                <Content>
                    <Title>Ganti Email</Title>
                    <form onSubmit={handleNext}>
                        <FormContainer>
                            <FormGroup>
                                <Label>Email Baru</Label>
                                <WrapperInputContainer>
                                    <WrapperInput error={!!emailError}>
                                        <Input
                                            type="text"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </WrapperInput>
                                    {emailError && <Error>{emailError}</Error>}
                                    <ButtonNext type="submit">Selanjutnya</ButtonNext>
                                </WrapperInputContainer>
                            </FormGroup>
                        </FormContainer>
                    </form>
                </Content>
            </ContentContainer>
            {loading && <Loading />}
        </EmailContainer>
    );
};

export default Email;
