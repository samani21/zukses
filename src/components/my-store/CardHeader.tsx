import { ChevronRight } from 'lucide-react';
import React from 'react'

const CardHeader = ({ title, linkText }: { title: string; linkText?: string }) => (
    <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-gray-700">{title}</h3>
        {linkText && (
            <a href="#" className="text-sm text-blue-500 hover:underline flex items-center flex-shrink-0 ml-4">
                {linkText}
                <ChevronRight size={16} className="ml-1" />
            </a>
        )}
    </div>
);

export default CardHeader