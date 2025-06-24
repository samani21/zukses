import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AddressComponent, AutocompleteProps, City, District, LocationDetails, Option, Postcode, Province } from './types';
import { AppBar, Box, Button, CircularProgress, Dialog, IconButton, InputAdornment, List, ListItemButton, ListItemText, Stack, Tab, Tabs, TextField, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import Get from 'services/api/Get';
import { isAutocompleteOption } from './utils';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SearchIcon, ShieldCloseIcon } from 'lucide-react';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MyLocationIcon from '@mui/icons-material/MyLocation';
const AutocompleteAddress = (props: AutocompleteProps) => {
    // State dari kode asli Anda (dipertahankan)
    const [inputValue, setInputValue] = useState(props?.dataFullAddress || '');
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
    const [placeholder, setPlaceHolder] = useState<string>('123');

    // REFS
    const containerRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const skipNextDebounce = useRef(false);
    // Deteksi Perangkat
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


    const API_KEY = 'AIzaSyBBWc0LFEfssFFSIl4vc95ennI3uRcm6oo';

    const findComponent = (components: AddressComponent[], type: string): string => {
        const component = components.find(c => c.types.includes(type));
        return component ? component.long_name : '';
    };
    const handleGetLocation = useCallback(() => {
        // Reset state before starting a new request

        // Check if geolocation is supported by the browser
        if (!navigator.geolocation) {
            return;
        }

        // Get current GPS position
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}&language=id`;

                try {
                    const response = await fetch(url);
                    const data = await response.json();

                    if (data.status !== 'OK') {
                        throw new Error(data.error_message || 'Failed to fetch location data from Google Maps API.');
                    }

                    // Get the first and most relevant address result
                    const result = data.results[0];
                    if (!result) {
                        throw new Error('No address found for the current location.');
                    }

                    const components = result.address_components as AddressComponent[];

                    // Extract address details based on Indonesian administrative levels
                    const details: LocationDetails = {
                        province: findComponent(components, 'administrative_area_level_1'),
                        city: findComponent(components, 'administrative_area_level_2'),
                        district: findComponent(components, 'administrative_area_level_3'),
                        postalCode: findComponent(components, 'postal_code'),
                        fullAddress: result.formatted_address,
                        latitude: latitude,
                        longitude: longitude,
                    };

                    props?.setFullAddress(details?.province?.toUpperCase() + ", " + details?.city?.toUpperCase() + ", " + details?.district?.toUpperCase() + ", " + details?.postalCode)
                    props?.setFullAddressStreet(details?.fullAddress)
                    setIsFocused(false)
                    props?.setLat(details?.latitude)
                    props?.setLong(details?.longitude)
                    props?.setKodePos(details?.postalCode)
                } catch { }
            },
        );
    }, [API_KEY]);
    useEffect(() => {
        const handler = setTimeout(() => {
            if (isMobile) {
                setDebouncedMobileQuery(mobileSearchQuery);
            } else {
                if (skipNextDebounce.current) { skipNextDebounce.current = false; return; }
                if (inputValue.trim() === '') {
                    setDebouncedInputValue('');
                    if (placeholder) {
                        setTab(3);
                    } else {
                        setSelectedProvince(null);
                        setSelectedDistrict(null);
                        setSelectedPostcode(null);
                        setSelectedCity(null);
                        setTab(0);
                    }
                }
                else { setDebouncedInputValue(inputValue); }
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [inputValue, mobileSearchQuery, isMobile]);
    useEffect(() => {
        if (props?.dataFullAddress) {

            const provinsi = props?.dataFullAddress.split(',').slice(0, 1).map(s => s.trim()).join(', ');
            const kota = props?.dataFullAddress.split(',').slice(1, 2).map(s => s.trim()).join(', ');
            const kecamatan = props?.dataFullAddress.split(',').slice(2, 3).map(s => s.trim()).join(', ');
            const kodePos = props?.dataFullAddress.split(',').slice(3).map(s => s.trim()).join(', ');
            // setMobileSearchQuery(dataFullAddress)
            setTab(3);
            setSelectedProvince({ id: provId, name: provinsi });
            setSelectedCity({ id: cityId, name: kota });
            setSelectedDistrict({ id: destrictd, name: kecamatan });
            setSelectedPostcode({ id: codePos, code: kodePos });
        }
    }, [props?.dataFullAddress]);

    useEffect(() => {
        if (props?.isEdit) {
            setSelectedProvince({ id: props?.province_id, name: props?.provinces });
            setSelectedCity({ id: props?.citie_id, name: props?.cities });
            setSelectedDistrict({ id: props?.subdistrict_id, name: props?.subdistricts });
            setSelectedPostcode({ id: props?.postal_code_id, code: props?.postal_codes });
            setInputFUllAddress(props?.dataFullAddress ?? '');
            setInputValue(props?.dataFullAddress ?? '');
            setTab(3);
        }
    }, [props?.isEdit, props?.province_id, props?.provinces, props?.citie_id, props?.cities, props?.subdistrict_id, props?.subdistricts, props?.postal_code_id, props?.postal_codes, props?.dataFullAddress]);

    useEffect(() => {
        if (props?.dataFullAddress) { setInputValue(props?.dataFullAddress); }
        else { setInputValue(''); setSelectedProvince(null); setSelectedCity(null); setSelectedDistrict(null); setSelectedPostcode(null); setTab(0); }
    }, [props?.dataFullAddress]);

    useEffect(() => {
        if (isMobile) { if (mobileViewOpen) fetchOptions(); }
        else { if (isFocused) fetchOptions(); }
    }, [isFocused, mobileViewOpen, tab, selectedProvince, selectedCity, selectedDistrict, debouncedInputValue, debouncedMobileQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
                if (props?.dataFullAddress) setInputValue(props?.dataFullAddress);
            }
        };
        if (!isMobile) { document.addEventListener('mousedown', handleClickOutside); }
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, [props?.dataFullAddress, isMobile]);


    // --- DATA FETCHING (Disesuaikan untuk kedua platform) ---
    const fetchOptions = async () => {
        setLoading(true);
        const query = isMobile ? debouncedMobileQuery : debouncedInputValue;
        const constructedAddress = getFullLabel(selectedProvince?.name, selectedCity?.name, selectedDistrict?.name, selectedPostcode?.code);
        try {
            const kota = props?.dataFullAddress?.split(',').slice(1, 2).map(s => s.trim()).join(', ');
            const kecamatan = props?.dataFullAddress?.split(',').slice(2, 3).map(s => s.trim()).join(', ');
            if (query.trim() && query !== constructedAddress) {
                const res = await Get<{ data: { data: Option[] } }>('zukses', `full-address?search=${query}`);
                if (res) setOptions(res.data?.data || []);
            } else if (tab === 0) {
                const res = await Get<{ data: Province[] }>('zukses', `master/province?page_size=1000`); if (res) setOptions(res.data.map(p => ({ label: p.name, code: p.id.toString() })));
            } else if (tab === 1 && selectedProvince) {
                const res = await Get<{ data: City[] }>('zukses', `master/city?page_size=1000&province=${selectedProvince.id}&search=${kota}`);
                if (res) setOptions(res.data.map(c => ({ label: c.name, code: c.id.toString() })));
            } else if (tab === 2 && selectedCity) {
                const res = await Get<{ data: District[] }>('zukses', `master/subdistrict?page_size=1000&city=${selectedCity.id}&search=${kecamatan}`);
                if (res) setOptions(res.data.map(d => ({ label: d.name, code: d.id.toString() })));
            } else if (tab === 3 && selectedDistrict) {
                const res = await Get<{ data: Postcode[] }>('zukses', `master/postal_code?page_size=1000&subdistrict_id=${selectedDistrict.id}&search=${kecamatan}`);
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
            props?.setProv(province_id);
            props?.setCity(city_id);
            props?.setDistrict(district_id);
            props?.setPostCode(postcode_id);
            setSelectedProvince({ id: province_id, name: province_name });
            setSelectedCity({ id: city_id, name: city_name });
            setSelectedDistrict({ id: district_id, name: district_name });
            setSelectedPostcode({ id: postcode_id, code: postcode_code });
            props?.setKodePos(String(postcode_code));
            setInputValue(option.label);
            props?.setFullAddress(option.label);
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
            props?.setProv(+code);
            setSelectedCity(null);
            setSelectedDistrict(null);
            setSelectedPostcode(null);
            props?.setCity(0);
            props?.setDistrict(0);
            props?.setPostCode(0);
            setTab(1);
            setInputValue(label);
        } else if (step === 1) {
            setSelectedCity({ id: +code, name: label });
            props?.setCity(+code);
            setSelectedDistrict(null);
            setSelectedPostcode(null);
            props?.setDistrict(0);
            props?.setPostCode(0);
            setTab(2);
            setInputValue(getFullLabel(selectedProvince?.name || provinsi, label));
        } else if (step === 2) {
            setSelectedDistrict({ id: +code, name: label?.toUpperCase() });
            props?.setDistrict(+code);
            setSelectedPostcode(null);
            props?.setPostCode(0);
            setTab(3);
            setInputValue(getFullLabel(selectedProvince?.name || provinsi, selectedCity?.name || kota, label?.toUpperCase()));
        } else if (step === 3) {
            setSelectedPostcode({ id: +code, code: label });
            props?.setPostCode(+code);
            const full = getFullLabel(selectedProvince?.name ?? provinsi, selectedCity?.name ?? kota, selectedDistrict?.name ?? kecamatan, label);
            setInputFUllAddress(full);
            props?.setFullAddress(full);
            setIsFocused(false);
            setInputValue(full);
            props?.setKodePos(label);
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
        setPlaceHolder(inputValue)
        setInputValue('')
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
            props?.setFullAddress(full);
            setInputValue(full);
            setMobileSearchQuery(full);
            setProvId(option?.compilationID?.province_id);
            setCityId(option?.compilationID?.city_id);
            setDestrictd(option?.compilationID?.district_id);
            setCodePos(option?.compilationID?.postcode_id);
            props?.setCity(id.city_id);
            props?.setProv(id.province_id);
            props?.setDistrict(id.district_id);
            props?.setPostCode(id.postcode_id);
            setMobileViewOpen(false);
            setIsFocused(false)
            props?.setKodePos(option?.label?.split(',')[3]?.trim() ?? '');
            resetSelection();
            return;
        }
        const { code, label } = option;

        if (tab === 0) {
            setSelectedProvince({ id: +code, name: label });
            props?.setProv(+code)
            setProvId(+code);
            setTab(1);
        }
        else if (tab === 1) {
            setSelectedCity({ id: +code, name: label });
            props?.setCity(+code);
            setCityId(+code);
            setTab(2);
        }
        else if (tab === 2) {
            setSelectedDistrict({ id: +code, name: label.toUpperCase() });
            props?.setDistrict(+code);
            setDestrictd(+code);
            setTab(3);
        }
        else if (tab === 3) {
            const full = getFullLabel(selectedProvince?.name, selectedCity?.name, selectedDistrict?.name, label);

            props?.setFullAddress(full);
            setInputValue(full);
            props?.setPostCode(+code);
            setCodePos(+code);
            props?.setKodePos(label)
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

    const handleUseCurrentLocation = async () => handleGetLocation();


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
                    setPlaceHolder(inputValue)
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
                                placeholder={placeholder || "Cari Kota, Kecamatan, atau Kode Pos"}
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
                                                <ShieldCloseIcon />
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
                                        color="primary" sx={{ fontSize: '12px' }} />
                                    <Typography
                                        variant="body2"
                                        color="primary"
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
                            <List sx={{ pt: 0 }}>{options.map((option, index) => {
                                const input = inputValue || placeholder
                                const locationParts = input.split(',').map(part => part.trim());
                                const labelUpper = option.label.toUpperCase();

                                // Cek apakah label persis sama dengan salah satu bagian setelah dipisah koma
                                const isActive = locationParts.includes(labelUpper)
                                return (

                                    <ListItemButton key={`${option.code}-${index}`} onClick={() => handleMobileSelect(option)} sx={{ color: isActive ? "#0075C9" : "black", }}>
                                        {/* ===== PERBAIKAN ERROR DI SINI ===== */}
                                        <ListItemText primary={String(option.label || '').toUpperCase()} />
                                    </ListItemButton>
                                )
                            })}</List>
                        )}
                    </Box>
                </Dialog >
            </>
        );
    }

    // Tampilan Desktop (Kode Asli Anda, tidak diubah)
    return (
        <Box sx={{ position: 'relative', marginTop: "-15px" }} ref={containerRef}>
            <TextField fullWidth variant="outlined" label="Provinsi, Kota, Kecamatan, Kode Pos" value={inputValue} onChange={handleInputChange} onFocus={handleFocus} inputRef={inputRef} autoComplete="off" placeholder={placeholder} />
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
                                const input = inputValue || placeholder
                                const locationParts = input.split(',').map(part => part.trim());
                                const labelUpper = option.label.toUpperCase();

                                // Cek apakah label persis sama dengan salah satu bagian setelah dipisah koma
                                const isActive = locationParts.includes(labelUpper)
                                const currentStep = debouncedInputValue ? (isAutocompleteOption(option) ? 4 : 0) : tab;
                                return (
                                    <ListItemButton key={`${option.code}-${idx}`} onMouseDown={(e) => { e.preventDefault(); handleSelect(currentStep, option.code, option.label, option); }}>
                                        <Typography component="div" sx={{
                                            color: isActive ? "#0075C9" : "black",
                                            cursor: "pointer",
                                        }}>{renderHighlightedText(option.label.toUpperCase(), inputValue.toUpperCase())}</Typography>
                                    </ListItemButton>);
                            })
                        ) : (<Typography sx={{ p: 2 }} variant="body2" color="text.secondary">{loading ? 'Memuat...' : 'Data tidak ditemukan'}</Typography>)}
                    </List>
                </Box>
            )}
        </Box>
    );
};
export default AutocompleteAddress