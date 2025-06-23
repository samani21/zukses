import React, { ReactNode, MouseEventHandler } from 'react';

interface PriorityButtonProps {
  children: ReactNode;
  active?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const PriorityButton = ({ children, active = false, onClick }: PriorityButtonProps) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 text-sm rounded-sm transition-colors duration-200 border ${
      active
        ? 'bg-blue-50 text-blue-500 border-blue-500'
        : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
    }`}
  >
    {children}
  </button>
);

export default PriorityButton;
