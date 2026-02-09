import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, ArrowRight, ArrowLeft, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslation } from "@/context/LanguageContext";
import { storeTemplates } from "@/data/platform-data";
import { StoreType } from "@/types/platform";
import ThemeToggle from "@/components/shared/ThemeToggle";
import LanguageSelector from "@/components/shared/LanguageSelector";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const steps = ["step1", "step2", "step3", "step4", "step5", "step6"] as const;

const StoreOnboarding = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const [storeType, setStoreType] = useState<StoreType>((searchParams.get("type") as StoreType) || "general");
  const [storeName, setStoreName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#1a1a2e");
  const [secondaryColor, setSecondaryColor] = useState("#d4a574");
  const [stylePreset, setStylePreset] = useState("luxury");
  const [currency, setCurrency] = useState("USD");
  const [subdomain, setSubdomain] = useState("");
  const [paymentMode, setPaymentMode] = useState("test");
  const [domainOption, setDomainOption] = useState("subdomain");
  const [catalogOption, setCatalogOption] = useState("skip");

  const next = () => { if (step < 5) setStep(step + 1); else { setDone(true); toast.success(t("onboarding.congratulations")); } };
  const back = () => { if (step > 0) setStep(step - 1); };

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <Rocket className="w-16 h-16 mx-auto text-accent mb-6" />
          <h1 className="font-display text-3xl text-foreground mb-2">{t("onboarding.congratulations")}</h1>
          <p className="font-body text-muted-foreground mb-8">{t("onboarding.congratulationsDesc")}</p>
          <div className="flex gap-3 justify-center">
            <Button className="font-body" onClick={() => navigate("/admin")}>{t("onboarding.goToDashboard")}</Button>
            <Button variant="outline" className="font-body" onClick={() => navigate("/")}>{t("onboarding.viewStorefront")}</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border h-14 flex items-center px-4 lg:px-8">
        <Link to="/platform" className="font-display text-lg font-semibold text-foreground">MAISON</Link>
        <div className="ms-auto flex items-center gap-1"><LanguageSelector /><ThemeToggle /></div>
      </header>

      <div className="flex-1 container mx-auto px-4 lg:px-8 py-8 lg:py-12 max-w-2xl">
        <h1 className="font-display text-2xl lg:text-3xl text-foreground text-center mb-2">{t("onboarding.title")}</h1>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-body font-medium transition-colors ${i < step ? "bg-accent text-accent-foreground" : i === step ? "bg-foreground text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < 5 && <div className={`w-6 h-0.5 ${i < step ? "bg-accent" : "bg-border"}`} />}
            </div>
          ))}
        </div>
        <p className="font-body text-sm text-muted-foreground text-center mb-8">{t(`onboarding.${steps[step]}`)}</p>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
            className="bg-card border border-border rounded-xl p-6 lg:p-8">

            {step === 0 && (
              <div className="space-y-4">
                <p className="font-body text-sm text-foreground font-medium mb-4">{t("onboarding.selectType")}</p>
                <div className="grid grid-cols-2 gap-3">
                  {storeTemplates.map(tmpl => (
                    <button key={tmpl.type} onClick={() => setStoreType(tmpl.type)}
                      className={`p-4 rounded-lg border text-start transition-all ${storeType === tmpl.type ? "border-foreground bg-secondary/50" : "border-border hover:border-foreground/30"}`}>
                      <span className="text-2xl block mb-2">{tmpl.icon}</span>
                      <p className="font-body text-sm font-medium text-foreground">{tmpl.name}</p>
                      <p className="font-body text-[10px] text-muted-foreground mt-0.5">{tmpl.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div><Label className="font-body text-sm">{t("onboarding.storeName")}</Label><Input className="mt-1" value={storeName} onChange={e => setStoreName(e.target.value)} placeholder="My Amazing Store" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="font-body text-sm">{t("onboarding.primaryColor")}</Label><div className="flex gap-2 mt-1"><input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded border border-border cursor-pointer" /><Input value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="flex-1" /></div></div>
                  <div><Label className="font-body text-sm">{t("onboarding.secondaryColor")}</Label><div className="flex gap-2 mt-1"><input type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="w-10 h-10 rounded border border-border cursor-pointer" /><Input value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="flex-1" /></div></div>
                </div>
                <div>
                  <Label className="font-body text-sm mb-2 block">{t("onboarding.stylePreset")}</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {["minimal", "bold", "luxury", "playful"].map(s => (
                      <button key={s} onClick={() => setStylePreset(s)} className={`p-3 rounded-lg border text-center font-body text-xs capitalize transition-colors ${stylePreset === s ? "border-foreground bg-secondary/50 font-medium" : "border-border"}`}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div><Label className="font-body text-sm">{t("onboarding.currency")}</Label><Input className="mt-1" value={currency} onChange={e => setCurrency(e.target.value)} /></div>
                <div><Label className="font-body text-sm">{t("onboarding.taxRate")}</Label><Input className="mt-1" type="number" defaultValue="8" /></div>
                <div><Label className="font-body text-sm">{t("onboarding.shippingFlat")}</Label><Input className="mt-1" type="number" defaultValue="15" /></div>
                <div><Label className="font-body text-sm">{t("onboarding.returnPolicy")}</Label><Input className="mt-1" defaultValue="30-day return policy" /></div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <p className="font-body text-sm text-foreground font-medium">{t("onboarding.catalogOption")}</p>
                <RadioGroup value={catalogOption} onValueChange={setCatalogOption} className="space-y-3">
                  {[{ value: "manual", label: t("onboarding.addManually") }, { value: "csv", label: t("onboarding.importCSV") }, { value: "skip", label: t("onboarding.skipForNow") }].map(opt => (
                    <label key={opt.value} className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${catalogOption === opt.value ? "border-foreground bg-secondary/50" : "border-border"}`}>
                      <RadioGroupItem value={opt.value} /><span className="font-body text-sm">{opt.label}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <Button variant="outline" className="w-full font-body py-6" onClick={() => toast.info("Stripe connection would open here")}>{t("onboarding.connectStripe")}</Button>
                <div className="flex gap-3">
                  {["test", "live"].map(m => (
                    <button key={m} onClick={() => setPaymentMode(m)} className={`flex-1 p-4 rounded-lg border text-center font-body text-sm capitalize transition-colors ${paymentMode === m ? "border-foreground bg-secondary/50 font-medium" : "border-border"}`}>
                      {m === "test" ? t("onboarding.testMode") : t("onboarding.liveMode")}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <div className="flex gap-3">
                  {["subdomain", "custom"].map(d => (
                    <button key={d} onClick={() => setDomainOption(d)} className={`flex-1 p-4 rounded-lg border text-center font-body text-sm transition-colors ${domainOption === d ? "border-foreground bg-secondary/50 font-medium" : "border-border"}`}>
                      {d === "subdomain" ? t("onboarding.useSubdomain") : t("onboarding.customDomain")}
                    </button>
                  ))}
                </div>
                {domainOption === "subdomain" ? (
                  <div><Label className="font-body text-sm">{t("onboarding.subdomain")}</Label>
                    <div className="flex items-center gap-0 mt-1">
                      <Input value={subdomain || storeName.toLowerCase().replace(/\s+/g, "-")} onChange={e => setSubdomain(e.target.value)} className="rounded-e-none" />
                      <span className="px-3 py-2 bg-secondary border border-border border-s-0 rounded-e-md font-body text-sm text-muted-foreground">.maison.app</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <p className="font-body text-sm text-muted-foreground">{t("onboarding.domainPlanRequired")}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-6">
          <Button variant="ghost" className="font-body" onClick={back} disabled={step === 0}><ArrowLeft className="w-4 h-4 me-2" />{t("onboarding.back")}</Button>
          <Button className="font-body" onClick={next}>
            {step === 5 ? t("onboarding.finish") : t("onboarding.next")} <ArrowRight className="w-4 h-4 ms-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoreOnboarding;
