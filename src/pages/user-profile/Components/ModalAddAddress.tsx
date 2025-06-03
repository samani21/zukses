import React, { useEffect, useState } from 'react';
import { TextField, Checkbox, FormControlLabel } from '@mui/material';
import {
    AddLocation,
    ButtonContainer,
    ButtonHold,
    ButtonOk,
    ContentInput,
    HeaderModal,
    InputFlex,
    LabelContainer,
    LocationContainer,
    ModalAdd,
    OptionLabel,
    WrapperInput,
    WrapperLabel
} from 'components/Profile/AddressComponent';
import AutocompleteAddress from 'components/AutocompleteAlamat';
import AutocompleteStreetAddress from 'components/AutocompleteStreetAddress';
import MapWithDraggableSvgPinDisable from 'components/MapWithDraggableSvgPinDisable';
import ModalMaps from './ModalMaps';
type AddressData = {
    name: string;
    phone: string;
    isPrivate: boolean;
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
    province_id?: number;
    citie_id?: number;
    subdistrict_id?: number;
    postal_code_id?: number;
};

type Props = {
    setOpenModalAddAdress: (value: boolean) => void;
    handleAdd: (data: AddressData, id?: number) => Promise<void>;
    editData?: GetAddressData | null; // <-- Tambahkan ini
    openModalAddAddress?: boolean
};



const ModalAddAddress = ({ setOpenModalAddAdress, handleAdd, editData, openModalAddAddress }: Props) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [fullAddress, setFullAddress] = useState<string>('');
    const [fullAddressStreet, setFullAddressStreet] = useState<string>('');
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [lat, setLat] = useState<number>(0);
    const [long, setLong] = useState<number>(0);
    const [prov, setProv] = useState<number>(0);
    const [city, setCity] = useState<number>(0);
    const [district, setDistrict] = useState<number>(0);
    const [postCode, setPostCode] = useState<number>(0);
    const [openMpas, setOpenMaps] = useState<boolean>(false);
    const [dataFullAddress, setDataFullAddress] = useState<string>('');
    const [dataFullAddressStreet, setDataFullAddressStreet] = useState<string>('');
    const [tag, setTag] = useState<'Rumah' | 'Kantor' | ''>('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const resetForm = () => {
        setName('');
        setPhone('');
        setIsPrivate(false);
        setFullAddress('');
        setFullAddressStreet('');
        setLat(0);
        setLong(0);
        setProv(0);
        setCity(0);
        setDistrict(0);
        setPostCode(0);
        setDataFullAddress('');
        setDataFullAddressStreet('');
        setTag('');
        setErrors({});
        setIsEdit(false);
    };

    useEffect(() => {
        if (!editData) {
            resetForm();
        }
        if (editData) {
            setIsEdit(true);
            setName(editData.name_receiver || '');
            setPhone(editData.number_receiver || '');
            setProv(editData.province_id || 0);
            setCity(editData.citie_id || 0);
            setDistrict(editData.subdistrict_id || 0);
            setPostCode(editData.postal_code_id || 0);
            setDataFullAddress(`${editData?.postal_codes}, ${editData?.subdistricts},${editData?.cities}, ${editData?.provinces}`);
            setDataFullAddressStreet(`${editData?.full_address}`);
            setFullAddressStreet(`${editData?.full_address}`);
            setLat(editData.lat || 0)
            setLong(editData.long || 0)
            setTag(editData.label === 'Rumah' ? "Rumah" : "Kantor")
            setIsPrivate(editData.is_primary ? true : false)
            // dan field lainnya...
        }
    }, [editData]);


    const handleSubmit = () => {
        const newErrors: { [key: string]: string } = {};

        if (!name.trim()) {
            newErrors.name = 'Nama Lengkap tidak boleh kosong';
        }
        if (!phone.trim()) {
            newErrors.phone = 'Nomor Telepon tidak boleh kosong';
        }
        if (!prov || !city || !district || !postCode) {
            newErrors.address = 'Alamat (Provinsi, Kota, Kecamatan, Kode Pos) harus lengkap';
        }
        if (!fullAddressStreet.trim()) {
            newErrors.fullAddressStreet = 'Alamat Jalan tidak boleh kosong';
        }
        if (!tag) {
            newErrors.tag = 'Pilih label alamat (Rumah atau Kantor)';
        }
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            // Ada error, jangan submit
            return;
        }

        const data = {
            name,
            phone,
            isPrivate,
            fullAddress,
            fullAddressStreet,
            lat,
            long,
            prov,
            city,
            district,
            postCode,
            tag: tag as 'Rumah' | 'Kantor',
        };
        if (isEdit) {
            handleAdd(data, editData?.id);
        } else {
            setDataFullAddress('')
            setDataFullAddressStreet('')
            handleAdd(data);
        }
        resetForm();
    };

    const handleClose = () => {
        setOpenModalAddAdress(false);
        resetForm(); // Tambahkan ini
    };

    return (
        openMpas ? (
            <ModalMaps
                fullAddressStreet={fullAddressStreet}
                lat={lat}
                long={long}
                setLat={setLat}
                setLong={setLong}
                setOpenMaps={setOpenMaps}
            />
        ) : (
            <ModalAdd>
                <HeaderModal>{isEdit ? 'Edit Alamat' : 'Alamat Baru'}</HeaderModal>
                <ContentInput>
                    <InputFlex>
                        <WrapperInput>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Nama Lengkap"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </WrapperInput>
                        <WrapperInput>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Nomor Telepon"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                error={!!errors.phone}
                                helperText={errors.phone}
                            />
                        </WrapperInput>
                    </InputFlex>
                    <WrapperInput>
                        <AutocompleteAddress
                            setFullAddress={setFullAddress}
                            setProv={setProv}
                            setCity={setCity}
                            setDistrict={setDistrict}
                            setPostCode={setPostCode}
                            openModalAddAddress={openModalAddAddress}
                            dataFullAddress={dataFullAddress}
                        />
                        {errors.address && (
                            <div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>
                                {errors.address}
                            </div>
                        )}
                    </WrapperInput>
                    <WrapperInput>
                        <AutocompleteStreetAddress
                            setFullAddressStreet={setFullAddressStreet}
                            openModalAddAddress={openModalAddAddress}
                            setLat={setLat}
                            setLong={setLong}
                            dataFullAddressStreet={dataFullAddressStreet}
                        />
                        {errors.fullAddressStreet && (
                            <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                                {errors.fullAddressStreet}
                            </div>
                        )}
                    </WrapperInput>
                    {lat && long ? (
                        <MapWithDraggableSvgPinDisable
                            lat={lat}
                            lng={long}
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
                            <OptionLabel
                                style={{ cursor: 'pointer', fontWeight: tag === 'Rumah' ? 'bold' : 'normal' }}
                                onClick={() => setTag('Rumah')}
                            >
                                Rumah
                            </OptionLabel>
                            <OptionLabel
                                style={{ cursor: 'pointer', fontWeight: tag === 'Kantor' ? 'bold' : 'normal' }}
                                onClick={() => setTag('Kantor')}
                            >
                                Kantor
                            </OptionLabel>
                            {errors.tag && (
                                <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                                    {errors.tag}
                                </div>
                            )}
                        </WrapperLabel>
                    </LabelContainer>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isPrivate}
                                onChange={(e) => setIsPrivate(e.target.checked)}
                                sx={{
                                    color: 'var(--primary-color)',
                                    '&.Mui-checked': {
                                        color: 'var(--primary-color)',
                                    },
                                }}
                            />
                        }
                        label="Atur sebagai Alamat Pribadi"
                        sx={{ color: '#777', mt: 2 }}
                    />
                    <ButtonContainer>
                        <ButtonHold onClick={handleClose}>Nanti Saja</ButtonHold>
                        <ButtonOk onClick={handleSubmit}>Ok</ButtonOk>
                    </ButtonContainer>
                </ContentInput>
            </ModalAdd>
        )
    );
};

export default ModalAddAddress;
