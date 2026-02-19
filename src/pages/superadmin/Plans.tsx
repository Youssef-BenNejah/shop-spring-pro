import SuperAdminLayout from "@/components/platform/SuperAdminLayout";
import { useTranslation } from "@/context/LanguageContext";
import { plans } from "@/data/platform-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

const Plans = () => {
  const { t } = useTranslation();

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div><h1 className="font-display text-2xl text-foreground">{t("superAdmin.plans")}</h1></div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {plans.map(plan => (
            <Card key={plan.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-display text-lg">{plan.name}</CardTitle>
                  {plan.popular && <Badge className="font-body text-[10px]">{t("pricing.popular")}</Badge>}
                </div>
                <p className="font-body text-xs text-muted-foreground">{plan.description}</p>
                <p className="font-display text-2xl font-semibold text-foreground mt-2">{plan.monthlyPrice} TND<span className="font-body text-sm text-muted-foreground">{t("pricing.mo")}</span></p>
              </CardHeader>
              <CardContent>
                <p className="font-body text-xs font-medium text-foreground uppercase tracking-wider mb-3">{t("superAdmin.planLimits")}</p>
                <div className="space-y-2">
                  {[
                    { label: t("pricing.products"), val: plan.limits.maxProducts === -1 ? "∞" : plan.limits.maxProducts },
                    { label: t("pricing.orders"), val: plan.limits.maxMonthlyOrders === -1 ? "∞" : plan.limits.maxMonthlyOrders.toLocaleString() },
                    { label: t("pricing.staff"), val: plan.limits.maxStaffAccounts === -1 ? "∞" : plan.limits.maxStaffAccounts },
                  ].map(l => (
                    <div key={l.label} className="flex justify-between font-body text-sm"><span className="text-muted-foreground">{l.label}</span><span className="text-foreground font-medium">{l.val}</span></div>
                  ))}
                  {[
                    { label: t("pricing.customDomain"), on: plan.limits.customDomain },
                    { label: t("pricing.advancedAnalytics"), on: plan.limits.advancedAnalytics },
                    { label: t("pricing.apiAccess"), on: plan.limits.apiAccess },
                    { label: t("pricing.multiWarehouse"), on: plan.limits.multiWarehouse },
                    { label: t("pricing.prioritySupport"), on: plan.limits.prioritySupport },
                  ].map(f => (
                    <div key={f.label} className="flex items-center gap-2">
                      {f.on ? <Check className="w-3.5 h-3.5 text-success" /> : <X className="w-3.5 h-3.5 text-muted-foreground/30" />}
                      <span className={`font-body text-xs ${f.on ? "text-foreground" : "text-muted-foreground/50"}`}>{f.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default Plans;
