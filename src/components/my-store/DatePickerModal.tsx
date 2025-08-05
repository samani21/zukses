import { endOfDay, endOfMonth, startOfDay, startOfMonth, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'

const formatDateHelper = (date: Date | null, options: Intl.DateTimeFormatOptions = {}): string => {
    if (!date) return '';
    const defaultOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric', month: 'short', year: 'numeric', ...options
    };
    return date.toLocaleDateString('id-ID', defaultOptions);
};

const formatFullDateHelper = (date: Date | null): string => {
    if (!date) return '';
    return formatDateHelper(date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};


const DatePickerModal: React.FC<{
    isOpen: boolean; onClose: () => void;
    onApply: (range: { start: Date | null, end: Date | null }) => void;
    initialRange: { start: Date | null, end: Date | null };
}> = ({ isOpen, onClose, onApply, initialRange }) => {
    const [viewMode, setViewMode] = useState<'days' | 'months'>('days');
    const [viewDate, setViewDate] = useState(initialRange.start || new Date());
    const [startDate, setStartDate] = useState<Date | null>(initialRange.start);
    const [endDate, setEndDate] = useState<Date | null>(initialRange.end);
    const [hoverDate, setHoverDate] = useState<Date | null>(null);
    const [activePreset, setActivePreset] = useState('Custom Tanggal');

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) onClose();
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleDateClick = (day: Date) => {
        // Ganti bulan jika klik tanggal dari bulan lain
        const clickedMonth = day.getMonth();
        const currentViewMonth = viewDate.getMonth();
        const clickedYear = day.getFullYear();
        const currentViewYear = viewDate.getFullYear();

        if (clickedMonth !== currentViewMonth || clickedYear !== currentViewYear) {
            setViewDate(new Date(day)); // Pindahkan kalender ke bulan tanggal yang diklik
        }

        // Preset Per Hari
        if (activePreset === 'Per Hari') {
            setStartDate(startOfDay(day));
            setEndDate(endOfDay(day));
            return;
        }

        // Preset Per Minggu
        if (activePreset === 'Per Minggu') {
            const dayOfWeek = day.getDay(); // 0 = Min
            const start = startOfDay(new Date(day));
            start.setDate(day.getDate() - dayOfWeek); // ke Minggu
            const end = endOfDay(new Date(start));
            end.setDate(start.getDate() + 6); // ke Sabtu
            setStartDate(start);
            setEndDate(end);
            return;
        }

        // Custom Tanggal
        setActivePreset('Custom Tanggal');

        if (!startDate || (startDate && endDate)) {
            setStartDate(day);
            setEndDate(null);
        } else if (startDate && !endDate) {
            if (day < startDate) {
                setEndDate(startDate);
                setStartDate(day);
            } else {
                setEndDate(day);
            }
        }
    };


    const handleMainPresetClick = (preset: string) => {
        setActivePreset(preset);
        const refDate = new Date(viewDate);
        const start = new Date(refDate);
        const end = new Date(refDate);

        setViewMode('days'); // Default to day view

        switch (preset) {
            case 'Per Hari':
                setStartDate(start);
                setEndDate(end);
                break;
            case 'Per Minggu':
                const dayOfWeek = refDate.getDay();
                const firstDayOfWeek = new Date(refDate.setDate(refDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)));
                const lastDayOfWeek = new Date(firstDayOfWeek);
                lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
                setStartDate(firstDayOfWeek);
                setEndDate(lastDayOfWeek);
                break;
            case 'Per Bulan':
                setViewMode('months'); // Switch to month view
                break;
            case 'Custom Tanggal':
                setStartDate(null);
                setEndDate(null);
                break;
        }
    };

    const handleSecondaryPresetClick = (preset: string) => {
        const today = new Date();
        let start = startOfDay(today);
        let end = endOfDay(today);

        switch (preset) {
            case 'Hari ini':
                break;
            case 'Kemarin':
                start = startOfDay(subDays(today, 1));
                end = endOfDay(subDays(today, 1));
                break;
            case '7 Hari Terakhir':
                start = startOfDay(subDays(today, 6));
                break;
            case '30 Hari Terakhir':
                start = startOfDay(subDays(today, 29));
                break;
            case 'Bulan Ini':
                start = startOfMonth(today);
                end = endOfMonth(today);
                break;
        }

        setStartDate(start);
        setEndDate(end);
        setViewDate(start);
        setViewMode('days');
        setActivePreset(preset); // <--- ini penting
    };

    const handleMonthClick = (monthIndex: number) => {
        const year = viewDate.getFullYear();
        const start = startOfMonth(new Date(year, monthIndex));
        const end = endOfMonth(new Date(year, monthIndex));
        setStartDate(start);
        setEndDate(end);
        setViewDate(start);
        setViewMode('days');
    };

    const renderCalendar = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Minggu
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const calendarDays = [];

        // Hitung tanggal dari bulan sebelumnya yang ditampilkan
        const leadingDays = firstDayOfWeek;
        for (let i = leadingDays - 1; i >= 0; i--) {
            const date = new Date(year, month - 1, daysInPrevMonth - i);
            calendarDays.push({ date, isOtherMonth: true });
        }

        // Tanggal bulan ini
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            calendarDays.push({ date, isOtherMonth: false });
        }

        // Tambah tanggal dari bulan berikutnya jika grid belum penuh
        const trailingDays = 42 - calendarDays.length;
        for (let i = 1; i <= trailingDays; i++) {
            const date = new Date(year, month + 1, i);
            calendarDays.push({ date, isOtherMonth: true });
        }

        return calendarDays.map(({ date, isOtherMonth }, idx) => {
            const isStart = startDate && date.getTime() === startOfDay(startDate).getTime();
            const isEnd = endDate && date.getTime() === startOfDay(endDate).getTime();
            const isInRange = startDate && endDate && date > startDate && date < endDate;
            const isHoveringInRange = startDate && !endDate && hoverDate && date > startDate && date <= hoverDate;

            return (
                <button
                    key={idx}
                    onClick={() => handleDateClick(date)}
                    onMouseEnter={() => setHoverDate(date)}
                    onMouseLeave={() => setHoverDate(null)}
                    className={`w-10 h-10 flex items-center justify-center text-sm transition-colors relative
                    ${isOtherMonth ? 'text-gray-400' : ''}
                    ${(isInRange || isHoveringInRange) ? 'bg-yellow-100 rounded-full' : ''}
                    ${!isStart && !isEnd && !isInRange && !isHoveringInRange ? 'hover:bg-gray-100 rounded-full' : ''}
                `}
                >
                    <span
                        className={`z-10 w-full h-full flex items-center justify-center rounded-full
                    ${(isStart || isEnd) ? 'bg-yellow-400 text-white' : ''}
                `}>
                        {date.getDate()}
                    </span>
                </button>
            );
        });
    };


    const renderMonthView = () => {
        const months = Array.from({ length: 12 }, (_, i) =>
            new Date(viewDate.getFullYear(), i).toLocaleDateString('id-ID', { month: 'long' })
        );
        return (
            <div className="grid grid-cols-3 gap-2 py-4">
                {months.map((monthName, index) => (
                    <button
                        key={monthName}
                        onClick={() => handleMonthClick(index)}
                        className="p-4 rounded-md text-center hover:bg-gray-100 font-medium"
                    >
                        {monthName}
                    </button>
                ))}
            </div>
        );
    };

    const handleReset = () => { setStartDate(null); setEndDate(null); }
    const handleApply = () => { onApply({ start: startDate, end: endDate }); onClose(); }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div ref={modalRef} className="bg-white rounded-lg shadow-xl flex flex-col md:flex-row w-full max-w-3xl">
                <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200 w-full md:w-64">
                    <div className="space-y-1">
                        {['Per Hari', 'Per Minggu', 'Per Bulan', 'Custom Tanggal'].map(preset =>
                            <button key={preset} onClick={() => handleMainPresetClick(preset)}
                                className={`w-full text-left p-2 text-[#555] rounded-md text-[14px] font-medium flex justify-between items-center ${activePreset === preset ? 'bg-blue-100 text-blue-500' : 'hover:bg-[gray-100]'}`}>
                                {preset} <ChevronRight size={16} strokeWidth={3} />
                            </button>
                        )}
                    </div>
                    <div className="mt-6 pt-6">
                        <div className="flex flex-wrap gap-2">
                            {['Hari ini', 'Kemarin', '7 Hari Terakhir', '30 Hari Terakhir', 'Bulan Ini'].map(preset =>
                                <button
                                    key={preset}
                                    onClick={() => handleSecondaryPresetClick(preset)}
                                    className={`text-[14px] text-center border rounded-full py-2 px-4 whitespace-nowrap transition
                    ${activePreset === preset
                                            ? 'bg-yellow-400 text-white border-yellow-500'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                >
                                    {preset}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="p-6 flex-1">
                    <div className="flex items-center justify-between mb-4">
                        {viewMode === 'days' && (
                            <div className="flex items-center">
                                <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeft size={20} /></button>
                                <span className="font-semibold text-lg w-28 text-center">{viewDate.toLocaleDateString('id-ID', { month: 'long' })}</span>
                                <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))} className="p-2 rounded-full hover:bg-gray-100"><ChevronRight size={20} /></button>
                            </div>
                        )}
                        <div className="flex items-center">
                            <button onClick={() => setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth()))} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeft size={20} /></button>
                            <span className="font-semibold text-lg">{viewDate.getFullYear()}</span>
                            <button onClick={() => setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth()))} className="p-2 rounded-full hover:bg-gray-100"><ChevronRight size={20} /></button>
                        </div>
                    </div>

                    {viewMode === 'days' ? (
                        <>
                            <div className="grid grid-cols-7 gap-y-1 text-center text-sm text-gray-500 mb-2">
                                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => <div key={day}>{day}</div>)}
                            </div>
                            <div className="grid grid-cols-7 gap-y-1">{renderCalendar()}</div>
                        </>
                    ) : (
                        renderMonthView()
                    )}

                    <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
                        <p className="text-sm text-gray-600">{formatFullDateHelper(startDate)} - {formatFullDateHelper(endDate)}</p>
                        <div className="flex items-center space-x-2">
                            <button onClick={handleReset} className="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-md hover:bg-gray-50">Reset</button>
                            <button onClick={handleApply} className="px-4 py-2 text-sm font-semibold bg-yellow-400 hover:bg-yellow-500 rounded-md">Terapkan</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatePickerModal