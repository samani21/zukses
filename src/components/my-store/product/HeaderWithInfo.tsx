import { Info } from 'lucide-react';
import React, { FC } from 'react'

const HeaderWithInfo: FC<{ title: string }> = ({ title }) => (
    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        <div className="flex items-center">
            <span>{title}</span>
            <Info size={14} className="ml-1 text-gray-400" />
        </div>
    </th>
);
export default HeaderWithInfo