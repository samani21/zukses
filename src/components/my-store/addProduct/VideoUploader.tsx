// components/VideoUploader.tsx
import React from 'react';
import { Video } from 'lucide-react';

interface VideoUploaderProps {
  videoFile: File | null;
  onVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Gunakan React.memo untuk mencegah re-render jika props tidak berubah
const VideoUploader = React.memo(({ videoFile, onVideoChange }: VideoUploaderProps) => {
  console.log('Rendering VideoUploader...'); // Tambahkan ini untuk debugging

  return (
    <div>
      <label className="text-[#333333] font-bold text-[14px]">
        Video Produk
      </label>
      <div className="flex items-start space-x-6 mt-1">
        <input
          type="file"
          id="video-upload"
          accept="video/*"
          onChange={onVideoChange}
          className="hidden"
        />
        <label htmlFor="video-upload">
          {videoFile ? (
            <video
              src={URL.createObjectURL(videoFile)}
              className="w-[160px] h-[160px] object-cover rounded-[5px]"
              controls
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-[80px] h-[80px] border-2 border-[#BBBBBB] rounded-[5px] text-center cursor-pointer hover:bg-gray-50">
              <Video className="w-[29px] h-[29px] text-[#7952B3] mb-1" />
              <span className="text-[12px] text-[#333333]">Tambahkan Video</span>
            </div>
          )}
        </label>
        <ul className="text-[12px] text-gray-500 list-disc list-inside">
          <li>File video maks. harus 30Mb dengan resolusi tidak melebihi 1280 x 1280px.</li>
          <li>Durasi: 10-60detik</li>
          <li>Format: MP4</li>
        </ul>
      </div>
    </div>
  );
});

export default VideoUploader;