import React, { useEffect, useState } from 'react';
import { TextField, Checkbox, Switch } from '@mui/material';
import {
    AddLocation, ButtonContainer, ButtonHold, ButtonOk,
    ContentInput, Desktop, HeaderModal, HeaderModalMobile, IconAddAddress, InputFlex, LabelContainer,
    LocationContainer, Mobile, ModalAdd, OptionLabel,
    SwitchContainer,
    WrapperInput, WrapperLabel
} from 'components/Profile/AddressComponent';
import AutocompleteStreetAddress from 'components/AutocompleteStreetAddress';
import MapWithDraggableSvgPinDisable from 'components/MapWithDraggableSvgPinDisable';
import ModalMaps from './ModalMaps';

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
    tag: 'Rumah' | 'Kantor';
};

type GetAddressData = {
    name_receiver?: string;
    number_receiver?: string;
    provinces?: string;
    cities?: string;
    subdistricts?: string;
    postal_codes?: string;
    full_address?: string;
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
    setOpenDelete: (value: number) => void;
    handleAdd: (data: AddressData, id?: number) => Promise<void>;
    editData?: GetAddressData | null;
    openModalAddAddress?: boolean;
};


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
    tag: '' | 'Rumah' | 'Kantor';
};

const ModalAddAddress = ({ setOpenModalAddAdress, handleAdd, editData, openModalAddAddress, setOpenDelete }: Props) => {
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
        tag: ''
    });
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
            tag: ''
        });
        setErrors({});
        setIsEdit(false);
    };

    const populateForm = (data: GetAddressData) => {
        setFormData({
            name: data.name_receiver || '',
            phone: data.number_receiver || '',
            isPrivate: data.is_primary === 1,
            isStore: data.is_store === 1,
            fullAddress: `${data?.postal_codes}, ${data?.subdistricts}, ${data?.cities}, ${data?.provinces}` || '',
            fullAddressStreet: data.full_address || '',
            lat: data.lat || 0,
            long: data.long || 0,
            prov: data.province_id || 0,
            city: data.citie_id || 0,
            district: data.subdistrict_id || 0,
            postCode: data.postal_code_id || 0,
            tag: data.label === 'Rumah' ? 'Rumah' : 'Kantor'
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

    const handleChange = <K extends keyof FormData>(key: K, value: FormData[K]) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};
        if (!formData.name.trim()) newErrors.name = 'Nama Lengkap tidak boleh kosong';
        if (!formData.phone.trim()) newErrors.phone = 'Nomor Telepon tidak boleh kosong';
        if (!formData.prov || !formData.city || !formData.district || !formData.postCode) {
            newErrors.address = 'Alamat (Provinsi, Kota, Kecamatan, Kode Pos) harus lengkap';
        }
        if (!formData.fullAddressStreet.trim()) newErrors.fullAddressStreet = 'Alamat Jalan tidak boleh kosong';
        if (!formData.tag) newErrors.tag = 'Pilih label alamat (Rumah atau Kantor)';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const payload: AddressData = {
            ...formData,
            tag: formData.tag as 'Rumah' | 'Kantor',
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

    if (openMaps) {
        return (
            <ModalMaps
                fullAddressStreet={formData.fullAddressStreet}
                lat={formData.lat}
                long={formData.long}
                setLat={(val) => handleChange('lat', val)}
                setLong={(val) => handleChange('long', val)}
                setOpenMaps={setOpenMaps}
            />
        );
    }

    return (
        <ModalAdd>
            <HeaderModal>{isEdit ? 'Edit Alamat' : 'Alamat Baru'}</HeaderModal>
            <HeaderModalMobile>
                <IconAddAddress src='/icon-old/arrow-left-red.svg' onClick={() => setOpenModalAddAdress(false)} />
                {isEdit ? 'Edit Alamat' : 'Alamat Baru'}
            </HeaderModalMobile>
            <ContentInput>
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
                        />
                    </WrapperInput>
                </InputFlex>

                <WrapperInput>
                    {/* <AutocompleteAddress
                        setFullAddress={(val) => handleChange('fullAddress', val)}
                        setProv={(val) => handleChange('prov', val)}
                        setCity={(val) => handleChange('city', val)}
                        setDistrict={(val) => handleChange('district', val)}
                        setPostCode={(val) => handleChange('postCode', val)}
                        openModalAddAddress={openModalAddAddress}
                        dataFullAddress={formData.fullAddress}
                    /> */}
                    {errors.address && (
                        <div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{errors.address}</div>
                    )}
                </WrapperInput>

                <WrapperInput>
                    <AutocompleteStreetAddress
                        setFullAddressStreet={(val) => handleChange('fullAddressStreet', val)}
                        openModalAddAddress={openModalAddAddress}
                        setLat={(val) => handleChange('lat', val)}
                        setLong={(val) => handleChange('long', val)}
                        dataFullAddressStreet={formData.fullAddressStreet}
                    />
                    {errors.fullAddressStreet && (
                        <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{errors.fullAddressStreet}</div>
                    )}
                </WrapperInput>

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

                <LabelContainer>
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
                        {errors.tag && (
                            <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{errors.tag}</div>
                        )}
                    </WrapperLabel>
                </LabelContainer>
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
                <LabelContainer>
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
                </LabelContainer>

                <Desktop>
                    <ButtonContainer>
                        <ButtonHold onClick={handleClose}>Nanti Saja</ButtonHold>
                        <ButtonOk onClick={handleSubmit}>Ok</ButtonOk>
                    </ButtonContainer>
                </Desktop>
                <Mobile>
                    <ButtonContainer style={{ justifyContent: "space-between" }}>
                        {
                            editData?.is_primary === 1 ?
                                <ButtonHold style={{ border: "1px solid var(--primary-color)", width: "100%", color: "#666666" }}>Hapus</ButtonHold> :
                                <ButtonHold onClick={() => {
                                    setOpenDelete(editData?.id ?? 0)
                                    setOpenModalAddAdress(false)
                                }} style={{ border: "1px solid var(--primary-color)", width: "100%", color: "black" }}>Hapus</ButtonHold>
                        }
                        <ButtonOk onClick={handleSubmit} style={{ width: "100%" }}>Ok</ButtonOk>
                    </ButtonContainer>
                </Mobile>
            </ContentInput>
        </ModalAdd>
    );
};

export default ModalAddAddress;
