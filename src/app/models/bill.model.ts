export interface Bill {
  id: number;
  customerId: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  billMonth: string;
  generatedAt: string;
  totalAmount: number;
  isPaid: boolean;
  items: BillItem[];
}

export interface BillItem {
  productName: string;
  totalQuantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
}

export interface GenerateBillDto {
  customerId: number;
  year: number;
  month: number;
}

export interface BulkPayDto {
  customerId: number;
  billIds: number[];
}