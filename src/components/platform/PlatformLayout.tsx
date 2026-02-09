import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/shared/ThemeToggle";
import LanguageSelector from "@/components/shared/LanguageSelector";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const PlatformLayout = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/platform", label: t("platform.home") },
    { to: "/platform/pricing", label: t("platform.pricing") },
    { to: "/platform/features", label: t("platform.features") },
    { to: "/platform/templates", label: t("platform.templates") },
    { to: "/platform/contact-sales", label: t("platform.contact") },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/platform" className="font-display text-xl lg:text-2xl font-semibold tracking-wide text-foreground">
              MAISON <span className="text-accent text-sm font-body font-normal tracking-normal">Platform</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to}
                  className={`font-body text-sm transition-colors ${isActive(link.to) ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" className="font-body text-sm" asChild>
                  <Link to="/auth">{t("platform.login")}</Link>
                </Button>
                <Button className="font-body text-sm" asChild>
                  <Link to="/onboarding">{t("platform.signup")}</Link>
                </Button>
              </div>
              <button className="lg:hidden p-2 text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {menuOpen && (
            <nav className="lg:hidden pb-4 border-t border-border pt-4 flex flex-col gap-3">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className="font-body text-sm py-2 text-foreground">
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="font-body text-sm flex-1" asChild>
                  <Link to="/auth" onClick={() => setMenuOpen(false)}>{t("platform.login")}</Link>
                </Button>
                <Button className="font-body text-sm flex-1" asChild>
                  <Link to="/onboarding" onClick={() => setMenuOpen(false)}>{t("platform.signup")}</Link>
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-display text-lg font-semibold mb-3">MAISON</h3>
              <p className="font-body text-sm text-primary-foreground/60">The modern ecommerce platform for ambitious businesses.</p>
            </div>
            <div>
              <h4 className="font-body text-sm font-semibold uppercase tracking-wide mb-3">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/platform/features" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground">{t("platform.features")}</Link></li>
                <li><Link to="/platform/pricing" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground">{t("platform.pricing")}</Link></li>
                <li><Link to="/platform/templates" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground">{t("platform.templates")}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-body text-sm font-semibold uppercase tracking-wide mb-3">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground">{t("nav.about")}</Link></li>
                <li><Link to="/platform/contact-sales" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground">{t("platform.contact")}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-body text-sm font-semibold uppercase tracking-wide mb-3">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground">{t("footer.terms")}</Link></li>
                <li><Link to="/about" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground">{t("footer.privacy")}</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/10 mt-8 pt-6">
            <p className="font-body text-xs text-primary-foreground/40 text-center">{t("footer.copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PlatformLayout;
