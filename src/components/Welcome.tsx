import React from 'react'
const Welcome = () => {
    return (
        <div className='bg-white shadow-[1px_1px_10px_rgba(0,0,0,0.1)] flex justify-between items-center p-4'>
            <div className='flex items-center gap-4'>
                <img src='/icon/trolley.svg' width={82} />
                <div className='w-[556px] space-y-4' style={{
                    lineHeight: "110%",
                    letterSpacing: "-0.02em"
                }}>
                    <h5 className='font-semibold text-[30px] text-[#333333]'>Welcome to Zukses</h5>
                    <p className='text-[16px] text-[#222222]'>Selamat datang di Zukses! Temukan produk favoritmu dan nikmati pengalaman belanja yang mudah, cepat, dan terpercaya.</p>
                </div>
            </div>
            <button className='bg-[#82B440] text-[16px] font-semibold text-white h-[50px] rounded-[5px] px-8'>
                Download aplikasi zukses
            </button>
        </div>
    )
}

export default Welcome