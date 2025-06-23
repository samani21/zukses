import React from 'react'

const EmptyState = () => (
    <div className="text-center py-16 px-6 bg-white">
        <div className="mx-auto w-16 h-16 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h.008M9.75 5.25h.008m4.012 0h.008M9.75 9.75h.008m4.012 0h.008M9.75 14.25h.008m4.012 0h.008M5.25 9.75h.008m4.012 0h.008M5.25 14.25h.008m4.012 0h.008m-4.5-9h.008m4.012 0h.008M5.25 5.25h.008m4.012 0h.008M3.75 5.25A2.25 2.25 0 0 1 6 3h12a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 18 21H6a2.25 2.25 0 0 1-2.25-2.25V5.25Z" />
            </svg>
        </div>
        <h4 className="mt-2 text-base font-semibold text-gray-600">Pesanan Tidak Ditemukan</h4>
    </div>
);

export default EmptyState