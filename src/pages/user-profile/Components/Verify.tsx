import { ButtonVerify, IconResetPasswordContainer, IconResetPasswrd, VerifyContainer } from 'components/Profile/ResetPassword'
import React from 'react'

type Props = {
    setOpen: (value: string) => void;
}

const Verify = ({ setOpen }: Props) => {
    return (
        <VerifyContainer>
            <div>
                <IconResetPasswordContainer>
                    <IconResetPasswrd src="/icon/protect-red.svg" width={150} />
                </IconResetPasswordContainer>
                <p>Untuk keamanan akun, mohon verifikasi identitas kamu dengan salah satu cara di bawah ini.</p>
                <IconResetPasswordContainer>
                    <ButtonVerify onClick={() => setOpen('Check Password')}>
                        <IconResetPasswrd src="/icon/ep--lock.svg" /><span>Verifikasi dengan password</span>
                    </ButtonVerify>
                </IconResetPasswordContainer>
            </div>
        </VerifyContainer>
    )
}

export default Verify