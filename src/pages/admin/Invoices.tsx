import { useState } from "react";
import { Search, Plus, Download, Send, Eye, MoreHorizontal, FileText, Ban, RotateCcw } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useTranslation } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; qty: number; unitPrice: number; total: number }[];
  subtotal: number;
  tax: number;
  taxRate: number;
  shipping: number;
  discount: number;
  total: number;
  status: "draft" | "sent" | "paid" | "overdue" | "void" | "refunded";
  issuedAt: string;
  dueAt: string;
  paidAt?: string;
  notes?: string;
}

const sampleInvoices: Invoice[] = [
  { id: "inv1", invoiceNumber: "INV-2026-001284", orderId: "1", orderNumber: "ORD-2026-001284", customerName: "Emma Thompson", customerEmail: "emma@example.com",
    items: [{ name: "Cashmere Oversized Sweater", qty: 1, unitPrice: 289, total: 289 }, { name: "Cashmere Scarf", qty: 1, unitPrice: 165, total: 165 }],
    subtotal: 454, tax: 36.32, taxRate: 8, shipping: 0, discount: 0, total: 490.32, status: "paid", issuedAt: "2026-02-08", dueAt: "2026-02-08", paidAt: "2026-02-08" },
  { id: "inv2", invoiceNumber: "INV-2026-001285", orderId: "2", orderNumber: "ORD-2026-001285", customerName: "James Chen", customerEmail: "james.c@example.com",
    items: [{ name: "Leather Tote Bag", qty: 1, unitPrice: 425, total: 425 }],
    subtotal: 425, tax: 35.20, taxRate: 8, shipping: 15, discount: 0, total: 475.20, status: "paid", issuedAt: "2026-02-08", dueAt: "2026-02-08", paidAt: "2026-02-08" },
  { id: "inv3", invoiceNumber: "INV-2026-001286", orderId: "3", orderNumber: "ORD-2026-001286", customerName: "Sophie Martin", customerEmail: "sophie.m@example.com",
    items: [{ name: "Silk Midi Dress", qty: 1, unitPrice: 375, total: 375 }, { name: "Gold Minimal Watch", qty: 1, unitPrice: 695, total: 695 }, { name: "Botanical Face Oil", qty: 2, unitPrice: 88, total: 176 }],
    subtotal: 1246, tax: 99.68, taxRate: 8, shipping: 0, discount: 0, total: 1345.68, status: "sent", issuedAt: "2026-02-07", dueAt: "2026-02-21" },
  { id: "inv4", invoiceNumber: "INV-2026-001287", orderId: "4", orderNumber: "ORD-2026-001287", customerName: "Alex Rivera", customerEmail: "alex.r@example.com",
    items: [{ name: "Soy Candle Trio", qty: 2, unitPrice: 78, total: 156 }, { name: "Linen Throw Blanket", qty: 1, unitPrice: 220, total: 220 }],
    subtotal: 376, tax: 31.04, taxRate: 8, shipping: 12, discount: 0, total: 419.04, status: "overdue", issuedAt: "2026-01-25", dueAt: "2026-02-08" },
  { id: "inv5", invoiceNumber: "INV-2026-001288", orderId: "5", orderNumber: "ORD-2026-001288", customerName: "Olivia Park", customerEmail: "olivia.p@example.com",
    items: [{ name: "Tailored Wool Coat", qty: 1, unitPrice: 495, total: 495 }],
    subtotal: 495, tax: 39.60, taxRate: 8, shipping: 0, discount: 0, total: 534.60, status: "refunded", issuedAt: "2026-02-06", dueAt: "2026-02-06", paidAt: "2026-02-06" },
  { id: "inv6", invoiceNumber: "INV-2026-001289", orderId: "", orderNumber: "", customerName: "Lucas Bernard", customerEmail: "lucas.b@example.com",
    items: [{ name: "Custom Consultation", qty: 1, unitPrice: 250, total: 250 }],
    subtotal: 250, tax: 20, taxRate: 8, shipping: 0, discount: 0, total: 270, status: "draft", issuedAt: "2026-02-09", dueAt: "2026-02-23" },
];

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground", sent: "bg-info/10 text-info", paid: "bg-success/10 text-success",
  overdue: "bg-destructive/10 text-destructive", void: "bg-muted text-muted-foreground", refunded: "bg-warning/10 text-warning",
};

const Invoices = () => {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState<Invoice[]>(sampleInvoices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [lineItems, setLineItems] = useState([{ name: "", qty: 1, unitPrice: 0 }]);

  const statuses = ["draft", "sent", "paid", "overdue", "void", "refunded"];
  const filtered = invoices.filter(inv => {
    const ms = inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) || inv.customerName.toLowerCase().includes(search.toLowerCase());
    return ms && (!statusFilter || inv.status === statusFilter);
  });

  const totalRevenue = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const totalOutstanding = invoices.filter(i => i.status === "sent" || i.status === "overdue").reduce((s, i) => s + i.total, 0);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const items = lineItems.filter(l => l.name).map(l => ({ ...l, total: l.qty * l.unitPrice }));
    const subtotal = items.reduce((s, i) => s + i.total, 0);
    const taxRate = Number(fd.get("taxRate") || 8);
    const tax = subtotal * taxRate / 100;
    const shipping = Number(fd.get("shipping") || 0);
    const discount = Number(fd.get("discount") || 0);
    const newInv: Invoice = {
      id: `inv${Date.now()}`, invoiceNumber: `INV-2026-${String(invoices.length + 1290).padStart(6, "0")}`,
      orderId: "", orderNumber: fd.get("orderNumber") as string || "",
      customerName: fd.get("customerName") as string, customerEmail: fd.get("customerEmail") as string,
      items, subtotal, tax, taxRate, shipping, discount, total: subtotal + tax + shipping - discount,
      status: "draft", issuedAt: new Date().toISOString().split("T")[0], dueAt: fd.get("dueAt") as string,
      notes: fd.get("notes") as string,
    };
    setInvoices(prev => [newInv, ...prev]);
    setCreateOpen(false);
    setLineItems([{ name: "", qty: 1, unitPrice: 0 }]);
    toast.success("Invoice created");
  };

  const updateStatus = (id: string, status: Invoice["status"]) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status, ...(status === "paid" ? { paidAt: new Date().toISOString().split("T")[0] } : {}) } : i));
    toast.success(`Invoice marked as ${status}`);
    setSelected(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div><h1 className="font-display text-2xl text-foreground">Invoices</h1><p className="font-body text-sm text-muted-foreground mt-1">{invoices.length} total invoices</p></div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild><Button className="font-body"><Plus className="w-4 h-4 me-2" />Create Invoice</Button></DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader><DialogTitle className="font-display">Create New Invoice</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="font-body text-sm">Customer Name</Label><Input name="customerName" required className="mt-1" /></div>
                  <div><Label className="font-body text-sm">Customer Email</Label><Input name="customerEmail" type="email" required className="mt-1" /></div>
                  <div><Label className="font-body text-sm">Order Reference</Label><Input name="orderNumber" className="mt-1" placeholder="ORD-2026-..." /></div>
                  <div><Label className="font-body text-sm">Due Date</Label><Input name="dueAt" type="date" required className="mt-1" /></div>
                </div>
                <Separator />
                <div>
                  <div className="flex items-center justify-between mb-2"><Label className="font-body text-sm font-semibold">Line Items</Label>
                    <Button type="button" variant="outline" size="sm" className="font-body" onClick={() => setLineItems(prev => [...prev, { name: "", qty: 1, unitPrice: 0 }])}><Plus className="w-3 h-3 me-1" />Add Line</Button>
                  </div>
                  <div className="space-y-2">
                    {lineItems.map((item, i) => (
                      <div key={i} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-5"><Input placeholder="Item description" value={item.name} onChange={e => { const n = [...lineItems]; n[i].name = e.target.value; setLineItems(n); }} /></div>
                        <div className="col-span-2"><Input type="number" placeholder="Qty" value={item.qty} onChange={e => { const n = [...lineItems]; n[i].qty = Number(e.target.value); setLineItems(n); }} /></div>
                        <div className="col-span-3"><Input type="number" step="0.01" placeholder="Unit price" value={item.unitPrice || ""} onChange={e => { const n = [...lineItems]; n[i].unitPrice = Number(e.target.value); setLineItems(n); }} /></div>
                        <div className="col-span-1 text-end font-body text-sm font-medium">{(item.qty * item.unitPrice).toFixed(2)} TND</div>
                        <div className="col-span-1">{lineItems.length > 1 && <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => setLineItems(prev => prev.filter((_, j) => j !== i))}><Ban className="w-3 h-3" /></Button>}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><Label className="font-body text-sm">Tax Rate (%)</Label><Input name="taxRate" type="number" step="0.01" defaultValue="8" className="mt-1" /></div>
                  <div><Label className="font-body text-sm">{t("cart.shipping")} (TND)</Label><Input name="shipping" type="number" step="0.01" defaultValue="0" className="mt-1" /></div>
                  <div><Label className="font-body text-sm">Discount (TND)</Label><Input name="discount" type="number" step="0.01" defaultValue="0" className="mt-1" /></div>
                </div>
                <div><Label className="font-body text-sm">Notes</Label><Textarea name="notes" className="mt-1" placeholder="Additional notes for this invoice..." /></div>
                <Button type="submit" className="w-full font-body">Create Invoice</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Invoiced", value: `${invoices.reduce((s, i) => s + i.total, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} TND` },
            { label: "Collected", value: `${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })} TND` },
            { label: "Outstanding", value: `${totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })} TND` },
            { label: "Overdue", value: invoices.filter(i => i.status === "overdue").length.toString() },
          ].map(k => (
            <div key={k.label} className="p-4 rounded-lg border border-border bg-card">
              <p className="font-body text-2xl font-semibold text-foreground">{k.value}</p>
              <p className="font-body text-xs text-muted-foreground mt-1">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1"><Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder={`${t("common.search")}...`} value={search} onChange={e => setSearch(e.target.value)} className="ps-9 font-body" /></div>
          <div className="flex gap-2 flex-wrap">
            <Button variant={!statusFilter ? "default" : "outline"} size="sm" className="font-body text-xs" onClick={() => setStatusFilter("")}>{t("common.all")}</Button>
            {statuses.map(s => <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm" className="font-body text-xs capitalize" onClick={() => setStatusFilter(s)}>{s}</Button>)}
          </div>
        </div>

        {/* Table */}
        <div className="border border-border rounded-lg overflow-hidden bg-card"><div className="overflow-x-auto">
          <Table><TableHeader><TableRow>
            <TableHead className="font-body text-xs">Invoice #</TableHead>
            <TableHead className="font-body text-xs">{t("customers.name")}</TableHead>
            <TableHead className="font-body text-xs">Order</TableHead>
            <TableHead className="font-body text-xs text-right">{t("cart.total")}</TableHead>
            <TableHead className="font-body text-xs">{t("customers.status")}</TableHead>
            <TableHead className="font-body text-xs">Issued</TableHead>
            <TableHead className="font-body text-xs">Due</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow></TableHeader>
          <TableBody>{filtered.map(inv => (
            <TableRow key={inv.id} className="hover:bg-secondary/30">
              <TableCell className="font-body text-sm font-medium text-foreground">{inv.invoiceNumber}</TableCell>
              <TableCell><p className="font-body text-sm text-foreground">{inv.customerName}</p><p className="font-body text-xs text-muted-foreground">{inv.customerEmail}</p></TableCell>
              <TableCell className="font-body text-sm text-muted-foreground">{inv.orderNumber || "—"}</TableCell>
              <TableCell className="font-body text-sm font-semibold text-foreground text-right">{inv.total.toFixed(2)} TND</TableCell>
              <TableCell><Badge variant="outline" className={`font-body text-xs capitalize ${statusColors[inv.status]}`}>{inv.status}</Badge></TableCell>
              <TableCell className="font-body text-xs text-muted-foreground">{new Date(inv.issuedAt).toLocaleDateString()}</TableCell>
              <TableCell className="font-body text-xs text-muted-foreground">{new Date(inv.dueAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelected(inv)}><Eye className="w-4 h-4" /></Button>
                  <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="font-body text-sm">
                      <DropdownMenuItem onClick={() => toast.success("PDF downloaded")}><Download className="w-4 h-4 me-2" />Download PDF</DropdownMenuItem>
                      {inv.status === "draft" && <DropdownMenuItem onClick={() => updateStatus(inv.id, "sent")}><Send className="w-4 h-4 me-2" />Send to Customer</DropdownMenuItem>}
                      {(inv.status === "sent" || inv.status === "overdue") && <DropdownMenuItem onClick={() => updateStatus(inv.id, "paid")}><FileText className="w-4 h-4 me-2" />Mark as Paid</DropdownMenuItem>}
                      {inv.status === "paid" && <DropdownMenuItem onClick={() => updateStatus(inv.id, "refunded")}><RotateCcw className="w-4 h-4 me-2" />Refund</DropdownMenuItem>}
                      {inv.status !== "void" && inv.status !== "refunded" && <DropdownMenuItem onClick={() => updateStatus(inv.id, "void")} className="text-destructive"><Ban className="w-4 h-4 me-2" />Void Invoice</DropdownMenuItem>}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}</TableBody></Table>
        </div></div>
      </div>

      {/* Invoice Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">{selected?.invoiceNumber}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div><p className="font-body text-sm"><strong>Customer:</strong> {selected.customerName}</p><p className="font-body text-xs text-muted-foreground">{selected.customerEmail}</p></div>
                <Badge variant="outline" className={`font-body text-xs capitalize ${statusColors[selected.status]}`}>{selected.status}</Badge>
              </div>
              {selected.orderNumber && <p className="font-body text-sm text-muted-foreground">Order: {selected.orderNumber}</p>}
              <div className="flex gap-4 font-body text-xs text-muted-foreground"><span>Issued: {new Date(selected.issuedAt).toLocaleDateString()}</span><span>Due: {new Date(selected.dueAt).toLocaleDateString()}</span>{selected.paidAt && <span>Paid: {new Date(selected.paidAt).toLocaleDateString()}</span>}</div>
              <Separator />
              <Table><TableHeader><TableRow>
                <TableHead className="font-body text-xs">Item</TableHead>
                <TableHead className="font-body text-xs text-right">Qty</TableHead>
                <TableHead className="font-body text-xs text-right">Unit Price</TableHead>
                <TableHead className="font-body text-xs text-right">{t("cart.total")}</TableHead>
              </TableRow></TableHeader><TableBody>
                {selected.items.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-body text-sm">{item.name}</TableCell>
                    <TableCell className="font-body text-sm text-right">{item.qty}</TableCell>
                    <TableCell className="font-body text-sm text-right">{item.unitPrice.toFixed(2)} TND</TableCell>
                    <TableCell className="font-body text-sm font-medium text-right">{item.total.toFixed(2)} TND</TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>
              <div className="space-y-1 pt-2">
                <div className="flex justify-between font-body text-sm"><span className="text-muted-foreground">{t("cart.subtotal")}</span><span>{selected.subtotal.toFixed(2)} TND</span></div>
                <div className="flex justify-between font-body text-sm"><span className="text-muted-foreground">{t("cart.tax")} ({selected.taxRate}%)</span><span>{selected.tax.toFixed(2)} TND</span></div>
                {selected.shipping > 0 && <div className="flex justify-between font-body text-sm"><span className="text-muted-foreground">{t("cart.shipping")}</span><span>{selected.shipping.toFixed(2)} TND</span></div>}
                {selected.discount > 0 && <div className="flex justify-between font-body text-sm"><span className="text-success">Discount</span><span className="text-success">-{selected.discount.toFixed(2)} TND</span></div>}
                <Separator />
                <div className="flex justify-between font-body text-base font-semibold"><span>{t("cart.total")}</span><span>{selected.total.toFixed(2)} TND</span></div>
              </div>
              {selected.notes && <div className="bg-secondary/30 rounded-lg p-3"><p className="font-body text-xs text-muted-foreground">Notes</p><p className="font-body text-sm mt-1">{selected.notes}</p></div>}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="font-body" onClick={() => toast.success("PDF downloaded")}><Download className="w-4 h-4 me-2" />Download PDF</Button>
                {selected.status === "draft" && <Button className="font-body" onClick={() => updateStatus(selected.id, "sent")}><Send className="w-4 h-4 me-2" />Send Invoice</Button>}
                {(selected.status === "sent" || selected.status === "overdue") && <Button className="font-body" onClick={() => updateStatus(selected.id, "paid")}>Mark as Paid</Button>}
                {selected.status === "paid" && <Button variant="outline" className="font-body" onClick={() => updateStatus(selected.id, "refunded")}><RotateCcw className="w-4 h-4 me-2" />Refund</Button>}
                {selected.status !== "void" && selected.status !== "refunded" && <Button variant="destructive" className="font-body" onClick={() => updateStatus(selected.id, "void")}>Void</Button>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};
export default Invoices;
