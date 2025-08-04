import React from 'react';
import { NextPage } from "next";
import MyStoreLayout from "pages/layouts/MyStoreLayout";

const MySallesPage: NextPage = () => {

    return (
        <main>
            <div className="mb-6 border border-[#D2D4D8] bg-[#F3F5F7] p-4 px-6 rounded-[8px] flex items-start justify-between  mb-8">
                <div>
                    <h1 className="text-[28px] text-[#333333] font-[800] tracking-[-0.02em]">Penjualan Saya</h1>
                    <p className="text-[#444444] mt-4 text-[14px]" style={{
                        lineHeight: "107%"
                    }}>
                        Toko jalan, kamu tenang. <br /> Semua data penjualan dan laporan keuangan bisa kamu akses langsung di sini.
                    </p>
                </div>
            </div>

        </main>
    );
};
export default function MySalles() {
    return (
        <MyStoreLayout>
            <MySallesPage />
        </MyStoreLayout>
    );
}