'use client'
import React, { useEffect, useState } from 'react'
import UserProfile from '.'
import {
    ButtonContainer,
    ButtonSave,
    FormGroup,
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
import { ModalContainer } from 'components/Profile/ModalContainer'
import ModalProtect from './ModalProtect'

const months: string[] = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

interface User {
    name?: string
    email?: string
    whatsapp?: string
    id?: number
}

interface ErrorMap {
    [key: string]: string
}

export default function Profil() {
    const [user, setUser] = useState<User | null>(null)
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [typeModal, setTypeModal] = useState<string>('');
    const [tanggal, setTanggal] = useState<string>('')
    const [bulan, setBulan] = useState<string>('')
    const [tahun, setTahun] = useState<string>('')
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imageError, setImageError] = useState<string>('')

    const [name, setName] = useState<string>('')
    const [storeName, setStoreName] = useState<string>('')
    const [gender, setGender] = useState<string>('')
    const [errors, setErrors] = useState<ErrorMap>({})

    useEffect(() => {
        const u = getUserInfo()
        setUser(u)
    }, [])
    const maskPhone = (phone?: string | number | null): string => {
        if (!phone) return '';
        const phoneStr = String(phone);
        if (phoneStr.length < 4) return '*'.repeat(phoneStr.length);
        const visibleEnd = phoneStr.slice(-2);
        const masked = '*'.repeat(phoneStr.length - 2);
        return `${masked}${visibleEnd}`;
    };

    const maskEmail = (email?: string | null): string => {
        if (!email || !email.includes('@')) return '';
        const [localPart, domain] = email.split('@');
        if (localPart.length <= 2) {
            return `${localPart[0] || ''}${'*'.repeat(localPart.length - 1)}@${domain}`;
        }
        const visible = localPart.slice(0, 2);
        const masked = '*'.repeat(localPart.length - 2);
        return `${visible}${masked}@${domain}`;
    };
    const renderNumberOptions = (start: number, end: number) => {
        return Array.from({ length: end - start + 1 }, (_, i) => {
            const value = start + i
            return <option key={value} value={value}>{value}</option>
        })
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            setImageError('Format gambar harus JPEG atau PNG.')
            setImagePreview(null)
            setImageFile(null)
            return
        }

        if (file.size > 1024 * 1024) {
            setImageError('Ukuran gambar maksimal 1 MB.')
            setImagePreview(null)
            setImageFile(null)
            return
        }

        setImagePreview(URL.createObjectURL(file))
        setImageFile(file)
        setImageError('')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const newErrors: ErrorMap = {}

        if (!name) newErrors.name = 'Nama harus diisi.'
        if (!storeName) newErrors.storeName = 'Nama Toko harus diisi.'
        if (!gender) newErrors.gender = 'Jenis kelamin harus dipilih.'
        if (!tanggal || !bulan || !tahun) newErrors.birthdate = 'Tanggal lahir lengkap harus dipilih.'
        if (!imageFile) newErrors.image = 'Gambar harus dipilih.'

        setErrors(newErrors)
        console.log(name, storeName, gender, `${tanggal}-${bulan}-${tahun}`, imageFile)

        // if (Object.keys(newErrors).length === 0 && imageFile) {
        //     const formData = new FormData()
        //     formData.append('name', name)
        //     formData.append('storeName', storeName)
        //     formData.append('gender', gender)
        //     formData.append('birthdate', `${tanggal}-${bulan}-${tahun}`)
        //     formData.append('image', imageFile)

        //     try {
        //         const response = await fetch('/api/update-profile', {
        //             method: 'POST',
        //             body: formData
        //         })

        //         if (!response.ok) throw new Error('Gagal menyimpan profil.')
        //         const data = await response.json()
        //         console.log('✅ Profil berhasil disimpan:', data)
        //     } catch (error) {
        //         console.error('❌ Error saat menyimpan profil:', error)
        //     }
        // }
    }

    const handleChangeEmailOrWhatsapp = (type?: string) => {
        setOpenModal(true)
        setTypeModal(type || '')
    }
    return (
        <UserProfile mode="profil">
            <ProfilComponent>
                <Title>Profil Saya</Title>
                <SubTitle>
                    Kelola informasi profil Anda untuk mengontrol, melindungi dan mengamankan akun
                </SubTitle>
            </ProfilComponent>

            <form onSubmit={handleSubmit}>
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
                            <FormGroup>
                                <InputWrapper>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </InputWrapper>
                                {errors.name && <p style={{ color: 'red', fontSize: 12 }}>{errors.name}</p>}
                            </FormGroup>
                        </Wrapper>

                        <Wrapper>
                            <Label>Email</Label>
                            <InputWrapper style={{ border: 'none', paddingLeft: "0px" }}>
                                <div>{maskEmail(user?.email) || '...'}<span onClick={() => handleChangeEmailOrWhatsapp('email')}>Ubah</span></div>
                            </InputWrapper>
                        </Wrapper>

                        <Wrapper>
                            <Label>Nomor Telepon</Label>
                            <InputWrapper style={{ border: 'none', paddingLeft: "0px" }}>
                                <div>{maskPhone(user?.whatsapp) || '...'}<span onClick={() => handleChangeEmailOrWhatsapp('whatsapp')}>Ubah</span></div>
                            </InputWrapper>
                        </Wrapper>

                        <Wrapper>
                            <Label>Nama Toko</Label>
                            <FormGroup>
                                <InputWrapper>
                                    <Input
                                        value={storeName}
                                        onChange={(e) => setStoreName(e.target.value)}
                                    />
                                </InputWrapper>
                                {errors.storeName && <p style={{ color: 'red', fontSize: 12 }}>{errors.storeName}</p>}
                            </FormGroup>
                        </Wrapper>

                        <Wrapper>
                            <Label>Jenis Kelamin</Label>
                            <FormGroup>
                                <InputWrapper style={{ display: 'flex', gap: '20px', border: 'none' }}>
                                    <LabelRadio>
                                        <InputRadio
                                            type="radio"
                                            name="gender"
                                            value="laki-laki"
                                            checked={gender === 'laki-laki'}
                                            onChange={(e) => setGender(e.target.value)}
                                        />
                                        Laki-laki
                                    </LabelRadio>
                                    <LabelRadio>
                                        <InputRadio
                                            type="radio"
                                            name="gender"
                                            value="perempuan"
                                            checked={gender === 'perempuan'}
                                            onChange={(e) => setGender(e.target.value)}
                                        />
                                        Perempuan
                                    </LabelRadio>
                                </InputWrapper>
                                {errors.gender && <p style={{ color: 'red', fontSize: 12 }}>{errors.gender}</p>}
                            </FormGroup>
                        </Wrapper>

                        <Wrapper>
                            <Label>Tanggal Lahir</Label>
                            <FormGroup>
                                <InputWrapper style={{ display: 'flex', gap: 8, border: 'none', paddingLeft: 0 }}>
                                    <InputSelect
                                        value={tanggal}
                                        onChange={(e) => setTanggal(e.target.value)}
                                    >
                                        <option value="" disabled hidden>Tanggal</option>
                                        {renderNumberOptions(1, 31)}
                                    </InputSelect>

                                    <InputSelect
                                        value={bulan}
                                        onChange={(e) => setBulan(e.target.value)}
                                    >
                                        <option value="" disabled hidden>Bulan</option>
                                        {months.map((month, idx) => (
                                            <option key={idx} value={idx + 1}>{month}</option>
                                        ))}
                                    </InputSelect>

                                    <InputSelect
                                        value={tahun}
                                        onChange={(e) => setTahun(e.target.value)}
                                    >
                                        <option value="" disabled hidden>Tahun</option>
                                        {renderNumberOptions(1980, 2025)}
                                    </InputSelect>
                                </InputWrapper>
                                {errors.birthdate && <p style={{ color: 'red', fontSize: 12 }}>{errors.birthdate}</p>}
                            </FormGroup>
                        </Wrapper>
                    </FormLeft>

                    <WrapperImageProfil>
                        <ImageProfilContainer>
                            {imageError && <p style={{ color: 'red', fontSize: 12 }}>{imageError}</p>}
                            <ImageContainer>
                                <Image
                                    src={imagePreview || '/icon/user-red.svg'}
                                    alt="Preview"
                                />
                            </ImageContainer>
                            <LabelImageContainer>
                                <LabelImage htmlFor="image-upload">Pilih Gambar</LabelImage>
                                {(imageError || errors.image) && (
                                    <p style={{ color: 'red', fontSize: 12 }}>{imageError || errors.image}</p>
                                )}
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
                    <ButtonSave type="submit">Simpan</ButtonSave>
                </ButtonContainer>
            </form>
            <ModalContainer open={openModal}>
                <ModalProtect setOpenModal={setOpenModal} typeModal={typeModal} user={user} />
            </ModalContainer>
        </UserProfile>
    )
}
