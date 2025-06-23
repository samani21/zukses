import React, { ReactNode, MouseEventHandler } from 'react';

interface SubNavTabProps {
    children: ReactNode;
    active?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

const SubNavTab = ({ children, active = false, onClick }: SubNavTabProps) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 text-xs rounded-full transition-colors duration-200 focus:outline-none ${active
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
    >
        {children}
    </button>
);

export default SubNavTab;
