import { Store, DollarSign, TrendingUp, AlertTriangle, Users, ShoppingCart } from "lucide-react";
import SuperAdminLayout from "@/components/platform/SuperAdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/context/LanguageContext";
import { platformStats, sampleStores, mrrChartData } from "@/data/platform-data";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const Overview = () => {
  const { t } = useTranslation();
  const kpis = [
    { label: t("superAdmin.totalStores"), value: platformStats.totalStores, icon: Store },
    { label: t("superAdmin.mrr"), value: `$${platformStats.mrr.toLocaleString()}`, icon: DollarSign },
    { label: t("superAdmin.arr"), value: `$${platformStats.arr.toLocaleString()}`, icon: TrendingUp },
    { label: t("superAdmin.churnRate"), value: `${platformStats.churnRate}%`, icon: AlertTriangle },
    { label: t("superAdmin.failedPayments"), value: platformStats.failedPayments, icon: AlertTriangle },
    { label: t("superAdmin.activeStores"), value: platformStats.activeStores, icon: Users },
  ];

  const statusColors: Record<string, string> = { active: "bg-success/10 text-success", trial: "bg-info/10 text-info", suspended: "bg-destructive/10 text-destructive", cancelled: "bg-muted text-muted-foreground" };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div><h1 className="font-display text-2xl text-foreground">{t("superAdmin.overview")}</h1></div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((k, i) => (
            <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card><CardContent className="p-4 lg:p-6">
                <k.icon className="w-5 h-5 text-muted-foreground mb-3" />
                <p className="font-body text-2xl font-semibold text-foreground">{k.value}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{k.label}</p>
              </CardContent></Card>
            </motion.div>
          ))}
        </div>
        <Card><CardHeader><CardTitle className="font-display text-lg">{t("superAdmin.revenueGrowth")}</CardTitle></CardHeader>
          <CardContent><div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mrrChartData}><CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="font-body text-xs" /><YAxis className="font-body text-xs" />
                <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12 }} />
                <Area type="monotone" dataKey="mrr" stroke="hsl(38, 85%, 55%)" fill="hsl(38, 85%, 55%)" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div></CardContent>
        </Card>
        <Card><CardHeader><CardTitle className="font-display text-lg">{t("superAdmin.stores")}</CardTitle></CardHeader>
          <CardContent><div className="space-y-3">
            {sampleStores.slice(0, 5).map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5"><span className="font-body text-sm font-medium text-foreground">{s.name}</span>
                    <Badge variant="outline" className={`font-body text-[10px] capitalize ${statusColors[s.status]}`}>{s.status}</Badge>
                    <Badge variant="secondary" className="font-body text-[10px] capitalize">{s.planTier}</Badge>
                  </div>
                  <p className="font-body text-xs text-muted-foreground">{s.ownerEmail} · {s.productCount} products · {s.orderCount} orders</p>
                </div>
                <span className="font-body text-sm font-semibold text-foreground">${s.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div></CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
};

export default Overview;
