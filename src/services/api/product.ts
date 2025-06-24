// src/types/product.ts

export type FileWithPreview = {
    file: File;
    preview: string;
};

export type VariationOption = {
    id: number;
    name: string;
};

export type Variation = {
    id: number;
    name: string;
    options: VariationOption[];
};

export type ProductVariant = {
    combination: Record<string, string>;
    price: number | string;
    stock: number | string;
    sku: string;
    image?: FileWithPreview | null;
};

export type Category = {
    id: number;
    name: string;
    parent_id: number | null;
    children?: Category[];
};

export type FormErrors = {
    productName?: string;
    description?: string;
    productPhotos?: string;
    promoPhoto?: string;
};

export type TabName = 'dasar' | 'media' | 'spesifikasi' | 'lainnya';