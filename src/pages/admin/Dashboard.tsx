import { useState } from "react";
import { DollarSign, ShoppingCart, Users, TrendingUp, TrendingDown, AlertTriangle, Package, Eye, MousePointer, Target, ArrowUpRight, ArrowDownRight, BarChart3, Clock, Repeat, Star, Zap, Globe, Smartphone, Monitor, ShoppingBag, CreditCard, Percent, Calendar, Filter } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sampleOrders, products, sampleCustomers } from "@/data/mock-data";
import { useTranslation } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart, Legend,
  RadialBarChart, RadialBar, Treemap, FunnelChart, Funnel, LabelList
} from "recharts";

// ─── RICH MOCK DATA ───
const revenueTimeline = [
  { date: "Jan 1", revenue: 4200, orders: 28, visitors: 1240, profit: 1260 },
  { date: "Jan 8", revenue: 5100, orders: 34, visitors: 1580, profit: 1530 },
  { date: "Jan 15", revenue: 4800, orders: 31, visitors: 1420, profit: 1440 },
  { date: "Jan 22", revenue: 6200, orders: 42, visitors: 1890, profit: 1860 },
  { date: "Jan 29", revenue: 7100, orders: 48, visitors: 2100, profit: 2130 },
  { date: "Feb 2", revenue: 5900, orders: 39, visitors: 1760, profit: 1770 },
  { date: "Feb 5", revenue: 8200, orders: 55, visitors: 2450, profit: 2460 },
  { date: "Feb 8", revenue: 7600, orders: 51, visitors: 2280, profit: 2280 },
];

const hourlyTraffic = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  visitors: Math.floor(Math.random() * 200 + (i >= 9 && i <= 21 ? 300 : 50)),
  conversions: Math.floor(Math.random() * 15 + (i >= 10 && i <= 20 ? 10 : 2)),
}));

const categoryRevenue = [
  { name: "Clothing", value: 12400, fill: "hsl(38, 85%, 55%)" },
  { name: "Accessories", value: 8200, fill: "hsl(210, 80%, 55%)" },
  { name: "Home", value: 5600, fill: "hsl(152, 60%, 40%)" },
  { name: "Beauty", value: 3800, fill: "hsl(0, 72%, 51%)" },
];

const funnelData = [
  { name: "Visitors", value: 12400, fill: "hsl(38, 85%, 55%)" },
  { name: "Product Views", value: 6200, fill: "hsl(38, 80%, 60%)" },
  { name: "Add to Cart", value: 2480, fill: "hsl(210, 80%, 55%)" },
  { name: "Checkout", value: 1240, fill: "hsl(152, 60%, 50%)" },
  { name: "Purchase", value: 620, fill: "hsl(152, 60%, 40%)" },
];

const customerCohorts = [
  { month: "Sep", newCustomers: 45, returning: 12, churned: 3 },
  { month: "Oct", newCustomers: 62, returning: 28, churned: 5 },
  { month: "Nov", newCustomers: 78, returning: 42, churned: 8 },
  { month: "Dec", newCustomers: 120, returning: 65, churned: 10 },
  { month: "Jan", newCustomers: 95, returning: 82, churned: 12 },
  { month: "Feb", newCustomers: 88, returning: 96, churned: 7 },
];

const deviceBreakdown = [
  { name: "Mobile", value: 58, fill: "hsl(38, 85%, 55%)" },
  { name: "Desktop", value: 34, fill: "hsl(210, 80%, 55%)" },
  { name: "Tablet", value: 8, fill: "hsl(152, 60%, 40%)" },
];

const paymentMethods = [
  { name: "Credit Card", value: 62 },
  { name: "PayPal", value: 18 },
  { name: "Apple Pay", value: 12 },
  { name: "Bank Transfer", value: 8 },
];

const performanceRadar = [
  { metric: "Revenue", value: 85, fullMark: 100 },
  { metric: "Conversion", value: 72, fullMark: 100 },
  { metric: "AOV", value: 68, fullMark: 100 },
  { metric: "Retention", value: 78, fullMark: 100 },
  { metric: "Satisfaction", value: 92, fullMark: 100 },
  { metric: "Growth", value: 81, fullMark: 100 },
];

const topCountries = [
  { country: "United States", revenue: 8420, orders: 56, flag: "🇺🇸", pct: 34 },
  { country: "United Kingdom", revenue: 5230, orders: 35, flag: "🇬🇧", pct: 21 },
  { country: "France", revenue: 3680, orders: 24, flag: "🇫🇷", pct: 15 },
  { country: "Germany", revenue: 2940, orders: 19, flag: "🇩🇪", pct: 12 },
  { country: "Canada", revenue: 2100, orders: 14, flag: "🇨🇦", pct: 9 },
  { country: "Others", revenue: 2210, orders: 15, flag: "🌍", pct: 9 },
];

const weeklyHeatmap = [
  { day: "Mon", "0-4": 12, "4-8": 28, "8-12": 145, "12-16": 189, "16-20": 210, "20-24": 95 },
  { day: "Tue", "0-4": 8, "4-8": 32, "8-12": 156, "12-16": 201, "16-20": 234, "20-24": 102 },
  { day: "Wed", "0-4": 15, "4-8": 25, "8-12": 134, "12-16": 178, "16-20": 198, "20-24": 88 },
  { day: "Thu", "0-4": 10, "4-8": 30, "8-12": 167, "12-16": 212, "16-20": 245, "20-24": 110 },
  { day: "Fri", "0-4": 18, "4-8": 35, "8-12": 178, "12-16": 234, "16-20": 267, "20-24": 134 },
  { day: "Sat", "0-4": 22, "4-8": 18, "8-12": 89, "12-16": 156, "16-20": 198, "20-24": 145 },
  { day: "Sun", "0-4": 25, "4-8": 15, "8-12": 67, "12-16": 112, "16-20": 145, "20-24": 120 },
];

const forecastData = [
  { month: "Mar", actual: null, forecast: 28500, low: 24200, high: 32800 },
  { month: "Apr", actual: null, forecast: 31200, low: 26500, high: 35900 },
  { month: "May", actual: null, forecast: 34800, low: 29600, high: 40000 },
];

const revenueWithForecast = [
  { month: "Sep", actual: 12400, forecast: null },
  { month: "Oct", actual: 15800, forecast: null },
  { month: "Nov", actual: 18200, forecast: null },
  { month: "Dec", actual: 24600, forecast: null },
  { month: "Jan", actual: 22400, forecast: null },
  { month: "Feb", actual: 24580, forecast: null },
  ...forecastData,
];

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  processing: "bg-info/10 text-info border-info/20",
  shipped: "bg-accent/10 text-accent-foreground border-accent/20",
  delivered: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const MiniStat = ({ label, value, change, positive, icon: Icon }: { label: string; value: string; change: string; positive: boolean; icon: any }) => (
  <Card className="relative overflow-hidden">
    <CardContent className="p-4 lg:p-5">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 rounded-lg bg-accent/10">
          <Icon className="w-4 h-4 text-accent" />
        </div>
        <div className={`flex items-center gap-0.5 text-xs font-medium font-body ${positive ? "text-success" : "text-destructive"}`}>
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <p className="font-body text-2xl font-bold text-foreground tracking-tight">{value}</p>
      <p className="font-body text-xs text-muted-foreground mt-1">{label}</p>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState("30");
  const lowStock = products.filter(p => p.stockCount < 20);
  const totalRevenue = revenueTimeline.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = revenueTimeline.reduce((s, d) => s + d.orders, 0);
  const totalVisitors = revenueTimeline.reduce((s, d) => s + d.visitors, 0);
  const conversionRate = ((totalOrders / totalVisitors) * 100).toFixed(1);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl text-foreground">{t("admin.dashboard")}</h1>
            <p className="font-body text-sm text-muted-foreground mt-1">Your store performance at a glance</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[140px] font-body text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          <MiniStat label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} change="+12.5%" positive icon={DollarSign} />
          <MiniStat label="Orders" value={totalOrders.toString()} change="+8.2%" positive icon={ShoppingCart} />
          <MiniStat label="Avg Order Value" value={`$${(totalRevenue / totalOrders).toFixed(0)}`} change="-2.1%" positive={false} icon={TrendingUp} />
          <MiniStat label="Conversion Rate" value={`${conversionRate}%`} change="+0.4%" positive icon={Target} />
          <MiniStat label="Visitors" value={totalVisitors.toLocaleString()} change="+18.3%" positive icon={Eye} />
          <MiniStat label="Repeat Customers" value="34%" change="+5.2%" positive icon={Repeat} />
        </div>

        {/* Revenue + Forecast Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-lg">Revenue & Forecast</CardTitle>
              <div className="flex items-center gap-4 font-body text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-accent" /> Actual</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-info/60 border border-dashed border-info" /> Forecast</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={revenueWithForecast}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="font-body text-xs" />
                  <YAxis className="font-body text-xs" />
                  <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8 }} />
                  <Area type="monotone" dataKey="actual" stroke="hsl(38, 85%, 55%)" fill="hsl(38, 85%, 55%)" fillOpacity={0.15} strokeWidth={2.5} connectNulls={false} />
                  <Line type="monotone" dataKey="forecast" stroke="hsl(210, 80%, 55%)" strokeWidth={2} strokeDasharray="6 4" dot={{ r: 3 }} connectNulls={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 3-col: Funnel + Category Pie + Performance Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Funnel */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="font-display text-lg flex items-center gap-2"><Target className="w-4 h-4 text-accent" />Sales Funnel</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {funnelData.map((step, i) => {
                  const pct = ((step.value / funnelData[0].value) * 100).toFixed(0);
                  const dropoff = i > 0 ? (((funnelData[i - 1].value - step.value) / funnelData[i - 1].value) * 100).toFixed(0) : null;
                  return (
                    <div key={step.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-body text-xs font-medium text-foreground">{step.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-body text-xs text-muted-foreground">{step.value.toLocaleString()}</span>
                          {dropoff && <span className="font-body text-[10px] text-destructive">-{dropoff}%</span>}
                        </div>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                          className="h-full rounded-full" style={{ backgroundColor: step.fill }} />
                      </div>
                    </div>
                  );
                })}
                <p className="font-body text-xs text-muted-foreground text-center pt-2">Overall conversion: <span className="font-semibold text-foreground">{((funnelData[4].value / funnelData[0].value) * 100).toFixed(1)}%</span></p>
              </div>
            </CardContent>
          </Card>

          {/* Category Revenue */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="font-display text-lg">Revenue by Category</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryRevenue} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                      {categoryRevenue.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8 }} formatter={(v: number) => `$${v.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {categoryRevenue.map(c => (
                  <div key={c.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.fill }} />
                    <span className="font-body text-xs text-muted-foreground truncate">{c.name}</span>
                    <span className="font-body text-xs font-medium text-foreground ms-auto">${(c.value / 1000).toFixed(1)}k</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Radar */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="font-display text-lg flex items-center gap-2"><Zap className="w-4 h-4 text-accent" />Performance Score</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={performanceRadar}>
                    <PolarGrid className="stroke-border" />
                    <PolarAngleAxis dataKey="metric" className="font-body text-[10px]" />
                    <Radar dataKey="value" stroke="hsl(38, 85%, 55%)" fill="hsl(38, 85%, 55%)" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <p className="font-body text-xs text-center text-muted-foreground">Overall: <span className="font-semibold text-accent">79/100</span></p>
            </CardContent>
          </Card>
        </div>

        {/* Customer Cohorts + Traffic Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="font-display text-lg flex items-center gap-2"><Users className="w-4 h-4 text-accent" />Customer Cohorts</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customerCohorts}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="font-body text-xs" />
                    <YAxis className="font-body text-xs" />
                    <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontFamily: "DM Sans", fontSize: 11 }} />
                    <Bar dataKey="newCustomers" name="New" fill="hsl(38, 85%, 55%)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="returning" name="Returning" fill="hsl(210, 80%, 55%)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="churned" name="Churned" fill="hsl(0, 72%, 51%)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="font-display text-lg">Hourly Traffic & Conversions</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={hourlyTraffic}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="hour" className="font-body text-xs" interval={3} />
                    <YAxis yAxisId="left" className="font-body text-xs" />
                    <YAxis yAxisId="right" orientation="right" className="font-body text-xs" />
                    <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8 }} />
                    <Area yAxisId="left" type="monotone" dataKey="visitors" fill="hsl(38, 85%, 55%)" fillOpacity={0.1} stroke="hsl(38, 85%, 55%)" strokeWidth={1.5} />
                    <Bar yAxisId="right" dataKey="conversions" fill="hsl(152, 60%, 40%)" radius={[2, 2, 0, 0]} barSize={8} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Geo + Devices + Payment Methods + Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Top Countries */}
          <Card className="lg:col-span-2 xl:col-span-1">
            <CardHeader className="pb-2"><CardTitle className="font-display text-lg flex items-center gap-2"><Globe className="w-4 h-4 text-accent" />Top Countries</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topCountries.map(c => (
                  <div key={c.country} className="flex items-center gap-3">
                    <span className="text-lg">{c.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-body text-xs font-medium text-foreground truncate">{c.country}</span>
                        <span className="font-body text-xs text-muted-foreground">{c.pct}%</span>
                      </div>
                      <Progress value={c.pct} className="h-1.5" />
                    </div>
                    <span className="font-body text-xs font-semibold text-foreground">${(c.revenue / 1000).toFixed(1)}k</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Device Breakdown */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="font-display text-lg">Devices</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={deviceBreakdown} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={4} dataKey="value">
                      {deviceBreakdown.map(e => <Cell key={e.name} fill={e.fill} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12 }} formatter={(v: number) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {deviceBreakdown.map(d => {
                  const icons: Record<string, any> = { Mobile: Smartphone, Desktop: Monitor, Tablet: Monitor };
                  const Icon = icons[d.name] || Monitor;
                  return (
                    <div key={d.name} className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-body text-xs text-muted-foreground">{d.name}</span>
                      <span className="font-body text-xs font-semibold text-foreground ms-auto">{d.value}%</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="font-display text-lg flex items-center gap-2"><CreditCard className="w-4 h-4 text-accent" />Payments</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3 mt-2">
                {paymentMethods.map(pm => (
                  <div key={pm.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-body text-xs text-foreground">{pm.name}</span>
                      <span className="font-body text-xs font-semibold text-foreground">{pm.value}%</span>
                    </div>
                    <Progress value={pm.value} className="h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="font-display text-lg flex items-center gap-2"><Star className="w-4 h-4 text-accent" />Best Sellers</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {products.sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5).map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="font-body text-xs font-bold text-muted-foreground w-4">#{i + 1}</span>
                    <div className="w-8 h-8 bg-secondary rounded overflow-hidden flex-shrink-0">
                      <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs font-medium text-foreground truncate">{p.name}</p>
                      <p className="font-body text-[10px] text-muted-foreground">{p.reviewCount} sold</p>
                    </div>
                    <span className="font-body text-xs font-semibold text-foreground">${p.price}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Activity Heatmap + Recent Orders + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Heatmap */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2"><CardTitle className="font-display text-lg flex items-center gap-2"><Calendar className="w-4 h-4 text-accent" />Order Heatmap (Weekly)</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="font-body text-[10px] text-muted-foreground text-start py-1 pe-3">Day</th>
                      {["0-4", "4-8", "8-12", "12-16", "16-20", "20-24"].map(t => (
                        <th key={t} className="font-body text-[10px] text-muted-foreground py-1 px-1">{t}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyHeatmap.map(row => (
                      <tr key={row.day}>
                        <td className="font-body text-xs font-medium text-foreground py-1 pe-3">{row.day}</td>
                        {(["0-4", "4-8", "8-12", "12-16", "16-20", "20-24"] as const).map(slot => {
                          const val = row[slot];
                          const maxVal = 267;
                          const intensity = val / maxVal;
                          return (
                            <td key={slot} className="py-1 px-1">
                              <div className="w-full h-8 rounded-sm flex items-center justify-center font-body text-[10px] font-medium"
                                style={{
                                  backgroundColor: `hsl(38, 85%, 55%, ${intensity * 0.7 + 0.05})`,
                                  color: intensity > 0.5 ? "hsl(220, 12%, 12%)" : "hsl(220, 10%, 45%)",
                                }}>
                                {val}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats & Alerts */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="font-display text-lg flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-warning" />Alerts & Actions</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStock.length > 0 && (
                  <div className="p-3 rounded-lg bg-warning/5 border border-warning/20">
                    <p className="font-body text-xs font-medium text-warning mb-1">⚠️ Low Stock Alert</p>
                    <p className="font-body text-[11px] text-muted-foreground">{lowStock.length} products below 20 units</p>
                    {lowStock.slice(0, 3).map(p => (
                      <div key={p.id} className="flex items-center justify-between mt-1.5">
                        <span className="font-body text-[11px] text-foreground truncate">{p.name}</span>
                        <Badge variant="outline" className="text-[10px] border-warning/30 text-warning">{p.stockCount}</Badge>
                      </div>
                    ))}
                  </div>
                )}
                <div className="p-3 rounded-lg bg-info/5 border border-info/20">
                  <p className="font-body text-xs font-medium text-info mb-1">📊 Insight</p>
                  <p className="font-body text-[11px] text-muted-foreground">Peak sales hours are <span className="font-semibold text-foreground">4-8 PM</span>. Consider running flash sales during this window.</p>
                </div>
                <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                  <p className="font-body text-xs font-medium text-success mb-1">🎯 Goal Tracker</p>
                  <p className="font-body text-[11px] text-muted-foreground">Monthly revenue target: $30,000</p>
                  <Progress value={82} className="h-1.5 mt-2" />
                  <p className="font-body text-[10px] text-muted-foreground mt-1">$24,580 / $30,000 (82%)</p>
                </div>
                <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                  <p className="font-body text-xs font-medium text-accent mb-1">💡 Recommendation</p>
                  <p className="font-body text-[11px] text-muted-foreground">Returning customers have <span className="font-semibold text-foreground">3.2x higher AOV</span>. Launch a loyalty program.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-lg">{t("admin.recentOrders")}</CardTitle>
              <Button variant="outline" size="sm" className="font-body text-xs">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sampleOrders.map(o => (
                <div key={o.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-body text-sm font-medium text-foreground">{o.orderNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColors[o.status]}`}>{o.status}</span>
                      <Badge variant={o.paymentStatus === "paid" ? "outline" : o.paymentStatus === "refunded" ? "destructive" : "secondary"} className="text-[10px]">{o.paymentStatus}</Badge>
                    </div>
                    <p className="font-body text-xs text-muted-foreground">{o.customer.name} · {o.items.length} items · {new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="font-body text-sm font-semibold text-foreground">${o.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};
export default Dashboard;