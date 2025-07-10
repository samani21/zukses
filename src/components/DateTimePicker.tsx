'use client';

import { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { CustomLocale } from 'flatpickr/dist/types/locale';

const customIndonesianLocale: Partial<CustomLocale> = {
  weekdays: {
    shorthand: ['M', 'S', 'S', 'R', 'K', 'J', 'S'] as [string, string, string, string, string, string, string],
    longhand: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as [string, string, string, string, string, string, string],
  },
  months: {
    shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'] as [string, string, string, string, string, string, string, string, string, string, string, string],
    longhand: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'] as [string, string, string, string, string, string, string, string, string, string, string, string],
  },
  firstDayOfWeek: 1,
  ordinal: () => '',
  rangeSeparator: ' - ',
  weekAbbreviation: 'Mg',
  scrollTitle: 'Gulir untuk menambah',
  toggleTitle: 'Klik untuk membalik',
  amPM: ['AM', 'PM'] as [string, string],
  yearAriaLabel: 'Tahun',
  time_24hr: true,
};

export default function DateTimePicker() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const instance = flatpickr(inputRef.current, {
      locale: customIndonesianLocale,
      enableTime: true,
      dateFormat: 'd F Y, H:i',
      defaultDate: new Date(),
      onReady(selectedDates, dateStr, instance) {
        const calendarContainer = instance.calendarContainer;
        if (calendarContainer.querySelector('.picker-content-wrapper')) return;

        const calendarPart = calendarContainer.querySelector('.flatpickr-rContainer') as HTMLElement;
        const originalTimePicker = calendarContainer.querySelector('.flatpickr-time') as HTMLElement;
        if (originalTimePicker) originalTimePicker.style.display = 'none';

        const customTimePicker = document.createElement('div');
        customTimePicker.className = 'custom-time-picker';
        customTimePicker.innerHTML = `
          <div class="time-wheel-column">
              <div class="wheel-arrow" data-action="hour-up">▲</div>
              <div class="wheel-values" id="hour-values"></div>
              <div class="wheel-arrow" data-action="hour-down">▼</div>
          </div>
          <div class="time-wheel-column">
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
        confirmButton.addEventListener('click', () => instance.close());
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
          arrow.addEventListener('click', action);
          return arrow;
        };

        const leftArrowGroup = document.createElement('div');
        leftArrowGroup.className = 'arrow-group';
        leftArrowGroup.appendChild(createArrow('«', () => instance.changeYear(-1)));
        leftArrowGroup.appendChild(createArrow('<', () => instance.changeMonth(-1)));

        const rightArrowGroup = document.createElement('div');
        rightArrowGroup.className = 'arrow-group';
        rightArrowGroup.appendChild(createArrow('>', () => instance.changeMonth(1)));
        rightArrowGroup.appendChild(createArrow('»', () => instance.changeYear(1)));

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
          const target = e.target as HTMLElement;
          const action = target.dataset.action;
          if (!action) return;
          const [unit, direction] = action.split('-');
          const amount = direction === 'up' ? -1 : 1;
          const newDate = new Date(instance.selectedDates[0] || instance.now);
          if (unit === 'hour') newDate.setHours(newDate.getHours() + amount);
          if (unit === 'minute') newDate.setMinutes(newDate.getMinutes() + amount);
          instance.setDate(newDate, true);
        });

        instance.config.onChange?.push(updateUI);
        instance.config.onMonthChange?.push(updateUI);
        instance.config.onYearChange?.push(updateUI);

        updateUI();
      },
    });

    return () => {
      instance.destroy();
    };
  }, []);

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="text"
        id="datepicker-input"
        className="w-full p-2 border border-[#AAAAAA] rounded-[5px] focus:ring-orange-500 focus:border-orange-500"
      />
    </div>
  );
}
