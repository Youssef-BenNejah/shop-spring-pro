import { useState } from "react";
import { Search, MoreHorizontal } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { sampleCustomers } from "@/data/mock-data";
import { useTranslation } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const Customers = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const filtered = sampleCustomers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div><h1 className="font-display text-2xl text-foreground">{t("admin.customers")}</h1><p className="font-body text-sm text-muted-foreground mt-1">{sampleCustomers.length} {t("admin.totalCustomers")}</p></div>
        <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder={`${t("common.search")}...`} value={search} onChange={e => setSearch(e.target.value)} className="ps-9 font-body" /></div>
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow>
                <TableHead className="font-body text-xs">{t("customers.name")}</TableHead>
                <TableHead className="font-body text-xs">{t("customers.email")}</TableHead>
                <TableHead className="font-body text-xs text-right">{t("customers.orders")}</TableHead>
                <TableHead className="font-body text-xs text-right">{t("customers.spent")}</TableHead>
                <TableHead className="font-body text-xs">{t("customers.joined")}</TableHead>
                <TableHead className="font-body text-xs">{t("customers.status")}</TableHead>
                <TableHead className="font-body text-xs w-10"></TableHead>
              </TableRow></TableHeader>
              <TableBody>{filtered.map(c => (
                <TableRow key={c.id} className="hover:bg-secondary/30">
                  <TableCell className="font-body text-sm font-medium text-foreground">{c.name}</TableCell>
                  <TableCell className="font-body text-sm text-muted-foreground">{c.email}</TableCell>
                  <TableCell className="font-body text-sm text-foreground text-right">{c.orders}</TableCell>
                  <TableCell className="font-body text-sm font-semibold text-foreground text-right">${c.totalSpent.toLocaleString()}</TableCell>
                  <TableCell className="font-body text-xs text-muted-foreground">{new Date(c.joinedAt).toLocaleDateString()}</TableCell>
                  <TableCell><Badge variant={c.status === "active" ? "outline" : "destructive"} className="font-body text-xs">{c.status === "active" ? t("customers.active") : t("customers.blocked")}</Badge></TableCell>
                  <TableCell><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info(`${t("customers.viewProfile")}: ${c.name}`)}><MoreHorizontal className="w-4 h-4" /></Button></TableCell>
                </TableRow>
              ))}</TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default Customers;
