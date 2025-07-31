import React, { useEffect, useRef, useState } from 'react';

// Komponen input dengan label dan character counter
export const TextInput = ({ id, label, placeholder, maxLength, value, setValue, required = false }: { id?: string; label: string, placeholder: string, maxLength: number, value: string, setValue: (val: string) => void, required?: boolean }) => (
  <div id={id}>
    <label className="text-[#333333] font-bold text-[14px]">
      {label} {required && <span className='bg-[#FACACA] p-1 px-3 rounded-full text-[#C71616] text-[10px] ml-3 tracking-[0]'>Wajib</span>}
    </label>
    <div className="relative mt-2">
      {
        label === 'Nama Produk' ? <textarea
          className="w-full px-3 py-2 border border-[#AAAAAA] rounded-[5px] text-[#555555] text-[14px] resize-none overflow-hidden outline-none focus:border focus:border-blue-500"
          placeholder={placeholder}
          value={value}
          rows={1} // tinggi awal 1 baris
          onChange={(e) => {
            setValue(e.target.value);
            const el = e.target;
            el.style.height = 'auto'; // reset dulu
            el.style.height = el.scrollHeight + 'px'; // sesuaikan tinggi isi
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault(); // cegah enter
          }}
          maxLength={maxLength}
        />
          :
          <input
            type="text"
            className="w-full px-3 py-2 border border-[#AAAAAA] rounded-[5px] text-[#555555] text-[14px] outline-none focus:border border-blue-500"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={maxLength}
          />
      }
      <span className="absolute bottom-2 right-3 text-xs text-gray-400">
        {value?.length}/{maxLength}
      </span>
    </div>
  </div>
);

// Komponen text area dengan auto-resize
export const TextAreaInput = ({
  label,
  placeholder,
  maxLength,
  value,
  setValue,
  required = false,
  id,
}: {
  label: string,
  placeholder: string,
  maxLength: number,
  value: string,
  setValue: (val: string) => void,
  required?: boolean
  id?: string
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 480) + 'px';
    }
  };

  useEffect(() => {
    autoResize();
  }, [value]);

  return (
    <div id={id}>
      <label className="text-[#333333] font-bold text-[14px]">
        {label}   {required && <span className='bg-[#FACACA] p-1 px-3 rounded-full text-[#C71616] text-[10px] ml-3 tracking-[0]'>Wajib</span>}
      </label>
      <div className="relative mt-2">
        <textarea
          ref={textareaRef}
          className="w-full px-3 py-2 border border-[#AAAAAA] rounded-[5px] text-[#555555] text-[14px] overflow-hidden outline-none focus:border focus:border-blue-500"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={maxLength}
          rows={4}
          style={{ resize: 'none', maxHeight: '480px', overflowY: 'auto' }}
        />
        <span className="absolute bottom-2 right-3 text-xs text-gray-400">
          {value?.length}/{maxLength}
        </span>
      </div>
    </div>
  );
};

// Komponen radio button group
export const RadioGroup = ({
  label,
  name,
  options,
  required = false,
  onChange,
  defaultValue,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  onChange?: (val: string) => void;
  defaultValue?: string;
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue ?? options[0]);

  useEffect(() => {
    if (defaultValue) {
      setSelectedValue(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (onChange) onChange(selectedValue);
  }, [selectedValue, onChange]);

  return (
    <div>
      <label className="block text-[14px] font-bold text-[#333333] mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center space-x-6">
        {options.map((option) => (
          <label key={option} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option}
              checked={selectedValue === option}
              onChange={() => setSelectedValue(option)}
              className="hidden"
            />
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedValue === option ? 'border-[#660077]' : 'border-gray-400'}`}
            >
              {selectedValue === option && <div className="w-2 h-2 rounded-full bg-[#660077]"></div>}
            </div>
            <span
              className={`text-[14px] text-[#333333] ${selectedValue === option ? 'font-bold' : 'font-normal'}`}
            >
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};