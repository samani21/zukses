import React, { useEffect, useState } from 'react';
import { InformationCircleIcon, XMarkIcon } from './Icon';
import Get from 'services/api/Get';// Asumsi Anda punya service untuk POST
import { Response } from 'services/api/types';

type Banks = {
    name_bank?: string;
    id?: number;
};

type BankAccountData = {
    bank_id: number;
    account_holder_name: string;
    account_number: string;
};


// --- Komponen kecil untuk loading spinner ---
const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

type Props = {
    handleAdd: (data: BankAccountData, id?: number) => Promise<void>;
    onClose: () => void
}

const AddBankAccountModal = ({ onClose, handleAdd }: Props) => {
    // --- State untuk Form dan UI ---
    const [banks, setBanks] = useState<Banks[] | null>(null);
    const [selectedBankId, setSelectedBankId] = useState<number>(0);
    const [accountNumber, setAccountNumber] = useState<string>('');
    const [accountHolderName, setAccountHolderName] = useState<string | null>(null);

    // --- State untuk Loading ---
    const [isCheckingName, setIsCheckingName] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // --- State untuk Error Handling ---
    const [errors, setErrors] = useState<{ bank?: string; number?: string; submit?: string }>({});

    useEffect(() => {
        getBanks();
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const getBanks = async () => {
        try {
            const res = await Get<Response>('zukses', `banks`);
            if (res?.status === 'success' && Array.isArray(res.data)) {
                setBanks(res.data);
            } else {
                console.warn('Data bank tidak ditemukan atau bukan array.');
                setErrors(prev => ({ ...prev, submit: 'Gagal memuat daftar bank.' }));
            }
        } catch (error) {
            console.error('Error fetching banks:', error);
            setErrors(prev => ({ ...prev, submit: 'Terjadi kesalahan saat memuat daftar bank.' }));
        } finally {
        }
    };

    const validateForm = () => {
        const newErrors: { bank?: string; number?: string } = {};
        if (!selectedBankId) {
            newErrors.bank = 'Nama bank wajib dipilih.';
        }
        if (!accountNumber) {
            newErrors.number = 'Nomor rekening wajib diisi.';
        } else if (!/^\d+$/.test(accountNumber)) {
            newErrors.number = 'Nomor rekening hanya boleh berisi angka.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCheckName = async () => {
        if (!validateForm()) return;

        setIsCheckingName(true);
        setAccountHolderName(null); // Reset nama pemilik sebelumnya
        setErrors(prev => ({ ...prev, number: undefined })); // Hapus error nomor rekening
        setAccountHolderName('Testing')
        // try {
        //     // --- GANTI DENGAN API ANDA ---
        //     // Ini adalah simulasi API call untuk mengecek nama pemilik rekening.
        //     // Anda perlu mengganti endpoint 'check-account' dan payload sesuai dengan API Anda.
        //     const res = await Post<Response>('zukses', 'check-account', {
        //         bank_id: selectedBankId,
        //         account_number: accountNumber,
        //     });

        //     if (res?.status === 'success' && res.data?.account_holder_name) {
        //         setAccountHolderName(res.data.account_holder_name);
        //     } else {
        //         setErrors(prev => ({ ...prev, number: res?.message || 'Nomor rekening tidak ditemukan.' }));
        //     }
        // } catch (error) {
        //     console.error("Error checking account name:", error);
        //     setErrors(prev => ({ ...prev, number: 'Gagal memverifikasi nama pemilik.' }));
        // } finally {
        //     setIsCheckingName(false);
        // }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!accountHolderName) {
            setErrors(prev => ({ ...prev, submit: 'Silakan cek nama pemilik terlebih dahulu.' }));
            return;
        }

        setIsSubmitting(true);
        setErrors(prev => ({ ...prev, submit: undefined }));

        const payload = {
            bank_id: selectedBankId,
            account_number: accountNumber,
            account_holder_name: accountHolderName,
        };
        handleAdd(payload);
        // resetForm();
    };

    // Kondisi untuk menonaktifkan tombol submit utama
    const isSubmitDisabled = !accountHolderName || isSubmitting;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Mau tambah rekening apa?</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        {/* --- Input Nama Bank --- */}
                        <div className="relative">
                            <label className="text-xs text-gray-500 bg-white px-1 absolute -top-2 left-3">Nama Bank</label>
                            <select
                                value={selectedBankId}
                                onChange={(e) => {
                                    setSelectedBankId(parseInt(e.target.value));
                                    setAccountHolderName(null); // Reset jika bank diubah
                                    setErrors(prev => ({ ...prev, bank: undefined }));
                                }}
                                className={`w-full border rounded-lg px-3 py-3 focus:outline-none focus:ring-2 ${errors.bank ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                            >
                                <option value="">Pilih Bank</option>
                                {banks?.map((b, i) => (
                                    <option value={b?.id} key={i}>{b?.name_bank}</option>
                                ))}
                            </select>
                            {errors.bank && <p className="text-xs text-red-500 mt-1 ml-1">{errors.bank}</p>}
                        </div>

                        {/* --- Input Nomor Rekening --- */}
                        <div className="relative">
                            <div className={`border rounded-lg flex items-center transition-all ${errors.number ? 'border-red-500' : 'border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'}`}>
                                <div className="relative w-full">
                                    <label className={`text-xs px-1 absolute -top-2 left-3 bg-white ${errors.number ? 'text-red-500' : 'text-gray-500'}`}>Nomor Rekening</label>
                                    <input
                                        type="text"
                                        placeholder="Masukkan nomor rekening"
                                        inputMode="numeric" // Keyboard numerik di mobile
                                        value={accountNumber}
                                        onChange={(e) => {
                                            setAccountNumber(e.target.value);
                                            setAccountHolderName(null); // Reset jika nomor diubah
                                            setErrors(prev => ({ ...prev, number: undefined }));
                                        }}
                                        className="w-full px-3 py-3 border-0 focus:outline-none focus:ring-0 rounded-lg"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCheckName}
                                    disabled={isCheckingName || !selectedBankId || !accountNumber}
                                    className="text-blue-600 font-semibold px-4 text-sm hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                                >
                                    {isCheckingName ? 'Mengecek...' : 'Cek Nama'}
                                </button>
                            </div>
                            {errors.number && <p className="text-xs text-red-500 mt-1 ml-1">{errors.number}</p>}

                            {/* --- Tampilan Nama Pemilik Setelah Verifikasi --- */}
                            {accountHolderName && (
                                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg text-sm">
                                    <span className="font-semibold text-green-800">Nama Pemilik:</span> {accountHolderName}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-b-lg">
                        <div className="flex items-start gap-3 text-sm text-gray-500 mb-4">
                            <InformationCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>Dengan klik tombol di bawah, kamu menyetujui <a href="#" className="text-blue-600 font-semibold">Syarat & Ketentuan</a> serta <a href="#" className="text-blue-600 font-semibold">Kebijakan Privasi</a> untuk menambahkan rekening.</span>
                        </div>

                        {/* --- Pesan Error Submit --- */}
                        {errors.submit && <p className="text-sm text-red-600 mb-3 text-center">{errors.submit}</p>}

                        <button
                            type="submit"
                            disabled={isSubmitDisabled}
                            className="w-full flex justify-center items-center bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting && <Spinner />}
                            {isSubmitting ? 'Menambahkan...' : 'Tambah Rekening'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddBankAccountModal;