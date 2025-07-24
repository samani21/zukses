import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import React, { Fragment } from 'react'
interface IOption {
    value: string;
    label: string;
}

interface SelectMenuProps {
    placeholder: string;
    options: IOption[];
    selected: IOption | null | undefined;
    onChange: (value: IOption) => void;
}
const SelectMenu: React.FC<SelectMenuProps> = ({ placeholder, options, selected, onChange }) => {
    return (
        <Listbox value={selected} onChange={onChange}>
            <div className="relative">
                <Listbox.Button className="relative w-full cursor-default rounded-[5px] bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-[#CCCCCC] focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-green-300 sm:text-sm h-10">
                    <span className={`block truncate ${selected ? 'text-gray-900' : 'text-gray-400'}`}>
                        {selected ? selected.label : placeholder}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                </Listbox.Button>
                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                        {options.map((option) => (
                            <Listbox.Option key={option.value} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-green-100 text-green-900' : 'text-gray-900'}`} value={option}>
                                {({ selected }) => (
                                    <>
                                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{option.label}</span>
                                        {selected ? (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
                                                <Check className="h-5 w-5" aria-hidden="true" />
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
    );
};

export default SelectMenu