/// <reference types="@types/googlemaps" />
import React, { useEffect, useRef, useState } from "react";

declare global {
    interface Window {
        google?: typeof google;
    }
}

type Props = {
    setFullAddressStreet: (value: string) => void;
    setLat: (value: number) => void;
    setLong: (value: number) => void;
    dataFullAddressStreet?: string;
    openModalAddAddress?: boolean;
};

type PlaceResult = {
    name: string;
    address: string;
    lat: number;
    lng: number;
};

const GoogleMapsAutocomplete: React.FC<Props> = ({
    setFullAddressStreet,
    setLat,
    setLong,
    dataFullAddressStreet = "",
    openModalAddAddress
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [result, setResult] = useState<PlaceResult | null>(null);
    const [manualInput, setManualInput] = useState(dataFullAddressStreet);

    // Sync initial value to input
    useEffect(() => {
        setManualInput(dataFullAddressStreet);
    }, [dataFullAddressStreet]);
    useEffect(() => {
        if (!openModalAddAddress) {
            setManualInput('');
        }
    }, [openModalAddAddress]);

    const handleBlur = () => {
        if (!result && manualInput.trim() !== "") {
            setFullAddressStreet(manualInput.trim());
        }
    };

    useEffect(() => {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            console.error("Google Maps API key is missing");
            return;
        }

        const loadScript = (src: string, callback: () => void) => {
            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (!existingScript) {
                const script = document.createElement("script");
                script.src = src;
                script.async = true;
                script.defer = true;
                script.onload = () => {
                    const waitForGoogle = setInterval(() => {
                        if (window.google?.maps?.places?.Autocomplete && inputRef.current) {
                            clearInterval(waitForGoogle);
                            callback();
                        }
                    }, 100);
                };
                document.head.appendChild(script);
            } else {
                const waitForGoogle = setInterval(() => {
                    if (window.google?.maps?.places?.Autocomplete && inputRef.current) {
                        clearInterval(waitForGoogle);
                        callback();
                    }
                }, 100);
            }
        };

        const initAutocomplete = () => {
            if (!inputRef.current || !window.google?.maps?.places?.Autocomplete) {
                console.warn("Google Maps not ready");
                return;
            }

            const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
                types: ["geocode", "establishment"],
            });

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (!place.geometry) {
                    setResult(null);
                    setFullAddressStreet("");
                    return;
                }

                const name = place.name || "";
                const address = place.formatted_address || "";
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();

                setResult({ name, address, lat, lng });
                setManualInput(address);
                setFullAddressStreet(address);
                setLat(lat);
                setLong(lng);
            });
        };

        // jalankan saat modal terbuka (edit atau tambah)
        if (openModalAddAddress) {
            loadScript(
                `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`,
                initAutocomplete
            );
        }
    }, [openModalAddAddress, setFullAddressStreet, setLat, setLong]);

    return (
        <div>
            <input
                ref={inputRef}
                type="text"
                placeholder="Jalan, Kecamatan, Gedung, Tempat, dll"
                style={{
                    width: "100%",
                    height: 40,
                    fontSize: 16,
                    padding: "5px 10px",
                    border: "1px solid #d1d1d1",
                    borderRadius: 3,
                }}
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onBlur={handleBlur}
            />
        </div>
    );
};

export default GoogleMapsAutocomplete;
