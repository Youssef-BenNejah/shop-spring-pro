import SuperAdminLayout from "@/components/platform/SuperAdminLayout";
import { useTranslation } from "@/context/LanguageContext";
import { samplePlatformInvoices } from "@/data/platform-data";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const statusColors: Record<string, string> = { paid: "bg-success/10 text-success", pending: "bg-warning/10 text-warning", failed: "bg-destructive/10 text-destructive", refunded: "bg-muted text-muted-foreground" };

const PlatformBilling = () => {
  const { t } = useTranslation();

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div><h1 className="font-display text-2xl text-foreground">{t("superAdmin.billing")}</h1></div>
        <div className="border border-border rounded-lg overflow-hidden bg-card"><div className="overflow-x-auto">
          <Table><TableHeader><TableRow>
            <TableHead className="font-body text-xs">Invoice</TableHead>
            <TableHead className="font-body text-xs">Store</TableHead>
            <TableHead className="font-body text-xs text-right">Amount</TableHead>
            <TableHead className="font-body text-xs">Status</TableHead>
            <TableHead className="font-body text-xs">Date</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow></TableHeader>
          <TableBody>{samplePlatformInvoices.map(inv => (
            <TableRow key={inv.id} className="hover:bg-secondary/30">
              <TableCell className="font-body text-sm font-medium text-foreground">{inv.invoiceNumber}</TableCell>
              <TableCell className="font-body text-sm text-foreground">{inv.storeName}</TableCell>
              <TableCell className="font-body text-sm font-semibold text-foreground text-right">${inv.amount}</TableCell>
              <TableCell><Badge variant="outline" className={`font-body text-xs capitalize ${statusColors[inv.status]}`}>{inv.status}</Badge></TableCell>
              <TableCell className="font-body text-xs text-muted-foreground">{new Date(inv.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                {inv.status === "failed" && <Button size="sm" variant="outline" className="font-body text-xs" onClick={() => toast.success("Payment retry initiated")}>Retry</Button>}
                {inv.status === "paid" && <Button size="sm" variant="ghost" className="font-body text-xs" onClick={() => toast.success("Refund processed")}>Refund</Button>}
              </TableCell>
            </TableRow>
          ))}</TableBody></Table>
        </div></div>
      </div>
    </SuperAdminLayout>
  );
};

export default PlatformBilling;
