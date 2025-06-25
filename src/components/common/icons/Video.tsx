import React, { FC } from 'react'

const Video: FC<{ className?: string; strokeWidth?: number; }> = ({ className, strokeWidth }) => (
    <svg className={className} strokeWidth={strokeWidth} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 8-6 4 6 4V8Z" />
        <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
);

export default Video