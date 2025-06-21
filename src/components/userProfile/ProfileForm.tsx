import React, { useEffect, useState } from 'react'
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
    name?: string
    email?: string
    whatsapp?: string
    id?: number
    username?: string
    image?: string
    role?: string
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
    [key: string]: string
}

const ProfileForm = () => {
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [form, setForm] = useState({
        name: '',
        gender: '',
        tanggal: '',
        bulan: '',
        tahun: '',
    })

    const [errors, setErrors] = useState<ErrorMap>({})
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
        const currentUser = getUserInfo()
        if (currentUser) {
            setUser(currentUser)
            fetchUserProfile(currentUser.id)
        }
    }, [])

    const fetchUserProfile = async (userId?: number) => {
        if (!userId) return
        setLoading(true)
        const res = await Get<Response>('zukses', `user-profile/${userId}`)
        setLoading(false)

        if (res?.status === 'success' && res.data) {
            const data = res.data as UserProfileData
            setForm({
                name: data.name ?? '',
                gender: data.gender ?? '',
                tanggal: data.date_birth?.split('-')[2] ?? '',
                bulan: data.date_birth?.split('-')[1] ?? '',
                tahun: data.date_birth?.split('-')[0] ?? '',
            })
            setProfileImage(data?.image ?? '')
            // setImagePreview(data.image ?? '')
        } else {
            console.warn('User profile tidak ditemukan atau gagal diambil')
        }
    }
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
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const newErrors: ErrorMap = {}
        const { name, gender, tanggal, bulan, tahun } = form

        if (!name) newErrors.name = 'Nama harus diisi.'
        if (!gender) newErrors.gender = 'Jenis kelamin harus dipilih.'
        if (!tanggal || !bulan || !tahun) newErrors.birthdate = 'Tanggal lahir lengkap harus dipilih.'
        if (!croppedImageFile && !user?.image) newErrors.image = 'Gambar harus dipilih.'

        setErrors(newErrors)

        if (Object.keys(newErrors).length === 0 && user?.id) {
            try {
                setLoading(true)
                const formData = new FormData()
                formData.append('name', name)
                formData.append('gender', gender)
                formData.append('date_birth', `${tahun}-${bulan}-${tanggal}`)
                if (croppedImageFile) formData.append('image', croppedImageFile)

                const res = await Post<Response>('zukses', `user-profile/${user.id}/create`, formData)
                setLoading(false)

                if (res?.data?.status === 'success') {
                    const updatedData = res?.data?.data as UserProfileData
                    localStorage.setItem('user', JSON.stringify({
                        ...user,
                        name: updatedData.name ?? '',
                        image: updatedData.image ?? '',
                        date_birth: updatedData.date_birth ?? ''
                    }))
                    setSnackbar({ message: 'Data berhasil dikirim!', type: 'success', isOpen: true })
                    fetchUserProfile(user.id)
                    setTimeout(() => window.location.reload(), 1500)
                    setLoading(false)
                }
            } catch (err) {
                setLoading(false)
                const error = err as AxiosError<{ message?: string }>
                setSnackbar({ message: error.response?.data?.message || 'Terjadi kesalahan', type: 'error', isOpen: true })
            }
        }
    }

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
        <div className="w-full">
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
                    currentValue={modalType === 'email' ? isValidEmail(user?.email) ? user.email : '' : String(user?.whatsapp)}
                    onClose={handleCloseModal}
                    onSave={handleSaveContact}
                    userId={user?.id}
                />
            )}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Kolom Kiri: Foto Profil */}
                <div className="lg:w-1/3 text-center p-4 border-r-0 lg:border-r border-gray-300 lg:pr-8 flex flex-col items-center">
                    <img src={profileImage ?? "https://placehold.co/150x150/e2e8f0/333?text=Z"} alt="Foto Profil" className="w-32 h-32 rounded-lg mx-auto mb-4 object-cover" />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                        className="hidden"
                        ref={fileInputRef}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full max-w-xs border rounded-lg py-2 px-4 text-gray-700 hover:bg-gray-100 transition">
                        Pilih Foto
                    </button>
                    {errors.image && <p style={{ color: 'red', fontSize: 12 }}>{errors.image}</p>}
                    <p className="text-xs text-gray-500 mt-2">
                        Besar file: maksimum 10 MB. Ekstensi file yang diperbolehkan: .JPG, .JPEG, .PNG
                    </p>
                </div>
                {/* Kolom Kanan: Form Biodata */}
                <div className="flex-grow">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Ubah Biodata Diri</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-500 mb-1">Nama</label>
                                    <input type="text" id="name" placeholder='Masukkan Nama Langkap' className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.name} onChange={(e) => handleInputChange('name', e.target.value)} />
                                    {errors.name && <p style={{ color: 'red', fontSize: 12 }}>{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Tanggal Lahir</label>
                                    <DatePicker
                                        value={{ day: form.tanggal, month: form.bulan, year: form.tahun }}
                                        onChange={handleInputChange}
                                    />
                                    {errors.birthdate && <p style={{ color: 'red', fontSize: 12 }}>{errors.birthdate}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Jenis Kelamin</label>
                                    <div className="flex gap-4 items-center">
                                        <label className="flex items-center gap-2">
                                            <input type="radio" name="gender" checked={form.gender === 'Laki-laki'} className="text-blue-600 focus:ring-blue-500" onChange={() => handleInputChange('gender', "Laki-laki")} /> Laki-laki
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="radio" name="gender" checked={form.gender === 'Perempuan'} className="text-blue-600 focus:ring-blue-500" onChange={() => handleInputChange('gender', "Perempuan")} /> Perempuan
                                        </label>
                                    </div>
                                    {errors.gender && <p style={{ color: 'red', fontSize: 12 }}>{errors.gender}</p>}
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Ubah Kontak</h3>
                            <div className="space-y-4">
                                <div className="md:flex items-center">
                                    <span className="w-full sm:w-1/4 text-sm text-gray-500">Email</span>
                                    <div className="flex-grow text-sm">
                                        {isValidEmail(user?.email) ? user.email : ''}
                                        {isValidEmail(user?.email) ? <span className="text-blue-600 bg-blue-100 text-xs px-2 py-0.5 rounded-full ml-2">Terverifikasi</span> : ''}

                                        <span className="text-blue-600 ml-4 text-sm hover:underline cursor-pointer" onClick={() => handleOpenModal('email')}>Ubah</span>
                                    </div>
                                </div>
                                <div className="md:flex items-center">
                                    <span className="w-full sm:w-1/4 text-sm text-gray-500">Nomor HP</span>
                                    <div className="flex-grow text-sm">
                                        {user?.whatsapp ? user.whatsapp : ''}
                                        {user?.whatsapp ? <span className="text-blue-600 bg-blue-100 text-xs px-2 py-0.5 rounded-full ml-2">Terverifikasi</span> : ''}

                                        <span className="text-blue-600 ml-4 text-sm hover:underline cursor-pointer" onClick={() => handleOpenModal('hp')}>Ubah</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="bg-blue-600 text-white rounded-lg px-6 py-2 hover:bg-blue-700 transition font-semibold">
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
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
        </div>
    );
};
export default ProfileForm