import React, { useState, useEffect } from 'react';
import AuthLayout from '.';
import { OtpInput } from 'reactjs-otp-input';
import {
    ButtonAuth,
    CardAuth,
    CardContainer,
    ContentCard,
    HeadCard,
    IconInModal,
    TextContent,
    TextHeaderCard,
    WhatsAppContainer,
} from 'components/Auth';
import { getUserInfo } from 'services/api/redux/action/AuthAction';

const Verification = () => {
    const [otp, setOtp] = useState('');
    const [user, setUser] = useState<{ whatsapp?: string } | null>(null);

    const handleChange = (value: string) => {
        setOtp(value);
    };

    const formatPhoneNumber = (raw: string): string => {
        const phone = raw.replace(/\D/g, '');

        const local = phone.startsWith('62') ? phone.slice(2) : phone;

        if (local.length < 8) return '(+62) Invalid Number';

        const prefix = local.slice(0, 3);
        const masked = '*****';
        const suffix = local.slice(-3);

        return `(+62) ${prefix}${masked}${suffix}`;
    };

    const handleSubmit = () => {
        alert(`OTP Submitted: ${otp}`);
        // Tambahkan proses validasi/submit ke backend di sini
    };

    useEffect(() => {
        if (otp.length === 6) {
            handleSubmit();
        }
    }, [otp]);

    useEffect(() => {
        const fetchedUser = getUserInfo();
        setUser(fetchedUser);
    }, []);

    return (
        <AuthLayout mode="verification">
            <CardContainer>
                <CardAuth style={{ top: '220px' }}>
                    <HeadCard style={{ justifyContent: 'left' }}>
                        <IconInModal src="/icon/arrow-left-line.svg" />
                        <TextHeaderCard>Masukkan Kode OTP</TextHeaderCard>
                    </HeadCard>
                    <ContentCard>
                        <TextContent>
                            Kode OTP telah dikirim via WhatsApp ke
                        </TextContent>
                        <WhatsAppContainer>
                            <IconInModal src="/icon/whatsapp.svg" />
                            <b>
                                {user?.whatsapp ? formatPhoneNumber(user.whatsapp) : '...'}
                            </b>
                        </WhatsAppContainer>
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            isInputNum
                            shouldAutoFocus
                            inputStyle={styles.otpInput}
                            containerStyle={styles.otpContainer}
                        />

                        <TextContent>
                            Tidak menerima Kode OTP?
                            <br></br>
                            <span>Kirim Ulanag</span> atau coba <span>Metode Lain</span>
                        </TextContent>
                        <ButtonAuth onClick={handleSubmit}>
                            Lanjut
                        </ButtonAuth>
                    </ContentCard>
                </CardAuth>
            </CardContainer>
        </AuthLayout>
    );
};

const styles = {
    otpContainer: {
        justifyContent: 'center',
        marginBottom: '1.2rem',
        marginTop: '50px',
    },
    otpInput: {
        width: '3rem',
        height: '3rem',
        fontSize: '1.5rem',
        borderBottom: '1px solid #ccc',
        margin: '0 0.25rem',
    },
};

export default Verification;
