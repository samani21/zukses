import { AxiosError } from 'axios';
import Loading from 'components/Loading';
import Card from 'components/my-store/Card';
import ImageCropper from 'components/my-store/ImageCropper';
import Modal from 'components/my-store/Modal';
import Snackbar from 'components/Snackbar';
import MyStoreLayout from 'pages/layouts/MyStoreLayout'
import React, { useEffect, useRef, useState } from 'react'
import Get from 'services/api/Get';
import Post from 'services/api/Post';
import { Response } from 'services/api/types';
interface ShopData {
    logo_url?: string;
    shop_name?: string;
    description?: string;
}
const BasicInfoForm = () => {
    const [storeName, setStoreName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [logoSrc, setLogoSrc] = useState<string>('https://placehold.co/100x100/E8F0FE/3478FC?text=Logo');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ storeName?: string; description?: string; logo?: string }>({});
    const [submissionStatus, setSubmissionStatus] = useState<{ message: string; type: 'idle' | 'success' | 'error' }>({ message: '', type: 'idle' });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<{
        message: string;
        type?: 'success' | 'error' | 'info';
        isOpen: boolean;
    }>({ message: '', type: 'info', isOpen: false });

    useEffect(() => {
        fetchShopProfile()
    }, [])
    // Fungsi untuk mengubah data URL menjadi objek File
    const dataURLtoFile = (dataurl: string, filename: string): File => {
        const arr = dataurl.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        if (!mimeMatch) throw new Error('Invalid data URL');
        const mime = mimeMatch[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => setImageToCrop(reader.result as string));
            reader.readAsDataURL(e.target.files[0]);
            e.target.value = '';
        }
    };

    const onCropComplete = (croppedImage: string) => {
        setLogoSrc(croppedImage);
        // Simpan file yang sudah dipotong untuk di-submit
        const croppedFile = dataURLtoFile(croppedImage, 'logo.png');
        setLogoFile(croppedFile);
        setImageToCrop(null);
    }

    // Fungsi validasi form
    const validate = () => {
        const newErrors: { storeName?: string; description?: string; logo?: string } = {};
        setSubmissionStatus({ message: '', type: 'idle' }); // Reset status
        if (!storeName.trim()) {
            newErrors.storeName = 'Nama toko tidak boleh kosong.';
        }
        if (!description.trim()) {
            newErrors.description = 'Deskripsi toko tidak boleh kosong.';
        }
        if (logoSrc == 'https://placehold.co/100x100/E8F0FE/3478FC?text=Logo') {
            newErrors.logo = 'Gambar toko tidak boleh kosong.';
        }
        return newErrors;
    }

    const fetchShopProfile = async () => {
        setLoading(true)
        const res = await Get<Response>('zukses', `shop/profile`)
        setLoading(false)
        console.log('res', res)
        if (res?.status === 'success' && res.data) {
            const data = res?.data as ShopData
            setStoreName(data?.shop_name ?? '')
            setDescription(data?.description ?? '')
            setLogoSrc(data.logo_url ?? '')
        } else {
            console.warn('User profile tidak ditemukan atau gagal diambil')
        }
    }

    // Fungsi untuk handle submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        setLoading(true);
        if (Object.keys(validationErrors).length === 0) {
            try {
                const formData = new FormData();
                formData.append('shop_name', storeName);
                formData.append('description', description);
                if (logoFile) {
                    formData.append('logo', logoFile);
                }

                // Simulasi pengiriman ke backend
                setSubmissionStatus({ message: 'Menyimpan...', type: 'idle' });
                const res = await Post<Response>('zukses', `shop/profile`, formData)
                let isSuccess = false;
                if (res?.data?.status === 'success') {
                    localStorage.setItem('shopProfile', JSON.stringify(res?.data?.data));
                    setSnackbar({ message: 'Data berhasil dikirim!', type: 'success', isOpen: true })
                    setLoading(false);
                    fetchShopProfile()
                    isSuccess = true;
                }
                setTimeout(() => {
                    // Ganti ini dengan logika fetch ke backend Lumen Anda
                    if (isSuccess) {
                        setSubmissionStatus({ message: 'Data berhasil disimpan!', type: 'success' });
                    } else {
                        setSubmissionStatus({ message: 'Gagal menyimpan data. Coba lagi.', type: 'error' });
                    }
                }, 1500);
            } catch (err) {
                setLoading(false)
                const error = err as AxiosError<{ message?: string }>
                setSnackbar({ message: error.response?.data?.message || 'Terjadi kesalahan', type: 'error', isOpen: true })
            }
        } else {
            console.log('Validasi gagal:', validationErrors);
            setLoading(false)
            setSubmissionStatus({ message: 'Silakan perbaiki kesalahan pada form.', type: 'error' });
        }
    }

    return (
        <MyStoreLayout>
            <Card>
                <form onSubmit={handleSubmit}>
                    <h2 className="text-xl font-normal text-gray-800 mb-8">Informasi Dasar</h2>
                    <div className="space-y-8">
                        {/* Nama Toko */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                            <label className="text-sm text-gray-500 md:text-right md:col-span-1 pt-2">Nama Toko</label>
                            <div className="md:col-span-4">
                                <div className="relative max-w-md">
                                    <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} maxLength={30} className={`w-full border rounded-md px-3 py-2 focus:ring-1 focus:border-blue-500 transition ${errors.storeName ? 'border-red-500' : 'border-gray-300'}`} />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">{storeName.length}/30</span>
                                </div>
                                {errors.storeName && <p className="text-red-500 text-xs mt-1">{errors.storeName}</p>}
                            </div>
                        </div>
                        {/* Logo Toko */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                            <label className="text-sm text-gray-500 md:text-right pt-2 md:col-span-1">Logo Toko</label>
                            <div className="md:col-span-4 flex flex-col sm:flex-row items-start sm:space-x-6">
                                <div className="relative w-28 h-28 border border-gray-200 rounded-md flex items-center justify-center bg-gray-50 flex-shrink-0 mb-4 sm:mb-0">
                                    <img src={logoSrc} alt="Logo Toko" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-xs py-1 hover:bg-opacity-70 transition">Ubah</button>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                </div>
                                <div className="text-xs text-gray-500 space-y-1 pt-1">
                                    <p>• Ukuran gambar: lebar 300px, tinggi 300px</p>
                                    <p>• Besar file maks.: 2.0MB</p>
                                    <p>• Format gambar: .JPG,.JPEG,.PNG</p>
                                    {errors.logo && <p className="text-red-500 text-xs mt-1">{errors.logo}</p>}
                                </div>
                            </div>
                        </div>
                        {/* Deskripsi Toko */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                            <label className="text-sm text-gray-500 md:text-right pt-2 md:col-span-1">Deskripsi Toko</label>
                            <div className="md:col-span-4">
                                <div className="relative max-w-md">
                                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} rows={5} className={`w-full border rounded-md px-3 py-2 focus:ring-1 focus:border-blue-500 transition ${errors.description ? 'border-red-500' : 'border-gray-300'}`} />
                                    <span className="absolute bottom-2 right-3 text-sm text-gray-400">{description.length}/500</span>
                                </div>
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>
                        </div>
                        {/* Tombol Aksi */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4">
                            <div className="md:col-start-2 md:col-span-4">
                                <div className="flex items-center space-x-3">
                                    <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-8 rounded-sm hover:bg-blue-600 transition">Simpan</button>
                                    <button type="button" className="bg-gray-200 text-gray-700 py-2 px-8 rounded-sm hover:bg-gray-300 transition">Batal</button>
                                </div>
                                {submissionStatus.message && (
                                    <p className={`text-sm mt-2 ${submissionStatus.type === 'success' ? 'text-green-600' :
                                        submissionStatus.type === 'error' ? 'text-red-600' : 'text-gray-600'
                                        }`}>
                                        {submissionStatus.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </Card>
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
            <Modal isOpen={!!imageToCrop} onClose={() => setImageToCrop(null)} title="Potong Gambar">
                {imageToCrop && <ImageCropper imageSrc={imageToCrop} onCropComplete={onCropComplete} />}
            </Modal>
        </MyStoreLayout>
    );
}



export default BasicInfoForm