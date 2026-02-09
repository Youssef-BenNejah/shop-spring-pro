import { useState } from "react";
import { Search, Download, Eye } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { sampleOrders } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const statusStyles: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  processing: "bg-info/10 text-info",
  shipped: "bg-accent/10 text-accent-foreground",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

const paymentStyles: Record<string, string> = {
  paid: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  refunded: "bg-muted text-muted-foreground",
};

const AdminOrders = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

  const filtered = sampleOrders.filter(o => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.customer.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-foreground">Orders</h1>
            <p className="font-body text-sm text-muted-foreground mt-1">{sampleOrders.length} total orders</p>
          </div>
          <Button variant="outline" className="font-body">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 font-body" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant={!statusFilter ? "default" : "outline"} size="sm" className="font-body text-xs" onClick={() => setStatusFilter("")}>All</Button>
            {statuses.map(s => (
              <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm" className="font-body text-xs capitalize" onClick={() => setStatusFilter(s)}>
                {s}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-body text-xs">Order</TableHead>
                  <TableHead className="font-body text-xs">Customer</TableHead>
                  <TableHead className="font-body text-xs">Items</TableHead>
                  <TableHead className="font-body text-xs text-right">Total</TableHead>
                  <TableHead className="font-body text-xs">Status</TableHead>
                  <TableHead className="font-body text-xs">Payment</TableHead>
                  <TableHead className="font-body text-xs">Date</TableHead>
                  <TableHead className="font-body text-xs w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((order) => (
                  <TableRow key={order.id} className="hover:bg-secondary/30">
                    <TableCell className="font-body text-sm font-medium text-foreground">{order.orderNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-body text-sm text-foreground">{order.customer.name}</p>
                        <p className="font-body text-xs text-muted-foreground">{order.customer.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-body text-sm text-muted-foreground">{order.items.length} items</TableCell>
                    <TableCell className="font-body text-sm font-semibold text-foreground text-right">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[order.status]}`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${paymentStyles[order.paymentStatus]}`}>
                        {order.paymentStatus}
                      </span>
                    </TableCell>
                    <TableCell className="font-body text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
