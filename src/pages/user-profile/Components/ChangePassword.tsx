import {
    AlertLogin,
    ButtonAuth,
    IconInModal,
    IconPassword,
    InputAuth,
    WrapperInput
} from 'components/Auth'
import {
    FormGroup,
    Label,
    Wrapper
} from 'components/Profile/ProfileComponent'
import {
    ChangePasswordContent,
    CheckPasswordContainer
} from 'components/Profile/ResetPassword'
import React, { useState } from 'react'

type Props = {
    setOpen: (value: string) => void
}

const ChangePassword = ({ setOpen }: Props) => {
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')

    const validatePassword = (pwd: string) => {
        const lengthValid = pwd.length >= 8 && pwd.length <= 16
        const hasUpper = /[A-Z]/.test(pwd)
        const hasLower = /[a-z]/.test(pwd)
        const validChars = /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]*$/.test(pwd)
        return lengthValid && hasUpper && hasLower && validChars
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!validatePassword(password)) {
            setError('Password harus terdiri dari 8-16 karakter, mengandung huruf besar dan kecil, serta hanya karakter yang valid.')
            return
        }

        if (password !== confirmPassword) {
            setError('Konfirmasi password tidak sama.')
            return
        }

        setError('')
        setOpen('OTP Password')
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
        </CheckPasswordContainer>
    )
}

export default ChangePassword
