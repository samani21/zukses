import React, { useState, useCallback, useEffect } from 'react';
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

const Email: React.FC = () => {
    const [userId, setUserId] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [whatsapp, setWhatsapp] = useState<string>('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [openOTP, setOpenOTP] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const storedData = localStorage.getItem('dataUser')
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData)
                setUserId(parsedData?.id)
                setWhatsapp(parsedData?.whatsapp)
                setUserName(parsedData?.name);
            } catch (error) {
                console.error('Failed to parse dataUser from localStorage', error)
            }
        }
    }, [])

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleNext = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        setEmailError(null);
        if (!validateEmail(email)) {
            setEmailError('Format email salah');
            return;
        }
        handleResendOTPMail();

        // if (email === 'used@example.com') {
        //     setEmailError('Email telah digunakan');
        //     return;
        // }

        // console.log('Lanjut ke langkah berikutnya dengan email:', email);
    }, [email]);

    const handleResendOTPMail = async () => {
        setLoading(true)
        try {
            const formData = new FormData();
            formData.append('email', email ? email : '');
            formData.append('name', userName ? userName : '');
            const res = await Post<Response>('zukses', `send-email/${userId}/verification`, formData);
            console.log('res', res);
            if (res?.data?.status === 'success') {
                setOpenOTP(true)
                setLoading(false)
            }
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            setEmailError(error?.response?.data?.message || '');
            setLoading(false)
        }
    };

    return (
        openOTP ? <OtpPage setOpenOTP={setOpenOTP} handleResendOTPMail={handleResendOTPMail} email={email} type={"email"} userId={userId} whatsapp={whatsapp} /> :
            <EmailContainer>
                <ContentContainer>
                    <Content>
                        <Title>Ganti Email </Title>
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
                {
                    loading && <Loading />
                }
            </EmailContainer>
    );
};

export default Email;
