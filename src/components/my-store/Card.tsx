import React from 'react'
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white p-4 sm:p-6 rounded-lg shadow-sm ${className}`}>
        {children}
    </div>
);
export default Card