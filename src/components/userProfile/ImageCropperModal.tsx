import React, { useEffect, useRef, useState } from 'react';

interface ImageCropperModalProps {
    imageSrc: string;
    onCropComplete: (croppedImage: string) => void;
    onClose: () => void;
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({ imageSrc, onCropComplete, onClose }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const cropBoxRef = useRef<HTMLDivElement>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0, boxX: 0, boxY: 0 });

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cropBoxRef.current) return;
        setIsDragging(true);
        setDragStart({
            x: e.clientX,
            y: e.clientY,
            boxX: cropBoxRef.current.offsetLeft,
            boxY: cropBoxRef.current.offsetTop,
        });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !cropBoxRef.current || !containerRef.current || !imageRef.current) return;
        const newX = dragStart.boxX + (e.clientX - dragStart.x);
        const newY = dragStart.boxY + (e.clientY - dragStart.y);
        limitAndMoveCropBox(newX, newY);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!cropBoxRef.current) return;
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({
            x: touch.clientX,
            y: touch.clientY,
            boxX: cropBoxRef.current.offsetLeft,
            boxY: cropBoxRef.current.offsetTop,
        });
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging || !cropBoxRef.current || !containerRef.current || !imageRef.current) return;

        const touch = e.touches[0];
        const newX = dragStart.boxX + (touch.clientX - dragStart.x);
        const newY = dragStart.boxY + (touch.clientY - dragStart.y);

        limitAndMoveCropBox(newX, newY);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const limitAndMoveCropBox = (newX: number, newY: number) => {
        if (!imageRef.current || !cropBoxRef.current || !containerRef.current) return;

        const imageRect = imageRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const boxRect = cropBoxRef.current.getBoundingClientRect();

        const minX = (containerRect.width - imageRect.width) / 2;
        const maxX = minX + imageRect.width - boxRect.width;
        const minY = (containerRect.height - imageRect.height) / 2;
        const maxY = minY + imageRect.height - boxRect.height;

        const boundedX = Math.max(minX, Math.min(newX, maxX));
        const boundedY = Math.max(minY, Math.min(newY, maxY));

        cropBoxRef.current.style.left = `${boundedX}px`;
        cropBoxRef.current.style.top = `${boundedY}px`;
    };

    const handleSave = () => {
        const image = imageRef.current;
        const cropBox = cropBoxRef.current;
        const container = containerRef.current;
        if (!image || !cropBox || !container) return;

        const canvas = document.createElement('canvas');
        const finalSize = 150;
        canvas.width = finalSize;
        canvas.height = finalSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const scaleX = image.naturalWidth / image.clientWidth;
        const scaleY = image.naturalHeight / image.clientHeight;

        const sourceX = (cropBox.offsetLeft - (container.clientWidth - image.clientWidth) / 2) * scaleX;
        const sourceY = (cropBox.offsetTop - (container.clientHeight - image.clientHeight) / 2) * scaleY;
        const sourceWidth = cropBox.clientWidth * scaleX;
        const sourceHeight = cropBox.clientHeight * scaleY;

        ctx.drawImage(
            image,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            0,
            0,
            finalSize,
            finalSize
        );
        onCropComplete(canvas.toDataURL('image/jpeg'));
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div
                ref={containerRef}
                className="relative w-full max-w-md h-96 bg-gray-900 rounded-lg overflow-hidden select-none flex items-center justify-center"
            >
                <img
                    ref={imageRef}
                    src={imageSrc}
                    alt="Pilih area potong"
                    className="max-w-full max-h-full pointer-events-none"
                />
                <div
                    ref={cropBoxRef}
                    className="absolute border-2 border-dashed border-white cursor-move"
                    style={{
                        width: '200px',
                        height: '200px',
                        top: '25%',
                        left: '25%',
                        transform: 'translate(0%, 0%)',
                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
                    }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                />
            </div>
            <div className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-b-lg w-full max-w-md flex justify-center gap-4 mt-2">
                <button
                    onClick={onClose}
                    className="px-6 py-2 rounded-lg border border-gray-400 text-white hover:bg-gray-700"
                >
                    Batal
                </button>
                <button
                    onClick={handleSave}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                    Simpan
                </button>
            </div>
        </div>
    );
};

export default ImageCropperModal;
