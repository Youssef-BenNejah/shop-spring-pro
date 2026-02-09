import { useState } from "react";
import { Search, Download, Eye } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { sampleOrders } from "@/data/mock-data";
import { useTranslation } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/types/ecommerce";
import { toast } from "sonner";

const sts: Record<string, string> = { pending: "bg-warning/10 text-warning", processing: "bg-info/10 text-info", shipped: "bg-accent/10 text-accent-foreground", delivered: "bg-success/10 text-success", cancelled: "bg-destructive/10 text-destructive" };
const ps: Record<string, string> = { paid: "bg-success/10 text-success", pending: "bg-warning/10 text-warning", refunded: "bg-muted text-muted-foreground" };

const AdminOrders = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
  const filtered = sampleOrders.filter(o => { const ms = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.customer.name.toLowerCase().includes(search.toLowerCase()); return ms && (!statusFilter || o.status === statusFilter); });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="font-display text-2xl text-foreground">{t("admin.orders")}</h1><p className="font-body text-sm text-muted-foreground mt-1">{sampleOrders.length} {t("admin.totalOrders")}</p></div>
          <Button variant="outline" className="font-body" onClick={() => toast.success("CSV exported")}><Download className="w-4 h-4 me-2" />{t("admin.export")}</Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1"><Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder={`${t("common.search")}...`} value={search} onChange={e => setSearch(e.target.value)} className="ps-9 font-body" /></div>
          <div className="flex gap-2 flex-wrap">
            <Button variant={!statusFilter ? "default" : "outline"} size="sm" className="font-body text-xs" onClick={() => setStatusFilter("")}>{t("common.all")}</Button>
            {statuses.map(s => <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm" className="font-body text-xs capitalize" onClick={() => setStatusFilter(s)}>{s}</Button>)}
          </div>
        </div>
        <div className="border border-border rounded-lg overflow-hidden bg-card"><div className="overflow-x-auto">
          <Table><TableHeader><TableRow>
            <TableHead className="font-body text-xs">Order</TableHead><TableHead className="font-body text-xs">{t("customers.name")}</TableHead>
            <TableHead className="font-body text-xs">{t("admin.items")}</TableHead><TableHead className="font-body text-xs text-right">{t("cart.total")}</TableHead>
            <TableHead className="font-body text-xs">{t("customers.status")}</TableHead><TableHead className="font-body text-xs">{t("settings.payment")}</TableHead>
            <TableHead className="font-body text-xs">Date</TableHead><TableHead className="w-10"></TableHead>
          </TableRow></TableHeader>
          <TableBody>{filtered.map(o => (
            <TableRow key={o.id} className="hover:bg-secondary/30">
              <TableCell className="font-body text-sm font-medium text-foreground">{o.orderNumber}</TableCell>
              <TableCell><p className="font-body text-sm text-foreground">{o.customer.name}</p><p className="font-body text-xs text-muted-foreground">{o.customer.email}</p></TableCell>
              <TableCell className="font-body text-sm text-muted-foreground">{o.items.length} {t("admin.items")}</TableCell>
              <TableCell className="font-body text-sm font-semibold text-foreground text-right">${o.total.toFixed(2)}</TableCell>
              <TableCell><span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${sts[o.status]}`}>{o.status}</span></TableCell>
              <TableCell><span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${ps[o.paymentStatus]}`}>{o.paymentStatus}</span></TableCell>
              <TableCell className="font-body text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</TableCell>
              <TableCell><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelected(o)}><Eye className="w-4 h-4" /></Button></TableCell>
            </TableRow>
          ))}</TableBody></Table>
        </div></div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent><DialogHeader><DialogTitle className="font-display">{selected?.orderNumber}</DialogTitle></DialogHeader>
          {selected && (<div className="space-y-4">
            <div><p className="font-body text-sm"><strong>{t("customers.name")}:</strong> {selected.customer.name}</p><p className="font-body text-sm text-muted-foreground">{selected.customer.email}</p></div>
            <Separator />
            <div className="space-y-2">{selected.items.map((item, i) => (<div key={i} className="flex justify-between font-body text-sm"><span>{item.name} × {item.quantity}</span><span>${(item.price * item.quantity).toFixed(2)}</span></div>))}</div>
            <Separator />
            <div className="space-y-1 font-body text-sm"><div className="flex justify-between"><span>{t("cart.subtotal")}</span><span>${selected.subtotal.toFixed(2)}</span></div><div className="flex justify-between"><span>{t("cart.shipping")}</span><span>${selected.shipping.toFixed(2)}</span></div><div className="flex justify-between"><span>{t("cart.tax")}</span><span>${selected.tax.toFixed(2)}</span></div><div className="flex justify-between font-semibold text-base"><span>{t("cart.total")}</span><span>${selected.total.toFixed(2)}</span></div></div>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1 font-body" onClick={() => { toast.success("Order status updated"); setSelected(null); }}>Mark Shipped</Button>
              <Button variant="outline" className="font-body" onClick={() => { toast.success("Invoice downloaded"); }}>Invoice PDF</Button>
            </div>
          </div>)}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};
export default AdminOrders;
