import React from 'react'

interface Payments {
    id: number;
    src: string;
    alt: string;
}
type Props = {
    samplePayment: Payments[];
}

const Payment = ({ samplePayment }: Props) => {
    return (
        <div className="text-left">
            <h2 className="text-[15px] font-semibold mb-4">Metode Pembayaran</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 items-center">
                {samplePayment?.map((payment) => (
                    <div key={payment.id} className="flex justify-center items-center">
                        <img
                            src={payment.src}
                            alt={payment.alt}
                            className="h-[40px] max-w-[140px] object-contain"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Payment