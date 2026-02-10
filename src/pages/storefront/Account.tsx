import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Package, Heart, Settings, LogOut, MapPin, CreditCard } from "lucide-react";
import StorefrontLayout from "@/components/storefront/StorefrontLayout";
import { useTranslation } from "@/context/LanguageContext";
import { sampleOrders } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  processing: "bg-info/10 text-info",
  shipped: "bg-accent/10 text-accent-foreground",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

const Account = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("orders");

  const user = {
    name: "Emma Thompson",
    email: "emma@example.com",
    phone: "+44 20 7123 4567",
    address: "42 Kings Road, London SW3 4ND",
    memberSince: "June 2025",
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully");
  };

  return (
    <StorefrontLayout>
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-3">
                  <span className="font-display text-xl text-accent-foreground">ET</span>
                </div>
                <h2 className="font-display text-lg text-foreground">{user.name}</h2>
                <p className="font-body text-xs text-muted-foreground">Member since {user.memberSince}</p>
              </div>
              <Separator />
              <nav className="space-y-1">
                {[
                  { id: "orders", label: "My Orders", icon: Package },
                  { id: "profile", label: "Profile", icon: User },
                  { id: "addresses", label: "Addresses", icon: MapPin },
                  { id: "payment", label: "Payment Methods", icon: CreditCard },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md font-body text-sm transition-colors ${
                      activeTab === item.id
                        ? "bg-secondary text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
              <Separator />
              <Button variant="ghost" className="w-full justify-start font-body text-sm text-muted-foreground" asChild>
                <Link to="/"><LogOut className="w-4 h-4 me-3" />Sign Out</Link>
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeTab === "orders" && (
              <div className="space-y-6">
                <h1 className="font-display text-2xl text-foreground">My Orders</h1>
                <div className="space-y-4">
                  {sampleOrders.map(order => (
                    <Card key={order.id}>
                      <CardContent className="p-4 lg:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div>
                            <p className="font-body text-sm font-medium text-foreground">{order.orderNumber}</p>
                            <p className="font-body text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} items
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={`font-body text-xs capitalize ${statusColors[order.status]}`}>
                              {order.status}
                            </Badge>
                            <span className="font-body text-sm font-semibold text-foreground">${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between font-body text-sm">
                              <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                              <span className="text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        {order.status === "shipped" && (
                          <Button variant="outline" size="sm" className="mt-4 font-body" onClick={() => toast.info("Tracking: TRACK-" + order.id)}>
                            Track Order
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="space-y-6">
                <h1 className="font-display text-2xl text-foreground">Profile Settings</h1>
                <Card>
                  <CardContent className="p-6">
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="font-body text-sm">Full Name</Label>
                          <Input className="mt-1" defaultValue={user.name} />
                        </div>
                        <div>
                          <Label className="font-body text-sm">Email</Label>
                          <Input className="mt-1" type="email" defaultValue={user.email} />
                        </div>
                        <div>
                          <Label className="font-body text-sm">Phone</Label>
                          <Input className="mt-1" type="tel" defaultValue={user.phone} />
                        </div>
                      </div>
                      <Separator />
                      <h3 className="font-body text-sm font-semibold">Change Password</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="font-body text-sm">Current Password</Label>
                          <Input className="mt-1" type="password" />
                        </div>
                        <div>
                          <Label className="font-body text-sm">New Password</Label>
                          <Input className="mt-1" type="password" />
                        </div>
                      </div>
                      <Button type="submit" className="font-body">{t("settings.saveChanges")}</Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="font-display text-2xl text-foreground">Saved Addresses</h1>
                  <Button className="font-body" onClick={() => toast.info("Add address form")}><MapPin className="w-4 h-4 me-2" />Add Address</Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="font-body text-xs">Default</Badge>
                      </div>
                      <p className="font-body text-sm font-medium text-foreground">Emma Thompson</p>
                      <p className="font-body text-sm text-muted-foreground mt-1">42 Kings Road</p>
                      <p className="font-body text-sm text-muted-foreground">London SW3 4ND</p>
                      <p className="font-body text-sm text-muted-foreground">United Kingdom</p>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" className="font-body text-xs" onClick={() => toast.info("Edit address")}>Edit</Button>
                        <Button variant="ghost" size="sm" className="font-body text-xs text-destructive" onClick={() => toast.success("Address removed")}>Remove</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="font-display text-2xl text-foreground">Payment Methods</h1>
                  <Button className="font-body" onClick={() => toast.info("Add payment method")}><CreditCard className="w-4 h-4 me-2" />Add Card</Button>
                </div>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 bg-secondary rounded flex items-center justify-center">
                          <span className="font-body text-[10px] font-bold text-muted-foreground">VISA</span>
                        </div>
                        <div>
                          <p className="font-body text-sm font-medium text-foreground">•••• •••• •••• 4242</p>
                          <p className="font-body text-xs text-muted-foreground">Expires 12/28</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="font-body text-xs">Default</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
};

export default Account;
