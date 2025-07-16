import React, { useEffect, useState } from 'react'
import ModalMaps from 'pages/user-profile-old/Components/ModalMaps';
import { GoogleMapsProvider } from 'components/GoogleMapsProvider';
import { getLatLngFromNominatim } from './getLatLngFromNominatim';
import { ChevronDown, X } from 'lucide-react';
type FormData = {
    name: string;
    phone: string;
    isPrivate: boolean;
    isStore: boolean;
    fullAddress: string;
    fullAddressStreet: string;
    lat: number;
    long: number;
    prov: number;
    city: number;
    district: number;
    postCode: number;
    detailAddress: string;
    kodePos: string;
};

type AddressData = {
    name: string;
    phone: string;
    isPrivate: boolean;
    isStore: boolean;
    fullAddress: string;
    fullAddressStreet: string;
    lat: number;
    long: number;
    prov: number;
    city: number;
    district: number;
    postCode: number;
    detailAddress: string;
};

type GetAddressData = {
    name_receiver?: string;
    number_receiver?: string;
    provinces?: string;
    cities?: string;
    subdistricts?: string;
    postal_codes?: string;
    full_address?: string;
    detail_address?: string;
    label?: string;
    id?: number;
    lat?: number;
    long?: number;
    is_primary?: number;
    is_store?: number;
    province_id?: number;
    citie_id?: number;
    subdistrict_id?: number;
    postal_code_id?: number;
};

type Props = {
    setOpenModalAddAdress: (value: boolean) => void;
    setIsAdd: (value: boolean) => void;
    setOpenDelete: (value: number) => void;
    handleAdd: (data: AddressData, id?: number) => Promise<void>;
    editData?: GetAddressData | null;
    openModalAddAddress?: boolean;
    isAdd?: boolean;
}
const AddAddressModal = ({ setOpenModalAddAdress, handleAdd, editData, setOpenDelete, isAdd, setIsAdd }: Props) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        phone: '',
        isPrivate: false,
        isStore: false,
        fullAddress: '',
        fullAddressStreet: '',
        lat: 0,
        long: 0,
        prov: 0,
        city: 0,
        district: 0,
        postCode: 0,
        detailAddress: '',
        kodePos: ''
    });
    console.log('formData', formData)
    const [openMaps, setOpenMaps] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isEdit, setIsEdit] = useState(false);
    const resetForm = () => {
        setFormData({
            name: '',
            phone: '',
            isPrivate: false,
            isStore: false,
            fullAddress: '',
            fullAddressStreet: '',
            lat: 0,
            long: 0,
            prov: 0,
            city: 0,
            district: 0,
            postCode: 0,
            detailAddress: '',
            kodePos: ''
        });
        setErrors({});
        setIsEdit(false);
        setIsAdd(false)
    };

    const populateForm = (data: GetAddressData) => {
        setFormData({
            name: data.name_receiver || '',
            phone: data.number_receiver || '',
            isPrivate: data.is_primary === 1,
            isStore: data.is_store === 1,
            fullAddress: `${data?.provinces}, ${data?.cities}, ${data?.subdistricts}, ${data?.postal_codes}` || '',
            fullAddressStreet: data.full_address || '',
            lat: data.lat || 0,
            long: data.long || 0,
            prov: data.province_id || 0,
            city: data.citie_id || 0,
            district: data.subdistrict_id || 0,
            postCode: data.postal_code_id || 0,
            detailAddress: data.detail_address || '',
            kodePos: data?.postal_codes || '',
        });
        setIsEdit(true);
    };

    useEffect(() => {
        if (editData) {
            populateForm(editData);
        } else {
            resetForm();
        }
    }, [editData]);

    useEffect(() => {
        if (isAdd) {
            resetForm()
        }
    }, [isAdd])

    const handleChange = <K extends keyof FormData>(key: K, value: FormData[K]) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};
        if (!formData.name.trim()) newErrors.name = 'Nama Lengkap tidak boleh kosong';
        if (!formData.detailAddress.trim()) newErrors.detailAddress = 'Detail alamat tidak boleh kosong';
        if (!formData.phone.trim()) newErrors.phone = 'Nomor Telepon tidak boleh kosong';
        if (!formData.kodePos) {
            newErrors.address = 'Alamat (Provinsi, Kota, Kecamatan, Kode Pos) harus lengkap';
        }
        if (!formData.fullAddressStreet.trim()) newErrors.fullAddressStreet = 'Alamat Jalan tidak boleh kosong';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const payload: AddressData = {
            ...formData,
        };

        if (isEdit) {
            handleAdd(payload, editData?.id);
        } else {
            handleAdd(payload);
        }
        // resetForm();
    };

    const handleClose = () => {
        setOpenModalAddAdress(false);
        resetForm();
    };
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        if (formData?.fullAddress?.split(',')[2]?.trim() ?? '') {
            getLatLngFromNominatim(formData?.fullAddress?.split(',')[2]?.trim() ?? '').then(setLatLng);
        }
    }, [formData?.fullAddress?.split(',')[2]?.trim()]);
    useEffect(() => {
        if (latLng) {
            handleChange('lat', latLng?.lat)
            handleChange('long', latLng?.lng)
        }
    }, [latLng])
    return (
        <GoogleMapsProvider>
            <div className="fixed inset-0 bg-black/50 z-50 md:flex items-center justify-center md:p-4">
                {
                    openMaps ? <ModalMaps
                        fullAddressStreet={formData.fullAddressStreet}
                        lat={formData.lat}
                        long={formData.long}
                        setLat={(val) => handleChange('lat', val)}
                        setLong={(val) => handleChange('long', val)}
                        setOpenMaps={setOpenMaps}
                    /> :
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
                }
            </div>
        </GoogleMapsProvider>
    )
}


export default AddAddressModal