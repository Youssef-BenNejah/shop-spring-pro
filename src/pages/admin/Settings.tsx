import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useTranslation } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const { t } = useTranslation();
  const [testMode, setTestMode] = useState(true);
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [autoInvoice, setAutoInvoice] = useState(true);
  const [emailOnOrder, setEmailOnOrder] = useState(true);
  const [emailOnShip, setEmailOnShip] = useState(true);
  const [emailOnDelivery, setEmailOnDelivery] = useState(true);
  const [emailOnRefund, setEmailOnRefund] = useState(true);
  const [emailOnAbandonedCart, setEmailOnAbandonedCart] = useState(false);
  const [returnWindow, setReturnWindow] = useState("30");
  const [restockFee, setRestockFee] = useState("0");

  const [shippingZones, setShippingZones] = useState([
    { id: "sz1", name: "Domestic", countries: "United States", flatRate: 15, freeThreshold: 200, weightRate: 0.5, estimatedDays: "5-7" },
    { id: "sz2", name: "Europe", countries: "EU Countries", flatRate: 25, freeThreshold: 300, weightRate: 0.8, estimatedDays: "7-14" },
    { id: "sz3", name: "International", countries: "Rest of World", flatRate: 40, freeThreshold: 500, weightRate: 1.2, estimatedDays: "14-21" },
  ]);

  const [taxRules, setTaxRules] = useState([
    { id: "tr1", name: "Default VAT", region: "All Regions", rate: 8, included: false, active: true },
    { id: "tr2", name: "EU VAT", region: "Europe", rate: 20, included: true, active: true },
    { id: "tr3", name: "Digital Goods", region: "Digital Products", rate: 10, included: false, active: false },
  ]);

  const [addZoneOpen, setAddZoneOpen] = useState(false);
  const [addTaxOpen, setAddTaxOpen] = useState(false);

  const handleSave = () => toast.success(t("settings.saved"));

  const handleAddZone = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setShippingZones(prev => [...prev, {
      id: `sz${Date.now()}`, name: fd.get("name") as string, countries: fd.get("countries") as string,
      flatRate: Number(fd.get("flatRate")), freeThreshold: Number(fd.get("freeThreshold")),
      weightRate: Number(fd.get("weightRate")), estimatedDays: fd.get("estimatedDays") as string,
    }]);
    setAddZoneOpen(false);
    toast.success("Shipping zone added");
  };

  const handleAddTax = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setTaxRules(prev => [...prev, {
      id: `tr${Date.now()}`, name: fd.get("name") as string, region: fd.get("region") as string,
      rate: Number(fd.get("rate")), included: fd.get("included") === "true", active: true,
    }]);
    setAddTaxOpen(false);
    toast.success("Tax rule added");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl text-foreground">{t("admin.settings")}</h1>
        <Tabs defaultValue="store">
          <TabsList className="font-body flex-wrap h-auto gap-1">
            <TabsTrigger value="store">{t("settings.store")}</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="payment">{t("settings.payment")}</TabsTrigger>
            <TabsTrigger value="shipping">{t("settings.shippingSettings")}</TabsTrigger>
            <TabsTrigger value="tax">{t("settings.taxSettings")}</TabsTrigger>
            <TabsTrigger value="invoice">Invoice</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="returns">Returns</TabsTrigger>
            <TabsTrigger value="legal">Legal</TabsTrigger>
          </TabsList>

          {/* Store */}
          <TabsContent value="store"><Card><CardHeader><CardTitle className="font-display text-lg">{t("settings.store")}</CardTitle><CardDescription className="font-body text-sm">General store information and configuration</CardDescription></CardHeader><CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label className="font-body text-sm">{t("settings.storeName")}</Label><Input className="mt-1" defaultValue="MAISON" /></div>
              <div><Label className="font-body text-sm">{t("settings.storeEmail")}</Label><Input className="mt-1" defaultValue="hello@maison.com" type="email" /></div>
              <div><Label className="font-body text-sm">{t("settings.storePhone")}</Label><Input className="mt-1" defaultValue="+44 20 7123 4567" /></div>
              <div><Label className="font-body text-sm">{t("settings.currency")}</Label>
                <Select defaultValue="USD"><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem><SelectItem value="EUR">EUR (€)</SelectItem><SelectItem value="GBP">GBP (£)</SelectItem><SelectItem value="SAR">SAR (﷼)</SelectItem><SelectItem value="AED">AED (د.إ)</SelectItem><SelectItem value="MAD">MAD (د.م.)</SelectItem>
                </SelectContent></Select></div>
              <div className="sm:col-span-2"><Label className="font-body text-sm">{t("settings.storeDescription")}</Label><Textarea className="mt-1" defaultValue="Premium lifestyle store with curated collections" /></div>
              <div><Label className="font-body text-sm">Timezone</Label>
                <Select defaultValue="UTC"><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem><SelectItem value="EST">Eastern (EST)</SelectItem><SelectItem value="PST">Pacific (PST)</SelectItem><SelectItem value="CET">Central European (CET)</SelectItem><SelectItem value="GST">Gulf (GST)</SelectItem>
                </SelectContent></Select></div>
              <div><Label className="font-body text-sm">Weight Unit</Label>
                <Select defaultValue="kg"><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem><SelectItem value="lb">Pounds (lb)</SelectItem>
                </SelectContent></Select></div>
            </div>
            <Button onClick={handleSave} className="font-body">{t("settings.saveChanges")}</Button>
          </CardContent></Card></TabsContent>

          {/* Branding */}
          <TabsContent value="branding"><Card><CardHeader><CardTitle className="font-display text-lg">Branding</CardTitle><CardDescription className="font-body text-sm">Customize your store's visual identity</CardDescription></CardHeader><CardContent className="space-y-6">
            <div>
              <Label className="font-body text-sm">Store Logo</Label>
              <div className="mt-2 flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-secondary/30"><Upload className="w-6 h-6 text-muted-foreground" /></div>
                <div><Button variant="outline" size="sm" className="font-body">Upload Logo</Button><p className="font-body text-xs text-muted-foreground mt-1">SVG, PNG or JPG (max 2MB)</p></div>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label className="font-body text-sm">Primary Color</Label><div className="flex gap-2 mt-1"><Input type="color" defaultValue="#1a1a2e" className="w-12 h-10 p-1" /><Input defaultValue="#1a1a2e" className="flex-1" /></div></div>
              <div><Label className="font-body text-sm">Accent Color</Label><div className="flex gap-2 mt-1"><Input type="color" defaultValue="#d4a574" className="w-12 h-10 p-1" /><Input defaultValue="#d4a574" className="flex-1" /></div></div>
              <div><Label className="font-body text-sm">Style Preset</Label>
                <Select defaultValue="luxury"><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="minimal">Minimal</SelectItem><SelectItem value="bold">Bold</SelectItem><SelectItem value="luxury">Luxury</SelectItem><SelectItem value="playful">Playful</SelectItem>
                </SelectContent></Select></div>
              <div><Label className="font-body text-sm">Font Family</Label>
                <Select defaultValue="playfair"><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="playfair">Playfair Display + DM Sans</SelectItem><SelectItem value="inter">Inter</SelectItem><SelectItem value="poppins">Poppins</SelectItem><SelectItem value="montserrat">Montserrat</SelectItem>
                </SelectContent></Select></div>
            </div>
            <Separator />
            <div><Label className="font-body text-sm">Favicon</Label>
              <div className="mt-2 flex items-center gap-4">
                <div className="w-10 h-10 rounded border border-border flex items-center justify-center bg-secondary/30 text-xs">32×32</div>
                <Button variant="outline" size="sm" className="font-body">Upload Favicon</Button>
              </div>
            </div>
            <Button onClick={handleSave} className="font-body">{t("settings.saveChanges")}</Button>
          </CardContent></Card></TabsContent>

          {/* Payment */}
          <TabsContent value="payment"><Card><CardHeader><CardTitle className="font-display text-lg">{t("settings.payment")}</CardTitle><CardDescription className="font-body text-sm">Configure payment gateways and methods</CardDescription></CardHeader><CardContent className="space-y-4">
            <div><Label className="font-body text-sm">{t("settings.stripeKey")}</Label><Input className="mt-1" type="password" defaultValue="sk_test_•••••••••••" /></div>
            <div><Label className="font-body text-sm">Stripe Publishable Key</Label><Input className="mt-1" defaultValue="pk_test_•••••••••••" /></div>
            <div><Label className="font-body text-sm">Webhook Secret</Label><Input className="mt-1" type="password" defaultValue="whsec_•••••••••••" /></div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"><div><Label className="font-body text-sm">{t("settings.testMode")}</Label><p className="font-body text-xs text-muted-foreground mt-0.5">Use Stripe test environment</p></div><Switch checked={testMode} onCheckedChange={setTestMode} /></div>
            <Separator />
            <h3 className="font-body text-sm font-semibold">Accepted Payment Methods</h3>
            <div className="grid grid-cols-2 gap-3">
              {[{ name: "Credit Cards", on: true }, { name: "Apple Pay", on: true }, { name: "Google Pay", on: true }, { name: "PayPal", on: false }, { name: "Bank Transfer", on: false }, { name: "Cash on Delivery", on: false }].map(m => (
                <div key={m.name} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <span className="font-body text-sm">{m.name}</span><Switch defaultChecked={m.on} />
                </div>
              ))}
            </div>
            <Button onClick={handleSave} className="font-body">{t("settings.saveChanges")}</Button>
          </CardContent></Card></TabsContent>

          {/* Shipping */}
          <TabsContent value="shipping"><Card><CardHeader className="flex flex-row items-center justify-between"><div><CardTitle className="font-display text-lg">{t("settings.shippingSettings")}</CardTitle><CardDescription className="font-body text-sm">Configure shipping zones, rates, and delivery options</CardDescription></div>
            <Dialog open={addZoneOpen} onOpenChange={setAddZoneOpen}><DialogTrigger asChild><Button size="sm" className="font-body"><Plus className="w-4 h-4 me-1" />Add Zone</Button></DialogTrigger>
              <DialogContent><DialogHeader><DialogTitle className="font-display">Add Shipping Zone</DialogTitle></DialogHeader>
                <form onSubmit={handleAddZone} className="space-y-4">
                  <div><Label className="font-body text-sm">Zone Name</Label><Input name="name" required className="mt-1" placeholder="e.g. Asia Pacific" /></div>
                  <div><Label className="font-body text-sm">Countries / Regions</Label><Input name="countries" required className="mt-1" placeholder="e.g. Japan, Korea, Singapore" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label className="font-body text-sm">{t("settings.flatRate")} ($)</Label><Input name="flatRate" type="number" required className="mt-1" defaultValue="20" /></div>
                    <div><Label className="font-body text-sm">{t("settings.freeThreshold")} ($)</Label><Input name="freeThreshold" type="number" required className="mt-1" defaultValue="300" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label className="font-body text-sm">Weight Rate ($/kg)</Label><Input name="weightRate" type="number" step="0.1" className="mt-1" defaultValue="0.5" /></div>
                    <div><Label className="font-body text-sm">Estimated Days</Label><Input name="estimatedDays" className="mt-1" defaultValue="7-14" /></div>
                  </div>
                  <Button type="submit" className="w-full font-body">Add Shipping Zone</Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader><CardContent>
            <Table><TableHeader><TableRow>
              <TableHead className="font-body text-xs">Zone</TableHead>
              <TableHead className="font-body text-xs">Countries</TableHead>
              <TableHead className="font-body text-xs text-right">Flat Rate</TableHead>
              <TableHead className="font-body text-xs text-right">Free Above</TableHead>
              <TableHead className="font-body text-xs text-right">Weight Rate</TableHead>
              <TableHead className="font-body text-xs">Est. Days</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow></TableHeader><TableBody>
              {shippingZones.map(z => (
                <TableRow key={z.id}>
                  <TableCell className="font-body text-sm font-medium text-foreground">{z.name}</TableCell>
                  <TableCell className="font-body text-sm text-muted-foreground">{z.countries}</TableCell>
                  <TableCell className="font-body text-sm text-foreground text-right">${z.flatRate}</TableCell>
                  <TableCell className="font-body text-sm text-foreground text-right">${z.freeThreshold}</TableCell>
                  <TableCell className="font-body text-sm text-muted-foreground text-right">${z.weightRate}/kg</TableCell>
                  <TableCell className="font-body text-sm text-muted-foreground">{z.estimatedDays}</TableCell>
                  <TableCell><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setShippingZones(prev => prev.filter(s => s.id !== z.id)); toast.success("Zone removed"); }}><Trash2 className="w-4 h-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody></Table>
            <div className="mt-4"><Button onClick={handleSave} className="font-body">{t("settings.saveChanges")}</Button></div>
          </CardContent></Card></TabsContent>

          {/* Tax */}
          <TabsContent value="tax"><Card><CardHeader className="flex flex-row items-center justify-between"><div><CardTitle className="font-display text-lg">{t("settings.taxSettings")}</CardTitle><CardDescription className="font-body text-sm">Configure tax rates and rules by region</CardDescription></div>
            <Dialog open={addTaxOpen} onOpenChange={setAddTaxOpen}><DialogTrigger asChild><Button size="sm" className="font-body"><Plus className="w-4 h-4 me-1" />Add Tax Rule</Button></DialogTrigger>
              <DialogContent><DialogHeader><DialogTitle className="font-display">Add Tax Rule</DialogTitle></DialogHeader>
                <form onSubmit={handleAddTax} className="space-y-4">
                  <div><Label className="font-body text-sm">Rule Name</Label><Input name="name" required className="mt-1" placeholder="e.g. State Tax" /></div>
                  <div><Label className="font-body text-sm">Region</Label><Input name="region" required className="mt-1" placeholder="e.g. California" /></div>
                  <div><Label className="font-body text-sm">{t("settings.vatRate")}</Label><Input name="rate" type="number" step="0.01" required className="mt-1" /></div>
                  <div><Label className="font-body text-sm">Tax Included in Price</Label>
                    <Select name="included" defaultValue="false"><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>
                      <SelectItem value="false">Not included (added at checkout)</SelectItem><SelectItem value="true">Included in displayed price</SelectItem>
                    </SelectContent></Select></div>
                  <Button type="submit" className="w-full font-body">Add Tax Rule</Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader><CardContent>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 mb-4"><div><Label className="font-body text-sm">{t("settings.taxEnabled")}</Label><p className="font-body text-xs text-muted-foreground mt-0.5">Enable tax calculation on orders</p></div><Switch checked={taxEnabled} onCheckedChange={setTaxEnabled} /></div>
            <Table><TableHeader><TableRow>
              <TableHead className="font-body text-xs">Name</TableHead>
              <TableHead className="font-body text-xs">Region</TableHead>
              <TableHead className="font-body text-xs text-right">Rate</TableHead>
              <TableHead className="font-body text-xs">Included</TableHead>
              <TableHead className="font-body text-xs">{t("customers.status")}</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow></TableHeader><TableBody>
              {taxRules.map(tr => (
                <TableRow key={tr.id}>
                  <TableCell className="font-body text-sm font-medium text-foreground">{tr.name}</TableCell>
                  <TableCell className="font-body text-sm text-muted-foreground">{tr.region}</TableCell>
                  <TableCell className="font-body text-sm text-foreground text-right">{tr.rate}%</TableCell>
                  <TableCell><Badge variant="outline" className="font-body text-xs">{tr.included ? "Yes" : "No"}</Badge></TableCell>
                  <TableCell><Switch defaultChecked={tr.active} onCheckedChange={checked => setTaxRules(prev => prev.map(r => r.id === tr.id ? {...r, active: checked} : r))} /></TableCell>
                  <TableCell><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setTaxRules(prev => prev.filter(r => r.id !== tr.id)); toast.success("Tax rule removed"); }}><Trash2 className="w-4 h-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody></Table>
            <div className="mt-4"><Button onClick={handleSave} className="font-body">{t("settings.saveChanges")}</Button></div>
          </CardContent></Card></TabsContent>

          {/* Invoice */}
          <TabsContent value="invoice"><Card><CardHeader><CardTitle className="font-display text-lg">Invoice Settings</CardTitle><CardDescription className="font-body text-sm">Configure automatic invoice generation and numbering</CardDescription></CardHeader><CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"><div><Label className="font-body text-sm">Auto-generate Invoice</Label><p className="font-body text-xs text-muted-foreground mt-0.5">Create invoice automatically when order is paid</p></div><Switch checked={autoInvoice} onCheckedChange={setAutoInvoice} /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label className="font-body text-sm">{t("settings.invoicePrefix")}</Label><Input className="mt-1" defaultValue="INV-2026-" /></div>
              <div><Label className="font-body text-sm">Next Invoice Number</Label><Input className="mt-1" type="number" defaultValue="1289" /></div>
              <div><Label className="font-body text-sm">{t("settings.companyName")}</Label><Input className="mt-1" defaultValue="MAISON Ltd." /></div>
              <div><Label className="font-body text-sm">{t("settings.taxId")}</Label><Input className="mt-1" defaultValue="GB123456789" /></div>
              <div className="sm:col-span-2"><Label className="font-body text-sm">Company Address</Label><Textarea className="mt-1" defaultValue="42 Design Street, London SW1 1AA, United Kingdom" /></div>
              <div><Label className="font-body text-sm">Payment Terms</Label>
                <Select defaultValue="due_on_receipt"><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="due_on_receipt">Due on Receipt</SelectItem><SelectItem value="net_15">Net 15</SelectItem><SelectItem value="net_30">Net 30</SelectItem><SelectItem value="net_60">Net 60</SelectItem>
                </SelectContent></Select></div>
              <div><Label className="font-body text-sm">Invoice Currency Display</Label>
                <Select defaultValue="symbol"><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="symbol">Symbol (100.00 TND)</SelectItem><SelectItem value="code">Code (TND 100.00)</SelectItem><SelectItem value="both">Both (100.00 TND)</SelectItem>
                </SelectContent></Select></div>
            </div>
            <Separator />
            <div><Label className="font-body text-sm">Invoice Footer Note</Label><Textarea className="mt-1" defaultValue="Thank you for your purchase. For any questions, contact hello@maison.com" /></div>
            <Button onClick={handleSave} className="font-body">{t("settings.saveChanges")}</Button>
          </CardContent></Card></TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications"><Card><CardHeader><CardTitle className="font-display text-lg">Email Notifications</CardTitle><CardDescription className="font-body text-sm">Configure automated email triggers</CardDescription></CardHeader><CardContent className="space-y-3">
            {[
              { label: "Order Confirmation", desc: "Send when order is placed", checked: emailOnOrder, set: setEmailOnOrder },
              { label: "Shipping Notification", desc: "Send when order ships", checked: emailOnShip, set: setEmailOnShip },
              { label: "Delivery Confirmation", desc: "Send when order is delivered", checked: emailOnDelivery, set: setEmailOnDelivery },
              { label: "Refund Notification", desc: "Send when refund is processed", checked: emailOnRefund, set: setEmailOnRefund },
              { label: "Abandoned Cart", desc: "Send reminder after 24h", checked: emailOnAbandonedCart, set: setEmailOnAbandonedCart },
            ].map(n => (
              <div key={n.label} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div><p className="font-body text-sm font-medium text-foreground">{n.label}</p><p className="font-body text-xs text-muted-foreground">{n.desc}</p></div>
                <Switch checked={n.checked} onCheckedChange={n.set} />
              </div>
            ))}
            <Separator />
            <div><Label className="font-body text-sm">Sender Name</Label><Input className="mt-1" defaultValue="MAISON Store" /></div>
            <div><Label className="font-body text-sm">Reply-to Email</Label><Input className="mt-1" type="email" defaultValue="support@maison.com" /></div>
            <Button onClick={handleSave} className="font-body">{t("settings.saveChanges")}</Button>
          </CardContent></Card></TabsContent>

          {/* Returns */}
          <TabsContent value="returns"><Card><CardHeader><CardTitle className="font-display text-lg">Return & Refund Policy</CardTitle><CardDescription className="font-body text-sm">Configure return windows and refund rules</CardDescription></CardHeader><CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label className="font-body text-sm">Return Window (days)</Label>
                <Select value={returnWindow} onValueChange={setReturnWindow}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="14">14 days</SelectItem><SelectItem value="30">30 days</SelectItem><SelectItem value="60">60 days</SelectItem><SelectItem value="90">90 days</SelectItem>
                </SelectContent></Select></div>
              <div><Label className="font-body text-sm">Restocking Fee (%)</Label>
                <Select value={restockFee} onValueChange={setRestockFee}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="0">No fee</SelectItem><SelectItem value="10">10%</SelectItem><SelectItem value="15">15%</SelectItem><SelectItem value="20">20%</SelectItem>
                </SelectContent></Select></div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"><div><Label className="font-body text-sm">Free Return Shipping</Label><p className="font-body text-xs text-muted-foreground mt-0.5">Provide prepaid return labels</p></div><Switch defaultChecked /></div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"><div><Label className="font-body text-sm">Exchange Allowed</Label><p className="font-body text-xs text-muted-foreground mt-0.5">Allow size/color exchange instead of refund</p></div><Switch defaultChecked /></div>
            <div><Label className="font-body text-sm">Return Policy Text</Label><Textarea className="mt-1 min-h-[100px]" defaultValue="Items must be unworn, unwashed, and in original packaging with tags attached. Returns are processed within 5-7 business days after we receive the item." /></div>
            <div><Label className="font-body text-sm">Non-Returnable Categories</Label><Input className="mt-1" defaultValue="Beauty, Intimate Apparel, Sale Items" placeholder="Comma-separated categories" /></div>
            <Button onClick={handleSave} className="font-body">{t("settings.saveChanges")}</Button>
          </CardContent></Card></TabsContent>

          {/* Legal */}
          <TabsContent value="legal"><Card><CardHeader><CardTitle className="font-display text-lg">Legal & Compliance</CardTitle><CardDescription className="font-body text-sm">Manage legal pages and compliance settings</CardDescription></CardHeader><CardContent className="space-y-4">
            <div><Label className="font-body text-sm">Terms of Service URL</Label><Input className="mt-1" defaultValue="/terms" /></div>
            <div><Label className="font-body text-sm">Privacy Policy URL</Label><Input className="mt-1" defaultValue="/privacy" /></div>
            <div><Label className="font-body text-sm">Cookie Policy URL</Label><Input className="mt-1" defaultValue="/cookies" /></div>
            <Separator />
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"><div><Label className="font-body text-sm">Cookie Consent Banner</Label><p className="font-body text-xs text-muted-foreground mt-0.5">Show GDPR cookie consent popup</p></div><Switch defaultChecked /></div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"><div><Label className="font-body text-sm">Age Verification</Label><p className="font-body text-xs text-muted-foreground mt-0.5">Require age verification at checkout</p></div><Switch /></div>
            <div><Label className="font-body text-sm">GDPR Data Retention (days)</Label><Input className="mt-1" type="number" defaultValue="365" /></div>
            <Button onClick={handleSave} className="font-body">{t("settings.saveChanges")}</Button>
          </CardContent></Card></TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};
export default Settings;
