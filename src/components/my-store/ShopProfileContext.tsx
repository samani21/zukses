import { createContext, useContext } from 'react';

export interface ShopData {
    logo_url: string;
    shop_name: string;
    description: string;
    id: number
}

export const ShopProfileContext = createContext<ShopData | null>(null);

export const useShopProfile = () => useContext(ShopProfileContext);
