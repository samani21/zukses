// components/GoogleMapsProvider.tsx
import React from "react";
import { useJsApiLoader } from "@react-google-maps/api";

type Props = {
  children: React.ReactNode;
};

export const GoogleMapsProvider = ({ children }: Props) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"], // kalau kamu pakai autocomplete
  });

  if (loadError) return <div>Gagal memuat Google Maps</div>;
  if (!isLoaded) return <div>Memuat Peta...</div>;

  return <>{children}</>;
};
