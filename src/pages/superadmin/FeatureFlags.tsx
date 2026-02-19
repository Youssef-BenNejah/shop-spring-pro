import { useState } from "react";
import { Plus, X, Shield, Zap, Search, ChevronDown, ChevronUp } from "lucide-react";
import SuperAdminLayout from "@/components/platform/SuperAdminLayout";
import { useTranslation } from "@/context/LanguageContext";
import { sampleFeatureFlags, plans } from "@/data/platform-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeatureFlag, PlanTier } from "@/types/platform";
import { toast } from "sonner";

const ALL_TIERS: PlanTier[] = ["free", "starter", "pro", "business", "enterprise"];

const tierColor: Record<PlanTier, string> = {
  free: "bg-muted text-muted-foreground",
  starter: "bg-info/10 text-info border-info/20",
  pro: "bg-accent/10 text-accent border-accent/20",
  business: "bg-success/10 text-success border-success/20",
  enterprise: "bg-primary/10 text-primary border-primary/20",
};

const FeatureFlagsPage = () => {
  const { t } = useTranslation();
  const [flags, setFlags] = useState<FeatureFlag[]>(sampleFeatureFlags);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newFlag, setNewFlag] = useState({ name: "", key: "", description: "", enabledForPlans: [] as PlanTier[] });
  const [tab, setTab] = useState("features");

  const filtered = flags.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.key.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFlag = (id: string) => {
    setFlags(prev => prev.map(f => f.id === id ? { ...f, globallyEnabled: !f.globallyEnabled } : f));
    const flag = flags.find(f => f.id === id);
    toast.success(`${flag?.name} ${flag?.globallyEnabled ? "disabled" : "enabled"}`);
  };

  const togglePlanForFlag = (flagId: string, tier: PlanTier) => {
    setFlags(prev => prev.map(f => {
      if (f.id !== flagId) return f;
      const has = f.enabledForPlans.includes(tier);
      return {
        ...f,
        enabledForPlans: has
          ? f.enabledForPlans.filter(t => t !== tier)
          : [...f.enabledForPlans, tier],
      };
    }));
    const flag = flags.find(f => f.id === flagId);
    const has = flag?.enabledForPlans.includes(tier);
    toast.success(`${tier} ${has ? "removed from" : "added to"} ${flag?.name}`);
  };

  const handleAddFlag = () => {
    if (!newFlag.name || !newFlag.key) return;
    const flag: FeatureFlag = {
      id: `ff${Date.now()}`,
      name: newFlag.name,
      key: newFlag.key,
      description: newFlag.description,
      enabledForPlans: newFlag.enabledForPlans,
      enabledForStores: [],
      globallyEnabled: true,
    };
    setFlags(prev => [...prev, flag]);
    setNewFlag({ name: "", key: "", description: "", enabledForPlans: [] });
    setAddOpen(false);
    toast.success(`Feature "${flag.name}" created`);
  };

  const deleteFlag = (id: string) => {
    const flag = flags.find(f => f.id === id);
    setFlags(prev => prev.filter(f => f.id !== id));
    toast.success(`${flag?.name} deleted`);
  };

  const toggleNewFlagPlan = (tier: PlanTier) => {
    setNewFlag(prev => ({
      ...prev,
      enabledForPlans: prev.enabledForPlans.includes(tier)
        ? prev.enabledForPlans.filter(t => t !== tier)
        : [...prev.enabledForPlans, tier],
    }));
  };

  // Build plan→features matrix
  const planMatrix = ALL_TIERS.map(tier => ({
    tier,
    plan: plans.find(p => p.tier === tier),
    features: flags.filter(f => f.globallyEnabled && f.enabledForPlans.includes(tier)),
    totalFeatures: flags.filter(f => f.globallyEnabled).length,
  }));

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl text-foreground">{t("superAdmin.featureFlags")}</h1>
            <p className="font-body text-sm text-muted-foreground mt-1">Control feature access per subscription tier</p>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="font-body"><Plus className="w-4 h-4 me-2" />Add Feature</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle className="font-display">New Feature Flag</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="font-body text-sm">Feature Name</Label>
                  <Input className="mt-1" placeholder="e.g. AI Product Recommendations" value={newFlag.name} onChange={e => setNewFlag(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <Label className="font-body text-sm">Feature Key</Label>
                  <Input className="mt-1" placeholder="e.g. ai_recommendations" value={newFlag.key} onChange={e => setNewFlag(p => ({ ...p, key: e.target.value }))} />
                </div>
                <div>
                  <Label className="font-body text-sm">Description</Label>
                  <Textarea className="mt-1" placeholder="What this feature does..." value={newFlag.description} onChange={e => setNewFlag(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div>
                  <Label className="font-body text-sm mb-2 block">Enable for Plans</Label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_TIERS.map(tier => (
                      <button key={tier} type="button" onClick={() => toggleNewFlagPlan(tier)}
                        className={`px-3 py-1.5 rounded-md font-body text-xs capitalize border transition-colors ${
                          newFlag.enabledForPlans.includes(tier)
                            ? "bg-accent text-accent-foreground border-accent"
                            : "bg-secondary text-muted-foreground border-border hover:border-foreground"
                        }`}>
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>
                <Button className="w-full font-body" onClick={handleAddFlag} disabled={!newFlag.name || !newFlag.key}>Create Feature</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="font-body">
            <TabsTrigger value="features"><Zap className="w-3.5 h-3.5 me-1.5" />Features</TabsTrigger>
            <TabsTrigger value="matrix"><Shield className="w-3.5 h-3.5 me-1.5" />Plan Matrix</TabsTrigger>
          </TabsList>

          {/* ─── FEATURES LIST ─── */}
          <TabsContent value="features" className="space-y-4 mt-4">
            <div className="relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search features..." value={search} onChange={e => setSearch(e.target.value)} className="ps-9 font-body" />
            </div>

            <div className="space-y-3">
              {filtered.map(flag => {
                const isExpanded = expandedId === flag.id;
                return (
                  <Card key={flag.id} className={`transition-all ${!flag.globallyEnabled ? "opacity-60" : ""}`}>
                    <CardContent className="p-0">
                      {/* Header row */}
                      <div className="flex items-center gap-3 p-4">
                        <Switch checked={flag.globallyEnabled} onCheckedChange={() => toggleFlag(flag.id)} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-body text-sm font-medium text-foreground">{flag.name}</h3>
                            <Badge variant="outline" className="font-mono text-[10px]">{flag.key}</Badge>
                          </div>
                          <p className="font-body text-xs text-muted-foreground mt-0.5">{flag.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="hidden sm:flex items-center gap-1">
                            {ALL_TIERS.map(tier => (
                              <span key={tier} className={`w-2 h-2 rounded-full ${flag.enabledForPlans.includes(tier) && flag.globallyEnabled ? "bg-accent" : "bg-border"}`}
                                title={`${tier}: ${flag.enabledForPlans.includes(tier) ? "enabled" : "disabled"}`} />
                            ))}
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpandedId(isExpanded ? null : flag.id)}>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      {/* Expanded plan toggles */}
                      {isExpanded && (
                        <div className="border-t border-border px-4 py-4 bg-secondary/20">
                          <p className="font-body text-xs font-medium text-foreground mb-3">Enable/Disable per Plan</p>
                          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                            {ALL_TIERS.map(tier => {
                              const enabled = flag.enabledForPlans.includes(tier);
                              const plan = plans.find(p => p.tier === tier);
                              return (
                                <button key={tier} onClick={() => togglePlanForFlag(flag.id, tier)}
                                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                                    enabled
                                      ? "border-accent bg-accent/5 shadow-sm"
                                      : "border-border bg-card hover:border-muted-foreground"
                                  }`}>
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                    enabled ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                                  }`}>
                                    {enabled ? "✓" : "✕"}
                                  </div>
                                  <span className="font-body text-xs font-medium text-foreground capitalize">{tier}</span>
                                  <span className="font-body text-[10px] text-muted-foreground">{plan?.monthlyPrice || 0} TND/mo</span>
                                </button>
                              );
                            })}
                          </div>
                          <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border">
                            <Button variant="outline" size="sm" className="font-body text-xs" onClick={() => {
                              setFlags(prev => prev.map(f => f.id === flag.id ? { ...f, enabledForPlans: [...ALL_TIERS] } : f));
                              toast.success("Enabled for all plans");
                            }}>Enable All</Button>
                            <Button variant="outline" size="sm" className="font-body text-xs" onClick={() => {
                              setFlags(prev => prev.map(f => f.id === flag.id ? { ...f, enabledForPlans: [] } : f));
                              toast.success("Disabled for all plans");
                            }}>Disable All</Button>
                            <Button variant="destructive" size="sm" className="font-body text-xs" onClick={() => deleteFlag(flag.id)}>Delete Feature</Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
              {filtered.length === 0 && (
                <p className="font-body text-sm text-muted-foreground text-center py-8">No features found</p>
              )}
            </div>
          </TabsContent>

          {/* ─── PLAN MATRIX ─── */}
          <TabsContent value="matrix" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="font-body text-xs text-muted-foreground text-start p-4 min-w-[200px]">Feature</th>
                        {ALL_TIERS.map(tier => {
                          const plan = plans.find(p => p.tier === tier);
                          return (
                            <th key={tier} className="p-4 text-center min-w-[100px]">
                              <span className="font-body text-xs font-semibold text-foreground capitalize block">{tier}</span>
                              <span className="font-body text-[10px] text-muted-foreground">{plan?.monthlyPrice || 0} TND/mo</span>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {flags.map(flag => (
                        <tr key={flag.id} className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${!flag.globallyEnabled ? "opacity-40" : ""}`}>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${flag.globallyEnabled ? "bg-success" : "bg-muted-foreground"}`} />
                              <div>
                                <span className="font-body text-sm font-medium text-foreground">{flag.name}</span>
                                <p className="font-body text-[10px] text-muted-foreground">{flag.key}</p>
                              </div>
                            </div>
                          </td>
                          {ALL_TIERS.map(tier => {
                            const enabled = flag.enabledForPlans.includes(tier) && flag.globallyEnabled;
                            return (
                              <td key={tier} className="p-4 text-center">
                                <button onClick={() => flag.globallyEnabled && togglePlanForFlag(flag.id, tier)}
                                  className={`w-8 h-8 rounded-lg inline-flex items-center justify-center text-sm font-bold transition-all ${
                                    enabled
                                      ? "bg-accent/15 text-accent hover:bg-accent/25"
                                      : "bg-secondary text-muted-foreground hover:bg-muted"
                                  } ${!flag.globallyEnabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                                  disabled={!flag.globallyEnabled}>
                                  {enabled ? "✓" : "—"}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-border bg-secondary/20">
                        <td className="p-4 font-body text-xs font-semibold text-foreground">Total Features</td>
                        {planMatrix.map(pm => (
                          <td key={pm.tier} className="p-4 text-center">
                            <span className="font-body text-sm font-bold text-foreground">{pm.features.length}</span>
                            <span className="font-body text-[10px] text-muted-foreground"> / {pm.totalFeatures}</span>
                          </td>
                        ))}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
};

export default FeatureFlagsPage;