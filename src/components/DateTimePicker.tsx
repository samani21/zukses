'use client';

import { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { CustomLocale } from 'flatpickr/dist/types/locale';
import { Calendar } from 'lucide-react';

const customIndonesianLocale: Partial<CustomLocale> = {
  weekdays: {
    shorthand: ['M', 'S', 'S', 'R', 'K', 'J', 'S'],
    longhand: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
  },
  months: {
    shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    longhand: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
  },
  firstDayOfWeek: 1,
  ordinal: () => '',
  rangeSeparator: ' - ',
  weekAbbreviation: 'Mg',
  scrollTitle: 'Gulir untuk menambah',
  toggleTitle: 'Klik untuk membalik',
  amPM: ['AM', 'PM'],
  yearAriaLabel: 'Tahun',
  time_24hr: true,
};

export default function DateTimePicker({
  value,
  onChange
}: {
  value: Date | null;
  onChange: (date: Date) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pickerRef = useRef<flatpickr.Instance | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    if (pickerRef.current) pickerRef.current.destroy();

    const instance = flatpickr(inputRef.current, {
      locale: customIndonesianLocale,
      enableTime: true,
      dateFormat: 'd F Y, H:i',
      defaultDate: value ?? undefined,
      minDate: new Date(),
      
      onReady(selectedDates, dateStr, instance) {
        const calendarContainer = instance.calendarContainer;
        if (calendarContainer.querySelector('.picker-content-wrapper')) return;

        const calendarPart = calendarContainer.querySelector('.flatpickr-rContainer') as HTMLElement;
        const originalTimePicker = calendarContainer.querySelector('.flatpickr-time') as HTMLElement;
        if (originalTimePicker) originalTimePicker.style.display = 'none';

        const customTimePicker = document.createElement('div');
        customTimePicker.className = 'custom-time-picker';
        customTimePicker.innerHTML = `
          <div class="time-wheel-column" id="hour-wheel">
            <div class="wheel-arrow" data-action="hour-up">▲</div>
            <div class="wheel-values" id="hour-values"></div>
            <div class="wheel-arrow" data-action="hour-down">▼</div>
          </div>
          <div class="time-wheel-column" id="minute-wheel">
            <div class="wheel-arrow" data-action="minute-up">▲</div>
            <div class="wheel-values" id="minute-values"></div>
            <div class="wheel-arrow" data-action="minute-down">▼</div>
          </div>
        `;

        const confirmWrapper = document.createElement('div');
        confirmWrapper.className = 'confirm-button-wrapper';
        const confirmButton = document.createElement('button');
        confirmButton.className = 'custom-confirm-button';
        confirmButton.textContent = 'Konfirmasi';
        confirmButton.addEventListener('click', (e) => {
          e.stopPropagation();
          instance.close();
        });
        confirmWrapper.appendChild(confirmButton);

        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'picker-content-wrapper';
        contentWrapper.appendChild(calendarPart);
        contentWrapper.appendChild(customTimePicker);
        calendarContainer.appendChild(contentWrapper);
        calendarContainer.appendChild(confirmWrapper);

        const monthNav = calendarContainer.querySelector('.flatpickr-months')!;
        monthNav.innerHTML = '';
        const customTitle = document.createElement('span');
        customTitle.className = 'custom-month-title';

        const createArrow = (text: string, action: () => void) => {
          const arrow = document.createElement('span');
          arrow.className = 'custom-arrow';
          arrow.textContent = text;
          arrow.addEventListener('click', (e) => {
            e.stopPropagation();
            action();
            updateUI();
          });
          return arrow;
        };

        const leftArrowGroup = document.createElement('div');
        leftArrowGroup.className = 'arrow-group';
        leftArrowGroup.appendChild(createArrow('«', () => instance.changeYear(instance.currentYear - 1)));
        leftArrowGroup.appendChild(createArrow('<', () => instance.changeMonth(instance.currentMonth - 1)));

        const rightArrowGroup = document.createElement('div');
        rightArrowGroup.className = 'arrow-group';
        rightArrowGroup.appendChild(createArrow('>', () => instance.changeMonth(instance.currentMonth + 1)));
        rightArrowGroup.appendChild(createArrow('»', () => instance.changeYear(instance.currentYear + 1)));

        monthNav.appendChild(leftArrowGroup);
        monthNav.appendChild(customTitle);
        monthNav.appendChild(rightArrowGroup);

        const updateUI = () => {
          const date = instance.selectedDates[0] || new Date();
          const h = date.getHours();
          const m = date.getMinutes();
          const hourValues = calendarContainer.querySelector('#hour-values');
          const minuteValues = calendarContainer.querySelector('#minute-values');

          const monthName = instance.l10n.months.longhand[instance.currentMonth];
          const year = instance.currentYear;
          customTitle.textContent = `${monthName} ${year}`;

          if (!hourValues || !minuteValues) return;
          hourValues.innerHTML = '';
          minuteValues.innerHTML = '';

          for (let i = -3; i <= 3; i++) {
            const hour = (h + i + 24) % 24;
            const span = document.createElement('span');
            span.textContent = hour.toString().padStart(2, '0');
            if (i === 0) span.className = 'selected';
            hourValues.appendChild(span);
          }

          for (let i = -3; i <= 3; i++) {
            const minute = (m + i + 60) % 60;
            const span = document.createElement('span');
            span.textContent = minute.toString().padStart(2, '0');
            if (i === 0) span.className = 'selected';
            minuteValues.appendChild(span);
          }
        };

        customTimePicker.addEventListener('click', (e) => {
          e.stopPropagation();
          const target = e.target as HTMLElement;
          const action = target.dataset.action;
          if (!action) return;
          const [unit, direction] = action.split('-');
          const amount = direction === 'up' ? -1 : 1;
          const newDate = new Date(instance.selectedDates[0] || new Date());
          if (unit === 'hour') newDate.setHours(newDate.getHours() + amount);
          if (unit === 'minute') newDate.setMinutes(newDate.getMinutes() + amount);
          instance.setDate(newDate, true);
          setTimeout(() => updateUI(), 0);
        });

        const addScrollEvent = (id: string, unit: 'hour' | 'minute') => {
          const wheel = calendarContainer.querySelector(id);
          if (!wheel) return;
          wheel.addEventListener('wheel', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const delta = (e as WheelEvent).deltaY;
            const newDate = new Date(instance.selectedDates[0] || new Date());
            if (unit === 'hour') newDate.setHours(newDate.getHours() + (delta > 0 ? 1 : -1));
            if (unit === 'minute') newDate.setMinutes(newDate.getMinutes() + (delta > 0 ? 1 : -1));
            instance.setDate(newDate, true);
            setTimeout(() => updateUI(), 0);
          }, { passive: false });
        };

        const addDragEvent = (id: string, unit: 'hour' | 'minute') => {
          const wheel = calendarContainer.querySelector(id) as HTMLElement;
          if (!wheel) return;

          let isDragging = false;
          let startY = 0;
          let lastChangeTime = 0;

          wheel.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;
            startY = e.clientY;
            lastChangeTime = Date.now();
          });

          document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaY = e.clientY - startY;
            if (Math.abs(deltaY) > 30 || Date.now() - lastChangeTime > 100) {
              const newDate = new Date(instance.selectedDates[0] || new Date());
              const direction = deltaY > 0 ? 1 : -1;
              if (unit === 'hour') newDate.setHours(newDate.getHours() + direction);
              if (unit === 'minute') newDate.setMinutes(newDate.getMinutes() + direction);
              instance.setDate(newDate, true);
              setTimeout(() => updateUI(), 0);
              startY = e.clientY;
              lastChangeTime = Date.now();
            }
          });

          document.addEventListener('mouseup', () => {
            isDragging = false;
          });
        };

        addScrollEvent('#hour-wheel', 'hour');
        addScrollEvent('#minute-wheel', 'minute');
        addDragEvent('#hour-wheel', 'hour');
        addDragEvent('#minute-wheel', 'minute');

        instance.config.onChange?.push(updateUI);
        instance.config.onMonthChange?.push(updateUI);
        instance.config.onYearChange?.push(updateUI);

        updateUI();
      },
      onChange: (selectedDates) => {
        if (selectedDates[0]) {
          onChange(selectedDates[0]);
        }
      },
    });

    pickerRef.current = instance;

    return () => {
      instance.destroy();
    };
  }, [value]);

  return (
    <div className="w-full border border-[#AAAAAA] rounded-[5px] flex justify-between items-center px-2">
      <input
        ref={inputRef}
        type="text"
        id="datepicker-input"
        className="w-full p-2 focus:outline-none"
      />
      <Calendar />
    </div>
  );
}
