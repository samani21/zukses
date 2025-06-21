import React from 'react'

const SearchIcon = ({ className = "w-5 h-5 text-gray-400" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);
const ShieldCheckIcon = () => (
    <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
);
interface Suggestion {
    type: 'suggestion' | 'store' | 'protection';
    text: string;
    location?: string;
    icon?: string;
}

interface SearchSuggestionsProps {
    suggestions: Suggestion[];
    searchTerm: string;
}


function SearchSuggestions({ suggestions, searchTerm }: SearchSuggestionsProps) {
    if (!searchTerm) return null;

    const filteredSuggestions = suggestions.filter(s =>
        s.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            <ul>
                {filteredSuggestions.map((s, index) => (
                    <li key={index} className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center">
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
    );
}
export default SearchSuggestions