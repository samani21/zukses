import React, { ReactNode, MouseEventHandler } from 'react';

interface NavTabProps {
    children: ReactNode;
    active?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

const NavTab = ({ children, active = false, onClick }: NavTabProps) => (
    <button
        onClick={onClick}
        className={
            `px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 ` +
            (active
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-700 hover:text-blue-500')
        }
    >
        {children}
    </button>
);

export default NavTab;
