import { Link } from "react-router-dom";
import { useTranslation } from "@/context/LanguageContext";
import { toast } from "sonner";

const Footer = () => {
  const { t } = useTranslation();

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email") as string;
    if (email) {
      toast.success(t("common.success"), { description: `Subscribed with ${email}` });
      form.reset();
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="font-display text-xl font-semibold mb-4">MAISON</h3>
            <p className="font-body text-sm text-primary-foreground/70 leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </div>
          <div>
            <h4 className="font-body text-sm font-semibold tracking-wide uppercase mb-4">{t("footer.shop")}</h4>
            <ul className="space-y-2">
              <li><Link to="/catalog" className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("footer.allProducts")}</Link></li>
              <li><Link to="/catalog?category=clothing" className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("nav.clothing")}</Link></li>
              <li><Link to="/catalog?category=accessories" className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("nav.accessories")}</Link></li>
              <li><Link to="/catalog?category=home" className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("nav.homeDecor")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-body text-sm font-semibold tracking-wide uppercase mb-4">{t("footer.help")}</h4>
            <ul className="space-y-2">
              <li><Link to="/faq" className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("footer.shippingReturns")}</Link></li>
              <li><Link to="/faq" className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("footer.faq")}</Link></li>
              <li><Link to="/contact" className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("footer.contact")}</Link></li>
              <li><Link to="/about" className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("nav.about")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-body text-sm font-semibold tracking-wide uppercase mb-4">{t("footer.newsletter")}</h4>
            <p className="font-body text-sm text-primary-foreground/70 mb-3">{t("footer.newsletterText")}</p>
            <form onSubmit={handleSubscribe} className="flex">
              <input name="email" type="email" required placeholder={t("section.enterEmail")} className="flex-1 bg-primary-foreground/10 border border-primary-foreground/20 rounded-s-md px-3 py-2 text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:border-accent" />
              <button type="submit" className="bg-accent text-accent-foreground px-4 py-2 rounded-e-md text-sm font-medium hover:opacity-90 transition-opacity">{t("footer.join")}</button>
            </form>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-primary-foreground/50">{t("footer.copyright")}</p>
          <div className="flex gap-4">
            <Link to="/about" className="font-body text-xs text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors">{t("footer.terms")}</Link>
            <Link to="/about" className="font-body text-xs text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors">{t("footer.privacy")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
