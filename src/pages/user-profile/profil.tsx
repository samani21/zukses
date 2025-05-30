import React, { useState } from 'react'
import UserProfile from '.'
import {
    ButtonContainer,
    ButtonSave,
    FormProfil,
    Image,
    ImageContainer,
    ImageProfilContainer,
    Input,
    InputRadio,
    InputSelect,
    InputWrapper,
    Label,
    LabelImage,
    LabelImageContainer,
    ProfilComponent,
    SubTitle,
    Table,
    TBody,
    Td,
    Title,
    Tr,
    WrapperImageProfil,
} from 'components/Profile/ProfileComponent'
import { JSX } from '@emotion/react/jsx-runtime'

export default function Profil() {
    // State untuk tanggal lahir
    const [tanggal, setTanggal] = useState('')
    const [bulan, setBulan] = useState('')
    const [tahun, setTahun] = useState('')

    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [imageError, setImageError] = useState<string>('')
    // Fungsi helper untuk membuat opsi angka (tanggal, tahun)
    const renderNumberOptions = (start: number, end: number): JSX.Element[] => {
        const options = []
        for (let i = start; i <= end; i++) {
            options.push(
                <option key={i} value={i}>
                    {i}
                </option>
            )
        }
        return options
    }

    const months: string[] = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return


        // Validasi file
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            setImageError('Format gambar harus JPEG atau PNG.')
            setImage(null)
            setImagePreview(null)
            return
        }

        if (file.size > 1024 * 1024) {
            setImageError('Ukuran gambar maksimal 1 MB.')
            setImage(null)
            setImagePreview(null)
            return
        }

        setImage(file)
        setImagePreview(URL.createObjectURL(file))
        setImageError('')
    }


    return (
        <UserProfile mode="profil">
            <ProfilComponent>
                <Title>Profil Saya</Title>
                <SubTitle>
                    Kelola informasi profil Anda untuk mengontrol, melindungi dan mengamankan akun
                </SubTitle>
            </ProfilComponent>
            <form>
                <FormProfil>
                    <Table>
                        <TBody>
                            <Tr>
                                <Td style={{ textAlign: "right" }}><Label>Username</Label></Td>
                                <Td>Username</Td>
                            </Tr>
                            <Tr>
                                <Td style={{ textAlign: "right" }}><Label>Nama</Label></Td>
                                <Td>
                                    <InputWrapper>
                                        <Input />
                                    </InputWrapper>
                                </Td>
                            </Tr>
                            <Tr>
                                <Td style={{ textAlign: "right" }}><Label>Email</Label></Td>
                                <Td>**********@mail.com</Td>
                            </Tr>
                            <Tr>
                                <Td style={{ textAlign: "right" }}><Label>Nomor Telepon</Label></Td>
                                <Td>*************</Td>
                            </Tr>
                            <Tr>
                                <Td style={{ textAlign: "right" }}><Label>Nama Toko</Label></Td>
                                <Td>
                                    <InputWrapper>
                                        <Input />
                                    </InputWrapper>
                                </Td>
                            </Tr>
                            <Tr>
                                <Td style={{ textAlign: "right" }}><Label>Jenis Kelamin</Label></Td>
                                <Td>
                                    <Label>
                                        <InputRadio type="radio" name="gender" value="laki-laki" /> Laki-laki
                                    </Label>
                                    &nbsp;&nbsp;
                                    <Label>
                                        <InputRadio type="radio" name="gender" value="perempuan" /> Perempuan
                                    </Label>
                                </Td>
                            </Tr>
                            <Tr>
                                <Td style={{ textAlign: "right" }}><Label>Tanggal Lahir</Label></Td>
                                <Td>
                                    <InputSelect
                                        name="tanggal"
                                        value={tanggal}
                                        onChange={(e) => setTanggal(e.target.value)}
                                        style={{ marginRight: '8px' }}
                                    >
                                        <option value="" disabled hidden>Tanggal</option>
                                        {renderNumberOptions(1, 31)}
                                    </InputSelect>

                                    <InputSelect
                                        name="bulan"
                                        value={bulan}
                                        onChange={(e) => setBulan(e.target.value)}
                                        style={{ marginRight: '8px' }}
                                    >
                                        <option value="" disabled hidden>Bulan</option>
                                        {months.map((month, index) => (
                                            <option key={index} value={index + 1}>{month}</option>
                                        ))}
                                    </InputSelect>

                                    <InputSelect
                                        name="tahun"
                                        value={tahun}
                                        onChange={(e) => setTahun(e.target.value)}
                                    >
                                        <option value="" disabled hidden>Tahun</option>
                                        {renderNumberOptions(1980, 2025)}
                                    </InputSelect>
                                </Td>
                            </Tr>
                        </TBody>
                    </Table>
                    <WrapperImageProfil>
                        <ImageProfilContainer>
                            {imageError && (
                                <p style={{ color: 'red', fontSize: '12px' }}>{imageError}</p>
                            )}
                            <ImageContainer>
                                <Image
                                    src={imagePreview ? imagePreview : '/icon/user-red.svg'}
                                    alt="Preview"
                                />
                            </ImageContainer>
                            <LabelImageContainer>
                                <LabelImage
                                    htmlFor="image-upload">
                                    Pilih Gambar
                                </LabelImage>
                            </LabelImageContainer>
                            <Input
                                id="image-upload"
                                type="file"
                                accept="image/jpeg, image/png"
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />
                            <p style={{ fontSize: '12px', color: '#888' }}>
                                Ukuran gambar: Maks. 1 MB
                            </p>
                            <p style={{ fontSize: '12px', color: '#888' }}>
                                Format gambar: JPEG, PNG.
                            </p>
                        </ImageProfilContainer>
                    </WrapperImageProfil>
                </FormProfil>
                <ButtonContainer>
                    <ButtonSave>
                        Simpan
                    </ButtonSave>
                </ButtonContainer>
            </form>
        </UserProfile>
    )
}
