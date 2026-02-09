import { ShoppingBag, BarChart3, Shield, CreditCard, FileText, Tag, Globe, Lock } from "lucide-react";
import PlatformLayout from "@/components/platform/PlatformLayout";
import { useTranslation } from "@/context/LanguageContext";
import { motion } from "framer-motion";

const Features = () => {
  const { t } = useTranslation();
  const features = [
    { icon: ShoppingBag, title: t("features.storefront"), desc: t("features.storefrontDesc") },
    { icon: BarChart3, title: t("features.dashboard"), desc: t("features.dashboardDesc") },
    { icon: CreditCard, title: t("features.payments"), desc: t("features.paymentsDesc") },
    { icon: Shield, title: t("features.analytics"), desc: t("features.analyticsDesc") },
    { icon: FileText, title: t("features.invoices"), desc: t("features.invoicesDesc") },
    { icon: Tag, title: t("features.marketing"), desc: t("features.marketingDesc") },
    { icon: Globe, title: t("features.multiLang"), desc: t("features.multiLangDesc") },
    { icon: Lock, title: t("features.security"), desc: t("features.securityDesc") },
  ];

  return (
    <PlatformLayout>
      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="font-display text-4xl lg:text-5xl text-foreground mb-4">{t("features.title")}</h1>
          <p className="font-body text-lg text-muted-foreground">{t("features.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="p-6 rounded-xl bg-card border border-border hover:border-accent/30 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">{f.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </PlatformLayout>
  );
};

export default Features;
