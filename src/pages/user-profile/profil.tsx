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
import Snackbar from 'components/Snackbar'
import Post from 'services/api/Post'
import { Response } from 'services/api/types'
import { AxiosError } from 'axios'
import Get from 'services/api/Get'
import Loading from 'components/Loading'
import CropModal from './Components/CropModal'

const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

interface User {
    name?: string
    email?: string
    whatsapp?: string
    id?: number
    username?: string
    image?: string
    role?: string
}

interface ErrorMap {
    [key: string]: string
}

interface UserProfileData {
    name?: string;
    name_store?: string;
    gender?: string;
    date_birth?: string;
    id?: number;
    image?: string;
}

export default function Profil() {
    const [user, setUser] = useState<User | null>(null)
    const [form, setForm] = useState({
        name: '',
        storeName: '',
        gender: '',
        tanggal: '',
        bulan: '',
        tahun: '',
    })

    const [errors, setErrors] = useState<ErrorMap>({})
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [imageError, setImageError] = useState('')
    const [loading, setLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [typeModal, setTypeModal] = useState('')
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null)
    const [showCropModal, setShowCropModal] = useState(false)
    const [snackbar, setSnackbar] = useState<{
        message: string;
        type?: 'success' | 'error' | 'info';
        isOpen: boolean;
    }>({ message: '', type: 'info', isOpen: false });

    useEffect(() => {
        const currentUser = getUserInfo()
        if (currentUser) {
            setUser(currentUser)
            fetchUserProfile(currentUser.id)
        }
    }, [])

    const fetchUserProfile = async (userId?: number) => {
        if (!userId) return
        setLoading(true)
        const res = await Get<Response>('zukses', `user-profile/${userId}`)
        setLoading(false)

        if (res?.status === 'success' && res.data) {
            const data = res.data as UserProfileData
            setForm({
                name: data.name ?? '',
                storeName: data.name_store ?? '',
                gender: data.gender ?? '',
                tanggal: data.date_birth?.split('-')[2] ?? '',
                bulan: data.date_birth?.split('-')[1] ?? '',
                tahun: data.date_birth?.split('-')[0] ?? '',
            })
            setImagePreview(data.image ?? '')
        } else {
            console.warn('User profile tidak ditemukan atau gagal diambil')
        }
    }

    const renderNumberOptions = (start: number, end: number) =>
        Array.from({ length: end - start + 1 }, (_, i) => {
            const value = start + i
            return <option key={value} value={value}>{value}</option>
        })

    const maskEmail = (email?: string) => {
        if (!email || !email.includes('@')) return ''
        const [local, domain] = email.split('@')
        return `${local.slice(0, 2)}${'*'.repeat(local.length - 2)}@${domain}`
    }

    const maskPhone = (phone?: string | number | null) => {
        if (!phone) return ''
        const str = String(phone)
        return `${'*'.repeat(str.length - 2)}${str.slice(-2)}`
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            setImageError('Format gambar harus JPEG atau PNG.')
            return
        }

        if (file.size > 1024 * 1024) {
            setImageError('Ukuran gambar maksimal 1 MB.')
            return
        }

        const reader = new FileReader()
        reader.onload = () => {
            setCropImageSrc(reader.result as string)
            setShowCropModal(true)
        }
        reader.readAsDataURL(file)
    }


    const handleInputChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const newErrors: ErrorMap = {}
        const { name, storeName, gender, tanggal, bulan, tahun } = form

        if (!name) newErrors.name = 'Nama harus diisi.'
        if (!storeName) newErrors.storeName = 'Nama Toko harus diisi.'
        if (!gender) newErrors.gender = 'Jenis kelamin harus dipilih.'
        if (!tanggal || !bulan || !tahun) newErrors.birthdate = 'Tanggal lahir lengkap harus dipilih.'
        if (!imagePreview) newErrors.image = 'Gambar harus dipilih.'

        setErrors(newErrors)

        if (Object.keys(newErrors).length === 0 && user?.id) {
            try {
                setLoading(true)
                const formData = new FormData()
                formData.append('name', name)
                formData.append('name_store', storeName)
                formData.append('gender', gender)
                formData.append('date_birth', `${tahun}-${bulan}-${tanggal}`)
                if (imageFile) formData.append('image', imageFile)

                const res = await Post<Response>('zukses', `user-profile/${user.id}/create`, formData)
                setLoading(false)

                if (res?.data?.status === 'success') {
                    const updatedData = res?.data?.data as UserProfileData
                    localStorage.setItem('user', JSON.stringify({
                        ...user,
                        name: updatedData.name ?? '',
                        image: updatedData.image ?? ''
                    }))
                    setSnackbar({ message: 'Data berhasil dikirim!', type: 'success', isOpen: true })
                    fetchUserProfile(user.id)
                    setTimeout(() => window.location.reload(), 1500)
                }
            } catch (err) {
                setLoading(false)
                const error = err as AxiosError<{ message?: string }>
                setSnackbar({ message: error.response?.data?.message || 'Terjadi kesalahan', type: 'error', isOpen: true })
            }
        }
    }

    const handleChangeEmailOrWhatsapp = (type?: string) => {
        setTypeModal(type || '')
        setOpenModal(true)
    }

    const handleCropComplete = (croppedBlob: Blob, previewUrl: string) => {
        const croppedFile = new File([croppedBlob], 'cropped.jpg', { type: 'image/jpeg' })
        setImageFile(croppedFile)
        setImagePreview(previewUrl)
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
                            <InputWrapper style={{ border: 'none', paddingLeft: '0px' }}>
                                <div>{user?.username || '...'}</div>
                            </InputWrapper>
                        </Wrapper>

                        <Wrapper>
                            <Label>Nama</Label>
                            <FormGroup>
                                <InputWrapper>
                                    <Input value={form.name} onChange={(e) => handleInputChange('name', e.target.value)} />
                                </InputWrapper>
                                {errors.name && <p style={{ color: 'red', fontSize: 12 }}>{errors.name}</p>}
                            </FormGroup>
                        </Wrapper>

                        <Wrapper>
                            <Label>Email</Label>
                            <InputWrapper style={{ border: 'none', paddingLeft: '0px' }}>
                                <div>{maskEmail(user?.email)}<span onClick={() => handleChangeEmailOrWhatsapp('email')}> Ubah</span></div>
                            </InputWrapper>
                        </Wrapper>

                        <Wrapper>
                            <Label>Nomor Telepon</Label>
                            <InputWrapper style={{ border: 'none', paddingLeft: '0px' }}>
                                <div>{maskPhone(user?.whatsapp)}<span onClick={() => handleChangeEmailOrWhatsapp('whatsapp')}> Ubah</span></div>
                            </InputWrapper>
                        </Wrapper>

                        <Wrapper>
                            <Label>Nama Toko</Label>
                            <FormGroup>
                                <InputWrapper>
                                    <Input value={form.storeName} onChange={(e) => handleInputChange('storeName', e.target.value)} />
                                </InputWrapper>
                                {errors.storeName && <p style={{ color: 'red', fontSize: 12 }}>{errors.storeName}</p>}
                            </FormGroup>
                        </Wrapper>

                        <Wrapper>
                            <Label>Jenis Kelamin</Label>
                            <FormGroup>
                                <InputWrapper style={{ display: 'flex', gap: '20px', border: 'none' }}>
                                    {['Laki-laki', 'Perempuan'].map((opt) => (
                                        <LabelRadio key={opt}>
                                            <InputRadio
                                                type="radio"
                                                name="gender"
                                                value={opt}
                                                checked={form.gender === opt}
                                                onChange={(e) => handleInputChange('gender', e.target.value)}
                                            />
                                            {opt}
                                        </LabelRadio>
                                    ))}
                                </InputWrapper>
                                {errors.gender && <p style={{ color: 'red', fontSize: 12 }}>{errors.gender}</p>}
                            </FormGroup>
                        </Wrapper>

                        <Wrapper>
                            <Label>Tanggal Lahir</Label>
                            <FormGroup>
                                <InputWrapper style={{ display: 'flex', gap: 8, border: 'none', paddingLeft: 0 }}>
                                    <InputSelect value={form.tanggal} onChange={(e) => handleInputChange('tanggal', e.target.value)}>
                                        <option value="" disabled hidden>Tanggal</option>
                                        {renderNumberOptions(1, 31)}
                                    </InputSelect>
                                    <InputSelect value={form.bulan} onChange={(e) => handleInputChange('bulan', e.target.value)}>
                                        <option value="" disabled hidden>Bulan</option>
                                        {months.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                                    </InputSelect>
                                    <InputSelect value={form.tahun} onChange={(e) => handleInputChange('tahun', e.target.value)}>
                                        <option value="" disabled hidden>Tahun</option>
                                        {renderNumberOptions(1980, new Date().getFullYear())}
                                    </InputSelect>
                                </InputWrapper>
                                {errors.birthdate && <p style={{ color: 'red', fontSize: 12 }}>{errors.birthdate}</p>}
                            </FormGroup>
                        </Wrapper>
                    </FormLeft>

                    <WrapperImageProfil>
                        <ImageProfilContainer>
                            <ImageContainer>
                                <Image src={imagePreview || '/icon/user-red.svg'} alt="Preview" />
                            </ImageContainer>
                            <LabelImageContainer>
                                <LabelImage htmlFor="image-upload">Pilih Gambar</LabelImage>
                                <Input
                                    id="image-upload"
                                    type="file"
                                    accept="image/jpeg, image/png"
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}
                                />
                                {(imageError || errors.image) && <p style={{ color: 'red', fontSize: 12 }}>{imageError || errors.image}</p>}
                            </LabelImageContainer>
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

            {snackbar.isOpen && (
                <Snackbar
                    message={snackbar.message}
                    type={snackbar.type}
                    isOpen={snackbar.isOpen}
                    onClose={() => setSnackbar((prev) => ({ ...prev, isOpen: false }))}
                />
            )}

            {showCropModal && cropImageSrc && (
                <CropModal
                    imageSrc={cropImageSrc}
                    onClose={() => setShowCropModal(false)}
                    onCropComplete={handleCropComplete}
                />
            )}


            {loading && <Loading />}
        </UserProfile>
    )
}
