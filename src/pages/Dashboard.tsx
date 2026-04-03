import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_MEDICINES, MOCK_SALES, MOCK_STATS } from "@/data/mockData";
import {
  Package, AlertTriangle, TrendingUp, ShoppingCart,
  Clock, IndianRupee,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const statCards = [
  { label: "Total Revenue", key: "total_revenue" as const, icon: IndianRupee, format: (v: number) => `₹${v.toLocaleString()}`, color: "text-primary" },
  { label: "Today's Sales", key: "today_sales" as const, icon: TrendingUp, format: (v: number) => `₹${v.toLocaleString()}`, color: "text-success" },
  { label: "Low Stock", key: "low_stock_count" as const, icon: AlertTriangle, format: (v: number) => `${v} items`, color: "text-warning" },
  { label: "Expiring Soon", key: "expiring_count" as const, icon: Clock, format: (v: number) => `${v} items`, color: "text-destructive" },
];

export default function Dashboard() {
  const stats = MOCK_STATS;
  const lowStock = useMemo(() => MOCK_MEDICINES.filter((m) => m.stock <= m.min_stock), []);
  const chartData = useMemo(() => {
    const salesByDate: Record<string, number> = {};
    MOCK_SALES.forEach((s) => {
      const date = new Date(s.created_at).toLocaleDateString();
      salesByDate[date] = (salesByDate[date] || 0) + s.total_amount;
    });
    return Object.entries(salesByDate).map(([date, total]) => ({ date, total }));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.key}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`rounded-lg bg-muted p-2.5 ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="text-xl font-bold">{card.format(stats[card.key])}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(val: number) => [`₹${val}`, "Revenue"]} />
                <Bar dataKey="total" fill="hsl(172, 66%, 36%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-warning" /> Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStock.length === 0 ? (
              <p className="text-sm text-muted-foreground">All items are well stocked.</p>
            ) : (
              <div className="space-y-3">
                {lowStock.map((m) => (
                  <div key={m.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.category}</p>
                    </div>
                    <Badge variant={m.stock === 0 ? "destructive" : "secondary"}>
                      {m.stock} left
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_SALES.slice(0, 5).map((sale) => (
              <div key={sale.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{sale.invoice_number}</p>
                    <p className="text-xs text-muted-foreground">{sale.customer_name} • {new Date(sale.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <p className="font-semibold">₹{sale.total_amount}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
