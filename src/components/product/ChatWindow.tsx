import { formatRupiah } from "components/Rupiah";
import { Product, Seller, variant } from "components/types/Product";
import { ChevronDown, FileIcon, Image as ImageIcon, PlusCircle, SendHorizonal } from "lucide-react";
import { FC, useState, useEffect, useRef } from "react";

const BoxIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M5 7.808v10.577q0 .269.173.442t.443.173h12.769q.269 0 .442-.173t.173-.442V7.808h-4v5.47q0 .46-.379.7t-.783.028L12 13.096l-1.839.91q-.403.211-.782-.028q-.379-.24-.379-.7v-5.47zM5.616 20q-.672 0-1.144-.472T4 18.385V7.486q0-.292.093-.55t.28-.475l1.558-1.87q.217-.293.543-.442T7.173 4h9.616q.372 0 .708.149t.553.441l1.577 1.91q.187.217.28.485q.093.267.093.56v10.84q0 .67-.472 1.143q-.472.472-1.143.472zM5.38 6.808H18.6L17.27 5.21q-.097-.096-.222-.153T16.788 5H7.192q-.134 0-.26.058t-.22.154zm4.619 1v5.153l2-1l2 1V7.809zm-5 0h14z" stroke-width="0.5" stroke="currentColor" /></svg>
);

type Message = {
    id: number;
    type: 'system' | 'product' | 'quick-reply' | 'user' | 'seller';
    text?: string;
    product?: { name: string; price: string; image: string; };
    options?: string[];
};

type Chat = {
    id: number;
    name: string;
    avatar: string;
    role: string;
    messages: Message[];
};


const ChatWindow: FC<{
    isOpen: boolean;
    onClose: () => void; chatRef: React.RefObject<HTMLDivElement | null>;
    variant: variant | null;
    seller: Seller;
    product: Product
}> = ({ isOpen, onClose, chatRef, variant, seller, product }) => {
    // --- State untuk data obrolan ---
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChatId, setActiveChatId] = useState<number>(1);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatBodyRef = useRef<HTMLDivElement>(null);
    const [showUploadMenu, setShowUploadMenu] = useState(false);
    const activeChat = chats.find(c => c.id === activeChatId);
    const [isMultiLine, setIsMultiLine] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);



    const getSellerReply = (userMessage: string): string => {
        const lowerCaseMessage = userMessage.toLowerCase();
        if (lowerCaseMessage.includes("ready")) {
            return "Halo kak, untuk produk ini stoknya ready ya. Silakan diorder.";
        }
        if (lowerCaseMessage.includes("kirim")) {
            return "Bisa kak, pesanan sebelum jam 3 sore akan dikirim di hari yang sama.";
        }
        // Balasan default
        return "Baik, ada lagi yang bisa kami bantu?";
    };

    // --- Fungsi untuk mengirim pesan dan menerima balasan otomatis ---
    const handleSendMessage = (text: string) => {
        if (text.trim() === "" || !activeChat || isTyping) return;

        const newMessage: Message = {
            id: Date.now(),
            type: "user",
            text: text, // biarkan ada \n
        };

        setChats(prevChats => prevChats.map(chat => {
            if (chat.id === activeChatId) {
                const filteredMessages = chat.messages.filter(msg => msg.type !== 'quick-reply');
                return { ...chat, messages: [...filteredMessages, newMessage] };
            }
            return chat;
        }));

        setInputValue("");
        setIsMultiLine(false);
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }

        setIsTyping(true);

        setTimeout(() => {
            const replyText = getSellerReply(text);
            const sellerReply: Message = {
                id: Date.now() + 1,
                type: 'seller',
                text: replyText
            };

            setChats(prevChats => prevChats.map(chat => {
                if (chat.id === activeChatId) {
                    return { ...chat, messages: [...chat.messages, sellerReply] };
                }
                return chat;
            }));

            setIsTyping(false);
        }, 1500);
    };


    // --- Auto-scroll ke pesan terbaru ---
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [chats, activeChatId, isTyping]);

    useEffect(() => {
        setActiveChatId(product?.seller_id)
        setChats([
            {
                id: product?.seller_id,
                name: seller?.name,
                avatar: seller?.avatarUrl,
                role: 'Penjual',
                messages: [
                    {
                        id: 1,
                        type: "system",
                        text: "Waspada Penipuan! Demi keamanan, mohon untuk tidak bertransaksi di luar aplikasi Zukses dan jangan membagikan data pribadi seperti nomor HP atau alamat kepada penjual. Selalu gunakan aplikasi Zukses untuk seluruh komunikasi. Baca Panduan Keamanan untuk informasi lebih lanjut.",
                    },
                    {
                        id: 2,
                        type: "quick-reply",
                        options: ["Produk ini ready?", "Bisa dikirim hari ini?"],
                    },
                    {
                        id: 3,
                        type: "product",
                        product: {
                            name: product?.name + " varian " + variant?.combination_label,
                            price: formatRupiah(String(variant?.discount_price || product?.discount_price)),
                            image: variant?.image || product?.image, // Placeholder image
                        },
                    },
                ]
            },
            // Anda bisa menambahkan data chat lain di sini
        ])
    }, [seller, variant, product])

    if (!isOpen) {
        return null;
    }

    return (
        <div ref={chatRef} className="fixed bottom-5 w-full left-0 z-50">
            <div className="flex items-center justify-center">
                <div className="w-[1200px] flex items-center justify-end">
                    <div className="w-[580px] h-[470px] rounded-md shadow-2xl bg-white border border-gray-200 flex transition-all shadow-[0px_2px_30px_0px_#98A3B4] duration-300">

                        <div className="w-1/3 border-r border-[#dddddd] flex flex-col">
                            <div className="p-2 border-b border-[#dddddd]">
                                <p className="font-bold text-[18px] text-[#000]">Chat</p>
                            </div>
                            <div className="flex-grow overflow-y-auto">
                                {chats.map(chat => (
                                    <div
                                        key={chat.id}
                                        onClick={() => setActiveChatId(chat.id)}
                                        className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 ${activeChatId === chat.id ? 'bg-[#e5fff3]' : ''}`}
                                    >
                                        <img src={chat?.avatar} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600" />
                                        <div>
                                            <p className="font-semibold text-[14px] text-[#333]">{chat.name}</p>
                                            <p className="text-[12px] text-[#563d7c]">{chat.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="w-2/3 flex flex-col">
                            {activeChat ? (
                                <>
                                    <div className="p-2 flex items-center justify-between w-full border-b border-[#dddddd]">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <p className="font-bold text-[18px] text-[#000]">{activeChat.name}</p>
                                            </div>
                                        </div>
                                        <ChevronDown onClick={onClose} className="cursor-pointer text-gray-600" />
                                    </div>

                                    <div ref={chatBodyRef} className="p-4 overflow-y-auto space-y-4 no-scrollbar pb-0">
                                        {activeChat.messages.map((msg) => (
                                            <div key={msg.id}>
                                                {msg.type === "system" && <div className="p-3 rounded-[10px] bg-[#F0F5FF] border border-[#D4DFF7DD] shadow-[1px_1px_4px_#00000014] font-[500] text-[#444444] text-[14px]" style={{
                                                    lineHeight: "150%",
                                                    letterSpacing: "-0.03em"
                                                }}>{msg.text}</div>}
                                                {msg.type === 'quick-reply' && msg.options && (
                                                    <div className="flex gap-2 mt-10">
                                                        {msg.options.map((option, index) => (
                                                            <button key={index} onClick={() => handleSendMessage(option)} className="px-[12px] h-[25px] flex items-center py-[4px] border border-[#00AA5B] text-[#00AA5B] text-[14px] font-[500] tracking-[-0.03em] rounded-[10px] text-sm hover:bg-green-50">{option}</button>
                                                        ))}
                                                    </div>
                                                )}
                                                {msg.type === "product" && msg.product && (
                                                    <div className="p-3 bg-[#FAFAFA] border border-[#DDDDDDDD] shadow-[0px_2px_30px_0px_#00000014] rounded-[10px] mb-2 tracking-[-0.03em]">
                                                        <p className="text-[14px] font-[500] text-[#444444]">Kamu menanyakan tentang produk ini</p>
                                                        <div className=" flex items-center gap-3 my-2">
                                                            <img src={msg.product.image} alt={msg.product.name} className="w-[67px] h-[67px]  object-cover" onError={(e) => e.currentTarget.src = 'https://placehold.co/100x100/e2e8f0/4a5568?text=Error'} />
                                                            <div>
                                                                <p className="text-[14px] font-[500] text-[#444444] line-clamp-2">{msg.product.name}</p>
                                                                <p className="text-[14px] font-bold text-[#E33947]">{msg.product.price}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {msg.type === 'user' && (
                                                    <div className="flex justify-end">
                                                        <div
                                                            className="bg-green-100 text-gray-800 p-3 rounded-lg max-w-xs whitespace-pre-wrap"
                                                        >
                                                            {msg.text}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* --- Pesan dari Penjual --- */}
                                                {msg.type === 'seller' && (
                                                    <div className="flex justify-start">
                                                        <div
                                                            className="bg-white border border-gray-200 text-gray-800 p-3 rounded-lg max-w-xs whitespace-pre-wrap"
                                                        >
                                                            {msg.text}
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        ))}
                                        {/* --- Indikator Mengetik --- */}
                                        {isTyping && (
                                            <div className="flex justify-start">
                                                <div className="bg-white border border-gray-200 text-gray-500 p-3 rounded-lg max-w-xs">
                                                    <span className="italic">Penjual sedang mengetik...</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-3 bg-white space-y-2">
                                        <div className={`flex ${isMultiLine ? "items-end" : "items-center"} gap-2`}>
                                            {/* ICON PLUS */}


                                            {/* INPUT TEXT */}
                                            <div
                                                className={`flex justify-between w-full border border-[#CCCCCC] 
        p-2 focus-within:ring-2 focus-within:ring-green-500 px-4 transition-all
        ${isMultiLine ? 'rounded-md items-end pr-1' : 'rounded-full items-center pr-2'}`}
                                            >
                                                <textarea
                                                    ref={textareaRef}
                                                    placeholder="Tulis Pesan"
                                                    value={inputValue}
                                                    onChange={(e) => {
                                                        setInputValue(e.target.value);
                                                        const lineHeight = 24;
                                                        const maxHeight = lineHeight * 3;
                                                        e.target.style.height = "auto";
                                                        const newHeight = Math.min(e.target.scrollHeight, maxHeight);
                                                        e.target.style.height = newHeight + "px";
                                                        setIsMultiLine(e.target.scrollHeight > lineHeight);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            // e.preventDefault();
                                                            // handleSendMessage(inputValue);
                                                        }
                                                    }}
                                                    rows={1}
                                                    className="outline-none w-full resize-none overflow-y-auto max-h-[72px] leading-6"
                                                    style={{ lineHeight: "1.5rem" }}
                                                />

                                                <div className="relative flex-shrink-0">
                                                    <button
                                                        type="button"
                                                        className="bg-gray-100 rounded-full hover:bg-gray-200 flex items-center"
                                                        onClick={() => {
                                                            setShowUploadMenu(prev => !prev);
                                                        }}
                                                    >
                                                        <PlusCircle size={20} className="text-black" />
                                                    </button>

                                                    {showUploadMenu && (
                                                        <div className="absolute bottom-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-40">
                                                            <button
                                                                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-sm"
                                                                onClick={() => {
                                                                    document.getElementById("image-upload")?.click();
                                                                    setShowUploadMenu(false);
                                                                }}
                                                            >
                                                                <ImageIcon size={18} /> Upload Gambar
                                                            </button>
                                                            <button
                                                                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-sm"
                                                                onClick={() => {
                                                                    document.getElementById("image-upload")?.click();
                                                                    setShowUploadMenu(false);
                                                                }}
                                                            >
                                                                <BoxIcon /> Link Produk
                                                            </button>
                                                            <button
                                                                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-sm"
                                                                onClick={() => {
                                                                    document.getElementById("file-upload")?.click();
                                                                    setShowUploadMenu(false);
                                                                }}
                                                            >
                                                                <FileIcon size={18} /> Upload File
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* SEND BUTTON */}
                                            <button
                                                onClick={() => handleSendMessage(inputValue)}
                                                className="p-2 bg-[#00AA5B] text-white rounded-full hover:bg-green-600 disabled:bg-gray-400"
                                                disabled={!inputValue.trim() || isTyping}
                                            >
                                                <SendHorizonal size={20} />
                                            </button>
                                        </div>

                                        {/* FILE INPUT TERSEMBUNYI */}
                                        <input
                                            type="file"
                                            id="image-upload"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    console.log("Image selected:", e.target.files[0]);
                                                    // TODO: proses upload gambar di sini
                                                }
                                            }}
                                        />
                                        <input
                                            type="file"
                                            id="file-upload"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    console.log("File selected:", e.target.files[0]);
                                                    // TODO: proses upload file di sini
                                                }
                                            }}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">Pilih obrolan untuk dimulai</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
