'use client';

import { useCallback, useEffect, useRef, useState } from "react";

// Interface untuk data alamat yang dipilih
interface SelectedAddress {
    mainText: string;
    secondaryText: string;
    fullAddress: string;
    placeId: string;
    lat: number;
    lng: number;
}

// Hook untuk memuat skrip Google Maps
function useGoogleMapsScript(apiKey: string): boolean {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (window.google?.maps) {
            setIsLoaded(true);
            return;
        }

        const scriptId = 'google-maps-script';
        const existingScript = document.getElementById(scriptId);

        if (existingScript) {
            const checkInterval = setInterval(() => {
                if (window.google?.maps) {
                    setIsLoaded(true);
                    clearInterval(checkInterval);
                }
            }, 100);
            return;
        }

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setIsLoaded(true);
        script.onerror = () => {
            console.error("Error: Gagal memuat skrip Google Maps.");
            setIsLoaded(false);
        };
        document.head.appendChild(script);
    }, [apiKey]);

    return isLoaded;
}

// Komponen Autocomplete
function AddressAutocomplete({
    onAddressSelect,
    filterArea = '',
    dataFullAddress,
    isScriptLoaded,
}: {
    onAddressSelect: (address: SelectedAddress) => void;
    filterArea?: string;
    dataFullAddress?: string;
    isScriptLoaded: boolean;
}) {
    const [inputValue, setInputValue] = useState<string>(dataFullAddress ?? '');
    const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
    const placesService = useRef<google.maps.places.PlacesService | null>(null);
    const mapDivRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isScriptLoaded && window.google?.maps?.places) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService();
            if (mapDivRef.current) {
                placesService.current = new window.google.maps.places.PlacesService(mapDivRef.current);
            }
        }
    }, [isScriptLoaded]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            const query = filterArea ? `${value}, ${filterArea}` : value;

            if (value && autocompleteService.current) {
                autocompleteService.current.getPlacePredictions(
                    {
                        input: query,
                        componentRestrictions: { country: 'id' },
                    },
                    (newPredictions, status) => {
                        if (
                            status === window.google.maps.places.PlacesServiceStatus.OK &&
                            newPredictions
                        ) {
                            const filtered = newPredictions.filter((p) =>
                                filterArea ? p.description.toLowerCase().includes(filterArea.toLowerCase()) : true
                            );

                            // --- PERUBAHAN DI SINI ---
                            // Ambil 5 hasil pertama saja dari array yang sudah difilter
                            const limitedPredictions = filtered.slice(0, 5);
                            setPredictions(limitedPredictions);
                            // -------------------------

                            // Buka dropdown jika ada hasil (bahkan jika lebih dari 5)
                            setIsDropdownOpen(filtered.length > 0);
                        } else {
                            setPredictions([]);
                            setIsDropdownOpen(false);
                        }
                    }
                );
            } else {
                setPredictions([]);
                setIsDropdownOpen(false);
            }
        }, 500);
    };

    const handleSelect = useCallback(
        (prediction: google.maps.places.AutocompletePrediction) => {
            setInputValue(prediction.description);
            setIsDropdownOpen(false);

            if (!placesService.current) return;

            placesService.current.getDetails(
                {
                    placeId: prediction.place_id,
                    fields: ['geometry.location', 'name', 'formatted_address'],
                },
                (details, status) => {
                    if (
                        status === window.google.maps.places.PlacesServiceStatus.OK &&
                        details &&
                        details.geometry?.location
                    ) {
                        const lat = details.geometry.location.lat();
                        const lng = details.geometry.location.lng();
                        onAddressSelect({
                            mainText: prediction.structured_formatting.main_text,
                            secondaryText: prediction.structured_formatting.secondary_text,
                            fullAddress: details.formatted_address || prediction.description,
                            placeId: prediction.place_id,
                            lat,
                            lng,
                        });
                    }
                }
            );
        },
        [onAddressSelect]
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative w-full">
            <div ref={mapDivRef} style={{ height: '1px', width: '1px', overflow: 'hidden' }} />
            <input
                id="address-autocomplete"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Mulai ketik nama jalan, kota, atau tempat..."
                className="w-full px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onFocus={() => inputValue && predictions.length > 0 && setIsDropdownOpen(true)}
                autoComplete="off"
                disabled={!filterArea} // Logika disederhanakan: nonaktif jika filterArea kosong
            />
            {isDropdownOpen && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {predictions.map((prediction) => (
                        <li
                            key={prediction.place_id}
                            onClick={() => handleSelect(prediction)}
                            className="px-4 py-3 cursor-pointer hover:bg-gray-100"
                        >
                            <p className="font-semibold text-gray-800">{prediction.structured_formatting.main_text}</p>
                            <p className="text-sm text-gray-500">{prediction.structured_formatting.secondary_text}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// Komponen utama yang menggunakan AddressAutocomplete
export default function AddressAutocompleteStreet({
    subdistrict,
    dataFullAddress = '',
    setLat,
    setLong,
    setFullAddress,
}: {
    subdistrict?: string;
    dataFullAddress?: string;
    setLat: (val: number) => void;
    setLong: (val: number) => void;
    setFullAddress: (val: string) => void;
}) {
    // GANTI DENGAN API KEY ANDA YANG VALID. Jangan ekspos API key di client-side untuk aplikasi produksi.
    const Maps_API_KEY = "AIzaSyBBWc0LFEfssFFSIl4vc95ennI3uRcm6oo";
    const isMapsLoaded = useGoogleMapsScript(Maps_API_KEY);
    const [mapCenter, setMapCenter] = useState({ lat: -3.34, lng: 114.59 }); // Default: Banjarmasin
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<google.maps.Map | null>(null);

    useEffect(() => {
        if (isMapsLoaded && mapRef.current && !mapInstance.current) {
            mapInstance.current = new window.google.maps.Map(mapRef.current, {
                center: mapCenter,
                zoom: 13,
                disableDefaultUI: true,
            });
        }
    }, [isMapsLoaded, mapCenter]);

    useEffect(() => {
        if (mapInstance.current) {
            mapInstance.current.setCenter(mapCenter);
            mapInstance.current.setZoom(15);
        }
    }, [mapCenter]);

    const handleAddressSelect = (address: SelectedAddress) => {
        setFullAddress(address.fullAddress);
        if (address.lat && address.lng) {
            setLat(address.lat);
            setLong(address.lng);
            setMapCenter({ lat: address.lat, lng: address.lng });
        }
    };

    return (
        <div>
            {isMapsLoaded ? (
                <AddressAutocomplete
                    onAddressSelect={handleAddressSelect}
                    filterArea={subdistrict}
                    isScriptLoaded={isMapsLoaded}
                    dataFullAddress={dataFullAddress}
                />
            ) : (
                <div className="w-full px-4 py-2 text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-md">
                    Memuat komponen pencarian...
                </div>
            )}
        </div>
    );
}