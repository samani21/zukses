import React, { ReactNode, MouseEventHandler } from 'react';

interface NavTabProps {
    children: ReactNode;
    active?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

const NavTab = ({ children, active = false, onClick }: NavTabProps) => (
    <button
        onClick={onClick}
        className={`px-4 py-3 text-sm font-normal whitespace-nowrap transition-colors duration-200 focus:outline-none ${active
            ? 'text-blue-500 border-b-2 border-blue-500'
            : 'text-gray-600 hover:text-blue-500'
            }`}
    >
        {children}
    </button>
);

export default NavTab;
