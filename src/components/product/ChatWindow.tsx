import { FC, useEffect } from "react";

const ChatWindow: FC<{ isOpen: boolean; isFixed: boolean; onClose: () => void; chatRef: React.RefObject<HTMLDivElement | null> }> = ({ isOpen, isFixed, onClose, chatRef }) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, chatRef]);

    if (!isOpen) {
        return null;
    }

    const baseClasses = "w-[580px] h-[470px] rounded-md shadow-2xl bg-white border border-gray-500 flex flex-col transition-all shadow-[0px_2px_30px_0px_#98A3B4] duration-300";
    const fixedClasses = 'fixed bottom-5 right-5 z-50';
    const absoluteClasses = 'absolute bottom-full right-0 mb-2 z-10';

    return (
        <div ref={chatRef} className={`${baseClasses} ${isFixed ? fixedClasses : absoluteClasses}`}>
            <div className="p-4 ">
                <p className="font-semibold text-lg text-center text-gray-800">Chat dengan Penjual</p>
            </div>
            <div className="flex-grow bg-gray-50 p-2 overflow-y-auto">
                <p className="text-sm text-gray-600 text-center mt-4">Mulai percakapan Anda...</p>
            </div>
            <div className="p-2 ">
                <input type="text" placeholder="Ketik pesan Anda..." className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none" />
            </div>
        </div>
    );
};

export default ChatWindow