import React, { useState } from 'react'
import { createPortal } from 'react-dom';

const SearchIcon = ({ className = "w-5 h-5 text-gray-400" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);
const ShieldCheckIcon = () => (
    <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
);
const ArrowLeftIcon = () => (
    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
);

interface Suggestion {
    type: 'suggestion' | 'store' | 'protection';
    text: string;
    location?: string;
    icon?: string;
}

interface MobileSearchProps {
    onClose: () => void;
    suggestions: Suggestion[];
}
function MobileSearch({ onClose, suggestions }: MobileSearchProps) {
    const [searchTerm, setSearchTerm] = useState('');

    return createPortal(
        <div className="fixed inset-0 bg-white z-50">
            <div className="container mx-auto p-2 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                    <button onClick={onClose} className="p-2"><ArrowLeftIcon /></button>
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari di Zukses"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                    </div>
                    <button className="px-4 py-2 text-green-600 font-semibold text-sm">
                        Cari
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto">
                    <ul>
                        {suggestions.filter(s => s.text.toLowerCase().includes(searchTerm.toLowerCase())).map((s, index) => (
                            <li key={index} className="px-2 py-3 hover:bg-gray-100 cursor-pointer flex items-center">
                                {s.type === 'suggestion' && <SearchIcon className="w-5 h-5 text-gray-400 mr-3" />}
                                {s.type === 'store' && <img src={s.icon} alt="store" className="w-6 h-6 rounded-full mr-3" />}
                                {s.type === 'protection' && <ShieldCheckIcon />}
                                <div>
                                    <span className="font-semibold">{s.text}</span>
                                    {s.location && <span className="text-sm text-gray-500 ml-2">{s.location}</span>}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default MobileSearch