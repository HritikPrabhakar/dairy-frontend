export interface DailyRecord {
  id: number;
  customerId: number;
  customerName: string;
  date: string;
  isPaid: boolean;
  isDelivered: boolean;
  notes?: string;
  totalAmount: number;
  items: DailyRecordItem[];
}

export interface DailyRecordItem {
  productId: number;
  productName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  total: number;
}

export interface BulkMarkDto {
  date: string;
  customers: CustomerMarkDto[];
}

export interface CustomerMarkDto {
  customerId: number;
  isPaid: boolean;
  isDelivered: boolean;
}