import { X } from 'lucide-react';
import { useRouter } from 'next/router';
import React from 'react';
import { ShopData } from './ShopProfileContext';

const ModalCompleteShopProfile = ({
    onClose,
    shopProfil,
}: {
    onClose: () => void;
    shopProfil: ShopData | null;
}) => {
    const isComplete = (field: string | null | undefined) => !!field;
    const router = useRouter()
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
            <div className="bg-white w-full  md:w-[600px] rounded-lg shadow-lg max-h-[90vh] md:max-h-[75vh]">
                <div className="p-3 md:p-4 text-[#555555] font-semibold text-base sm:text-lg md:text-[20px] tracking-[-0.02em] flex items-center justify-between">
                    Lengkapi data toko kamu dulu
                    <X onClick={onClose} className='cursor-pointer' />
                </div>
                <div className="bg-[#C7F8BC] text-[#333333] p-3 text-[16px] font-semibold px-4 tracking-[-0.02em]" style={{
                    lineHeight: "130%"
                }}>
                    Lengkapi Data Toko Kamu Dulu, Yuk!<br />Biar tokomu makin terlihat profesional dan siap terima pesanan.
                </div>
                <div className="p-4 space-y-4  overflow-y-auto no-scrollbar md:h-[350px]">
                    {[
                        {
                            label: 'Profil Toko',
                            field: shopProfil?.shop_name,
                            icon: '/icon/damaged-package11.svg',
                            description:
                                'Nama, deskripsi, dan logo toko yang menarik bikin <br/> pembeli makin percaya dan tertarik belanja!',
                            url: '/my-store/basic-info'
                        },
                        {
                            label: 'Alamat Toko',
                            field: shopProfil?.address?.name_shop,
                            icon: '/icon/damaged-package21.svg',
                            description:
                                'Lengkapi alamat tokomu sekarang. <br/> Biar proses kirim-mengirim jadi lebih cepat dan tepat.',
                            url: '/my-store/address'
                        },
                        {
                            label: 'Rekening Bank',
                            field: shopProfil?.shop_name,
                            icon: '/icon/damaged-package 3.svg',
                            description:
                                'Isi rekening bank kamu di sini.  <br/> Biar hasil jualanmu bisa langsung cair tanpa hambatan.',
                            url: '/my-store/basic-info'
                        },
                        {
                            label: 'Pengaturan Jasa Kirim',
                            field: shopProfil?.shop_name,
                            icon: '/icon/damaged-package 4.svg',
                            description:
                                'Atur jasa kirim sesuai kebutuhan tokomu.  <br/> Pilih kurir favorit biar pengiriman jadi makin praktis dan cepat!',
                            url: '/my-store/basic-info'
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className={`flex justify-between md:pr-5 items-center cursor-pointer ${i % 2 ? 'bg-white' : 'bg-[#EFEFEF]'} p-3 rounded-[10px] border border-[#CCCCCC] gap-2 sm:gap-0`}
                            onClick={() => {
                                localStorage.setItem('modalShopProfileClosed', 'true');
                                onClose()
                                router?.push(item?.url)
                            }}
                        >
                            <div className=" flex items-start gap-4 md:p-2">
                                <img src={item?.icon} className='w-[50px] h-[50px]' />
                                <div className='tracking-[-0.02em]'>
                                    <div className="text-[18px] text-[#555555] font-bold sm:text-base">{item.label}</div>
                                    <div
                                        className="text-[14px] sm:text-sm text-[#666666]"
                                        dangerouslySetInnerHTML={{ __html: item.description }}
                                    />
                                </div>
                            </div>
                            <div className='flex items-center justify-center'>
                                {isComplete(item.field) ? (
                                    <img src='/icon/ceklist.svg' className='w-[32px] h-[32px]' />
                                ) : (
                                    <img src='/icon/Alert triangle.svg' className='w-[32px] h-[32px]' />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ModalCompleteShopProfile;
