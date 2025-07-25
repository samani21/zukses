import { Listbox } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';

interface Bank {
    id: number;
    name_bank: string;
}

interface BankSelectProps {
    banks: Bank[] | null;
    selectedBankId: number | null;
    setSelectedBankId: (id: number) => void;
    setAccountHolderName: (name: string | null) => void;
    errors: { bank?: string };
    setErrors: React.Dispatch<React.SetStateAction<{ bank?: string }>>;
}

export default function BankListbox({
    banks,
    selectedBankId,
    setSelectedBankId,
    setAccountHolderName,
    errors,
    setErrors
}: BankSelectProps) {
    const selectedBank = banks?.find(b => b.id === selectedBankId) || null;

    return (
        <div className="relative">
            <Listbox
                value={selectedBank}
                onChange={(bank) => {
                    setSelectedBankId(bank?.id ?? 0);
                    setAccountHolderName(null);
                    setErrors(prev => ({ ...prev, bank: undefined }));
                }}
            >
                {({ open }) => (
                    <>
                        <Listbox.Button className={`w-full h-[50px] border px-3 py-2 text-left rounded focus:outline-none flex justify-between items-center ${errors.bank ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}>
                            <span>{selectedBank ? selectedBank.name_bank : 'Nama Bank'}</span>
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                        </Listbox.Button>
                        {open && (
                            <Listbox.Options className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                                {banks?.map((bank) => (
                                    <Listbox.Option
                                        key={bank.id}
                                        value={bank}
                                        className={({ active }) =>
                                            `cursor-pointer select-none px-4 py-2 ${active ? 'bg-blue-100' : 'bg-white'}`
                                        }
                                    >
                                        {({ selected }) => (
                                            <div className="flex justify-between items-center">
                                                <span>{bank.name_bank}</span>
                                                {selected && <Check className="w-4 h-4 text-blue-600" />}
                                            </div>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        )}
                    </>
                )}
            </Listbox>
            {errors.bank && <p className="mt-1 text-sm text-red-500">{errors.bank}</p>}
        </div>
    );
}
