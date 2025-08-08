
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalChatProps {
    isOpen: boolean;
    onClose: () => void;
}

function ModalChat({
    isOpen,
    onClose,
}: ModalChatProps) {
    // Lock scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';

            return () => {
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [isOpen]);


    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={onClose}
            style={{ background: '#00000022' }}
        >
            <div
                className="relative "
                onClick={e => e.stopPropagation()}
            >
                <div className='bg-white w-[908px] h-[595px] shadow-2xl m-4 rounded-[10px] p-5'>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default ModalChat;
