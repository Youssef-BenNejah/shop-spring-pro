import { useState } from "react";
import { Plus, Tag } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { sampleCoupons, Coupon } from "@/data/mock-data";
import { useTranslation } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Marketing = () => {
  const { t } = useTranslation();
  const [coupons, setCoupons] = useState<Coupon[]>(sampleCoupons);
  const [open, setOpen] = useState(false);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newCoupon: Coupon = {
      id: `cp${Date.now()}`, code: (fd.get("code") as string).toUpperCase(), type: fd.get("type") as "percentage" | "fixed",
      value: Number(fd.get("value")), minOrder: Number(fd.get("minOrder") || 0), usageLimit: Number(fd.get("limit") || 100),
      used: 0, expiresAt: fd.get("expires") as string, active: true,
    };
    setCoupons(prev => [newCoupon, ...prev]);
    setOpen(false);
    toast.success(t("common.success"), { description: `Coupon ${newCoupon.code} created` });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="font-display text-2xl text-foreground">{t("admin.marketing")}</h1><p className="font-body text-sm text-muted-foreground mt-1">{t("marketing.coupons")}</p></div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="font-body"><Plus className="w-4 h-4 me-2" />{t("marketing.addCoupon")}</Button></DialogTrigger>
            <DialogContent><DialogHeader><DialogTitle className="font-display">{t("marketing.addCoupon")}</DialogTitle></DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4">
                <div><Label className="font-body text-sm">{t("marketing.code")}</Label><Input name="code" required className="mt-1" placeholder="SUMMER25" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="font-body text-sm">{t("marketing.type")}</Label>
                    <Select name="type" defaultValue="percentage"><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>
                      <SelectItem value="percentage">{t("marketing.percentage")}</SelectItem><SelectItem value="fixed">{t("marketing.fixed")}</SelectItem>
                    </SelectContent></Select></div>
                  <div><Label className="font-body text-sm">{t("marketing.value")}</Label><Input name="value" type="number" required className="mt-1" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="font-body text-sm">{t("marketing.minOrder")}</Label><Input name="minOrder" type="number" className="mt-1" defaultValue="0" /></div>
                  <div><Label className="font-body text-sm">{t("marketing.usageLimit")}</Label><Input name="limit" type="number" className="mt-1" defaultValue="100" /></div>
                </div>
                <div><Label className="font-body text-sm">{t("marketing.expires")}</Label><Input name="expires" type="date" required className="mt-1" /></div>
                <Button type="submit" className="w-full font-body">{t("marketing.addCoupon")}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="border border-border rounded-lg overflow-hidden bg-card"><div className="overflow-x-auto">
          <Table><TableHeader><TableRow>
            <TableHead className="font-body text-xs">{t("marketing.code")}</TableHead>
            <TableHead className="font-body text-xs">{t("marketing.type")}</TableHead>
            <TableHead className="font-body text-xs text-right">{t("marketing.value")}</TableHead>
            <TableHead className="font-body text-xs text-right">{t("marketing.minOrder")}</TableHead>
            <TableHead className="font-body text-xs text-right">{t("marketing.used")}</TableHead>
            <TableHead className="font-body text-xs">{t("marketing.expires")}</TableHead>
            <TableHead className="font-body text-xs">{t("customers.status")}</TableHead>
          </TableRow></TableHeader>
          <TableBody>{coupons.map(c => (
            <TableRow key={c.id} className="hover:bg-secondary/30">
              <TableCell className="font-body text-sm font-medium text-foreground flex items-center gap-2"><Tag className="w-3 h-3 text-accent" />{c.code}</TableCell>
              <TableCell className="font-body text-sm text-muted-foreground capitalize">{c.type === "percentage" ? t("marketing.percentage") : t("marketing.fixed")}</TableCell>
              <TableCell className="font-body text-sm text-foreground text-right">{c.type === "percentage" ? `${c.value}%` : `$${c.value}`}</TableCell>
              <TableCell className="font-body text-sm text-muted-foreground text-right">${c.minOrder}</TableCell>
              <TableCell className="font-body text-sm text-foreground text-right">{c.used}/{c.usageLimit}</TableCell>
              <TableCell className="font-body text-xs text-muted-foreground">{new Date(c.expiresAt).toLocaleDateString()}</TableCell>
              <TableCell><Badge variant={c.active ? "outline" : "secondary"} className="font-body text-xs">{c.active ? t("common.active") : t("common.inactive")}</Badge></TableCell>
            </TableRow>
          ))}</TableBody></Table>
        </div></div>
      </div>
    </AdminLayout>
  );
};
export default Marketing;
