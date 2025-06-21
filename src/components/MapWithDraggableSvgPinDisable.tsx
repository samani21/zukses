import React, { useMemo } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import {
    ButtonMapsContainer,
    ButtonShowMaps,
    MapsContainer,
} from "./Profile/AddressComponent";

const containerStyle = {
    width: "100%",
    height: "200px",
};

const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    draggable: false,
    scrollwheel: false,
    gestureHandling: "none", // pastikan nilainya adalah salah satu dari: 'cooperative' | 'greedy' | 'none' | 'auto'
};


type MapWithStaticPinProps = {
    lat: number;
    lng: number;
    setOpenMaps: (value: boolean) => void;
};

const MapWithStaticPinAndDisable = ({
    lat,
    lng,
    setOpenMaps,
}: MapWithStaticPinProps) => {
    const position = useMemo(() => ({ lat, lng }), [lat, lng]);

    // Hindari render jika Google Maps belum siap (di-handle oleh GoogleMapsProvider)
    if (typeof window === "undefined" || !window.google) {
        return <div>Loading Maps...</div>;
    }

    return (
        <MapsContainer onClick={() => setOpenMaps(true)}>
            <ButtonMapsContainer>
                <ButtonShowMaps className="show-maps-btn">
                    Lihat Maps
                </ButtonShowMaps>
            </ButtonMapsContainer>

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={position}
                zoom={18}
                options={mapOptions}
            >
                {/* Shadow marker */}
                <Marker
                    position={position}
                    icon={{
                        url: "/icon-old/pin-shadow.svg",
                        scaledSize: new window.google.maps.Size(50, 20),
                        anchor: new window.google.maps.Point(25, 10),
                    }}
                    clickable={false}
                    draggable={false}
                    zIndex={0}
                />

                {/* Main pin marker */}
                <Marker
                    position={position}
                    draggable={false}
                    icon={{
                        url: "/icon-old/pin-maps.svg",
                        scaledSize: new window.google.maps.Size(40, 40),
                        anchor: new window.google.maps.Point(20, 40),
                    }}
                    title="Lokasi tetap"
                    zIndex={1}
                />
            </GoogleMap>
        </MapsContainer>
    );
};

export default React.memo(MapWithStaticPinAndDisable);
