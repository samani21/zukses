type Media = {
    id: string;
    url: string;
    type: string;
};
type Combination = Record<string, string>;

export type VarianPrice = {
    id: number;
    product_id: number;
    image: string;
    price: number | string;
    discount_price: number | string;
    stock: number;
    discount_percent: number;
    variant_code?: string;
    combination: Combination;
};

// types.ts atau sejenisnya
export type ProductVariantCombination = {
    id: number;
    product_id: number;
    image: string;
    price: number | string;
    discount_price: number | string;
    stock: number;
    discount_percent: number;
    variant_code?: string;
    combination: Record<string, string>;
};

type Value = {
    id: number;
    variant_id: number;
    value: string;
    ordinal: number;
}
type Variant = {
    id: number;
    product_id: number;
    ordinal: number;
    values?: Value[] | null;
};
type Delivery = {
    id: number;
    address_shop_id: number;
    height: number;
    insurance: number;
    is_cost_by_seller: number;
    is_dangerous_product: number;
    is_pre_order: number;
    length: number;
    product_id: number;
    service_ids: number[];
    subsidy: number;
    weight: number;
    width: number;
};



export type Product = {
    id: number;
    saller_id: number;
    name: string;
    category_id: number;
    category_name: string;
    is_used: number;
    price: number;
    stock: number;
    sales: number;
    desc: string;
    sku: string;
    min_purchase: number;
    max_purchase: string | number;
    image: string;
    media?: Media[] | null;
    status: string;
    variant_prices?: VarianPrice[] | null;
    variants?: Variant[];
    variant_group_names?: string[];
    is_cod_enabled?: number,
    voucher?: number,
    delivery?: Delivery;
    combinations?: ProductVariantCombination[] | null;
};


