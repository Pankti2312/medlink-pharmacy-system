import type { Medicine, Sale, DashboardStats } from "@/types/pharmacy";

export const MOCK_MEDICINES: Medicine[] = [
  { id: "1", name: "Paracetamol 500mg", generic_name: "Acetaminophen", category: "Analgesic", manufacturer: "Sun Pharma", batch_number: "BP2024A", price: 25, stock: 150, min_stock: 20, expiry_date: "2025-12-15T00:00:00", created_at: "2024-01-01T00:00:00", updated_at: "2024-01-01T00:00:00" },
  { id: "2", name: "Amoxicillin 250mg", generic_name: "Amoxicillin", category: "Antibiotic", manufacturer: "Cipla", batch_number: "AX2024B", price: 85, stock: 5, min_stock: 10, expiry_date: "2025-06-20T00:00:00", created_at: "2024-01-01T00:00:00", updated_at: "2024-01-01T00:00:00" },
  { id: "3", name: "Cetirizine 10mg", generic_name: "Cetirizine", category: "Antihistamine", manufacturer: "Dr. Reddy's", batch_number: "CT2024C", price: 30, stock: 200, min_stock: 15, expiry_date: "2026-03-10T00:00:00", created_at: "2024-01-01T00:00:00", updated_at: "2024-01-01T00:00:00" },
  { id: "4", name: "Omeprazole 20mg", generic_name: "Omeprazole", category: "Antacid", manufacturer: "Lupin", batch_number: "OM2024D", price: 55, stock: 8, min_stock: 10, expiry_date: "2025-04-05T00:00:00", created_at: "2024-01-01T00:00:00", updated_at: "2024-01-01T00:00:00" },
  { id: "5", name: "Metformin 500mg", generic_name: "Metformin", category: "Antidiabetic", manufacturer: "USV", batch_number: "MF2024E", price: 40, stock: 100, min_stock: 20, expiry_date: "2026-08-22T00:00:00", created_at: "2024-01-01T00:00:00", updated_at: "2024-01-01T00:00:00" },
  { id: "6", name: "Atorvastatin 10mg", generic_name: "Atorvastatin", category: "Statin", manufacturer: "Ranbaxy", batch_number: "AT2024F", price: 65, stock: 75, min_stock: 10, expiry_date: "2026-01-30T00:00:00", created_at: "2024-01-01T00:00:00", updated_at: "2024-01-01T00:00:00" },
  { id: "7", name: "Azithromycin 500mg", generic_name: "Azithromycin", category: "Antibiotic", manufacturer: "Cipla", batch_number: "AZ2024G", price: 120, stock: 3, min_stock: 10, expiry_date: "2025-05-15T00:00:00", created_at: "2024-01-01T00:00:00", updated_at: "2024-01-01T00:00:00" },
  { id: "8", name: "Ibuprofen 400mg", generic_name: "Ibuprofen", category: "Analgesic", manufacturer: "Abbott", batch_number: "IB2024H", price: 35, stock: 180, min_stock: 20, expiry_date: "2026-11-01T00:00:00", created_at: "2024-01-01T00:00:00", updated_at: "2024-01-01T00:00:00" },
];

export const MOCK_SALES: Sale[] = [
  { id: "1", invoice_number: "INV-20240301-A1B2", customer_name: "Rajesh Kumar", total_amount: 285, created_at: "2026-04-03T10:30:00", items: [
    { id: "s1", medicine_name: "Paracetamol 500mg", quantity: 3, unit_price: 25, subtotal: 75 },
    { id: "s2", medicine_name: "Amoxicillin 250mg", quantity: 2, unit_price: 85, subtotal: 170 },
    { id: "s3", medicine_name: "Cetirizine 10mg", quantity: 1, unit_price: 30, subtotal: 30 },
  ]},
  { id: "2", invoice_number: "INV-20240301-C3D4", customer_name: "Priya Sharma", total_amount: 160, created_at: "2026-04-03T11:45:00", items: [
    { id: "s4", medicine_name: "Omeprazole 20mg", quantity: 2, unit_price: 55, subtotal: 110 },
    { id: "s5", medicine_name: "Metformin 500mg", quantity: 1, unit_price: 40, subtotal: 40 },
  ]},
  { id: "3", invoice_number: "INV-20240302-E5F6", customer_name: "Walk-in", total_amount: 5200, created_at: "2026-04-02T14:20:00", items: [
    { id: "s6", medicine_name: "Azithromycin 500mg", quantity: 40, unit_price: 120, subtotal: 4800 },
    { id: "s7", medicine_name: "Metformin 500mg", quantity: 10, unit_price: 40, subtotal: 400 },
  ]},
];

export const MOCK_STATS: DashboardStats = {
  total_medicines: 8,
  low_stock_count: 3,
  expiring_count: 2,
  total_revenue: 5645,
  total_transactions: 3,
  today_sales: 445,
};
