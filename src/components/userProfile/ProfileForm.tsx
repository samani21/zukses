import React, { useEffect, useState } from 'react';
import DatePicker from './DatePicker';
import ImageCropperModal from './ImageCropperModal';
import { getUserInfo } from 'services/api/redux/action/AuthAction';
import Loading from 'components/Loading';
import Get from 'services/api/Get';
import { Response } from 'services/api/types';
import Post from 'services/api/Post';
import { AxiosError } from 'axios';
import Snackbar from 'components/Snackbar';
import UpdateContactModal from './UpdateContactModal';

function dataURLtoFile(dataurl: string, filename: string): File | null {
    const arr = dataurl.split(',');
    if (arr.length < 2) {
        return null;
    }
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || mimeMatch.length < 2) {
        return null;
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
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

interface UserProfileData {
    name?: string;
    name_store?: string;
    gender?: string;
    date_birth?: string;
    id?: number;
    image?: string;
}

interface ErrorMap {
    [key: string]: string;
}

const ProfileForm = () => {
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [form, setForm] = useState({
        name: '',
        gender: '',
        tanggal: '',
        bulan: '',
        tahun: '',
    });

    const [errors, setErrors] = useState<ErrorMap>({});
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>();
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'email' | 'hp' | null>(null);
    const [croppedImageFile, setCroppedImageFile] = useState<File | null>(null);
    const isValidEmail = (email: unknown): email is string =>
        typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const [snackbar, setSnackbar] = useState<{
        message: string;
        type?: 'success' | 'error' | 'info';
        isOpen: boolean;
    }>({ message: '', type: 'info', isOpen: false });

    useEffect(() => {
        const currentUser = getUserInfo();
        if (currentUser) {
            setUser(currentUser);
            fetchUserProfile(currentUser.id);
        }
    }, []);

    const fetchUserProfile = async (userId?: number) => {
        if (!userId) return;
        setLoading(true);
        const res = await Get<Response>('zukses', `user-profile/${userId}`);
        setLoading(false);

        if (res?.status === 'success' && res.data) {
            const data = res.data as UserProfileData;
            setForm({
                name: data.name ?? '',
                gender: data.gender ?? '',
                tanggal: data.date_birth?.split('-')[2] ?? '',
                bulan: data.date_birth?.split('-')[1] ?? '',
                tahun: data.date_birth?.split('-')[0] ?? '',
            });
            setProfileImage(data?.image ?? '');
        } else {
            console.warn('User profile tidak ditemukan atau gagal diambil');
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageToCrop(reader.result as string);
            });
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (croppedImageResult: string) => {
        setProfileImage(croppedImageResult);
        setImageToCrop(null);
        const imageFile = dataURLtoFile(croppedImageResult, 'profile-image.png');
        setCroppedImageFile(imageFile);
    };

    const handleInputChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: ErrorMap = {};
        const { name, gender, tanggal, bulan, tahun } = form;

        if (!name) newErrors.name = 'Nama harus diisi.';
        if (!gender) newErrors.gender = 'Jenis kelamin harus dipilih.';
        if (!tanggal || !bulan || !tahun)
            newErrors.birthdate = 'Tanggal lahir lengkap harus dipilih.';
        if (!croppedImageFile && !user?.image)
            newErrors.image = 'Gambar harus dipilih.';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0 && user?.id) {
            try {
                setLoading(true);
                const formData = new FormData();
                formData.append('name', name);
                formData.append('gender', gender);
                formData.append('date_birth', `${tahun}-${bulan}-${tanggal}`);
                if (croppedImageFile) formData.append('image', croppedImageFile);

                const res = await Post<Response>(
                    'zukses',
                    `user-profile/${user.id}/create`,
                    formData
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
                        })
                    );
                    setSnackbar({
                        message: 'Data berhasil dikirim!',
                        type: 'success',
                        isOpen: true,
                    });
                    fetchUserProfile(user.id);
                    setTimeout(() => window.location.reload(), 1500);
                    setLoading(false);
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
        }
    };

    const handleOpenModal = (type: 'email' | 'hp') => {
        setModalType(type);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalType(null);
    };

    const handleSaveContact = (newValue: string) => {
        if (modalType) {
            console.log(`Saving new ${modalType}:`, newValue);
            // Tambahkan logic update API jika diperlukan
        }
        handleCloseModal();
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {imageToCrop && (
                <ImageCropperModal
                    imageSrc={imageToCrop}
                    onCropComplete={handleCropComplete}
                    onClose={() => setImageToCrop(null)}
                />
            )}
            {isModalOpen && modalType && (
                <UpdateContactModal
                    type={modalType}
                    currentValue={
                        modalType === 'email' && isValidEmail(user?.email)
                            ? user.email
                            : String(user?.whatsapp)
                    }
                    onClose={handleCloseModal}
                    onSave={handleSaveContact}
                    userId={user?.id}
                />
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Section Foto Profil */}
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 pt-1 w-32 text-right"> {/* Added text-right here */}
                        <label className="block text-sm font-medium text-gray-700">Pilih Foto</label>
                    </div>
                    <div className="flex-grow flex items-center gap-4">
                        <div className="w-24 h-24 rounded-lg border border-gray-300 flex items-center justify-center overflow-hidden">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Foto Profil"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-gray-400 text-sm">No Image</div>
                            )}
                        </div>
                        <div>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                onChange={onFileChange}
                                className="hidden"
                                ref={fileInputRef}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-[#0c5da5] text-white rounded-md py-2 px-4 text-sm font-medium hover:bg-blue-700 transition"
                            >
                                Pilih Foto
                            </button>
                            <p className="text-xs text-gray-500 mt-1">
                                Besar file: maksimum 10 MB. Ekstensi file yang diperbolehkan: .JPG, .JPEG, .PNG
                            </p>
                            {errors.image && (
                                <p className="text-red-500 text-xs mt-1">{errors.image}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Nama User */}
                <div className="flex items-center gap-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 w-32 flex-shrink-0 text-right"> {/* Added text-right here */}
                        Nama User
                    </label>
                    <div className="flex-grow">
                        <input
                            type="text"
                            id="name"
                            placeholder="Masukkan Nama Lengkap"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={form.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                </div>

                {/* Email (Read-only, with Ubah button) */}
                <div className="flex items-center gap-4">
                    <label className="block text-sm font-medium text-gray-700 w-32 flex-shrink-0 text-right"> {/* Added text-right here */}
                        Email
                    </label>
                    <div className="flex-grow flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                        <span className="flex-grow text-gray-800">
                            {isValidEmail(user?.email) ? user.email : 'Belum diatur'}
                        </span>
                        <button
                            type="button"
                            onClick={() => handleOpenModal('email')}
                            className="text-blue-600 hover:underline text-sm font-medium ml-4"
                        >
                            Ubah
                        </button>
                    </div>
                </div>

                {/* Nomor Telepon (Read-only, with Ubah button) */}
                <div className="flex items-center gap-4">
                    <label className="block text-sm font-medium text-gray-700 w-32 flex-shrink-0 text-right"> {/* Added text-right here */}
                        Nomor Telepon
                    </label>
                    <div className="flex-grow flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                        <span className="flex-grow text-gray-800">
                            {user?.whatsapp ? user.whatsapp : 'Belum diatur'}
                        </span>
                        <button
                            type="button"
                            onClick={() => handleOpenModal('hp')}
                            className="text-blue-600 hover:underline text-sm font-medium ml-4"
                        >
                            Ubah
                        </button>
                    </div>
                </div>

                {/* Jenis Kelamin */}
                <div className="flex items-start gap-4">
                    <label className="block text-sm font-medium text-gray-700 w-32 flex-shrink-0 text-right"> {/* Added text-right here */}
                        Jenis Kelamin
                    </label>
                    <div className="flex gap-6 flex-grow pt-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="gender"
                                value="Laki-laki"
                                checked={form.gender === 'Laki-laki'}
                                className="text-blue-600 focus:ring-blue-500"
                                onChange={() => handleInputChange('gender', 'Laki-laki')}
                            />{' '}
                            Laki-laki
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="gender"
                                value="Perempuan"
                                checked={form.gender === 'Perempuan'}
                                className="text-blue-600 focus:ring-blue-500"
                                onChange={() => handleInputChange('gender', 'Perempuan')}
                            />{' '}
                            Perempuan
                        </label>
                    </div>
                    {/* Error message for gender, consider placing it inside the flex-grow div for better alignment */}
                    {errors.gender && <p className="text-red-500 text-xs mt-1 absolute ml-32">{errors.gender}</p>}
                </div>

                {/* Tanggal Lahir */}
                <div className="flex items-start gap-4">
                    <label className="block text-sm font-medium text-gray-700 w-32 flex-shrink-0 text-right"> {/* Added text-right here */}
                        Tanggal Lahir
                    </label>
                    <div className="flex-grow">
                        <DatePicker
                            value={{ day: form.tanggal, month: form.bulan, year: form.tahun }}
                            onChange={handleInputChange}
                        />
                        {errors.birthdate && (
                            <p className="text-red-500 text-xs mt-1">{errors.birthdate}</p>
                        )}
                    </div>
                </div>

                {/* Tombol Aksi */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        className="bg-[#ffb823] text-gray-700 rounded-md px-6 py-2 hover:bg-gray-300 transition font-semibold"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="bg-[#427056] text-white rounded-md px-6 py-2 hover:bg-green-700 transition font-semibold"
                    >
                        Simpan
                    </button>
                </div>
            </form>
            {loading && <Loading />}
            {snackbar.isOpen && (
                <Snackbar
                    message={snackbar.message}
                    type={snackbar.type}
                    isOpen={snackbar.isOpen}
                    onClose={() => setSnackbar((prev) => ({ ...prev, isOpen: false }))}
                />
            )}
        </div>
    );
};

export default ProfileForm;