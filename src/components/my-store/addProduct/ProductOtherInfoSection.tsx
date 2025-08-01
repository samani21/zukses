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
        setTipKey, isCodEnabled, setIsCodEnabled, isUsed, setIsUsed,
        sku, setSku, schedule, setScheduleDate, validateScheduleDate, scheduleError,
        errors, sectionRefs
    } = props;

    return (
        <div id="informasi-lainnya-section" ref={sectionRefs} className="mb-6 space-y-6 border border-[#DCDCDC] py-6 rounded-[5px] px-8">

            <div id="informasi-lainnya-section">
                <h1 className="font-bold text-[20px] text-[#483AA0] mb-4">Informasi Lainnya</h1>
                <div className='space-y-6'>
                    <div onMouseEnter={() => setTipKey('condition')} onMouseLeave={() => setTipKey('default')}>
                        <RadioGroup label="Kondisi" name="condition" options={['Baru', 'Bekas Dipakai']} required defaultValue={isUsed === '1' ? 'Bekas Dipakai' : 'Baru'} onChange={(value) => setIsUsed(value === 'Bekas Dipakai' ? '1' : '0')} />
                    </div>
                    <div onMouseEnter={() => setTipKey('sku')} onMouseLeave={() => setTipKey('default')}>
                        <label className="text-[#333333] font-bold text-[14px]">SKU Induk</label>
                        <input type="text" placeholder="Masukkan kode unik..." className="w-full px-3 py-2 border border-gray-300 rounded-md" value={sku} onChange={(e) => setSku(e?.target?.value)} />
                        <div className="mt-1 text-[14px] text-[#333333]">Masukkan kode unik untuk setiap produk...</div>
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