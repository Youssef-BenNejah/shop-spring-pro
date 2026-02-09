import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useTranslation } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Settings = () => {
  const { t } = useTranslation();
  const [testMode, setTestMode] = useState(true);
  const [taxEnabled, setTaxEnabled] = useState(true);

  const handleSave = () => toast.success(t("settings.saved"));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl text-foreground">{t("admin.settings")}</h1>
        <Tabs defaultValue="store">
          <TabsList className="font-body"><TabsTrigger value="store">{t("settings.store")}</TabsTrigger><TabsTrigger value="payment">{t("settings.payment")}</TabsTrigger><TabsTrigger value="shipping">{t("settings.shippingSettings")}</TabsTrigger><TabsTrigger value="tax">{t("settings.taxSettings")}</TabsTrigger></TabsList>

          <TabsContent value="store"><Card><CardHeader><CardTitle className="font-display text-lg">{t("settings.store")}</CardTitle></CardHeader><CardContent className="space-y-4">
            <div><Label className="font-body text-sm">{t("settings.storeName")}</Label><Input className="mt-1" defaultValue="MAISON" /></div>
            <div><Label className="font-body text-sm">{t("settings.storeEmail")}</Label><Input className="mt-1" defaultValue="hello@maison.com" type="email" /></div>
            <div><Label className="font-body text-sm">{t("settings.storePhone")}</Label><Input className="mt-1" defaultValue="+44 20 7123 4567" /></div>
            <div><Label className="font-body text-sm">{t("settings.storeDescription")}</Label><Input className="mt-1" defaultValue="Premium lifestyle store" /></div>
            <div><Label className="font-body text-sm">{t("settings.currency")}</Label><Input className="mt-1" defaultValue="USD" /></div>
            <Button onClick={handleSave} className="font-body">{t("settings.saveChanges")}</Button>
          </CardContent></Card></TabsContent>

          <TabsContent value="payment"><Card><CardHeader><CardTitle className="font-display text-lg">{t("settings.payment")}</CardTitle></CardHeader><CardContent className="space-y-4">
            <div><Label className="font-body text-sm">{t("settings.stripeKey")}</Label><Input className="mt-1" type="password" defaultValue="sk_test_•••••••••••" /></div>
            <div className="flex items-center justify-between"><Label className="font-body text-sm">{t("settings.testMode")}</Label><Switch checked={testMode} onCheckedChange={setTestMode} /></div>
            <Button onClick={handleSave} className="font-body">{t("settings.saveChanges")}</Button>
          </CardContent></Card></TabsContent>

          <TabsContent value="shipping"><Card><CardHeader><CardTitle className="font-display text-lg">{t("settings.shippingSettings")}</CardTitle></CardHeader><CardContent className="space-y-4">
            <div><Label className="font-body text-sm">{t("settings.flatRate")} ($)</Label><Input className="mt-1" type="number" defaultValue="15" /></div>
            <div><Label className="font-body text-sm">{t("settings.freeThreshold")} ($)</Label><Input className="mt-1" type="number" defaultValue="200" /></div>
            <Button onClick={handleSave} className="font-body">{t("settings.saveChanges")}</Button>
          </CardContent></Card></TabsContent>

          <TabsContent value="tax"><Card><CardHeader><CardTitle className="font-display text-lg">{t("settings.taxSettings")}</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="flex items-center justify-between"><Label className="font-body text-sm">{t("settings.taxEnabled")}</Label><Switch checked={taxEnabled} onCheckedChange={setTaxEnabled} /></div>
            <div><Label className="font-body text-sm">{t("settings.vatRate")}</Label><Input className="mt-1" type="number" defaultValue="8" /></div>
            <div><Label className="font-body text-sm">{t("settings.companyName")}</Label><Input className="mt-1" defaultValue="MAISON Ltd." /></div>
            <div><Label className="font-body text-sm">{t("settings.taxId")}</Label><Input className="mt-1" defaultValue="GB123456789" /></div>
            <div><Label className="font-body text-sm">{t("settings.invoicePrefix")}</Label><Input className="mt-1" defaultValue="INV-2026-" /></div>
            <Button onClick={handleSave} className="font-body">{t("settings.saveChanges")}</Button>
          </CardContent></Card></TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};
export default Settings;
