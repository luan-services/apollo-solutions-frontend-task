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