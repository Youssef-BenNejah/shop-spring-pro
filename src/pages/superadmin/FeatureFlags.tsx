import { useState } from "react";
import SuperAdminLayout from "@/components/platform/SuperAdminLayout";
import { useTranslation } from "@/context/LanguageContext";
import { sampleFeatureFlags } from "@/data/platform-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { FeatureFlag } from "@/types/platform";
import { toast } from "sonner";

const FeatureFlags = () => {
  const { t } = useTranslation();
  const [flags, setFlags] = useState<FeatureFlag[]>(sampleFeatureFlags);

  const toggleFlag = (id: string) => {
    setFlags(prev => prev.map(f => f.id === id ? { ...f, globallyEnabled: !f.globallyEnabled } : f));
    toast.success("Feature flag updated");
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div><h1 className="font-display text-2xl text-foreground">{t("superAdmin.featureFlags")}</h1></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flags.map(flag => (
            <Card key={flag.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-body text-sm font-medium text-foreground">{flag.name}</h3>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">{flag.description}</p>
                  </div>
                  <Switch checked={flag.globallyEnabled} onCheckedChange={() => toggleFlag(flag.id)} />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">{t("superAdmin.enabledPlans")}:</span>
                  {flag.enabledForPlans.map(p => <Badge key={p} variant="secondary" className="font-body text-[10px] capitalize">{p}</Badge>)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default FeatureFlags;
