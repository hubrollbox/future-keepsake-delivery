// Admin Dashboard Types

export interface AdminStats {
  totalDeliveries: number;
  pendingDeliveries: number;
  digitalMessages: number;
  warehouseItems: number;
  recentPayments: number;
  totalUsers: number;
  totalKeepsakes: number;
}

export interface DeliveryByMonth {
  month: string;
  count: number;
}

export interface TopUser {
  id: string;
  email: string;
  full_name: string | null;
  keepsakeCount: number;
}

// Delivery interface used in Dashboard components
export interface Delivery {
  id: string;
  title: string;
  recipient_name?: string;
  delivery_date: string;
  created_at: string;
  status: string | null;
  message?: string;
}
