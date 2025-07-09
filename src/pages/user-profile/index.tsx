'use client';
import React from 'react';
import Link from 'next/link';
import UserProfile from 'pages/layouts/UserProfile';
const IndexPage: React.FC = () => {

    const menuItems = [
        {
            title: 'Profil Saya',
            description: 'Edit Nama Anda, Email dan Nomor Telepon',
            iconSrc: '/icon/account 1.svg',
            altText: 'Profil Saya Icon',
            link: '/user-profile/profil',
        },
        {
            title: 'Alamat',
            description: 'Edit Alamat Pengiriman dan Nama Penerima',
            iconSrc: '/icon/alamat 1.svg',
            altText: 'Alamat Icon',
            link: '/user-profile//address',
        },
        {
            title: 'Menunggu Pembayaran',
            description: 'Transaksi yang menunggu Pembayaran Anda',
            iconSrc: '/icon/alamat 2.svg',
            altText: 'Pesanan Saya Icon',
            link: '/user-profile/my-order',
        },
        {
            title: 'Pesanan Saya',
            description: 'Anda dapat melihat dan memantau Pesanan Anda',
            iconSrc: '/icon/pesanan 1.svg',
            altText: 'Rekening Bank Icon',
            link: '/user-profile/my-order',
        },
        {
            title: 'Rekening Bank',
            description: 'Lihat atau ubah nomor rekening untuk menerima pembayaran',
            iconSrc: '/icon/credit-card 1.svg',
            altText: 'Pesanan Saya Icon',
            link: '/user-profile//my-order',
        },
        {
            title: 'Keranjang Belanja',
            description: 'Semua produk pilihanmu ada di sini. Cek kembali sebelum checkout!',
            iconSrc: '/icon/credit-card 2.svg',
            altText: 'Rekening Bank Icon',
            link: '/user-profile/bank',
        },
    ];

    return (
        <UserProfile>
            <h2 className="text-[20px] font-bold text-[#444444] mb-6 ">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full p-3">
                {menuItems.map((item, index) => (
                    <Link href={item.link} key={index} className="block w-full">
                        <div className="bg-white rounded-[10px] p-4 flex items-start space-x-4 cursor-pointer border border-gray-300 ">
                            <div className="flex-shrink-0 flex items-center justify-center rounded-full">
                                <img
                                    src={item.iconSrc}
                                    alt={item.altText}
                                    width={37}
                                />
                            </div>
                            <div className="flex-grow">
                                <h2 className="text-[16px] text-[#333333] font-semibold ">{item.title}</h2>
                                <p className="text-[14px] mt-1 text-[#555555] leading-[120%]">{item.description}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </UserProfile>
    );
};

export default IndexPage;