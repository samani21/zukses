import React, { useRef } from 'react';
import { Video, X } from 'lucide-react';

interface VideoUploaderProps {
    videoFile: File | null;
    onVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    urlvideoFile?: string | null;
}

const VideoUploader = React.memo(({ videoFile, onVideoChange, urlvideoFile }: VideoUploaderProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    console.log('Rendering VideoUploader...');

    return (
        <div>
            <label className="text-[#333333] font-bold text-[14px]">
                Video Produk
            </label>

            <div className="flex items-start space-x-6 mt-1">
                {/* INPUT */}
                <input
                    ref={inputRef}
                    type="file"
                    accept="video/*"
                    onChange={onVideoChange}
                    className="hidden"
                    onClick={(e) => (e.currentTarget.value = '')}
                />

                {/* VIDEO PREVIEW ATAU TOMBOL TAMBAH */}
                {videoFile ? (
                    <div className="relative w-[160px] h-[160px]">
                        <video
                            src={urlvideoFile ? urlvideoFile : URL.createObjectURL(videoFile)}
                            className="w-full h-full object-cover rounded-[5px] cursor-pointer"
                            controls
                            onClick={() => inputRef.current?.click()}
                        />
                        <button
                            type="button"
                            className="absolute top-[-6px] right-[-6px] bg-white border border-gray-300 rounded-full p-[2px] hover:bg-gray-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                const event = { target: { files: null } } as unknown as React.ChangeEvent<HTMLInputElement>;
                                onVideoChange(event); // simulasikan penghapusan file
                            }}
                        >
                            <X className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => inputRef.current?.click()}
                        className="flex flex-col items-center justify-center w-[80px] h-[80px] border-2 border-[#BBBBBB] rounded-[5px] text-center cursor-pointer hover:bg-gray-50"
                    >
                        <Video className="w-[29px] h-[29px] text-[#7952B3] mb-1" />
                        <span className="text-[12px] text-[#333333]">Tambahkan Video</span>
                    </div>
                )}

                {/* INFO */}
                <ul className="text-[12px] text-gray-500 list-disc list-inside">
                    <li>File video maks. 30Mb, resolusi ≤ 1280 x 1280px</li>
                    <li>Durasi: 10–60 detik</li>
                    <li>Format: MP4</li>
                </ul>
            </div>
        </div>
    );
});

VideoUploader.displayName = 'VideoUploader';
export default VideoUploader;
