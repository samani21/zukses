import { formatRupiah } from "components/Rupiah";
import { Product, Seller, variant } from "components/types/Product";
import { Archive, ChevronDown, Image as ImageIcon, SendHorizonal } from "lucide-react";
import { FC, useState, useEffect, useRef } from "react";
// Pastikan Anda mengimpor Image jika menggunakan Next.js
// import Image from "next/image";

// Tipe data untuk pesan dan obrolan
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
    console.log('variant', variant)
    const activeChat = chats.find(c => c.id === activeChatId);

    // --- Fungsi untuk mendapatkan balasan penjual berdasarkan pesan pengguna ---
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
            id: Date.now(), // Gunakan timestamp untuk ID unik
            type: "user",
            text: text,
        };

        // Perbarui state secara fungsional untuk menghindari race condition
        setChats(prevChats => prevChats.map(chat => {
            if (chat.id === activeChatId) {
                const filteredMessages = chat.messages.filter(msg => msg.type !== 'quick-reply');
                return { ...chat, messages: [...filteredMessages, newMessage] };
            }
            return chat;
        }));

        setInputValue("");
        setIsTyping(true);

        // Simulasi balasan dari penjual setelah 1.5 detik
        setTimeout(() => {
            const replyText = getSellerReply(text);
            const sellerReply: Message = {
                id: Date.now() + 1, // Pastikan ID unik
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

                        <div className="w-1/3 border-r border-gray-200 flex flex-col">
                            <div className="p-4 border-b">
                                <p className="font-bold text-[25px] text-[#444444]">Chat</p>
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
                                    <div className="p-4 flex items-center justify-between w-full border-b">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <p className="font-bold text-[25px] text-[#444444]">{activeChat.name}</p>
                                            </div>
                                        </div>
                                        <ChevronDown onClick={onClose} className="cursor-pointer text-gray-600" />
                                    </div>

                                    <div ref={chatBodyRef} className=" bg-gray-50 p-4 overflow-y-auto space-y-4 no-scrollbar pb-0">
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
                                                        <div className="bg-green-100 text-gray-800 p-3 rounded-lg max-w-xs">{msg.text}</div>
                                                    </div>
                                                )}
                                                {/* --- Pesan dari Penjual --- */}
                                                {msg.type === 'seller' && (
                                                    <div className="flex justify-start">
                                                        <div className="bg-white border border-gray-200 text-gray-800 p-3 rounded-lg max-w-xs">
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

                                    <div className="p-3 bg-white flex items-center gap-3">
                                        <ImageIcon className="text-gray-500 cursor-pointer" />
                                        <Archive className="text-gray-500 cursor-pointer" />
                                        <input type="text" placeholder="Tulis Pesan" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)} className="flex-grow p-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500" />
                                        <button onClick={() => handleSendMessage(inputValue)} className="p-2 bg-[#00AA5B] text-white rounded-full hover:bg-green-600 disabled:bg-gray-400" disabled={!inputValue.trim() || isTyping}><SendHorizonal size={20} /></button>
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
