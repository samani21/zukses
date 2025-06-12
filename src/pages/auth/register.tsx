import { useState, useEffect } from "react";
import {
    Title,
    CenteredText,
    StyledLink,
    GoogleButton,
    Divider,
    Input,
    ErrorMessage,
    SubmitButton,
    Terms,
    Wrapper,
    IconAuth,
} from "components/layouts/auth";
import AuthLayout from "pages/layouts/AuthLayout";
import { useRouter } from "next/router";
import { Response } from "services/api/types";
import Post from "services/api/Post";

// Validation helpers
const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidPhone = (value: string) =>
    /^(\+62|62|0)8[1-9][0-9]{6,9}$/.test(value);

// Convert local phone numbers to 628 format
const formatPhoneNumberTo62 = (phone: string) => {
    const trimmed = phone.trim();
    if (trimmed.startsWith("+62")) return trimmed.replace("+", "");
    if (trimmed.startsWith("62")) return trimmed;
    if (trimmed.startsWith("0")) return "62" + trimmed.slice(1);
    return trimmed;
};

type PayloadType = 'email' | 'whatsapp' | 'unknown';


function getPayloadType(input: string): PayloadType {
    const trimmedInput = input.trim();

    if (trimmedInput.includes('@') && /\S+@\S+\.\S+/.test(trimmedInput)) {
        return 'email';
    } else if (/^\d+$/.test(trimmedInput)) {
        return 'whatsapp';
    }

    return 'unknown';
}

export default function Register() {
    const [input, setInput] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [showError, setShowError] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const trimmed = input.trim();
        if (!trimmed) {
            setIsValid(false);
            setShowError(false);
        } else if (isValidEmail(trimmed) || isValidPhone(trimmed)) {
            setIsValid(true);
            setShowError(false);
        } else {
            setIsValid(false);
            setShowError(true);
        }
    }, [input]);

    const handleLoginGoogle = () => {
        window.open(`${process.env.NEXT_PUBLIC_API_URL}/auth/google-zukses`, '_blank');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isValid) return;

        try {
            const trimmed = input.trim();
            const isPhone = isValidPhone(trimmed);
            const payload = isPhone ? formatPhoneNumberTo62(trimmed) : trimmed;

            const type = getPayloadType(payload);
            const formData = new FormData();
            formData.append('email_whatsapp', payload);
            formData.append('type', type);

            const res = await Post<Response>('zukses', 'auth/login-otp', formData);

            if (res?.data?.status === 'success') {
                router.push(`/auth/verification-account?${type}=${payload}&type=${type}&user_id=${res?.data?.data}`);
            } else {
                setShowError(true);
            }
        } catch (err) {
            console.error("Error submitting:", err);
            setShowError(true);
        }
    };

    return (
        <AuthLayout>
            <Title className="mobile">
                Daftar dan nikmatin <span>diskon s.d. Rp.30.000</span> di belanja pertamamu
            </Title>
            <Title className="desktop">Daftar Sekarang</Title>

            <CenteredText>
                Sudah punya akun Zukses?{" "}
                <StyledLink onClick={() => router.push('/auth/login')}>Masuk</StyledLink>
            </CenteredText>

            <form style={{ marginTop: "30px" }} onSubmit={handleSubmit}>
                <Wrapper className={showError ? 'error' : ''}>
                    <IconAuth src='/icon/phone.svg' style={{ marginRight: "5px" }} />
                    <Input
                        type="text"
                        placeholder="Contoh: 08123456789"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </Wrapper>
                {showError && (
                    <ErrorMessage>
                        Masukkan nomor HP atau email yang valid
                    </ErrorMessage>
                )}

                <SubmitButton disabled={!isValid}>Daftar</SubmitButton>
            </form>

            <Divider><span>atau daftar dengan</span></Divider>
            <GoogleButton onClick={handleLoginGoogle}>
                <IconAuth src="/icon/google.svg" alt="Google" width="30" />
                <p>Google</p>
            </GoogleButton>

            <Terms>
                Dengan mendaftar, saya menyetujui{" "}
                <a href="#">Syarat & Ketentuan</a> serta{" "}
                <a href="#">Kebijakan Privasi Zukses</a>.
            </Terms>
        </AuthLayout>
    );
}
