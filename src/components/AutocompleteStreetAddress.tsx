import React, { useState, useEffect } from 'react';
import { TextField, List, ListItemButton, Typography, CircularProgress, Box } from '@mui/material';
import axios from 'axios';

type Address = {
    nama: string;
    alamat: string;
    lokasi: { lat: number; lng: number };
};

const AutocompleteStreetAddress = () => {
    const [inputValue, setInputValue] = useState('');
    const [debouncedValue, setDebouncedValue] = useState('');
    const [options, setOptions] = useState<Address[]>([]);
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(false);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(inputValue);
        }, 500);
        return () => clearTimeout(handler);
    }, [inputValue]);

    useEffect(() => {
        const fetchAddresses = async () => {
            if (!debouncedValue) {
                setOptions([]);
                return;
            }
            setLoading(true);
            try {
                const res = await axios.get(`/api/address-search?q=${debouncedValue}`);
                setOptions(res.data ?? []);
            } catch (err) {
                console.error('Search failed:', err);
                setOptions([]);
            }
            setLoading(false);
        };

        fetchAddresses();
    }, [debouncedValue]);

    const highlightMatch = (text: string, keyword: string) => {
        const index = text.toLowerCase().indexOf(keyword.toLowerCase());
        if (index === -1) return text;
        return (
            <>
                {text.substring(0, index)}
                <strong>{text.substring(index, index + keyword.length)}</strong>
                {text.substring(index + keyword.length)}
            </>
        );
    };

    const handleSelect = (option: Address) => {
        const fullText = `${option.nama}, ${option.alamat}, Lat: ${option.lokasi.lat}, Lng: ${option.lokasi.lng}`;
        setInputValue(fullText);
        setFocused(false);
    };

    return (
        <Box sx={{ position: 'relative' }}>
            <TextField
                fullWidth
                placeholder="Nama Jalan, Gedung, No. Rumah"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 200)}
            />

            {loading && (
                <CircularProgress size={20} sx={{ position: 'absolute', top: 16, right: 16 }} />
            )}

            {focused && options.length > 0 && (
                <List sx={{ border: '1px solid #ccc', maxHeight: 250, overflowY: 'auto', mt: 1 }}>
                    {options.map((option, index) => (
                        <ListItemButton
                            key={index}
                            onMouseDown={() => handleSelect(option)}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                '&:hover': { backgroundColor: '#f5f5f5' },
                            }}
                        >
                            <Typography variant="body2" color="text.primary">
                                {highlightMatch(option.nama, inputValue)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {highlightMatch(option.alamat, inputValue)}
                            </Typography>
                        </ListItemButton>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default AutocompleteStreetAddress;
