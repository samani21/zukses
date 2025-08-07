import React from 'react'
import { Product } from './types/Product'
import { useRouter } from 'next/router'
import { formatRupiah } from './Rupiah'

type Props = {
    product: Product
    index: number
}
const StarIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
);
const CardProduct = ({ product, index }: Props) => {
    const router = useRouter()
    function formatLocation(location: string) {
        return location
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    return (
        <a
            key={index}
            className="bg-white cursor-pointer w-full h-[311px] rounded-[5px] overflow-hidden group lg:w-[190px]  border border-[#DDDDDD]"
            onClick={() => {
                const slug = product.name
                    .toLowerCase()
                    .replace(/[\s/]+/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '');
                router?.push(`/${slug}`);
                localStorage.setItem('product', JSON.stringify(product));
            }}
            style={{
                letterSpacing: "-0.03em"
            }}
        >
            {/* Bungkus gambar dan label dalam container relatif */}
            <div className="relative">
                {/* Label Gratis Ongkir & Voucher */}
                <div className="absolute top-0 left-1 -right-0 flex flex-col z-10 space-y-[1px]  pt-[7px]">
                    {
                        product?.discount_percent ?
                            <div className='flex items-center h-[20px]' style={{ letterSpacing: "-0.04em" }}>
                                <span className='bg-[#FAD7D7] text-[#F02929] h-[20px] font-[600] text-[12px] rounded-r-full px-[5px] py-[3px] flex items-center' style={{
                                    border: '0.5px solid #F02929'
                                }}>Diskon {product?.discount_percent}%</span>
                            </div> : ''
                    }
                    {
                        product?.delivery?.subsidy ?
                            <div className='flex items-center h-[20px]' style={{ letterSpacing: "-0.04em" }}>
                                <span className='bg-[#C8F7D4] text-[#388F4F] h-[20px] font-[600] text-[12px] rounded-r-full px-[5px] py-[3px] flex items-center' style={{
                                    border: '0.5px solid #388F4F'
                                }}>Gratis Ongkir</span>
                            </div> : ''
                    }
                </div>

                {/* Gambar produk */}
                <img
                    src={product.image}
                    alt={product.name}
                    className="md:w-[190px] md:h-[190px]  object-center"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=Produk';
                    }}
                />
            </div>

            {/* Informasi produk lainnya */}
            <div className="p-2">
                <p
                    className="text-[14px] md:text-[14px] text-[#111111] line-clamp-2"
                    style={{
                        lineHeight: '17px',
                        minHeight: '17px', // setara 2 baris
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {product.name}
                </p>
                <div className='flex gap-2 items-center'>
                    <p className="text-[12px] md:text-[14px] font-[800] mt-1.5  text-[#F94D63] bg-[#FFF7F7] py-[3px] px-[8px] rounded-[12px]" style={{
                        lineHeight: "18px",
                        border: "2px solid #F94D63"
                    }}>{formatRupiah(product.price)}</p>
                    {/* <p className="text-[12px] md:text-[12px] text-[#555555] mt-1  line-through" style={{
                                            lineHeight: "22px",
                                            letterSpacing: "-0.04em"
                                        }}>Rp300.000</p> */}
                </div>

                {/* <div className='flex justify-left items-center  gap-2'>
                                        {product.is_cod_enabled && (
                                            <div className="mt-1 w-[48px] h-[24px] bg-[#F77000] flex justify-center items-center rounded-[10px]">
                                                <p className="text-[12px] text-white font-bold">COD</p>
                                            </div>
                                        )}
                                        <div className="mt-1 w-[48px] h-[24px] bg-[#DE4A53] flex justify-center items-center rounded-[10px]">
                                            <p className="text-[12px] text-white font-bold">-31%</p>
                                        </div>
                                    </div> */}

                <div className="flex items-start gap-1 justify-between text-xs text-gray-500 " style={{ letterSpacing: "-0.04em", lineHeight: "22px" }}>
                    <div className='flex items-center' style={{ lineHeight: "22px" }}>
                        <StarIcon className="w-[16px] h-[16px] text-[#FFB200]" />
                        <span className='text-[12px] font-semibold text-[#555555] tracking-[-0.04em]'>{product.rating || 4.9}</span>
                        <span className='ml-2 text-[12px] mt-1 text-[#555555] tracking-[-0.04em]'>{product.sold || "1000"}+ terjual</span>
                    </div>
                    {
                        product?.voucher ?
                            <div className={`bg-[#E7F2FF] mt-2 text-[#1073F7] rounded-[3px] font-bold text-[10px] h-[20px] flex flex-col items-start justify-end px-2 pt-5`}>
                                Voucher
                            </div> : ''
                    }
                </div>

                <p className="text-[10px] text-[#555555] -mt-2" style={{
                    lineHeight: "22px",
                    letterSpacing: "-0.04em"
                }}>{formatLocation(product?.seller?.location)}</p>
            </div>
        </a>
    )
}

export default CardProduct