import React, { ReactNode } from 'react';

interface ActionButtonProps {
  children: ReactNode;
}

const ActionButton = ({ children }: ActionButtonProps) => (
  <button className="px-4 py-1.5 text-sm font-normal text-gray-800 bg-white border border-gray-300 rounded-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-400">
    {children}
  </button>
);

export default ActionButton;
