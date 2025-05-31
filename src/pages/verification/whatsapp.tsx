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

    const validatePhone = (phone: string): boolean => {
        const cleaned = normalizePhone(phone);
        return /^62\d{9,13}$/.test(cleaned); // e.g., 62812xxxxxxx
    };

    const handleNext = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        setPhoneError(null);

        const normalized = normalizePhone(phoneInput);

        if (!validatePhone(phoneInput)) {
            setPhoneError('Format nomor tidak valid');
            return;
        }

        // Simulasi nomor yang sudah digunakan
        if (normalized === '6281223788627') {
            setPhoneError('Nomor telah digunakan');
            return;
        }

        console.log('Nomor untuk backend:', normalized);
    }, [phoneInput]);

    return (
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
        </EmailContainer>
    );
};

export default Whatsapp;
