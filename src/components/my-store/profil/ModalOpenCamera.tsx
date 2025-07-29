import { Camera, Check, RefreshCw } from 'lucide-react';
import React from 'react'
type CaptureMode = 'ktp' | 'selfie' | null;
type Props = {
    cameraCaptureMode: CaptureMode;
    capturedImage?: string | null;
    cameraError?: string | null;
    handleRetake: () => void;
    handleSaveKamera: () => void;
    handleCapture: () => void;
    handleCloseKameraModal: () => void;
    videoRef: React.RefObject<HTMLVideoElement | null>;
}

const ModalOpenCamera = ({ cameraCaptureMode, capturedImage, cameraError, handleRetake, handleSaveKamera, handleCapture, handleCloseKameraModal, videoRef }: Props) => {

    return (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-center text-gray-800">
                        {cameraCaptureMode === 'ktp' ? 'Arahkan Kamera ke KTP Anda' : 'Ambil Foto Selfie dengan KTP'}
                    </h2>
                </div>
                <div className="p-4 bg-black">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                        {capturedImage ? (
                            <img src={capturedImage} alt="Captured preview" className="w-full h-full object-contain" />
                        ) : (
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]"></video>
                        )}
                        {cameraError && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 text-white p-4 text-center">
                                <p>{cameraError}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-4 bg-gray-50 flex justify-center items-center gap-4">
                    {capturedImage ? (
                        <>
                            <button onClick={handleRetake} className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-yellow-600 transition-all">
                                <RefreshCw size={20} /> Ulangi
                            </button>
                            <button onClick={handleSaveKamera} className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-600 transition-all">
                                <Check size={20} /> Simpan
                            </button>
                        </>
                    ) : (
                        <div className='flex items-center w-full'>
                            <button onClick={handleCapture} disabled={!!cameraError} className="w-full h-[40px] bg-blue-600 shadow-lg hover:bg-blue-700 transition-all disabled:bg-gray-400" aria-label="Ambil Foto">
                                <Camera size={32} className="text-white mx-auto" />
                            </button>
                            <button onClick={handleCloseKameraModal} className="w-full h-[40px] bg-gray-800 bg-opacity-50 text-white hover:bg-opacity-75">
                                Tutup
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default ModalOpenCamera