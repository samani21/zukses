import React from 'react';
import DateTimePicker from 'components/DateTimePicker';
import { RadioGroup } from './FormInputs';
import { TipKey } from './tipsStore';

interface ProductOtherInfoSectionProps {
    setTipKey: (key: TipKey) => void;
    isHazardous: string;
    setIsHazardous: (val: string) => void;
    isCodEnabled: string;
    setIsCodEnabled: (val: string) => void;
    isProductPreOrder: string;
    setIsProductPreOrder: (val: string) => void;
    isUsed: string;
    setIsUsed: (val: string) => void;
    sku: string;
    setSku: (val: string) => void;
    schedule: string;
    scheduleDate: Date | null;
    setScheduleDate: (date: Date | null) => void;
    validateScheduleDate: (date: Date | null) => void;
    scheduleError: string;
    errors: { [key: string]: string };
    sectionRefs: React.RefObject<HTMLDivElement | null>;
}

const ProductOtherInfoSection = (props: ProductOtherInfoSectionProps) => {
    const {
        setTipKey, isProductPreOrder, setIsProductPreOrder, isUsed, setIsUsed,
        sku, setSku, schedule, setScheduleDate, validateScheduleDate, scheduleError,
        errors, sectionRefs
    } = props;

    return (
        <div id="informasi-lainnya-section" ref={sectionRefs} className="mb-6 space-y-6 border border-[#DCDCDC] py-6 rounded-[5px] px-8">

            <div id="informasi-lainnya-section">
                <h1 className="font-bold text-[20px] text-[#483AA0] mb-4">Informasi Lainnya</h1>
                <div className='space-y-6'>
                    <div onMouseEnter={() => setTipKey('preorder')} onMouseLeave={() => setTipKey('default')}>
                        <RadioGroup label="Pre Order" name="preorder" options={['Tidak', 'Ya']} defaultValue={isProductPreOrder === '1' ? 'Ya' : 'Tidak'} onChange={(value) => setIsProductPreOrder(value === 'Ya' ? '1' : '0')} />
                    </div>
                    <div onMouseEnter={() => setTipKey('condition')} onMouseLeave={() => setTipKey('default')}>
                        <RadioGroup label="Kondisi" name="condition" options={['Baru', 'Bekas Dipakai']} required defaultValue={isUsed === '1' ? 'Bekas Dipakai' : 'Baru'} onChange={(value) => setIsUsed(value === 'Bekas Dipakai' ? '1' : '0')} />
                    </div>
                    <div onMouseEnter={() => setTipKey('sku')} onMouseLeave={() => setTipKey('default')}>
                        <label className="text-[#333333] font-bold text-[14px]">SKU Induk</label>
                        <input type="text" placeholder="Masukkan kode unik..." className="w-full px-3 py-2 border border-gray-300 rounded-md" value={sku} onChange={(e) => setSku(e?.target?.value)} />
                        <div className="mt-1 text-[14px] text-[#333333]">Masukkan kode unik untuk setiap produk...</div>
                    </div>
                    <div className="relative" id="schedule" onMouseEnter={() => setTipKey('schedule')} onMouseLeave={() => setTipKey('default')}>
                        <label className="text-[#333333] font-bold text-[14px]">Jadwal Ditampilkan</label>
                        <div className='mt-2'>
                            <DateTimePicker
                                value={schedule ? new Date(schedule.replace(' ', 'T')) : new Date()}
                                onChange={(date) => {
                                    setScheduleDate(date);
                                    validateScheduleDate(date);
                                }}
                            />
                        </div>
                        {scheduleError && <div className='w-[508px] text-[14px] text-[#FF0000] mt-1'>{scheduleError}</div>}
                        {errors.schedule && <div className="text-red-500 text-sm mt-1">{errors?.schedule}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductOtherInfoSection;