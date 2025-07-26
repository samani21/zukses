// Direktif ini WAJIB ada di baris paling atas untuk komponen yang menggunakan hooks di Next.js
"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Image as ImageIcon, FileText, MessageCircleOff, Archive, SendHorizonal } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import UserProfile from 'pages/layouts/UserProfile';

function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(...inputs));
}

// --- TIPE DATA (TYPESCRIPT) ---
type User = {
    id: number;
    name: string;
    role: 'Penjual' | 'Pembeli';
    avatar: string;
};

type Message = {
    id: number;
    text?: string;
    timestamp: string;
    senderId: number;
    isMe: boolean;
    imageUrl?: string;
    file?: { name: string; size: number };
};

type Product = {
    name: string;
    price: string;
    image: string;
};

type Conversation = {
    user: User;
    messages: Message[];
    unreadCount: number;
    productInquiry?: Product;
};

// --- MOCK DATA ---
const mockUsers: { [key: number]: User } = {
    1: { id: 1, name: 'Anda', role: 'Pembeli', avatar: 'A' },
    2: { id: 2, name: 'Toko Cahaya', role: 'Penjual', avatar: 'TC' },
    3: { id: 3, name: 'Toko Pelita', role: 'Penjual', avatar: 'TP' },
    4: { id: 4, name: 'Aisyah', role: 'Pembeli', avatar: 'AI' },
};

const mockConversations: Conversation[] = [
    {
        user: mockUsers[2],
        unreadCount: 2,
        productInquiry: {
            name: 'RoxArt 700ml Botol Minum Lipat Bahan Silikon Aman Dipakai Food Grade Tidak Berbau ...',
            price: 'Rp58.000',
            image: '/image/tas.svg',
        },
        messages: [
            { id: 1, text: 'Hai, Apakah produk ini masih ada?', timestamp: '16.13', senderId: 1, isMe: true },
            { id: 2, text: 'Iya, masih ada', timestamp: '16.14', senderId: 2, isMe: false },
            { id: 3, text: 'Butuh berapa kak?', timestamp: '16.14', senderId: 2, isMe: false },
            { id: 4, text: '1 saja kak', timestamp: '16.15', senderId: 1, isMe: true },
            { id: 5, text: 'Okeh kak', timestamp: '16.16', senderId: 1, isMe: false },
            { id: 6, text: 'Terimakasih kak', timestamp: '16.16', senderId: 1, isMe: false },
        ],
    },
    {
        user: mockUsers[3],
        unreadCount: 0,
        messages: [{
            id: 5,
            text: 'Halo, pesanan saya sudah dikirim?',
            timestamp: '12.01',
            senderId: 1,
            isMe: true
        }, {
            id: 6,
            text: 'Sudah kak, sedang dalam perjalanan.',
            timestamp: '12.05',
            senderId: 3,
            isMe: false
        }]
    },
    {
        user: mockUsers[4],
        unreadCount: 1,
        messages: [{
            id: 7,
            text: 'Terima kasih barangnya sudah sampai!',
            timestamp: 'Kemarin',
            senderId: 4,
            isMe: false
        }],

    },
];

const CURRENT_USER_ID = 1;

// --- DEFINISI PROPS UNTUK SETIAP KOMPONEN ---
type ChatListItemProps = {
    conversation: Conversation;
    isActive: boolean;
    onClick: () => void;
};

type ChatListProps = {
    conversations: Conversation[];
    activeConversationId: number | null;
    onSelectConversation: (userId: number) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
};

type MessageBubbleProps = {
    message: Message;
};

type ChatWindowProps = {
    conversation: Conversation | undefined;
    onNewMessage: (userId: number, message: Message) => void;
};


// --- KOMPONEN-KOMPONEN ---

const ChatListItem: React.FC<ChatListItemProps> = ({ conversation, isActive, onClick }) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return (
        <div onClick={onClick} className={cn('flex items-center p-3 cursor-pointer transition-colors duration-200', isActive ? 'bg-[#F6E9F0]' : 'hover:bg-gray-100')}>
            <div className={cn('w-[50px] h-[50px] rounded-full flex items-center justify-center text-[#27379D] font-[500] text-[18px] mr-4 shrink-0', isActive ? 'bg-[#D9D9D9]' : 'bg-[#D9D9D9]')}>
                {conversation.user.avatar}
            </div>
            <div className="flex-grow overflow-hidden">
                <div className="flex justify-between items-center">
                    <h3 className="font-[500] text-black text-[18px]">{conversation.user.name}</h3>
                    <p className="text-xs text-gray-500">{lastMessage?.timestamp}</p>
                </div>
                <div className="flex justify-between items-start">
                    {/* <p className="text-sm text-gray-600 truncate">
                        {lastMessage?.text || (lastMessage?.imageUrl ? 'Gambar' : 'File')}</p>
                    {conversation.unreadCount > 0 && (<span className="bg-green-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{conversation.unreadCount}</span>)} */}
                    <p className='text-[14px] text-[#563D7C] font-[500]'>{conversation?.user?.role}</p>
                    {conversation.unreadCount > 0 && (<span className="bg-green-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{conversation.unreadCount}</span>)}
                </div>
            </div>
        </div>
    );
};

const ChatList: React.FC<ChatListProps> = ({ conversations, activeConversationId, onSelectConversation, searchQuery, setSearchQuery }) => {
    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
                <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" placeholder="Cari Nama" className="w-full pr-10 pl-4 py-2 border border-[#CCCCCC] rounded-[5px] text-[14px] text-[#777777] font-[500] focus:outline-none focus:ring-2 focus:ring-purple-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                {/* <div className="mt-4 flex space-x-2">
                    <button onClick={() => setFilter('semua')} className={cn("px-4 py-1 text-sm font-medium rounded-full", filter === 'semua' ? 'text-green-600 bg-green-100 border border-green-500' : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50')}>Semua</button>
                    <button onClick={() => setFilter('belum_dibaca')} className={cn("px-4 py-1 text-sm font-medium rounded-full", filter === 'belum_dibaca' ? 'text-green-600 bg-green-100 border border-green-500' : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50')}>Belum dibaca</button>
                </div> */}
            </div>
            <div className="flex-grow overflow-y-auto">
                {conversations.map((convo) => (
                    <ChatListItem key={convo.user.id} conversation={convo} isActive={activeConversationId === convo.user.id} onClick={() => onSelectConversation(convo.user.id)} />
                ))}
            </div>
        </div>
    );
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    return (
        <div className={cn('flex', message.isMe ? 'justify-end' : 'justify-start')}>
            <div className={cn('max-w-xs md:max-w-md lg:max-w-lg p-2 rounded-[5px] mb-2 flex gap-4', message.isMe ? 'bg-[#D7F7EF] shadow-[1px_1px_4px_rgba(0,0,0,0.08)] border border-[#DDDDDDDD] text-[#444444] text-[14px] font-[500]' : 'bg-[#fff] shadow-[1px_1px_4px_rgba(0,0,0,0.08)] border border-[#DDDDDDDD] text-[#444444] text-[14px] font-[500]')}>
                {message.imageUrl && (
                    <div>
                        <img src={message.imageUrl} alt="Pratinjau Gambar" className="rounded-lg mb-2 max-w-full h-auto" />
                        <p className={cn('text-xs mt-1', message.isMe ? 'text-right text-[#444444] text-[12px]' : 'text-left text-gray-500')}>{message.timestamp}</p>
                    </div>
                )}
                {message.file && (
                    <div>
                        <div className="flex items-center p-2 bg-gray-100 rounded-lg"><FileText className="text-gray-500 mr-3" size={30} />
                            <div>
                                <p className="text-sm font-semibold truncate">{message.file.name}</p>
                                <p className="text-xs text-gray-500">{(message.file.size / 1024).toFixed(2)} KB</p>
                            </div>
                        </div>
                        <p className={cn('text-xs mt-1', message.isMe ? 'text-right text-[#444444] text-[12px]' : 'text-left text-gray-500')}>{message.timestamp}</p>
                    </div>
                )}
                {message.text &&
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                }
                {!message.imageUrl && !message.imageUrl &&
                    <p className={cn('text-xs mt-1', message.isMe ? 'text-right text-[#444444] text-[12px]' : 'text-left text-gray-500')}>{message.timestamp}</p>
                }
            </div>
        </div>
    );
};

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, onNewMessage }) => {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // const scrollToBottom = () => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // };

    // useEffect(() => {
    //     scrollToBottom();
    // }, [conversation?.messages]);

    // Perbaikan: Membersihkan Object URL untuk mencegah memory leak
    useEffect(() => {
        return () => {
            conversation?.messages.forEach(message => {
                if (message.imageUrl && message.imageUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(message.imageUrl);
                }
            });
        };
    }, [conversation]);

    const createMessageObject = (data: Partial<Message>): Message => ({
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        senderId: CURRENT_USER_ID,
        isMe: true,
        ...data,
    });

    const handleSendMessage = () => {
        if (!conversation || inputValue.trim() === '') return;
        const newMessage = createMessageObject({ text: inputValue });
        onNewMessage(conversation.user.id, newMessage);
        setInputValue('');
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, isImage: boolean) => {
        const file = event.target.files?.[0];
        if (!file || !conversation) return;

        const messageData = isImage
            ? { imageUrl: URL.createObjectURL(file) }
            : { file: { name: file.name, size: file.size } };

        const newMessage = createMessageObject(messageData);
        onNewMessage(conversation.user.id, newMessage);
        event.target.value = '';
    };

    if (!conversation) {
        return (<div className="flex items-center justify-center h-full bg-gray-50 text-gray-500">
            <div>
                <div className='flex justify-center mb-4'>
                    <MessageCircleOff className='w-[150px] h-[150px]' />
                </div>
                Pilih percakapan untuk memulai
            </div>
        </div>);
    }

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <input type="file" ref={imageInputRef} accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, true)} />
            <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFileSelect(e, false)} />
            <div className='p-4'>
                {conversation.productInquiry && (
                    <div className="p-4 border border-[#DDDDDDDD] shadow-[1px_1px_4px_rgba(0,0,0,0.08)] bg-white ">
                        <div>
                            <p className="text-[14px] text-[#444444] font-[500] tracking-[-0.03em]">Kamu menanyakan tentang produk ini</p>
                        </div>
                        <div className='flex items-center space-x-6'>
                            <img src={conversation.productInquiry.image} alt={conversation.productInquiry.name} className="w-14 h-14 rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/e2e8f0/475569?text=Error'; }} />
                            <div>
                                <h3 className="font-[500] text-[14px] text-[#444444] line-clamp-2 w-[90%] mt-1">{conversation.productInquiry.name}</h3>
                                <p className="font-bold text-red-500">{conversation.productInquiry.price}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
                {conversation.messages.map((msg) => (<MessageBubble key={msg.id} message={msg} />))}<div ref={messagesEndRef} />
            </div>
            <div className=" bg-white border-t border-b border-[#CCCCCC]">
                <div className="flex items-center rounded-lg px-4">
                    <input type="text" placeholder="Tulis Pesan" className="h-[61px] bg-white w-full focus:outline-none px-2 text-gray-700" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} />
                </div>
                <div className="flex items-center justify-between space-x-2 border-t border-[#CCCCCC] p-4 px-6">
                    <div className='flex gap-3'>
                        <button className="text-[#555555] hover:text-gray-600" onClick={() => imageInputRef.current?.click()}>
                            <ImageIcon size={40} />
                        </button>
                        <button className="text-[#555555] hover:text-gray-600" onClick={() => fileInputRef.current?.click()}>
                            <Archive size={40} />
                        </button>
                    </div>
                    <button className="p-2 rounded-full  text-[#563D7C] hover:text-purple-600 transition-colors" onClick={handleSendMessage}><SendHorizonal size={40} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function ChatFeature() {
    const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
    const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'semua' | 'belum_dibaca'>('semua');

    const activeConversation = useMemo(() => conversations.find(c => c.user.id === activeConversationId), [conversations, activeConversationId]);
    console.log('activeConversation', activeConversation)
    const filteredConversations = useMemo(() => {
        return conversations
            .filter(convo => convo.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .filter(convo => filter === 'belum_dibaca' ? convo.unreadCount > 0 : true);
    }, [conversations, searchQuery, filter]);

    const handleSelectConversation = (userId: number) => {
        setActiveConversationId(userId);
        setConversations(prev => prev.map(c => c.user.id === userId ? { ...c, unreadCount: 0 } : c));
        // if (window.innerWidth < 768) {
        //     setIsChatListVisible(false);
        // }
    };

    const addMessageToConversation = (userId: number, newMessage: Message) => {
        setConversations(prev => {
            const target = prev.find(c => c.user.id === userId);
            if (!target) return prev;
            const others = prev.filter(c => c.user.id !== userId);
            const updatedTarget = {
                ...target,
                messages: [...target.messages, newMessage],
                unreadCount: !newMessage.isMe ? target.unreadCount + 1 : target.unreadCount,
            };
            return [updatedTarget, ...others];
        });
    };

    const handleNewMessage = (userId: number, newMessage: Message) => {
        addMessageToConversation(userId, newMessage);
        if (newMessage.isMe) {
            setTimeout(() => {
                const autoReply: Message = { id: Date.now(), text: 'Baik, pesan Anda sudah kami terima.', timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), senderId: userId, isMe: false };
                addMessageToConversation(userId, autoReply);
            }, 1500);
        }
    };

    // const handleBackToList = () => {
    //     setIsChatListVisible(true);
    // }

    return (
        <UserProfile>
            <div className='w-ful mx-auto border border-[#DDDDDD] rounded-[5px] shadow-[1px_1px_10px_rgba(0,0,0,0.08)]'>
                <div className='grid grid-cols-4 items-center border-b border-[#CCCCCC]'>
                    <div className='px-8 py-3'>
                        <h2 className="text-2xl font-bold">Chat</h2>
                    </div>
                    <div className='col-span-3 flex itmes-center gap-3 px-4'>
                        <button onClick={() => setFilter('semua')} className={cn("border border-[#00AA5B] rounded-[10px] px-4 text-[#333333] text-[12px] py-1 text-sm font-medium rounded-full", filter === 'semua' ? 'text-green-600 bg-green-100 border border-green-500' : 'bg-white hover:bg-gray-50')}>
                            Semua
                        </button>
                        <button onClick={() => setFilter('belum_dibaca')} className={cn("border border-[#00AA5B] rounded-[10px] px-4 text-[#333333] text-[12px] py-1 text-sm font-medium rounded-full", filter === 'belum_dibaca' ? 'text-green-600 bg-green-100 border border-green-500' : 'bg-white hover:bg-green-50')}>
                            Belum dibaca
                        </button>
                    </div>
                </div>
                <div className='grid grid-cols-4 h-[705px]'>
                    <div className="">
                        <ChatList conversations={filteredConversations} activeConversationId={activeConversationId} onSelectConversation={handleSelectConversation} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    </div>
                    <div className="col-span-3 overflow-y-auto">
                        <ChatWindow conversation={activeConversation} onNewMessage={handleNewMessage} />
                    </div>
                </div>
            </div>
            <div className="overflow-hidden flex">
                {/* <div className="md:hidden w-full h-full">
                    {isChatListVisible ? (
                        <ChatList conversations={filteredConversations} activeConversationId={activeConversationId} onSelectConversation={handleSelectConversation} searchQuery={searchQuery} setSearchQuery={setSearchQuery} filter={filter} setFilter={setFilter} />
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="p-3 text-left text-purple-600 font-semibold bg-gray-100 border-b flex items-center">
                                <button onClick={handleBackToList} className="mr-4">&larr;</button>
                                <span>{activeConversation?.user.name}</span>
                            </div>
                            <div className="flex-grow overflow-hidden">
                                <ChatWindow conversation={activeConversation} onNewMessage={handleNewMessage} />
                            </div>
                        </div>
                    )}
                </div>
                <div className="hidden md:flex w-full h-full">
                    <div className="w-1/3 xl:w-1/4 h-full">
                        <ChatList conversations={filteredConversations} activeConversationId={activeConversationId} onSelectConversation={handleSelectConversation} searchQuery={searchQuery} setSearchQuery={setSearchQuery} filter={filter} setFilter={setFilter} />
                    </div>
                    <div className="w-2/3 xl:w-3/4 h-full">
                        <ChatWindow conversation={activeConversation} onNewMessage={handleNewMessage} />
                    </div>
                </div> */}
            </div>
        </UserProfile>
    );
}
