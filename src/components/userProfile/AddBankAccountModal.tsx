import React, { useEffect, useState } from 'react';
import Get from 'services/api/Get';
import { Response } from 'services/api/types';
import { X } from 'lucide-react';
import { Checkbox, Switch } from '@mui/material';
import { SwitchContainer } from 'components/Profile/AddressComponent';

type Banks = {
    name_bank?: string;
    id?: number;
};

type BankAccountData = {
    bank_id: number;
    id?: number;
    is_primary?: boolean;
    account_holder_name: string;
    account_number: string;
};

type GetAccountBank = {
    name_bank?: string;
    account_name?: string;
    icon?: string;
    account_number?: number;
    id?: number;
    is_primary?: boolean;
    bank_id?: number;
};

type Props = {
    handleAdd: (data: BankAccountData, id?: number) => Promise<void>;
    onClose: () => void;
    editBank?: GetAccountBank;
};

const AddBankAccountModal = ({ onClose, handleAdd, editBank }: Props) => {
    const [banks, setBanks] = useState<Banks[] | null>(null);
    const [selectedBankId, setSelectedBankId] = useState<number>(0);
    const [accountNumber, setAccountNumber] = useState<string>('');
    const [accountHolderName, setAccountHolderName] = useState<string | null>(null);
    const [isPrimary, setIsPrimary] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ bank?: string; number?: string; name?: string; submit?: string }>({});
    const resetForm = () => {
        setSelectedBankId(0);
        setAccountNumber('');
        setAccountHolderName(null);
        setIsPrimary(false);
        setErrors({});
    };
    useEffect(() => {
        getBanks();
        resetForm()
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);


    useEffect(() => {
        if (editBank) {
            setSelectedBankId(editBank?.bank_id || 0);
            setAccountNumber(String(editBank?.account_number || ''));
            setAccountHolderName(editBank?.account_name || '');
            setIsPrimary(editBank?.is_primary ?? false);
        }
    }, [editBank]);

    const getBanks = async () => {
        try {
            const res = await Get<Response>('zukses', `banks`);
            if (res?.status === 'success' && Array.isArray(res.data)) {
                setBanks(res.data);
            } else {
                setErrors(prev => ({ ...prev, submit: 'Gagal memuat daftar bank.' }));
            }
        } catch (error) {
            console.error('Error fetching banks:', error);
            setErrors(prev => ({ ...prev, submit: 'Terjadi kesalahan saat memuat daftar bank.' }));
        }
    };

    const validateForm = () => {
        const newErrors: { bank?: string; number?: string; name?: string; submit?: string } = {};

        if (!selectedBankId) newErrors.bank = 'Nama bank wajib dipilih.';
        if (!accountHolderName) newErrors.name = 'Nama akun wajib diisi.';
        if (!accountNumber) {
            newErrors.number = 'Nomor rekening wajib diisi.';
        } else if (!/^\d+$/.test(accountNumber)) {
            newErrors.number = 'Nomor rekening hanya boleh berisi angka.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = validateForm();
        if (!isValid) return;

        setErrors(prev => ({ ...prev, submit: undefined }));

        const payload = {
            bank_id: selectedBankId,
            account_number: accountNumber,
            account_holder_name: accountHolderName!,
            id: editBank?.id ?? undefined,
            is_primary: isPrimary
        };

        await handleAdd(payload, payload.id);
        onClose();
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="w-[748px] bg-white rounded-lg shadow-xl">
                <div className="flex justify-between items-center p-4 px-7 h-[60px] bg-[#227D53]">
                    <h2 className="text-[20px] text-white font-semibold">Tambah rekening</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div className="relative mb-4.5">
                            <select
                                value={selectedBankId}
                                onChange={(e) => {
                                    setSelectedBankId(parseInt(e.target.value));
                                    setAccountHolderName(null);
                                    setErrors(prev => ({ ...prev, bank: undefined }));
                                }}
                                className={`w-full h-[50px] border px-3 pr-10 py-3 focus:outline-none focus:ring-2 ${errors.bank ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                            >
                                <option value="">Nama Bank</option>
                                {banks?.map((b, i) => (
                                    <option value={b?.id} key={i}>{b?.name_bank}</option>
                                ))}
                            </select>
                            {errors.bank && <p className="text-xs text-red-500 mt-1 ml-1">{errors.bank}</p>}
                        </div>

                        <div className="relative">
                            <div className={`border flex items-center transition-all ${errors.number ? 'border-red-500' : 'border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'}`}>
                                <input
                                    type="number"
                                    placeholder="Nomor Rekening"
                                    inputMode="numeric"
                                    value={accountNumber}
                                    onChange={(e) => {
                                        setAccountNumber(e.target.value);
                                        setErrors(prev => ({ ...prev, number: undefined }));
                                    }}
                                    className="w-full px-3 py-3 border-0 focus:outline-none focus:ring-0"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <div className={`border flex items-center transition-all ${errors.name ? 'border-red-500' : 'border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'}`}>
                                <input
                                    type="text"
                                    placeholder="Atas Nama Rekening"
                                    value={accountHolderName || ''}
                                    onChange={(e) => {
                                        setAccountHolderName(e.target.value);
                                        setErrors(prev => ({ ...prev, name: undefined }));
                                    }}
                                    className="w-full px-3 py-3 border-0 focus:outline-none focus:ring-0"
                                />
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center px-4 mt-[-15px]'>
                        <SwitchContainer>
                            <Checkbox
                                checked={isPrimary}
                                onChange={(e) => setIsPrimary(e.target.checked)}
                                sx={{
                                    color: '#52357B',
                                    '&.Mui-checked': { color: '#52357B' },
                                }}
                            />
                        </SwitchContainer>
                        <SwitchContainer className='mobile'>
                            <Switch
                                checked={isPrimary}
                                onChange={(e) => setIsPrimary(e.target.checked)}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: '#52357B',
                                        '& + .MuiSwitch-track': { backgroundColor: '#52357B' },
                                    },
                                }}
                            />
                        </SwitchContainer>
                        <p className='text-[16px] font-semibold text-[#333333]'>Tetapkan sebagai alamat utama</p>
                    </div>

                    {errors.submit && <p className="text-sm text-red-600 mb-3 text-center">{errors.submit}</p>}

                    <div className="p-4 bg-[#EEEEEE] h-[70px] rounded-b-lg flex justify-between md:justify-end gap-3 mt-[10px]">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="hidden md:block rounded-[10px] text-[#333333] font-semibold text-[16px] bg-white border border-[#AAAAAA] w-[100px]"
                        >
                            Nanti Saja
                        </button>
                        <button
                            type="submit"
                            className="rounded-[10px] bg-[#563D7C] text-white font-semibold text-[14px] w-[100px] disabled:opacity-50"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBankAccountModal;
