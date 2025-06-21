import { AxiosError } from 'axios';
import Loading from 'components/Loading';
import React, { useEffect, useRef, useState } from 'react';
import Post from 'services/api/Post';
import { getUserInfo } from 'services/api/redux/action/AuthAction';
import { Response } from 'services/api/types';

interface UpdateContactModalProps {
    type: 'email' | 'hp';
    currentValue?: string;
    userId?: number;
    onClose: () => void;
    onSave: (newValue: string) => void;
}
interface User {
    name?: string
    email?: string
    whatsapp?: string
    id?: number
    username?: string
    image?: string
    role?: string
}


/**
 * A reusable modal component for updating a user's email or phone number.
 * It now includes a multi-step process for OTP verification.
 */
const UpdateContactModal: React.FC<UpdateContactModalProps> = ({ type, currentValue = '', onClose, userId }) => {
    // State to manage the current step of the modal: 'editing' or 'verifying'.
    const [modalStage, setModalStage] = useState<'editing' | 'verifying'>('editing');
    const [loading, setLoading] = useState<boolean>(false);
    // State for the new value (email/phone) being entered by the user.
    const [newValue, setNewValue] = useState<string>('');
    // State for the OTP entered by the user.
    const [otp, setOtp] = useState<string>('');

    // State for any validation error messages.
    const [error, setError] = useState<string>('');
    // State for OTP-specific errors.
    const [otpError, setOtpError] = useState<string>('');

    const [isVerifying, setIsVerifying] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const otpInputRef = useRef<HTMLInputElement>(null);
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const currentUser = getUserInfo()
        if (currentUser) {
            setUser(currentUser)
        }
    }, [])
    // Effect to initialize the input field with the current value.
    useEffect(() => {
        setNewValue(currentValue);
    }, [currentValue]);

    // Effect to handle the resend OTP cooldown timer.
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Effect to auto-focus the OTP input when the stage changes to 'verifying'.
    useEffect(() => {
        if (modalStage === 'verifying') {
            otpInputRef.current?.focus();
        }
    }, [modalStage]);


    // --- Dynamic Content ---
    const title = type === 'email' ? 'Ubah Alamat Email' : 'Ubah Nomor HP';
    const label = type === 'email' ? 'Email Baru' : 'Nomor HP Baru';
    const inputType = type === 'email' ? 'email' : 'tel';

    /**
     * Validates the input value for email or phone number formats.
     * @param {string} value - The value to validate.
     * @returns {boolean} - True if valid, false otherwise.
     */
    const validateInput = (value: string): boolean => {
        if (!value) {
            setError('');
            return false;
        }
        if (type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                setError('Format email tidak valid.');
                return false;
            }
        }
        if (type === 'hp') {
            const phoneRegex = /^628\d{8,12}$/;
            if (!phoneRegex.test(value)) {
                setError('Format nomor HP tidak valid. Contoh: 6281234567890');
                return false;
            }
        }
        setError('');
        return true;
    };

    /**
     * Handles changes to the input field, applying formatting and validation.
     */
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        let finalValue = rawValue;

        if (type === 'hp') {
            let numericValue = rawValue.replace(/\D/g, '');
            if (numericValue.startsWith('08')) {
                numericValue = '628' + numericValue.substring(2);
            }
            finalValue = numericValue;
        }
        setNewValue(finalValue);
        validateInput(finalValue);
    };

    /**
     * Transitions the modal to the OTP verification stage.
     */
    const handleProceedToOtp = async () => {
        if (validateInput(newValue.trim())) {
            setLoading(true)
            if (type === 'hp') {
                try {
                    const formData = new FormData();
                    formData.append('whatsapp', newValue ?? '');
                    const res = await Post<Response>('zukses', `otp/${userId}/request-contact`, formData);
                    console.log('res', res)
                    if (res?.data?.status === 'success') {
                        setModalStage('verifying');
                        setLoading(false)
                        setResendCooldown(60); // Start 60-second cooldown
                        setOtpError('');
                    }
                } catch (error) {
                    const err = error as AxiosError<Response>;
                    console.log('res', err)
                    if (err?.response?.status === 422) {
                        const msg = String(err.response?.data?.message || 'Data tidak valid.');
                        setLoading(false)
                        setError(msg);
                    } else {
                        console.error("Terjadi kesalahan lain:", err);
                    }
                }
            } else {
                try {
                    const formData = new FormData();
                    formData.append('email', newValue ?? '');
                    const res = await Post<Response>('zukses', `otp/${userId}/request-email`, formData);
                    console.log('res', res)
                    if (res?.data?.status === 'success') {
                        setModalStage('verifying');
                        setLoading(false);
                        setResendCooldown(60); // Start 60-second cooldown
                        setOtpError('');
                    }
                } catch (error) {
                    const err = error as AxiosError<Response>;
                    console.log('res', err)
                    if (err?.response?.status === 422) {
                        const msg = String(err.response?.data?.message || 'Data tidak valid.');
                        setLoading(false)
                        setError(msg);
                    } else {
                        console.error("Terjadi kesalahan lain:", err);
                    }
                }
            }
        }
    };

    /**
     * Handles the final verification of the OTP.
     */
    const handleVerifyOtp = async () => {
        setOtpError('');
        setIsVerifying(true);

        try {
            const formData = new FormData();
            formData.append('otp', otp);
            formData.append('type', type);
            formData.append('value', newValue);
            const res = await Post<Response>('zukses', `otp-verify-contact/${userId}`, formData);
            if (res?.data?.status === 'success') {
                if (type === 'hp') {
                    localStorage.setItem('user', JSON.stringify({
                        ...user,
                        whatsapp: newValue ?? '',
                    }))
                } else {
                    localStorage.setItem('user', JSON.stringify({
                        ...user,
                        email: newValue ?? '',
                    }))
                }
                window.location.reload()
                setIsVerifying(false);
            }
        } catch (error) {
            const err = error as AxiosError<Response>;
            console.log('res', err)
            if (err?.response?.status === 422) {
                const msg = String(err.response?.data?.message || 'Data tidak valid.');
                setOtpError(msg);
                setIsVerifying(false);
            } else {
                console.error("Terjadi kesalahan lain:", err);
                setIsVerifying(false);
            }
        }
    };

    /**
     * Resends the OTP and resets the cooldown.
     */
    const handleResendOtp = async () => {
        if (resendCooldown === 0) {
            setLoading(true)
            if (type === 'hp') {
                const formData = new FormData();
                formData.append('whatsapp', newValue ?? '');
                const res = await Post<Response>('zukses', `otp/${userId}/request`, formData);
                console.log('res', res)
                if (res?.data?.status === 'success') {
                    console.log(`Mengirim ulang OTP ke ${newValue.trim()}`);
                    setOtp('');
                    setOtpError('');
                    setLoading(false)
                    setResendCooldown(60);
                    otpInputRef.current?.focus();
                }
            } else {
                const formData = new FormData();
                formData.append('email', newValue ?? '');
                const res = await Post<Response>('zukses', `otp/${userId}/request-email`, formData);
                console.log('res', res)
                if (res?.data?.status === 'success') {
                    console.log(`Mengirim ulang OTP ke ${newValue.trim()}`);
                    setOtp('');
                    setOtpError('');
                    setResendCooldown(60);
                    setLoading(false)
                    otpInputRef.current?.focus();
                }
            }
        }
    }


    // --- Render Functions for Different Stages ---

    const renderEditView = () => (
        <>
            <div className="space-y-4">
                <p className="text-sm text-gray-500">
                    {type === 'email' ? 'Email saat ini:' : 'Nomor HP saat ini:'}
                    <span className="font-medium text-gray-700"> {currentValue || 'Tidak ada'}</span>
                </p>
                <div>
                    <label htmlFor={type} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input
                        type={inputType}
                        id={type}
                        value={newValue}
                        onChange={handleValueChange}
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition-colors ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        placeholder={`Masukkan ${label.toLowerCase()}`}
                        autoFocus
                    />
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>

            </div>
            <div className="mt-6 flex justify-end gap-3">
                <button onClick={onClose} className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2 hover:bg-gray-300 transition font-semibold">
                    Batal
                </button>
                <button onClick={handleProceedToOtp} disabled={!newValue.trim() || !!error} className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition font-semibold disabled:bg-blue-300 disabled:cursor-not-allowed">
                    Simpan Perubahan
                </button>
            </div>
        </>
    );

    const renderOtpView = () => (
        <>
            <div className="space-y-4">
                <p className="text-sm text-gray-600">
                    Kami telah mengirimkan kode verifikasi 6 digit ke <span className="font-semibold text-gray-800">{newValue}</span>.
                    (Untuk demo, gunakan: <span className="font-bold text-blue-600">123456</span>)
                </p>
                <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">Kode OTP</label>
                    <input
                        ref={otpInputRef}
                        type="tel" // Use 'tel' for numeric keyboard on mobile
                        id="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
                        maxLength={6}
                        className={`w-full border rounded-lg px-3 py-2 text-center text-lg tracking-[0.5em] focus:outline-none focus:ring-2 transition-colors ${otpError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        placeholder="______"
                    />
                    {otpError && <p className="text-red-500 text-sm mt-1">{otpError}</p>}
                </div>
                <div className="text-sm text-center">
                    <button
                        onClick={handleResendOtp}
                        disabled={resendCooldown > 0}
                        className="text-blue-600 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed disabled:no-underline"
                    >
                        Kirim ulang kode {resendCooldown > 0 ? `(${resendCooldown}s)` : ''}
                    </button>
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setModalStage('editing')} className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2 hover:bg-gray-300 transition font-semibold">
                    Kembali
                </button>
                <button onClick={handleVerifyOtp} disabled={otp.length < 6 || isVerifying} className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition font-semibold disabled:bg-blue-300 disabled:cursor-not-allowed w-32">
                    {isVerifying ? 'Memeriksa...' : 'Verifikasi'}
                </button>
            </div>
        </>
    );

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-fade-in-up">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">{modalStage === 'editing' ? title : 'Verifikasi Perubahan'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                {modalStage === 'editing' ? renderEditView() : renderOtpView()}

            </div>
            {
                loading && <Loading />
            }
            <style>{`
        @keyframes animate-fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: animate-fade-in-up 0.3s ease-out forwards; }
      `}</style>
        </div>
    );
};


export default UpdateContactModal;
