import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PlatformLayout from "@/components/platform/PlatformLayout";
import { useTranslation } from "@/context/LanguageContext";
import { storeTemplates } from "@/data/platform-data";
import { motion } from "framer-motion";

const Templates = () => {
  const { t } = useTranslation();

  return (
    <PlatformLayout>
      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="font-display text-4xl lg:text-5xl text-foreground mb-4">{t("templates.title")}</h1>
          <p className="font-body text-lg text-muted-foreground">{t("templates.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {storeTemplates.map((tmpl, i) => (
            <motion.div key={tmpl.type} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="group rounded-xl border border-border bg-card p-6 hover:border-accent/30 hover:shadow-lg transition-all flex flex-col">
              <div className="text-4xl mb-4">{tmpl.icon}</div>
              <h3 className="font-display text-lg text-foreground mb-1">{tmpl.name}</h3>
              <p className="font-body text-sm text-muted-foreground mb-4 flex-1">{tmpl.description}</p>
              <div className="mb-3">
                <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2">{t("templates.categories")}</p>
                <div className="flex flex-wrap gap-1">
                  {tmpl.defaultCategories.slice(0, 4).map(c => <Badge key={c} variant="secondary" className="font-body text-[10px]">{c}</Badge>)}
                  {tmpl.defaultCategories.length > 4 && <Badge variant="secondary" className="font-body text-[10px]">+{tmpl.defaultCategories.length - 4}</Badge>}
                </div>
              </div>
              <div className="mb-4">
                <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2">{t("templates.attributes")}</p>
                <div className="flex flex-wrap gap-1">
                  {tmpl.defaultAttributes.slice(0, 3).map(a => <Badge key={a} variant="outline" className="font-body text-[10px]">{a}</Badge>)}
                </div>
              </div>
              <Button variant="outline" className="w-full font-body" size="sm" asChild>
                <Link to={`/onboarding?type=${tmpl.type}`}>{t("templates.useTemplate")}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </PlatformLayout>
  );
};

export default Templates;
