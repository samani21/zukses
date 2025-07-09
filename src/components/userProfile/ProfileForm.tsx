import React, { useEffect, useState } from 'react';
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
    date_birth?: string; // Change to string for YYYY-MM-DD
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
        date_birth: '', // Single field for YYYY-MM-DD
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
                date_birth: data.date_birth ?? '', // Set directly to date_birth
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
        const { name, gender, date_birth } = form; // Use date_birth

        if (!name) newErrors.name = 'Nama harus diisi.';
        if (!gender) newErrors.gender = 'Jenis kelamin harus dipilih.';
        if (!date_birth)
            newErrors.date_birth = 'Tanggal lahir harus dipilih.'; // Update error key
        if (!croppedImageFile && !user?.image)
            newErrors.image = 'Gambar harus dipilih.';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0 && user?.id) {
            try {
                setLoading(true);
                const formData = new FormData();
                formData.append('name', name);
                formData.append('gender', gender);
                formData.append('date_birth', date_birth); // Send date_birth directly
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
        <div className="w-full mx-auto">
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
                    <div className="flex-shrink-0 pt-1 w-32 text-right">
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
                                className="bg-[#563D7C] h-[40px] w-[154px] text-white  py-2 px-4 text-sm font-medium transition"
                            >
                                Pilih Foto
                            </button>
                            <p className="text-[14px] text-dark mt-1 w-[335px]">
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
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 w-32 flex-shrink-0 text-right">
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
                    <label className="block text-sm font-medium text-gray-700 w-32 flex-shrink-0 text-right">
                        Email
                    </label>
                    <div className="flex-grow flex items-center border border-gray-300 rounded-md px-3 py-2">
                        <span className="flex-grow text-gray-800">
                            {isValidEmail(user?.email) ? user.email : 'Belum diatur'}
                        </span>
                        <button
                            type="button"
                            onClick={() => handleOpenModal('email')}
                            className="text-dark text-right hover:underline text-sm font-medium ml-4 w-[82px] h-[30px]"
                        >
                            Ubah
                        </button>
                    </div>
                </div>

                {/* Nomor Telepon (Read-only, with Ubah button) */}
                <div className="flex items-center gap-4">
                    <label className="block text-sm font-medium text-gray-700 w-32 flex-shrink-0 text-right">
                        Nomor Telepon
                    </label>
                    <div className="flex-grow flex items-center border border-gray-300 rounded-md px-3 py-2">
                        <span className="flex-grow text-gray-800">
                            {user?.whatsapp ? user.whatsapp : 'Belum diatur'}
                        </span>
                        <button
                            type="button"
                            onClick={() => handleOpenModal('hp')}
                            className="text-dark text-right hover:underline text-sm font-medium ml-4 w-[82px]  h-[30px]"
                        >
                            Ubah
                        </button>
                    </div>
                </div>

                {/* Jenis Kelamin */}
                <div className="flex items-start gap-4">
                    <label className="block text-sm font-medium text-gray-700 w-32 flex-shrink-0 text-right">
                        Jenis Kelamin
                    </label>
                    <div className="flex gap-6 flex-grow pt-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="gender"
                                value="Laki-laki"
                                checked={form.gender === 'Laki-laki'}
                                className="accent-red-600"
                                onChange={() => handleInputChange('gender', 'Laki-laki')}
                            />
                            Laki-laki
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="gender"
                                value="Perempuan"
                                checked={form.gender === 'Perempuan'}
                                className="accent-red-600"
                                onChange={() => handleInputChange('gender', 'Perempuan')}
                            />
                            Perempuan
                        </label>
                    </div>

                    {errors.gender && <p className="text-red-500 text-xs mt-1 absolute ml-32">{errors.gender}</p>}
                </div>

                {/* Tanggal Lahir (Updated to single date input) */}
                <div className="flex items-start gap-4">
                    <label className="block text-sm font-medium text-gray-700 w-32 flex-shrink-0 text-right">
                        Tanggal Lahir
                    </label>
                    <div className="flex-grow">
                        <input
                            type="date"
                            id="date_birth"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={form.date_birth}
                            onChange={(e) => handleInputChange('date_birth', e.target.value)}
                        />
                        {errors.date_birth && (
                            <p className="text-red-500 text-xs mt-1">{errors.date_birth}</p>
                        )}
                    </div>
                </div>

                {/* Tombol Aksi */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        className="text-[#563D7C] bg-[#F6E9F0] w-[137px] px-6 py-2 border border-[#563D7C] font-semibold text-[14px]"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="bg-[#563D7C] text-white w-[137px] px-6 py-2  font-semibold text-[14px]"
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