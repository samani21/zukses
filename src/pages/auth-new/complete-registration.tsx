import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import AuthNewLayout from 'pages/layouts/AuthNewLayout';
import { useEffect, useState } from 'react';
import { Listbox } from '@headlessui/react'
import { ChevronDown } from 'lucide-react'

const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))
const months = [
    { name: 'Januari', value: '1' },
    { name: 'Februari', value: '2' },
    { name: 'Maret', value: '3' },
    { name: 'April', value: '4' },
    { name: 'Mei', value: '5' },
    { name: 'Juni', value: '6' },
    { name: 'Juli', value: '7' },
    { name: 'Agustus', value: '8' },
    { name: 'September', value: '9' },
    { name: 'Oktober', value: '10' },
    { name: 'November', value: '11' },
    { name: 'Desember', value: '12' }
]
const years = Array.from({ length: 100 }, (_, i) => (2025 - i).toString())

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

    useEffect(() => {
        const { day, month, year } = birthDate;

        if (day && month && year) {
            const d = Number(day);
            const m = Number(month);
            const y = Number(year);

            if (!isValidDate(d, m, y)) {
                setErrors((prev) => ({
                    ...prev,
                    birthDate: 'Tanggal lahir tidak valid',
                }));
            } else {
                setErrors((prev) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { birthDate, ...rest } = prev;
                    return rest;
                });
            }
        }
    }, [birthDate]);


    const isValidDate = (d: number, m: number, y: number) => {
        const date = new Date(y, m - 1, d);
        return (
            date.getFullYear() === y &&
            date.getMonth() === m - 1 &&
            date.getDate() === d
        );
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: FormErrors = {};

        if (!fullName.trim()) {
            newErrors.fullName = 'Nama lengkap wajib diisi';
        }

        if (!birthDate.day || !birthDate.month || !birthDate.year) {
            newErrors.birthDate = 'Tanggal lahir wajib diisi';
        } else {
            const day = Number(birthDate.day);
            const month = Number(birthDate.month);
            const year = Number(birthDate.year);

            if (!isValidDate(day, month, year)) {
                newErrors.birthDate = 'Tanggal lahir tidak valid';
            }
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
            <div className='fixed top-0 py-1 left-0 md:hidden px-4 bg-white w-full'>
                <ArrowLeft className='w-[25px] h-[25px]' onClick={() => router.push('/auth-new/register')} />
            </div>
            <div className="text-left pr-4 pl-4 md:pr-0 md:pl-0">
                <h2 className="text-[22px] font-bold text-[#444444]">Lengkapi Pendaftaran</h2>
                <p className="hidden md:block mt-2 text-[14px] font-medium text-[#444444]">
                    Sudah punya akun Zukses?{' '}
                    <span
                        className="font-bold text-[14px] text-[#FF2D60] cursor-pointer"
                        onClick={() => router.push('/auth-new/login')}
                    >
                        Masuk
                    </span>
                </p>
            </div>

            <form className="mt-4 space-y-4 pr-4 pl-4 md:pr-0 md:pl-0" onSubmit={handleSubmit} noValidate style={{ letterSpacing: "-0.04em" }}>
                <div className="md:flex gap-4 ">
                    <div className="w-full mb-4">
                        <label className='text-[#555555] font-bold text-[14px] md:text-[16px]'>Nomor HP / Email</label>
                        <input
                            type="text"
                            value={contact}
                            readOnly
                            className="w-full border rounded-[10px] h-[50px] text-[14px] md:text-[16px] mt-2 font-[500] px-3 py-2 bg-[#EEEEEE] border-[#AAAAAA] outline-none"
                        />
                    </div>
                    <div className="w-full">
                        <label className='text-[#555555] font-bold text-[14px] md:text-[16px]'>Nama Lengkap</label>
                        <input
                            type="text"
                            placeholder="Nama Lengkap"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full border rounded-[10px] h-[50px] text-[14px] md:text-[16px] mt-2 font-[500] px-3 py-2 border-[#AAAAAA] focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 "
                        />
                        {errors.fullName && (
                            <p className="text-red-500 text-[12px] mt-1 px-3">{errors.fullName}</p>
                        )}
                    </div>
                </div>

                <div className="md:flex gap-4">
                    <div className='w-full'>
                        <label className='text-[#555555] font-bold text-[14px] md:text-[16px]'>Jenis Kelamin</label>

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
                        <label className='text-[#555555] font-bold text-[14px] md:text-[16px]'>Tanggal Lahir</label>
                        <div className=" flex gap-2 mt-2">
                            {/* Hari */}
                            <div className="w-[28%]">
                                <Listbox value={birthDate.day} onChange={(val) => setBirthDate({ ...birthDate, day: val })}>
                                    {({ open }) => (
                                        <div className="relative">
                                            <Listbox.Button
                                                className={`w-full h-[50px] rounded-[10px] border ${open ? 'border-blue-500 ring-1 ring-blue-500' : 'border-[#AAAAAA]'
                                                    } px-3 text-left flex items-center justify-between text-[14px]`}
                                            >
                                                {birthDate.day || 'Tanggal'}
                                                <ChevronDown className="w-4 h-4 text-[#666666]" />
                                            </Listbox.Button>
                                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                                {days.map((day) => (
                                                    <Listbox.Option key={day} value={day} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                                                        {day}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </div>
                                    )}
                                </Listbox>

                            </div>

                            {/* Bulan */}
                            <div className="w-1/2">
                                <Listbox value={birthDate.month} onChange={(val) => setBirthDate({ ...birthDate, month: val })}>
                                    {({ open }) => (
                                        <div className="relative">
                                            <Listbox.Button
                                                className={`w-full h-[50px] rounded-[10px] border ${open ? 'border-blue-500 ring-1 ring-blue-500' : 'border-[#AAAAAA]'
                                                    } px-3 text-left flex items-center justify-between text-[14px]`}
                                            >
                                                {birthDate.month ? months[Number(birthDate.month) - 1]?.name : 'Bulan'}
                                                <ChevronDown className="w-4 h-4 text-[#666666]" />
                                            </Listbox.Button>
                                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                                {months.map((month) => (
                                                    <Listbox.Option key={month.value} value={month.value} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                                                        {month.name}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </div>
                                    )}
                                </Listbox>
                            </div>

                            {/* Tahun */}
                            <div className="w-[28%]">
                                <Listbox value={birthDate.year} onChange={(val) => setBirthDate({ ...birthDate, year: val })}>
                                    {({ open }) => (
                                        <div className="relative">
                                            <Listbox.Button
                                                className={`w-full h-[50px] rounded-[10px] border ${open ? 'border-blue-500 ring-1 ring-blue-500' : 'border-[#AAAAAA]'
                                                    } px-3 text-left flex items-center justify-between text-[14px]`}
                                            >
                                                {birthDate.year || 'Tahun'}
                                                <ChevronDown className="w-4 h-4 text-[#666666]" />
                                            </Listbox.Button>
                                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                                {years.map((year) => (
                                                    <Listbox.Option key={year} value={year} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                                                        {year}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </div>
                                    )}

                                </Listbox>
                            </div>
                        </div>

                        {errors.birthDate && (
                            <p className="text-red-500 text-[12px] mt-1 px-3">{errors.birthDate}</p>
                        )}
                    </div>
                </div>

                <div className="md:flex gap-4">
                    <div className="w-full relative mb-4 md:mb-0">
                        <label className='text-[#555555] font-bold text-[14px] md:text-[16px]'>Kata Sandi</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Masukkan Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-[#AAAAAA] mt-2 h-[50px] border rounded-[10px] px-3 pr-10 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
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
                        <label className='text-[#555555] font-bold text-[14px] md:text-[16px]'>Konfirmasi Kata Sandi</label>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Ulangi Masukkan Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border rounded-[10px] mt-2 px-3 pr-10 py-2 border-[#AAAAAA] h-[50px] focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 "
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
                        className="h-[50px] w-full flex justify-center py-3 px-4 border border-transparent font-bold text-[16px] md:text-[18px] rounded-[10px] text-white bg-[#0075C9] hover:bg-blue-700"
                    >
                        Daftar
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center text-[14px] font-medium text-[#444444] pb-4 sm:pb-4">
                <p>Dengan mendaftar, saya menyetujui</p>
                <span className="font-bold text-[#FF2D60] cursor-pointer hover:text-red-600">
                    Syarat & Ketentuan
                </span>{' '}
                serta{' '}
                <span className="font-bold text-[#FF2D60] cursor-pointer hover:text-red-600">
                    Kebijakan Privasi Zukses
                </span>
            </div>
            <div className='w-full bg-[#F1F5F9] py-2 md:hidden'>
                <p className="mt-2 text-[14px] text-center font-medium text-[#444444]">
                    Sudah punya akun Zukses?{' '}
                    <span
                        className="font-bold text-[14px] text-[#FF2D60] cursor-pointer"
                        onClick={() => router.push('/auth-new/login')}
                    >
                        Masuk
                    </span>
                </p>
            </div>
        </AuthNewLayout>
    );
};

export default CompleteRegister;
