import { useState } from "react";
import StorefrontLayout from "@/components/storefront/StorefrontLayout";
import { useTranslation } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast.success(t("contact.sent"));
  };

  const info = [
    { icon: MapPin, label: t("contact.addressLabel"), value: t("contact.addressValue") },
    { icon: Phone, label: t("checkout.phone"), value: t("contact.phoneValue") },
    { icon: Mail, label: t("checkout.email"), value: t("contact.emailValue") },
    { icon: Clock, label: "", value: t("contact.hours") },
  ];

  return (
    <StorefrontLayout>
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-display text-4xl lg:text-5xl text-foreground mb-4">{t("contact.title")}</h1>
          <p className="font-body text-lg text-muted-foreground">{t("contact.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {sent ? (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-card border border-border rounded-xl">
              <CheckCircle className="w-12 h-12 text-success mb-4" />
              <h2 className="font-display text-2xl text-foreground mb-2">{t("contact.sent")}</h2>
              <p className="font-body text-muted-foreground mb-6">{t("contact.sentDesc")}</p>
              <Button variant="outline" onClick={() => setSent(false)}>{t("common.back")}</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded-xl p-6 lg:p-8">
              <div><Label className="font-body text-sm">{t("contact.name")}</Label><Input required className="mt-1" /></div>
              <div><Label className="font-body text-sm">{t("contact.email")}</Label><Input type="email" required className="mt-1" /></div>
              <div><Label className="font-body text-sm">{t("contact.subject")}</Label><Input required className="mt-1" /></div>
              <div><Label className="font-body text-sm">{t("contact.message")}</Label><Textarea required className="mt-1 min-h-[120px]" /></div>
              <Button type="submit" className="w-full font-body" size="lg">{t("contact.send")}</Button>
            </form>
          )}

          <div className="space-y-6">
            <h2 className="font-display text-xl text-foreground">{t("contact.info")}</h2>
            {info.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
                <item.icon className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  {item.label && <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{item.label}</p>}
                  <p className="font-body text-sm text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
};

export default Contact;
