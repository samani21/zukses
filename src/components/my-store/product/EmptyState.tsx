import React, { FC } from 'react'

const EmptyState: FC = () => (
    <div className="text-center py-20 border-t border-gray-200">
        <p className="text-gray-500">Tidak ada produk untuk ditampilkan.</p>
        <p className="text-sm text-gray-400 mt-2">Coba ubah filter pencarian Anda.</p>
    </div>
);
export default EmptyState