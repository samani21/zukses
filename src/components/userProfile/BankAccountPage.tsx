import React, { useState } from 'react'
import AddBankAccountModal from './AddBankAccountModal';

const BankAccountPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div className="w-full">
            <div className="md:flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Kamu bisa simpan maks. 3 rekening bank</h3>
                    <p className="text-sm text-gray-500">Saldo Zukses kamu bisa ditarik ke rekening ini.</p>
                </div>
                <button className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition font-semibold flex-shrink-0 mt-4 md:mt-0" onClick={() => setIsModalOpen(true)}>
                    Tambah Rekening Lain
                </button>
            </div>
            <div>
                <div className="border-t pt-4 flex flex-col md:flex-row gap-4 items-start">
                    <img src="/icon/bni.webp" alt="BNI Logo" className="" />
                    <div className="flex-grow">
                        <p className="text-sm text-gray-800 font-semibold">PT. BANK NEGARA INDONESIA (BNI) (PERSERO)</p>
                        <p className="text-gray-700">0435866872</p>
                        <p className="text-sm text-gray-500">a.n Ibu ANDI NAIFA</p>
                    </div>
                    <button className="border border-gray-300 rounded px-6 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition">Hapus</button>
                </div>
            </div>
            {isModalOpen && <AddBankAccountModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};
export default BankAccountPage