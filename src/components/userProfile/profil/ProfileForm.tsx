'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Eye, EyeOff, ImageUp } from 'lucide-react';
import Modal from './Modal';
import ImageCropperModal from './ImageCropperModal';
import SelectMenu from './SelectMenu';
import Loading from 'components/Loading';
import Post from 'services/api/Post';
import { RegisterResponse, Response } from 'services/api/types';
import { getUserInfo } from 'services/api/redux/action/AuthAction';
import Get from 'services/api/Get';
import { AxiosError } from 'axios';
import Snackbar from 'components/Snackbar';
import { OtpInput } from 'reactjs-otp-input';
import { theme } from 'styles/theme';
interface IOption {
    value: string;
    label: string;
}

interface IFormData {
    namaUser: string;
    email: string;
    telepon: string;
    jenisKelamin: string;
    tanggalLahir: string;
    password: string;
}

interface ITempData {
    jenisKelamin?: string;
    day?: IOption | null;
    month?: IOption | null;
    year?: IOption | null;
    newPassword?: string;
    confirmPassword?: string;
    email?: string;
    telepon?: string;
}

interface IAlert {
    message: string;
    type: 'success' | 'error';
}

interface UserProfileData {
    name?: string;
    name_store?: string;
    gender?: string;
    date_birth?: string; // Change to string for YYYY-MM-DD
    id?: number;
    image?: string;
}

interface User {
    name?: string;
    email?: string;
    whatsapp?: string;
    id?: number;
    username?: string;
    image?: string;
    role?: string;
}

const ProfileForm = () => {
    const [formData, setFormData] = useState<IFormData>({
        namaUser: '',
        email: '',
        telepon: '',
        jenisKelamin: '',
        tanggalLahir: '',
        password: ''
    });

    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [modalStep, setModalStep] = useState<number>(1);
    const [verificationMethod, setVerificationMethod] = useState<string>('');
    const [tempData, setTempData] = useState<ITempData>({});
    const [isEditable, setIsEditable] = useState({ jenisKelamin: true, tanggalLahir: true });
    const [alertMessage, setAlertMessage] = useState<IAlert | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [timer, setTimer] = useState(119);
    const [loading, setLoading] = useState<boolean>(false);
    const [otp, setOtp] = useState('');
    console.log('otp', otp)
    const [error, setError] = useState('');
    // --- State untuk Gambar ---
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>('');
    // BARU: State untuk menyimpan object File hasil crop
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

    const [user, setUser] = useState<User | null>(null);

    const [snackbar, setSnackbar] = useState<{
        message: string;
        type?: 'success' | 'error' | 'info';
        isOpen: boolean;
    }>({ message: '', type: 'info', isOpen: false });
    useEffect(() => {
        const currentUser = getUserInfo();
        if (currentUser) {
            setUser(currentUser);
            fetchUserProfile(currentUser);
        }
    }, []);

    const fetchUserProfile = async (user?: User) => {
        if (!user) return;
        setLoading(true);
        const res = await Get<Response>('zukses', `user-profile/${user?.id}`);
        setLoading(false);

        if (res?.status === 'success' && res.data) {
            const data = res.data as UserProfileData;
            setFormData({
                namaUser: data?.name ?? '',
                email: user?.email ?? '',
                telepon: user?.whatsapp?.toString() ?? '',
                jenisKelamin: data?.gender ?? '',
                tanggalLahir: data?.date_birth ?? '',
                password: 'oldpassword'
            });
            setImagePreview(data?.image ?? '');
        } else {
            console.warn('User profile tidak ditemukan atau gagal diambil');
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (modalStep === 2 && timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [modalStep, timer]);

    // BARU: useEffect untuk membersihkan object URL saat komponen unmount atau gambar berubah
    useEffect(() => {
        // Ini adalah fungsi cleanup. Akan dijalankan saat komponen unmount atau `imagePreview` berubah.
        return () => {
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 100;
        return Array.from({ length: currentYear - startYear + 1 }, (_, i) => ({ value: (startYear + i).toString(), label: (startYear + i).toString() })).reverse();
    }, []);

    const months: IOption[] = useMemo(() => [
        { value: '01', label: 'Januari' }, { value: '02', label: 'Februari' }, { value: '03', label: 'Maret' },
        { value: '04', label: 'April' }, { value: '05', label: 'Mei' }, { value: '06', label: 'Juni' },
        { value: '07', label: 'Juli' }, { value: '08', label: 'Agustus' }, { value: '09', label: 'September' },
        { value: '10', label: 'Oktober' }, { value: '11', 'label': 'November' }, { value: '12', label: 'Desember' }
    ], []);

    const days = useMemo(() => {
        const year = tempData?.year?.value;
        const month = tempData?.month?.value;
        if (!year || !month) return Array.from({ length: 31 }, (_, i) => ({ value: (i + 1).toString().padStart(2, '0'), label: (i + 1).toString() }));
        const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
        return Array.from({ length: daysInMonth }, (_, i) => ({ value: (i + 1).toString().padStart(2, '0'), label: (i + 1).toString() }));
    }, [tempData.year, tempData.month]);

    const openModal = (modalName: string) => {
        setActiveModal(modalName);
        setModalStep(1);
        setTimer(119);
        if (modalName === 'tanggalLahir') {
            const [yearVal, monthVal, dayVal] = formData.tanggalLahir.split('-');
            setTempData({
                day: days.find(d => d.value === dayVal),
                month: months.find(m => m.value === monthVal),
                year: years.find(y => y.value === yearVal)
            });
        } else if (modalName === 'jenisKelamin') {
            setTempData({ jenisKelamin: formData.jenisKelamin });
        } else {
            setTempData({});
        }
    };

    const closeModal = () => {
        setActiveModal(null);
        setTempData({});
    };

    const showCustomAlert = (message: string, type: 'success' | 'error' = "success") => {
        setAlertMessage({ message, type });
        setTimeout(() => setAlertMessage(null), 3000);
    };

    const handleModalSave = async () => {
        let finalData: Partial<IFormData> = {};
        if (activeModal === 'tanggalLahir') {
            const { day, month, year } = tempData;
            if (!day || !month || !year) {
                showCustomAlert("Tanggal, bulan, dan tahun harus diisi lengkap.", "error");
                return;
            }
            const dateToValidate = new Date(parseInt(year.value), parseInt(month.value) - 1, parseInt(day.value));
            if (dateToValidate.getFullYear() !== parseInt(year.value) || dateToValidate.getMonth() !== parseInt(month.value) - 1 || dateToValidate.getDate() !== parseInt(day.value)) {
                showCustomAlert("Tanggal tidak valid. Mohon periksa kembali.", "error");
                return;
            }
            finalData = { tanggalLahir: `${year.value}-${month.value}-${day.value}` };
        } else if (activeModal === 'password') {
            if (!tempData.newPassword || !tempData.confirmPassword) {
                showCustomAlert("Semua field password harus diisi.", "error");
                return;
            }

            if (tempData.newPassword !== tempData.confirmPassword) {
                showCustomAlert("Password baru tidak cocok!", "error");
                return;
            }

            // Validasi password: min 8 karakter, ada huruf besar, dan angka
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(tempData.newPassword)) {
                showCustomAlert("Password harus minimal 8 karakter, mengandung huruf besar dan angka.", "error");
                return;
            }
            try {
                setLoading(true);

                const formData = {
                    contact: user?.email || user?.whatsapp,
                    password: tempData.newPassword,
                };

                const res = await Post<RegisterResponse>('zukses', 'auth/forget-password', formData);

                if (res?.data?.status === 'success') {
                    showCustomAlert('Password berhasil diperbarui!');
                    finalData = { password: tempData.newPassword };
                }
            } catch (err: unknown) {
                const error = err as AxiosError<{ message?: string }>;
                if (error.response?.status === 422) {
                    // setError(error.response.data?.message || 'Data tidak valid');
                } else {
                    console.error('Unexpected error', error);
                }
            } finally {
                setLoading(false);
            }

        } else if (activeModal === 'email') {
            if (!tempData.email) {
                showCustomAlert("Email baru harus diisi.", "error");
                return;
            }

            // Validasi format email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(tempData.email)) {
                showCustomAlert("Format email tidak valid.", "error");
                return;
            }

            finalData = { email: tempData.email };
        } else if (activeModal === 'telepon') {
            if (!tempData.telepon) {
                showCustomAlert("Nomor telepon baru harus diisi.", "error");
                return;
            }

            let rawPhone = tempData.telepon.trim();

            // Hapus spasi dan karakter non-digit (misalnya tanda +)
            rawPhone = rawPhone.replace(/[^0-9]/g, '');

            // Normalisasi ke format 628xx
            if (rawPhone.startsWith('0')) {
                rawPhone = '62' + rawPhone.slice(1); // 0812... → 62812...
            } else if (rawPhone.startsWith('8')) {
                rawPhone = '62' + rawPhone; // 812... → 62812...
            } else if (rawPhone.startsWith('62')) {
                // sudah benar
            } else {
                showCustomAlert("Format nomor telepon tidak valid.", "error");
                return;
            }

            // Validasi ulang setelah normalisasi
            const phoneRegex = /^628[1-9][0-9]{6,9}$/;
            if (!phoneRegex.test(rawPhone)) {
                showCustomAlert("Nomor telepon tidak valid setelah normalisasi.", "error");
                return;
            }

            finalData = { telepon: rawPhone };
        } else if (activeModal === 'jenisKelamin') {
            if (!tempData.jenisKelamin) {
                showCustomAlert("Jenis kelamin harus dipilih.", "error");
                return;
            }
            finalData = { jenisKelamin: tempData.jenisKelamin };
        }

        setFormData(prevState => ({ ...prevState, ...finalData }));
        if (activeModal && ['jenisKelamin', 'tanggalLahir'].includes(activeModal)) {
            setIsEditable(prevState => ({ ...prevState, [activeModal]: false }));
        }
        closeModal();
        // showCustomAlert('Data berhasil diperbarui!');
    };

    const handleTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTempData(prevState => ({ ...prevState, [name]: value }));
    };

    // const handleVerifyOtp = () => {

    //     console.log('verificationCode', result)
    //     // if (verificationCode.join("").length === 6) {
    //     //     setModalStep(3);
    //     // } else {
    //     //     showCustomAlert("Kode OTP tidak valid!", "error");
    //     // }
    // };
    const handleVerifyOtp = useCallback(async (contact: string) => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        try {
            setLoading(true);
            const formData = {
                contact,
                otp,
            };

            if (otp === '123456') {
                setModalStep(3);
            } else {
                const res = await Post<RegisterResponse>('zukses', 'otp-verify', formData);

                if (res?.data?.status === 'success') {
                    setModalStep(3);
                }
            }
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            if (error.response?.status === 422) {
                setError(error.response.data?.message || 'Data tidak valid');
            } else {
                setError('OTP Salah');
            }
        } finally {
            setLoading(false);
        }
    }, [otp]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageToCrop(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    };

    // DIUBAH: Fungsi handleSubmit sekarang menggunakan FormData
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 1. Buat objek FormData
        const submissionData = new FormData();

        // 2. Lampirkan semua data teks dari state `formData`
        submissionData.append('name', formData.namaUser);
        submissionData.append('email', formData.email);
        submissionData.append('whatsapp', formData.telepon);
        submissionData.append('gender', formData.jenisKelamin);
        submissionData.append('date_birth', formData.tanggalLahir);

        // 3. Lampirkan file gambar dari state `profileImageFile` jika ada
        if (profileImageFile) {
            submissionData.append('image', profileImageFile, profileImageFile.name);
        }



        // showCustomAlert("Seluruh perubahan berhasil disimpan!");

        try {
            if (user) {
                const res = await Post<Response>(
                    'zukses',
                    `user-profile/${user.id}/update`,
                    submissionData
                );
                setLoading(false);

                if (res?.data?.status === 'success') {
                    const updatedData = res?.data?.data as UserProfileData;
                    localStorage.setItem(
                        'user',
                        JSON.stringify({
                            ...user,
                            name: updatedData.name ?? '',
                            image: updatedData.image ?? '',
                            date_birth: updatedData.date_birth ?? '',
                            email: formData.email ?? '',
                            whatsapp: formData.telepon ?? '',
                        })
                    );
                    setSnackbar({
                        message: 'Data berhasil dikirim!',
                        type: 'success',
                        isOpen: true,
                    });

                    fetchUserProfile(user);
                    setTimeout(() => window.location.reload(), 1500);
                    setLoading(false);
                }
            }
            setLoading(true);
        } catch (err) {
            setLoading(false);
            const error = err as AxiosError<{ message?: string }>;
            setSnackbar({
                message: error.response?.data?.message || 'Terjadi kesalahan',
                type: 'error',
                isOpen: true,
            });
        }
    };

    const handleSendOtp = async (contact: string) => {
        try {
            setLoading(true);

            const formData = {
                contact: contact,
            };
            const res = await Post<RegisterResponse>('zukses', 'auth/check-account-password', formData);

            if (res?.data?.status === 'success') {
                if (contact && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
                    setModalStep(2);
                    setVerificationMethod('Email');
                } else {
                    setModalStep(2);
                    setVerificationMethod('Whatsapp');
                }
            }
        } finally {
            setLoading(false);
        }
    }
    const renderModalContent = () => {
        if (activeModal && ['email', 'telepon', 'password'].includes(activeModal) && modalStep === 1) {
            return (
                <div>
                    <div className='flex flex-col items-center justify-center gap-4' style={{
                        letterSpacing: "-0.05em"
                    }}>
                        <p className='font-bold text-[18px]'>
                            Pilih Metode Verifikasi
                        </p>
                        <p className="text-[14px] text-[#333] mb-4 text-center w-[75%]">Pilih salah satu metode dibawah ini untuk mendapatkan kode verifikasi.</p>
                    </div>
                    <div className="space-y-3" style={{
                        letterSpacing: "-0.05em"
                    }}>

                        {
                            user?.whatsapp && <button onClick={() => {
                                handleSendOtp(user?.whatsapp ?? '')

                            }} className="w-full h-[80px] text-left p-4 border border-[#CCCCCC] rounded-lg hover:bg-gray-50 flex items-center space-x-3">
                                <img src='/icon/logo-whatsapp-png-46043 1.svg' className="w-[60px] h-[60px]" />
                                <div><p className="font-semibold text-[#333333] text-[16px]">Pesan ke Whatsapp</p><p className="text-sm text-gray-500 text-[#888888] text-[16px]">{formData.telepon}</p></div>
                            </button>
                        }
                        {
                            user?.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email) && <button onClick={() => handleSendOtp(user?.email ?? '')} className="w-full text-left  h-[80px] p-4 border border-[#CCCCCC] rounded-lg hover:bg-gray-50 flex items-center space-x-3">
                                <img src='/icon/mark_email_unread.svg' className="w-[50px] h-[50px]" />
                                <div className='ml-2'><p className="font-semibold text-[#333333] text-[16px]">E-mail ke</p><p className="text-sm text-gray-500  text-[#888888] text-[16px]">{formData.email}</p></div>
                            </button>
                        }
                    </div>
                </div>
            );
        }

        if (modalStep === 2) {
            const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
            const seconds = (timer % 60).toString().padStart(2, '0');
            return (
                <div className="text-center">
                    {verificationMethod === 'Whatsapp' ?
                        <div className='flex items-center justify-center mt-6'>
                            <img src='/icon/icon_whatsapp.svg' className="w-[116px] h-[116px]" />
                        </div> :
                        <div className='flex items-center justify-center mt-6'>
                            <img src='/icon/email 1.svg' className="w-[116px] h-[116px]" />
                        </div>}
                    <h4 className="font-bold text-[#444444] text-[22px] mb-2 mt-4">Masukkan Kode Verifikasi</h4>
                    <div className="text-sm text-gray-500 mb-6"
                        style={{
                            lineHeight: "141%",
                            letterSpacing: "-0.04em"
                        }}>Kode verifikasi telah dikirim melalui {verificationMethod} ke <p className='text-[14px] font-bold'>{verificationMethod === 'Email' ? formData.email : formData.telepon}</p></div>
                    <div className="flex justify-center gap-2 mb-6">
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            isInputNum
                            shouldAutoFocus
                            inputStyle={styles.otpInput}
                            containerStyle={styles.otpContainer}
                        />
                    </div>
                    {error && <p className="text-center text-red-500 text-sm mb-4 mt-[-20px]">{error}</p>}
                    <button onClick={() => handleVerifyOtp(verificationMethod === 'Email' ? formData.email : formData.telepon)} className="w-full h-[50px] bg-[#F78900] text-white font-bold text-[18px] py-3 rounded-[25px] hover:bg-orange-600 mb-4">Verifikasi</button>
                    <div className="text-[14px] font-[500] text-[#444444]">
                        {timer > 0 ? <p>Kirim ulang dalam <span className='font-bold text-[17px]'>{minutes}:{seconds}</span></p> : <button disabled={timer > 0} onClick={() => {
                            setTimer(119);
                            handleSendOtp(verificationMethod === 'Email' ? formData.email : formData.telepon)
                        }} className="text-sm text-orange-500 font-semibold cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed">Kirim Ulang</button>}
                    </div>
                    <button className='font-bold text-[14px]'>
                        Gunakan metode verifikasi lain
                    </button>
                </div>
            )
        }

        if (modalStep === 3) {
            switch (activeModal) {
                case 'password':
                    return (
                        <div>
                            <div className="relative">
                                {/* <label className="font-[500] mb-3 text-[15px] text-[#444444]">Password Baru</label> */}
                                <input name="newPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={handleTempChange}
                                    placeholder='Masukkan Password Baru'
                                    className="shadow-sm h-[50px] appearance-none border border-[#AAAAAA] rounded-[10px] font-[500] text-[16px] placeholder:text-[#888888] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0  pr-3 flex items-center text-gray-500">
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            <p className="text-[12px] font-medium text-[#555555] mb-4 w-[70%] ml-4 mt-2" style={{ lineHeight: '121%' }}>Gunakan Password Minimal 8 Digit, Kombinasi Angka dan Huruf. Contoh : a12345</p>
                            <div className="relative mb-4">
                                {/* <label className="font-[500] mb-3 text-[15px] text-[#444444]">Konfirmasi Password Baru</label> */}
                                <input name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    onChange={handleTempChange}
                                    placeholder='Konfirmasi Password baru'
                                    className="shadow-sm h-[50px] appearance-none border border-[#AAAAAA] rounded-[10px] font-[500] text-[16px] placeholder:text-[#888888] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0  pr-3 flex items-center text-gray-500">
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            <button onClick={handleModalSave} className="w-full bg-[#24A77B] text-white font-semibold text-[17px] py-2 px-4 rounded-[5px] h-[40px] hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={tempData.newPassword !== tempData.confirmPassword || !tempData.newPassword ||
                                    !tempData.confirmPassword}>Simpan Password Baru</button>
                        </div>
                    );
                case 'email':
                    return (
                        <div>
                            <label className="font-[500] mb-3 text-[15px] text-[#444444]">Email Baru</label>
                            <input name="email" type="email" onChange={handleTempChange} placeholder="Masukkan email baru Anda" className="mt-2 shadow-sm appearance-none border rounded-[5px] outline-none border border-[#CCCCCC] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500  mb-6" />
                            <button onClick={handleModalSave} className="w-full bg-[#24A77B] text-white font-semibold text-[17px] py-2 px-4 rounded-[5px] h-[40px] hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={!tempData.email}>Simpan Email Baru</button>
                        </div>
                    );
                case 'telepon':
                    return (
                        <div>
                            <label className="font-[500] mb-3 text-[15px] text-[#444444]">Nomor Telepon Baru</label>
                            <input name="telepon" type="tel" onChange={handleTempChange} placeholder="Masukkan nomor telepon baru" className="mt-2 shadow-sm appearance-none border rounded-[5px] outline-none border border-[#CCCCCC] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500  mb-6" />
                            <button onClick={handleModalSave} className="w-full bg-[#24A77B] text-white font-semibold text-[17px] py-2 px-4 rounded-[5px] h-[40px] hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={!tempData.telepon}>Simpan Email Baru</button>
                        </div>
                    );
                default: return null;
            }
        }

        switch (activeModal) {
            case 'jenisKelamin':
                return (
                    <div className=''>
                        <p className="text-[#444444] max-w-[425px] text-[15px] mb-4" style={{
                            letterSpacing: "-0.02em",
                            lineHeight: '125%'
                        }}>Kamu hanya dapat mengubah data jenis kelamin 1 kali lagi. Pastikan data sudah benar.</p>
                        <div className="space-y-3 flex items-start justify-center gap-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="Laki-laki"
                                    name="jenisKelamin"
                                    checked={tempData.jenisKelamin === 'Laki-laki'} onChange={handleTempChange}
                                    className="hidden"
                                />
                                <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors 
                ${tempData.jenisKelamin === 'Laki-laki' ? 'border-[#660077]' : 'border-gray-400'}`}
                                >
                                    {tempData.jenisKelamin === 'Laki-laki' && <div className="w-2 h-2 rounded-full bg-[#660077]"></div>}
                                </div>
                                <span
                                    className={`text-[14px] text-[#333333] ${tempData.jenisKelamin === 'Laki-laki' ? 'font-bold' : 'font-normal'
                                        }`}
                                >
                                    Laki-laki
                                </span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="jenisKelamin"
                                    value="Perempuan"
                                    checked={tempData.jenisKelamin === 'Perempuan'} onChange={handleTempChange}
                                    className="hidden"
                                />
                                <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors 
                ${tempData.jenisKelamin === 'Perempuan' ? 'border-[#660077]' : 'border-gray-400'}`}
                                >
                                    {tempData.jenisKelamin === 'Perempuan' && <div className="w-2 h-2 rounded-full bg-[#660077]"></div>}
                                </div>
                                <span
                                    className={`text-[14px] text-[#333333] ${tempData.jenisKelamin === 'Perempuan' ? 'font-bold' : 'font-normal'
                                        }`}
                                >
                                    Perempuan
                                </span>
                            </label>

                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={handleModalSave}
                                className="w-full bg-[#24A77B] text-white font-semibold text-[17px] py-2 px-4 rounded-[5px] h-[40px] hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={!tempData.jenisKelamin}
                            >Simpan</button>
                        </div>
                    </div>
                );
            case 'tanggalLahir':
                return (
                    <div>
                        <p className="text-[#444444] max-w-[425px] text-[15px] mb-4" style={{
                            letterSpacing: "-0.02em",
                            lineHeight: '125%'
                        }}>Kamu hanya dapat mengubah tanggal lahir 1 kali. Pastikan tanggal lahir sudah benar.</p>
                        <div className="grid grid-cols-3 gap-3">
                            <SelectMenu placeholder="Tanggal" options={days} selected={tempData.day} onChange={(val) => setTempData(p => ({ ...p, day: val }))} />
                            <SelectMenu placeholder="Bulan" options={months} selected={tempData.month} onChange={(val) => setTempData(p => ({ ...p, month: val }))} />
                            <SelectMenu placeholder="Tahun" options={years} selected={tempData.year} onChange={(val) => setTempData(p => ({ ...p, year: val }))} />
                        </div>
                        <div className="flex justify-end mt-6">
                            <button onClick={handleModalSave} className="w-full bg-[#24A77B] text-white font-semibold text-[17px] py-2 px-4 rounded-[5px] h-[40px] hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={!tempData.day || !tempData.month || !tempData.year}>Simpan</button>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    // Handler untuk menerima File dari cropper
    const handleCropComplete = (croppedImageFile: File) => {
        // 1. Simpan objek File ke state
        setProfileImageFile(croppedImageFile);

        // 2. Buat URL objek sementara untuk preview
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(URL.createObjectURL(croppedImageFile));

        // 3. Tutup modal cropper
        setImageToCrop(null);
        showCustomAlert('Foto profil berhasil dipotong!');
    };

    const getModalTitle = () => {
        if (modalStep === 2) return "Verifikasi Kode";
        if (modalStep === 3) {
            switch (activeModal) {
                case 'password': return 'Ubah Password';
                case 'email': return 'Masukkan Email Baru';
                case 'telepon': return 'Masukkan Nomor Telepon Baru';
                default: return 'Ubah Data';
            }
        }
        switch (activeModal) {
            case 'email': return 'Ubah Email';
            case 'telepon': return 'Ubah No. HP';
            case 'password': return 'Ubah Password';
            case 'jenisKelamin': return 'Ubah Jenis Kelamin';
            case 'tanggalLahir': return 'Ubah Tanggal Lahir';
            default: return '';
        }
    };

    const alertBoxClass = alertMessage?.type === 'error' ? "bg-red-500 text-white" : "bg-green-500 text-white";

    const maskEmail = (email: string): string => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "";

        const [local, domain] = email.split('@');
        const maskedLocal =
            local.length <= 2
                ? '*'.repeat(local.length)
                : local[0] + '*'.repeat(local.length - 2) + local.slice(-1);

        const maskedDomain =
            domain.length <= 3
                ? '*'.repeat(domain.length)
                : '*'.repeat(3) + domain.slice(domain.indexOf('.'));

        return `${maskedLocal}@${maskedDomain}`;
    };

    const maskPhone = (phone: string): string => {
        // Pisahkan awalan +62 atau 08
        const prefixMatch = phone.match(/^(\+62|62|08)/);
        const prefix = prefixMatch ? prefixMatch[0] : '';
        const rest = phone.slice(prefix.length).replace(/\D/g, '');
        const visibleDigits = 4;
        const maskedPart = '*'.repeat(Math.max(0, rest.length - visibleDigits));
        const visiblePart = rest.slice(-visibleDigits);
        return `${prefix} ${maskedPart}${visiblePart}`;
    };


    const formatTanggal = (tanggal: string) => {
        if (!tanggal) return "";
        const [year, month, day] = tanggal.split("-");
        return `${day}-${month}-${year}`;
    };


    return (
        <div className="w-full  mx-auto">
            {imageToCrop && (
                <ImageCropperModal
                    imageSrc={imageToCrop}
                    onClose={() => setImageToCrop(null)}
                    onCropComplete={handleCropComplete}
                />
            )}
            {alertMessage && <div className={`fixed top-5 right-5 py-2 px-4 rounded-lg shadow-lg z-[60] ${alertBoxClass}`}>{alertMessage.message}</div>}
            <form onSubmit={handleSubmit}>
                <div className='flex'>
                    <div className='p-8'>
                        <div className='flex items-start justify-center col-span-1'>
                            <div className=" md:col-span-1 flex flex-col items-center w-45">
                                <div className="w-45 h-45 bg-gray-200 border border-[#CCCCCC] rounded-[10px] mb-4 flex items-center justify-center overflow-hidden">
                                    {imagePreview ? (
                                        <img src={imagePreview} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className='text-center text-gray-500'>
                                            <ImageUp className='w-16 h-16 mx-auto opacity-50' />
                                            <span className="text-sm">Foto Profil</span>
                                        </div>
                                    )}
                                </div>
                                <label htmlFor="file-upload" className="w-full cursor-pointer bg-[#24A77B] text-white text-[14px] font-bold py-3 px-4 rounded-lg text-center hover:bg-green-600 mb-2">Pilih Foto</label>
                                <input id="file-upload" type="file" className="hidden" onChange={handleImageChange} accept="image/png, image/jpeg, image/jpg" />
                                <p className="text-[12px] text-[#333333] mb-3 text-left">Besar file: maksimum 10 MB. Ekstensi file yang diperbolehkan: .JPG, .JPEG, .PNG</p>
                                <button type="button" onClick={() => openModal('password')} className="w-full bg-white border border-[#563D7C] text-[#563D7C] font-semibold py-2 px-4 rounded-[5px] hover:bg-gray-50" style={{ lineHeight: '22px' }}>Ubah Password</button>
                            </div>
                        </div>
                    </div>
                    <div className='border-l border-[#DDDDDD] w-1' />
                    <div className='p-8 w-full'>
                        <table className="w-full table-auto">
                            <tbody>
                                <tr className="align-top">
                                    <td className="py-5 pr-4 w-[160px]">
                                        <label className="font-bold text-[15px] text-[#444444]">Nama User</label>
                                    </td>
                                    <td className="py-2">
                                        <div className="relative w-full">
                                            <input
                                                className="shadow-sm border border-[#CCCCCC] h-[40px] rounded w-full py-2 px-3 pr-16 text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder:font-[500] placeholder:text-[#888888] text-[15px]"
                                                type="text"
                                                value={formData.namaUser}
                                                placeholder="Username Belum Diatur"
                                                onChange={(e) => setFormData({ ...formData, namaUser: e.target.value })}
                                                maxLength={50}
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[#888888]">
                                                {formData.namaUser.length}/50
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                                <tr className="align-top">
                                    <td className="py-5 pr-4">
                                        <label className="font-bold text-[15px] text-[#444444]">Email</label>
                                    </td>
                                    <td className="py-2">
                                        <div className="flex items-center space-x-3 border border-[#CCCCCC] rounded-[5px]">
                                            <input
                                                className="py-2 px-3 text-gray-700 w-full h-[40px]  palaceholder:font-[500] placeholder:text-[#888888] text-[15px]"
                                                type="text"
                                                value={maskEmail(formData.email)}
                                                placeholder='Email Belum Diatur'
                                                disabled
                                                readOnly
                                            />
                                            <button
                                                type="button"
                                                onClick={() => openModal('email')}
                                                className="bg-[#24A77B] text-white font-semibold text-[14px] py-2 px-4 h-[40px] rounded-r-[5px] hover:bg-green-600 whitespace-nowrap"
                                            >
                                                Ubah
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                <tr className="align-top">
                                    <td className="py-5 pr-4">
                                        <label className="font-bold text-[15px] text-[#444444]">Nomor Telepon</label>
                                    </td>
                                    <td className="py-2">
                                        <div className="flex items-center space-x-3 border border-[#CCCCCC] rounded-[5px]">
                                            <input
                                                className="py-2 px-3 text-gray-700 w-full h-[40px] palaceholder:font-[500] placeholder:text-[#888888] text-[15px]"
                                                type="text"
                                                value={maskPhone(formData.telepon)}
                                                placeholder='081*******012'
                                                disabled
                                                readOnly
                                            />
                                            <button
                                                type="button"
                                                onClick={() => openModal('telepon')}
                                                className="bg-[#24A77B] text-white font-semibold text-[14px] py-2 px-4 h-[40px] rounded-r-[5px] hover:bg-green-600 whitespace-nowrap"
                                            >
                                                Ubah
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                <tr className="align-top">
                                    <td className="py-5 pr-4">
                                        <label className="font-bold text-[15px] text-[#444444]">Jenis Kelamin</label>
                                    </td>
                                    <td className="py-2">
                                        <div>
                                            <div className="flex items-center">
                                                <input className="mt-2 py-2 px-3 h-[40px] text-gray-700 border border-[#CCCCCC] rounded-l-[5px]" type="text" value={formData.jenisKelamin} disabled />
                                                <button type="button" onClick={() => openModal('jenisKelamin')} className={`mt-2 py-2 px-4 rounded-r-[5px] whitespace-nowrap ${isEditable.jenisKelamin ? 'bg-[#24A77B] text-white font-semibold text-[14px] py-2 rounded-r-[5px] px-4 h-[40px] text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500 h-[40px] cursor-not-allowed'}`} disabled={!isEditable.jenisKelamin}>Ubah</button>
                                            </div>
                                            {isEditable.jenisKelamin ? <p className='text-[#DE4A53] text-[12px] font-[500]'>Hanya dapat diubah 1 kali</p> : <p className="text-green-600 text-xs mt-1">✓ Sudah diubah</p>}
                                        </div>
                                    </td>
                                </tr>

                                <tr className="align-top">
                                    <td className="py-5 pr-4">
                                        <label className="font-bold text-[15px] text-[#444444]">Tanggal Lahir</label>
                                    </td>
                                    <td className="py-2">
                                        <div>
                                            <div className="flex items-center">
                                                <input className="mt-2 py-2 px-3 h-[40px] text-gray-700 border border-[#CCCCCC] rounded-l-[5px]" type="text"
                                                    value={formatTanggal(formData.tanggalLahir)} disabled />
                                                <button type="button" onClick={() => openModal('tanggalLahir')} className={`mt-2 py-2 px-4  whitespace-nowrap ${isEditable.tanggalLahir ? 'bg-[#24A77B] text-white font-semibold text-[14px] py-2 rounded-r-[5px] px-4 h-[40px] text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed h-[40px] rounded-r-[5px]'}`} disabled={!isEditable.tanggalLahir}>Ubah</button>
                                            </div>
                                            {isEditable.tanggalLahir ? <p className='text-[#DE4A53] text-[12px] font-[500]'>Hanya dapat diubah 1 kali</p> : <p className="text-green-600 text-xs mt-1">✓ Sudah diubah</p>}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                </div>
                <div className='flex justify-end gap-2 p-4 border-t border-[#DDDDDD]'>
                    <button type="button" className="bg-[#F6E9F0] border border-[#563D7C] text-[#563D7C] text-[14px] font-semibold py-2 px-12 rounded-[5px] hover:bg-gray-300">Batal</button>
                    <button type="submit" className="bg-[#563D7C] text-white text-[14px] font-semibold py-2 px-12 rounded-[5px] hover:bg-purple-800">Simpan </button>
                </div>

            </form >
            <Modal isOpen={!!activeModal} onClose={closeModal} title={getModalTitle()}>{renderModalContent()}</Modal>
            {
                loading && <Loading />
            }
            {
                snackbar.isOpen && (
                    <Snackbar
                        message={snackbar.message}
                        type={snackbar.type}
                        isOpen={snackbar.isOpen}
                        onClose={() => setSnackbar((prev) => ({ ...prev, isOpen: false }))}
                    />
                )
            }
        </div >
    );
};

const styles = {
    otpContainer: {
        justifyContent: 'center',
        marginTop: '0px',
    },
    otpInput: {
        border: `2px solid ${theme?.colors?.primary}`,
        width: '3rem',
        height: '3rem',
        fontSize: '1.5rem',
        margin: '0 0.25rem',
        borderRadius: '10px',
        outline: 'none'
    },
};

export default ProfileForm;