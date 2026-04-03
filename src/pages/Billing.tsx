import { useState, useMemo } from "react";
import { MOCK_MEDICINES } from "@/data/mockData";
import type { Medicine, CartItem } from "@/types/pharmacy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Plus, Minus, Trash2, ShoppingCart, Receipt, X } from "lucide-react";
import { toast } from "sonner";

export default function Billing() {
  const [medicines] = useState<Medicine[]>(MOCK_MEDICINES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [customerName, setCustomerName] = useState("Walk-in");
  const [showInvoice, setShowInvoice] = useState(false);
  const [lastInvoice, setLastInvoice] = useState<{ invoice: string; items: CartItem[]; total: number; customer: string } | null>(null);

  const searchResults = useMemo(() => {
    if (!search) return [];
    const s = search.toLowerCase();
    return medicines.filter((m) => m.name.toLowerCase().includes(s) && m.stock > 0).slice(0, 5);
  }, [search, medicines]);

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0), [cart]);

  const addToCart = (med: Medicine) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.medicine.id === med.id);
      if (existing) {
        if (existing.quantity >= med.stock) { toast.error("Insufficient stock"); return prev; }
        return prev.map((c) => c.medicine.id === med.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { medicine: med, quantity: 1 }];
    });
    setSearch("");
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => prev.map((c) => {
      if (c.medicine.id !== id) return c;
      const newQty = c.quantity + delta;
      if (newQty <= 0) return c;
      if (newQty > c.medicine.stock) { toast.error("Insufficient stock"); return c; }
      return { ...c, quantity: newQty };
    }));
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((c) => c.medicine.id !== id));

  const handleCheckout = () => {
    if (cart.length === 0) { toast.error("Cart is empty"); return; }
    const invoice = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setLastInvoice({ invoice, items: [...cart], total, customer: customerName });
    setShowInvoice(true);
    setCart([]);
    setCustomerName("Walk-in");
    toast.success("Sale completed!");
  };

  // Suspicious transaction detection (rule-based)
  const isSuspicious = total > 3000;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Billing (POS)</h1>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Product Search & Cart */}
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Search Medicine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Type medicine name..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              {searchResults.length > 0 && (
                <div className="mt-2 rounded-md border">
                  {searchResults.map((m) => (
                    <button key={m.id} onClick={() => addToCart(m)}
                      className="flex w-full items-center justify-between p-3 text-left hover:bg-muted transition-colors border-b last:border-b-0">
                      <div>
                        <p className="text-sm font-medium">{m.name}</p>
                        <p className="text-xs text-muted-foreground">Stock: {m.stock} | ₹{m.price}</p>
                      </div>
                      <Plus className="h-4 w-4 text-primary" />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShoppingCart className="h-4 w-4" /> Cart ({cart.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">Search and add medicines to cart</p>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.medicine.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.medicine.name}</p>
                        <p className="text-xs text-muted-foreground">₹{item.medicine.price} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(item.medicine.id, -1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(item.medicine.id, 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                        <span className="w-16 text-right text-sm font-semibold">₹{(item.medicine.price * item.quantity).toFixed(0)}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeFromCart(item.medicine.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Checkout Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Checkout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Customer Name</label>
                <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </div>
              <Separator />
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.medicine.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.medicine.name} × {item.quantity}</span>
                    <span>₹{(item.medicine.price * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{total.toFixed(0)}</span>
              </div>
              {isSuspicious && (
                <div className="rounded-md bg-warning/10 p-2 text-xs text-warning">
                  ⚠ High-value transaction detected — review before confirming.
                </div>
              )}
              <Button className="w-full" size="lg" onClick={handleCheckout} disabled={cart.length === 0}>
                <Receipt className="mr-2 h-4 w-4" /> Complete Sale
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoice && lastInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Invoice - {lastInvoice.invoice}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowInvoice(false)}><X className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Customer: {lastInvoice.customer}</p>
              <Separator />
              {lastInvoice.items.map((item) => (
                <div key={item.medicine.id} className="flex justify-between text-sm">
                  <span>{item.medicine.name} × {item.quantity}</span>
                  <span>₹{(item.medicine.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{lastInvoice.total.toFixed(0)}</span>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                {new Date().toLocaleString()} • MedLink Pharmacy
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
