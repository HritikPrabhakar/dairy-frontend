export interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  products: CustomerProduct[];
}

export interface CustomerProduct {
  productId: number;
  productName: string;
  quantity: number;
  unit: string;
}

export interface CreateCustomerDto {
  name: string;
  phone: string;
  address: string;
  email: string;
  products: { productId: number; quantity: number }[];
}

export interface Product {
  id: number;
  name: string;
  pricePerUnit: number;
  unit: string;
  isActive: boolean;
}