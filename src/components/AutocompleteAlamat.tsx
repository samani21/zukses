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
type AutocompleteOption = {
    label: string;
    code: string;
    compilationID: {
        province_id: number;
        city_id: number;
        district_id: number;
        postcode_id: number;
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
    openModalAddAddress
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
    const [options, setOptions] = useState<Option[]>([]);
    const [placeholder, setPlaceholder] = useState<string>('');
    // --- REFS ---
    const inputRef = useRef<HTMLInputElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const skipNextDebounce = useRef(false);

    // --- HOOKS ---
    useEffect(() => {
        const handler = setTimeout(() => {
            if (inputValue.trim() === '') {
                setDebouncedInputValue('');
                setTab(0);
            } else if (!skipNextDebounce.current) {
                setDebouncedInputValue(inputValue);
            }
            skipNextDebounce.current = false;
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
        if (!openModalAddAddress) {
            setInputValue(dataFullAddress || '');
        }
    }, [openModalAddAddress, dataFullAddress]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
                // Jika klik di luar dan input kosong, kembalikan nilai dari placeholder
                if (!inputValue && placeholder) {
                    setInputValue(placeholder);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [inputValue, placeholder]);

    useEffect(() => {
        if (dataFullAddress) {
            setInputValue(dataFullAddress);
        } else {
            setInputValue('');
        }
    }, [dataFullAddress]);


    // --- DATA FETCHING ---
    const fetchOptions = () => {
        let cancelled = false;

        const currentFetch = async () => {
            try {
                setLoading(true);

                if (debouncedInputValue.trim()) {
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
    const getFullLabel = (
        province?: string,
        city?: string,
        district?: string,
        postcode?: string
    ) => {
        return [province, city, district, postcode].filter(Boolean).join(', ');
    };

    const escapeRegExp = (str: string) => {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const renderHighlightedText = (text: string, highlight: string) => {
        const trimmedHighlight = highlight.trim();
        if (!trimmedHighlight) {
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
    const handleSelect = (step: number, code: string, label: string, option?: Option) => {
        skipNextDebounce.current = true;

        if (option && isAutocompleteOption(option)) {
            const { province_id, city_id, district_id, postcode_id } = option.compilationID;
            const full = label;

            setProv(province_id);
            setCity(city_id);
            setDistrict(district_id);
            setPostCode(postcode_id);

            setInputValue(full);
            setFullAddress(full);

            setIsFocused(false);
            inputRef.current?.blur();
            return;
        }

        if (step === 0) { // Province
            setSelectedProvince({ id: +code, name: label });
            setSelectedCity(null);
            setSelectedDistrict(null);
            setTab(1);
            setInputValue(label);
            setProv(+code);
        } else if (step === 1) { // City
            setSelectedCity({ id: +code, name: label });
            setSelectedDistrict(null);
            setTab(2);
            setCity(+code);
            setInputValue(getFullLabel(selectedProvince?.name, label));
        } else if (step === 2) { // District
            setSelectedDistrict({ id: +code, name: label });
            setTab(3);
            setDistrict(+code);
            setInputValue(getFullLabel(selectedProvince?.name, selectedCity?.name, label));
        } else if (step === 3) { // Postcode
            setPostCode(+code);
            const full = getFullLabel(selectedProvince?.name, selectedCity?.name, selectedDistrict?.name, label);
            setInputValue(full);
            setFullAddress(full);
            setIsFocused(false);
            inputRef.current?.blur();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    // --- RENDER ---
    return (
        <Box sx={{ position: 'relative' }} ref={containerRef}>
            <TextField
                fullWidth
                variant="outlined"
                label="Provinsi, Kota, Kecamatan, Kode Pos"
                value={inputValue}
                onChange={handleInputChange}
                inputRef={inputRef}
                placeholder={placeholder}
                onFocus={() => {
                    setIsFocused(true);
                    // Simpan nilai saat ini sebagai placeholder sebelum dikosongkan
                    if (inputValue) {
                        setPlaceholder(inputValue);
                    }
                    // Selalu kosongkan input dan reset state saat fokus
                    setInputValue('');
                    setTab(0);
                    setSelectedProvince(null);
                    setSelectedCity(null);
                    setSelectedDistrict(null);
                }}
            />

            {loading && !debouncedInputValue && (
                <CircularProgress
                    size={20}
                    sx={{ position: 'absolute', top: 16, right: 16 }}
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
                    {!debouncedInputValue && (
                        <Tabs
                            value={tab}
                            onChange={(_, newTab) => setTab(newTab)}
                            variant="fullWidth"
                        >
                            <Tab label="Provinsi" />
                            <Tab label="Kota" disabled={!selectedProvince} />
                            <Tab label="Kecamatan" disabled={!selectedCity} />
                            <Tab label="Kode Pos" disabled={!selectedDistrict} />
                        </Tabs>
                    )}

                    <List sx={{ maxHeight: 200, overflowY: 'auto', p: 0 }}>
                        {loading && debouncedInputValue ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                <CircularProgress size={24} />
                            </Box>
                        ) : options?.length > 0 ? (
                            options.map((option, idx) => (
                                <ListItemButton
                                    key={`${option.code}-${idx}`}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleSelect(tab, option.code, option.label, option);
                                    }}
                                >
                                    <Typography component="div">
                                        {renderHighlightedText(option.label, debouncedInputValue)}
                                    </Typography>
                                </ListItemButton>
                            ))
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