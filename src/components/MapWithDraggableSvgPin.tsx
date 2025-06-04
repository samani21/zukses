import React, { useCallback, useEffect, useState } from "react";
import {
    GoogleMap,
    Marker,
    useJsApiLoader,
    OverlayView,
} from "@react-google-maps/api";
import { ButtonContainer, ButtonHold, ButtonOk } from "./Profile/AddressComponent";

const containerStyle = {
    width: "100%",
    height: "350px",
};

const defaultCenter = {
    lat: -3.362371,
    lng: 114.593231,
};

type Props = {
    lat?: number;
    long?: number;
    setLat: (value: number) => void;
    setLong: (value: number) => void;
    setOpenMaps: (value: boolean) => void;
};

const MapWithDraggableSvgPin = ({ lat, long, setLat, setLong, setOpenMaps }: Props) => {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    });

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
            const newPos = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
            };
            setTempMarkerPos(newPos); // Simpan sementara
        }
        setIsDragging(false);
    }, []);

    const handleConfirmLocation = () => {
        setLat(tempMarkerPos.lat);
        setLong(tempMarkerPos.lng);
        setOpenMaps(false)
    };

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={tempMarkerPos}
                zoom={18}
            >
                {!isDragging && (
                    <Marker
                        position={tempMarkerPos}
                        icon={{
                            url: "/icon/pin-shadow.svg",
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
                        url: "/icon/pin-maps.svg",
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
                                width: "100vh"
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

            <ButtonContainer style={{ padding: "20px", marginTop: "0px" }}>
                <ButtonHold onClick={() => setOpenMaps(false)}>
                    Nanti Saja
                </ButtonHold>
                <ButtonOk onClick={handleConfirmLocation}>
                    Konfirmasi
                </ButtonOk>
            </ButtonContainer>
        </div>
    );
};

export default React.memo(MapWithDraggableSvgPin);
