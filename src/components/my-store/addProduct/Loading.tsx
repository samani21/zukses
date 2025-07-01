import React, { FC } from 'react'

const Loading: FC = () => (
    <div className="fixed inset-0 bg-black/20 z-50 flex justify-center items-center">
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
            <span className="text-gray-700">Loading...</span>
        </div>
    </div>
);

export default Loading