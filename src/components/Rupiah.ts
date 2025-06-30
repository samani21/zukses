export const formatRupiah = (value: string | number): string => {
    if (value === null || value === undefined || value === '') return '';
    const stringValue = String(value).replace(/[^0-9]/g, '');
    if (stringValue === '') return '';
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(Number(stringValue));
};

export const parseRupiah = (formattedValue: string): string => {
    return formattedValue.replace(/[^0-9]/g, '');
};
