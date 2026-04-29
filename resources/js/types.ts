export interface Product {
    id: number;
    name: string;
    slug?: string;
    description?: string;
    price: number | string;
    solo_price?: number;
    package_price?: number;
    package_qty?: number | string;
    package_unit?: string;
    category?: any;
    category_id?: number | string;
    status?: 'in_stock' | 'pre_order' | 'sold_out';
    rating?: number | string;
    reviews_count?: number;
    image: string;
    solo_image?: string;
    package_image?: string;
    img?: string;
    thumbnail?: string;
    is_featured?: boolean;
    is_new?: boolean;
    is_top_rated?: boolean;
    stock?: number;
    created_at?: string;
    updated_at?: string;
}

