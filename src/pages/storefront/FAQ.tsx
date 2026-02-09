import StorefrontLayout from "@/components/storefront/StorefrontLayout";
import { useTranslation } from "@/context/LanguageContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const { t } = useTranslation();
  const faqs = Array.from({ length: 6 }, (_, i) => ({ q: t(`faq.q${i + 1}`), a: t(`faq.a${i + 1}`) }));

  return (
    <StorefrontLayout>
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl lg:text-5xl text-foreground mb-4">{t("faq.title")}</h1>
          <p className="font-body text-lg text-muted-foreground">{t("faq.subtitle")}</p>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`q${i}`} className="border border-border rounded-lg px-6 bg-card">
              <AccordionTrigger className="font-body text-sm font-medium text-foreground hover:no-underline py-5">{faq.q}</AccordionTrigger>
              <AccordionContent className="font-body text-sm text-muted-foreground pb-5">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </StorefrontLayout>
  );
};

export default FAQ;
