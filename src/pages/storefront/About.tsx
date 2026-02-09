import StorefrontLayout from "@/components/storefront/StorefrontLayout";
import { useTranslation } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Award, Leaf, Paintbrush } from "lucide-react";

const About = () => {
  const { t } = useTranslation();
  const values = [
    { icon: Award, title: t("about.quality"), desc: t("about.qualityText") },
    { icon: Leaf, title: t("about.sustainability"), desc: t("about.sustainabilityText") },
    { icon: Paintbrush, title: t("about.craftsmanship"), desc: t("about.craftsmanshipText") },
  ];

  return (
    <StorefrontLayout>
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="font-display text-4xl lg:text-5xl text-foreground mb-4">{t("about.title")}</h1>
          <p className="font-body text-lg text-muted-foreground leading-relaxed">{t("about.subtitle")}</p>
        </motion.div>

        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="font-display text-2xl text-foreground mb-4">{t("about.mission")}</h2>
          <p className="font-body text-muted-foreground leading-relaxed">{t("about.missionText")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {values.map((v, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="text-center p-8 rounded-xl bg-card border border-border">
              <v.icon className="w-8 h-8 mx-auto mb-4 text-accent" />
              <h3 className="font-display text-lg text-foreground mb-2">{v.title}</h3>
              <p className="font-body text-sm text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </StorefrontLayout>
  );
};

export default About;
