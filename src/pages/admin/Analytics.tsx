import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useTranslation } from "@/context/LanguageContext";
import { salesData, products } from "@/data/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, DollarSign, ShoppingCart, TrendingUp, Package } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { toast } from "sonner";

const Analytics = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState("7");
  const totalSales = salesData.reduce((s, d) => s + d.sales, 0);
  const totalOrders = salesData.reduce((s, d) => s + d.orders, 0);
  const topProducts = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);

  const kpis = [
    { label: t("analytics.totalSales"), value: `$${totalSales.toLocaleString()}`, icon: DollarSign },
    { label: t("admin.ordersCount"), value: totalOrders.toString(), icon: ShoppingCart },
    { label: t("analytics.avgOrderValue"), value: `$${(totalSales / totalOrders).toFixed(0)}`, icon: TrendingUp },
    { label: t("analytics.conversionRate"), value: "3.2%", icon: Package },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div><h1 className="font-display text-2xl text-foreground">{t("admin.analytics")}</h1></div>
          <div className="flex items-center gap-3">
            <Select value={period} onValueChange={setPeriod}><SelectTrigger className="w-[160px] font-body text-sm"><SelectValue /></SelectTrigger><SelectContent>
              <SelectItem value="7">{t("analytics.last7")}</SelectItem><SelectItem value="30">{t("analytics.last30")}</SelectItem><SelectItem value="90">{t("analytics.last90")}</SelectItem>
            </SelectContent></Select>
            <Button variant="outline" className="font-body" onClick={() => toast.success("CSV exported")}><Download className="w-4 h-4 me-2" />{t("admin.export")}</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(k => (<Card key={k.label}><CardContent className="p-4 lg:p-6"><k.icon className="w-5 h-5 text-muted-foreground mb-3" /><p className="font-body text-2xl font-semibold text-foreground">{k.value}</p><p className="font-body text-xs text-muted-foreground mt-1">{k.label}</p></CardContent></Card>))}
        </div>

        <Card><CardHeader><CardTitle className="font-display text-lg">{t("analytics.salesReport")}</CardTitle></CardHeader>
          <CardContent><div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}><CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="font-body text-xs" /><YAxis className="font-body text-xs" />
                <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12 }} />
                <Area type="monotone" dataKey="sales" stroke="hsl(38, 85%, 55%)" fill="hsl(38, 85%, 55%)" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div></CardContent>
        </Card>

        <Card><CardHeader><CardTitle className="font-display text-lg">{t("analytics.topProducts")}</CardTitle></CardHeader>
          <CardContent><div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts.map(p => ({ name: p.name.split(" ").slice(0, 2).join(" "), sold: p.reviewCount, revenue: p.price * p.reviewCount }))} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" /><XAxis type="number" className="font-body text-xs" /><YAxis type="category" dataKey="name" className="font-body text-xs" width={100} />
                <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12 }} /><Bar dataKey="sold" fill="hsl(38, 85%, 55%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div></CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};
export default Analytics;
