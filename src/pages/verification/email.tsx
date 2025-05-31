import React, { useState, useCallback } from 'react';
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

const Email: React.FC = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState<string | null>(null);

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

        if (email === 'used@example.com') {
            setEmailError('Email telah digunakan');
            return;
        }

        console.log('Lanjut ke langkah berikutnya dengan email:', email);
    }, [email]);

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
        </EmailContainer>
    );
};

export default Email;
