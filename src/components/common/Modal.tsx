// src/components/common/Modal.tsx
import React, { FC, ReactNode } from 'react';
import { XIcon } from './icons';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XIcon size={24} />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto">
                    {children}
                </div>
                {footer && <div className="p-4 border-t flex justify-end">{footer}</div>}
            </div>
        </div>
    );
};

export default Modal;