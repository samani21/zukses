import React from 'react';
import { RadioGroup } from './FormInputs';
import { TipKey } from './tipsStore';

interface ProductDeliveryInfoSectionProps {
    setTipKey: (key: TipKey) => void;
    isHazardous: string;
    setIsHazardous: (val: string) => void;
    isCodEnabled: string;
    setIsCodEnabled: (val: string) => void;
    sectionRefs: React.RefObject<HTMLDivElement | null>;
}

const ProductDeliveryInfoSection = (props: ProductDeliveryInfoSectionProps) => {
    const {
        setTipKey, isHazardous, setIsHazardous, isCodEnabled, setIsCodEnabled, sectionRefs
    } = props;

    return (
        <div id="informasi-pengiriman-section" ref={sectionRefs} className="mb-6 space-y-6 border border-[#DCDCDC] py-6 rounded-[5px] px-8">
            <h1 className="font-bold text-[20px] text-[#483AA0] mb-4">Informasi Pengiriman</h1>
            <div onMouseEnter={() => setTipKey('dangerousGoods')} onMouseLeave={() => setTipKey('default')}>
                <RadioGroup
                    label="Produk Berbahaya?"
                    name="dangerous"
                    options={['Tidak', 'Mengandung Baterai / Magnet / Cairan / Bahan Mudah Terbakar']}
                    defaultValue={isHazardous === '1' ? 'Mengandung Baterai / Magnet / Cairan / Bahan Mudah Terbakar' : 'Tidak'}
                    onChange={(value) => setIsHazardous(value === 'Tidak' ? '0' : '1')}
                />
            </div>
            <div onMouseEnter={() => setTipKey('cod')} onMouseLeave={() => setTipKey('default')}>
                <label className="text-[#333333] font-bold text-[14px]">Pembayaran di Tempat (COD)</label>
                <div className="flex items-start space-x-3 bg-gray-50 p-3 rounded-md">
                    <input id="cod" type="checkbox" className="h-5 w-5 accent-[#52357B] text-white focus:ring-[#52357B]" checked={isCodEnabled === '1'}
                        onChange={(e) => setIsCodEnabled(e.target.checked ? '1' : '0')} />
                    <div className='mt-[-5px]'>
                        <label htmlFor="cod" className="font-bold text-[14px] text-[#333333]">Aktifkan COD</label>
                        <p className="text-[14px] text-[#333333]">Izinkan pembeli untuk membayar secara tunai saat produk diterima...</p>
                    </div>
                </div>
            </div>
            <hr className="my-4 border-gray-200" />
        </div>
    );
};

export default ProductDeliveryInfoSection;