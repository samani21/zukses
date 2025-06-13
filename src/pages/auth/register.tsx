import { useState, useEffect } from "react";
import {
    Title,
    CenteredText,
    StyledLink,
    GoogleButton,
    Divider,
    ErrorMessage,
    SubmitButton,
    Terms,
    IconAuth,
} from "components/layouts/auth";
import AuthLayout from "pages/layouts/AuthLayout";
import { useRouter } from "next/router";
import { Response } from "services/api/types";
import Post from "services/api/Post";
import { AxiosError } from "axios";
import { Modal } from "components/Modal";
import Loading from "components/Loading";

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
    const [name, setName] = useState("");
    const [isValid, setIsValid] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [typeLogin, setTypeLogin] = useState<string>("");
    const router = useRouter();
    const { login } = router.query as {
        login?: string;
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'exists' | 'not-found' | null>(null);
    useEffect(() => {
        const trimmed = input.trim();
        if (!trimmed || !name.trim()) {
            setIsValid(false);
            setShowError(false);
        } else if ((isValidEmail(trimmed) || isValidPhone(trimmed)) && name.trim().length > 1) {
            setIsValid(true);
            setShowError(false);
        } else {
            setIsValid(false);
            setShowError(true);
        }
    }, [input, name]);

    useEffect(() => {
        if (login) {
            setInput(login);
        }
    }, [login]);

    const handleLoginGoogle = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google-zukses`
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isValid) return;

        try {
            setLoading(true)
            const trimmed = input.trim();
            const isPhone = isValidPhone(trimmed);
            const payload = isPhone ? formatPhoneNumberTo62(trimmed) : trimmed;

            const type = getPayloadType(payload);
            setTypeLogin(type);
            const formData = new FormData();
            formData.append('email_whatsapp', payload);
            formData.append('name', name);
            formData.append('type', type);

            const res = await Post<Response>('zukses', 'auth/register', formData);

            if (res?.data?.status === 'success') {
                router.push(`/auth/verification-account?${type}=${payload}&type=${type}&user_id=${res?.data?.data}`);
            } else {
                setShowError(true);
                setLoading(false)
            }
        } catch (error) {
            // Tangani error 422 secara spesifik
            const err = error as AxiosError<Response>;
            console.log('res', err)
            if (err?.response?.status === 422) {
                const msg = err.response?.data?.message || 'Data tidak valid.';
                console.warn("Validasi gagal:", msg);
                setModalType('exists');
                setIsModalOpen(true);
                // Bisa simpan pesan error ke state jika perlu
                // setErrorMessage(msg);
                setLoading(false)
            } else {
                console.error("Terjadi kesalahan lain:", err);
                setShowError(true);
                setLoading(false)
            }
        }
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setModalType(null), 300);
    }
    const AccountExistsModalContent = () => (
        <div>
            <p className="mb-6">
                Akun sudah terdaftar. Apakah Anda ingin login akun dengan {typeLogin === 'email' ? 'email' : 'whatsapp'} ini?
            </p>
            <div className="space-y-3">
                <button className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer" onClick={() => router.push(`/auth/login?register=${input}`)}>
                    Ya, Login Sekarang
                </button>
                <button
                    onClick={closeModal}
                    className="w-full py-3 font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                    Batal
                </button>
            </div>
        </div>
    );


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
                <div className="relative mt-4">
                    <input
                        id="name" // Tambahkan ID ini agar label bisa mengaktifkan input saat diklik
                        type="text"
                        placeholder=""
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full px-3 py-3 text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 peer"
                    />
                    <label
                        htmlFor="name"
                        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    >
                        Nama User
                    </label>
                </div>
                <div className="relative mt-4 ">
                    <input
                        id="phoneOrEmail"
                        type="text"
                        placeholder=""
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className={`block w-full px-3 py-3 text-gray-900 bg-transparent border rounded-lg appearance-none focus:outline-none focus:ring-2 peer ${showError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            }`}
                    />
                    <label
                        htmlFor="phoneOrEmail"
                        className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2
                        ${showError ? 'text-red-500' : 'text-gray-500 peer-focus:text-blue-600'}
                        peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
                    >
                        Nomor HP atau E-mail
                    </label>
                </div>
                <p className="text-xs text-gray-500 mt-2 ml-1 mb-2">
                    Contoh: 08123456789
                </p>
                {showError && (
                    <ErrorMessage>
                        Masukkan nama dan nomor HP atau email yang valid
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
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={'Akun Ditemukan'}
            >
                {modalType === 'exists' && <AccountExistsModalContent />}
            </Modal>
            {
                loading && <Loading />
            }
        </AuthLayout>
    );
}
