// src/components/AutocompleteAddress/utils.ts

import { Option, AutocompleteOption, AddressComponent } from "./types";

export function isAutocompleteOption(option: Option): option is AutocompleteOption {
    return option !== undefined && typeof option === 'object' && 'compilationID' in option;
}

export const getFullLabel = (province?: string, city?: string, district?: string, postcode?: string): string => {
    return [province, city, district, postcode].filter(Boolean).join(', ');
};

export const findComponent = (components: AddressComponent[], type: string): string => {
    const component = components.find(c => c.types.includes(type));
    return component ? component.long_name : '';
};

export const escapeRegExp = (str: string): string => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};