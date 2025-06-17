import React from 'react'

const StarIcon = ({ className = "w-4 h-4 text-blue-400" }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
    </svg>
);
const ChatBubbleIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.195-.883.078-1.707-.126-2.427-.465a4.903 4.903 0 0 1-1.574-1.296c-.443-.534-.928-1.035-1.428-1.49a4.897 4.897 0 0 0-2.12.14c-1.018.41-2.13.256-3.005-.442a4.897 4.897 0 0 1-1.427-1.49c-.443-.534-.928-1.035-1.428-1.49a4.897 4.897 0 0 0-2.12.14c-1.018.41-2.13.256-3.005-.442a4.903 4.903 0 0 1-1.574-1.296C.847 15.1 0 14.136 0 13v-4.286c0-.97.616-1.813 1.5-2.097C3.426 6.166 5.208 6 7 6h10c1.792 0 3.574.166 5.25.511Z" />
    </svg>
);

const StoreIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.25m11.25 0h8.25m-11.25 0V11.25a.75.75 0 0 0-.75-.75H9.75a.75.75 0 0 0-.75.75V21m-4.5 0H2.25m9 0V3.75a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0h.008v.008H11.25v-.008Z" />
    </svg>
);

interface Seller {
    name: string;
    avatarUrl: string;
    lastActive: string;
    location: string;
    stats: {
        rating: number;
        reviewsCount: number;
        reviews: string;
        products: number;
        chatResponseRate: string;
        chatResponseTime: string;
        joined: string;
        followers: string;
    };
}

interface SellerInfoProps {
    seller: Seller;
}

const SellerInfo: React.FC<SellerInfoProps> = ({ seller }) => {
    return (
        <div className="bg-white rounded-lg shadow-md mt-4">
            {/* Mobile View */}
            <div className="p-4 sm:hidden">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                            <img src={seller.avatarUrl} alt={seller.name} className="w-14 h-14 rounded-full border" />
                            <div className="absolute -bottom-1 -right-1 block bg-red-600 text-white text-[10px] font-bold px-1 rounded-sm">
                                Star+
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-base">{seller.name}</h3>
                            <p className="text-xs text-gray-500">Aktif {seller.lastActive}</p>
                            <p className="text-xs text-gray-500">{seller.location}</p>
                        </div>
                    </div>
                    <button className="flex-shrink-0 text-sm text-blue-600 border border-blue-600 rounded px-4 py-1.5 hover:bg-blue-50 transition">
                        Kunjungi
                    </button>
                </div>
                <div className="flex justify-around text-center mt-4 pt-4 border-t border-gray-200">
                    <div className="flex-1">
                        <p className="font-bold text-sm">{seller.stats.rating}</p>
                        <p className="text-xs text-gray-500">Penilaian</p>
                    </div>
                    <div className="w-px bg-gray-200"></div>
                    <div className="flex-1">
                        <p className="font-bold text-sm">{seller.stats.products}</p>
                        <p className="text-xs text-gray-500">Produk</p>
                    </div>
                    <div className="w-px bg-gray-200"></div>
                    <div className="flex-1">
                        <p className="font-bold text-sm text-blue-600">{seller.stats.chatResponseRate}</p>
                        <p className="text-xs text-gray-500">Chat Dibalas</p>
                    </div>
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden sm:flex flex-col sm:flex-row items-start gap-4 p-6">
                <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="relative">
                        <img src={seller.avatarUrl} alt={seller.name} className="w-20 h-20 rounded-full border" />
                        <span className="absolute bottom-0 right-0 block bg-blue-500 border-2 border-white rounded-full p-0.5">
                            <StarIcon className="w-3 h-3 text-white" />
                        </span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">{seller.name}</h3>
                        <p className="text-sm text-gray-500">Aktif {seller.lastActive}</p>
                        <div className="mt-2 flex space-x-2">
                            <button className="flex items-center gap-1 text-sm text-blue-600 border border-blue-600 rounded px-3 py-1 hover:bg-blue-50 transition">
                                <ChatBubbleIcon className="w-4 h-4" />
                                <span>Chat Sekarang</span>
                            </button>
                            <button className="flex items-center gap-1 text-sm text-gray-700 border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 transition">
                                <StoreIcon />
                                <span>Kunjungi Toko</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="w-full sm:w-px sm:h-16 h-px bg-gray-200 sm:mx-6 my-4 sm:my-0"></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 text-sm w-full">
                    <div className="flex sm:flex-col gap-1">
                        <span className="text-gray-500 w-32 sm:w-auto">Penilaian</span>
                        <span className="text-blue-600 font-semibold">{seller.stats.reviewsCount}</span>
                    </div>
                    <div className="flex sm:flex-col gap-1">
                        <span className="text-gray-500 w-32 sm:w-auto">Persentase Chat Dibalas</span>
                        <span className="text-blue-600 font-semibold">{seller.stats.chatResponseRate}</span>
                    </div>
                    <div className="flex sm:flex-col gap-1">
                        <span className="text-gray-500 w-32 sm:w-auto">Bergabung</span>
                        <span className="text-blue-600 font-semibold">{seller.stats.joined}</span>
                    </div>
                    <div className="flex sm:flex-col gap-1">
                        <span className="text-gray-500 w-32 sm:w-auto">Produk</span>
                        <span className="text-blue-600 font-semibold">{seller.stats.products}</span>
                    </div>
                    <div className="flex sm:flex-col gap-1">
                        <span className="text-gray-500 w-32 sm:w-auto">Waktu Chat Dibalas</span>
                        <span className="text-blue-600 font-semibold">{seller.stats.chatResponseTime}</span>
                    </div>
                    <div className="flex sm:flex-col gap-1">
                        <span className="text-gray-500 w-32 sm:w-auto">Pengikut</span>
                        <span className="text-blue-600 font-semibold">{seller.stats.followers}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default SellerInfo