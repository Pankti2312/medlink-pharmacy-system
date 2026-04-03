export type UserRole = "admin" | "manager" | "staff";

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface Medicine {
  id: string;
  name: string;
  generic_name: string | null;
  category: string;
  manufacturer: string | null;
  batch_number: string | null;
  price: number;
  stock: number;
  min_stock: number;
  expiry_date: string;
  created_at: string;
  updated_at: string;
}

export interface SaleItem {
  id: string;
  medicine_id?: string;
  medicine_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  invoice_number: string;
  customer_name: string;
  total_amount: number;
  created_at: string;
  items: SaleItem[];
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface DashboardStats {
  total_medicines: number;
  low_stock_count: number;
  expiring_count: number;
  total_revenue: number;
  total_transactions: number;
  today_sales: number;
}
