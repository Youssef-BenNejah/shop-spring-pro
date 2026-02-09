import { Link } from "react-router-dom";
import { ArrowRight, Zap, BarChart3, ShoppingBag, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlatformLayout from "@/components/platform/PlatformLayout";
import { useTranslation } from "@/context/LanguageContext";
import { motion } from "framer-motion";

const LandingHome = () => {
  const { t } = useTranslation();

  const stats = [
    { value: t("landing.stat1"), label: t("landing.stat1Label") },
    { value: t("landing.stat2"), label: t("landing.stat2Label") },
    { value: t("landing.stat3"), label: t("landing.stat3Label") },
    { value: t("landing.stat4"), label: t("landing.stat4Label") },
  ];

  const features = [
    { icon: ShoppingBag, title: t("landing.feat1"), desc: t("landing.feat1Desc") },
    { icon: BarChart3, title: t("landing.feat2"), desc: t("landing.feat2Desc") },
    { icon: Shield, title: t("landing.feat3"), desc: t("landing.feat3Desc") },
    { icon: Zap, title: t("landing.feat4"), desc: t("landing.feat4Desc") },
  ];

  return (
    <PlatformLayout>
      {/* Hero */}
      <section className="container mx-auto px-4 lg:px-8 py-20 lg:py-32 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <h1 className="font-display text-4xl md:text-5xl lg:text-7xl text-foreground font-semibold leading-tight mb-6 max-w-4xl mx-auto">
            {t("landing.headline")}
          </h1>
          <p className="font-body text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("landing.subheadline")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <Button size="lg" className="font-body text-base px-8 py-6" asChild>
              <Link to="/onboarding">{t("landing.cta")} <ArrowRight className="w-4 h-4 ms-2" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="font-body text-base px-8 py-6" asChild>
              <Link to="/platform/pricing">{t("platform.pricing")}</Link>
            </Button>
          </div>
          <p className="font-body text-sm text-muted-foreground">{t("landing.ctaSub")}</p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <p className="font-display text-3xl lg:text-4xl font-semibold text-foreground">{s.value}</p>
                <p className="font-body text-sm text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 lg:px-8 py-20 lg:py-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl lg:text-4xl text-foreground mb-4">{t("landing.whyTitle")}</h2>
          <p className="font-body text-lg text-muted-foreground">{t("landing.whySub")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="p-8 rounded-xl bg-card border border-border hover:border-accent/30 transition-colors">
              <f.icon className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-display text-xl text-foreground mb-2">{f.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 lg:px-8 pb-20 lg:pb-28">
        <div className="bg-primary rounded-2xl p-12 lg:p-20 text-center">
          <h2 className="font-display text-3xl lg:text-4xl text-primary-foreground mb-4">{t("landing.readyTitle")}</h2>
          <p className="font-body text-lg text-primary-foreground/70 mb-8 max-w-xl mx-auto">{t("landing.readySub")}</p>
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-body text-base px-8 py-6" asChild>
            <Link to="/onboarding">{t("landing.cta")} <ArrowRight className="w-4 h-4 ms-2" /></Link>
          </Button>
        </div>
      </section>
    </PlatformLayout>
  );
};

export default LandingHome;
