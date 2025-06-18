import React, { useState } from 'react'
import DatePicker from './DatePicker';
import ImageCropperModal from './ImageCropperModal';

const ProfileForm = () => {
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>("https://placehold.co/150x150/e2e8f0/333?text=IT");
    const fileInputRef = React.useRef<HTMLInputElement>(null);

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
        setImageToCrop(null); // Close cropper modal
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
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Kolom Kiri: Foto Profil */}
                <div className="lg:w-1/3 text-center p-4 border-r-0 lg:border-r border-gray-300 lg:pr-8 flex flex-col items-center">
                    <img src={profileImage || ''} alt="Foto Profil" className="w-32 h-32 rounded-lg mx-auto mb-4 object-cover" />
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
                    <p className="text-xs text-gray-500 mt-2">
                        Besar file: maksimum 10 MB. Ekstensi file yang diperbolehkan: .JPG, .JPEG, .PNG
                    </p>
                </div>

                {/* Kolom Kanan: Form Biodata */}
                <div className="flex-grow">
                    <form className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Ubah Biodata Diri</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-500 mb-1">Nama</label>
                                    <input type="text" id="name" defaultValue="Irvan Mamala" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Tanggal Lahir</label>
                                    <DatePicker />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Jenis Kelamin</label>
                                    <div className="flex gap-4 items-center">
                                        <label className="flex items-center gap-2"><input type="radio" name="gender" defaultChecked className="text-blue-600 focus:ring-blue-500" /> Laki-laki</label>
                                        <label className="flex items-center gap-2"><input type="radio" name="gender" className="text-blue-600 focus:ring-blue-500" /> Perempuan</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Ubah Kontak</h3>
                            <div className="space-y-4">
                                <div className="md:flex items-center">
                                    <span className="w-full sm:w-1/4 text-sm text-gray-500">Email</span>
                                    <div className="flex-grow text-sm">
                                        aisyah.......@gmail.com
                                        <span className="text-blue-600 bg-blue-100 text-xs px-2 py-0.5 rounded-full ml-2">Terverifikasi</span>
                                        <button className="text-blue-600 ml-4 text-sm hover:underline">Ubah</button>
                                    </div>
                                </div>
                                <div className="md:flex items-center">
                                    <span className="w-full sm:w-1/4 text-sm text-gray-500">Nomor HP</span>
                                    <div className="flex-grow text-sm">
                                        62853*****3301
                                        <span className="text-blue-600 bg-blue-100 text-xs px-2 py-0.5 rounded-full ml-2">Terverifikasi</span>
                                        <button className="text-blue-600 ml-4 text-sm hover:underline">Ubah</button>
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
        </div>
    );
};
export default ProfileForm