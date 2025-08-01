import { createContext, useContext } from 'react';

interface Address {
    name_shop?: string;
    number_shop?: string;
    provinces?: string;
    cities?: string;
    subdistricts?: string;
    postal_codes?: string;
    full_address?: string;
    detail_address?: string;
    id?: number;
    lat?: number;
    long?: number;
    is_primary?: number;
    is_store?: number;
    province_id?: number;
    citie_id?: number;
    subdistrict_id?: number;
    postal_code_id?: number;
}

interface Bank {
    account_name: string;
    account_number: string;
}
interface Delivery {
    seller_id: string;
    enabled_service_ids: number[];
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
    bank: Bank;
    delivery: Delivery;
}

export const ShopProfileContext = createContext<ShopData | null>(null);

export const useShopProfile = () => useContext(ShopProfileContext);
