import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PlatformLayout from "@/components/platform/PlatformLayout";
import { useTranslation } from "@/context/LanguageContext";
import { plans } from "@/data/platform-data";
import { toast } from "sonner";

const ContactSales = () => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success(t("contactSales.submitted"));
  };

  return (
    <PlatformLayout>
      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl lg:text-5xl text-foreground mb-4">{t("contactSales.title")}</h1>
          <p className="font-body text-lg text-muted-foreground">{t("contactSales.subtitle")}</p>
        </div>

        {submitted ? (
          <div className="text-center py-16 bg-card border border-border rounded-xl">
            <CheckCircle className="w-16 h-16 mx-auto text-success mb-4" />
            <h2 className="font-display text-2xl text-foreground mb-2">{t("contactSales.submitted")}</h2>
            <p className="font-body text-muted-foreground">{t("contactSales.submittedDesc")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-border rounded-xl p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label className="font-body text-sm">{t("contact.name")}</Label><Input required className="mt-1" /></div>
              <div><Label className="font-body text-sm">{t("contact.email")}</Label><Input type="email" required className="mt-1" /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label className="font-body text-sm">{t("contactSales.company")}</Label><Input required className="mt-1" /></div>
              <div><Label className="font-body text-sm">{t("contactSales.employees")}</Label>
                <Select><SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10</SelectItem><SelectItem value="11-50">11-50</SelectItem>
                    <SelectItem value="51-200">51-200</SelectItem><SelectItem value="200+">200+</SelectItem>
                  </SelectContent></Select></div>
            </div>
            <div>
              <Label className="font-body text-sm">{t("contactSales.interest")}</Label>
              <Select><SelectTrigger className="mt-1"><SelectValue placeholder="Select plan" /></SelectTrigger>
                <SelectContent>{plans.map(p => <SelectItem key={p.id} value={p.id}>{p.name} - ${p.monthlyPrice}/mo</SelectItem>)}</SelectContent></Select>
            </div>
            <div><Label className="font-body text-sm">{t("contactSales.message")}</Label><Textarea required className="mt-1 min-h-[120px]" /></div>
            <Button type="submit" className="w-full font-body" size="lg">{t("contactSales.submit")}</Button>
          </form>
        )}
      </div>
    </PlatformLayout>
  );
};

export default ContactSales;
