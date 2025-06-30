import React, { FC } from 'react'

const Tooltip: FC<{ text: string }> = ({ text }) => (
    <div className="absolute bottom-full mb-2 w-64 bg-gray-800 text-white text-xs rounded-lg py-2 px-3 z-10 shadow-lg">
        {text}
        <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
            <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
        </svg>
    </div>
);
export default Tooltip