import React from 'react'
const CloseIcon = () => (
    <svg className="h-[35px] w-[35px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const ReturnOrderModal = ({
    isOpen,
    onClose,
    onConfirm,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}) => {
    const returnReasons = [
        {
            id: 'bermasalah',
            text: 'Barang yang saya terima bermasalah',
            description:
                'Saya menerima barang yang tidak lengkap, rusak, salah, tidak sesuai pesanan, berbeda dengan deskripsi',
            icon: <img src='/icon/damaged-package 1.svg' />
        },
        {
            id: 'tidak_diterima',
            text: 'Barang tidak saya terima sebagian/semua pesanan',
            description:
                'Pesanan tidak sampai sama sekali, atau sampai tapi kurang atau hilang sebagian',
            icon: <img src='/icon/damaged-package 2.svg' />
        }
    ];

    if (!isOpen) return null;

    const handleSelect = (reasonId: string) => {
        onConfirm(reasonId);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
            <div className="bg-white shadow-xl" role="dialog" aria-modal="true">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-[25px] text-[#555555] font-semibold">
                        Alasan Pengembalian. Aduh, barangnya bermasalah nih!
                    </h3>
                    <button onClick={onClose} aria-label="Tutup modal" className="text-gray-400 hover:text-gray-600">
                        <CloseIcon />
                    </button>
                </div>
                <div className="p-6">
                    <div className="bg-[#F0D7E0] text-[16px] text-black border-l-6 border-[#A62C2A] p-4 mb-4 rounded-r-md">
                        <p className='w-[60%]'> Mohon pilih alasan pengembalian. Pesananmu akan langsung
                            dibatalkan setelah alasan pengembalian diajukan.</p>
                    </div>
                    <div className="space-y-4">
                        {returnReasons.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleSelect(item.id)}
                                className="w-full text-left flex items-center p-4 border border-[#CCCCCC] hover:border-[#A62C2A] hover:bg-[#FFF5F5] transition"
                            >
                                <div className="flex-shrink-0 mr-4">{item.icon}</div>
                                <div>
                                    <p className="font-semibold text-[#555555] text-[20px]">{item.text}</p>
                                    <p className="text-[#666666] font-[500] text-[16px] w-[74%]">{item.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ReturnOrderModal