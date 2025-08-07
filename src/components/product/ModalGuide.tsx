import { Media, Product } from 'components/types/Product';
import { X } from 'lucide-react'
import React, { useEffect } from 'react'

type Props = {
    setOpenModalGuide: (boolean: boolean) => void;
    openModalGuide: boolean;
    detailProduct: Product | null;
}

const ModalGuide = ({ setOpenModalGuide, openModalGuide, detailProduct }: Props) => {
    const imageGuide = detailProduct?.media?.find((item: Media) => item.type === 'image_guide')
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpenModalGuide(false);
            }
        };

        if (openModalGuide) {
            window.addEventListener("keydown", handleKeyDown);
        }

        // Cleanup listener saat komponen unmount atau modal tertutup
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [openModalGuide, detailProduct]);
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
            onClick={() => setOpenModalGuide(false)}
        >
            <div
                className="relative w-full max-w-4xl transform rounded-xl bg-white p-4 py-6 shadow-2xl transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="space-y-4">
                    <div className='flex justify-between px-8'>
                        <div className='space-y-2'>
                            <h3 id="modal-title" className="text-[27px] font-bold text-black tracking-[-0.03em]">
                                Panduan Ukuran
                            </h3>
                            <p className="text-[16px] text-black tracking-[-0.03em]">
                                Anda bisa meng-upload panduan ukuran seperti gambar berikut
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setOpenModalGuide(false)}

                            aria-label="Tutup modal"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="overflow-hidden  flex items-center justify-center">
                        <img
                            src={imageGuide?.url}
                            alt="Contoh Panduan Ukuran Baju"
                            className="w-full object-contain max-h-[70vh] max-w-[70vh]"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalGuide