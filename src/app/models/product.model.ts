export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: 'USD' | 'EUR' | 'ILS';
  category?: string;
  stock: number;
  isActive: boolean;
  createdAt: number; // unix timestamp (ms)
  updatedAt: number; // unix timestamp (ms)
}


export type ProductCreate = Omit<Product, 'id'>
export type ProductUpdate = Product

export interface ProductFormValues {
  name: string
  description: string
  price: number
  currency: 'USD' | 'EUR' | 'ILS'
  category?: string
  stock: number
  isActive: boolean
}