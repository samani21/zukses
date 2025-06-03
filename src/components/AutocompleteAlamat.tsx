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
import axios from 'axios';
import Get from 'services/api/Get';

type Option = { label: string; code: string };

interface Province { id: number; name: string; }
interface City { id: number; name: string; }
interface District { id: number; name: string; }
interface Postcode { id: number; code: string; }

const AutocompleteAddress = () => {
    const [inputValue, setInputValue] = useState('');
    const [debouncedInputValue, setDebouncedInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(false);

    const [selectedProvince, setSelectedProvince] = useState<{ id: string; name: string } | null>(null);
    const [selectedCity, setSelectedCity] = useState<{ id: string; name: string } | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<{ id: string; name: string } | null>(null);

    const [options, setOptions] = useState<Option[]>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedInputValue(inputValue);
        }, 500);
        return () => clearTimeout(handler);
    }, [inputValue]);

    const getFullLabel = (
        postcode?: string,
        district?: string,
        city?: string,
        province?: string
    ) => {
        return [postcode, district, city, province].filter(Boolean).join(', ');
    };

    const fetchOptions = async () => {
        if (!isFocused) return;
        setLoading(true);

        try {
            if (isTyping && debouncedInputValue.trim()) {
                const res = await axios.get<Option[]>(`/api/search?q=${debouncedInputValue}`);
                setOptions(res.data);
            } else if (tab === 0) {
                const res = await Get<{ data: Province[] }>('zukses', `master/province?sort_order&sort_by&page_size=1000`);
                const provinces = res?.data ?? [];
                setOptions(provinces.map((p) => ({ label: p.name, code: p.id.toString() })));
            } else if (tab === 1 && selectedProvince) {
                const res = await Get<{ data: City[] }>('zukses', `master/city?page_size=1000&province=${selectedProvince.id}`);
                const cities = res?.data ?? [];
                setOptions(cities.map((c) => ({ label: c.name, code: c.id.toString() })));
            } else if (tab === 2 && selectedCity) {
                const res = await Get<{ data: District[] }>('zukses', `master/subdistrict?page_size=1000&city=${selectedCity.id}`);
                const districts = res?.data ?? [];
                setOptions(districts.map((d) => ({ label: d.name, code: d.id.toString() })));
            } else if (tab === 3 && selectedDistrict) {
                const res = await Get<{ data: Postcode[] }>('zukses', `master/postal_code?page_size=1000&district=${selectedDistrict.id}`);
                const postcodes = res?.data ?? [];
                setOptions(postcodes.map((p) => ({ label: p.code, code: p.id.toString() })));
            } else {
                setOptions([]);
            }
        } catch (err) {
            console.error('Failed to fetch options:', err);
            setOptions([]);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchOptions();
    }, [isFocused, isTyping, tab, selectedProvince, selectedCity, selectedDistrict, debouncedInputValue]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
                setIsTyping(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (step: number, code: string, label: string) => {
        if (step === 0) {
            setSelectedProvince({ id: code, name: label });
            setSelectedCity(null);
            setSelectedDistrict(null);
            setTab(1);
            setInputValue(label);
        } else if (step === 1) {
            setSelectedCity({ id: code, name: label });
            setSelectedDistrict(null);
            setTab(2);
            setInputValue(getFullLabel(undefined, undefined, label, selectedProvince?.name));
        } else if (step === 2) {
            setSelectedDistrict({ id: code, name: label });
            setTab(3);
            setInputValue(getFullLabel(undefined, label, selectedCity?.name, selectedProvince?.name));
        } else if (step === 3) {
            setInputValue(getFullLabel(label, selectedDistrict?.name, selectedCity?.name, selectedProvince?.name));
        }
        setIsTyping(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);
        setIsTyping(val.trim().length > 0);
    };

    return (
        <Box sx={{ maxWidth: 500, position: 'relative' }} ref={containerRef}>
            <TextField
                fullWidth
                variant="outlined"
                label="Province, City, District, Postcode"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
            />

            {loading && (
                <CircularProgress
                    size={20}
                    sx={{ position: 'absolute', top: 16, right: 16 }}
                />
            )}

            {isFocused && !isTyping && (
                <Tabs
                    value={tab}
                    onChange={(_, newTab) => setTab(newTab)}
                    variant="fullWidth"
                    sx={{ mt: 1 }}
                >
                    <Tab label="Province" />
                    <Tab label="City" disabled={!selectedProvince} />
                    <Tab label="District" disabled={!selectedCity} />
                    <Tab label="Postcode" disabled={!selectedDistrict} />
                </Tabs>
            )}

            {isFocused && (
                <List sx={{ border: '1px solid #ddd', maxHeight: 200, overflowY: 'auto' }}>
                    {options.length > 0 ? (
                        options.map((option, idx) => (
                            <ListItemButton
                                key={idx}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelect(tab, option.code, option.label);
                                }}
                            >
                                <Typography>{option.label}</Typography>
                            </ListItemButton>
                        ))
                    ) : (
                        <Typography sx={{ p: 2 }} variant="body2">
                            {loading ? 'Loading...' : 'No data found'}
                        </Typography>
                    )}
                </List>
            )}
        </Box>
    );
};

export default AutocompleteAddress;
