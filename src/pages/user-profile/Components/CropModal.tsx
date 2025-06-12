'use client'
import React, { useCallback, useState } from 'react'
import Cropper from 'react-easy-crop'
import { Area } from 'react-easy-crop'
import { ModalContainer, ModalProtectContainer } from 'components/Profile/ModalContainer'
import { ButtonSave } from 'components/Profile/ProfileComponent'
import getCroppedImg from 'utils/cropImageHelper'

interface CropModalProps {
    imageSrc: string
    onClose: () => void
    onCropComplete: (croppedBlob: Blob, previewUrl: string) => void
}

const CropModal: React.FC<CropModalProps> = ({ imageSrc, onClose, onCropComplete }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>()

    const onCropCompleteHandler = useCallback((_: Area, areaPixels: Area) => {
        setCroppedAreaPixels(areaPixels)
    }, [])

    const handleCrop = async () => {
        if (!croppedAreaPixels) return
        const { blob, previewUrl } = await getCroppedImg(imageSrc, croppedAreaPixels)
        onCropComplete(blob, previewUrl)
        onClose()
    }

    return (
        <ModalContainer open={true}>
            <ModalProtectContainer>
                <div style={{ position: 'relative', width: '100%', height: 400 }}>
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropCompleteHandler}
                    />
                </div>
                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <ButtonSave onClick={onClose}>Batal</ButtonSave>
                    <ButtonSave onClick={handleCrop}>Potong & Simpan</ButtonSave>
                </div>
            </ModalProtectContainer>
        </ModalContainer>
    )
}

export default CropModal
