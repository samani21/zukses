'use client'
import React, { useEffect, useState } from 'react'
import UserProfile from '.'
import {
    ButtonContainer,
    ButtonSave,
    FormLeft,
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
    LabelRadio,
    ProfilComponent,
    SubTitle,
    Title,
    Wrapper,
    WrapperImageProfil
} from 'components/Profile/ProfileComponent'
import { getUserInfo } from 'services/api/redux/action/AuthAction'

const months: string[] = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

export default function Profil() {
    const [user, setUser] = useState<{ name?: string, email?: string, whatsapp?: string, id?: number } | null>(null)
    const [tanggal, setTanggal] = useState('')
    const [bulan, setBulan] = useState('')
    const [tahun, setTahun] = useState('')
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [imageError, setImageError] = useState<string>('')

    // Dapatkan info user hanya di client
    useEffect(() => {
        const u = getUserInfo()
        setUser(u)
    }, [])

    const renderNumberOptions = (start: number, end: number) => {
        const options = []
        for (let i = start; i <= end; i++) {
            options.push(<option key={i} value={i}>{i}</option>)
        }
        return options
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validasi file
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            setImageError('Format gambar harus JPEG atau PNG.')
            setImagePreview(null)
            return
        }

        if (file.size > 1024 * 1024) {
            setImageError('Ukuran gambar maksimal 1 MB.')
            setImagePreview(null)
            return
        }

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
                    <FormLeft>
                        <Wrapper>
                            <Label>Username</Label>
                            <InputWrapper style={{ border: 'none', paddingLeft: "0px" }}>
                                <div>{user?.name || '...'}</div>
                            </InputWrapper>
                        </Wrapper>

                        <Wrapper>
                            <Label>Nama</Label>
                            <InputWrapper><Input /></InputWrapper>
                        </Wrapper>

                        <Wrapper>
                            <Label>Email</Label>
                            <InputWrapper style={{ border: 'none', paddingLeft: "0px" }}>
                                <div>{user?.email || '...'}</div></InputWrapper>
                        </Wrapper>

                        <Wrapper>
                            <Label>Nomor Telepon</Label>
                            <InputWrapper style={{ border: 'none', paddingLeft: "0px" }}>
                                <div>{user?.whatsapp || '...'}</div></InputWrapper>
                        </Wrapper>

                        <Wrapper>
                            <Label>Nama Toko</Label>
                            <InputWrapper><Input /></InputWrapper>
                        </Wrapper>

                        <Wrapper>
                            <Label>Jenis Kelamin</Label>
                            <InputWrapper style={{ display: 'flex', justifyContent: 'left', border: 'none', gap: "20px" }}>
                                <LabelRadio>
                                    <InputRadio type="radio" name="gender" value="laki-laki" /> Laki-laki
                                </LabelRadio>
                                <LabelRadio>
                                    <InputRadio type="radio" name="gender" value="perempuan" /> Perempuan
                                </LabelRadio>
                            </InputWrapper>
                        </Wrapper>

                        <Wrapper>
                            <Label>Tanggal Lahir</Label>
                            <InputWrapper style={{ display: 'flex', justifyContent: 'left', border: 'none', paddingLeft: 0 }}>
                                <InputSelect name="tanggal" value={tanggal} onChange={(e) => setTanggal(e.target.value)} style={{ marginRight: 8 }}>
                                    <option value="" disabled hidden>Tanggal</option>
                                    {renderNumberOptions(1, 31)}
                                </InputSelect>
                                <InputSelect name="bulan" value={bulan} onChange={(e) => setBulan(e.target.value)} style={{ marginRight: 8 }}>
                                    <option value="" disabled hidden>Bulan</option>
                                    {months.map((month, index) => (
                                        <option key={index} value={index + 1}>{month}</option>
                                    ))}
                                </InputSelect>
                                <InputSelect name="tahun" value={tahun} onChange={(e) => setTahun(e.target.value)}>
                                    <option value="" disabled hidden>Tahun</option>
                                    {renderNumberOptions(1980, 2025)}
                                </InputSelect>
                            </InputWrapper>
                        </Wrapper>
                    </FormLeft>

                    <WrapperImageProfil>
                        <ImageProfilContainer>
                            {imageError && <p style={{ color: 'red', fontSize: 12 }}>{imageError}</p>}

                            <ImageContainer>
                                <Image
                                    src={imagePreview ?? '/icon/user-red.svg'}
                                    alt="Preview"
                                />
                            </ImageContainer>

                            <LabelImageContainer>
                                <LabelImage htmlFor="image-upload">Pilih Gambar</LabelImage>
                            </LabelImageContainer>

                            <Input
                                id="image-upload"
                                type="file"
                                accept="image/jpeg, image/png"
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />

                            <p style={{ fontSize: 12, color: '#888' }}>Ukuran gambar: Maks. 1 MB</p>
                            <p style={{ fontSize: 12, color: '#888' }}>Format gambar: JPEG, PNG.</p>
                        </ImageProfilContainer>
                    </WrapperImageProfil>
                </FormProfil>

                <ButtonContainer>
                    <ButtonSave>Simpan</ButtonSave>
                </ButtonContainer>
            </form>
        </UserProfile >
    )
}
