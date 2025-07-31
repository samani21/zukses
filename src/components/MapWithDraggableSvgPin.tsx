import React, { useCallback, useEffect, useState } from "react";
import { GoogleMap, Marker, OverlayView, Autocomplete } from "@react-google-maps/api";

// --- KONSTANTA (Tidak ada perubahan) ---
const containerStyle = {
    width: "708px",
    height: "307px",
    border: "2px solid #888888"
};
const containerStyleMobile = {
    width: "100%",
    height: "70dvh",
};
const defaultCenter = {
    lat: -3.362371, // Lokasi default di Banjarmasin
    lng: 114.593231,
};

// --- Tipe Props (Tidak ada perubahan) ---
type Props = {
    lat?: number;
    long?: number;
    fullAddressStreet?: string;
    setLat: (value: number) => void;
    setLong: (value: number) => void;
    setOpenMaps: (value: boolean) => void;
};

const MapWithDraggableSvgPin = ({
    lat,
    long,
    setLat,
    setLong,
    setOpenMaps,
    fullAddressStreet
}: Props) => {

    // --- State (Hanya ada penambahan state untuk autocomplete) ---
    const initialPosition = {
        lat: lat ?? defaultCenter.lat,
        lng: long ?? defaultCenter.lng,
    };
    const [tempMarkerPos, setTempMarkerPos] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);

    // State untuk menyimpan instance Autocomplete
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

    // --- FUNGSI & HOOKS (Tidak ada perubahan, hanya penambahan handler autocomplete) ---

    const handleFindMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLat = position.coords.latitude;
                    const newLng = position.coords.longitude;
                    setTempMarkerPos({ lat: newLat, lng: newLng });
                },
                (error) => {
                    console.error("Gagal mendapatkan lokasi:", error);
                    alert("Gagal mendapatkan lokasi. Pastikan izin lokasi diaktifkan.");
                }
            );
        } else {
            alert("Geolocation tidak didukung oleh browser Anda.");
        }
    };

    useEffect(() => {
        if (lat && long) {
            const pos = { lat, lng: long };
            setTempMarkerPos(pos);
        }
    }, [lat, long]);

    const onDragStart = useCallback(() => {
        setIsDragging(true);
    }, []);

    const onDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            setTempMarkerPos({
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
            });
        }
        setIsDragging(false);
    }, []);

    const handleConfirmLocation = () => {
        setLat(tempMarkerPos.lat);
        setLong(tempMarkerPos.lng);
        setOpenMaps(false);
    };

    // Handler untuk Autocomplete
    const onLoadAutocomplete = useCallback((ac: google.maps.places.Autocomplete) => {
        setAutocomplete(ac);
    }, []);

    const onPlaceChanged = useCallback(() => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place.geometry && place.geometry.location) {
                const newLat = place.geometry.location.lat();
                const newLng = place.geometry.location.lng();
                setTempMarkerPos({ lat: newLat, lng: newLng });
            } else {
                console.log('Alamat tidak ditemukan atau tidak valid.');
            }
        }
    }, [autocomplete]);


    // --- RENDER ---
    // Kembali menggunakan pengecekan loading seperti kode asli Anda
    if (typeof window === "undefined" || !window.google || !window.google.maps.places) {
        return <div>Loading Maps...</div>;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Input Pencarian Alamat */}
            <div className="px-7 w-full">
                <Autocomplete
                    onLoad={onLoadAutocomplete}
                    onPlaceChanged={onPlaceChanged}
                >
                    <input
                        type="text"
                        placeholder="Cari alamat atau nama tempat..."
                        style={{
                            boxSizing: `border-box`,
                            border: `1px solid #ccc`,
                            width: `100%`,
                            height: `40px`,
                            padding: `0 12px`,
                            borderRadius: `8px`,
                            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.1)`,
                            fontSize: `14px`,
                            outline: `none`,
                        }}
                    />
                </Autocomplete>
            </div>

            {/* Instruksi dan Tombol "Temukan Lokasi Saya" */}
            <div className='flex justify-between items-center px-7'>
                <p className='tracking-[-0.05em] text-[16px] text-[#111111] w-[75%]'>
                    Tetapkan pin yang tepat. Kami akan mengantarkan ke lokasi peta. Mohon periksa apakah sudah benar, jika belum klik peta untuk menyesuaikan.
                </p>
                <button
                    onClick={handleFindMyLocation}
                    className='text-[14px] font-semibold text-[#FFFFFF] h-[30px] bg-[#563D7C] px-2 rounded'
                >
                    Temukan Lokasi Saya
                </button>
            </div>

            {/* Peta untuk Mobile */}
            <div className="md:hidden">
                <GoogleMap
                    mapContainerStyle={containerStyleMobile}
                    center={tempMarkerPos}
                    zoom={18}
                >
                    <div style={{ position: "fixed", zIndex: 0, width: "100%", padding: "10px" }}>
                        <div style={{ background: "white", padding: "10px" }}>
                            <p className="text-gray-400">Alamat Kamu</p>
                            <p>{fullAddressStreet}</p>
                        </div>
                    </div>

                    {!isDragging && (
                        <Marker position={tempMarkerPos} icon={{ url: "/icon-old/pin-shadow.svg", scaledSize: new window.google.maps.Size(50, 20), anchor: new window.google.maps.Point(25, 10), }} clickable={false} draggable={false} zIndex={0} />
                    )}
                    <Marker position={tempMarkerPos} draggable onDragStart={onDragStart} onDragEnd={onDragEnd} icon={{ url: "/icon-old/pin-maps.svg", scaledSize: new window.google.maps.Size(40, 40), anchor: new window.google.maps.Point(20, 40), }} title="Geser saya!" zIndex={1} />
                    {!isDragging && (
                        <OverlayView position={tempMarkerPos} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: "translate(-50%, -110%)", marginTop: "-40px", width: "100vh" }}>
                                <div style={{ backgroundColor: "var(--primary-color)", color: "#FFFFFF", padding: "8px 16px", borderRadius: "24px", boxShadow: "0 2px 6px rgba(0,0,0,0.2)", textAlign: "center", fontSize: "13px", lineHeight: "1.4", fontWeight: 500, }}>
                                    <div style={{ fontWeight: 600 }}>Alamatmu di sini</div>
                                    <div style={{ fontSize: "12px", fontWeight: 400 }}>Silakan periksa lokasi petamu sudah benar</div>
                                </div>
                                <div style={{ width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "8px solid var(--primary-color)", marginTop: "-1px" }} />
                            </div>
                        </OverlayView>
                    )}
                </GoogleMap>
            </div>

            {/* Peta untuk Desktop */}
            <div className="hidden md:block p-4 pt-0 pb-0">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={tempMarkerPos}
                    zoom={18}
                >
                    {!isDragging && (
                        <Marker position={tempMarkerPos} icon={{ url: "/icon-old/pin-shadow.svg", scaledSize: new window.google.maps.Size(50, 20), anchor: new window.google.maps.Point(25, 10), }} clickable={false} draggable={false} zIndex={0} />
                    )}
                    <Marker position={tempMarkerPos} draggable onDragStart={onDragStart} onDragEnd={onDragEnd} icon={{ url: "/icon-old/pin-maps.svg", scaledSize: new window.google.maps.Size(40, 40), anchor: new window.google.maps.Point(20, 40), }} title="Geser saya!" zIndex={1} />
                    {!isDragging && (
                        <OverlayView position={tempMarkerPos} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: "translate(-50%, -110%)", marginTop: "-40px", width: "100vh" }}>
                                <div style={{ backgroundColor: "var(--primary-color)", color: "#FFFFFF", padding: "8px 16px", borderRadius: "24px", boxShadow: "0 2px 6px rgba(0,0,0,0.2)", textAlign: "center", fontSize: "13px", lineHeight: "1.4", fontWeight: 500, }}>
                                    <div style={{ fontWeight: 600 }}>Alamatmu di sini</div>
                                    <div style={{ fontSize: "12px", fontWeight: 400 }}>Silakan periksa lokasi petamu sudah benar</div>
                                </div>
                                <div style={{ width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "8px solid var(--primary-color)", marginTop: "-1px" }} />
                            </div>
                        </OverlayView>
                    )}
                </GoogleMap>
                <div className="flex justify-end items-center gap-4 py-4 px-2">
                    <button onClick={() => setOpenMaps(false)} className="h-[44px] hidden md:block rounded-[10px] text-[#333333] font-semibold text-[16px] bg-white border border-[#AAAAAA] w-[100px]">Nanti Saja</button>
                    <button onClick={handleConfirmLocation} className="h-[44px] rounded-[10px] bg-[#563D7C] text-white font-semibold text-[14px] w-[100px]">
                        Konfirmasi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(MapWithDraggableSvgPin);