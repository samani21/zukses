'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    TextField,
    List,
    ListItemButton,
    ListItemText, // Pastikan ListItemText diimpor
    Typography,
    Tabs,
    Tab,
    Box,
    CircularProgress,
    useMediaQuery,
    Dialog,
    AppBar,
    Toolbar,
    IconButton,
    InputAdornment,
    Button,
    Stack,
    useTheme
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import CloseIcon from '@mui/icons-material/Close';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Get from 'services/api/Get';

// --- TYPE DEFINITIONS & PROPS (Tidak ada perubahan) ---
type AutocompleteOption = {
    label: string;
    code: string;
    compilationID: {
        province_id: number;
        province_name: string;
        city_id: number;
        city_name: string;
        district_id: number;
        district_name: string;
        postcode_id: number;
        postcode_code: string;
    };
};
type SimpleOption = { label: string; code: string; };
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
    // State dari kode asli Anda (dipertahankan)
    const [inputValue, setInputValue] = useState(dataFullAddress || '');
    const [debouncedInputValue, setDebouncedInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState<{ id: number; name: string } | null>(null);
    const [selectedCity, setSelectedCity] = useState<{ id: number; name: string } | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<{ id: number; name: string } | null>(null);
    const [selectedPostcode, setSelectedPostcode] = useState<{ id: number; code: string } | null>(null);
    const [options, setOptions] = useState<Option[]>([]);
    const [useTabMode, setUseTabMode] = useState(false);
    const [inputFullAddress, setInputFUllAddress] = useState<string>('');
    const [provId, setProvId] = useState<number>(0);
    const [cityId, setCityId] = useState<number>(0);
    const [destrictd, setDestrictd] = useState<number>(0);
    const [codePos, setCodePos] = useState<number>(0);
    // State tambahan khusus untuk mobile
    const [mobileViewOpen, setMobileViewOpen] = useState(false);
    const [mobileSearchQuery, setMobileSearchQuery] = useState('');
    const [debouncedMobileQuery, setDebouncedMobileQuery] = useState('');

    // REFS
    const containerRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const skipNextDebounce = useRef(false);
    // Deteksi Perangkat
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // --- HOOKS ---
    useEffect(() => {
        const handler = setTimeout(() => {
            if (isMobile) {
                setDebouncedMobileQuery(mobileSearchQuery);
            } else {
                if (skipNextDebounce.current) { skipNextDebounce.current = false; return; }
                if (inputValue.trim() === '') {
                    setDebouncedInputValue('');
                    setTab(0);
                    setSelectedProvince(null);
                    setSelectedCity(null);
                    setSelectedDistrict(null);
                    setSelectedPostcode(null);
                }
                else { setDebouncedInputValue(inputValue); }
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [inputValue, mobileSearchQuery, isMobile]);
    useEffect(() => {
        if (dataFullAddress) {

            const provinsi = dataFullAddress.split(',').slice(0, 1).map(s => s.trim()).join(', ');
            const kota = dataFullAddress.split(',').slice(1, 2).map(s => s.trim()).join(', ');
            const kecamatan = dataFullAddress.split(',').slice(2, 3).map(s => s.trim()).join(', ');
            const kodePos = dataFullAddress.split(',').slice(3).map(s => s.trim()).join(', ');
            // setMobileSearchQuery(dataFullAddress)
            setTab(3);
            setSelectedProvince({ id: provId, name: provinsi });
            setSelectedCity({ id: cityId, name: kota });
            setSelectedDistrict({ id: destrictd, name: kecamatan });
            setSelectedPostcode({ id: codePos, code: kodePos });
        }
    }, [dataFullAddress]);

    useEffect(() => {
        if (isEdit) {
            setSelectedProvince({ id: province_id, name: provinces });
            setSelectedCity({ id: citie_id, name: cities });
            setSelectedDistrict({ id: subdistrict_id, name: subdistricts });
            setSelectedPostcode({ id: postal_code_id, code: postal_codes });
            setInputFUllAddress(dataFullAddress ?? '');
            setInputValue(dataFullAddress ?? '');
            setTab(3);
        }
    }, [isEdit, province_id, provinces, citie_id, cities, subdistrict_id, subdistricts, postal_code_id, postal_codes, dataFullAddress]);

    useEffect(() => {
        if (dataFullAddress) { setInputValue(dataFullAddress); }
        else { setInputValue(''); setSelectedProvince(null); setSelectedCity(null); setSelectedDistrict(null); setSelectedPostcode(null); setTab(0); }
    }, [dataFullAddress]);

    useEffect(() => {
        if (isMobile) { if (mobileViewOpen) fetchOptions(); }
        else { if (isFocused) fetchOptions(); }
    }, [isFocused, mobileViewOpen, tab, selectedProvince, selectedCity, selectedDistrict, debouncedInputValue, debouncedMobileQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
                if (dataFullAddress) setInputValue(dataFullAddress);
            }
        };
        if (!isMobile) { document.addEventListener('mousedown', handleClickOutside); }
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, [dataFullAddress, isMobile]);


    // --- DATA FETCHING (Disesuaikan untuk kedua platform) ---
    const fetchOptions = async () => {
        setLoading(true);
        const query = isMobile ? debouncedMobileQuery : debouncedInputValue;
        const constructedAddress = getFullLabel(selectedProvince?.name, selectedCity?.name, selectedDistrict?.name, selectedPostcode?.code);
        try {
            if (query.trim() && query !== constructedAddress) {
                const res = await Get<{ data: { data: Option[] } }>('zukses', `full-address?search=${query}`);
                if (res) setOptions(res.data?.data || []);
            } else if (tab === 0) {
                const res = await Get<{ data: Province[] }>('zukses', `master/province?page_size=1000`); if (res) setOptions(res.data.map(p => ({ label: p.name, code: p.id.toString() })));
            } else if (tab === 1 && selectedProvince) {
                const res = await Get<{ data: City[] }>('zukses', `master/city?page_size=1000&province=${selectedProvince.id}`);
                if (res) setOptions(res.data.map(c => ({ label: c.name, code: c.id.toString() })));
            } else if (tab === 2 && selectedCity) {
                const res = await Get<{ data: District[] }>('zukses', `master/subdistrict?page_size=1000&city=${selectedCity.id}`);
                if (res) setOptions(res.data.map(d => ({ label: d.name, code: d.id.toString() })));
            } else if (tab === 3 && selectedDistrict) {
                const res = await Get<{ data: Postcode[] }>('zukses', `master/postal_code?page_size=1000&subdistrict_id=${selectedDistrict.id}`);
                if (res) setOptions(res.data.map(p => ({ label: p.code, code: p.id.toString() })));
            } else {
                setOptions([]);
            }
        } catch (err) {
            console.error('Failed to fetch options:', err);
            setOptions([]);
        }
        finally {
            setLoading(false);

        }
    };

    // --- FUNGSI ASLI ANDA (Tidak Diubah) ---
    const getFullLabel = (province?: string, city?: string, district?: string, postcode?: string) => [province, city, district, postcode].filter(Boolean).join(', ');
    const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const renderHighlightedText = (text: string, highlight: string) => {
        const trimmedHighlight = highlight.trim();
        if (!trimmedHighlight || debouncedInputValue !== inputValue) {
            return <span>{text}</span>;
        } const escapedHighlight = escapeRegExp(trimmedHighlight);
        const regex = new RegExp(`(${escapedHighlight})`, 'gi');
        const parts = text.split(regex);
        return (<span>{parts.map((part, index) => part.toLowerCase() === trimmedHighlight.toLowerCase() ? (<strong key={index} style={{ color: 'black' }}>{part}</strong>) : (part))}</span>);
    };

    const handleSelect = (step: number, code: string, label: string, option?: Option) => {
        skipNextDebounce.current = true;
        if (option && isAutocompleteOption(option)) {
            const { province_id, province_name, city_id, city_name, district_id, district_name, postcode_id, postcode_code } = option.compilationID;
            setProv(province_id);
            setCity(city_id);
            setDistrict(district_id);
            setPostCode(postcode_id);
            setSelectedProvince({ id: province_id, name: province_name });
            setSelectedCity({ id: city_id, name: city_name });
            setSelectedDistrict({ id: district_id, name: district_name });
            setSelectedPostcode({ id: postcode_id, code: postcode_code });
            setInputValue(option.label);
            setFullAddress(option.label);
            setInputFUllAddress(option.label);
            setUseTabMode(false);
            setTab(3);
            setDebouncedInputValue('');
            setIsFocused(false);
            inputRef.current?.blur();
            return;
        }
        const provinsi = inputFullAddress.split(',').slice(0, 1).map(s => s.trim()).join(', ');
        const kota = inputFullAddress.split(',').slice(1, 2).map(s => s.trim()).join(', ');
        const kecamatan = inputFullAddress.split(',').slice(2, 3).map(s => s.trim()).join(', ');
        if (step === 0) {
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
        } else if (step === 1) {
            setSelectedCity({ id: +code, name: label });
            setCity(+code);
            setSelectedDistrict(null);
            setSelectedPostcode(null);
            setDistrict(0);
            setPostCode(0);
            setTab(2);
            setInputValue(getFullLabel(selectedProvince?.name || provinsi, label));
        } else if (step === 2) {
            setSelectedDistrict({ id: +code, name: label?.toUpperCase() });
            setDistrict(+code);
            setSelectedPostcode(null);
            setPostCode(0);
            setTab(3);
            setInputValue(getFullLabel(selectedProvince?.name || provinsi, selectedCity?.name || kota, label?.toUpperCase()));
        } else if (step === 3) {
            setSelectedPostcode({ id: +code, code: label });
            setPostCode(+code);
            const full = getFullLabel(selectedProvince?.name ?? provinsi, selectedCity?.name ?? kota, selectedDistrict?.name ?? kecamatan, label);
            setInputFUllAddress(full);
            setFullAddress(full);
            setIsFocused(false);
            setInputValue(full);
            inputRef.current?.blur();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        if (!useTabMode) {
            setUseTabMode(true);
            setDebouncedInputValue('');

        }
    };

    const handleFocus = () => {
        setIsFocused(true);
        setDebouncedInputValue('');

    };


    // --- FUNGSI BARU (Hanya Untuk Mobile) ---
    const resetSelection = () => {
        setTab(0);
        setSelectedProvince(null);
        setSelectedCity(null);
        setSelectedDistrict(null);
        setSelectedPostcode(null);
        setMobileSearchQuery('');
    };

    const handleMobileSelect = (option: Option) => {
        if (isAutocompleteOption(option)) {
            const { compilationID: id } = option;
            console.log('option', option)
            const full = getFullLabel(option?.label);
            setFullAddress(full);
            setInputValue(full);
            setMobileSearchQuery(full);
            setProvId(option?.compilationID?.province_id);
            setCityId(option?.compilationID?.city_id);
            setDestrictd(option?.compilationID?.district_id);
            setCodePos(option?.compilationID?.postcode_id);
            setCity(id.city_id);
            setProv(id.city_id);
            setDistrict(id.district_id);
            setPostCode(id.postcode_id);
            setMobileViewOpen(false);
            setIsFocused(false)
            resetSelection();
            return;
        }
        const { code, label } = option;

        if (tab === 0) {
            setSelectedProvince({ id: +code, name: label });
            setProv(+code)
            setProvId(+code);
            setTab(1);
        }
        else if (tab === 1) {
            setSelectedCity({ id: +code, name: label });
            setCity(+code);
            setCityId(+code);
            setTab(2);
        }
        else if (tab === 2) {
            setSelectedDistrict({ id: +code, name: label.toUpperCase() });
            setDistrict(+code);
            setDestrictd(+code);
            setTab(3);
        }
        else if (tab === 3) {
            const full = getFullLabel(selectedProvince?.name, selectedCity?.name, selectedDistrict?.name, label);

            setFullAddress(full);
            setInputValue(full);
            setPostCode(+code);
            setCodePos(+code);

            setMobileViewOpen(false);
            setIsFocused(false)

        }
        // setMobileSearchQuery('');

    };

    const getMobileTitle = () => {
        if (debouncedMobileQuery) return "Hasil Pencarian";
        switch (tab) {
            case 0: return "Pilih Provinsi";
            case 1: return "Pilih Kota/Kabupaten";
            case 2: return "Pilih Kecamatan";
            case 3: return "Pilih Kode Pos";
            default: return "Pilih Lokasi";

        }
    };

    const handleUseCurrentLocation = async () => alert("Fitur 'Gunakan Lokasi Saat Ini' perlu diimplementasikan.");


    // --- RENDER ---
    if (isMobile) {
        // Tampilan Mobile dengan Dialog
        return (
            !isFocused ? <TextField
                fullWidth
                variant="outlined"
                label="Provinsi, Kota, Kecamatan, Kode Pos"
                value={inputValue}
                onClick={() => {
                    setMobileViewOpen(true)
                    setIsFocused(true)
                }}
                onFocus={() => {
                    setMobileViewOpen(true)
                    setIsFocused(true)
                }}
                InputProps={{ readOnly: true }}
                sx={{ marginTop: "-15px" }} /> : <>
                <Dialog
                    fullScreen
                    open={mobileViewOpen}
                    onClose={() => setMobileViewOpen(false)}>
                    <AppBar sx={{ position: 'sticky', background: "white", boxShadow: "none", paddingTop: "10px" }}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={() => setIsFocused(false)}>
                                <ArrowBackIcon sx={{ color: "black" }} />
                            </IconButton>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Cari Kota, Kecamatan, atau Kode Pos"
                                value={mobileSearchQuery}
                                onChange={(e) => setMobileSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>),
                                    endAdornment: mobileSearchQuery ? (
                                        <InputAdornment position="end">
                                            <IconButton size="small" onClick={() => setMobileSearchQuery('')}>
                                                <CloseIcon />
                                            </IconButton>
                                        </InputAdornment>) : null
                                }} />
                        </Toolbar>
                    </AppBar>
                    {!debouncedMobileQuery && (
                        <Box sx={{ p: 2, bgcolor: '#fafafa' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography
                                    variant="body2"
                                    fontWeight="bold"
                                    color="text.secondary">
                                    Lokasi Terpilih
                                </Typography>
                                <Button
                                    size="small"
                                    onClick={resetSelection}
                                    sx={{ color: 'text.secondary' }}>
                                    Atur Ulang
                                </Button>
                            </Box>
                            <Stack
                                spacing={2}
                                sx={{ position: 'relative' }}>
                                <Box
                                    sx={{ position: 'absolute', top: '6px', bottom: '6px', left: '5.5px', width: '2px', bgcolor: 'grey.200', zIndex: 0 }} />
                                {selectedProvince && (
                                    <div onClick={() => {
                                        setTab(0)
                                        setSelectedProvince(null)
                                        setSelectedPostcode(null)
                                        setSelectedCity(null)
                                        setSelectedDistrict(null)
                                    }}>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={1.5}
                                            sx={{ position: 'relative', zIndex: 1, bgcolor: '#fafafa' }}>
                                            <FiberManualRecordIcon
                                                sx={{ color: 'grey.400', fontSize: '12px' }} />
                                            <Typography
                                                variant="body2">
                                                {selectedProvince.name.toUpperCase()}
                                            </Typography>
                                        </Stack>
                                    </div>)}
                                {selectedCity && (
                                    <div onClick={() => {
                                        setTab(1)
                                        setSelectedCity(null)
                                        setSelectedPostcode(null)
                                        setSelectedDistrict(null)
                                    }}>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={1.5}
                                            sx={{ position: 'relative', zIndex: 1, bgcolor: '#fafafa' }}>
                                            <FiberManualRecordIcon
                                                sx={{ color: 'grey.400', fontSize: '12px' }} />
                                            <Typography
                                                variant="body2">
                                                {selectedCity.name.toUpperCase()}
                                            </Typography>
                                        </Stack>
                                    </div>
                                )}
                                {selectedDistrict && (
                                    <div onClick={() => {
                                        setTab(2)
                                        setSelectedDistrict(null)
                                        setSelectedPostcode(null)
                                    }}>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={1.5}
                                            sx={{ position: 'relative', zIndex: 1, bgcolor: '#fafafa' }}>
                                            <FiberManualRecordIcon
                                                sx={{ color: 'grey.400', fontSize: '12px' }} />
                                            <Typography variant="body2">
                                                {selectedDistrict.name.toUpperCase()}
                                            </Typography>
                                        </Stack>
                                    </div>
                                )}
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1.5}
                                    sx={{ position: 'relative', zIndex: 1, bgcolor: '#fafafa' }}>
                                    <FiberManualRecordIcon
                                        color="error" sx={{ fontSize: '12px' }} />
                                    <Typography
                                        variant="body2"
                                        color="error"
                                        fontWeight="bold">
                                        {getMobileTitle()}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Box>
                    )}
                    <Box
                        sx={{ flex: 1, overflowY: 'auto' }}>
                        {tab === 0 && !debouncedMobileQuery && (
                            <ListItemButton
                                onClick={handleUseCurrentLocation}>
                                <MyLocationIcon
                                    sx={{ mr: 1.5, color: 'primary.main' }} />
                                <ListItemText
                                    primary="Gunakan Lokasi Saat Ini"
                                    primaryTypographyProps={{ color: 'primary.main', fontWeight: 'bold' }} /></ListItemButton>
                        )}
                        {loading ? (
                            <Box
                                sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                <CircularProgress />
                            </Box>) : (
                            <List sx={{ pt: 0 }}>{options.map((option, index) => (
                                <ListItemButton key={`${option.code}-${index}`} onClick={() => handleMobileSelect(option)}>
                                    {/* ===== PERBAIKAN ERROR DI SINI ===== */}
                                    <ListItemText primary={String(option.label || '').toUpperCase()} />
                                </ListItemButton>
                            ))}</List>
                        )}
                    </Box>
                </Dialog >
            </>
        );
    }

    // Tampilan Desktop (Kode Asli Anda, tidak diubah)
    return (
        <Box sx={{ position: 'relative', marginTop: "-15px" }} ref={containerRef}>
            <TextField fullWidth variant="outlined" label="Provinsi, Kota, Kecamatan, Kode Pos" value={inputValue} onChange={handleInputChange} onFocus={handleFocus} inputRef={inputRef} autoComplete="off" />
            {loading && !debouncedInputValue && isFocused && (<CircularProgress size={20} sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }} />)}
            {isFocused && (
                <Box sx={{ position: 'absolute', zIndex: 1200, width: '100%', bgcolor: 'background.paper', border: '1px solid #ddd', borderRadius: 1, mt: 1, boxShadow: 3 }}>
                    {!debouncedInputValue && (
                        <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)} variant="fullWidth">
                            <Tab label="Provinsi" sx={{ color: selectedProvince ? 'primary.main' : 'inherit', fontWeight: selectedProvince ? 'bold' : 'normal' }} />
                            <Tab label="Kota" disabled={!selectedProvince} sx={{ color: selectedCity ? 'primary.main' : 'inherit', fontWeight: selectedCity ? 'bold' : 'normal' }} />
                            <Tab label="Kecamatan" disabled={!selectedCity} sx={{ color: selectedDistrict ? 'primary.main' : 'inherit', fontWeight: selectedDistrict ? 'bold' : 'normal' }} />
                            <Tab label="Kode Pos" disabled={!selectedDistrict || !selectedCity} sx={{ color: selectedPostcode ? 'primary.main' : 'inherit', fontWeight: selectedPostcode ? 'bold' : 'normal' }} />
                        </Tabs>
                    )}
                    <List sx={{ maxHeight: 200, overflowY: 'auto', p: 0 }}>
                        {loading && debouncedInputValue ? (<Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress size={24} /></Box>
                        ) : options?.length > 0 ? (
                            options.map((option, idx) => {
                                const currentStep = debouncedInputValue ? (isAutocompleteOption(option) ? 4 : 0) : tab;
                                return (<ListItemButton key={`${option.code}-${idx}`} onMouseDown={(e) => { e.preventDefault(); handleSelect(currentStep, option.code, option.label, option); }}><Typography component="div">{renderHighlightedText(option.label.toUpperCase(), inputValue.toUpperCase())}</Typography></ListItemButton>);
                            })
                        ) : (<Typography sx={{ p: 2 }} variant="body2" color="text.secondary">{loading ? 'Memuat...' : 'Data tidak ditemukan'}</Typography>)}
                    </List>
                </Box>
            )}
        </Box>
    );
};

export default AutocompleteAddress;