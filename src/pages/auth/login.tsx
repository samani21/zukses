import { AuthWith, ButtonAuth, CardAuth, CardContainer, ContentCard, Facebook, ForgetPassword, Google, HeadCard, IconPassword, IconSocial, InputAuth, Line, OrContainer, Rectangle, RightHeaderCard, SwitchLogo, TextFooter, TextSwtichAuth, TitleAuth, WrapperInput } from 'components/Auth'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthLayout from '.'

type Props = {}

const Login = (props: Props) => {
    const [showPassword, setShowPassword] = useState<Boolean>(false);
    return (
        <AuthLayout mode="login">
            <CardContainer>
                <CardAuth>
                    <HeadCard>
                        <TitleAuth>Log in</TitleAuth>
                        <RightHeaderCard>
                            <TextSwtichAuth>Log in dengan QR</TextSwtichAuth>
                            <Rectangle />
                            <SwitchLogo src='/icon/qr-code.svg' />
                        </RightHeaderCard>
                    </HeadCard>
                    <ContentCard>
                        <form>
                            <WrapperInput style={{ marginTop: "0px" }}>
                                <InputAuth placeholder='No. Handphone/Username/Email' />
                            </WrapperInput>
                            <WrapperInput>
                                <InputAuth placeholder='No. Handphone/Username/Email' type={showPassword ? 'text' : 'password'} />
                                <IconPassword src={showPassword ? '/icon/eye.svg' : '/icon/eye-close.svg'} onClick={() => setShowPassword(!showPassword)} />
                            </WrapperInput>
                            <ButtonAuth>
                                LOG IN
                            </ButtonAuth>
                        </form>
                        <ForgetPassword>Lupa Password</ForgetPassword>
                        <OrContainer>
                            <Line />
                            Atau
                            <Line />
                        </OrContainer>
                        <AuthWith>
                            <Facebook>
                                <IconSocial src='/icon/facebook.png' width={20} />
                                Facebook
                            </Facebook>
                            <Google>
                                <IconSocial src='/icon/google.webp' width={30} />
                                Google
                            </Google>
                        </AuthWith>
                        <TextFooter>
                            Baru di Shopee? <span>Daftar</span>
                        </TextFooter>
                    </ContentCard>
                </CardAuth>
            </CardContainer>
        </AuthLayout>
    )
}

export default Login