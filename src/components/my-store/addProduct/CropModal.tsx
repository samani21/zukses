import React, { useRef, useState } from 'react';
import ReactCrop, {
    type Crop,
    centerCrop,
    makeAspectCrop,
    PixelCrop
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface CropModalProps {
    imageSrc: string;
    onClose: () => void;
    onCropComplete: (file: File) => void;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight
        ),
        mediaWidth,
        mediaHeight
    );
}

const CropModal: React.FC<CropModalProps> = ({ imageSrc, onClose, onCropComplete }) => {
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);

    const ASPECT_RATIO = 1; // 1:1

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, ASPECT_RATIO));
    };

    const getCroppedImg = async (): Promise<File | undefined> => {
        // Pastikan crop dan ref gambar sudah ada
        if (!completedCrop || !imgRef.current) {
            console.error("Crop atau referensi gambar tidak ditemukan.");
            return;
        }

        const image = imgRef.current;
        const canvas = document.createElement('canvas');

        // Hitung skala antara ukuran asli gambar dan ukuran tampilannya
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        // --- PERUBAHAN UTAMA 1: Ukuran Canvas ---
        // Atur ukuran canvas sesuai dengan ukuran crop pada gambar asli, bukan ukuran tampilan.
        canvas.width = completedCrop.width * scaleX;
        canvas.height = completedCrop.height * scaleY;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error("Gagal mendapatkan konteks 2D dari canvas.");
            return;
        }

        // Mengatur kualitas render gambar menjadi lebih baik
        ctx.imageSmoothingQuality = 'high';

        // --- PERUBAHAN UTAMA 2: Parameter drawImage ---
        // Gambar bagian yang di-crop dari gambar asli ke canvas
        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            canvas.width, // Gambar ke seluruh area canvas
            canvas.height
        );

        // --- PERUBAHAN UTAMA 3: Kualitas Blob ---
        return new Promise((resolve, reject) => {
            // Konversi canvas ke Blob dengan kualitas yang ditentukan
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error('Gagal membuat Blob dari canvas.'));
                        return;
                    }
                    const file = new File([blob], 'cropped-image.jpeg', { type: 'image/jpeg' });
                    resolve(file);
                },
                'image/jpeg',
                0.95 // Atur kualitas di sini (0.95 = 95% quality). Angka 1 untuk kualitas maksimal.
            );
        });
    };

    const handleCrop = async () => {
        const croppedFile = await getCroppedImg();
        if (croppedFile) {
            onCropComplete(croppedFile);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-4 rounded-lg shadow-md w-[90vw] sm:max-w-md">
                <h2 className="text-lg font-semibold mb-4">Crop Gambar</h2>

                <div className="max-h-[500px] flex justify-center items-center">
                    <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop({ ...c, height: Math.min(c.height ?? 500, 500) })}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={1}
                        keepSelection
                        minWidth={50}
                        minHeight={50}
                    >
                        <img
                            ref={imgRef}
                            src={imageSrc}
                            alt="To crop"
                            onLoad={onImageLoad}
                            className="max-w-full h-auto"
                            style={{ maxHeight: '500px', objectFit: 'contain' }}
                        />
                    </ReactCrop>
                </div>


                <div className="flex justify-end mt-4 gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Batal</button>
                    <button onClick={handleCrop} className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800">Simpan</button>
                </div>
            </div>
        </div>
    );
};

export default CropModal;
