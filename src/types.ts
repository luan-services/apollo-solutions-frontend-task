export interface Category {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    brand: string;
}

export interface Sale {
    id: number;
    quantity: number;
    total_price: number;
    date: Date;
}

export interface DashboardData {
    summary: {
        total_revenue: number;
        total_sales: number;
    };
    monthly_data: {
        date: string;
        total: number;
    }[];
}

export interface ProductData {
    total_products: number;
}

export interface CategoryData {
    total_categories: number;
}