import React, { useEffect, useState } from 'react'
import MapWithDraggableSvgPinDisable from 'components/MapWithDraggableSvgPinDisable';
import { AddLocation, LocationContainer, SwitchContainer, WrapperInput } from 'components/Profile/AddressComponent';
import ModalMaps from 'pages/user-profile-old/Components/ModalMaps';
import { Checkbox, IconButton, Switch, TextField } from '@mui/material';
import { GoogleMapsProvider } from 'components/GoogleMapsProvider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutocompleteAddress from 'components/AutocompleteAddress/AutocompleteAddress';
import { getLatLngFromNominatim } from 'components/userProfile/getLatLngFromNominatim';
import { XMarkIcon } from 'components/userProfile/Icon';
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
    name_shop?: string;
    number_shop?: string;
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
const AddAddressShopModal = ({ setOpenModalAddAdress, handleAdd, editData, setOpenDelete, isAdd, setIsAdd }: Props) => {
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
            name: data.name_shop || '',
            phone: data.number_shop || '',
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
                    openMaps ?
                        editData?.subdistrict_id === formData?.district &&
                            editData?.lat !== undefined &&
                            editData?.long !== undefined ? <ModalMaps
                            fullAddressStreet={formData.fullAddressStreet}
                            lat={editData?.lat}
                            long={editData?.long}
                            setLat={(val) => handleChange('lat', val)}
                            setLong={(val) => handleChange('long', val)}
                            setOpenMaps={setOpenMaps}
                        /> : <ModalMaps
                            fullAddressStreet={formData.fullAddressStreet}
                            lat={formData.lat}
                            long={formData.long}
                            setLat={(val) => handleChange('lat', val)}
                            setLong={(val) => handleChange('long', val)}
                            setOpenMaps={setOpenMaps}
                        /> :
                        <div className="bg-white h-full md:h-50%  shadow-xl rounded-[10px] w-full max-w-2xl overflow-y-auto no-scrollbar">
                            <div className="hidden md:flex text-[#333333] justify-between items-center p-6 px-7">
                                <h2 className="text-[22px] font-bold tracking-[-5%]" >Alamat Baru</h2>
                                <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                                    <XMarkIcon className="w-[27px] h-[27px] text-[#333333]" />
                                </button>
                            </div>
                            <div className=" md:hidden flex justify-left items-center p-4">
                                <IconButton edge="start" color="inherit" onClick={handleClose}>
                                    <ArrowBackIcon sx={{ color: "black" }} />
                                </IconButton>
                                <h2 className="text-lg font-semibold ml-4">Alamat Baru</h2>
                            </div>
                            <div className='flex items-center p-6 gap-4 pt-2'>
                                <div className='w-full'>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Nama Lengkap"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        error={!!errors.name}
                                        helperText={errors.name}
                                        autoComplete="off"
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                height: '50px',
                                            },
                                            '& input': {
                                                padding: '0 14px',
                                            }
                                        }}
                                    />
                                    {/* <p className='text-[#333333] text-[14px] tracking-[-5%] pl-3'>Contoh : Ibu Aisyah</p> */}
                                </div>
                                <div className='w-full'>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Nomor Telepon"
                                        value={formData.phone}
                                        onChange={(e) => {
                                            const input = e.target.value.replace(/\D/g, '');
                                            // Jika kosong (user benar-benar hapus semuanya)
                                            if (input === '') {
                                                handleChange('phone', '');
                                                return;
                                            }

                                            // Jika user sedang menghapus awalan +62 → izinkan
                                            if (!input.startsWith('+62') && !input.startsWith('0') && !input.startsWith('62') && !input.startsWith('8')) {
                                                handleChange('phone', input);
                                                return;
                                            }

                                            // Buat hanya angka (hapus simbol/kosong)
                                            let raw = input.replace(/\D/g, '');

                                            // Deteksi dan normalisasi ke +62
                                            if (raw.startsWith('0')) {
                                                raw = '+62' + raw.slice(1);
                                            } else if (raw.startsWith('62')) {
                                                raw = '+62' + raw.slice(2);
                                            } else if (raw.startsWith('8')) {
                                                raw = '+62' + raw;
                                            } else if (!input.startsWith('+62')) {
                                                raw = '+62' + raw;
                                            } else {
                                                raw = input; // biarkan user menghapus manual jika dari +62
                                            }

                                            handleChange('phone', raw);
                                        }}
                                        error={!!errors.phone}
                                        helperText={errors.phone}
                                        autoComplete="off"
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                height: '50px',
                                            },
                                            '& input': {
                                                padding: '0 14px',
                                            }
                                        }}
                                    />

                                    {/* <p className='text-[#333333] text-[14px] tracking-[-5%] pl-3'>Contoh : 08123456789</p> */}
                                </div>
                            </div>
                            <div className='p-6 pt-3'>
                                <WrapperInput>
                                    <AutocompleteAddress
                                        setFullAddress={(val) => handleChange('fullAddress', val)}
                                        setProv={(val) => handleChange('prov', val)}
                                        setCity={(val) => handleChange('city', val)}
                                        setDistrict={(val) => handleChange('district', val)}
                                        setPostCode={(val) => handleChange('postCode', val)}
                                        setKodePos={(val) => handleChange('kodePos', val)}
                                        dataFullAddress={formData.fullAddress}
                                        isEdit={isEdit}
                                        provinces={editData?.provinces ?? ''}
                                        cities={editData?.cities ?? ''}
                                        subdistricts={editData?.subdistricts ?? ''}
                                        postal_codes={editData?.postal_codes ?? ''}
                                        province_id={editData?.province_id ?? 0}
                                        citie_id={editData?.citie_id ?? 0}
                                        subdistrict_id={editData?.subdistrict_id ?? 0}
                                        postal_code_id={editData?.postal_code_id ?? 0}
                                        setFullAddressStreet={(val) => handleChange('fullAddressStreet', val)}
                                        setLat={(val) => handleChange('lat', val)}
                                        setLong={(val) => handleChange('long', val)}
                                    />
                                    {errors.address && (
                                        <div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{errors.address}</div>
                                    )}
                                </WrapperInput>
                                <WrapperInput>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Alamat"
                                        value={formData.fullAddressStreet}
                                        onChange={(e) => handleChange('fullAddressStreet', e.target.value)}
                                        error={!!errors.fullAddressStreet}
                                        helperText={errors.fullAddressStreet}
                                        autoComplete="off"
                                        multiline
                                        minRows={1} // Minimum height (sekitar 1 baris)
                                        maxRows={10} // Opsional: tinggi maksimal
                                        InputProps={{
                                            sx: {
                                                minHeight: '50px', // Tinggi minimal 50px
                                                textarea: {
                                                    resize: 'none', // Hilangkan resize handle default (opsional)
                                                    padding: '4px', // Atur padding agar tinggi sesuai
                                                }
                                            }
                                        }}
                                    />
                                    <div className='text-[#333333] text-[14px] tracking-[-5%] pl-3'>
                                        <p>Contoh : Jalan Kenangan I Lorong 12 RT 03 RW 02</p>
                                        <p className='-mt-1'>(Patokan Depan Puskesmas Sehat)</p>
                                    </div>
                                </WrapperInput>
                                <p className='tracking-[-0.05em] w-[80%] text-[16px] text-[#111111]'>Tetapkan pin yang tepat. Kami akan mengantarkan ke lokasi peta. Mohon periksa apakah sudah benar, jika belum klik peta untuk menyesuaikan.</p>
                                <div className='mt-3'>

                                    {editData?.subdistrict_id === formData?.district &&
                                        editData?.lat !== undefined &&
                                        editData?.long !== undefined ? (
                                        <MapWithDraggableSvgPinDisable
                                            lat={editData.lat}
                                            lng={editData.long}
                                            setOpenMaps={setOpenMaps}
                                        />
                                    ) : formData.lat !== 0 && formData.long !== 0 ? (
                                        <MapWithDraggableSvgPinDisable
                                            lat={formData.lat}
                                            lng={formData.long}
                                            setOpenMaps={setOpenMaps}
                                        />
                                    ) : <LocationContainer>
                                        <AddLocation>+ Tambah Location</AddLocation>
                                    </LocationContainer>}
                                </div>
                                <div className='flex items-center' onClick={() => handleChange('isPrivate', !formData.isPrivate)}>
                                    <SwitchContainer>
                                        <Checkbox
                                            checked={formData.isPrivate}
                                            // onChange={(e) => handleChange('isPrivate', e.target.checked)}
                                            sx={{
                                                color: '#52357B',
                                                '&.Mui-checked': {
                                                    color: '#52357B',
                                                },
                                            }}
                                        />
                                    </SwitchContainer>
                                    <SwitchContainer className='mobile'>
                                        <Switch
                                            checked={formData.isPrivate}
                                            // onChange={(e) => handleChange('isPrivate', e.target.checked)}
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    color: '#52357B',
                                                    '& + .MuiSwitch-track': {
                                                        backgroundColor: '#52357B',
                                                    },
                                                },
                                            }}
                                        />
                                    </SwitchContainer>
                                    <p className='text-[16px] font-semibold text-[#333333] cursor-pointer'>Tetapkan sebagai alamat utama</p>
                                </div>
                                <div className='flex items-center justify-end gap-2'>
                                    <button onClick={handleClose} className="h-[44px] hidden md:block rounded-[10px] text-[#333333] font-semibold text-[16px] bg-white border border-[#AAAAAA] w-[100px]">Nanti Saja</button>
                                    {
                                        editData &&
                                        <button onClick={() => {
                                            setOpenDelete(editData?.id || 0)
                                            setOpenModalAddAdress(false)
                                        }} className="h-[44px] md:hidden px-6 py-2 rounded-lg border border-gray-300 text-white hover:bg-gray-100 w-full transition bg-red-600">Hapus</button>
                                    }
                                    <button onClick={handleSubmit} className="h-[44px] rounded-[10px] bg-[#563D7C] text-white font-semibold text-[14px] w-[100px]">
                                        Konfirmasi
                                    </button>
                                </div>
                            </div>
                        </div>
                }
            </div>
        </GoogleMapsProvider>
    )
}


export default AddAddressShopModal