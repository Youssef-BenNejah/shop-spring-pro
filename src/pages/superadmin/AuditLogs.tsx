import SuperAdminLayout from "@/components/platform/SuperAdminLayout";
import { useTranslation } from "@/context/LanguageContext";
import { sampleAuditLogs } from "@/data/platform-data";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const actionColors: Record<string, string> = {
  store_created: "bg-success/10 text-success", store_suspended: "bg-destructive/10 text-destructive",
  store_reactivated: "bg-info/10 text-info", plan_changed: "bg-warning/10 text-warning",
  impersonation: "bg-accent/10 text-accent-foreground", billing_change: "bg-info/10 text-info",
  feature_flag_changed: "bg-secondary text-secondary-foreground",
};

const AuditLogs = () => {
  const { t } = useTranslation();

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div><h1 className="font-display text-2xl text-foreground">{t("superAdmin.auditLogs")}</h1></div>
        <div className="border border-border rounded-lg overflow-hidden bg-card"><div className="overflow-x-auto">
          <Table><TableHeader><TableRow>
            <TableHead className="font-body text-xs">{t("superAdmin.action")}</TableHead>
            <TableHead className="font-body text-xs">{t("superAdmin.actor")}</TableHead>
            <TableHead className="font-body text-xs">{t("superAdmin.target")}</TableHead>
            <TableHead className="font-body text-xs">{t("superAdmin.details")}</TableHead>
            <TableHead className="font-body text-xs">{t("superAdmin.timestamp")}</TableHead>
            <TableHead className="font-body text-xs">{t("superAdmin.ip")}</TableHead>
          </TableRow></TableHeader>
          <TableBody>{sampleAuditLogs.map(log => (
            <TableRow key={log.id} className="hover:bg-secondary/30">
              <TableCell><Badge variant="outline" className={`font-body text-[10px] ${actionColors[log.action] || ""}`}>{log.action.replace(/_/g, " ")}</Badge></TableCell>
              <TableCell><p className="font-body text-sm text-foreground">{log.actorName}</p><p className="font-body text-[10px] text-muted-foreground capitalize">{log.actorRole.replace("_", " ")}</p></TableCell>
              <TableCell><p className="font-body text-sm text-foreground">{log.targetName}</p><p className="font-body text-[10px] text-muted-foreground capitalize">{log.targetType}</p></TableCell>
              <TableCell className="font-body text-xs text-muted-foreground max-w-[200px] truncate">{log.details}</TableCell>
              <TableCell className="font-body text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</TableCell>
              <TableCell className="font-body text-xs text-muted-foreground">{log.ipAddress}</TableCell>
            </TableRow>
          ))}</TableBody></Table>
        </div></div>
      </div>
    </SuperAdminLayout>
  );
};

export default AuditLogs;
