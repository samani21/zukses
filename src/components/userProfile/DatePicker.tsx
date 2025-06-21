import React from 'react';

// 1. Definisikan interface untuk props agar lebih jelas dan aman (best practice TypeScript)
interface DatePickerProps {
    value: {
        day: string;
        month: string;
        year: string;
    };
    onChange: (field: 'tanggal' | 'bulan' | 'tahun', value: string) => void;
}

// 2. Terima props `value` dan `onChange` dari komponen induk
const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <div className="flex gap-2">
            {/* --- Dropdown Tanggal --- */}
            <select
                // 3. Atur `value` dari props dan hapus `defaultValue`
                value={value.day}
                // 4. Panggil fungsi `onChange` dari props ketika nilai berubah
                onChange={(e) => onChange('tanggal', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="" disabled>Tanggal</option>
                {days.map(day => <option key={day} value={day}>{day}</option>)}
            </select>

            {/* --- Dropdown Bulan --- */}
            <select
                value={value.month}
                onChange={(e) => onChange('bulan', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="" disabled>Bulan</option>
                {/* Menggunakan format 2 digit untuk value bulan (misal: '01' untuk Januari) agar konsisten */}
                {months.map((month, index) => <option key={month} value={String(index + 1).padStart(2, '0')}>{month}</option>)}
            </select>

            {/* --- Dropdown Tahun --- */}
            <select
                value={value.year}
                onChange={(e) => onChange('tahun', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="" disabled>Tahun</option>
                {years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
        </div>
    );
};

export default DatePicker;