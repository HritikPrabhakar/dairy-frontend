export interface Dashboard {
  totalCustomers: number;
  activeCustomers: number;
  todayRevenue: number;
  monthRevenue: number;
  todayPaid: number;
  todayUnpaid: number;
  pendingBills: number;
  topProducts: TopProduct[];
  recentBills: RecentBill[];
}

export interface TopProduct {
  productName: string;
  totalQuantity: number;
  unit: string;
}

export interface RecentBill {
  billId: number;
  customerName: string;
  amount: number;
  isPaid: boolean;
  billMonth: string;
}