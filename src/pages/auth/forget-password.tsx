import { AxiosError } from 'axios';
import Loading from 'components/Loading';
import { Eye, EyeOff } from 'lucide-react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import AuthNewLayout from 'pages/layouts/AuthNewLayout';
import { useEffect, useState } from 'react';
import Post from 'services/api/Post';
import { RegisterResponse } from 'services/api/types';

type FormErrors = {
    password?: string;
    confirmPassword?: string;
};
const ForgetPasswordPage: NextPage = () => {
    const router = useRouter();
    const [contact, setContact] = useState('');
    const [error, setError] = useState('');
    const [isPhone, setIsPhone] = useState(false);
    const [NexSteps, setNexytSteps] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    useEffect(() => {
        if (!router.isReady) return;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const query = { ...router.query };
        let updated = false;

        if (typeof query.contact === 'string') {
            setContact(query.contact);
            delete query.contact;
            updated = true;
        }

        if (query.type === 'next') {
            setNexytSteps(true);
            delete query.type;
            updated = true;
        }

        if (updated) {
            router.replace(
                {
                    pathname: router.pathname,
                    query,
                },
                undefined,
                { shallow: true }
            );
        }
    }, [router.isReady]);
    const runValidation = (value: string): boolean => {
        setError('');

        if (!value) {
            setIsPhone(false);
            return true;
        }

        if (value.includes('@') || /[^0-9+]/.test(value)) {
            setIsPhone(false);
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value.includes('@') && !emailRegex.test(value)) {
                setError('Format E-mail salah.');
                return false;
            }
            return true;
        }

        const phoneRegex = /^(08|62|\+62)\d*$/;
        if (phoneRegex.test(value)) {
            setIsPhone(true);
            return true;
        }

        setIsPhone(false);
        setError('Nomor HP harus diawali dengan 08, 62, atau +62.');
        return false;
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            runValidation(contact);
        }, 500);
        return () => clearTimeout(timeout);
    }, [contact]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && e.currentTarget.value === '') {
            setContact('');
            setIsPhone(false);
        }
    };

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

    const formatPhoneNumber = (number: string) => {
        if (number.startsWith('+62')) return '62' + number.slice(3);
        if (number.startsWith('62')) return number;
        if (number.startsWith('08')) return '62' + number.slice(1);
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

            const res = await Post<RegisterResponse>('zukses', 'auth/check-account-password ', formData);

            if (res?.data?.status === 'success') {
                if (isPhone) {
                    const formatted = formatPhoneNumber(contact);
                    router.push(`/auth/verification?contact=${formatted}&type=lupa`);
                    return;
                } else {
                    router.push(`/auth/verification?contact=${contact}&type=lupa`);
                    return;
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
        setError("Akun tidak ditemukan");
    };
    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: FormErrors = {};
        if (!password) {
            newErrors.password = 'Password wajib diisi';
        } else if (password.length < 6) {
            newErrors.password = 'Password minimal 6 karakter';
        } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
            newErrors.password = 'Password harus mengandung huruf dan angka';
        }


        if (!confirmPassword) {
            newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Password tidak cocok';
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        // jika semua valid, kirim data
        console.log({
            contact,
            password,
            confirmPassword,
        });
        try {
            setLoading(true);

            const formData = {
                contact,
                password,
            };

            const res = await Post<RegisterResponse>('zukses', 'auth/forget-password', formData);

            if (res?.data?.status === 'success') {
                localStorage.setItem('user', JSON.stringify(res?.data?.data));
                localStorage.setItem('token', res?.data?.token || '');
                router.push('/');
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

    let displayContact = contact;
    if (isPhone) {
        if (contact.startsWith('+62')) displayContact = contact.slice(3);
        else if (contact.startsWith('62')) displayContact = contact.slice(2);
        else if (contact.startsWith('08')) displayContact = contact.slice(1);
    }

    return (
        <AuthNewLayout>
            <div className="text-center">
                <h2 className="text-[22px] font-bold text-[#444444]">Lupa Password</h2>
                <p className="mt-2 text-[14px] font-medium text-[#444444]">
                    Belum punya Akun Zukses?{' '}
                    <span
                        className="font-bold text-[14px] text-[#FF2D60] cursor-pointer"
                        onClick={() => router.push('/auth/register')}
                    >
                        Daftar
                    </span>
                </p>
            </div>

            {
                NexSteps ?
                    <form className="mt-6 space-y-6" onSubmit={handleSave} noValidate>
                        <div>
                            <label htmlFor="contact" className="sr-only">
                                Nomor HP atau E-mail
                            </label>
                            <div className="relative bg-[#EEEEEE]">
                                {isPhone && (
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="sm:text-sm">(+62)</span>
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
                                    readOnly
                                    className={`appearance-none rounded-[10px]  relative block w-full px-3  py-3 border text-[16px] ${isPhone ? 'pl-14' : ''} ${error ? 'border-red-500' : 'border-[#AAAAAA]'} placeholder:text-[#999999] placeholder:text-[16px] text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                    placeholder="Masukkan Nomor HP atau E-mail"
                                />
                            </div>
                        </div>
                        <div className='mt-[-10px]'>
                            <div className="w-full relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Masukkan Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border-[#AAAAAA] mt-2 h-[50px] border outline-none rounded-[10px] px-3 pr-10 py-2"
                                />
                                <div
                                    className="absolute top-[35px] right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </div>
                                <p className="text-[12px] text-[#555555] font-[500] mt-1 px-3" style={{ lineHeight: '121%' }}>
                                    Masukkan Minimal 6 Digit Kombinasi Angka dan Huruf<br />
                                    <span>Contoh : Zukses01</span>
                                </p>
                                {errors.password && (
                                    <p className="text-red-500 text-[12px] mt-1 px-3">{errors.password}</p>
                                )}
                            </div>

                            <div className="w-full relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Ulangi Masukkan Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full border rounded-[10px] mt-2 px-3 pr-10 py-2 border-[#AAAAAA] outline-none h-[50px]"
                                />
                                <div
                                    className="absolute top-[35px] right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-[12px] mt-1 px-3">{errors.confirmPassword}</p>
                                )}

                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="group h-[50px] relative w-full flex justify-center py-3 px-4 border border-transparent font-bold text-[18px] rounded-[10px] text-white bg-[#0075C9] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    </form> :
                    <form className="mt-6 space-y-6" onSubmit={handleSubmit} noValidate>
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
                                    className={`appearance-none rounded-[10px] relative block w-full px-3 py-3 border text-[16px] ${isPhone ? 'pl-14' : ''} ${error ? 'border-red-500' : 'border-[#AAAAAA]'} placeholder:text-[#999999] placeholder:text-[16px] text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                    placeholder="Masukkan Nomor HP atau E-mail"
                                />
                            </div>
                            {error && <p className="mt-2 text-sm text-red-600 text-center">{error}</p>}
                            {!error && (
                                <p className="mt-1 text-[12px] font-[500] text-[#888888] text-center">
                                    Contoh: 08123456789 atau email@contoh.com
                                </p>
                            )}
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="group h-[50px] relative w-full flex justify-center py-3 px-4 border border-transparent font-bold text-[18px] rounded-[10px] text-white bg-[#0075C9] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    </form>
            }


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

export default ForgetPasswordPage;
