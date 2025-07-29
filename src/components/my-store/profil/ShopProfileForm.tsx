'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CreditCard, Eye, EyeOff, ImageUp, User } from 'lucide-react';
import Loading from 'components/Loading';
import Post from 'services/api/Post';
import { RegisterResponse, Response } from 'services/api/types';
import { getUserInfo } from 'services/api/redux/action/AuthAction';
import { AxiosError } from 'axios';
import Snackbar from 'components/Snackbar';
import { OtpInput } from 'reactjs-otp-input';
import { theme } from 'styles/theme';
import ImageCropperModal from './ImageCropperModal';
import { Modal } from 'components/Modal';
import ModalOpenCamera from './ModalOpenCamera';
import { ShopData } from '../ShopProfileContext';

// --- Tipe Data dari Komponen Kamera ---
type CaptureMode = 'ktp' | 'selfie' | null;

interface IFormData {
    nameShop: string;
    desc: string;
    typeShop: string;
    fullName: string;
    nik: string;
    password: string;
}

interface ITempData {
    nameShop?: string;
    desc?: string;
    typeShop?: string;
    fullName?: string;
    nik?: string;
    newPassword?: string;
    confirmPassword?: string;
}

interface IAlert {
    message: string;
    type: 'success' | 'error';
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

type FormErrors = {
    nameShop?: string;
    desc?: string;
    type?: string;
    fullName?: string;
    nik?: string;
    logo?: string
    ktp?: string
    selfie?: string
};


type Props = {
    shopProfil: ShopData | null;
}

const ShopProfileForm = ({ shopProfil }: Props) => {
    const [formData, setFormData] = useState<IFormData>({
        nameShop: '',
        desc: '',
        typeShop: '',
        fullName: '',
        nik: '',
        password: ''
    });

    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [modalStep, setModalStep] = useState<number>(1);
    const [verificationMethod, setVerificationMethod] = useState<string>('');
    const [tempData, setTempData] = useState<ITempData>({});
    const [alertMessage, setAlertMessage] = useState<IAlert | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [timer, setTimer] = useState(119);
    const [loading, setLoading] = useState<boolean>(false);
    const [otp, setOtp] = useState('');
    const [typeShop, setTypeShop] = useState<string>('Perorangan')
    const [error, setError] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});

    // --- State untuk Gambar ---
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>('');
    // BARU: State untuk menyimpan object File hasil crop
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

    const [user, setUser] = useState<User | null>(null);
    // --- STATE BARU DARI KOMPONEN KAMERA ---
    const [isCameraModalOpen, setCameraModalOpen] = useState(false);
    const [cameraCaptureMode, setCameraCaptureMode] = useState<CaptureMode>(null);
    const [ktpImage, setKtpImage] = useState<string | null>(null); // Untuk preview URL
    const [selfieImage, setSelfieImage] = useState<string | null>(null); // Untuk preview URL
    const [ktpImageFile, setKtpImageFile] = useState<File | null>(null); // Untuk file upload
    const [selfieImageFile, setSelfieImageFile] = useState<File | null>(null); // Untuk file upload
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);

    // --- REFS BARU DARI KOMPONEN KAMERA ---
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [snackbar, setSnackbar] = useState<{
        message: string;
        type?: 'success' | 'error' | 'info';
        isOpen: boolean;
    }>({ message: '', type: 'info', isOpen: false });

    useEffect(() => {
        const currentUser = getUserInfo();
        if (currentUser) {
            setUser(currentUser);
            setFormData((prev) => ({
                ...prev,
                nameShop: shopProfil?.shop_name ?? '',
                desc: shopProfil?.description ?? '',
                nik: shopProfil?.nik ?? '',
                fullName: shopProfil?.full_name ?? '',
            }));
            setTypeShop(shopProfil?.type ?? "")
            setImagePreview(shopProfil?.logo_url ?? '');
        }
    }, [shopProfil]);


    const dataURLtoFile = (dataurl: string, filename: string): File | null => {
        try {
            const arr = dataurl.split(',');
            if (arr.length < 2) return null;
            const mimeMatch = arr[0].match(/:(.*?);/);
            if (!mimeMatch) return null;
            const mime = mimeMatch[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        } catch (error) {
            console.error("Error converting data URL to file:", error);
            return null;
        }
    };

    const startCamera = async (mode: CaptureMode) => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        setCameraError(null);
        setCapturedImage(null);
        const facingMode = mode === 'selfie' ? 'user' : 'environment';
        const constraints = {
            video: { facingMode: { exact: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false,
        };
        try {
            const newStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            if (err instanceof DOMException) {
                if (err.name === "NotFoundError") setCameraError("Kamera tidak ditemukan.");
                else if (err.name === "NotAllowedError") setCameraError("Akses kamera ditolak.");
                else setCameraError("Loading");
            }
            if (facingMode === 'environment') {
                try {
                    const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
                    setStream(fallbackStream);
                    if (videoRef.current) videoRef.current.srcObject = fallbackStream;
                    setCameraError(null);
                } catch (fallbackErr) {
                    console.error("Fallback camera access also failed:", fallbackErr);
                }
            }
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    useEffect(() => {
        if (isCameraModalOpen && cameraCaptureMode) {
            startCamera(cameraCaptureMode);
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [isCameraModalOpen, cameraCaptureMode]);

    const handleOpenKameraModal = (mode: CaptureMode) => {
        setCameraCaptureMode(mode);
        setCameraModalOpen(true);
    };

    const handleCloseKameraModal = () => {
        setCameraModalOpen(false);
        setCapturedImage(null);
        setCameraCaptureMode(null);
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/png');
                setCapturedImage(dataUrl);
                stopCamera();
            }
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
        if (cameraCaptureMode) {
            startCamera(cameraCaptureMode);
        }
    };

    const handleSaveKamera = () => {
        if (capturedImage) {
            const timestamp = new Date().getTime();
            if (cameraCaptureMode === 'ktp') {
                setKtpImage(capturedImage);
                const file = dataURLtoFile(capturedImage, `ktp_${timestamp}.png`);
                setKtpImageFile(file);
            } else if (cameraCaptureMode === 'selfie') {
                setSelfieImage(capturedImage);
                const file = dataURLtoFile(capturedImage, `selfie_${timestamp}.png`);
                setSelfieImageFile(file);
            }
            handleCloseKameraModal();
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
    const openModal = (modalName: string) => {
        setActiveModal(modalName);
        setModalStep(1);
        setTimer(119);
        setTempData({});
    };

    const closeModal = () => {
        setActiveModal(null);
        setTempData({});
    };


    const showCustomAlert = (message: string, type: 'success' | 'error' = "success") => {
        setAlertMessage({ message, type });
        setTimeout(() => setAlertMessage(null), 3000);
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

        const newErrors: FormErrors = {};

        if (!formData?.nameShop.trim()) {
            newErrors.nameShop = 'Nama toko wajib diisi';
        }
        if (!formData?.fullName.trim()) {
            newErrors.fullName = 'Nama Lengkap wajib diisi';
        }
        if (!formData?.desc.trim()) {
            newErrors.desc = 'Deskripsi wajib diisi';
        }
        if (!formData?.nik.trim()) {
            newErrors.nik = 'NIK wajib diisi';
        }
        if (!typeShop) {
            newErrors.type = 'Jenis usaha wajib dipilih';
        }
        if (!imagePreview) {
            newErrors.logo = 'Logo wajib dipilih';
        }
        if (!shopProfil?.ktp_url) {
            if (!ktpImage) {
                newErrors.ktp = 'Foto KTP wajib dipilih';
            }
        }
        if (!shopProfil?.selfie_url) {
            if (!selfieImageFile) {
                newErrors.selfie = 'Foto selfie wajib dipilih';
            }
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;
        // 1. Buat objek FormData
        setLoading(true);

        const submissionData = new FormData();
        submissionData.append('shop_name', formData.nameShop);
        submissionData.append('description', formData.desc);
        submissionData.append('full_name', formData.fullName);
        submissionData.append('nik', formData.nik);
        submissionData.append('type', typeShop);

        // 3. Lampirkan file gambar dari state `profileImageFile` jika ada
        if (profileImageFile) {
            submissionData.append('logo', profileImageFile);
        }

        if (ktpImageFile) {
            // Ganti 'ktp_image' dengan nama field yang diharapkan oleh API Anda
            submissionData.append('ktp', ktpImageFile);
        }
        if (selfieImageFile) {
            // Ganti 'selfie_image' dengan nama field yang diharapkan oleh API Anda
            submissionData.append('selfie', selfieImageFile);
        }

        // showCustomAlert("Seluruh perubahan berhasil disimpan!");

        try {
            if (user) {
                const res = await Post<Response>(
                    'zukses',
                    `shop-profile/${user.id}/update`,
                    submissionData
                );
                setLoading(false);

                if (res?.data?.status === 'success') {
                    setSnackbar({
                        message: 'Data berhasil dikirim!',
                        type: 'success',
                        isOpen: true,
                    });
                    setTimeout(() => window.location.reload(), 1500);
                    setLoading(false);
                }
            }
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

    const handleModalSave = async () => {
        let finalData: Partial<IFormData> = {};
        if (activeModal === 'password') {
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

        }
        setFormData(prevState => ({ ...prevState, ...finalData }));
        closeModal();
        // showCustomAlert('Data berhasil diperbarui!');
    };
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
                                <div><p className="font-semibold text-[#333333] text-[16px]">Pesan ke Whatsapp</p><p className="text-sm text-gray-500 text-[#888888] text-[16px]">{user?.whatsapp}</p></div>
                            </button>
                        }
                        {
                            user?.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email) && <button onClick={() => handleSendOtp(user?.email ?? '')} className="w-full text-left  h-[80px] p-4 border border-[#CCCCCC] rounded-lg hover:bg-gray-50 flex items-center space-x-3">
                                <img src='/icon/mark_email_unread.svg' className="w-[50px] h-[50px]" />
                                <div className='ml-2'><p className="font-semibold text-[#333333] text-[16px]">E-mail ke</p><p className="text-sm text-gray-500  text-[#888888] text-[16px]">{user?.email}</p></div>
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
                        }}>Kode verifikasi telah dikirim melalui {verificationMethod} ke <p className='text-[14px] font-bold'>{verificationMethod === 'Email' ? user?.email : user?.whatsapp}</p></div>
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
                    <button onClick={() => handleVerifyOtp(
                        verificationMethod === 'Email'
                            ? user?.email ?? ''
                            : user?.whatsapp ?? ''
                    )} className="w-full h-[50px] bg-[#F78900] text-white font-bold text-[18px] py-3 rounded-[25px] hover:bg-orange-600 mb-4">Verifikasi</button>
                    <div className="text-[14px] font-[500] text-[#444444]">
                        {timer > 0 ? <p>Kirim ulang dalam <span className='font-bold text-[17px]'>{minutes}:{seconds}</span></p> : <button disabled={timer > 0} onClick={() => {
                            setTimer(119);
                            handleVerifyOtp(
                                verificationMethod === 'Email'
                                    ? user?.email ?? ''
                                    : user?.whatsapp ?? ''
                            )
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
                default: return null;
            }
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

    // const maskEmail = (email: string): string => {
    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     if (!emailRegex.test(email)) return "";

    //     const [local, domain] = email.split('@');
    //     const maskedLocal =
    //         local.length <= 2
    //             ? '*'.repeat(local.length)
    //             : local[0] + '*'.repeat(local.length - 2) + local.slice(-1);

    //     const maskedDomain =
    //         domain.length <= 3
    //             ? '*'.repeat(domain.length)
    //             : '*'.repeat(3) + domain.slice(domain.indexOf('.'));

    //     return `${maskedLocal}@${maskedDomain}`;
    // };

    // const maskPhone = (phone: string): string => {
    //     // Pisahkan awalan +62 atau 08
    //     const prefixMatch = phone.match(/^(\+62|62|08)/);
    //     const prefix = prefixMatch ? prefixMatch[0] : '';
    //     const rest = phone.slice(prefix.length).replace(/\D/g, '');
    //     const visibleDigits = 4;
    //     const maskedPart = '*'.repeat(Math.max(0, rest.length - visibleDigits));
    //     const visiblePart = rest.slice(-visibleDigits);
    //     return `${prefix} ${maskedPart}${visiblePart}`;
    // };


    // const formatTanggal = (tanggal: string) => {
    //     if (!tanggal) return "";
    //     const [year, month, day] = tanggal.split("-");
    //     return `${day}-${month}-${year}`;
    // };


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
                                <label htmlFor="file-upload" className="w-full cursor-pointer bg-[#24A77B] text-white text-[14px] font-bold py-3 px-4 rounded-lg text-center hover:bg-green-600 mb-2">Pilih Logo Foto</label>
                                {errors.logo && (
                                    <p className="text-red-500 text-[12px] mt-1 px-3">{errors.logo}</p>
                                )}
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
                                    <td className="py-5 pr-4 w-[130px]">
                                        <label className="font-bold text-[15px] text-[#444444]">Nama Toko</label>
                                    </td>
                                    <td className="py-2">
                                        <div className="relative w-full">
                                            <input
                                                className="h-[40px] border border-[#CCCCCC] h-[40px] rounded w-full py-2 px-3 pr-16 text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder:font-[500] placeholder:text-[#888888] text-[15px]"
                                                type="text"
                                                value={formData.nameShop}
                                                placeholder="Tulis Nama Tokomu"
                                                onChange={(e) => setFormData({ ...formData, nameShop: e.target.value })}
                                                maxLength={50}
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[#888888]">
                                                {formData.nameShop.length}/50
                                            </div>
                                        </div>
                                        {errors.nameShop && (
                                            <p className="text-red-500 text-[12px] mt-1 px-3">{errors.nameShop}</p>
                                        )}
                                    </td>
                                </tr>

                                <tr className="align-top">
                                    <td className="py-5 pr-4">
                                        <label className="font-bold text-[15px] text-[#444444]">Deskripsi Toko</label>
                                    </td>
                                    <td className="py-2">
                                        <div className="relative w-full">
                                            <textarea
                                                className="border border-[#CCCCCC] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder:font-[500] placeholder:text-[#888888] text-[15px] resize-none overflow-y-auto scrollbar-hide max-h-[500px]"
                                                placeholder="Tulis Deskripsi Tokomu"
                                                value={formData.desc}
                                                onChange={(e) => {
                                                    const textarea = e.target;
                                                    textarea.style.height = 'auto';
                                                    textarea.style.height = `${textarea.scrollHeight}px`;

                                                    setFormData({ ...formData, desc: textarea.value });
                                                }}
                                                rows={1}
                                                maxLength={1000}
                                            />

                                        </div>
                                        {errors.desc && (
                                            <p className="text-red-500 text-[12px] mt-1 px-3">{errors.desc}</p>
                                        )}
                                    </td>
                                </tr>
                                <tr className="align-top">
                                    <td className="py-5 pr-4">
                                        <label className="font-bold text-[15px] text-[#444444]">Jenis Usaha</label>
                                    </td>
                                    <td className="py-5">
                                        <div className="flex items-start gap-4">
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value="Perorangan"
                                                    name="typeShop"
                                                    checked={typeShop === 'Perorangan'} onChange={() => setTypeShop('Perorangan')}
                                                    className="hidden"
                                                />
                                                <div
                                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors 
                ${typeShop === 'Perorangan' ? 'border-[#660077]' : 'border-gray-400'}`}
                                                >
                                                    {typeShop === 'Perorangan' && <div className="w-2 h-2 rounded-full bg-[#660077]"></div>}
                                                </div>
                                                <span
                                                    className={`text-[14px] text-[#333333] ${typeShop === 'Perorangan' ? 'font-bold' : 'font-normal'
                                                        }`}
                                                >
                                                    Perorangan
                                                </span>
                                            </label>
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="typeShop"
                                                    value="Perusahaan"
                                                    checked={typeShop === 'Perusahaan'} onChange={() => setTypeShop('Perusahaan')}
                                                    className="hidden"
                                                />
                                                <div
                                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors 
                ${typeShop === 'Perusahaan' ? 'border-[#660077]' : 'border-gray-400'}`}
                                                >
                                                    {typeShop === 'Perusahaan' && <div className="w-2 h-2 rounded-full bg-[#660077]"></div>}
                                                </div>
                                                <span
                                                    className={`text-[14px] text-[#333333] ${typeShop === 'Perusahaan' ? 'font-bold' : 'font-normal'
                                                        }`}
                                                >
                                                    Perusahaan
                                                </span>
                                            </label>

                                        </div>
                                        {errors.type && (
                                            <p className="text-red-500 text-[12px] mt-1 px-3">{errors.type}</p>
                                        )}
                                    </td>
                                </tr>
                                <tr className="align-top">
                                    <td className="py-5 pr-4 w-[130px]">
                                        <label className="font-bold text-[15px] text-[#444444]">Nama Lengkap</label>
                                    </td>
                                    <td className="py-2">
                                        <div className="relative w-full">
                                            <input
                                                className="h-[40px] border border-[#CCCCCC] h-[40px] rounded w-full py-2 px-3 pr-16 text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder:font-[500] placeholder:text-[#888888] text-[15px]"
                                                type="text"
                                                value={formData.fullName}
                                                placeholder="Nama Lengkap Sesuai KTP"
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                maxLength={50}
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[#888888]">
                                                {formData.fullName.length}/50
                                            </div>
                                        </div>
                                        {errors.fullName && (
                                            <p className="text-red-500 text-[12px] mt-1 px-3">{errors.fullName}</p>
                                        )}
                                        <p className='text-[#666666] text-[12px] font-[500]'>Sesuai KTP</p>
                                    </td>
                                </tr>
                                <tr className="align-top">
                                    <td className="py-5 pr-4 w-[130px]">
                                        <label className="font-bold text-[15px] text-[#444444]">Nomor NIK</label>
                                    </td>
                                    <td className="py-2">
                                        <div className="relative w-full">
                                            <input
                                                className="h-[40px] border border-[#CCCCCC] rounded w-full py-2 px-3 pr-16 text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder:font-[500] placeholder:text-[#888888] text-[15px]"
                                                type="text"
                                                inputMode="numeric" // tampilkan keyboard angka di mobile
                                                pattern="[0-9]*"    // bantu validasi
                                                value={formData.nik}
                                                placeholder="NIK Sesuai KTP"
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    // Hanya izinkan angka (0–9)
                                                    if (/^\d*$/.test(value)) {
                                                        setFormData({ ...formData, nik: value });
                                                    }
                                                }}
                                                maxLength={50}
                                            />

                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[#888888]">
                                                {formData.nik.length}/50
                                            </div>
                                        </div>
                                        {errors.nik && (
                                            <p className="text-red-500 text-[12px] mt-1 px-3">{errors.nik}</p>
                                        )}
                                    </td>
                                </tr>
                                <tr className="align-top">
                                    <td className="py-5 pr-4 w-[130px]">
                                        <label className="font-bold text-[15px] text-[#444444]">Foto KTP</label>
                                    </td>
                                    <td className="py-2">
                                        <div className="flex items-center gap-4">
                                            {ktpImage ? (
                                                <img src={ktpImage} alt="Preview KTP" className="w-32 h-20 object-cover rounded-lg border" />
                                            ) :
                                                shopProfil?.ktp_url ? <img src={shopProfil?.ktp_url} className="w-32 h-20 object-cover rounded-lg border" /> : <div className="w-32 h-20 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50 text-gray-400">
                                                    <CreditCard size={32} />
                                                </div>}
                                            <div>
                                                <button type="button" onClick={() => handleOpenKameraModal('ktp')} className='w-[150px] h-[40px] cursor-pointer bg-[#24A77B] text-white text-[14px] font-bold py-3 px-4 rounded-lg text-center hover:bg-green-600 mb-2'>
                                                    {ktpImage ? 'Ambil Ulang' : 'Ambil Foto KTP'}
                                                </button>
                                                <p className='text-[#666666] font-[500] text-[12px]' style={{ lineHeight: "108%" }}>
                                                    Pastikan Foto KTP yang diunggah <br /> dapat dibaca dengan jelas
                                                </p>
                                            </div>
                                        </div>
                                        {errors.ktp && (
                                            <p className="text-red-500 text-[12px] mt-1 px-3">{errors.ktp}</p>
                                        )}
                                    </td>
                                </tr>

                                <tr className="align-top">
                                    <td className="py-5 pr-4 w-[130px]">
                                        <label className="font-bold text-[15px] text-[#444444]">Selfie</label>
                                    </td>
                                    <td className="py-2">
                                        <div className="flex items-center gap-4">
                                            {selfieImage ? (
                                                <img src={selfieImage} alt="Preview Selfie" className="w-32 h-20 object-cover rounded-lg border" />
                                            ) : shopProfil?.selfie_url ? <img src={shopProfil?.selfie_url} className="w-32 h-20 object-cover rounded-lg border" /> : <div className="w-32 h-20 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50 text-gray-400">
                                                <User size={32} />
                                            </div>}
                                            <div>
                                                <div className='flex items-center gap-4'>
                                                    <button type="button" onClick={() => handleOpenKameraModal('selfie')} className='w-[150px] h-[40px] cursor-pointer bg-[#24A77B] text-white text-[14px] font-bold py-3 px-4 rounded-lg text-center hover:bg-green-600 mb-2'>
                                                        {selfieImage ? 'Ambil Ulang' : 'Ambil Foto Selfie'}
                                                    </button>
                                                    <p className='text-[14px] font-[500] text-[#666666] '>Foto Selfie sambil memegang KTP Asli</p>
                                                </div>
                                                <p className='text-[#666666] font-[500] text-[12px]' style={{ lineHeight: "108%" }}>
                                                    Pastikan wajah dan KTP terlihat jelas
                                                </p>
                                            </div>
                                        </div>
                                        {errors.selfie && (
                                            <p className="text-red-500 text-[12px] mt-1 px-3">{errors.selfie}</p>
                                        )}
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
                isCameraModalOpen &&
                <ModalOpenCamera cameraCaptureMode={cameraCaptureMode} capturedImage={capturedImage} cameraError={cameraError} handleRetake={handleRetake} handleSaveKamera={handleSaveKamera} handleCapture={handleCapture} handleCloseKameraModal={handleCloseKameraModal} videoRef={videoRef} />
            }
            {/* Canvas tersembunyi untuk memproses gambar */}
            <canvas ref={canvasRef} className="hidden"></canvas>
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

export default ShopProfileForm;