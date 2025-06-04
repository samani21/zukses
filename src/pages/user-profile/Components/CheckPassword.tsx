import {
    AlertLogin,
    ButtonAuth,
    IconInModal,
    IconPassword,
    InputAuth,
    WrapperInput
} from 'components/Auth'
import {
    CheckPasswordContainer,
    CheckPasswordContent
} from 'components/Profile/ResetPassword'
import React, { useState } from 'react'


type Props = {
    setOpen: (value: string) => void;
}

const CheckPassword = ({ setOpen }: Props) => {
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Simulasi password benar (misal: 'admin123')
        if (password === 'admin123') {
            setError('')
            // Lanjut ke proses berikutnya (misal: navigate ke halaman reset password)
            setOpen('Change Password')
        } else {
            setError('Password salah, silakan coba lagi.')
        }
    }

    return (
        <CheckPasswordContainer>
            <CheckPasswordContent>
                <form onSubmit={handleSubmit}>
                    {error && (
                        <AlertLogin>
                            <IconInModal src='/icon/alert-error.svg' width={15} />
                            {error}
                        </AlertLogin>
                    )}

                    <WrapperInput>
                        <InputAuth
                            placeholder='Password'
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        />
                        <IconPassword
                            src={showPassword ? '/icon/eye.svg' : '/icon/eye-close.svg'}
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </WrapperInput>

                    <ButtonAuth type='submit'>
                        Konfirmasi
                    </ButtonAuth>
                </form>
            </CheckPasswordContent>
        </CheckPasswordContainer>
    )
}

export default CheckPassword
