import React, { useEffect } from 'react';

interface SnackbarProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    isOpen: boolean;
    onClose: () => void;
    duration?: number;
}

const typeColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
};

const Snackbar: React.FC<SnackbarProps> = ({
    message,
    type = 'info',
    isOpen,
    onClose,
    duration = 3000,
}) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, duration, onClose]);

    return (
        <div
            className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 max-w-[90%] sm:max-w-sm text-white rounded-lg shadow-lg transition-opacity duration-300 z-50
        ${typeColors[type]} ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
        >
            {message}
        </div>
    );
};

export default Snackbar;
