import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, Settings, BarChart3, Menu, X, Store, LogOut, FileText, FolderTree } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import ThemeToggle from "@/components/shared/ThemeToggle";
import LanguageSelector from "@/components/shared/LanguageSelector";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();

  const navItems = [
    { label: t("admin.dashboard"), path: "/admin", icon: LayoutDashboard },
    { label: t("admin.products"), path: "/admin/products", icon: Package },
    { label: t("admin.categories"), path: "/admin/categories", icon: FolderTree },
    { label: t("admin.orders"), path: "/admin/orders", icon: ShoppingCart },
    { label: "Invoices", path: "/admin/invoices", icon: FileText },
    { label: t("admin.customers"), path: "/admin/customers", icon: Users },
    { label: t("admin.marketing"), path: "/admin/marketing", icon: Tag },
    { label: t("admin.analytics"), path: "/admin/analytics", icon: BarChart3 },
    { label: t("admin.settings"), path: "/admin/settings", icon: Settings },
  ];

  const isActive = (path: string) => path === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(path);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="p-5 flex items-center justify-between">
        <Link to="/admin" className="font-display text-lg font-semibold text-sidebar-primary">MAISON</Link>
        <button className="lg:hidden text-sidebar-foreground" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(item => (
          <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md font-body text-sm transition-colors ${
              isActive(item.path) ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            }`}>
            <item.icon className="w-4 h-4" />{item.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 space-y-1 border-t border-sidebar-border">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-md font-body text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
          <Store className="w-4 h-4" />{t("admin.viewStore")}
        </Link>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-md font-body text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors w-full">
          <LogOut className="w-4 h-4" />{t("admin.signOut")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden lg:block w-60 flex-shrink-0 border-e border-sidebar-border">
        <div className="sticky top-0 h-screen overflow-y-auto"><SidebarContent /></div>
      </aside>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute start-0 top-0 h-full w-64"><SidebarContent /></div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border h-14 flex items-center px-4 lg:px-8">
          <button className="lg:hidden me-3" onClick={() => setSidebarOpen(true)}><Menu className="w-5 h-5 text-foreground" /></button>
          <span className="font-body text-sm text-muted-foreground">{t("admin.overview")}</span>
          <div className="ms-auto flex items-center gap-1">
            <LanguageSelector />
            <ThemeToggle />
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center ms-2">
              <span className="font-body text-xs font-semibold text-accent-foreground">A</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
