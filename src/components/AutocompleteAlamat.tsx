'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    TextField,
    List,
    ListItemButton,
    Typography,
    Tabs,
    Tab,
    Box,
    CircularProgress,
} from '@mui/material';
import Get from 'services/api/Get'; // Pastikan path ini sesuai dengan struktur proyek Anda

// --- TYPE DEFINITIONS ---
// PERBAIKAN: Sarannya adalah agar API 'full-address' mengembalikan data nama dan kode yang relevan.
type AutocompleteOption = {
    label: string;
    code: string;
    compilationID: {
        province_id: number;
        province_name: string; // HARAP API MENGEMBALIKAN INI
        city_id: number;
        city_name: string;     // HARAP API MENGEMBALIKAN INI
        district_id: number;
        district_name: string; // HARAP API MENGEMBALIKAN INI
        postcode_id: number;
        postcode_code: string; // HARAP API MENGEMBALIKAN INI
    };
};

type SimpleOption = {
    label: string;
    code: string;
};

type Option = AutocompleteOption | SimpleOption;

interface Province { id: number; name: string; }
interface City { id: number; name: string; }
interface District { id: number; name: string; }
interface Postcode { id: number; code: string; }

type Props = {
    setFullAddress: (value: string) => void;
    setProv: (value: number) => void;
    setCity: (value: number) => void;
    setDistrict: (value: number) => void;
    setPostCode: (value: number) => void;
    dataFullAddress?: string;
    openModalAddAddress?: boolean;
    isEdit?: boolean;
    provinces: string;
    cities: string;
    subdistricts: string;
    postal_codes: string;
    province_id: number;
    citie_id: number;
    subdistrict_id: number;
    postal_code_id: number;
};

// --- TYPE GUARD ---
function isAutocompleteOption(option: Option): option is AutocompleteOption {
    return option !== undefined && typeof option === 'object' && 'compilationID' in option;
}

// --- REACT COMPONENT ---
const AutocompleteAddress = ({
    setFullAddress,
    setProv,
    setCity,
    setDistrict,
    setPostCode,
    dataFullAddress,
    openModalAddAddress,
    isEdit,
    provinces,
    cities,
    subdistricts,
    postal_codes,
    province_id,
    citie_id,
    subdistrict_id,
    postal_code_id,
}: Props) => {
    // --- STATE MANAGEMENT ---
    const [inputValue, setInputValue] = useState('');
    const [debouncedInputValue, setDebouncedInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState<{ id: number; name: string } | null>(null);
    const [selectedCity, setSelectedCity] = useState<{ id: number; name: string } | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<{ id: number; name: string } | null>(null);
    // PERBAIKAN: Tambahkan state untuk kode pos yang dipilih agar lebih konsisten
    const [selectedPostcode, setSelectedPostcode] = useState<{ id: number; code: string } | null>(null);
    const [options, setOptions] = useState<Option[]>([]);
    const [useTabMode, setUseTabMode] = useState(false);
    const [inputFullAddress, setInputFUllAddress] = useState<string>('');
    // --- REFS ---
    const inputRef = useRef<HTMLInputElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const skipNextDebounce = useRef(false);

    // --- HOOKS ---
    useEffect(() => {
        const handler = setTimeout(() => {
            if (skipNextDebounce.current) {
                skipNextDebounce.current = false;
                return;
            }
            if (inputValue.trim() === '') {
                setDebouncedInputValue('');
                setTab(0);
                setSelectedProvince(null);
                setSelectedCity(null);
                setSelectedDistrict(null);
                setSelectedPostcode(null);
            } else {
                setDebouncedInputValue(inputValue);
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [inputValue]);

    useEffect(() => {
        if (isFocused) {
            fetchOptions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused, tab, selectedProvince, selectedCity, selectedDistrict, debouncedInputValue]);
    useEffect(() => {
        if (isEdit) {
            setSelectedProvince({ id: province_id, name: provinces });
            setSelectedCity({ id: citie_id, name: cities });
            setSelectedDistrict({ id: subdistrict_id, name: subdistricts });
            setSelectedPostcode({ id: postal_code_id, code: postal_codes });
            setInputFUllAddress(dataFullAddress ?? '')
            setTab(3);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit]);

    useEffect(() => {
        if (!openModalAddAddress && dataFullAddress) {
            setInputValue(dataFullAddress);
        }
    }, [openModalAddAddress, dataFullAddress]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
                if (dataFullAddress) {
                    setInputValue(dataFullAddress);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dataFullAddress]);

    useEffect(() => {
        if (dataFullAddress) {
            setInputValue(dataFullAddress);
        } else {
            setInputValue('');
            setSelectedProvince(null);
            setSelectedCity(null);
            setSelectedDistrict(null);
            setSelectedPostcode(null);
            setTab(0);
        }
    }, [dataFullAddress]);

    // --- DATA FETCHING ---
    const fetchOptions = () => {
        let cancelled = false;

        const currentFetch = async () => {
            try {
                setLoading(true);

                // PERBAIKAN: Kondisi ini dibuat lebih akurat dengan membandingkan dengan alamat yang sudah tersusun
                const constructedAddress = getFullLabel(selectedProvince?.name, selectedCity?.name, selectedDistrict?.name, selectedPostcode?.code);

                if (debouncedInputValue.trim() && debouncedInputValue !== constructedAddress) {
                    const res = await Get<{ data: { data: Option[] } }>('zukses', `full-address?search=${debouncedInputValue}`);
                    if (!cancelled && res) setOptions(res.data?.data || []);
                } else if (tab === 0) {
                    const res = await Get<{ data: Province[] }>('zukses', `master/province?page_size=1000`);
                    if (!cancelled && res) {
                        setOptions(res.data.map(p => ({ label: p.name, code: p.id.toString() })));
                    }
                } else if (tab === 1 && selectedProvince) {
                    const res = await Get<{ data: City[] }>('zukses', `master/city?page_size=1000&province=${selectedProvince.id}`);
                    if (!cancelled && res) {
                        setOptions(res.data.map(c => ({ label: c.name, code: c.id.toString() })));
                    }
                } else if (tab === 2 && selectedCity) {
                    const res = await Get<{ data: District[] }>('zukses', `master/subdistrict?page_size=1000&city=${selectedCity.id}`);
                    if (!cancelled && res) {
                        setOptions(res.data.map(d => ({ label: d.name, code: d.id.toString() })));
                    }
                } else if (tab === 3 && selectedDistrict) {
                    const res = await Get<{ data: Postcode[] }>('zukses', `master/postal_code?page_size=1000&subdistrict_id=${selectedDistrict.id}`);
                    if (!cancelled && res) {
                        setOptions(res.data.map(p => ({ label: p.code, code: p.id.toString() })));
                    }
                } else {
                    if (!cancelled) setOptions([]);
                }
            } catch (err) {
                console.error('Failed to fetch options:', err);
                if (!cancelled) setOptions([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        currentFetch();
        return () => {
            cancelled = true;
        };
    };

    // --- HELPER FUNCTIONS ---
    const getFullLabel = (province?: string, city?: string, district?: string, postcode?: string) => {
        return [province, city, district, postcode].filter(Boolean).join(', ');
    };

    const escapeRegExp = (str: string) => {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const renderHighlightedText = (text: string, highlight: string) => {
        const trimmedHighlight = highlight.trim();
        if (!trimmedHighlight || debouncedInputValue !== inputValue) {
            return <span>{text}</span>;
        }
        const escapedHighlight = escapeRegExp(trimmedHighlight);
        const regex = new RegExp(`(${escapedHighlight})`, 'gi');
        const parts = text.split(regex);
        return (
            <span>
                {parts.map((part, index) =>
                    part.toLowerCase() === trimmedHighlight.toLowerCase() ? (
                        <strong key={index} style={{ color: 'black' }}>{part}</strong>
                    ) : (
                        part
                    )
                )}
            </span>
        );
    };

    // --- EVENT HANDLERS ---
    // PERBAIKAN: Logika `handleSelect` dirombak untuk menangani autocomplete dan tab dengan benar.
    // Ganti keseluruhan fungsi handleSelect Anda dengan ini
    // Ganti sekali lagi fungsi handleSelect Anda dengan versi final ini
    const handleSelect = (step: number, code: string, label: string, option?: Option) => {
        skipNextDebounce.current = true;

        // Handle selection dari pencarian alamat lengkap (autocomplete)
        if (option && isAutocompleteOption(option)) {
            const {
                province_id, province_name,
                city_id, city_name,
                district_id, district_name,
                postcode_id, postcode_code
            } = option.compilationID;

            // 1. Update semua state yang diperlukan (ID dan Objek)
            setProv(province_id);
            setCity(city_id);
            setDistrict(district_id);
            setPostCode(postcode_id);
            setSelectedProvince({ id: province_id, name: province_name });
            setSelectedCity({ id: city_id, name: city_name });
            setSelectedDistrict({ id: district_id, name: district_name });
            setSelectedPostcode({ id: postcode_id, code: postcode_code });

            // 2. Update nilai input
            setInputValue(option.label);
            setFullAddress(option.label);
            setInputFUllAddress(option.label);
            setUseTabMode(false);
            // 3. Update state tab ke langkah terakhir (ini penting untuk saat dropdown dibuka kembali)
            setTab(3);
            setDebouncedInputValue('');

            // --- PERBAIKAN UTAMA DI SINI ---
            // 4. Kembalikan baris ini untuk menutup dropdown (menghilangkan fokus) secara otomatis
            setIsFocused(false);
            inputRef.current?.blur();
            return;
        }
        const provinsi = inputFullAddress.split(',').slice(0, 1).map(s => s.trim()).join(', ');
        const kota = inputFullAddress.split(',').slice(1, 2).map(s => s.trim()).join(', ');
        const kecamatan = inputFullAddress.split(',').slice(2, 3).map(s => s.trim()).join(', ');

        // Handle selection dari Tabs (logika ini tetap sama)
        if (step === 0) { // Province
            setSelectedProvince({ id: +code, name: label });
            setProv(+code);
            setSelectedCity(null);
            setSelectedDistrict(null);
            setSelectedPostcode(null);
            setCity(0);
            setDistrict(0);
            setPostCode(0);
            setTab(1);
            setInputValue(label);
        } else if (step === 1) { // City
            setSelectedCity({ id: +code, name: label });
            setCity(+code);
            setSelectedDistrict(null);
            setSelectedPostcode(null);
            setDistrict(0);
            setPostCode(0);
            setTab(2);
            setInputValue(getFullLabel(selectedProvince?.name || provinsi, label));
        } else if (step === 2) { // District
            setSelectedDistrict({ id: +code, name: label?.toUpperCase() });
            setDistrict(+code);
            setSelectedPostcode(null);
            setPostCode(0);
            setTab(3);
            setInputValue(getFullLabel(selectedProvince?.name || provinsi, selectedCity?.name || kota, label?.toUpperCase()));
        } else if (step === 3) { // Postcode
            setSelectedPostcode({ id: +code, code: label });
            setPostCode(+code);

            const full = getFullLabel(selectedProvince?.name ?? provinsi, selectedCity?.name ?? kota, selectedDistrict?.name ?? kecamatan, label);
            setInputFUllAddress(full)
            setFullAddress(full);
            setIsFocused(false);
            setInputValue(full)
            inputRef.current?.blur();
            // if (inputFullAddress) {
            //     const provinsi = inputFullAddress.split(',').slice(0, 1).map(s => s.trim()).join(', ');
            //     const kota = inputFullAddress.split(',').slice(0, 2).map(s => s.trim()).join(', ');
            //     const kecamatan = inputFullAddress.split(',').slice(0, 3).map(s => s.trim()).join(', ');
            //     const inputNew = provinsi + ', ' + kota + ', ' + kecamatan + ', ' + label
            //     setFullAddress(inputNew);
            // }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        // Jika sebelumnya hasil autocomplete, lalu diubah manual → beralih ke mode tab
        if (!useTabMode) {
            setUseTabMode(true);
            setDebouncedInputValue(''); // kosongkan agar pakai tab
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
        // Hapus debounced value saat fokus agar beralih ke mode Tab
        // Jika state (selectedProvince, dll.) sudah terisi, tab akan berada di posisi yang benar.
        setDebouncedInputValue('');
    };

    // --- RENDER ---
    return (
        <Box sx={{ position: 'relative', marginTop: "-15px" }} ref={containerRef}>
            <TextField
                fullWidth
                variant="outlined"
                label="Provinsi, Kota, Kecamatan, Kode Pos"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleFocus}
                inputRef={inputRef}
                autoComplete="off"
            />

            {loading && !debouncedInputValue && isFocused && (
                <CircularProgress
                    size={20}
                    sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}
                />
            )}

            {isFocused && (
                <Box
                    sx={{
                        position: 'absolute',
                        zIndex: 1200,
                        width: '100%',
                        bgcolor: 'background.paper',
                        border: '1px solid #ddd',
                        borderRadius: 1,
                        mt: 1,
                        boxShadow: 3,
                    }}
                >
                    {/* Tampilkan Tabs hanya jika tidak dalam mode pencarian aktif */}
                    {!debouncedInputValue && (
                        <Tabs
                            value={tab}
                            onChange={(_, newTab) => setTab(newTab)}
                            variant="fullWidth"
                        >
                            <Tab label="Provinsi" sx={{ color: selectedProvince ? 'primary.main' : 'inherit', fontWeight: selectedProvince ? 'bold' : 'normal' }} />
                            <Tab label="Kota" disabled={!selectedProvince} sx={{ color: selectedCity ? 'primary.main' : 'inherit', fontWeight: selectedCity ? 'bold' : 'normal' }} />
                            <Tab label="Kecamatan" disabled={!selectedCity} sx={{ color: selectedDistrict ? 'primary.main' : 'inherit', fontWeight: selectedDistrict ? 'bold' : 'normal' }} />
                            <Tab label="Kode Pos" disabled={!selectedDistrict} sx={{ color: selectedDistrict ? 'primary.main' : 'inherit', fontWeight: selectedDistrict ? 'bold' : 'normal' }} />
                        </Tabs>
                    )}

                    <List sx={{ maxHeight: 200, overflowY: 'auto', p: 0 }}>
                        {loading && debouncedInputValue ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                <CircularProgress size={24} />
                            </Box>
                        ) : options?.length > 0 ? (
                            options.map((option, idx) => {
                                // Tentukan tab saat ini berdasarkan mode (pencarian atau tab)
                                const currentStep = debouncedInputValue ? (isAutocompleteOption(option) ? 4 : 0) : tab;

                                return (
                                    <ListItemButton
                                        key={`${option.code}-${idx}`}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleSelect(currentStep, option.code, option.label, option);
                                        }}
                                    >
                                        <Typography component="div">
                                            {renderHighlightedText(option.label.toUpperCase(), inputValue.toUpperCase())}
                                        </Typography>
                                    </ListItemButton>
                                );
                            })
                        ) : (
                            <Typography sx={{ p: 2 }} variant="body2" color="text.secondary">
                                {loading ? 'Memuat...' : 'Data tidak ditemukan'}
                            </Typography>
                        )}
                    </List>
                </Box>
            )}
        </Box>
    );
};

export default AutocompleteAddress;