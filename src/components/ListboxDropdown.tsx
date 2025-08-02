// components/ListboxDropdown.tsx
'use client';

import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

interface ListboxDropdownProps<T> {
    label?: string;
    options: T[];
    selected: T;
    onChange: (value: T) => void;
    displayKey?: keyof T; // Optional: field to display if object
}

export function ListboxDropdown<T extends string | { [key: string]: T }>({
    label,
    options,
    selected,
    onChange,
    displayKey,
}: ListboxDropdownProps<T>) {
    const getLabel = (item: T): string => {
        if (typeof item === 'string') return item;
        if (displayKey && typeof item === 'object' && item !== null) {
            return String(item[displayKey]);
        }
        return '';
    };


    return (
        <div className="w-full">
            {label && <label className="text-sm text-gray-600 mb-1 block">{label}</label>}
            <Listbox value={selected} onChange={onChange}>
                <div className="relative">
                    <Listbox.Button className="relative w-full h-[40px] rounded-[5px] border border-[#AAAAAA] bg-white py-2 pl-3 pr-10 text-left text-[14px] text-[#333333] focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                        <span className="block truncate text-gray-700">{getLabel(selected)}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDown className="text-[#888888]" size={12} strokeWidth={3} />
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-[5px] bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {options.map((option, idx) => (
                                <Listbox.Option
                                    key={idx}
                                    className={({ active }) =>
                                        clsx(
                                            'relative cursor-pointer select-none py-2 pl-10 pr-4',
                                            active ? 'bg-purple-100 text-purple-700' : 'text-gray-900'
                                        )
                                    }
                                    value={option}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span className={clsx('block truncate', selected ? 'font-medium' : 'font-normal')}>
                                                {getLabel(option)}
                                            </span>
                                            {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-600">
                                                    <Check className="h-4 w-4" />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
}
