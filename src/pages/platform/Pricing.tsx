import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlatformLayout from "@/components/platform/PlatformLayout";
import { useTranslation } from "@/context/LanguageContext";
import { plans } from "@/data/platform-data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const Pricing = () => {
  const { t } = useTranslation();
  const [yearly, setYearly] = useState(false);

  const featureChecks = (plan: typeof plans[0]) => [
    { label: `${plan.limits.maxProducts === -1 ? t("pricing.unlimited") : plan.limits.maxProducts} ${t("pricing.products")}`, enabled: true },
    { label: `${plan.limits.maxMonthlyOrders === -1 ? t("pricing.unlimited") : plan.limits.maxMonthlyOrders.toLocaleString()} ${t("pricing.orders")}`, enabled: true },
    { label: `${plan.limits.maxStaffAccounts === -1 ? t("pricing.unlimited") : plan.limits.maxStaffAccounts} ${t("pricing.staff")}`, enabled: true },
    { label: t("pricing.customDomain"), enabled: plan.limits.customDomain },
    { label: t("pricing.advancedAnalytics"), enabled: plan.limits.advancedAnalytics },
    { label: t("pricing.abandonedCart"), enabled: plan.limits.abandonedCart },
    { label: t("pricing.automatedEmails"), enabled: plan.limits.automatedEmails },
    { label: t("pricing.apiAccess"), enabled: plan.limits.apiAccess },
    { label: t("pricing.webhooks"), enabled: plan.limits.webhooks },
    { label: t("pricing.multiWarehouse"), enabled: plan.limits.multiWarehouse },
    { label: t("pricing.prioritySupport"), enabled: plan.limits.prioritySupport },
  ];

  return (
    <PlatformLayout>
      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-display text-4xl lg:text-5xl text-foreground mb-4">{t("pricing.title")}</h1>
          <p className="font-body text-lg text-muted-foreground">{t("pricing.subtitle")}</p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`font-body text-sm ${!yearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>{t("pricing.monthly")}</span>
          <button onClick={() => setYearly(!yearly)} className={`relative w-14 h-7 rounded-full transition-colors ${yearly ? "bg-accent" : "bg-border"}`}>
            <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-primary-foreground shadow transition-transform ${yearly ? "translate-x-7" : "translate-x-0.5"}`} />
          </button>
          <span className={`font-body text-sm ${yearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>{t("pricing.yearly")} <span className="text-success text-xs">({t("pricing.save")})</span></span>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-5 mb-20">
          {plans.map((plan, i) => (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`relative rounded-xl border p-6 flex flex-col ${plan.popular ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border bg-card"}`}>
              {plan.popular && <span className="absolute -top-3 start-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">{t("pricing.popular")}</span>}
              <h3 className="font-display text-xl text-foreground mb-1">{plan.name}</h3>
              <p className="font-body text-xs text-muted-foreground mb-4">{plan.description}</p>
              <div className="mb-6">
                {plan.monthlyPrice === 0 ? (
                  <span className="font-display text-3xl font-semibold text-foreground">{t("pricing.free")}</span>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-3xl font-semibold text-foreground">${yearly ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice}</span>
                    <span className="font-body text-sm text-muted-foreground">{t("pricing.mo")}</span>
                  </div>
                )}
                {yearly && plan.yearlyPrice > 0 && <p className="font-body text-xs text-muted-foreground mt-1">${plan.yearlyPrice}{t("pricing.yr")}</p>}
              </div>
              <Button className="w-full font-body mb-6" variant={plan.popular ? "default" : "outline"} asChild>
                <Link to={plan.tier === "enterprise" ? "/platform/contact-sales" : "/onboarding"}>
                  {plan.tier === "enterprise" ? t("pricing.contactSales") : t("pricing.getStarted")}
                </Link>
              </Button>
              <div className="space-y-2.5 flex-1">
                <p className="font-body text-xs font-medium text-foreground uppercase tracking-wider mb-3">{t("pricing.features")}</p>
                {featureChecks(plan).map((f, j) => (
                  <div key={j} className="flex items-center gap-2">
                    {f.enabled ? <Check className="w-3.5 h-3.5 text-success flex-shrink-0" /> : <XIcon className="w-3.5 h-3.5 text-muted-foreground/30 flex-shrink-0" />}
                    <span className={`font-body text-xs ${f.enabled ? "text-foreground" : "text-muted-foreground/50"}`}>{f.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl text-foreground text-center mb-8">{t("pricing.faqTitle")}</h2>
          <Accordion type="single" collapsible className="space-y-3">
            {[1, 2, 3].map(i => (
              <AccordionItem key={i} value={`q${i}`} className="border border-border rounded-lg px-6 bg-card">
                <AccordionTrigger className="font-body text-sm font-medium text-foreground hover:no-underline py-5">{t(`pricing.faq${i}Q`)}</AccordionTrigger>
                <AccordionContent className="font-body text-sm text-muted-foreground pb-5">{t(`pricing.faq${i}A`)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </PlatformLayout>
  );
};

export default Pricing;
