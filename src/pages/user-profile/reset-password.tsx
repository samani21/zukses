import React, { useState, useEffect } from 'react';
import UserProfile from '.';
import {
    ContentResetPassword,
    HeaderResetPassword,
    IconResetPasswrd,
    ResetPasswordContainer
} from 'components/Profile/ResetPassword';
import Verify from './Components/Verify';
import CheckPassword from './Components/CheckPassword';
import ChangePassword from './Components/ChangePassword';
import OTPPassword from './Components/OTPPassword';
import LoadingProtect from 'components/LoadingProtect';
import { useRouter } from 'next/router';
const ResetPassword = () => {
    const [open, setOpen] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const [password, setPassword] = useState<string>('')
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);


    return (
        <UserProfile mode="reset-password">
            {
                loading ? <LoadingProtect /> :
                    <ResetPasswordContainer>
                        {open === 'Check Password' ? (
                            <HeaderResetPassword>
                                <IconResetPasswrd
                                    src='/icon-old/arrow-left-red.svg'
                                    style={{ position: "absolute", cursor: 'pointer' }}
                                    onClick={() => setOpen('')}
                                />
                                <p>Masukkan Password Zukses</p>
                            </HeaderResetPassword>
                        ) : open === 'Change Password' ? (
                            <HeaderResetPassword style={{ paddingBottom: "20px", borderBottom: "1px solid #e5e5e5" }}>
                                <IconResetPasswrd
                                    src='/icon-old/arrow-left-red.svg'
                                    style={{ position: "absolute", cursor: 'pointer' }}
                                    onClick={() => setOpen('Check Password')}
                                />
                                <p style={{ textAlign: "center", marginBottom: "10px" }}>Ubah Password</p>
                                <p style={{ fontSize: "16px", textAlign: "left", color: "#666666" }}>
                                    Untuk keamanan akun anda, mohon untuk tidak menyebarkan password anda ke orang lain
                                </p>
                            </HeaderResetPassword>
                        ) : open === 'OTP Password' ? (
                            <HeaderResetPassword>
                                <IconResetPasswrd
                                    src='/icon-old/arrow-left-red.svg'
                                    style={{ position: "absolute", cursor: 'pointer' }}
                                    onClick={() => setOpen('Change Password')}
                                />
                                <p>Masukkan Kode OTP</p>
                            </HeaderResetPassword>
                        ) : <HeaderResetPassword>
                            <IconResetPasswrd
                                src='/icon-old/arrow-left-red.svg'
                                style={{ position: "absolute", cursor: 'pointer' }}
                                onClick={() => router.push('/user-profile')}
                            />
                            <p>Reset Password</p>
                        </HeaderResetPassword>}

                        <ContentResetPassword>
                            {open === 'Check Password' ? (
                                <CheckPassword setOpen={setOpen} />
                            ) : open === 'Change Password' ? (
                                <ChangePassword setOpen={setOpen} setInputPassword={setPassword} />
                            ) : open === 'OTP Password' ? (
                                <OTPPassword setOpen={setOpen} password={password} />
                            ) : (
                                <Verify setOpen={setOpen} />
                            )}
                        </ContentResetPassword>
                    </ResetPasswordContainer>
            }
        </UserProfile>
    );
};

export default ResetPassword;
