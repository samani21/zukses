import React, { useEffect } from 'react'
import { InformationCircleIcon, XMarkIcon } from './Icon';
const AddBankAccountModal = ({ onClose }: { onClose: () => void }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Mau tambah rekening apa?</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="relative">
                        <label className="text-xs text-gray-500 bg-white px-1 absolute -top-2 left-3">Nama Bank</label>
                        <select className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>PT. BANK MANDIRI / MANDIRI</option>
                            <option>PT. BANK CENTRAL ASIA / BCA</option>
                            <option>PT. BANK RAKYAT INDONESIA / BRI</option>
                        </select>
                    </div>
                    <div className="relative border border-blue-500 rounded-lg flex items-center p-1">
                        <label className="text-xs text-blue-500 bg-white px-1 absolute -top-2 left-3">Nomor Rekening</label>
                        <input type="text" placeholder="" className="w-full px-2 py-2 border-0 focus:outline-none focus:ring-0" />
                        <button className="text-blue-600 font-semibold px-4 text-sm hover:text-blue-700">Cek Nama Pemilik</button>
                    </div>
                </div>
                <div className="p-6 bg-gray-50 rounded-b-lg">
                    <div className="flex items-start gap-3 text-sm text-gray-500 mb-4">
                        <InformationCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>Dengan klik tombol di bawah, kamu menyetujui <a href="#" className="text-blue-600 font-semibold">Syarat & Ketentuan</a> serta <a href="#" className="text-blue-600 font-semibold">Kebijakan Privasi</a> untuk menambahkan rekening.</span>
                    </div>
                    <button disabled className="w-full bg-gray-200 text-gray-400 font-bold py-3 rounded-lg cursor-not-allowed">
                        Tambah Rekening
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddBankAccountModal