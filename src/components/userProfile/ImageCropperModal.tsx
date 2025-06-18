import React, { useCallback, useEffect, useRef, useState } from 'react'
interface ImageCropperModalProps {
    imageSrc: string;
    onCropComplete: (croppedImage: string) => void;
    onClose: () => void;
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({ imageSrc, onCropComplete, onClose }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(new Image());
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const drawImage = useCallback(() => {
        const canvas = canvasRef.current;
        const image = imageRef.current;
        if (!canvas || !image.complete) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#2d3748'; // bg-gray-800
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const canvasAspect = canvas.width / canvas.height;
        const imageAspect = image.width / image.height;

        let drawWidth, drawHeight;

        if (imageAspect > canvasAspect) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imageAspect;
        } else {
            drawHeight = canvas.height;
            drawWidth = canvas.height * imageAspect;
        }

        const finalDrawWidth = drawWidth * zoom;
        const finalDrawHeight = drawHeight * zoom;

        const finalOffsetX = offset.x + (canvas.width - finalDrawWidth) / 2;
        const finalOffsetY = offset.y + (canvas.height - finalDrawHeight) / 2;

        ctx.drawImage(image, finalOffsetX, finalOffsetY, finalDrawWidth, finalDrawHeight);

    }, [zoom, offset]);

    useEffect(() => {
        const image = imageRef.current;
        image.src = imageSrc;
        image.onload = drawImage;
    }, [imageSrc, drawImage]);

    useEffect(() => {
        drawImage();
    }, [zoom, offset, drawImage]);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging) return;
        setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        onCropComplete(canvas.toDataURL('image/jpeg'));
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-md h-96">
                <canvas
                    ref={canvasRef}
                    width={384}
                    height={384}
                    className="w-full h-full rounded-lg cursor-grab"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                />
            </div>
            <div className="p-4 bg-gray-900/50 backdrop-blur-sm rounded-b-lg w-full max-w-md flex flex-col items-center">
                <label htmlFor="zoom" className="text-white text-sm mb-2">Zoom</label>
                <input
                    id="zoom"
                    type="range"
                    value={zoom}
                    min={0.5}
                    max={3}
                    step={0.05}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-1/2"
                />
                <div className="flex gap-4 mt-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-400 text-white hover:bg-gray-700">Batal</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Simpan</button>
                </div>
            </div>
        </div>
    );
};

export default ImageCropperModal