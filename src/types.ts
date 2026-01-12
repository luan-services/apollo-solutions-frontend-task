export interface Category {
    id?: number;
    name: string;
}

export interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    brand: string;
    category_id: number; // foreign key
}

export interface Sale {
    id: number;
    quantity: number;
    total_price: number;
    date: Date | string;
}

export interface DashboardData {
    summary: {
        total_revenue: number;
        total_sales: number;
        total_products: number;
        total_categories: number;
    };
    charts: {
        monthly_revenue: {
            date: string;
            total: number;
        }[];
    };
}
