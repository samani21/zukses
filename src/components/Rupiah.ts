export const formatRupiah = (value: string | number): string => {
    if (value === null || value === undefined || value === '') return '';
    const stringValue = String(value).replace(/[^0-9]/g, '');
    if (stringValue === '') return '';
    return 'Rp' + new Intl.NumberFormat('id-ID').format(Number(stringValue));
};
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

export const parseRupiah = (formattedValue: string): string => {
    return formattedValue.replace(/[^0-9]/g, '');
};
