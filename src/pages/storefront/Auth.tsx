import { useState } from "react";
import { Link } from "react-router-dom";
import StorefrontLayout from "@/components/storefront/StorefrontLayout";
import { useTranslation } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Auth = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"login" | "signup">("login");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(mode === "login" ? "Logged in successfully!" : "Account created successfully!");
  };

  return (
    <StorefrontLayout>
      <div className="container mx-auto px-4 py-12 lg:py-20 flex justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl text-foreground mb-2">{mode === "login" ? t("auth.loginTitle") : t("auth.signupTitle")}</h1>
            <p className="font-body text-sm text-muted-foreground">{mode === "login" ? t("auth.loginSubtitle") : t("auth.signupSubtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded-lg p-6 lg:p-8">
            {mode === "signup" && (
              <div><Label className="font-body text-sm">{t("auth.name")}</Label><Input required className="mt-1" placeholder="John Doe" /></div>
            )}
            <div><Label className="font-body text-sm">{t("auth.email")}</Label><Input type="email" required className="mt-1" placeholder="you@example.com" /></div>
            <div><Label className="font-body text-sm">{t("auth.password")}</Label><Input type="password" required className="mt-1" placeholder="••••••••" /></div>
            {mode === "signup" && (
              <div><Label className="font-body text-sm">{t("auth.confirmPassword")}</Label><Input type="password" required className="mt-1" placeholder="••••••••" /></div>
            )}
            {mode === "login" && (
              <div className="text-end"><button type="button" className="font-body text-xs text-accent hover:underline">{t("auth.forgotPassword")}</button></div>
            )}
            <Button type="submit" className="w-full font-body" size="lg">{mode === "login" ? t("auth.login") : t("auth.signup")}</Button>
          </form>

          <p className="text-center mt-6 font-body text-sm text-muted-foreground">
            {mode === "login" ? t("auth.noAccount") : t("auth.hasAccount")}{" "}
            <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-accent font-medium hover:underline">
              {mode === "login" ? t("auth.signup") : t("auth.login")}
            </button>
          </p>
        </div>
      </div>
    </StorefrontLayout>
  );
};

export default Auth;
