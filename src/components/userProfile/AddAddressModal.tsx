import React, { useEffect, useState } from 'react'
import { InformationCircleIcon, XMarkIcon } from './Icon';
import AutocompleteAddress from 'components/AutocompleteAlamat';
import MapWithDraggableSvgPinDisable from 'components/MapWithDraggableSvgPinDisable';
import { AddLocation, InputFlex, LabelContainer, LocationContainer, SwitchContainer, WrapperInput } from 'components/Profile/AddressComponent';
import ModalMaps from 'pages/user-profile-old/Components/ModalMaps';
import { Checkbox, Switch, TextField } from '@mui/material';
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
const AddAddressModal = ({ setOpenModalAddAdress, handleAdd, editData, openModalAddAddress, setOpenDelete, isAdd, setIsAdd }: Props) => {
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
        detailAddress: ''
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
            detailAddress: ''
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
            detailAddress: data.detail_address || ''
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
        if (!formData.prov || !formData.city || !formData.district || !formData.postCode) {
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
        resetForm();
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
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            {
                openMaps ? <ModalMaps
                    fullAddressStreet={formData.fullAddressStreet}
                    lat={formData.lat}
                    long={formData.long}
                    setLat={(val) => handleChange('lat', val)}
                    setLong={(val) => handleChange('long', val)}
                    setOpenMaps={setOpenMaps}
                /> :
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                        <div className="flex justify-between items-center p-4">
                            <h2 className="text-lg font-semibold">Alamat Baru</h2>
                            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <InputFlex>
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
                            </InputFlex>
                            <WrapperInput>
                                <AutocompleteAddress
                                    setFullAddress={(val) => handleChange('fullAddress', val)}
                                    setProv={(val) => handleChange('prov', val)}
                                    setCity={(val) => handleChange('city', val)}
                                    setDistrict={(val) => handleChange('district', val)}
                                    setPostCode={(val) => handleChange('postCode', val)}
                                    openModalAddAddress={openModalAddAddress}
                                    dataFullAddress={formData.fullAddress}
                                />
                                {errors.address && (
                                    <div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{errors.address}</div>
                                )}
                            </WrapperInput>
                            <WrapperInput>
                                <AddressAutocompleteStreet
                                    subdistrict={formData?.fullAddress?.split(',')[1]?.trim() ?? ''}
                                    setLat={(val) => handleChange('lat', val)}
                                    setLong={(val) => handleChange('long', val)}
                                    setFullAddress={(val) => handleChange('fullAddressStreet', val)}
                                    dataFullAddress={formData.fullAddressStreet}
                                />
                                {errors.fullAddressStreet && (
                                    <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{errors.fullAddressStreet}</div>
                                )}
                            </WrapperInput>
                            <WrapperInput>
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
                            </WrapperInput>
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
                            <LabelContainer>
                                Atur Sebagai Alamat Utama
                                <SwitchContainer>
                                    <Checkbox
                                        checked={formData.isPrivate}
                                        onChange={(e) => handleChange('isPrivate', e.target.checked)}
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
                                        checked={formData.isPrivate}
                                        onChange={(e) => handleChange('isPrivate', e.target.checked)}
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
                            </LabelContainer>
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
                        <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end gap-3">
                            <button onClick={handleClose} className="hidden md:block px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition">Nanti Saja</button>
                            {
                                editData &&
                                <button onClick={() => {
                                    setOpenDelete(editData?.id || 0)
                                    setOpenModalAddAdress(false)
                                }} className="md:hidden px-6 py-2 rounded-lg border border-gray-300 text-white hover:bg-gray-100 transition bg-red-600">Hapus</button>
                            }
                            <button onClick={handleSubmit} className="px-8 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                                OK
                            </button>
                        </div>
                    </div>
            }
        </div>
    )
}


export default AddAddressModal