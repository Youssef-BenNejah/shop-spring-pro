import { useState } from "react";
import SuperAdminLayout from "@/components/platform/SuperAdminLayout";
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
import { Upload } from "lucide-react";
import { toast } from "sonner";

const PlatformSettings = () => {
  const { t } = useTranslation();
  const handleSave = () => toast.success(t("settings.saved"));

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div><h1 className="font-display text-2xl text-foreground">Platform Settings</h1><p className="font-body text-sm text-muted-foreground mt-1">Global configuration for the entire platform</p></div>

        <Tabs defaultValue="general">
          <TabsList className="font-body flex-wrap h-auto gap-1">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="defaults">Default Configs</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="domains">Domains</TabsTrigger>
          </TabsList>

          {/* General */}
          <TabsContent value="general"><Card><CardHeader><CardTitle className="font-display text-lg">General Settings</CardTitle><CardDescription className="font-body text-sm">Core platform configuration</CardDescription></CardHeader><CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label className="font-body text-sm">Platform Name</Label><Input className="mt-1" defaultValue="MAISON" /></div>
              <div><Label className="font-body text-sm">Platform URL</Label><Input className="mt-1" defaultValue="https://maison.com" /></div>
              <div><Label className="font-body text-sm">Support Email</Label><Input className="mt-1" type="email" defaultValue="support@maison.com" /></div>
              <div><Label className="font-body text-sm">Support Phone</Label><Input className="mt-1" defaultValue="+44 20 7123 4567" /></div>
              <div className="sm:col-span-2"><Label className="font-body text-sm">Platform Description</Label><Textarea className="mt-1" defaultValue="The all-in-one ecommerce platform that grows with your business." /></div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label className="font-body text-sm">Default Language</Label>
                <Select defaultValue="en"><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="en">English</SelectItem><SelectItem value="fr">Français</SelectItem><SelectItem value="ar">العربية</SelectItem>
                </SelectContent></Select></div>
              <div><Label className="font-body text-sm">Default Currency</Label>
                <Select defaultValue="USD"><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem><SelectItem value="EUR">EUR (€)</SelectItem><SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent></Select></div>
              <div><Label className="font-body text-sm">Default Timezone</Label>
                <Select defaultValue="UTC"><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem><SelectItem value="EST">Eastern</SelectItem><SelectItem value="CET">Central European</SelectItem>
                </SelectContent></Select></div>
              <div><Label className="font-body text-sm">Date Format</Label>
                <Select defaultValue="mdy"><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="mdy">MM/DD/YYYY</SelectItem><SelectItem value="dmy">DD/MM/YYYY</SelectItem><SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                </SelectContent></Select></div>
            </div>
            <Button onClick={handleSave} className="font-body">{t("settings.saveChanges")}</Button>
          </CardContent></Card></TabsContent>

          {/* Branding */}
          <TabsContent value="branding"><Card><CardHeader><CardTitle className="font-display text-lg">Platform Branding</CardTitle><CardDescription className="font-body text-sm">Visual identity for the SaaS landing pages</CardDescription></CardHeader><CardContent className="space-y-6">
            <div>
              <Label className="font-body text-sm">Platform Logo</Label>
              <div className="mt-2 flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-secondary/30"><Upload className="w-6 h-6 text-muted-foreground" /></div>
                <div><Button variant="outline" size="sm" className="font-body">Upload Logo</Button><p className="font-body text-xs text-muted-foreground mt-1">Used on landing pages & admin</p></div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label className="font-body text-sm">Primary Color</Label><div className="flex gap-2 mt-1"><Input type="color" defaultValue="#1a1a2e" className="w-12 h-10 p-1" /><Input defaultValue="#1a1a2e" /></div></div>
              <div><Label className="font-body text-sm">Accent Color</Label><div className="flex gap-2 mt-1"><Input type="color" defaultValue="#d4a574" className="w-12 h-10 p-1" /><Input defaultValue="#d4a574" /></div></div>
            </div>
            <div><Label className="font-body text-sm">Social Media Links</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {["Twitter / X", "LinkedIn", "Instagram", "YouTube"].map(s => (
                  <div key={s}><Label className="font-body text-xs text-muted-foreground">{s}</Label><Input className="mt-1" placeholder={`https://${s.toLowerCase().replace(/ .*/,"")}.com/maison`} /></div>
                ))}
              </div>
            </div>
            <Button onClick={handleSave} className="font-body">{t("settings.saveChanges")}</Button>
          </CardContent></Card></TabsContent>

          {/* Payments */}
          <TabsContent value="payments"><Card><CardHeader><CardTitle className="font-display text-lg">Payment Provider Settings</CardTitle><CardDescription className="font-body text-sm">Platform-level Stripe configuration for subscription billing</CardDescription></CardHeader><CardContent className="space-y-4">
            <div><Label className="font-body text-sm">Platform Stripe Secret Key</Label><Input className="mt-1" type="password" defaultValue="sk_live_•••••••••••" /></div>
            <div><Label className="font-body text-sm">Platform Stripe Publishable Key</Label><Input className="mt-1" defaultValue="pk_live_•••••••••••" /></div>
            <div><Label className="font-body text-sm">Webhook Endpoint Secret</Label><Input className="mt-1" type="password" defaultValue="whsec_•••••••••••" /></div>
            <Separator />
            <h3 className="font-body text-sm font-semibold">Platform Commission</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label className="font-body text-sm">Transaction Fee (%)</Label><Input className="mt-1" type="number" step="0.1" defaultValue="2.5" /></div>
              <div><Label className="font-body text-sm">Fixed Fee per Transaction ($)</Label><Input className="mt-1" type="number" step="0.01" defaultValue="0.30" /></div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"><div><Label className="font-body text-sm">Stripe Connect</Label><p className="font-body text-xs text-muted-foreground mt-0.5">Enable Stripe Connect for store payouts</p></div><Switch defaultChecked /></div>
            <Separator />
            <h3 className="font-body text-sm font-semibold">Trial Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label className="font-body text-sm">Default Trial Days</Label><Input className="mt-1" type="number" defaultValue="14" /></div>
              <div><Label className="font-body text-sm">Require Card for Trial</Label>
                <Select defaultValue="no"><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="no">No — Free trial without card</SelectItem><SelectItem value="yes">Yes — Card required</SelectItem>
                </SelectContent></Select></div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"><div><Label className="font-body text-sm">Grace Period After Failed Payment</Label><p className="font-body text-xs text-muted-foreground mt-0.5">Days before store suspension</p></div><Input className="w-20" type="number" defaultValue="7" /></div>
            <Button onClick={handleSave} className="font-body">{t("settings.saveChanges")}</Button>
          </CardContent></Card></TabsContent>

          {/* Email */}
          <TabsContent value="email"><Card><CardHeader><CardTitle className="font-display text-lg">Email Configuration</CardTitle><CardDescription className="font-body text-sm">Platform-wide email settings and templates</CardDescription></CardHeader><CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label className="font-body text-sm">Email Provider</Label>
                <Select defaultValue="smtp"><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="smtp">SMTP</SelectItem><SelectItem value="sendgrid">SendGrid</SelectItem><SelectItem value="ses">AWS SES</SelectItem><SelectItem value="resend">Resend</SelectItem>
                </SelectContent></Select></div>
              <div><Label className="font-body text-sm">From Name</Label><Input className="mt-1" defaultValue="MAISON Platform" /></div>
              <div><Label className="font-body text-sm">From Email</Label><Input className="mt-1" type="email" defaultValue="no-reply@maison.com" /></div>
              <div><Label className="font-body text-sm">Reply-to Email</Label><Input className="mt-1" type="email" defaultValue="support@maison.com" /></div>
            </div>
            <Separator />
            <h3 className="font-body text-sm font-semibold">Platform Email Templates</h3>
            <div className="space-y-2">
              {[
                { name: "Welcome Email", desc: "Sent when store owner signs up", active: true },
                { name: "Trial Ending", desc: "Sent 3 days before trial expires", active: true },
                { name: "Payment Failed", desc: "Sent when subscription payment fails", active: true },
                { name: "Subscription Renewed", desc: "Sent on successful renewal", active: true },
                { name: "Store Suspended", desc: "Sent when store is suspended", active: true },
                { name: "Monthly Report", desc: "Monthly performance summary for store owners", active: false },
              ].map(tpl => (
                <div key={tpl.name} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div><p className="font-body text-sm font-medium text-foreground">{tpl.name}</p><p className="font-body text-xs text-muted-foreground">{tpl.desc}</p></div>
                  <div className="flex items-center gap-2"><Switch defaultChecked={tpl.active} /><Button variant="outline" size="sm" className="font-body text-xs">{t("common.edit")}</Button></div>
                </div>
              ))}
            </div>
            <Button onClick={handleSave} className="font-body">{t("settings.saveChanges")}</Button>
          </CardContent></Card></TabsContent>

          {/* Default Configs */}
          <TabsContent value="defaults"><Card><CardHeader><CardTitle className="font-display text-lg">Default Store Configuration</CardTitle><CardDescription className="font-body text-sm">Default settings applied to new stores at creation</CardDescription></CardHeader><CardContent className="space-y-4">
            <h3 className="font-body text-sm font-semibold">Default Tax Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label className="font-body text-sm">Default Tax Rate (%)</Label><Input className="mt-1" type="number" step="0.01" defaultValue="8" /></div>
              <div><Label className="font-body text-sm">Tax Included in Price</Label>
                <Select defaultValue="no"><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="no">Not included</SelectItem><SelectItem value="yes">Included</SelectItem>
                </SelectContent></Select></div>
            </div>
            <Separator />
            <h3 className="font-body text-sm font-semibold">Default Shipping Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label className="font-body text-sm">{t("settings.flatRate")} ($)</Label><Input className="mt-1" type="number" defaultValue="15" /></div>
              <div><Label className="font-body text-sm">{t("settings.freeThreshold")} ($)</Label><Input className="mt-1" type="number" defaultValue="200" /></div>
            </div>
            <Separator />
            <h3 className="font-body text-sm font-semibold">Default Invoice Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label className="font-body text-sm">{t("settings.invoicePrefix")}</Label><Input className="mt-1" defaultValue="INV-{YEAR}-" /></div>
              <div><Label className="font-body text-sm">Payment Terms</Label>
                <Select defaultValue="due_on_receipt"><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="due_on_receipt">Due on Receipt</SelectItem><SelectItem value="net_15">Net 15</SelectItem><SelectItem value="net_30">Net 30</SelectItem>
                </SelectContent></Select></div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"><div><Label className="font-body text-sm">Auto-generate Invoices</Label><p className="font-body text-xs text-muted-foreground mt-0.5">Default for new stores</p></div><Switch defaultChecked /></div>
            <Separator />
            <h3 className="font-body text-sm font-semibold">Default Return Policy</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label className="font-body text-sm">Return Window</Label>
                <Select defaultValue="30"><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="14">14 days</SelectItem><SelectItem value="30">30 days</SelectItem><SelectItem value="60">60 days</SelectItem>
                </SelectContent></Select></div>
              <div><Label className="font-body text-sm">Restocking Fee (%)</Label><Input className="mt-1" type="number" defaultValue="0" /></div>
            </div>
            <Button onClick={handleSave} className="font-body">{t("settings.saveChanges")}</Button>
          </CardContent></Card></TabsContent>

          {/* Security */}
          <TabsContent value="security"><Card><CardHeader><CardTitle className="font-display text-lg">Security & Access</CardTitle><CardDescription className="font-body text-sm">Platform security policies and access controls</CardDescription></CardHeader><CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { name: "Two-Factor Authentication", desc: "Require 2FA for super admin accounts", on: true },
                { name: "Login Rate Limiting", desc: "Max 5 failed attempts per 15 minutes", on: true },
                { name: "Session Timeout", desc: "Auto-logout after inactivity", on: true },
                { name: "IP Whitelist for Super Admin", desc: "Restrict super admin access by IP", on: false },
                { name: "Force Password Reset", desc: "Require password change every 90 days", on: false },
                { name: "Audit All API Calls", desc: "Log every API request for compliance", on: false },
              ].map(p => (
                <div key={p.name} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div><p className="font-body text-sm font-medium text-foreground">{p.name}</p><p className="font-body text-xs text-muted-foreground">{p.desc}</p></div>
                  <Switch defaultChecked={p.on} />
                </div>
              ))}
            </div>
            <Separator />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label className="font-body text-sm">Session Timeout (minutes)</Label><Input className="mt-1" type="number" defaultValue="30" /></div>
              <div><Label className="font-body text-sm">Max Concurrent Sessions</Label><Input className="mt-1" type="number" defaultValue="3" /></div>
              <div><Label className="font-body text-sm">Password Min Length</Label><Input className="mt-1" type="number" defaultValue="8" /></div>
              <div><Label className="font-body text-sm">Allowed IP Ranges</Label><Input className="mt-1" placeholder="e.g. 192.168.1.0/24" /></div>
            </div>
            <Button onClick={handleSave} className="font-body">{t("settings.saveChanges")}</Button>
          </CardContent></Card></TabsContent>

          {/* Domains */}
          <TabsContent value="domains"><Card><CardHeader><CardTitle className="font-display text-lg">Domain Configuration</CardTitle><CardDescription className="font-body text-sm">Platform domain and store subdomain settings</CardDescription></CardHeader><CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label className="font-body text-sm">Platform Domain</Label><Input className="mt-1" defaultValue="maison.com" /></div>
              <div><Label className="font-body text-sm">Store Subdomain Pattern</Label><Input className="mt-1" defaultValue="{store}.maison.com" /></div>
              <div><Label className="font-body text-sm">Admin Subdomain</Label><Input className="mt-1" defaultValue="admin.maison.com" /></div>
              <div><Label className="font-body text-sm">API Subdomain</Label><Input className="mt-1" defaultValue="api.maison.com" /></div>
            </div>
            <Separator />
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"><div><Label className="font-body text-sm">Custom Domain Support</Label><p className="font-body text-xs text-muted-foreground mt-0.5">Allow stores on Pro+ plans to use custom domains</p></div><Switch defaultChecked /></div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"><div><Label className="font-body text-sm">Auto SSL Certificates</Label><p className="font-body text-xs text-muted-foreground mt-0.5">Issue SSL via Let's Encrypt for custom domains</p></div><Switch defaultChecked /></div>
            <div><Label className="font-body text-sm">DNS Instructions Template</Label><Textarea className="mt-1 min-h-[80px]" defaultValue={"Add a CNAME record pointing your domain to stores.maison.com\nSSL certificate will be provisioned automatically within 24 hours."} /></div>
            <Button onClick={handleSave} className="font-body">{t("settings.saveChanges")}</Button>
          </CardContent></Card></TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
};

export default PlatformSettings;
