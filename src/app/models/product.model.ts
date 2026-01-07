export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: 'USD' | 'EUR' | 'ILS';
  category: string;
  stock: number;
  isActive: boolean;
  createdAt: number; // unix timestamp (ms)
  updatedAt: number; // unix timestamp (ms)
}


//Add currecy pipe