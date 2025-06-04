import { Area } from 'react-easy-crop'

export default async function getCroppedImg(imageSrc: string, crop: Area) {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = crop.width
    canvas.height = crop.height

    ctx?.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
    )

    return new Promise<{ blob: Blob; previewUrl: string }>((resolve) => {
        canvas.toBlob((blob) => {
            const previewUrl = URL.createObjectURL(blob!)
            resolve({ blob: blob!, previewUrl })
        }, 'image/jpeg')
    })
}

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = url
        image.crossOrigin = 'anonymous'
        image.onload = () => resolve(image)
        image.onerror = (error) => reject(error)
    })
}
