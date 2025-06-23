import React, { useEffect, useRef, useState } from 'react'

const ImageCropper = ({ imageSrc, onCropComplete }: { imageSrc: string; onCropComplete: (croppedImage: string) => void; }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [cropRect, setCropRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
    const originalImageRef = useRef<HTMLImageElement | null>(null);

    const getNormalizedRect = (rect: typeof cropRect) => {
        const x = rect.width < 0 ? rect.x + rect.width : rect.x;
        const y = rect.height < 0 ? rect.y + rect.height : rect.y;
        const width = Math.abs(rect.width);
        const height = Math.abs(rect.height);
        return { x, y, width, height };
    };

    const redrawCanvasAndPreview = () => {
        const image = originalImageRef.current;
        const canvas = canvasRef.current;
        const previewCanvas = previewCanvasRef.current;
        if (!image || !canvas || !previewCanvas) return;

        const ctx = canvas.getContext('2d');
        const pctx = previewCanvas.getContext('2d');
        if (!ctx || !pctx) return;

        // Bersihkan kedua canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

        // Gambar gambar asli di canvas utama
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        const normalizedRect = getNormalizedRect(cropRect);

        if (normalizedRect.width > 0 && normalizedRect.height > 0) {
            // Gambar overlay
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(0, 0, canvas.width, normalizedRect.y);
            ctx.fillRect(0, normalizedRect.y, normalizedRect.x, normalizedRect.height);
            ctx.fillRect(normalizedRect.x + normalizedRect.width, normalizedRect.y, canvas.width - (normalizedRect.x + normalizedRect.width), normalizedRect.height);
            ctx.fillRect(0, normalizedRect.y + normalizedRect.height, canvas.width, canvas.height - (normalizedRect.y + normalizedRect.height));

            // Gambar bingkai
            ctx.strokeStyle = '#0075C9';
            ctx.lineWidth = 2;
            ctx.strokeRect(normalizedRect.x, normalizedRect.y, normalizedRect.width, normalizedRect.height);

            // Gambar pratinjau
            const scaleX = image.naturalWidth / canvas.width;
            const scaleY = image.naturalHeight / canvas.height;
            pctx.drawImage(
                image,
                normalizedRect.x * scaleX,
                normalizedRect.y * scaleY,
                normalizedRect.width * scaleX,
                normalizedRect.height * scaleY,
                0, 0, previewCanvas.width, previewCanvas.height
            );
        }
    };

    useEffect(() => {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            originalImageRef.current = image;
            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (!canvas || !container) return;

            const maxWidth = container.offsetWidth;
            const scale = Math.min(1, maxWidth / image.width);
            canvas.width = image.width * scale;
            canvas.height = image.height * scale;
            redrawCanvasAndPreview();
        };
    }, [imageSrc]);

    const getCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    }

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const { x, y } = getCoords(e);
        setIsDrawing(true);
        setStartPoint({ x, y });
        setCropRect({ x, y, width: 0, height: 0 });
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        e.preventDefault();
        const { x, y } = getCoords(e);
        setCropRect({ x: startPoint.x, y: startPoint.y, width: x - startPoint.x, height: y - startPoint.y });
    };

    useEffect(redrawCanvasAndPreview, [cropRect, isDrawing]);

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const handleSave = () => {
        const image = originalImageRef.current;
        const canvas = canvasRef.current;
        const normalizedRect = getNormalizedRect(cropRect);
        if (!image || !canvas || normalizedRect.width === 0 || normalizedRect.height === 0) return;

        const tempCanvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / canvas.width;
        const scaleY = image.naturalHeight / canvas.height;

        tempCanvas.width = normalizedRect.width * scaleX;
        tempCanvas.height = normalizedRect.height * scaleY;
        const ctx = tempCanvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(image, normalizedRect.x * scaleX, normalizedRect.y * scaleY, normalizedRect.width * scaleX, normalizedRect.height * scaleY, 0, 0, tempCanvas.width, tempCanvas.height);
        onCropComplete(tempCanvas.toDataURL('image/png'));
    };

    return (
        <div className='flex flex-col items-center w-full'>
            <p className="text-sm text-gray-600 mb-4 text-center">Sentuh/klik dan seret pada gambar untuk memilih area.</p>
            <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-6">
                <div className="flex-shrink-0" ref={containerRef}>
                    <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="border rounded-md cursor-crosshair touch-none max-w-full"
                    />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-sm font-semibold text-gray-600">Pratinjau</p>
                    <canvas ref={previewCanvasRef} className="rounded-full border bg-gray-100 hidden" width="100" height="100"></canvas>
                </div>
            </div>
            <button onClick={handleSave} className="mt-6 bg-blue-500 text-white font-bold py-2 px-8 rounded-sm hover:bg-blue-600 transition">
                Simpan Potongan
            </button>
        </div>
    );
};
export default ImageCropper