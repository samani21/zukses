import { ChevronDown } from "lucide-react";
import { FC } from "react";

const ChatWindow: FC<{ isOpen: boolean; isFixed: boolean; onClose: () => void; chatRef: React.RefObject<HTMLDivElement | null> }> = ({ isOpen, isFixed, onClose, chatRef }) => {


    if (!isOpen) {
        return null;
    }

    return (
        <div ref={chatRef} className="fixed bottom-5 w-full left-0  z-50">
            <div className="flex items-center justify-center">
                <div className="w-[1200px] flex items-center justify-end">
                    <div className="w-[580px] h-[470px] rounded-md shadow-2xl bg-white border border-gray-500 flex flex-col transition-all shadow-[0px_2px_30px_0px_#98A3B4] duration-300">
                        <div className="p-4 flex items-center justify-between w-full ">
                            <p className="font-semibold text-lg text-gray-800">Chat dengan Penjual</p>
                            <ChevronDown onClick={onClose} className="cursor-pointer" />
                        </div>
                        <div className="flex-grow bg-gray-50 p-2 overflow-y-auto">
                            <p className="text-sm text-gray-600 text-center mt-4">Mulai percakapan Anda...</p>
                        </div>
                        <div className="p-2 ">
                            <input type="text" placeholder="Ketik pesan Anda..." className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none" />
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="w-[580px] h-[470px] rounded-md shadow-2xl bg-white border border-gray-500 flex flex-col transition-all shadow-[0px_2px_30px_0px_#98A3B4] duration-300">
                <div className="p-4 flex items-center justify-between w-full ">
                    <p className="font-semibold text-lg text-gray-800">Chat dengan Penjual</p>
                    <ChevronDown onClick={onClose} className="cursor-pointer" />
                </div>
                <div className="flex-grow bg-gray-50 p-2 overflow-y-auto">
                    <p className="text-sm text-gray-600 text-center mt-4">Mulai percakapan Anda...</p>
                </div>
                <div className="p-2 ">
                    <input type="text" placeholder="Ketik pesan Anda..." className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none" />
                </div>
            </div> */}
        </div>
    );
};

export default ChatWindow