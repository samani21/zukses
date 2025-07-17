import { Eye, EyeOff } from 'lucide-react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import AuthNewLayout from 'pages/layouts/AuthNewLayout';
import { useEffect, useState } from 'react';

type FormErrors = {
    fullName?: string;
    birthDate?: string;
    password?: string;
    confirmPassword?: string;
};

const CompleteRegister: NextPage = () => {
    const router = useRouter();
    const [contact, setContact] = useState<string>('');
    const [fullName, setFullName] = useState('');
    const [gender, setGender] = useState<'Laki-Laki' | 'Perempuan'>('Laki-Laki');
    const [birthDate, setBirthDate] = useState({ day: '', month: '', year: '' });
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState<FormErrors>({});
    useEffect(() => {
        if (router.isReady) {
            const contactParam = router.query.contact;

            if (typeof contactParam === 'string') {
                setContact(contactParam);
                localStorage.setItem('contact', contactParam);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { contact: _, ...restQuery } = router.query;
                router.replace(
                    {
                        pathname: router.pathname,
                        query: restQuery,
                    },
                    undefined,
                    { shallow: true }
                );
            } else {
                // Jika tidak ada di query, coba ambil dari localStorage
                const savedContact = localStorage.getItem('contact');
                if (savedContact) {
                    setContact(savedContact);
                }
            }
        }
    }, [router.isReady]);


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: FormErrors = {};

        if (!fullName.trim()) {
            newErrors.fullName = 'Nama lengkap wajib diisi';
        }

        if (!birthDate.day || !birthDate.month || !birthDate.year) {
            newErrors.birthDate = 'Tanggal lahir wajib diisi';
        }

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
            fullName,
            gender,
            birthDate,
            password,
            confirmPassword,
        });
        router.push('/')
    };


    return (
        <AuthNewLayout>
            <div className="text-left">
                <h2 className="text-[22px] font-bold text-[#444444]">Lengkapi Pendaftaran</h2>
                <p className="mt-2 text-[14px] font-medium text-[#444444]">
                    Sudah punya akun Zukses?{' '}
                    <span
                        className="font-bold text-[14px] text-[#FF2D60] cursor-pointer"
                        onClick={() => router.push('/auth-new/login')}
                    >
                        Masuk
                    </span>
                </p>
            </div>

            <form className="mt-4 space-y-4" onSubmit={handleSubmit} noValidate style={{ letterSpacing: "-0.04em" }}>
                <div className="flex gap-4">
                    <div className="w-full">
                        <label className='text-[#555555] font-bold text-[16px]'>Nomor HP / Email</label>
                        <input
                            type="text"
                            value={contact}
                            readOnly
                            className="w-full border rounded-[10px] h-[50px] text-[16px] mt-2 font-[500] px-3 py-2 bg-[#EEEEEE] border-[#AAAAAA] outline-none"
                        />
                    </div>
                    <div className="w-full">
                        <label className='text-[#555555] font-bold text-[16px]'>Nomor HP / Email</label>
                        <input
                            type="text"
                            placeholder="Nama Lengkap"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full border rounded-[10px] h-[50px] text-[16px] mt-2 font-[500] px-3 py-2 border-[#AAAAAA] outline-none"
                        />
                        {errors.fullName && (
                            <p className="text-red-500 text-[12px] mt-1 px-3">{errors.fullName}</p>
                        )}
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className='w-full'>
                        <label className='text-[#555555] font-bold text-[16px]'>Jenis Kelamin</label>

                        <div className='flex items-center gap-4 mt-2 h-[50px]'>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="Laki-Laki"
                                    checked={gender === 'Laki-Laki'}
                                    onChange={() => setGender('Laki-Laki')}
                                    className="hidden"
                                />
                                <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors 
                ${gender === 'Laki-Laki' ? 'border-[#660077]' : 'border-gray-400'}`}
                                >
                                    {gender === 'Laki-Laki' && <div className="w-2 h-2 rounded-full bg-[#660077]"></div>}
                                </div>
                                <span
                                    className={`text-[14px] text-[#333333] ${gender === 'Laki-Laki' ? 'font-bold' : 'font-normal'
                                        }`}
                                >
                                    Laki-Laki
                                </span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="Perempuan"
                                    checked={gender === 'Perempuan'}
                                    onChange={() => setGender('Perempuan')}
                                    className="hidden"
                                />
                                <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors 
                ${gender === 'Perempuan' ? 'border-[#660077]' : 'border-gray-400'}`}
                                >
                                    {gender === 'Perempuan' && <div className="w-2 h-2 rounded-full bg-[#660077]"></div>}
                                </div>
                                <span
                                    className={`text-[14px] text-[#333333] ${gender === 'Perempuan' ? 'font-bold' : 'font-normal'
                                        }`}
                                >
                                    Perempuan
                                </span>
                            </label>
                        </div>
                    </div>
                    <div className='w-full'>
                        <label className='text-[#555555] font-bold text-[16px]'>Tanggal Lahir</label>
                        <div className=" flex gap-2 mt-2">
                            <select
                                value={birthDate.day}
                                onChange={(e) => setBirthDate({ ...birthDate, day: e.target.value })}
                                className="w-1/3 border rounded-[10px] border-[#AAAAAAAA] outline-none text-[16px] h-[50px] px-2 py-2"
                            >
                                <option value="">Tanggal</option>
                                {[...Array(31)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={birthDate.month}
                                onChange={(e) => setBirthDate({ ...birthDate, month: e.target.value })}
                                className="w-1/3 border rounded-[10px] border-[#AAAAAAAA] outline-none text-[16px] h-[50px] px-2 py-2"
                            >
                                <option value="">Bulan</option>
                                {[
                                    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                                ].map((month, i) => (
                                    <option key={month} value={i + 1}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={birthDate.year}
                                onChange={(e) => setBirthDate({ ...birthDate, year: e.target.value })}
                                className="w-1/3 border rounded-[10px] border-[#AAAAAAAA] outline-none text-[16px] h-[50px] px-2 py-2"
                            >
                                <option value="">Tahun</option>
                                {Array.from({ length: 100 }, (_, i) => 2025 - i).map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {errors.birthDate && (
                            <p className="text-red-500 text-[12px] mt-1 px-3">{errors.birthDate}</p>
                        )}
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="w-full relative">
                        <label className='text-[#555555] font-bold text-[16px]'>Tanggal Lahir</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Masukkan Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-[#AAAAAA] mt-2 h-[50px] border outline-none rounded-[10px] px-3 pr-10 py-2"
                        />
                        <div
                            className="absolute top-[52px] right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </div>
                        <p className="text-[12px] text-[#555555] font-[500] mt-1 px-3" style={{ lineHeight: '121%' }}>
                            Masukkan Minimal 6 Digit Kombinasi Angka dan Huruf<br />
                            <strong>Contoh : Zukses01</strong>
                        </p>
                        {errors.password && (
                            <p className="text-red-500 text-[12px] mt-1 px-3">{errors.password}</p>
                        )}
                    </div>

                    <div className="w-full relative">
                        <label className='text-[#555555] font-bold text-[16px]'>Tanggal Lahir</label>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Ulangi Masukkan Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border rounded-[10px] mt-2 px-3 pr-10 py-2 border-[#AAAAAA] outline-none h-[50px]"
                        />
                        <div
                            className="absolute top-[52px] right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
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
                        className="h-[50px] w-full flex justify-center py-3 px-4 border border-transparent font-bold text-[18px] rounded-[10px] text-white bg-[#0075C9] hover:bg-blue-700"
                    >
                        Daftar
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center text-[14px] font-medium text-[#444444]">
                <p>Dengan mendaftar, saya menyetujui</p>
                <span className="font-bold text-[#FF2D60] cursor-pointer hover:text-red-600">
                    Syarat & Ketentuan
                </span>{' '}
                serta{' '}
                <span className="font-bold text-[#FF2D60] cursor-pointer hover:text-red-600">
                    Kebijakan Privasi Zukses
                </span>
            </div>
        </AuthNewLayout>
    );
};

export default CompleteRegister;
