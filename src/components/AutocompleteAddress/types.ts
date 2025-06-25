// src/components/AutocompleteAddress/types.ts

export type AutocompleteOption = {
    label: string;
    code: string;
    compilationID: {
        province_id: number;
        province_name: string;
        city_id: number;
        city_name: string;
        district_id: number;
        district_name: string;
        postcode_id: number;
        postcode_code: string;
    };
};

export type SimpleOption = { label: string; code: string; };

export type Option = AutocompleteOption | SimpleOption;

export interface Province { id: number; name: string; }
export interface City { id: number; name: string; }
export interface District { id: number; name: string; }
export interface Postcode { id: number; code: string; }

export type SelectedAddress = {
    province: { id: number; name: string } | null;
    city: { id: number; name: string } | null;
    district: { id: number; name: string } | null;
    postcode: { id: number; code: string } | null;
};

export interface LocationDetails {
    province: string;
    city: string;
    district: string;
    postalCode: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
}

export interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}

export type AutocompleteProps = {
    setFullAddress: (value: string) => void;
    setFullAddressStreet: (value: string) => void;
    setProv: (value: number) => void;
    setCity: (value: number) => void;
    setDistrict: (value: number) => void;
    setPostCode: (value: number) => void;
    dataFullAddress?: string;
    openModalAddAddress?: boolean;
    isEdit?: boolean;
    provinces: string;
    cities: string;
    subdistricts: string;
    postal_codes: string;
    province_id: number;
    citie_id: number;
    subdistrict_id: number;
    postal_code_id: number;
    setLat: (lat: number) => void;
    setLong: (lng: number) => void;
    setKodePos: (lng: string) => void;
};

