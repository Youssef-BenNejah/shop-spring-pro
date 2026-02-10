import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useTranslation } from "@/context/LanguageContext";
import { products } from "@/data/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, DollarSign, ShoppingCart, TrendingUp, Package, Users, ArrowUpRight, ArrowDownRight, Repeat, Eye, MousePointer, Target, Clock, Percent } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, ComposedChart, Legend
} from "recharts";
import { toast } from "sonner";
import { motion } from "framer-motion";

// ─── ANALYTICS DATA ───
const dailyMetrics = [
  { date: "Feb 1", revenue: 3200, orders: 21, visitors: 980, cartAbandonment: 68 },
  { date: "Feb 2", revenue: 2800, orders: 18, visitors: 870, cartAbandonment: 72 },
  { date: "Feb 3", revenue: 4100, orders: 28, visitors: 1240, cartAbandonment: 65 },
  { date: "Feb 4", revenue: 5200, orders: 34, visitors: 1580, cartAbandonment: 58 },
  { date: "Feb 5", revenue: 4800, orders: 31, visitors: 1420, cartAbandonment: 62 },
  { date: "Feb 6", revenue: 3600, orders: 24, visitors: 1100, cartAbandonment: 70 },
  { date: "Feb 7", revenue: 6200, orders: 42, visitors: 1890, cartAbandonment: 55 },
  { date: "Feb 8", revenue: 7100, orders: 48, visitors: 2100, cartAbandonment: 52 },
  { date: "Feb 9", revenue: 5900, orders: 39, visitors: 1760, cartAbandonment: 59 },
];

const returnRateByCategory = [
  { name: "Clothing", rate: 12.5, orders: 340 },
  { name: "Accessories", rate: 4.2, orders: 210 },
  { name: "Home", rate: 2.8, orders: 180 },
  { name: "Beauty", rate: 1.5, orders: 120 },
];

const customerSegments = [
  { name: "VIP (>$500)", value: 8, avgSpend: 1240, fill: "hsl(38, 85%, 55%)" },
  { name: "Regular ($100-500)", value: 35, avgSpend: 280, fill: "hsl(210, 80%, 55%)" },
  { name: "Occasional ($50-100)", value: 42, avgSpend: 72, fill: "hsl(152, 60%, 40%)" },
  { name: "One-time (<$50)", value: 15, avgSpend: 34, fill: "hsl(220, 10%, 45%)" },
];

const channelPerformance = [
  { channel: "Organic Search", visitors: 4200, orders: 168, revenue: 24500, conv: 4.0 },
  { channel: "Direct", visitors: 2800, orders: 140, revenue: 21200, conv: 5.0 },
  { channel: "Social Media", visitors: 3100, orders: 93, revenue: 11800, conv: 3.0 },
  { channel: "Email", visitors: 1200, orders: 96, revenue: 15400, conv: 8.0 },
  { channel: "Referral", visitors: 800, orders: 48, revenue: 8200, conv: 6.0 },
];

const aovTrend = [
  { month: "Sep", aov: 142 }, { month: "Oct", aov: 148 }, { month: "Nov", aov: 155 },
  { month: "Dec", aov: 168 }, { month: "Jan", aov: 157 }, { month: "Feb", aov: 162 },
];

const repeatPurchaseRate = [
  { month: "Sep", rate: 18 }, { month: "Oct", rate: 22 }, { month: "Nov", rate: 25 },
  { month: "Dec", rate: 31 }, { month: "Jan", rate: 28 }, { month: "Feb", rate: 34 },
];

const totalRevenue = dailyMetrics.reduce((s, d) => s + d.revenue, 0);
const totalOrders = dailyMetrics.reduce((s, d) => s + d.orders, 0);
const totalVisitors = dailyMetrics.reduce((s, d) => s + d.visitors, 0);
const avgAbandonment = (dailyMetrics.reduce((s, d) => s + d.cartAbandonment, 0) / dailyMetrics.length).toFixed(0);

const Analytics = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState("7");
  const [tab, setTab] = useState("overview");
  const topProducts = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl text-foreground">{t("admin.analytics")}</h1>
            <p className="font-body text-sm text-muted-foreground mt-1">Deep dive into your store performance</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[160px] font-body text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7">{t("analytics.last7")}</SelectItem>
                <SelectItem value="30">{t("analytics.last30")}</SelectItem>
                <SelectItem value="90">{t("analytics.last90")}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="font-body" onClick={() => toast.success("CSV exported")}>
              <Download className="w-4 h-4 me-2" />{t("admin.export")}
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {[
            { label: "Revenue", value: `$${totalRevenue.toLocaleString()}`, change: "+15.2%", pos: true, icon: DollarSign },
            { label: "Orders", value: totalOrders.toString(), change: "+11.4%", pos: true, icon: ShoppingCart },
            { label: "AOV", value: `$${(totalRevenue / totalOrders).toFixed(0)}`, change: "+3.1%", pos: true, icon: TrendingUp },
            { label: "Visitors", value: totalVisitors.toLocaleString(), change: "+22.8%", pos: true, icon: Eye },
            { label: "Cart Abandon", value: `${avgAbandonment}%`, change: "-4.2%", pos: true, icon: Package },
            { label: "Repeat Rate", value: "34%", change: "+6.1%", pos: true, icon: Repeat },
          ].map((k, i) => (
            <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-1.5 rounded-lg bg-accent/10"><k.icon className="w-3.5 h-3.5 text-accent" /></div>
                    <span className={`flex items-center gap-0.5 font-body text-[10px] font-medium ${k.pos ? "text-success" : "text-destructive"}`}>
                      {k.pos ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}{k.change}
                    </span>
                  </div>
                  <p className="font-body text-xl font-bold text-foreground">{k.value}</p>
                  <p className="font-body text-[10px] text-muted-foreground mt-0.5">{k.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="font-body">
            <TabsTrigger value="overview">Revenue & Traffic</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="font-display text-lg">Revenue & Orders</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={dailyMetrics}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="date" className="font-body text-xs" />
                      <YAxis yAxisId="left" className="font-body text-xs" />
                      <YAxis yAxisId="right" orientation="right" className="font-body text-xs" />
                      <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8 }} />
                      <Legend wrapperStyle={{ fontFamily: "DM Sans", fontSize: 11 }} />
                      <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue ($)" stroke="hsl(38, 85%, 55%)" fill="hsl(38, 85%, 55%)" fillOpacity={0.12} strokeWidth={2.5} />
                      <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="hsl(210, 80%, 55%)" strokeWidth={2} dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="font-display text-lg">AOV Trend</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={aovTrend}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="month" className="font-body text-xs" />
                        <YAxis className="font-body text-xs" domain={[120, 180]} />
                        <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8 }} formatter={(v: number) => `$${v}`} />
                        <Area type="monotone" dataKey="aov" stroke="hsl(152, 60%, 40%)" fill="hsl(152, 60%, 40%)" fillOpacity={0.12} strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2"><CardTitle className="font-display text-lg">Cart Abandonment Rate</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyMetrics}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="date" className="font-body text-xs" />
                        <YAxis className="font-body text-xs" unit="%" domain={[40, 80]} />
                        <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8 }} formatter={(v: number) => `${v}%`} />
                        <Bar dataKey="cartAbandonment" name="Abandon %" fill="hsl(0, 72%, 51%)" fillOpacity={0.5} radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="font-display text-lg">Customer Segments</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={customerSegments} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                          {customerSegments.map(e => <Cell key={e.name} fill={e.fill} />)}
                        </Pie>
                        <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12 }} formatter={(v: number) => `${v}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-2">
                    {customerSegments.map(s => (
                      <div key={s.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.fill }} />
                          <span className="font-body text-xs text-foreground">{s.name}</span>
                        </div>
                        <span className="font-body text-xs text-muted-foreground">Avg: ${s.avgSpend}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2"><CardTitle className="font-display text-lg">Repeat Purchase Rate</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={repeatPurchaseRate}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="month" className="font-body text-xs" />
                        <YAxis className="font-body text-xs" unit="%" />
                        <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8 }} formatter={(v: number) => `${v}%`} />
                        <Area type="monotone" dataKey="rate" stroke="hsl(38, 85%, 55%)" fill="hsl(38, 85%, 55%)" fillOpacity={0.15} strokeWidth={2.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="font-display text-lg">Top Products by Sales</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topProducts.map(p => ({ name: p.name.split(" ").slice(0, 2).join(" "), sold: p.reviewCount, revenue: p.price * p.reviewCount }))} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis type="number" className="font-body text-xs" />
                        <YAxis type="category" dataKey="name" className="font-body text-xs" width={90} />
                        <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8 }} />
                        <Bar dataKey="sold" name="Units Sold" fill="hsl(38, 85%, 55%)" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2"><CardTitle className="font-display text-lg">Return Rate by Category</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4 mt-2">
                    {returnRateByCategory.map(c => (
                      <div key={c.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-body text-sm text-foreground">{c.name}</span>
                          <span className={`font-body text-sm font-semibold ${c.rate > 10 ? "text-destructive" : c.rate > 5 ? "text-warning" : "text-success"}`}>{c.rate}%</span>
                        </div>
                        <Progress value={c.rate * 5} className="h-2" />
                        <p className="font-body text-[10px] text-muted-foreground mt-0.5">{c.orders} total orders</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="channels" className="space-y-6 mt-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="font-display text-lg">Channel Performance</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        {["Channel", "Visitors", "Orders", "Revenue", "Conv. Rate"].map(h => (
                          <th key={h} className="font-body text-xs text-muted-foreground text-start py-3 px-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {channelPerformance.map(ch => (
                        <tr key={ch.channel} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                          <td className="font-body text-sm font-medium text-foreground py-3 px-3">{ch.channel}</td>
                          <td className="font-body text-sm text-muted-foreground py-3 px-3">{ch.visitors.toLocaleString()}</td>
                          <td className="font-body text-sm text-foreground py-3 px-3">{ch.orders}</td>
                          <td className="font-body text-sm font-semibold text-foreground py-3 px-3">${ch.revenue.toLocaleString()}</td>
                          <td className="py-3 px-3">
                            <Badge variant={ch.conv >= 5 ? "outline" : "secondary"} className={`font-body text-xs ${ch.conv >= 5 ? "text-success border-success/30" : ""}`}>{ch.conv}%</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="font-display text-lg">Revenue by Channel</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={channelPerformance}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="channel" className="font-body text-xs" />
                      <YAxis className="font-body text-xs" />
                      <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8 }} formatter={(v: number) => `$${v.toLocaleString()}`} />
                      <Bar dataKey="revenue" name="Revenue" fill="hsl(38, 85%, 55%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};
export default Analytics;