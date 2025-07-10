import React, { useEffect, useState } from 'react'
import { InformationCircleIcon, XMarkIcon } from './Icon';
import MapWithDraggableSvgPinDisable from 'components/MapWithDraggableSvgPinDisable';
import { AddLocation, LocationContainer, SwitchContainer, WrapperInput } from 'components/Profile/AddressComponent';
import ModalMaps from 'pages/user-profile-old/Components/ModalMaps';
import { Checkbox, IconButton, Switch, TextField } from '@mui/material';
import { GoogleMapsProvider } from 'components/GoogleMapsProvider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutocompleteAddress from 'components/AutocompleteAddress/AutocompleteAddress';
import { getLatLngFromNominatim } from './getLatLngFromNominatim';
import AddressAutocompleteStreet from 'components/AddressAutocompleteStreet';
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
    const [openAutoCompletAddress, setOpenAutoCompleteAddress] = useState<boolean>(false);
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
    }, [latLng]);
    const handleSelectAddress = async () => {
        setOpenAutoCompleteAddress(false)
        setOpenMaps(true)
    }
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
                        <div className="bg-white h-full md:h-50% md:rounded-lg shadow-xl w-full max-w-2xl">
                            <div className="hidden md:flex text-white justify-between items-center p-3 bg-[#227D53] px-7">
                                <h2 className="text-[20px] font-semibold">Alamat Baru</h2>
                                <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                                    <XMarkIcon className="w-6 h-6 text-white" />
                                </button>
                            </div>
                            <div className=" md:hidden flex justify-left items-center p-4">
                                <IconButton edge="start" color="inherit" onClick={handleClose}>
                                    <ArrowBackIcon sx={{ color: "black" }} />
                                </IconButton>
                                <h2 className="text-lg font-semibold ml-4">Alamat Baru</h2>
                            </div>
                            <div className="p-6 space-y-4 max-h-[80vh] md:max-h-[70vh] overflow-y-auto">
                                <WrapperInput>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Nama Lengkap"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        error={!!errors.name}
                                        helperText={errors.name}
                                        autoComplete="off"
                                    />
                                </WrapperInput>
                                <WrapperInput>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Nomor Telepon"
                                        value={formData.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        error={!!errors.phone}
                                        helperText={errors.phone}
                                        autoComplete="off"
                                    />
                                </WrapperInput>
                                <WrapperInput className='mt-9'>
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
                                    <div className='hidden md:block'>
                                        <AddressAutocompleteStreet
                                            subdistrict={formData?.fullAddress?.split(',')[2]?.trim() ?? ''}
                                            setLat={(val) => handleChange('lat', val)}
                                            setLong={(val) => handleChange('long', val)}
                                            setFullAddress={(val) => handleChange('fullAddressStreet', val)}
                                            dataFullAddress={formData.fullAddressStreet}
                                        />
                                        {errors.fullAddressStreet && (
                                            <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{errors.fullAddressStreet}</div>
                                        )}
                                    </div>
                                    <div className='md:hidden'>
                                        <input
                                            id="alamat-input"
                                            type="text"
                                            placeholder={'Tentukan batas wilayah dulu...'}
                                            value={formData.fullAddressStreet}
                                            onClick={() => setOpenAutoCompleteAddress(true)}
                                            disabled={formData?.fullAddress?.split(',')[2]?.trim() ?? '' ? false : true}
                                            autoComplete='off'
                                            className="w-full px-4 py-3 text-base text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                        />
                                        {errors.detailAddress && (
                                            <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{errors.detailAddress}</div>
                                        )}
                                        {
                                            openAutoCompletAddress && <div style={{ position: "absolute", left: '0', top: '0', width: "100%", height: "100dvh", background: "white", zIndex: 2, padding: "10px" }}>
                                                <div style={{ marginBottom: "20px" }}>
                                                    <IconButton edge="start" color="inherit" onClick={() => setOpenAutoCompleteAddress(false)}>
                                                        <ArrowBackIcon sx={{ color: "black" }} />
                                                    </IconButton>
                                                </div>
                                                <AddressAutocompleteStreet
                                                    subdistrict={formData?.fullAddress?.split(',')[2]?.trim() ?? ''}
                                                    setLat={(val) => handleChange('lat', val)}
                                                    setLong={(val) => handleChange('long', val)}
                                                    setFullAddress={(val) => handleChange('fullAddressStreet', val)}
                                                    dataFullAddress={formData.fullAddressStreet}
                                                />
                                                <input
                                                    id="detailAddress"
                                                    type="text"
                                                    placeholder="Detail Lainnya (cth: Blok / Unit no., Patokan)"
                                                    className="w-full px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-5"
                                                    autoComplete="off"
                                                    value={formData.detailAddress}
                                                    onChange={(e) => handleChange('detailAddress', e.target.value)}
                                                />
                                                <div style={{ position: "absolute", bottom: "0px", padding: "10px", width: "100%", left: "0" }}>
                                                    <div className='w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition p-4 flex justify-center cursor-pointer' onClick={handleSelectAddress}>
                                                        Selanjutnya
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </WrapperInput>
                                {/* <WrapperInput>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Ketik atau klik disini"
                                        value={formData.fullAddressStreet}
                                        onChange={(e) => handleChange('fullAddressStreet', e.target.value)}
                                        error={!!errors.fullAddressStreet}
                                        helperText={errors.fullAddressStreet}
                                        autoComplete="off"
                                    />
                                </WrapperInput> */}
                                <WrapperInput>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Detil lainnya (Cth : Blok / Unit No., Patokan"
                                        value={formData.detailAddress}
                                        onChange={(e) => handleChange('detailAddress', e.target.value)}
                                        error={!!errors.name}
                                        helperText={errors.name}
                                        autoComplete="off"
                                    />
                                    {errors.detailAddress && (
                                        <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{errors.detailAddress}</div>
                                    )}
                                </WrapperInput>
                                {/* <WrapperInput>
                                    <input
                                        id="detailAddress"
                                        type="text"
                                        placeholder="Detail Lainnya (cth: Blok / Unit no., Patokan)"
                                        className="w-full px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        autoComplete="off"
                                        value={formData.detailAddress}
                                        onChange={(e) => handleChange('detailAddress', e.target.value)}
                                    />
                                    {errors.detailAddress && (
                                        <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{errors.detailAddress}</div>
                                    )}
                                </WrapperInput> */}
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <InformationCircleIcon className="h-5 w-5 text-yellow-400" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-yellow-700">
                                                Tetapkan pin yang tepat. Kami akan mengantarkan ke lokasi peta. Mohon periksa apakah sudah benar, jika belum klik peta untuk menyesuaikan.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {formData.lat && formData.long ? (
                                    <MapWithDraggableSvgPinDisable
                                        lat={formData.lat}
                                        lng={formData.long}
                                        setOpenMaps={setOpenMaps}
                                    />
                                ) : (
                                    <LocationContainer>
                                        <AddLocation>+ Tambah Location</AddLocation>
                                    </LocationContainer>
                                )}
                                {/* <LabelContainer>
                                Tandai Sebagai
                                <WrapperLabel>
                                    {(['Rumah', 'Kantor'] as const).map((label) => (

                                        <OptionLabel
                                            key={label}
                                            className={formData.tag === label ? 'active' : ''}
                                            onClick={() => handleChange('tag', label)}
                                        >
                                            <div className='ceklist'>✓</div>
                                            <p>{label}</p>
                                        </OptionLabel>
                                    ))}
                                </WrapperLabel>
                            </LabelContainer>
                            {errors.tag && (
                                <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{errors.tag}</div>
                            )} */}
                                <div className='flex items-center'>
                                    <SwitchContainer>
                                        <Checkbox
                                            checked={formData.isPrivate}
                                            onChange={(e) => handleChange('isPrivate', e.target.checked)}
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
                                            onChange={(e) => handleChange('isPrivate', e.target.checked)}
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
                                    <p className='text-[16px] font-semibold text-[#333333]'>Tetapkan sebagai alamat utama</p>
                                </div>
                                {/* <LabelContainer>
                                Atur Sebagai Alamat Toko
                                <SwitchContainer>
                                    <Checkbox
                                        checked={formData.isStore}
                                        onChange={(e) => handleChange('isStore', e.target.checked)}
                                        sx={{
                                            color: 'var(--primary-color)',
                                            '&.Mui-checked': {
                                                color: 'var(--primary-color)',
                                            },
                                        }}
                                    />
                                </SwitchContainer>
                                <SwitchContainer className='mobile'>
                                    <Switch
                                        checked={formData.isStore}
                                        onChange={(e) => handleChange('isStore', e.target.checked)}
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: 'var(--primary-color)',
                                                '& + .MuiSwitch-track': {
                                                    backgroundColor: 'var(--primary-color)',
                                                },
                                            },
                                        }}
                                    />
                                </SwitchContainer>
                            </LabelContainer> */}
                            </div>
                            <div className="p-4 bg-[#EEEEEE] h-[70px] rounded-b-lg flex justify-between md:justify-end gap-3 mt-[56px]">
                                <button onClick={handleClose} className="hidden md:block rounded-[10px] text-[#333333] font-semibold text-[16px] bg-white border border-[#AAAAAA] w-[100px]">Nanti Saja</button>
                                {
                                    editData &&
                                    <button onClick={() => {
                                        setOpenDelete(editData?.id || 0)
                                        setOpenModalAddAdress(false)
                                    }} className="md:hidden px-6 py-2 rounded-lg border border-gray-300 text-white hover:bg-gray-100 w-full transition bg-red-600">Hapus</button>
                                }
                                <button onClick={handleSubmit} className="rounded-[10px] bg-[#563D7C] text-white font-semibold text-[14px] w-[100px]">
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