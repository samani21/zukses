import React, { useEffect, useRef, useState } from 'react';

interface ImageCropperModalProps {
    imageSrc: string;
    onCropComplete: (croppedImage: string) => void;
    onClose: () => void;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);
interface ImageCropperModalProps {
    imageSrc: string;
    onCropComplete: (croppedImage: string) => void;
    onClose: () => void;
}
interface InteractionState {
    isDragging: boolean;
    isResizing: boolean;
    resizeDirection: string | null;
    startX: number;
    startY: number;
    startBoxX: number;
    startBoxY: number;
    startBoxWidth: number;
    startBoxHeight: number;
}
const ImageCropperModal: React.FC<ImageCropperModalProps> = ({ imageSrc, onCropComplete, onClose }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const cropBoxRef = useRef<HTMLDivElement>(null);

    // State untuk menangani interaksi drag, resize, dan posisi awal
    const [interactionState, setInteractionState] = useState<InteractionState>({
        isDragging: false,
        isResizing: false,
        resizeDirection: null,
        startX: 0,
        startY: 0,
        startBoxX: 0,
        startBoxY: 0,
        startBoxWidth: 0,
        startBoxHeight: 0,
    });

    // Efek untuk mengunci scroll body saat modal terbuka
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    // Efek untuk memposisikan crop box di tengah saat gambar dimuat
    useEffect(() => {
        const image = imageRef.current;
        const cropBox = cropBoxRef.current;
        if (image && cropBox) {
            const handleImageLoad = () => {
                const imageWidth = image.clientWidth;
                const imageHeight = image.clientHeight;
                const initialSize = Math.min(imageWidth, imageHeight, 200);

                cropBox.style.width = `${initialSize}px`;
                cropBox.style.height = `${initialSize}px`;
                cropBox.style.left = `${(image.offsetLeft + (imageWidth - initialSize) / 2)}px`;
                cropBox.style.top = `${(image.offsetTop + (imageHeight - initialSize) / 2)}px`;
            };

            if (image.complete) {
                handleImageLoad();
            } else {
                image.addEventListener('load', handleImageLoad);
            }

            return () => image.removeEventListener('load', handleImageLoad);
        }
    }, [imageSrc]);

    // Mendapatkan posisi client (x,y) dari mouse atau touch event
    const getClientCoords = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): { x: number; y: number } => {
        if ('touches' in e && e.touches) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
    };

    // Handler saat mulai menyeret (drag) crop box
    const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        e.preventDefault();
        const { x, y } = getClientCoords(e);
        const cropBox = cropBoxRef.current;
        if (!cropBox) return;

        setInteractionState({
            ...interactionState,
            isDragging: true,
            isResizing: false,
            startX: x,
            startY: y,
            startBoxX: cropBox.offsetLeft,
            startBoxY: cropBox.offsetTop,
        });
    };

    // Handler saat mulai mengubah ukuran (resize) crop box
    const handleResizeStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, direction: string) => {
        e.preventDefault();
        e.stopPropagation();
        const { x, y } = getClientCoords(e);
        const cropBox = cropBoxRef.current;
        if (!cropBox) return;

        setInteractionState({
            isDragging: false,
            isResizing: true,
            resizeDirection: direction,
            startX: x,
            startY: y,
            startBoxX: cropBox.offsetLeft,
            startBoxY: cropBox.offsetTop,
            startBoxWidth: cropBox.offsetWidth,
            startBoxHeight: cropBox.offsetHeight,
        });
    };

    // Handler saat mouse/jari bergerak
    const handleInteractionMove = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        if (!interactionState.isDragging && !interactionState.isResizing) return;

        const { x, y } = getClientCoords(e);
        const deltaX = x - interactionState.startX;
        const deltaY = y - interactionState.startY;

        if (interactionState.isDragging) {
            handleDragMove(deltaX, deltaY);
        } else if (interactionState.isResizing) {
            handleResizeMove(deltaX, deltaY);
        }
    };

    // Logika untuk memindahkan crop box saat di-drag
    const handleDragMove = (deltaX: number, deltaY: number) => {
        if (!imageRef.current || !cropBoxRef.current) return;
        const image = imageRef.current;
        const cropBox = cropBoxRef.current;

        const newX = interactionState.startBoxX + deltaX;
        const newY = interactionState.startBoxY + deltaY;

        // Batasi pergerakan di dalam gambar
        const minX = image.offsetLeft;
        const maxX = image.offsetLeft + image.clientWidth - cropBox.offsetWidth;
        const minY = image.offsetTop;
        const maxY = image.offsetTop + image.clientHeight - cropBox.offsetHeight;

        cropBox.style.left = `${Math.max(minX, Math.min(newX, maxX))}px`;
        cropBox.style.top = `${Math.max(minY, Math.min(newY, maxY))}px`;
    }

    // Logika untuk mengubah ukuran crop box saat di-resize
    const handleResizeMove = (deltaX: number, deltaY: number) => {
        const { startBoxX, startBoxY, startBoxWidth, startBoxHeight, resizeDirection } = interactionState;
        if (!imageRef.current || !cropBoxRef.current || !containerRef.current || !resizeDirection) return;

        const image = imageRef.current;
        const cropBox = cropBoxRef.current;
        const minSize = 40;

        let newLeft = startBoxX;
        let newTop = startBoxY;
        let newWidth = startBoxWidth;
        let newHeight = startBoxHeight;

        if (resizeDirection.includes('right')) newWidth = startBoxWidth + deltaX;
        if (resizeDirection.includes('left')) {
            newWidth = startBoxWidth - deltaX;
            newLeft = startBoxX + deltaX;
        }
        if (resizeDirection.includes('bottom')) newHeight = startBoxHeight + deltaY;
        if (resizeDirection.includes('top')) {
            newHeight = startBoxHeight - deltaY;
            newTop = startBoxY + deltaY;
        }

        if (newWidth < minSize) {
            newWidth = minSize;
            if (resizeDirection.includes('left')) newLeft = startBoxX + startBoxWidth - minSize;
        }
        if (newHeight < minSize) {
            newHeight = minSize;
            if (resizeDirection.includes('top')) newTop = startBoxY + startBoxHeight - minSize;
        }

        const imageOffsetX = image.offsetLeft;
        const imageOffsetY = image.offsetTop;

        if (newLeft < imageOffsetX) {
            newWidth -= (imageOffsetX - newLeft);
            newLeft = imageOffsetX;
        }
        if (newTop < imageOffsetY) {
            newHeight -= (imageOffsetY - newTop);
            newTop = imageOffsetY;
        }
        if (newLeft + newWidth > imageOffsetX + image.clientWidth) {
            newWidth = imageOffsetX + image.clientWidth - newLeft;
        }
        if (newTop + newHeight > imageOffsetY + image.clientHeight) {
            newHeight = imageOffsetY + image.clientHeight - newTop;
        }

        cropBox.style.left = `${newLeft}px`;
        cropBox.style.top = `${newTop}px`;
        cropBox.style.width = `${newWidth}px`;
        cropBox.style.height = `${newHeight}px`;
    }

    // Handler saat interaksi selesai (mouse up / touch end)
    const handleInteractionEnd = () => {
        setInteractionState((prevState) => ({
            ...prevState,
            isDragging: false,
            isResizing: false,
        }));
    };

    // Fungsi untuk menyimpan hasil crop
    const handleSave = () => {
        const image = imageRef.current;
        const cropBox = cropBoxRef.current;
        if (!image || !cropBox) return;

        const canvas = document.createElement('canvas');
        const finalSize = 250;
        canvas.width = finalSize;
        canvas.height = finalSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const scaleX = image.naturalWidth / image.clientWidth;
        const scaleY = image.naturalHeight / image.clientHeight;

        const sourceX = (cropBox.offsetLeft - image.offsetLeft) * scaleX;
        const sourceY = (cropBox.offsetTop - image.offsetTop) * scaleY;
        const sourceWidth = cropBox.clientWidth * scaleX;
        const sourceHeight = cropBox.clientHeight * scaleY;

        ctx.drawImage(
            image,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, finalSize, finalSize
        );
        onCropComplete(canvas.toDataURL('image/jpeg'));
    };

    const getCursorClass = (dir: string) => {
        if (dir.includes('top-left') || dir.includes('bottom-right')) return 'cursor-nwse-resize';
        if (dir.includes('top-right') || dir.includes('bottom-left')) return 'cursor-nesw-resize';
        return 'cursor-default';
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4 font-sans"
            onMouseMove={handleInteractionMove}
            onMouseUp={handleInteractionEnd}
            onMouseLeave={handleInteractionEnd}
            onTouchMove={handleInteractionMove}
            onTouchEnd={handleInteractionEnd}
        >
            <div className="w-full max-w-lg text-right mb-2">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <CloseIcon />
                </button>
            </div>

            <div ref={containerRef} className="relative w-full max-w-lg h-96 bg-gray-900 rounded-lg overflow-hidden select-none flex items-center justify-center">
                <img
                    ref={imageRef}
                    src={imageSrc}
                    alt="Area potong gambar"
                    className="max-w-full max-h-full pointer-events-none"
                    crossOrigin="anonymous"
                />
                <div
                    ref={cropBoxRef}
                    className="absolute border-2 border-dashed border-white cursor-move"
                    style={{ boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)' }}
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                >
                    {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((dir) => (
                        <div
                            key={dir}
                            onMouseDown={(e) => handleResizeStart(e, dir)}
                            onTouchStart={(e) => handleResizeStart(e, dir)}
                            className={`absolute w-3 h-3 bg-white border border-gray-800 rounded-full ${getCursorClass(dir)}`}
                            style={{
                                ...(dir.includes('top') ? { top: -8 } : { bottom: -8 }),
                                ...(dir.includes('left') ? { left: -8 } : { right: -8 }),
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="p-4 bg-gray-900 rounded-b-lg w-full max-w-lg flex justify-center gap-4 mt-2">
                <button
                    onClick={onClose}
                    className="px-6 py-2 rounded-lg border border-gray-500 text-white hover:bg-gray-700 transition-colors"
                >
                    Batal
                </button>
                <button
                    onClick={handleSave}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold"
                >
                    Simpan & Potong
                </button>
            </div>
        </div>
    );
};


export default ImageCropperModal;
