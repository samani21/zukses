export type FileWithPreview = { file: File | null; preview: string; id?: string; type: 'image' | 'video' };
export type Variation = { id: number; name: string; options: string[]; };
export type ProductVariant = {
    id: number;
    combination: Record<string, string>;
    price: string;
    stock: string;
    sku: string;
    image: FileWithPreview | null;
    dikirimDalam?: string;
    weight?: string;
    length?: string;
    width?: string;
    height?: string;
};
export type ActiveDropdown = { type: 'name' | 'option'; id: number; optionIndex?: number; };
export type MaxPurchaseMode = 'unlimited' | 'per_order' | 'per_period';
export type MaxPurchasePerPeriod = { startDate: string; maxQty: string; days: string; recurring: boolean };
export type PackageDimensions = { length: string; width: string; height: string };
export type HighlightedSection = 'name' | 'description' | 'specifications' | null;