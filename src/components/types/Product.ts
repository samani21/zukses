export interface Thumbnail {
    id: number;
    url: string;
    alt: string;
}

export type variant = {
    id: number;
    combination_label: string;
    image: string;
    price: number
    discount_price: number
    discount_percent: number
};

export interface SellerStats {
    reviews: string;
    rating: number;
    reviewsCount: number;
    products: number;
    chatResponseRate: string;
    chatResponseTime: string;
    joined: string;
    followers: string;
}

export interface Seller {
    name: string;
    avatarUrl: string;
    lastActive: string;
    location: string;
    stats: SellerStats;
}

interface Specification {
    [key: string]: string | string[];
}
export interface Review {
    id: number;
    author: string;
    avatarUrl: string;
    rating: number;
    date: string;
    variant: string;
    comment: string;
    images: { id: number; url: string }[];
    videos: { id: number; thumbnailUrl: string }[];
    likes: number;
    sellerResponse?: {
        comment: string;
    };
}

export interface Media {
    id: number;
    url: string;
}

export type Product = {
    name: string;
    category: string;
    category_id: number;
    id: number;
    image: string;
    desc: string;
    price: number;
    rating: number;
    reviewsCount: number;
    soldCount: number;
    originalPrice: number;
    discountedPrice: number;
    is_cod_enabled: number;
    sold: number;
    vouchers: string[];
    thumbnails: Thumbnail[];
    variants: variant[];
    seller: Seller;
    specifications: Specification;
    reviews: Review[];
    media: Media[];
};

