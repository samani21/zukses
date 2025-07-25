'use client'
import Delivery from "components/Delivery";
import Header from "components/Header";
import Payment from "components/Payment";
import DesktopSidebar from "components/userProfile/DesktopSidebar";
import InfoZukses from "components/InfoZukses";
import CategoryFooter from "components/CategoryFooter";
interface Payments {
    id: number;
    src: string;
    alt: string;
}
interface Deliverys {
    id: number;
    src: string;
    alt: string;
}

export default function UserProfile({ children }: { children: React.ReactNode }) {
    const samplePayment: Payments[] = [
        { id: 1, src: '/icon/payment/bri 1.svg', alt: 'BRI' },
        { id: 2, src: '/icon/payment/bni 1.svg', alt: 'BNI' },
        { id: 3, src: '/icon/payment/bca 1.svg', alt: 'BCA' },
        { id: 4, src: '/icon/payment/mandiri 1.svg', alt: 'Mandiri' },
        { id: 5, src: '/icon/payment/linkaja 1.svg', alt: 'Link Aja' },
        { id: 6, src: '/icon/payment/qris 1.svg', alt: 'Qris' },
        { id: 7, src: '/icon/payment/bsi 1.svg', alt: 'BSI' },
        { id: 8, src: '/icon/payment/permata 1.svg', alt: 'Permata Bank' },
        { id: 9, src: '/icon/payment/dana 1.svg', alt: 'Dana' },
        { id: 10, src: '/icon/payment/ovo 1.svg', alt: 'Ovo' },
        { id: 11, src: '/icon/payment/shopeepay 1.svg', alt: 'Shopee Pay' },
        { id: 12, src: '/icon/payment/maybank 1.svg', alt: 'My Bank' },
        { id: 13, src: '/icon/payment/danamon 1.svg', alt: 'Danamon' },
    ];
    const sampleDeliverys: Deliverys[] = [
        { id: 1, src: '/icon/delivery/sicepat 1.svg', alt: 'SICEPAT' },
        { id: 2, src: '/icon/delivery/posaja 1.svg', alt: 'POSAJA' },
        { id: 3, src: '/icon/delivery/jnt 1.svg', alt: 'JNT' },
        { id: 4, src: '/icon/delivery/jne 1.svg', alt: 'JNE' },
        { id: 5, src: '/icon/delivery/gosend 1.svg', alt: 'Gosend' },
        { id: 6, src: '/icon/delivery/anteraja 1.svg', alt: 'Anteraja' },
    ];
    return (
        <div className="">
            <div className='hidden md:block'>
                <Header />
            </div>
            <div className="min-h-screen font-sans py-[33px]  pt-[20px]">
                <div className="container mx-auto p-0 md:p-0 md:px-0 flex rounded-lg  w-[1200px]">
                    <div className="">
                        <DesktopSidebar />
                    </div>
                    <main
                        className="ml-[-10px] container mx-auto"
                    >

                        <div className="pr-0">
                            <div>
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <div className='hidden md:block border-t border-[#238744]  bg-white'>
                <div className='border-b border-[#238744] py-4'>
                    <div className='container mx-auto flex justify-between itmes-center lg:w-[1200px] '>
                        <InfoZukses />
                    </div>
                </div>
                <div className='py-4'>
                    <div className='container mx-auto flex justify-between itmes-center lg:w-[1200px] '>
                        <div>
                            <Payment samplePayment={samplePayment} />
                        </div>
                        <div>
                            <Delivery sampleDeliverys={sampleDeliverys} />
                        </div>
                    </div>
                </div>
                <div className='py-4 bg-[#E4FFE0]'>
                    <main className="container mx-auto md:px-4 lg:w-[1200px] lg:px-[0px] bg-[#E4FFE0]">
                        <CategoryFooter />
                    </main>

                </div>
                <div className="border-t border-[#238744] py-4 bg-[#238744] text-white">
                    <p className="text-center text-[15px] font-semibold" style={{
                        lineHeight: "22px",
                        letterSpacing: "-0.04em"
                    }}>
                        @2025, PT. Zukses Digital Indonesia. All Rights Reserved.
                    </p>
                </div>
            </div>
        </div>
    )
}
