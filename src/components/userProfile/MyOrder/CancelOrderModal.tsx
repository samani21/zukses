import React, { useState } from 'react'
const CloseIcon = () => (
    <svg className="h-[35px] w-[35px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const CancelOrderModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: (reason: string) => void; }) => {
    const [reason, setReason] = useState('');
    const cancellationReasons = ['Ingin mengubah pesanan', 'Ingin mengubah alamat pengiriman', 'Penjual tidak membalas chat', 'Ingin mengubah rincian dan membuat pesanan baru', 'Alasan lainnya'];
    if (!isOpen) return null;
    const handleConfirm = () => { if (!reason) { return; } onConfirm(reason); };
    const handleClose = () => { setReason(''); onClose(); };
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
            <div className="bg-white shadow-xl w-[40%]">
                <div className="flex justify-between items-center p-6"><h3 className="text-lg font-semibold text-gray-800">Pilih Alasan Pembatalan</h3><button onClick={handleClose} className="text-gray-400 hover:text-gray-600"><CloseIcon /></button></div>
                <div className="p-6 pt-0">
                    <div className='bg-[#F0D7E0] text-[16px] border-l-5 border-[#A62C2A] p-4'>
                        Mohon pilih alasan pembatalan. Pesananmu akan langsung
                        dibatalkan setelah alasan pembatalan diajukan.
                    </div>
                    <div className="space-y-1 pt-4">
                        {cancellationReasons.map((text, index) => (
                            <label key={index} className="flex items-center p-3 py-2 hover:bg-gray-50 cursor-pointer">
                                <input type="radio" name="cancellationReason" value={text} checked={reason === text} onChange={(e) => { setReason(e.target.value); }} className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500" />
                                <span className="ml-3 text-sm text-gray-700">{text}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end items-center p-4 bg-gray-50 space-x-3 rounded-b-lg">
                    <button onClick={handleClose} className="py-2 px-4 bg-white border border-[#AAAAAA] bg-white h-[40px] text-[#333333] text-[14px] font-semibold hover:bg-gray-50">Nanti saja</button>
                    <button onClick={handleConfirm} className="py-2 px-4 bg-[#563D7C] border border-[#AAAAAA] h-[40px] text-[#fff] text-[14px] font-semibold hover:bg-purple-800">Batalkan Pesanan</button>
                </div>
            </div>
        </div>
    );
};

export default CancelOrderModal