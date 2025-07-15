import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    hideCloseButton?: boolean;
}

export const ModalError: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    title,
    hideCloseButton = false,
}) => {
    // State untuk memastikan kode hanya berjalan di sisi client (browser)
    // Ini penting untuk Next.js agar tidak error saat Server-Side Rendering
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Menangani penutupan modal saat menekan tombol 'Escape'
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    // Varian animasi untuk background (backdrop)
    const backdropVariants = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
    };

    // Varian animasi untuk panel modal (sudah diperbaiki)
    const modalVariants = {
        hidden: {
            y: "-20px",
            opacity: 1,
            scale: 0.95,
        },
        visible: {
            y: "0",
            opacity: 1,
            scale: 1,
        },
        exit: {
            y: "20px",
            opacity: 0,
            scale: 0.95,
        },
    };

    if (!isClient) {
        return null;
    }

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.3 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto flex flex-col"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Modal */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800">{title || ''}</h3>
                            {!hideCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                                    aria-label="Tutup modal"
                                >
                                    <X size={24} />
                                </button>
                            )}
                        </div>

                        {/* Konten Modal */}
                        <div className="p-6 overflow-y-auto">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};