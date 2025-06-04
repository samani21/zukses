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
import React, { useEffect, useState } from 'react'
import Post from 'services/api/Post';
import { getUserInfo } from 'services/api/redux/action/AuthAction';
import { RegisterResponse } from 'services/api/types';

interface User {
    name?: string
    email?: string
    whatsapp?: string
    id?: number
    username?: string
    image?: string
    role?: string
}

type Props = {
    setOpen: (value: string) => void;
}

const CheckPassword = ({ setOpen }: Props) => {
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [user, setUser] = useState<User | null>(null)
    useEffect(() => {
        const currentUser = getUserInfo()
        if (currentUser) {
            setUser(currentUser)
        }
    }, [])
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const formData = new FormData();
            formData.append('email', user?.email ?? ''); // tetap kirim format 62xxxxxxxxxx
            formData.append('password', password);

            const res = await Post<RegisterResponse>('zukses', 'auth/check-password', formData);
            if (res?.data?.status === 'success') {
                setError('')
                // Lanjut ke proses berikutnya (misal: navigate ke halaman reset password)
                setOpen('Change Password')
            }
        } catch {
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
