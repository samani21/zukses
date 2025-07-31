import Link from 'next/link';
import React, { FC } from 'react'

const ConfirmationModal: FC<{ isOpen: boolean; onConfirm: () => void; onCancel: () => void }> = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-[15px] shadow-xl w-full max-w-md mx-4 flex gap-4 items-start">
                <img src={'/icon/chekclist-green.svg'} width={60} />
                <div>
                    <h2 className="text-[#333333] font-bold text-[25px] mb-4">Simpan perubahan?</h2>
                    <p className="mb-8 text-[#333333] text-[15px]">Perubahan yang Anda buat akan disimpan secara permanen. Pastikan semua informasi sudah benar.</p>
                    <div className="flex justify-end space-x-4">
                        <button onClick={onCancel} className="bg-white h-[40px] text-[#4A4459] text-[15px] font-[500] border-[#79747E] border py-2 px-6  hover:bg-gray-300 transition-colors">
                            Tidak
                        </button>
                        <button onClick={onConfirm} className="bg-[#19976D] h-[40px] text-[#E8DEF8] text-[15px] font-[500] border-[#79747E] border py-2 px-6  hover:bg-gray-300 transition-colors">
                            Ya, Simpan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal