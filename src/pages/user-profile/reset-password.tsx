import React, { useState } from 'react'
import UserProfile from '.'
import { ContentResetPassword, HeaderResetPassword, IconResetPasswrd, ResetPasswordContainer } from 'components/Profile/ResetPassword'
import Verify from './Components/Verify'
import CheckPassword from './Components/CheckPassword'
import ChangePassword from './Components/ChangePassword'
import OTPPassword from './Components/OTPPassword'

const ResetPassword = () => {
    const [open, setOpen] = useState<string>('');
    return (
        <UserProfile mode="reset-password">
            <ResetPasswordContainer>
                {
                    open === 'Check Password' ?
                        <HeaderResetPassword>
                            <IconResetPasswrd src='/icon/arrow-left-red.svg' style={{ position: "absolute", cursor: 'pointer' }} onClick={() => setOpen('')} />
                            <p>Masukkan Password Zukses</p>
                        </HeaderResetPassword> : open === 'Change Password' ?
                            <HeaderResetPassword style={{ paddingBottom: "20px", borderBottom: "1px solid #e5e5e5" }}>
                                <b>Ubah Password</b>
                                <p style={{ fontSize: "16px", textAlign: "left", color: "#666666" }}>Untuk keamanan akun anda, mohon untuk tidak menyebarkan password anda ke orang lain</p>
                            </HeaderResetPassword> : open === 'OTP Password' ?
                                <HeaderResetPassword >
                                    <p>Masukkan Kode OTP</p>
                                </HeaderResetPassword> : ''
                }
                <ContentResetPassword>
                    {
                        open === 'Check Password' ?
                            <CheckPassword setOpen={setOpen} /> : open === 'Change Password' ?
                                <ChangePassword setOpen={setOpen} /> : open === 'OTP Password' ?
                                    <OTPPassword setOpen={setOpen} /> : <Verify setOpen={setOpen} />
                    }

                </ContentResetPassword>
            </ResetPasswordContainer>
            {/* <LoadingProtect /> */}
        </UserProfile>
    )
}

export default ResetPassword