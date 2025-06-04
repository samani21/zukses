import {
    AlertLogin,
    ButtonAuth,
    IconInModal,
    IconPassword,
    InputAuth,
    WrapperInput
} from 'components/Auth'
import Loading from 'components/Loading'
import {
    FormGroup,
    Label,
    Wrapper
} from 'components/Profile/ProfileComponent'
import {
    ChangePasswordContent,
    CheckPasswordContainer
} from 'components/Profile/ResetPassword'
import React, { useEffect, useState } from 'react'
import Post from 'services/api/Post'
import { getUserInfo } from 'services/api/redux/action/AuthAction'
import { RegisterResponse } from 'services/api/types'

type Props = {
    setOpen: (value: string) => void
    setInputPassword: (value: string) => void
}
interface User {
    name?: string
    email?: string
    whatsapp?: string
    id?: number
    username?: string
    image?: string
    role?: string
}

const ChangePassword = ({ setOpen, setInputPassword }: Props) => {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, seLoading] = useState<boolean>(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [user, setUser] = useState<User | null>(null)
    useEffect(() => {
        const currentUser = getUserInfo()
        if (currentUser) {
            setUser(currentUser)
        }
    }, [])
    const validatePassword = (pwd: string) => {
        const lengthValid = pwd.length >= 8 && pwd.length <= 16
        const hasUpper = /[A-Z]/.test(pwd)
        const hasLower = /[a-z]/.test(pwd)
        const validChars = /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]*$/.test(pwd)
        return lengthValid && hasUpper && hasLower && validChars
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validatePassword(password)) {
            setError('Password harus terdiri dari 8-16 karakter, mengandung huruf besar dan kecil, serta hanya karakter yang valid.')
            return
        }

        if (password !== confirmPassword) {
            setError('Konfirmasi password tidak sama.')
            return
        }

        try {
            seLoading(true)
            const email = user?.email ?? '';
            const formData = new FormData();
            formData.append('email', email.includes('@') ? email : '');
            formData.append('whatsapp', String(user?.whatsapp || 0));
            formData.append('name', String(user?.name || 0));

            const res = await Post<RegisterResponse>('zukses', `otp/${user?.id}/request-change-password`, formData);
            if (res?.data?.status === 'success') {
                setError('')
                setOpen('OTP Password')
                setInputPassword(confirmPassword)
                seLoading(false)
            }
        } catch {
            setError('Konfirmasi password tidak sama.')
            seLoading(false)
        }
    }

    return (
        <CheckPasswordContainer style={{ alignItems: 'start', paddingTop: '20px' }}>
            <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <ChangePasswordContent>
                    {error && (
                        <AlertLogin>
                            <IconInModal src='/icon/alert-error.svg' width={15} />
                            {error}
                        </AlertLogin>
                    )}

                    <Wrapper>
                        <Label>Password Baru</Label>
                        <FormGroup>
                            <WrapperInput style={{ marginTop: "0px" }}>
                                <InputAuth
                                    placeholder='Password'
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <IconPassword
                                    src={showPassword ? '/icon/eye.svg' : '/icon/eye-close.svg'}
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </WrapperInput>
                        </FormGroup>
                    </Wrapper>

                    <Wrapper style={{ marginTop: "10px" }}>
                        <Label>Konfirmasi Password</Label>
                        <FormGroup>
                            <WrapperInput style={{ marginTop: "0px" }}>
                                <InputAuth
                                    placeholder='Konfirmasi Password'
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <IconPassword
                                    src={showPassword ? '/icon/eye.svg' : '/icon/eye-close.svg'}
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </WrapperInput>
                        </FormGroup>
                    </Wrapper>

                    <ButtonAuth type='submit'>
                        Konfirmasi
                    </ButtonAuth>
                </ChangePasswordContent>
            </form>
            {
                loading && <Loading />
            }
        </CheckPasswordContainer>
    )
}

export default ChangePassword
