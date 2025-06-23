import { ChevronDown } from 'lucide-react';
import React, { FC } from 'react'

const CustomDropdown: FC<{ placeholder: string }> = ({ placeholder }) => (
    <button className="w-full flex items-center justify-between text-left px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-500 hover:border-gray-400">
        <span>{placeholder}</span>
        <ChevronDown size={20} />
    </button>
);

export default CustomDropdown