import React, { useEffect } from 'react';
import { RadioGroup } from './FormInputs';
import { TipKey } from './tipsStore';
import { formatRupiahNoRP } from 'components/Rupiah';
import { Check } from 'lucide-react';

interface ProductOtherInfoSectionProps {
    setTipKey: (key: TipKey) => void;
    isHazardous: string;
    setIsHazardous: (val: string) => void;
    isCodEnabled: string;
    setIsCodEnabled: (val: string) => void;
    isUsed: string;
    setIsUsed: (val: string) => void;
    setShippingCost: (val: string) => void;
    shippingCost: string;
    subsidy: string;
    setSubsidy: (val: string) => void;
    sku: string;
    setSku: (val: string) => void;
    schedule: string;
    scheduleDate: Date | null;
    setScheduleDate: (date: Date | null) => void;
    validateScheduleDate: (date: Date | null) => void;
    scheduleError: string;
    errors: { [key: string]: string };
    sectionRefs: React.RefObject<HTMLDivElement | null>;
    isVoucher: boolean
    setIsVoucher: (val: boolean) => void
    voucher: string
    used: string
    setVoucher: (val: string) => void
}

const ProductOtherInfoSection = (props: ProductOtherInfoSectionProps) => {
    const {
        setTipKey, isCodEnabled, setIsCodEnabled, setIsUsed,
        sku, setSku, scheduleError,
        errors, sectionRefs, setShippingCost, shippingCost, subsidy, setSubsidy,
        isVoucher, setIsVoucher, voucher, setVoucher, used
    } = props;
    useEffect(() => {
        if (shippingCost != 'Ongkos kirim disubsidi Penjual') {
            setSubsidy('')
        }
    }, [shippingCost])
    useEffect(() => {
        if (!isVoucher) {
            setVoucher('')
        }
    }, [isVoucher])
    return (
        <div id="informasi-lainnya-section" ref={sectionRefs} className="mb-6 space-y-6 border border-[#DCDCDC] py-6 rounded-[5px] px-8">
            <div id="informasi-lainnya-section">
                <h1 className="font-bold text-[20px] text-[#483AA0] mb-4">Informasi Lainnya</h1>
                <div className='space-y-6'>
                    <div onMouseEnter={() => setTipKey('condition')} onMouseLeave={() => setTipKey('default')}>
                        <RadioGroup label="Kondisi" name="condition" options={['Baru', 'Bekas Dipakai']} required defaultValue={used} onChange={(value) => setIsUsed(value === 'Bekas Dipakai' ? '1' : '0')} />
                    </div>
                    <div onMouseEnter={() => setTipKey('condition')} onMouseLeave={() => setTipKey('default')}>
                        <RadioGroup label="Ongkos Kirim" name="condition" options={['Normal', 'Ongkos kirim ditanggung Penjual', 'Ongkos kirim disubsidi Penjual']} defaultValue={subsidy ? "Ongkos kirim disubsidi Penjual" : shippingCost} onChange={(value) => setShippingCost(value)} />
                        <div className='ml-7'>
                            <label className="block text-[14px] font-bold text-[#333333] mb-2 mt-1">Subsidi Ongkir</label>
                            <div className='flex items-center gap-4'>
                                <div className={`border border-[#AAAAAA] ${shippingCost === 'Ongkos kirim disubsidi Penjual' ? "bg-white" : "bg-[#D8D8D8]"} w-[204px] h-[40px] rounded-[5px] grid grid-cols-6 items-center px-2`}>
                                    <p className='text-[#555555] text-[14px] col-span-1'>Rp |</p>
                                    <input type="text" className='col-span-5 outline-none' placeholder='Subsidi Ongkir' value={formatRupiahNoRP(subsidy)}
                                        onChange={(e) => setSubsidy(e.target.value)} disabled={shippingCost === 'Ongkos kirim disubsidi Penjual' ? false : true} />
                                </div>
                                <p className='text-[#333333] text-[14px]'>Jika ongkos kirim disubsidi penjual maka wajib diisi</p>
                            </div>
                            {errors.subsidy && <div className="text-red-500 text-sm mt-1">{errors?.subsidy}</div>}
                        </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-md pl-0 pb-0">
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isVoucher}
                                onChange={(e) => setIsVoucher(e.target.checked)}
                                className="peer hidden"
                                id="voucher"
                            />
                            <span className={`w-6 h-6 rounded-lg border-2 border-[#52357B] bg-[#E7D6FF] flex items-center justify-center`}>
                                {isVoucher ? <Check size={16} strokeWidth={4} /> : ''}

                            </span>
                        </label>
                        <label htmlFor="voucher" className="font-bold text-[16px] text-[#333333] cursor-pointer">Aktifkan Voucher Toko</label>
                    </div>
                    <div className='-mt-4'>
                        <div className='flex items-center gap-4'>
                            <div className={`border border-[#AAAAAA] ${isVoucher ? "bg-white" : "bg-[#D8D8D8]"} w-[204px] h-[40px] rounded-[5px] grid grid-cols-6 items-center px-2`}>
                                <p className='text-[#555555] text-[14px] col-span-1'>Rp |</p>
                                <input type="text" className='col-span-5 outline-none' placeholder='Subsidi Ongkir' value={formatRupiahNoRP(voucher)}
                                    onChange={(e) => setVoucher(e.target.value)} disabled={isVoucher ? false : true} />
                            </div>
                            <p className='text-[#333333] text-[14px]'>Jika Voucher Toko aktif maka wajib diisi</p>
                        </div>
                        {errors.voucher && <div className="text-red-500 text-sm mt-1">{errors?.voucher}</div>}
                    </div>
                    <div onMouseEnter={() => setTipKey('sku')} onMouseLeave={() => setTipKey('default')}>
                        <label className="text-[#333333] font-bold text-[16px]">SKU Induk</label>
                        <input type="text" placeholder="Masukkan kode unik..." className="w-full h-[40px] px-3 py-2 border border-gray-300 rounded-md" value={sku} onChange={(e) => setSku(e?.target?.value)} />
                        <div className="mt-1 text-[14px] text-[#333333]">Masukkan kode unik untuk setiap produk agar mudah dilacak dan dikelola di sistem.</div>
                    </div>
                    <div onMouseEnter={() => setTipKey('cod')} onMouseLeave={() => setTipKey('default')}>
                        <label className="text-[#333333] font-bold text-[16px]">Pembayaran di Tempat (COD)</label>
                        <div className="flex items-start space-x-3 p-3 rounded-md">
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isCodEnabled === '1'}
                                    onChange={(e) => setIsCodEnabled(e.target.checked ? '1' : '0')}
                                    className="peer hidden"
                                    id="cod"
                                />
                                <span className={`w-6 h-6 rounded-lg border-2 border-[#52357B] bg-[#E7D6FF] flex items-center justify-center`}>
                                    {isCodEnabled === '1' ? <Check size={16} strokeWidth={4} /> : ''}

                                </span>
                            </label>

                            <div className='mt-[-5px]'>
                                <label htmlFor="cod" className="font-bold text-[15px] text-[#333333] cursor-pointer">Aktifkan COD</label>
                                <p className="text-[14px] text-[#333333]">Izinkan pembeli untuk membayar secara tunai saat produk diterima.</p>
                                <p className="text-[14px] text-[#333333]">Dengan mengaktifkan COD, Anda setuju dengan syarat & ketentuan yang berlaku.</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative" id="schedule" onMouseEnter={() => setTipKey('schedule')} onMouseLeave={() => setTipKey('default')}>
                        {/* <label className="text-[#333333] font-bold text-[16px]">Jadwal Ditampilkan <span className='bg-[#FACACA] p-1 px-3 rounded-full text-[#C71616] text-[10px] ml-3 tracking-[0]'>Wajib</span></label> */}
                        <div className='mt-2'>
                            {/* <DateTimePicker
                                value={schedule ? new Date(schedule.replace(' ', 'T')) : new Date()}
                                onChange={() => {
                                    // setScheduleDate(date);
                                    // validateScheduleDate(date);
                                }}
                            /> */}
                        </div>
                        {scheduleError && <div className='w-[508px] text-[14px] text-[#FF0000] mt-1'>{scheduleError}</div>}
                        {/* {errors.schedule ? <div className="text-red-500 text-sm mt-1">{errors?.schedule}</div> : <div className='w-[508px] text-[14px] text-[#FF0000] mt-1'>Jadwal yang dibuat melebihi rentang yang diperbolehkan. Rentang waktu: 1 jam setelah waktu saat ini - 90 hari ke depan</div>} */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductOtherInfoSection;