'use client'
import { AxiosError } from 'axios';
import { CenteredText, Divider, ErrorMessage, IconAuth, StyledLink, Terms, Title } from 'components/layouts/auth'
import { ButtonNext, HelpText, LoginOption } from 'components/layouts/Login';
import Loading from 'components/Loading';
import { Modal } from 'components/Modal';
import { useRouter } from 'next/router';
import AuthLayout from 'pages/layouts/AuthLayout';
import React, { useEffect, useState } from 'react'
import Post from 'services/api/Post';
import { Response } from 'services/api/types';
const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidPhone = (value: string) =>
    /^(\+62|62|0)8[1-9][0-9]{7,12}$/.test(value);
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

const Login = () => {
    const [input, setInput] = useState<string>("");
    const [typeLogin, setTypeLogin] = useState<string>("");
    const [isValid, setIsValid] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'exists' | 'not-found' | null>(null);
    const { register } = router.query as {
        register?: string;
    };
    useEffect(() => {
        const trimmed = input.trim();
        if (trimmed === "") {
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
    useEffect(() => {
        setInput(register ?? '')
    }, [register]);
    const handleLoginGoogle = () => {
        router?.push(`${process.env.NEXT_PUBLIC_API_URL}/auth/google-zukses`)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Mencegah form dari me-refresh halaman
        if (!isValid) return;

        try {
            setLoading(true)
            const trimmed = input.trim();
            const isPhone = isValidPhone(trimmed);
            const payload = isPhone ? formatPhoneNumberTo62(trimmed) : trimmed;

            const type = getPayloadType(payload);
            setTypeLogin(type)
            const formData = new FormData();
            formData.append('email_whatsapp', payload);
            formData.append('type', type);

            const res = await Post<Response>('zukses', 'auth/login-otp', formData);
            console.log('res', res)
            if (res?.data?.status === 'success') {
                setLoading(false)
                router.push(`/auth/verification-account?${type}=${payload}&type=${type}&user_id=${res?.data?.data}`);
            } else {
                setLoading(false)
                setShowError(true);
            }
        } catch (error) {
            // Tangani error 422 secara spesifik
            const err = error as AxiosError<Response>;
            console.log('res', err)
            if (err?.response?.status === 422) {
                const msg = err.response?.data?.message || 'Data tidak valid.';
                console.warn("Validasi gagal:", msg);
                setModalType('not-found');
                setIsModalOpen(true);
                setLoading(false)
                // Bisa simpan pesan error ke state jika perlu
                // setErrorMessage(msg);
            } else {
                console.error("Terjadi kesalahan lain:", err);
                setShowError(true);
                setLoading(false)
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        // Reset tipe modal setelah ditutup agar tidak muncul lagi saat dibuka
        setTimeout(() => setModalType(null), 300);
    }


    // Komponen kecil untuk konten modal "Akun Tidak Ditemukan"
    const AccountNotFoundModalContent = () => (

        <div>
            <p className="mb-6">
                Akun belum terdaftar. Apakah Anda ingin membuat akun baru dengan {typeLogin === 'email' ? 'email' : 'whatsapp'} ini?
            </p>
            <div className="space-y-3">
                <button className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer" onClick={() => router.push(`/auth/register?login=${input}`)}>
                    Ya, Daftar Sekarang
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
            <Title>Login</Title>

            <CenteredText>
                Belum punya akun Zukses?{" "}
                <StyledLink onClick={() => router.push('/auth/register')}>Daftar</StyledLink>
            </CenteredText>

            <form onSubmit={handleSubmit}>
                <div className="relative mt-4">
                    <input
                        id="phoneOrEmail" // Tambahkan ID ini agar label bisa mengaktifkan input saat diklik
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

                <p className="text-xs text-gray-500 mt-2 ml-1">
                    Contoh: 08123456789
                </p>

                {showError && (
                    <ErrorMessage>
                        Masukkan nomor HP atau email yang valid
                    </ErrorMessage>
                )}
                <HelpText>Butuh bantuan?</HelpText>

                <ButtonNext disabled={!isValid}>Selanjutnya</ButtonNext>
            </form>
            <Divider>
                <span>atau masuk dengan</span>
            </Divider>
            <LoginOption onClick={handleLoginGoogle}>
                <IconAuth
                    src="https://img.icons8.com/color/48/000000/google-logo.png"
                    alt="Google"
                />
                <span>Google</span>
            </LoginOption>
            <Terms>
                Dengan masuk di sini, kamu menyetujui{" "}
                <a href="#">Syarat & Ketentuan</a> serta{" "}
                <a href="#">Kebijakan Privasi</a> Zukses.
            </Terms>
            {/* Implementasi Komponen Modal dengan Konten Dinamis */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={modalType === 'exists' ? 'Akun Ditemukan' : 'Akun Belum Terdaftar'}
            >
                {/* Render konten modal berdasarkan state `modalType` */}
                {modalType === 'not-found' && <AccountNotFoundModalContent />}
            </Modal>
            {
                loading && <Loading />
            }
        </AuthLayout>
    );
};

export default Login;
