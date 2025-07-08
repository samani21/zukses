import React from 'react'

interface Deliverys {
    id: number;
    src: string;
    alt: string;
}
type Props = {
    sampleDeliverys: Deliverys[];
}

const Delivery = ({ sampleDeliverys }: Props) => {
    return (
        <div className="text-left">
            <h2 className="text-[15px] font-semibold mb-4">Metode Pembayaran</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 items-center">
                {sampleDeliverys?.map((delivery) => (
                    <div key={delivery.id} className="flex justify-center items-center">
                        <img
                            src={delivery.src}
                            alt={delivery.alt}
                            className="h-[40px] max-w-[140px] object-contain"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Delivery