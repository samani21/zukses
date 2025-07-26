import { AxiosError } from 'axios';
import Loading from 'components/Loading';
import { ArrowLeft } from 'lucide-react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import AuthNewLayout from 'pages/layouts/AuthNewLayout';
import { useEffect, useState } from 'react';
import Post from 'services/api/Post';
import { RegisterResponse } from 'services/api/types';

// Komponen untuk ikon Google (inline SVG)
const GoogleIcon = () => (
    <svg className="w-[20px] md:w-[25px] h-[20px] md:h-[25px]" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.021,35.596,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

const RegisterPage: NextPage = () => {
    const router = useRouter();
    const [contact, setContact] = useState(''); // State untuk menyimpan nilai input mentah
    const [error, setError] = useState('');
    const [isPhone, setIsPhone] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    // Fungsi validasi yang dijalankan setelah debounce
    const runValidation = (value: string): boolean => {
        setError('');

        if (!value) {
            setIsPhone(false);
            return true;
        }

        // Cek apakah input adalah email
        if (value.includes('@') || /[^0-9+]/.test(value)) {
            setIsPhone(false);
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value.includes('@') && !emailRegex.test(value)) {
                setError('Format E-mail salah.');
                return false;
            }
            return true;
        }

        // Jika bukan email, cek apakah itu nomor HP
        const phoneValidationRegex = /^(08|62|\+62)\d*$/;
        if (phoneValidationRegex.test(value)) {
            setIsPhone(true);
            return true;
        }

        // Jika format awal tidak cocok, tampilkan error
        setIsPhone(false);
        setError('Nomor HP harus diawali dengan 08, 62, atau +62.');
        return false;
    };

    useEffect(() => {
        if (router.isReady) {
            const emailParam = router.query.email as string;
            if (emailParam && !contact) {
                setContact(decodeURIComponent(emailParam));
            }
        }
    }, [router.isReady, router.query.email]);

    useEffect(() => {
        // Lanjutkan dengan validasi debounce jika bukan kredensial demo
        const handler = setTimeout(() => {
            runValidation(contact);
        }, 500); // Tunggu 500ms setelah user berhenti mengetik

        return () => {
            clearTimeout(handler);
        };
    }, [contact, router]); // Tambahkan router ke dependency array

    // Handler untuk tombol Backspace pada input yang sudah kosong (untuk menghapus prefix)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && e.currentTarget.value === '') {
            setContact('');
            setIsPhone(false);
        }
    };

    // Handler untuk perubahan input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const displayedValue = e.target.value;

        if (displayedValue === '') {
            setContact('');
            setIsPhone(false);
            return;
        }

        if (isPhone) {
            if (contact.startsWith('+62')) {
                setContact('+62' + displayedValue);
            } else if (contact.startsWith('62')) {
                setContact('62' + displayedValue);
            } else if (contact.startsWith('08')) {
                setContact('0' + displayedValue);
            } else {
                setContact(displayedValue);
            }
        } else {
            setContact(displayedValue);
        }
    };

    // Fungsi untuk memformat nomor HP ke format '62...' untuk backend
    const formatPhoneNumber = (number: string) => {
        if (number.startsWith('+62')) {
            return '62' + number.substring(3);
        }
        if (number.startsWith('62')) {
            return number;
        }
        if (number.startsWith('08')) {
            return '62' + number.substring(1);
        }
        return number;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isValid = runValidation(contact);

        if (!isValid || !contact) {
            if (!contact) {
                setError("Nomor HP atau E-mail tidak boleh kosong.");
            } else if (!error) {
                setError("Format input tidak valid.");
            }
            return;
        }
        try {
            setLoading(true);

            const formattedNumber = formatPhoneNumber(contact);
            const formData = {
                contact: formattedNumber,
            };

            const res = await Post<RegisterResponse>('zukses', 'auth/check-account', formData);

            if (res?.data?.status === 'success') {
                if (isPhone) {
                    router.push(`/auth/verification?contact=${formattedNumber}&type=daftar`);
                    return;
                } else {
                    router.push(`/auth/verification?contact=${contact}&type=daftar`);
                    return; // Hentikan eksekusi lebih lanjut untuk menghindari validasi yang tidak perlu
                }
            }
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            if (error.response?.status === 422) {
                setError(error.response.data?.message || 'Data tidak valid');
            } else {
                console.error('Unexpected error', error);
            }
        } finally {
            setLoading(false);
        }
    };

    // Menentukan nilai yang akan ditampilkan di input field
    let displayContact = contact;
    if (isPhone) {
        if (contact.startsWith('+62')) {
            displayContact = contact.substring(3);
        } else if (contact.startsWith('62')) {
            displayContact = contact.substring(2);
        } else if (contact.startsWith('08')) {
            displayContact = contact.substring(1);
        }
    }
    const handleLoginGoogle = () => {
        router.push(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`)
    }
    return (
        <AuthNewLayout>
            <div className='fixed top-[10px] left-0 md:hidden px-4'>
                <ArrowLeft className='w-[25px] h-[25px]' onClick={() => router.push('/')} />
            </div>
            <div className="text-center">
                <h2 className="text-[22px] font-bold text-[#444444]">Daftar Sekarang</h2>
                <p className="fixed bottom-0 left-0 w-full bg-[#F1F5F9] py-2 md:py-0 md:bg-white md:relative mt-2 text-[14px] font-medium text-[#444444]">
                    Sudah punya akun Zukses?{' '}
                    <span className="font-bold text-[14px] text-[#FF2D60] cursor-pointer" onClick={() => router.push('/auth/login')}>
                        Masuk
                    </span>
                </p>
            </div>

            <form className="mt-4 space-y-4" onSubmit={handleSubmit} noValidate>
                <div>
                    <label htmlFor="contact" className="sr-only">
                        Nomor HP atau E-mail
                    </label>
                    <div className="relative">
                        {isPhone && (
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">(+62)</span>
                            </div>
                        )}
                        <input
                            id="contact"
                            name="contact"
                            type="text"
                            required
                            value={displayContact}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            className={`appearance-none rounded-[10px] relative block w-full px-3 py-3 border text-[14px] md:text-[16px] ${isPhone ? 'pl-14' : ''} ${error ? 'border-red-500' : 'border-[#AAAAAA]'} placeholder:text-[#999999] placeholder:text-[14px] md:text-[16px] palceholder:text-[#999999] focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                            placeholder="Masukkan Nomor HP atau E-mail"
                            autoComplete='off'
                        />
                    </div>
                    {error && <p className="mt-2 text-[12px] md:text-sm text-red-600 text-center">{error}</p>}
                    {!error && (
                        <p className="mt-1 text-[12px] font-[500] text-[#888888] text-center ml-[-24px] md:ml-0">
                            Contoh: 08123456789 atau email@contoh.com
                        </p>
                    )}
                </div>

                <div>
                    <button
                        type="submit"
                        className="group h-[50px] relative w-full flex justify-center py-3 px-4 border border-transparent font-bold text-[16px] md:text-[18px] rounded-[10px] text-white bg-[#0075C9] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Selanjutnya
                    </button>
                </div>
            </form>

            {/* Pemisah */}
            <div className="my-6 flex items-center justify-center">
                <div className="flex-grow w-[81px] border-t border-[#CCCCCC]"></div>
                <span className="mx-4 text-[12px] md:text-[14px] font-[500] text-[#666666]">atau daftar dengan</span>
                <div className="flex-grow w-[81px] border-t border-[#CCCCCC]"></div>
            </div>

            {/* Tombol Login Google */}
            <div>
                <button
                    type="button"
                    className="w-full h-[50px] inline-flex justify-center items-center py-2 px-4 border border-[#AAAAAA] rounded-[10px] bg-white text-[14px] md:text-[16px] gap-1 font-bold text-[#777777] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleLoginGoogle}
                >
                    <GoogleIcon />
                    Google
                </button>
            </div>

            {/* Syarat & Ketentuan */}
            <div className="mt-6 text-center text-[14px] font-medium text-[#444444]">
                <p>Dengan masuk disini, kamu menyetujui</p>
                <span className="font-bold cursor-pointer text-[#FF2D60] hover:text-red-600">
                    Syarat & Ketentuan
                </span>{' '}
                serta{' '}
                <span className="font-bold cursor-pointer text-[#FF2D60] hover:text-red-600">
                    Kebijakan Privasi Zukses
                </span>
            </div>
            {
                loading && <Loading />
            }
        </AuthNewLayout>
    );
};
export default RegisterPage;