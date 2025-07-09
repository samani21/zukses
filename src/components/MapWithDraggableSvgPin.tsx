import React, { useCallback, useEffect, useState } from "react";
import { GoogleMap, Marker, OverlayView } from "@react-google-maps/api";
const containerStyle = {
    width: "100%",
    height: "450px",
};
const containerStyleMobile = {
    width: "100%",
    height: "70dvh",
};

const defaultCenter = {
    lat: -3.362371,
    lng: 114.593231,
};

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
    // Default posisi awal
    const initialPosition = {
        lat: lat ?? defaultCenter.lat,
        lng: long ?? defaultCenter.lng,
    };

    const [tempMarkerPos, setTempMarkerPos] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);

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

    // Cegah render jika belum tersedia
    if (typeof window === "undefined" || !window.google) {
        return <div>Loading Maps...</div>;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className=" md:hidden">
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
                        <Marker
                            position={tempMarkerPos}
                            icon={{
                                url: "/icon-old/pin-shadow.svg",
                                scaledSize: new window.google.maps.Size(50, 20),
                                anchor: new window.google.maps.Point(25, 10),
                            }}
                            clickable={false}
                            draggable={false}
                            zIndex={0}
                        />
                    )}

                    <Marker
                        position={tempMarkerPos}
                        draggable
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        icon={{
                            url: "/icon-old/pin-maps.svg",
                            scaledSize: new window.google.maps.Size(40, 40),
                            anchor: new window.google.maps.Point(20, 40),
                        }}
                        title="Geser saya!"
                        zIndex={1}
                    />

                    {!isDragging && (
                        <OverlayView
                            position={tempMarkerPos}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    transform: "translate(-50%, -110%)",
                                    marginTop: "-40px",
                                    width: "100vh",
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: "var(--primary-color)",
                                        color: "#FFFFFF",
                                        padding: "8px 16px",
                                        borderRadius: "24px",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                        textAlign: "center",
                                        fontSize: "13px",
                                        lineHeight: "1.4",
                                        fontWeight: 500,
                                    }}
                                >
                                    <div style={{ fontWeight: 600 }}>Alamatmu di sini</div>
                                    <div style={{ fontSize: "12px", fontWeight: 400 }}>
                                        Silakan periksa lokasi petamu sudah benar
                                    </div>
                                </div>

                                <div
                                    style={{
                                        width: 0,
                                        height: 0,
                                        borderLeft: "8px solid transparent",
                                        borderRight: "8px solid transparent",
                                        borderTop: "8px solid var(--primary-color)",
                                        marginTop: "-1px",
                                    }}
                                />
                            </div>
                        </OverlayView>
                    )}
                </GoogleMap>
            </div>
            <div className="hidden md:block p-4 pt-5 pb-0">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={tempMarkerPos}
                    zoom={18}
                >
                    {!isDragging && (
                        <Marker
                            position={tempMarkerPos}
                            icon={{
                                url: "/icon-old/pin-shadow.svg",
                                scaledSize: new window.google.maps.Size(50, 20),
                                anchor: new window.google.maps.Point(25, 10),
                            }}
                            clickable={false}
                            draggable={false}
                            zIndex={0}
                        />
                    )}

                    <Marker
                        position={tempMarkerPos}
                        draggable
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        icon={{
                            url: "/icon-old/pin-maps.svg",
                            scaledSize: new window.google.maps.Size(40, 40),
                            anchor: new window.google.maps.Point(20, 40),
                        }}
                        title="Geser saya!"
                        zIndex={1}
                    />

                    {!isDragging && (
                        <OverlayView
                            position={tempMarkerPos}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    transform: "translate(-50%, -110%)",
                                    marginTop: "-40px",
                                    width: "100vh",
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: "var(--primary-color)",
                                        color: "#FFFFFF",
                                        padding: "8px 16px",
                                        borderRadius: "24px",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                        textAlign: "center",
                                        fontSize: "13px",
                                        lineHeight: "1.4",
                                        fontWeight: 500,
                                    }}
                                >
                                    <div style={{ fontWeight: 600 }}>Alamatmu di sini</div>
                                    <div style={{ fontSize: "12px", fontWeight: 400 }}>
                                        Silakan periksa lokasi petamu sudah benar
                                    </div>
                                </div>

                                <div
                                    style={{
                                        width: 0,
                                        height: 0,
                                        borderLeft: "8px solid transparent",
                                        borderRight: "8px solid transparent",
                                        borderTop: "8px solid var(--primary-color)",
                                        marginTop: "-1px",
                                    }}
                                />
                            </div>
                        </OverlayView>
                    )}
                </GoogleMap>
            </div>

            <div className="p-4 bg-[#EEEEEE] h-[70px] flex justify-between md:justify-end gap-3">
                <button onClick={() => setOpenMaps(false)} className="hidden md:block rounded-[10px] text-[#333333] font-semibold text-[16px] bg-white border border-[#AAAAAA] w-[100px]">Nanti Saja</button>

                <button onClick={handleConfirmLocation} className="rounded-[10px] bg-[#563D7C] text-white font-semibold text-[14px] w-[100px]">
                    Konfirmasi
                </button>
            </div>
        </div>
    );
};

export default React.memo(MapWithDraggableSvgPin);
