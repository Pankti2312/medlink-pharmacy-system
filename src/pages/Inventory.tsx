import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_MEDICINES } from "@/data/mockData";
import type { Medicine } from "@/types/pharmacy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function Inventory() {
  const { hasRole } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>(MOCK_MEDICINES);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Medicine | null>(null);
  const [form, setForm] = useState({ name: "", generic_name: "", category: "", manufacturer: "", batch_number: "", price: "", stock: "", min_stock: "10", expiry_date: "" });

  const filtered = useMemo(() => {
    if (!search) return medicines;
    const s = search.toLowerCase();
    return medicines.filter((m) => m.name.toLowerCase().includes(s) || m.category.toLowerCase().includes(s));
  }, [medicines, search]);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", generic_name: "", category: "", manufacturer: "", batch_number: "", price: "", stock: "", min_stock: "10", expiry_date: "" });
    setDialogOpen(true);
  };

  const openEdit = (m: Medicine) => {
    setEditing(m);
    setForm({
      name: m.name, generic_name: m.generic_name || "", category: m.category,
      manufacturer: m.manufacturer || "", batch_number: m.batch_number || "",
      price: String(m.price), stock: String(m.stock), min_stock: String(m.min_stock),
      expiry_date: m.expiry_date.split("T")[0],
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.category || !form.price || !form.stock || !form.expiry_date) {
      toast.error("Please fill all required fields");
      return;
    }
    const now = new Date().toISOString();
    if (editing) {
      setMedicines((prev) => prev.map((m) => m.id === editing.id ? {
        ...m, ...form, price: Number(form.price), stock: Number(form.stock),
        min_stock: Number(form.min_stock), expiry_date: form.expiry_date + "T00:00:00", updated_at: now,
      } : m));
      toast.success("Medicine updated");
    } else {
      const newMed: Medicine = {
        id: String(Date.now()), ...form, generic_name: form.generic_name || null,
        manufacturer: form.manufacturer || null, batch_number: form.batch_number || null,
        price: Number(form.price), stock: Number(form.stock), min_stock: Number(form.min_stock),
        expiry_date: form.expiry_date + "T00:00:00", created_at: now, updated_at: now,
      };
      setMedicines((prev) => [...prev, newMed]);
      toast.success("Medicine added");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
    toast.success("Medicine deleted");
  };

  const isExpiringSoon = (date: string) => {
    const d = new Date(date);
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + 30);
    return d <= threshold;
  };

  const canEdit = hasRole("admin", "manager");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search medicines..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          {canEdit && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAdd}><Plus className="mr-1 h-4 w-4" /> Add</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editing ? "Edit Medicine" : "Add Medicine"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1"><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                  <div className="space-y-1"><Label>Generic Name</Label><Input value={form.generic_name} onChange={(e) => setForm({ ...form, generic_name: e.target.value })} /></div>
                  <div className="space-y-1"><Label>Category *</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
                  <div className="space-y-1"><Label>Manufacturer</Label><Input value={form.manufacturer} onChange={(e) => setForm({ ...form, manufacturer: e.target.value })} /></div>
                  <div className="space-y-1"><Label>Batch No.</Label><Input value={form.batch_number} onChange={(e) => setForm({ ...form, batch_number: e.target.value })} /></div>
                  <div className="space-y-1"><Label>Price *</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
                  <div className="space-y-1"><Label>Stock *</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
                  <div className="space-y-1"><Label>Min Stock</Label><Input type="number" value={form.min_stock} onChange={(e) => setForm({ ...form, min_stock: e.target.value })} /></div>
                  <div className="col-span-full space-y-1"><Label>Expiry Date *</Label><Input type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} /></div>
                </div>
                <Button onClick={handleSave} className="mt-2">{editing ? "Update" : "Add Medicine"}</Button>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="hidden md:table-cell">Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  {canEdit && <TableHead className="w-20">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{m.name}</p>
                        <p className="text-xs text-muted-foreground sm:hidden">{m.category}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{m.category}</TableCell>
                    <TableCell>₹{m.price}</TableCell>
                    <TableCell>{m.stock}</TableCell>
                    <TableCell className="hidden md:table-cell">{new Date(m.expiry_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {m.stock <= m.min_stock && <Badge variant="destructive" className="text-xs">Low</Badge>}
                        {isExpiringSoon(m.expiry_date) && <Badge className="bg-warning text-warning-foreground text-xs">Expiring</Badge>}
                        {m.stock > m.min_stock && !isExpiringSoon(m.expiry_date) && <Badge variant="secondary" className="text-xs">OK</Badge>}
                      </div>
                    </TableCell>
                    {canEdit && (
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(m)}>
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          {hasRole("admin") && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(m.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No medicines found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
