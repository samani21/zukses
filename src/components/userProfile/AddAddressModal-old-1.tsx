import React from 'react'
import { ChevronDown, X } from 'lucide-react';
const AddAddressModal = () => {
    return (
        <div className="bg-white  w-[747px] h-[90%]">
            <div className="flex justify-between items-center p-4 border-b border-[#DDDDDD] sticky top-0 bg-white  px-10">
                <h2 className="text-[22px] font-semibold text-[#555555]" style={{ letterSpacing: "-0.05em" }}>Alamat Saya</h2>
                <button className="">
                    <X className='h-5 h-5 text-dark' />
                </button>
            </div>
            <div className="p-6 space-y-4 px-10 h-[474px] overflow-auto custom-scrollbar">
                {/* Form Fields */}
                <div className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Nama Lengkap"
                            className="w-full p-3 border border-[#DDDDDD] text-[#333333] placeholder:text-[#333333] text-[16px] rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Nomor Telefon"
                            className="w-full p-3 border border-[#DDDDDD] text-[#333333] placeholder:text-[#333333] text-[16px] rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="relative">
                        <div
                            className="w-full p-3 border border-[#DDDDDD] text-[#333333] placeholder:text-[#333333] text-[16px] rounded-[5px] flex justify-between"
                        >
                            Provinsi, Kabupaten/Kota, Kecamatan
                            <ChevronDown className='h-[24px] w-[24px]' />
                            {/* Add other options here */}
                        </div>
                    </div>
                    <div>
                        <textarea
                            placeholder="Ketik nama jalanmu disini"
                            rows={4}
                            className="w-full p-3 border border-[#DDDDDD] text-[#333333] placeholder:text-[#333333] text-[16px] rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-[#B6FBC9] flex items-center pr-4 gap-4">
                    <div className='w-[7px] h-[66px] bg-[#34A352]' />
                    <p className='text-[#333333] text-[16px] w-[550px]' style={{ letterSpacing: "-0.005em" }}>
                        Tetapkan pin yang tepat. Kami akan mengantarkan ke lokasi peta. Mohon periksa apakah sudah benar, jika belum klik peta untuk menyesuaikan.
                    </p>
                </div>

                {/* Location Picker */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative w-full sm:w-1/3">
                        <select className="w-full p-3 border border-[#DDDDDD] text-[#333333] placeholder:text-[#333333] text-[16px] rounded-[5px] appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>90123</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <ChevronDown className='h-[24px] w-[24px]' />
                        </div>
                    </div>
                    <div className="w-full sm:w-2/3">
                        <button className="w-full p-3 border border-[#DDDDDD] text-[#333333] placeholder:text-[#333333] text-[16px] rounded-[5px] text-left text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            Pilih Lokasi
                        </button>
                    </div>
                </div>

                {/* Primary Address Checkbox */}
                <div className="flex items-center">
                    <input id="primary-address" type="checkbox" defaultChecked className="h-5 w-5 accent-[#52357B] text-white focus:ring-[#52357B]" />
                    <label htmlFor="primary-address" className="ml-2 text-gray-700">
                        Set as primary address
                    </label>
                </div>
            </div>
            <div className='h-[70px] bg-[#EEEEEE] flex items-center w-full flex justify-end px-10 gap-2 text-[14px] font-semibold'>
                <button type='button' className='w-[100px] h-[40px] bg-white border border-[#AAAAAA] rounded-[10px] outline-none hover:bg-gray-100 focus:outline-none'>
                    Nanti saja
                </button>
                <button type='button' className='w-[100px] h-[40px] bg-[#563D7C] text-white rounded-[10px] outline-none hover:bg-purple-800 focus:outline-none'>
                    Konfirmasi
                </button>
            </div>
        </div>
    )
}


export default AddAddressModal