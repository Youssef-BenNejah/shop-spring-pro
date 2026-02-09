import { useState } from "react";
import { Search, Eye, Ban, Play, UserCog } from "lucide-react";
import SuperAdminLayout from "@/components/platform/SuperAdminLayout";
import { sampleStores } from "@/data/platform-data";
import { useTranslation } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Store } from "@/types/platform";
import { toast } from "sonner";

const statusColors: Record<string, string> = { active: "bg-success/10 text-success", trial: "bg-info/10 text-info", suspended: "bg-destructive/10 text-destructive", cancelled: "bg-muted text-muted-foreground" };

const Stores = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Store | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const filtered = sampleStores.filter(s => {
    const ms = s.name.toLowerCase().includes(search.toLowerCase()) || s.ownerEmail.toLowerCase().includes(search.toLowerCase());
    return ms && (!statusFilter || s.status === statusFilter);
  });

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div><h1 className="font-display text-2xl text-foreground">{t("superAdmin.storeManagement")}</h1><p className="font-body text-sm text-muted-foreground mt-1">{sampleStores.length} {t("superAdmin.totalStores").toLowerCase()}</p></div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1"><Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder={`${t("common.search")}...`} value={search} onChange={e => setSearch(e.target.value)} className="ps-9 font-body" /></div>
          <div className="flex gap-2 flex-wrap">
            {["", "active", "trial", "suspended", "cancelled"].map(s => (
              <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm" className="font-body text-xs capitalize" onClick={() => setStatusFilter(s)}>{s || t("common.all")}</Button>
            ))}
          </div>
        </div>
        <div className="border border-border rounded-lg overflow-hidden bg-card"><div className="overflow-x-auto">
          <Table><TableHeader><TableRow>
            <TableHead className="font-body text-xs">Store</TableHead><TableHead className="font-body text-xs">Owner</TableHead>
            <TableHead className="font-body text-xs">Plan</TableHead><TableHead className="font-body text-xs">Status</TableHead>
            <TableHead className="font-body text-xs text-right">Revenue</TableHead><TableHead className="font-body text-xs text-right">Products</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow></TableHeader>
          <TableBody>{filtered.map(s => (
            <TableRow key={s.id} className="hover:bg-secondary/30">
              <TableCell><p className="font-body text-sm font-medium text-foreground">{s.name}</p><p className="font-body text-xs text-muted-foreground">{s.subdomain}.maison.app</p></TableCell>
              <TableCell><p className="font-body text-sm text-foreground">{s.ownerName}</p><p className="font-body text-xs text-muted-foreground">{s.ownerEmail}</p></TableCell>
              <TableCell><Badge variant="secondary" className="font-body text-xs capitalize">{s.planTier}</Badge></TableCell>
              <TableCell><Badge variant="outline" className={`font-body text-xs capitalize ${statusColors[s.status]}`}>{s.status}</Badge></TableCell>
              <TableCell className="font-body text-sm font-semibold text-foreground text-right">${s.revenue.toLocaleString()}</TableCell>
              <TableCell className="font-body text-sm text-foreground text-right">{s.productCount}</TableCell>
              <TableCell><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelected(s)}><Eye className="w-4 h-4" /></Button></TableCell>
            </TableRow>
          ))}</TableBody></Table>
        </div></div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent><DialogHeader><DialogTitle className="font-display">{selected?.name}</DialogTitle></DialogHeader>
          {selected && (<div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="font-body text-xs text-muted-foreground">Owner</p><p className="font-body text-sm">{selected.ownerName}</p></div>
              <div><p className="font-body text-xs text-muted-foreground">Email</p><p className="font-body text-sm">{selected.ownerEmail}</p></div>
              <div><p className="font-body text-xs text-muted-foreground">Plan</p><Badge variant="secondary" className="font-body text-xs capitalize">{selected.planTier}</Badge></div>
              <div><p className="font-body text-xs text-muted-foreground">Status</p><Badge variant="outline" className={`font-body text-xs capitalize ${statusColors[selected.status]}`}>{selected.status}</Badge></div>
              <div><p className="font-body text-xs text-muted-foreground">Revenue</p><p className="font-body text-sm font-semibold">${selected.revenue.toLocaleString()}</p></div>
              <div><p className="font-body text-xs text-muted-foreground">Created</p><p className="font-body text-sm">{new Date(selected.createdAt).toLocaleDateString()}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button variant="outline" className="font-body text-sm" onClick={() => { toast.success("Impersonating " + selected.ownerName); setSelected(null); }}><UserCog className="w-4 h-4 me-2" />{t("superAdmin.impersonate")}</Button>
              {selected.status === "active" ? (
                <Button variant="destructive" className="font-body text-sm" onClick={() => { toast.success("Store suspended"); setSelected(null); }}><Ban className="w-4 h-4 me-2" />{t("superAdmin.suspend")}</Button>
              ) : (
                <Button variant="default" className="font-body text-sm" onClick={() => { toast.success("Store reactivated"); setSelected(null); }}><Play className="w-4 h-4 me-2" />{t("superAdmin.reactivate")}</Button>
              )}
            </div>
          </div>)}
        </DialogContent>
      </Dialog>
    </SuperAdminLayout>
  );
};

export default Stores;
