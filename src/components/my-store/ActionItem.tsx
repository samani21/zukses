import React from 'react'

const ActionItem = ({ value, title }: { value: string; title: string }) => (
    <div className="flex-1 text-center px-4 py-2 min-w-[150px]">
        <a href="#" className="text-3xl font-normal text-blue-500 hover:underline">{value}</a>
        <p className="text-sm text-gray-500 mt-2">{title}</p>
    </div>
);

export default ActionItem