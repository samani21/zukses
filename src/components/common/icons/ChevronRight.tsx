import React, { FC } from 'react'

const ChevronRight: FC<{ className?: string; size?: number; }> = ({ className, size }) => (
    <svg className={className} width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6" />
    </svg>
);

export default ChevronRight