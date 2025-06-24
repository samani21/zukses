import React, { FC } from 'react'

const TabButton: FC<{ label: string; isActive: boolean; hasError: boolean; onClick: () => void; }> = ({ label, isActive, hasError, onClick }) => (
    <button
        onClick={onClick}
        className={`relative px-4 py-3 text-sm font-medium transition-colors ${isActive
            ? 'text-blue-600'
            : 'text-gray-500 hover:text-gray-800'
            }`}
    >
        <span className="flex items-center">
            {label}
            {hasError && <span className="w-2 h-2 bg-red-500 rounded-full ml-2"></span>}
        </span>
        {isActive && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
        )}
    </button>
);
export default TabButton