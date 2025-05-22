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
} from 'components/Auth';
import React, { useState } from 'react';
import AuthLayout from '.';

const Register = () => {
    const [phone, setPhone] = useState('');

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
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const normalized = normalizePhone(phone);
        const formatted = formatPhone(normalized);
        setPhone(formatted); // tampilkan hasil format di input
    };

    return (
        <AuthLayout mode="register">
            <CardContainer>
                <CardAuth style={{ top: '220px' }}>
                    <HeadCard>
                        <TitleAuth>Daftar</TitleAuth>
                    </HeadCard>
                    <ContentCard>
                        <AuthWith style={{ marginTop: '-20px' }}>
                            <Google>
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
                                />
                                {phone?.length > 10 && (
                                    <IconPassword
                                        src='/icon/circle-tick.svg'
                                        style={{ cursor: 'not-allowed' }}
                                    />
                                )}
                            </WrapperInput>
                            <ButtonAuth type="submit">
                                Daftar
                            </ButtonAuth>
                        </form>
                        <TextFooter>
                           Punya akun? <span onClick={() => window.location.href = 'http://localhost:3000/auth/login'}>Log in</span>
                        </TextFooter>
                    </ContentCard>
                </CardAuth>
            </CardContainer>
        </AuthLayout>
    );
};

export default Register;
