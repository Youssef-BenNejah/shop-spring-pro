import { DollarSign, ShoppingCart, Users, TrendingUp, AlertTriangle, Package } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sampleOrders, products } from "@/data/mock-data";
import { useTranslation } from "@/context/LanguageContext";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = { pending: "bg-warning/10 text-warning border-warning/20", processing: "bg-info/10 text-info border-info/20", shipped: "bg-accent/10 text-accent-foreground border-accent/20", delivered: "bg-success/10 text-success border-success/20", cancelled: "bg-destructive/10 text-destructive border-destructive/20" };

const Dashboard = () => {
  const { t } = useTranslation();
  const lowStock = products.filter(p => p.stockCount < 20);
  const kpis = [
    { label: t("admin.revenue"), value: "$24,580", change: "+12.5%", icon: DollarSign, positive: true },
    { label: t("admin.ordersCount"), value: "156", change: "+8.2%", icon: ShoppingCart, positive: true },
    { label: t("admin.customersCount"), value: "1,240", change: "+15.3%", icon: Users, positive: true },
    { label: t("admin.avgOrder"), value: "$157.56", change: "-2.1%", icon: TrendingUp, positive: false },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div><h1 className="font-display text-2xl text-foreground">{t("admin.dashboard")}</h1><p className="font-body text-sm text-muted-foreground mt-1">{t("admin.welcome")}</p></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k, i) => (<motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}><Card><CardContent className="p-4 lg:p-6"><div className="flex items-center justify-between mb-3"><k.icon className="w-5 h-5 text-muted-foreground" /><span className={`font-body text-xs font-medium ${k.positive ? "text-success" : "text-destructive"}`}>{k.change}</span></div><p className="font-body text-2xl font-semibold text-foreground">{k.value}</p><p className="font-body text-xs text-muted-foreground mt-1">{k.label}</p></CardContent></Card></motion.div>))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2"><CardHeader className="pb-3"><CardTitle className="font-display text-lg">{t("admin.recentOrders")}</CardTitle></CardHeader><CardContent><div className="space-y-3">
            {sampleOrders.map(o => (<div key={o.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1"><span className="font-body text-sm font-medium text-foreground">{o.orderNumber}</span><span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[o.status]}`}>{o.status}</span></div><p className="font-body text-xs text-muted-foreground">{o.customer.name} · {o.items.length} {t("admin.items")}</p></div><span className="font-body text-sm font-semibold text-foreground">${o.total.toFixed(2)}</span></div>))}
          </div></CardContent></Card>
          <Card><CardHeader className="pb-3"><CardTitle className="font-display text-lg flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-warning" />{t("admin.lowStock")}</CardTitle></CardHeader><CardContent><div className="space-y-3">
            {lowStock.map(p => (<div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"><div className="flex items-center gap-3 min-w-0"><Package className="w-4 h-4 text-muted-foreground flex-shrink-0" /><span className="font-body text-sm text-foreground truncate">{p.name}</span></div><Badge variant="outline" className="ms-2 font-body text-xs border-warning/30 text-warning">{p.stockCount} {t("admin.left")}</Badge></div>))}
            {lowStock.length === 0 && <p className="font-body text-sm text-muted-foreground text-center py-4">{t("admin.allStocked")}</p>}
          </div></CardContent></Card>
        </div>
      </div>
    </AdminLayout>
  );
};
export default Dashboard;
