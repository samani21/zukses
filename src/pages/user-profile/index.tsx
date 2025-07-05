'use client';
import React from 'react';
import Link from 'next/link';
import UserProfile from 'pages/layouts/UserProfile';
import { ArrowRight } from 'lucide-react';
const IndexPage: React.FC = () => {

    const menuItems = [
        {
            title: 'Profil Saya',
            description: 'Edit Nama Anda, Email dan Nomor Telepon',
            iconSrc: 'https://placehold.co/200x200?text=Profil Saya',
            altText: 'Profil Saya Icon',
            link: '/user-profile/profil',
        },
        {
            title: 'Alamat',
            description: 'Edit Alamat Pengiriman dan Nama Penerima',
            iconSrc: 'https://placehold.co/200x200?text=Alamat',
            altText: 'Alamat Icon',
            link: '/user-profile//address',
        },
        {
            title: 'Pesanan Saya',
            description: 'Anda dapat melihat dan memantau Pesanan Anda',
            iconSrc: 'https://placehold.co/200x200?text=Pesanan Saya',
            altText: 'Pesanan Saya Icon',
            link: '/user-profile//my-order',
        },
        {
            title: 'Rekening Bank',
            description: 'Lihat atau ubah nomor rekening untuk menerima pembayaran',
            iconSrc: 'https://placehold.co/200x200?text=Rekening Bank',
            altText: 'Rekening Bank Icon',
            link: '/user-profile/bank',
        },
    ];

    return (
        <UserProfile>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full p-10">
                {menuItems.map((item, index) => (
                    <Link href={item.link} key={index} className="block border border-gray-300 rounded-lg">
                        {/* Menggunakan group class untuk efek hover pada anak elemen */}
                        <div className="bg-white rounded-lg shadow-md p-6 flex items-start space-x-4 cursor-pointer hover:shadow-lg transition-shadow duration-200 group">
                            {/* Icon Section */}
                            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full">
                                <img
                                    src={item.iconSrc}
                                    alt={item.altText}
                                    width={48}
                                    height={48}
                                />
                            </div>

                            {/* Text Content */}
                            <div className="flex-grow">
                                <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
                                <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                            </div>

                            {/* Arrow Icon */}
                            <div className="flex-shrink-0 self-center">
                                <ArrowRight />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </UserProfile>
    );
};

export default IndexPage;