import { createContext, useContext } from 'react';

interface Address {
    name_shop: string;
    number_shop: string;
    province_id: string;
    citie_id: string;
    subdistrict_id: string;
    postal_code_id: string;
    full_address: string;
    label: string;
    lat: number;
    long: number;
    is_primary: number;
}
export interface ShopData {
    logo_url: string;
    shop_name: string;
    description: string;
    type: string;
    ktp_url: string;
    selfie_url: string;
    full_name: string;
    nik: string;
    id: number;
    address: Address;
}

export const ShopProfileContext = createContext<ShopData | null>(null);

export const useShopProfile = () => useContext(ShopProfileContext);
