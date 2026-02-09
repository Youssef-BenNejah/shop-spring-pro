import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import StorefrontLayout from "@/components/storefront/StorefrontLayout";
import ProductCard from "@/components/storefront/ProductCard";
import { products, categories, getBestSellers } from "@/data/mock-data";
import { useTranslation } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { toast } from "sonner";
import heroImage from "@/assets/hero-image.jpg";

const Home = () => {
  const { t } = useTranslation();
  const bestSellers = getBestSellers();
  const featured = products.slice(0, 8);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email") as string;
    if (email) { toast.success(t("common.success")); e.currentTarget.reset(); }
  };

  return (
    <StorefrontLayout>
      <section className="relative h-[70vh] lg:h-[85vh] overflow-hidden">
        <img src={heroImage} alt="Premium lifestyle products" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative h-full container mx-auto px-4 lg:px-8 flex items-end pb-16 lg:pb-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
            <h1 className="font-display text-4xl lg:text-6xl font-semibold text-primary-foreground leading-tight mb-4">
              {t("hero.title").split("{italic}").map((part, i) =>
                i === 1 ? <span key={i} className="italic">{part.replace("{/italic}", "")}</span> : <span key={i}>{part.replace("{/italic}", "")}</span>
              )}
            </h1>
            <p className="font-body text-base lg:text-lg text-primary-foreground/80 mb-8">{t("hero.subtitle")}</p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-body" asChild>
              <Link to="/catalog">{t("hero.cta")} <ArrowRight className="w-4 h-4 ms-2" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <h2 className="font-display text-2xl lg:text-3xl text-foreground mb-10 text-center">{t("section.shopByCategory")}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((cat, i) => (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link to={`/catalog?category=${cat.slug}`} className="block group relative aspect-[4/5] bg-secondary rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/10 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <h3 className="font-display text-xl lg:text-2xl text-foreground font-medium mb-1">{cat.name}</h3>
                  <p className="font-body text-xs text-muted-foreground">{cat.productCount} {t("section.products")}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-display text-2xl lg:text-3xl text-foreground">{t("section.bestSellers")}</h2>
          <Link to="/catalog" className="font-body text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">{t("section.viewAll")} <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {bestSellers.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-24">
        <h2 className="font-display text-2xl lg:text-3xl text-foreground mb-10 text-center">{t("section.newArrivals")}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-24">
        <div className="bg-primary rounded-xl p-10 lg:p-16 text-center">
          <h2 className="font-display text-2xl lg:text-4xl text-primary-foreground mb-4">{t("section.joinWorld")}</h2>
          <p className="font-body text-sm lg:text-base text-primary-foreground/70 mb-8 max-w-md mx-auto">{t("section.subscribeText")}</p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input name="email" type="email" required placeholder={t("section.enterEmail")} className="flex-1 rounded-md px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90 font-body px-8">{t("section.subscribe")}</Button>
          </form>
        </div>
      </section>
    </StorefrontLayout>
  );
};

export default Home;
