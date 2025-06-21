'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

// Ganti dengan API Key Anda dari Google Maps Platform
const API_KEY = "AIzaSyBBWc0LFEfssFFSIl4vc95ennI3uRcm6oo";
const LIBRARIES = 'places,geocoding';

interface AddressAutocompleteStreetProps {
    subdistrict: string;
    setLat: (lat: number) => void;
    setLong: (lng: number) => void;
    setFullAddress: (address: string) => void;
    dataFullAddress?: string;
}

export default function AddressAutocompleteStreet({
    subdistrict,
    setLat,
    setLong,
    setFullAddress,
    dataFullAddress,
}: AddressAutocompleteStreetProps) {
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    useEffect(() => {
        if (window.google && window.google.maps) {
            setIsScriptLoaded(true);
            return;
        }

        if (document.querySelector(`script[src*="${API_KEY}"]`)) {
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=${LIBRARIES}`;
        script.async = true;
        script.defer = true;
        script.onload = () => setIsScriptLoaded(true);
        script.onerror = () => console.error('Google Maps script failed to load.');
        document.head.appendChild(script);
    }, []);

    return (
        isScriptLoaded && (
            <AddressForm
                subdistrict={subdistrict}
                setLat={setLat}
                setLong={setLong}
                setFullAddress={setFullAddress}
                dataFullAddress={dataFullAddress}
            />
        )
    );
}

const AddressForm: React.FC<AddressAutocompleteStreetProps> = ({
    subdistrict,
    setLat,
    setLong,
    setFullAddress,
    dataFullAddress,
}) => {
    const [areaName, setAreaName] = useState(subdistrict || '');
    const [selectedAddress, setSelectedAddress] = useState<string>(dataFullAddress || '');
    const [error, setError] = useState<string>('');
    const [isAddressInputDisabled, setAddressInputDisabled] = useState(true);

    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const geocoderRef = useRef<google.maps.Geocoder | null>(null);
    const addressInputRef = useRef<HTMLInputElement>(null);

    const onPlaceChanged = useCallback(() => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry?.location && place.formatted_address) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                setLat(lat);
                setLong(lng);
                setFullAddress(place.formatted_address);
                setSelectedAddress(place.formatted_address);
                console.log("Alamat dipilih:", place.formatted_address);
            }
        }
    }, [setLat, setLong, setFullAddress]);

    const applyAreaRestriction = useCallback(() => {
        if (!geocoderRef.current) return;
        const geocoder = geocoderRef.current;

        if (!areaName) {
            autocompleteRef.current?.setBounds(
                new window.google.maps.LatLngBounds()
            );
            autocompleteRef.current?.setOptions({ strictBounds: false });
            setAddressInputDisabled(false);
            return;
        }

        geocoder.geocode({ address: `${areaName}, Indonesia` }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const viewport = results[0].geometry.viewport;
                autocompleteRef.current?.setBounds(viewport);
                autocompleteRef.current?.setOptions({ strictBounds: true });
                setAddressInputDisabled(false);
            } else {
                setAddressInputDisabled(true);
                setError(`Wilayah "${areaName}" tidak ditemukan.`);
            }
        });
    }, [areaName]);

    useEffect(() => {
        if (window.google && addressInputRef.current) {
            if (!geocoderRef.current) {
                geocoderRef.current = new window.google.maps.Geocoder();
            }
            if (!autocompleteRef.current) {
                autocompleteRef.current = new window.google.maps.places.Autocomplete(
                    addressInputRef.current,
                    {
                        fields: ["address_components", "geometry", "name", "formatted_address"],
                    }
                );
                autocompleteRef.current.addListener('place_changed', onPlaceChanged);
            }
            applyAreaRestriction();
        }
    }, [onPlaceChanged, applyAreaRestriction]);

    useEffect(() => {
        setAreaName(subdistrict);
    }, [subdistrict]);

    const handleAddressInputClick = () => {
        if (autocompleteRef.current && addressInputRef.current) {
            const input = addressInputRef.current;

            // Jika input kosong, masukkan karakter dummy
            if (input.value === '') {
                input.value = ''; // trigger autocomplete
                google.maps.event.trigger(input, 'focus');
                google.maps.event.trigger(input, 'input');

                // Hapus kembali agar terlihat kosong
                setTimeout(() => {
                    input.value = '';
                }, 100);
            }
        }
    };

    // Inject custom styles untuk hasil autocomplete
    useEffect(() => {
        const styleId = 'pac-container-styles';
        if (document.getElementById(styleId)) return;

        const styleEl = document.createElement('style');
        styleEl.id = styleId;
        styleEl.innerHTML = `
        .pac-container {
            background-color: #fff;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            border: 1px solid #e2e8f0;
            z-index: 9999 !important;
        }
        .pac-item {
            padding: 0.75rem;
            font-size: 1rem;
            cursor: pointer;
        }
        .pac-item:hover {
            background-color: #f7fafc;
        }
        .pac-item-query {
            font-weight: 600;
        }
        `;
        document.head.appendChild(styleEl);
    }, []);

    return (
        <>
            <input
                ref={addressInputRef}
                defaultValue={selectedAddress}
                id="alamat-input"
                type="text"
                placeholder={isAddressInputDisabled ? "Tentukan batas wilayah dulu..." : "Ketik atau klik di sini..."}
                onClick={handleAddressInputClick}
                disabled={areaName ? false : true}
                autoComplete='off'
                className="w-full px-4 py-3 text-base text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            {error && (
                <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
        </>
    );
};
