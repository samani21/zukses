"use client"; // Menandakan ini adalah Client Component di Next.js App Router

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

// Interface untuk mendefinisikan props yang diterima oleh komponen Modal
interface ModalProps {
    isOpen: boolean; // State untuk membuka/menutup modal
    onClose: () => void; // Fungsi yang dipanggil saat modal ditutup
    children: React.ReactNode; // Konten yang akan ditampilkan di dalam modal
    title?: string; // Judul opsional untuk header modal
}

// Komponen Ikon "X" untuk tombol tutup
const CloseIcon = () => (
    <svg
        className="w-6 h-6 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
        />
    </svg>
);


export function Modal({ isOpen, onClose, children, title }: ModalProps) {
    // State untuk memastikan portal hanya dirender di sisi client
    const [isMounted, setIsMounted] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Efek untuk menangani penutupan modal saat tombol "Escape" ditekan
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }

        // Cleanup listener saat komponen unmount atau modal tertutup
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Efek untuk fokus pada modal saat terbuka demi aksesibilitas
    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current.focus();
        }
    }, [isOpen]);


    // Jangan render apapun jika tidak di client atau modal tidak terbuka
    if (!isMounted || !isOpen) {
        return null;
    }

    // Menggunakan React Portal untuk merender modal di root body
    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            style={{ background: "#00000022" }}
        >
            <div
                ref={modalRef}
                className="relative w-full max-w-sm p-6 bg-white rounded-xl shadow-2xl m-4"
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
            >
                <div className="flex items-start justify-between mb-4">
                    {title && (
                        <h2 id="modal-title" className="text-xl font-bold text-gray-800">
                            {title}
                        </h2>
                    )}
                    <button
                        onClick={onClose}
                        className="p-1 -mt-1 -mr-1 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Tutup modal"
                    >
                        <CloseIcon />
                    </button>
                </div>
                <div className="text-gray-600">{children}</div>
            </div>
        </div>,
        document.body
    );
}
