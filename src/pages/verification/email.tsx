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
import { useRouter } from 'next/router';

const Email: React.FC = () => {
    const router = useRouter()
    const { search_email, id, name } = router.query;
    const [userId, setUserId] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState<string | null>(null);


    useEffect(() => {
        if (search_email || id || name) {
            if (typeof id === 'string') setUserId(id)
            if (typeof name === 'string') setUserName(name)
            router.replace('/verification/email', undefined, { shallow: true })
        }
    }, [search_email, id, name])

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
        try {
            const formData = new FormData();
            formData.append('email', email ? email : '');
            formData.append('name', userName ? userName : '');
            const res = await Post<Response>('zukses', `send-email/${userId}/verification`, formData);
            console.log('res', res);
            if (res?.data?.status === 'success') {
                // const now = Math.floor(Date.now() / 1000);
                // localStorage.setItem('timeOtp', now.toString());
                // const data = {
                //     name: user?.name,
                //     email: user?.email,
                //     role: user?.role,
                //     id: user?.id,
                //     whatsapp: `${user?.whatsapp}`,
                //     is_active: 0
                // };
                // localStorage.setItem('user', JSON.stringify(data));
                // localStorage.setItem('typeOtp', "email");
                // router.replace('/auth/verification-reset-password');
                // setloading(false)
            }
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            setEmailError('Email telah digunakan');
            console.log('error', error?.response?.data?.message);
        }
    };

    return (
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
        </EmailContainer>
    );
};

export default Email;
