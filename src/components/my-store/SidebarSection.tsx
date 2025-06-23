import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react'

const NavLink = ({ text, active = false, hasSubMenu = false, isOpen = false }: { text: string; active?: boolean; hasSubMenu?: boolean; isOpen?: boolean }) => (
    <div className={`flex justify-between items-center px-4 py-2 text-sm rounded-md cursor-pointer transition-colors duration-200 relative ${active ? 'text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}>
        {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full"></div>}
        <span className="font-medium">{text}</span>
        {hasSubMenu && (isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
    </div>
);
const SidebarSection = ({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="py-2">
            <div onClick={() => setIsOpen(!isOpen)}>
                <NavLink text={title} hasSubMenu={true} isOpen={isOpen} />
            </div>
            {isOpen && <div className="mt-1">{children}</div>}
        </div>
    )
}

export default SidebarSection