import { useState } from "react";
import { Search, MoreHorizontal, Eye, Ban, CheckCircle, Mail } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { sampleCustomers, Customer } from "@/data/mock-data";
import { useTranslation } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const Customers = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [noteText, setNoteText] = useState("");

  const filtered = customers.filter(c => {
    const ms = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    return ms && (!statusFilter || c.status === statusFilter);
  });

  const toggleStatus = (id: string) => {
    setCustomers(prev => prev.map(c =>
      c.id === id ? { ...c, status: c.status === "active" ? "blocked" as const : "active" as const } : c
    ));
    toast.success("Customer status updated");
    setSelected(null);
  };

  const addNote = (id: string) => {
    if (!noteText.trim()) return;
    setCustomers(prev => prev.map(c =>
      c.id === id ? { ...c, notes: noteText } : c
    ));
    setNoteText("");
    toast.success("Note added");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div><h1 className="font-display text-2xl text-foreground">{t("admin.customers")}</h1><p className="font-body text-sm text-muted-foreground mt-1">{customers.length} {t("admin.totalCustomers")}</p></div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder={`${t("common.search")}...`} value={search} onChange={e => setSearch(e.target.value)} className="ps-9 font-body" /></div>
          <div className="flex gap-2">
            <Button variant={!statusFilter ? "default" : "outline"} size="sm" className="font-body text-xs" onClick={() => setStatusFilter("")}>{t("common.all")}</Button>
            <Button variant={statusFilter === "active" ? "default" : "outline"} size="sm" className="font-body text-xs" onClick={() => setStatusFilter("active")}>{t("customers.active")}</Button>
            <Button variant={statusFilter === "blocked" ? "default" : "outline"} size="sm" className="font-body text-xs" onClick={() => setStatusFilter("blocked")}>{t("customers.blocked")}</Button>
          </div>
        </div>
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
                  <TableCell className="font-body text-sm font-semibold text-foreground text-right">{c.totalSpent.toLocaleString()} TND</TableCell>
                  <TableCell className="font-body text-xs text-muted-foreground">{new Date(c.joinedAt).toLocaleDateString()}</TableCell>
                  <TableCell><Badge variant={c.status === "active" ? "outline" : "destructive"} className="font-body text-xs">{c.status === "active" ? t("customers.active") : t("customers.blocked")}</Badge></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="font-body text-sm">
                        <DropdownMenuItem onClick={() => setSelected(c)}><Eye className="w-4 h-4 me-2" />{t("customers.viewProfile")}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info(`Email sent to ${c.email}`)}><Mail className="w-4 h-4 me-2" />Send Email</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStatus(c.id)} className={c.status === "active" ? "text-destructive" : ""}>
                          {c.status === "active" ? <><Ban className="w-4 h-4 me-2" />Block</> : <><CheckCircle className="w-4 h-4 me-2" />Unblock</>}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}</TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Customer Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-display">{selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="font-body text-xs text-muted-foreground">{t("customers.email")}</p><p className="font-body text-sm">{selected.email}</p></div>
                <div><p className="font-body text-xs text-muted-foreground">{t("customers.status")}</p><Badge variant={selected.status === "active" ? "outline" : "destructive"} className="font-body text-xs">{selected.status}</Badge></div>
                <div><p className="font-body text-xs text-muted-foreground">{t("customers.orders")}</p><p className="font-body text-sm font-semibold">{selected.orders}</p></div>
                <div><p className="font-body text-xs text-muted-foreground">{t("customers.spent")}</p><p className="font-body text-sm font-semibold">{selected.totalSpent.toLocaleString()} TND</p></div>
                <div><p className="font-body text-xs text-muted-foreground">{t("customers.joined")}</p><p className="font-body text-sm">{new Date(selected.joinedAt).toLocaleDateString()}</p></div>
                <div><p className="font-body text-xs text-muted-foreground">Avg. Order</p><p className="font-body text-sm">{selected.orders > 0 ? (selected.totalSpent / selected.orders).toFixed(2) : "0"} TND</p></div>
              </div>
              <Separator />
              {selected.notes && (
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="font-body text-xs text-muted-foreground mb-1">Notes</p>
                  <p className="font-body text-sm text-foreground">{selected.notes}</p>
                </div>
              )}
              <div>
                <Label className="font-body text-sm">{t("customers.addNote")}</Label>
                <div className="flex gap-2 mt-1">
                  <Textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add a note about this customer..." className="flex-1" />
                </div>
                <Button size="sm" className="mt-2 font-body" onClick={() => addNote(selected.id)}>Save Note</Button>
              </div>
              <Separator />
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 font-body" onClick={() => toast.info(`Email sent to ${selected.email}`)}>
                  <Mail className="w-4 h-4 me-2" />Send Email
                </Button>
                <Button
                  variant={selected.status === "active" ? "destructive" : "default"}
                  className="flex-1 font-body"
                  onClick={() => toggleStatus(selected.id)}
                >
                  {selected.status === "active" ? <><Ban className="w-4 h-4 me-2" />Block</> : <><CheckCircle className="w-4 h-4 me-2" />Unblock</>}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};
export default Customers;
