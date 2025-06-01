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
import Loading from 'components/Loading';
import Post from 'services/api/Post';
import { Response } from 'services/api/types';
import { AxiosError } from 'axios';
import OtpPage from './OtpPage';

const formatDisplayPhone = (raw: string) => {
    const cleaned = raw.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
        const national = cleaned.slice(1);
        return `(+62) ${national.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')}`.trim();
    } else if (cleaned.startsWith('62')) {
        const national = cleaned.slice(2);
        return `(+62) ${national.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')}`.trim();
    }
    return raw;
};

const normalizePhone = (input: string) => {
    const cleaned = input.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
        return '62' + cleaned.slice(1);
    }
    return cleaned;
};

const Whatsapp: React.FC = () => {
    const [phoneInput, setPhoneInput] = useState<string>('');
    const [phoneError, setPhoneError] = useState<string | null>('');
    const [userId, setUserId] = useState<string>('');
    const [email, setsetEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [openOTP, setOpenOTP] = useState<boolean>(false);
    const normalized = normalizePhone(phoneInput);
    const validatePhone = (phone: string): boolean => {
        const cleaned = normalizePhone(phone);
        return /^62\d{9,13}$/.test(cleaned); // e.g., 62812xxxxxxx
    };

    useEffect(() => {
        const storedData = localStorage.getItem('dataUser')
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData)
                setUserId(parsedData?.id)
                setsetEmail(parsedData?.email)
            } catch (error) {
                console.error('Failed to parse dataUser from localStorage', error)
            }
        }
    }, [])
    const handleNext = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        setPhoneError(null);

        const normalized = normalizePhone(phoneInput);

        if (!validatePhone(phoneInput)) {
            setPhoneError('Format nomor tidak valid');
            return;
        }
        handleSendOTP(normalized)
    }, [phoneInput]);

    const handleSendOTP = async (normalized?: string) => {
        setLoading(true)
        try {
            const formData = new FormData();
            formData.append('whatsapp', normalized ? normalized : '');
            const res = await Post<Response>('zukses', `otp/${userId}/request-otp`, formData);
            console.log('res', res);
            if (res?.data?.status === 'success') {
                setOpenOTP(true)
                setLoading(false)
            }
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            setPhoneError(error?.response?.data?.message || '');
            setLoading(false)
        }
    };
    return (
        openOTP ? <OtpPage setOpenOTP={setOpenOTP} handleResendOTPMail={handleSendOTP} email={email} type={"whatsapp"} userId={userId} whatsapp={normalized} /> :
            <EmailContainer>
                <ContentContainer>
                    <Content>
                        <Title>Ganti Nomor WhatsApp</Title>
                        <form onSubmit={handleNext}>
                            <FormContainer>
                                <FormGroup>
                                    <Label>Nomor WhatsApp</Label>
                                    <WrapperInputContainer>
                                        <WrapperInput error={!!phoneError}>
                                            <Input
                                                type="text"
                                                value={formatDisplayPhone(phoneInput)}
                                                onChange={(e) => setPhoneInput(e.target.value)}
                                            />
                                        </WrapperInput>
                                        {phoneError && <Error>{phoneError}</Error>}
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

export default Whatsapp;
