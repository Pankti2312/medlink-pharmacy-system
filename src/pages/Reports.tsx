import { useState, useMemo } from "react";
import { MOCK_SALES, MOCK_MEDICINES } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Send, Bot, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

function AIQuery() {
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState<{ q: string; a: string }[]>([]);

  const handleQuery = () => {
    if (!query.trim()) return;
    const q = query.toLowerCase();
    let answer = "";

    if (q.includes("today") && q.includes("sale")) {
      const todaySales = MOCK_SALES.filter((s) => new Date(s.created_at).toDateString() === new Date().toDateString());
      const total = todaySales.reduce((sum, s) => sum + s.total_amount, 0);
      answer = `Today's sales: ${todaySales.length} transactions, Total: ₹${total}`;
    } else if (q.includes("low stock")) {
      const low = MOCK_MEDICINES.filter((m) => m.stock <= m.min_stock);
      answer = `${low.length} items low on stock: ${low.map((m) => `${m.name} (${m.stock} left)`).join(", ")}`;
    } else if (q.includes("expir")) {
      const threshold = new Date(); threshold.setDate(threshold.getDate() + 30);
      const exp = MOCK_MEDICINES.filter((m) => new Date(m.expiry_date) <= threshold);
      answer = `${exp.length} items expiring within 30 days: ${exp.map((m) => m.name).join(", ")}`;
    } else if (q.includes("total") && (q.includes("sale") || q.includes("revenue"))) {
      const total = MOCK_SALES.reduce((sum, s) => sum + s.total_amount, 0);
      answer = `Total revenue: ₹${total} from ${MOCK_SALES.length} sales`;
    } else {
      answer = "Try: 'show today sales', 'low stock items', 'expiring medicines', 'total revenue'";
    }

    setResponses((prev) => [...prev, { q: query, a: answer }]);
    setQuery("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-4 w-4 text-primary" /> AI Query Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="max-h-64 space-y-3 overflow-y-auto">
          {responses.length === 0 && (
            <p className="text-sm text-muted-foreground">Ask questions like "show today sales" or "low stock items"</p>
          )}
          {responses.map((r, i) => (
            <div key={i} className="space-y-1">
              <p className="text-sm font-medium">Q: {r.q}</p>
              <p className="rounded-md bg-muted p-2 text-sm">{r.a}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask a question..."
            onKeyDown={(e) => e.key === "Enter" && handleQuery()} />
          <Button size="icon" onClick={handleQuery}><Send className="h-4 w-4" /></Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Reports() {
  const salesSummary = useMemo(() => {
    const byDate: Record<string, { count: number; total: number }> = {};
    MOCK_SALES.forEach((s) => {
      const date = new Date(s.created_at).toLocaleDateString();
      if (!byDate[date]) byDate[date] = { count: 0, total: 0 };
      byDate[date].count++;
      byDate[date].total += s.total_amount;
    });
    return Object.entries(byDate).map(([date, data]) => ({ date, ...data }));
  }, []);

  const suspicious = useMemo(() => {
    const avg = MOCK_SALES.reduce((s, sale) => s + sale.total_amount, 0) / (MOCK_SALES.length || 1);
    return MOCK_SALES.filter((s) => s.total_amount > avg * 3);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Reports</h1>

      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="suspicious">Suspicious</TabsTrigger>
          <TabsTrigger value="ai">AI Query</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Sales Summary</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesSummary.map((row) => (
                    <TableRow key={row.date}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.count}</TableCell>
                      <TableCell className="font-semibold">₹{row.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">All Transactions</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_SALES.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-mono text-xs">{sale.invoice_number}</TableCell>
                      <TableCell>{sale.customer_name}</TableCell>
                      <TableCell>{sale.items.length}</TableCell>
                      <TableCell className="font-semibold">₹{sale.total_amount}</TableCell>
                      <TableCell className="hidden sm:table-cell text-xs">{new Date(sale.created_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suspicious">
          <Card>
            <CardHeader><CardTitle className="text-base">Suspicious Transactions</CardTitle></CardHeader>
            <CardContent>
              {suspicious.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No suspicious transactions detected.</p>
              ) : (
                <div className="space-y-3">
                  {suspicious.map((s) => (
                    <div key={s.id} className="flex items-center justify-between rounded-lg border border-warning/30 bg-warning/5 p-3">
                      <div>
                        <p className="text-sm font-medium">{s.invoice_number}</p>
                        <p className="text-xs text-muted-foreground">{s.customer_name} • {new Date(s.created_at).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-warning text-warning-foreground">₹{s.total_amount}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <AIQuery />
        </TabsContent>
      </Tabs>
    </div>
  );
}
