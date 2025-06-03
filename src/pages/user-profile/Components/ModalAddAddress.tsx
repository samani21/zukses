import React, { useState } from 'react';
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


type Props = {
    setOpenModalAddAdress: (value: boolean) => void;
};

const ModalAddAddress = ({ setOpenModalAddAdress }: Props) => {
    const handleClose = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setOpenModalAddAdress(false);
        }
    };
    const [isPrivate, setIsPrivate] = useState(false);
    const [fullAddress, setFullAddress] = useState<string>('');
    const [fullAddressStreet, setFullAddressStreet] = useState<string>('');
    const [lat, setLat] = useState<number>(0);
    const [long, setLong] = useState<number>(0);
    const [prov, setProv] = useState<number>(0);
    const [city, setCity] = useState<number>(0);
    const [district, setDistrict] = useState<number>(0);
    const [postCode, setPostCode] = useState<number>(0);
    const [openMpas, setOpenMaps] = useState<boolean>(false);
    return (
        openMpas ? <ModalMaps fullAddressStreet={fullAddressStreet} lat={lat} long={long} setLat={setLat} setLong={setLong} setOpenMaps={setOpenMaps} /> :
            <ModalAdd>
                <HeaderModal>Alamat Baru</HeaderModal>
                <ContentInput>
                    <InputFlex>
                        <WrapperInput>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Nama Lengkap"
                            />
                        </WrapperInput>
                        <WrapperInput>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Nomor Telepon"
                            />
                        </WrapperInput>
                    </InputFlex>
                    <WrapperInput>
                        <AutocompleteAddress setFullAddress={setFullAddress}
                            setProv={setProv}
                            setCity={setCity}
                            setDistrict={setDistrict}
                            setPostCode={setPostCode} />
                        {prov},
                        {city},
                        {district},
                        {postCode}
                    </WrapperInput>
                    <WrapperInput>
                        <AutocompleteStreetAddress setFullAddressStreet={setFullAddressStreet} setLat={setLat} setLong={setLong} />
                        {fullAddress}
                    </WrapperInput>
                    {
                        lat && long ?

                            <MapWithDraggableSvgPinDisable lat={lat} lng={long} setOpenMaps={setOpenMaps} /> :
                            <LocationContainer>
                                <AddLocation>
                                    + Tambah Location
                                </AddLocation>
                            </LocationContainer>
                    }
                    <LabelContainer>
                        Tandai Sebagai
                        <WrapperLabel>
                            <OptionLabel>
                                Rumah
                            </OptionLabel>
                            <OptionLabel>
                                Kantor
                            </OptionLabel>
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
                        <ButtonHold onClick={handleClose}>
                            Nanti Saja
                        </ButtonHold>
                        <ButtonOk>
                            Ok
                        </ButtonOk>
                    </ButtonContainer>
                </ContentInput>
            </ModalAdd>
    );
};

export default ModalAddAddress;
