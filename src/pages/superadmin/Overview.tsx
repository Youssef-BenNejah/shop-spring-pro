import { useState } from "react";
import { Store, DollarSign, TrendingUp, TrendingDown, AlertTriangle, Users, ShoppingCart, ArrowUpRight, ArrowDownRight, Target, Activity, Zap, CreditCard, Globe, BarChart3, PieChart as PieChartIcon, Percent, Clock, Crown, Shield, Ban, CheckCircle } from "lucide-react";
import SuperAdminLayout from "@/components/platform/SuperAdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/context/LanguageContext";
import { platformStats, sampleStores, mrrChartData, plans, sampleSubscriptions } from "@/data/platform-data";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, ComposedChart, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, RadialBarChart, RadialBar
} from "recharts";

// ─── RICH PLATFORM BI DATA ───
const mrrGrowth = [
  { month: "Jul", mrr: 79, stores: 2, newMrr: 79, churnedMrr: 0 },
  { month: "Aug", mrr: 108, stores: 3, newMrr: 29, churnedMrr: 0 },
  { month: "Sep", mrr: 158, stores: 4, newMrr: 79, churnedMrr: 29 },
  { month: "Oct", mrr: 237, stores: 5, newMrr: 108, churnedMrr: 29 },
  { month: "Nov", mrr: 266, stores: 5, newMrr: 58, churnedMrr: 29 },
  { month: "Dec", mrr: 345, stores: 6, newMrr: 108, churnedMrr: 29 },
  { month: "Jan", mrr: 357, stores: 6, newMrr: 41, churnedMrr: 29 },
  { month: "Feb", mrr: 386, stores: 6, newMrr: 58, churnedMrr: 29 },
];

const planDistribution = [
  { name: "Free", count: 1, revenue: 0, fill: "hsl(220, 10%, 45%)" },
  { name: "Starter", count: 2, revenue: 58, fill: "hsl(210, 80%, 55%)" },
  { name: "Pro", count: 2, revenue: 158, fill: "hsl(38, 85%, 55%)" },
  { name: "Business", count: 1, revenue: 199, fill: "hsl(152, 60%, 40%)" },
];

const churnAnalysis = [
  { month: "Sep", rate: 3.2, recovered: 1.2 },
  { month: "Oct", rate: 4.1, recovered: 1.8 },
  { month: "Nov", rate: 3.8, recovered: 2.0 },
  { month: "Dec", rate: 4.5, recovered: 2.5 },
  { month: "Jan", rate: 4.2, recovered: 2.1 },
  { month: "Feb", rate: 3.6, recovered: 2.8 },
];

const ltvByPlan = [
  { plan: "Free", ltv: 0, avgLifespan: 2, cac: 5, fill: "hsl(220, 10%, 45%)" },
  { plan: "Starter", ltv: 348, avgLifespan: 12, cac: 45, fill: "hsl(210, 80%, 55%)" },
  { plan: "Pro", ltv: 1896, avgLifespan: 24, cac: 120, fill: "hsl(38, 85%, 55%)" },
  { plan: "Business", ltv: 4776, avgLifespan: 24, cac: 250, fill: "hsl(152, 60%, 40%)" },
];

const storeGrowth = [
  { month: "Jul", total: 2, new: 2, churned: 0 },
  { month: "Aug", total: 3, new: 1, churned: 0 },
  { month: "Sep", total: 4, new: 1, churned: 0 },
  { month: "Oct", total: 5, new: 1, churned: 0 },
  { month: "Nov", total: 5, new: 1, churned: 1 },
  { month: "Dec", total: 6, new: 1, churned: 0 },
  { month: "Jan", total: 6, new: 1, churned: 1 },
  { month: "Feb", total: 6, new: 1, churned: 1 },
];

const gmvTimeline = [
  { month: "Sep", gmv: 125000, commission: 6250 },
  { month: "Oct", gmv: 178000, commission: 8900 },
  { month: "Nov", gmv: 234000, commission: 11700 },
  { month: "Dec", gmv: 412000, commission: 20600 },
  { month: "Jan", gmv: 356000, commission: 17800 },
  { month: "Feb", gmv: 398000, commission: 19900 },
];

const healthScore = [
  { metric: "MRR Growth", score: 82 },
  { metric: "Retention", score: 95 },
  { metric: "NPS", score: 72 },
  { metric: "Uptime", score: 99 },
  { metric: "Support SLA", score: 88 },
  { metric: "Feature Adoption", score: 65 },
];

const platformRadar = [
  { metric: "Growth", value: 78, fullMark: 100 },
  { metric: "Retention", value: 92, fullMark: 100 },
  { metric: "Revenue", value: 85, fullMark: 100 },
  { metric: "Efficiency", value: 70, fullMark: 100 },
  { metric: "Satisfaction", value: 88, fullMark: 100 },
  { metric: "Adoption", value: 65, fullMark: 100 },
];

const trialConversion = [
  { month: "Sep", trials: 3, converted: 2 },
  { month: "Oct", trials: 5, converted: 3 },
  { month: "Nov", trials: 4, converted: 3 },
  { month: "Dec", trials: 7, converted: 5 },
  { month: "Jan", trials: 6, converted: 4 },
  { month: "Feb", trials: 4, converted: 0 },
];

const topStoresByGMV = [...sampleStores].sort((a, b) => b.revenue - a.revenue);

const MiniStat = ({ label, value, change, positive, icon: Icon, accent = false }: { label: string; value: string; change?: string; positive?: boolean; icon: any; accent?: boolean }) => (
  <Card className="relative overflow-hidden">
    <CardContent className="p-4 lg:p-5">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${accent ? "bg-accent/15" : "bg-secondary"}`}>
          <Icon className={`w-4 h-4 ${accent ? "text-accent" : "text-muted-foreground"}`} />
        </div>
        {change && (
          <div className={`flex items-center gap-0.5 text-xs font-medium font-body ${positive ? "text-success" : "text-destructive"}`}>
            {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      <p className="font-body text-2xl font-bold text-foreground tracking-tight">{value}</p>
      <p className="font-body text-xs text-muted-foreground mt-1">{label}</p>
    </CardContent>
  </Card>
);

const Overview = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState("6m");
  const totalGMV = gmvTimeline.reduce((s, d) => s + d.gmv, 0);
  const totalCommission = gmvTimeline.reduce((s, d) => s + d.commission, 0);
  const avgRevenuePerStore = platformStats.mrr / (platformStats.activeStores || 1);
  const trialConvRate = ((trialConversion.slice(0, -1).reduce((s, d) => s + d.converted, 0) / trialConversion.slice(0, -1).reduce((s, d) => s + d.trials, 0)) * 100).toFixed(0);

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl text-foreground">{t("superAdmin.overview")}</h1>
            <p className="font-body text-sm text-muted-foreground mt-1">Platform intelligence & decision center</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[140px] font-body text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last month</SelectItem>
                <SelectItem value="3m">Last 3 months</SelectItem>
                <SelectItem value="6m">Last 6 months</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          <MiniStat label="Monthly Recurring Revenue" value={`${platformStats.mrr} TND`} change="+8.1%" positive icon={DollarSign} accent />
          <MiniStat label="Annual Run Rate" value={`${platformStats.arr.toLocaleString()} TND`} change="+8.1%" positive icon={TrendingUp} />
          <MiniStat label="Total Stores" value={platformStats.totalStores.toString()} icon={Store} />
          <MiniStat label="Active Stores" value={platformStats.activeStores.toString()} change="+1" positive icon={CheckCircle} />
          <MiniStat label="Churn Rate" value={`${platformStats.churnRate}%`} change="-0.6%" positive icon={TrendingDown} />
          <MiniStat label="Platform GMV" value={`${(totalGMV / 1000).toFixed(0)}k TND`} change="+11.8%" positive icon={ShoppingCart} accent />
        </div>

        {/* MRR Growth + Net Revenue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-lg">MRR Growth & Composition</CardTitle>
                <div className="flex items-center gap-3 font-body text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" /> MRR</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(152, 60%, 40%)" }} /> New</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(0, 72%, 51%)" }} /> Churned</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={mrrGrowth}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="font-body text-xs" />
                    <YAxis className="font-body text-xs" />
                    <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8 }} />
                    <Area type="monotone" dataKey="mrr" stroke="hsl(38, 85%, 55%)" fill="hsl(38, 85%, 55%)" fillOpacity={0.15} strokeWidth={2.5} />
                    <Bar dataKey="newMrr" name="New MRR" fill="hsl(152, 60%, 40%)" radius={[3, 3, 0, 0]} barSize={12} />
                    <Bar dataKey="churnedMrr" name="Churned MRR" fill="hsl(0, 72%, 51%)" radius={[3, 3, 0, 0]} barSize={12} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="font-display text-lg">GMV & Commission</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={gmvTimeline}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="font-body text-xs" />
                    <YAxis className="font-body text-xs" />
                    <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8 }} formatter={(v: number) => `${v.toLocaleString()} TND`} />
                    <Legend wrapperStyle={{ fontFamily: "DM Sans", fontSize: 11 }} />
                    <Bar dataKey="gmv" name="GMV" fill="hsl(38, 85%, 55%)" fillOpacity={0.3} radius={[3, 3, 0, 0]} />
                    <Line type="monotone" dataKey="commission" name="Commission (5%)" stroke="hsl(152, 60%, 40%)" strokeWidth={2.5} dot={{ r: 3 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plan Distribution + Churn + LTV */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plan Distribution */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="font-display text-lg flex items-center gap-2"><Crown className="w-4 h-4 text-accent" />Plan Distribution</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={planDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="count">
                      {planDistribution.map(e => <Cell key={e.name} fill={e.fill} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {planDistribution.map(p => (
                  <div key={p.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.fill }} />
                      <span className="font-body text-xs text-foreground">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-body text-xs text-muted-foreground">{p.count} stores</span>
                      <span className="font-body text-xs font-semibold text-foreground">{p.revenue} TND/mo</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Churn Analysis */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="font-display text-lg flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-warning" />Churn Analysis</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={churnAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="font-body text-xs" />
                    <YAxis className="font-body text-xs" unit="%" />
                    <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontFamily: "DM Sans", fontSize: 11 }} />
                    <Bar dataKey="rate" name="Churn %" fill="hsl(0, 72%, 51%)" fillOpacity={0.6} radius={[3, 3, 0, 0]} barSize={16} />
                    <Line type="monotone" dataKey="recovered" name="Recovered %" stroke="hsl(152, 60%, 40%)" strokeWidth={2} dot={{ r: 3 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <p className="font-body text-xs text-muted-foreground text-center mt-2">Net churn: <span className="font-semibold text-foreground">{(platformStats.churnRate - 2.1).toFixed(1)}%</span> after recovery</p>
            </CardContent>
          </Card>

          {/* LTV by Plan */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="font-display text-lg flex items-center gap-2"><Target className="w-4 h-4 text-accent" />LTV by Plan</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4 mt-2">
                {ltvByPlan.filter(p => p.ltv > 0).map(p => (
                  <div key={p.plan}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-body text-xs font-medium text-foreground">{p.plan}</span>
                      <span className="font-body text-xs font-bold text-foreground">{p.ltv.toLocaleString()} TND</span>
                    </div>
                    <Progress value={(p.ltv / 5000) * 100} className="h-2" />
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-body text-[10px] text-muted-foreground">Avg lifespan: {p.avgLifespan}mo</span>
                      <span className="font-body text-[10px] text-muted-foreground">LTV:CAC = <span className="font-semibold text-foreground">{(p.ltv / p.cac).toFixed(1)}x</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Store Growth + Trial Conversion + Platform Health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Store Growth */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="font-display text-lg">Store Growth</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={storeGrowth}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="font-body text-xs" />
                    <YAxis className="font-body text-xs" />
                    <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8 }} />
                    <Area type="monotone" dataKey="total" stroke="hsl(38, 85%, 55%)" fill="hsl(38, 85%, 55%)" fillOpacity={0.12} strokeWidth={2} />
                    <Bar dataKey="new" name="New" fill="hsl(152, 60%, 40%)" radius={[3, 3, 0, 0]} barSize={10} />
                    <Bar dataKey="churned" name="Churned" fill="hsl(0, 72%, 51%)" radius={[3, 3, 0, 0]} barSize={10} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Trial Conversion */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="font-display text-lg flex items-center gap-2"><Zap className="w-4 h-4 text-accent" />Trial → Paid</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trialConversion}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="font-body text-xs" />
                    <YAxis className="font-body text-xs" />
                    <Tooltip contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontFamily: "DM Sans", fontSize: 11 }} />
                    <Bar dataKey="trials" name="Trials" fill="hsl(210, 80%, 55%)" fillOpacity={0.4} radius={[3, 3, 0, 0]} />
                    <Bar dataKey="converted" name="Converted" fill="hsl(38, 85%, 55%)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="font-body text-xs text-muted-foreground text-center mt-1">Avg conversion rate: <span className="font-semibold text-accent">{trialConvRate}%</span></p>
            </CardContent>
          </Card>

          {/* Platform Health Radar */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="font-display text-lg flex items-center gap-2"><Activity className="w-4 h-4 text-accent" />Platform Health</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={platformRadar}>
                    <PolarGrid className="stroke-border" />
                    <PolarAngleAxis dataKey="metric" className="font-body text-[10px]" />
                    <Radar dataKey="value" stroke="hsl(38, 85%, 55%)" fill="hsl(38, 85%, 55%)" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <p className="font-body text-xs text-center text-muted-foreground">Health Score: <span className="font-semibold text-accent">80/100</span></p>
            </CardContent>
          </Card>
        </div>

        {/* Top Stores Leaderboard + Health Metrics + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Store Leaderboard */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-lg flex items-center gap-2">🏆 Store Leaderboard</CardTitle>
                <Button variant="outline" size="sm" className="font-body text-xs">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topStoresByGMV.map((s, i) => {
                  const statusColor: Record<string, string> = { active: "text-success", trial: "text-info", suspended: "text-destructive", cancelled: "text-muted-foreground" };
                  const medals = ["🥇", "🥈", "🥉"];
                  return (
                    <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                      <span className="text-lg w-6 text-center">{medals[i] || `#${i + 1}`}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-body text-sm font-medium text-foreground">{s.name}</span>
                          <Badge variant="outline" className={`text-[10px] capitalize ${statusColor[s.status]}`}>{s.status}</Badge>
                          <Badge variant="secondary" className="text-[10px] capitalize">{s.planTier}</Badge>
                        </div>
                        <div className="flex items-center gap-4 font-body text-xs text-muted-foreground">
                          <span>{s.productCount} products</span>
                          <span>{s.orderCount.toLocaleString()} orders</span>
                          <span>MRR: {s.mrr} TND/mo</span>
                        </div>
                      </div>
                      <div className="text-end">
                        <p className="font-body text-sm font-bold text-foreground">{s.revenue.toLocaleString()} TND</p>
                        <p className="font-body text-[10px] text-muted-foreground">Total GMV</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Health Metrics + Strategic Insights */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="font-display text-lg flex items-center gap-2"><Shield className="w-4 h-4 text-accent" />Insights & Actions</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                  <p className="font-body text-xs font-medium text-accent mb-1">📈 Revenue Insight</p>
                  <p className="font-body text-[11px] text-muted-foreground">ARPU is <span className="font-semibold text-foreground">{avgRevenuePerStore.toFixed(0)} TND/mo</span>. Target: move 2 Starter stores to Pro for <span className="font-semibold text-foreground">+100 TND/mo MRR</span>.</p>
                </div>
                <div className="p-3 rounded-lg bg-warning/5 border border-warning/20">
                  <p className="font-body text-xs font-medium text-warning mb-1">⚠️ Churn Risk</p>
                  <p className="font-body text-[11px] text-muted-foreground"><span className="font-semibold text-foreground">Digital Hub</span> suspended with 29 TND failed payment. Trigger re-engagement campaign.</p>
                </div>
                <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                  <p className="font-body text-xs font-medium text-success mb-1">🎯 Trial Pipeline</p>
                  <p className="font-body text-[11px] text-muted-foreground"><span className="font-semibold text-foreground">Bloom Beauty</span> trial ends Feb 23. Trial→Paid rate: <span className="font-semibold text-foreground">{trialConvRate}%</span>.</p>
                </div>
                <div className="p-3 rounded-lg bg-info/5 border border-info/20">
                  <p className="font-body text-xs font-medium text-info mb-1">💰 GMV Opportunity</p>
                  <p className="font-body text-[11px] text-muted-foreground">Total platform GMV: <span className="font-semibold text-foreground">{(totalGMV / 1000).toFixed(0)}k TND</span>. Commission earned: <span className="font-semibold text-foreground">{(totalCommission / 1000).toFixed(1)}k TND</span> (5%).</p>
                </div>

                {/* Health Scores */}
                <div className="pt-2 border-t border-border">
                  <p className="font-body text-xs font-medium text-foreground mb-3">Health Metrics</p>
                  {healthScore.map(h => (
                    <div key={h.metric} className="mb-2">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-body text-[11px] text-muted-foreground">{h.metric}</span>
                        <span className={`font-body text-[11px] font-semibold ${h.score >= 90 ? "text-success" : h.score >= 70 ? "text-accent" : "text-warning"}`}>{h.score}%</span>
                      </div>
                      <Progress value={h.score} className="h-1" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default Overview;