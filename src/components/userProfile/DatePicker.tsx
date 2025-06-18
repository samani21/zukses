import React from 'react'

const DatePicker = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <div className="flex gap-2">
            <select defaultValue="" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="" disabled>Tanggal</option>
                {days.map(day => <option key={day} value={day}>{day}</option>)}
            </select>
            <select defaultValue="" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="" disabled>Bulan</option>
                {months.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}
            </select>
            <select defaultValue="" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="" disabled>Tahun</option>
                {years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
        </div>
    );
};
export default DatePicker