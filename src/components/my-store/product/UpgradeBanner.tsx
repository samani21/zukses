import { Gift } from 'lucide-react';
import React, { FC } from 'react'

const UpgradeBanner: FC = () => (
    <div className="bg-blue-50 rounded-lg p-4 mx-4 sm:mx-6 flex items-center justify-between mt-4">
        <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full">
                <Gift className="text-blue-500" size={24} />
            </div>
            <div className="ml-4">
                <p className="font-semibold text-gray-800">
                    Upgrade ke Iklan GMV Max Untuk <span className="text-blue-600">Mendapatkan Bonus Saldo Iklan dan Meningkatkan Kunjungan</span>
                </p>
            </div>
        </div>
        <button className="bg-blue-500 text-white font-semibold text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
            Upgrade Sekarang &gt;
        </button>
    </div>
);
export default UpgradeBanner