export async function convertImageUrlToFile(url: string): Promise<File | null> {
    try {
        const res = await fetch(url);
        const blob = await res.blob();
        const filename = url.split('/').pop() || 'image.jpg';
        return new File([blob], filename, { type: blob.type });
    } catch {
        console.error("Gagal mengonversi URL ke File:", url);
        return null;
    }
}


export const formatRupiahNoRP = (value: string | number): string => {
    if (value === null || value === undefined || value === '') return '';
    const stringValue = String(value).replace(/[^0-9]/g, '');
    if (stringValue === '') return '';
    return new Intl.NumberFormat('id-ID').format(Number(stringValue));
};

export const formatRupiahNoRPHarga = (value: string | number): string => {
    if (value === null || value === undefined || value === '') return '';

    // Convert to string and replace koma (,) dengan titik (.)
    const normalized = String(value).replace(',', '.');

    // Parse as float
    const number = parseFloat(normalized);
    if (isNaN(number)) return '';

    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: normalized.includes('.') ? 1 : 0,
        maximumFractionDigits: 20, // Biarkan panjang desimal sesuai input
    }).format(number);
};