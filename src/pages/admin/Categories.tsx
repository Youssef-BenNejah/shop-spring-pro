import { useState } from "react";
import { Search, Plus, Edit, Trash2, FolderTree } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { categories as initialCategories } from "@/data/mock-data";
import { products } from "@/data/mock-data";
import { useTranslation } from "@/context/LanguageContext";
import { Category } from "@/types/ecommerce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const AdminCategories = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [categoryList, setCategoryList] = useState<Category[]>(initialCategories);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = categoryList.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const getProductCount = (slug: string) => products.filter(p => p.categorySlug === slug).length;

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      description: fd.get("description") as string,
      productCount: 0,
    };
    setCategoryList(prev => [...prev, newCategory]);
    setCreateOpen(false);
    toast.success(t("common.success"), { description: `Category "${newCategory.name}" created` });
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCategory) return;
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    setCategoryList(prev =>
      prev.map(c =>
        c.id === editingCategory.id
          ? {
              ...c,
              name,
              slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
              description: fd.get("description") as string,
            }
          : c
      )
    );
    setEditOpen(false);
    setEditingCategory(null);
    toast.success(t("common.success"), { description: `Category "${name}" updated` });
  };

  const handleDelete = (id: string) => {
    const cat = categoryList.find(c => c.id === id);
    const count = getProductCount(cat?.slug || "");
    if (count > 0) {
      toast.error("Cannot delete", { description: `${count} products are still in this category. Reassign them first.` });
      setDeleteConfirmId(null);
      return;
    }
    setCategoryList(prev => prev.filter(c => c.id !== id));
    setDeleteConfirmId(null);
    toast.success("Category deleted");
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setEditOpen(true);
  };

  const totalProducts = categoryList.reduce((sum, c) => sum + getProductCount(c.slug), 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-foreground">{t("admin.categories")}</h1>
            <p className="font-body text-sm text-muted-foreground mt-1">
              {categoryList.length} categories · {totalProducts} products
            </p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="font-body">
                <Plus className="w-4 h-4 me-2" />{t("admin.addCategory")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">{t("admin.addCategory")}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <Label className="font-body text-sm">{t("form.categoryName")}</Label>
                  <Input name="name" required className="mt-1" placeholder="e.g. Electronics" />
                </div>
                <div>
                  <Label className="font-body text-sm">{t("form.description")}</Label>
                  <Textarea name="description" className="mt-1" placeholder="Brief description of this category..." />
                </div>
                <Button type="submit" className="w-full font-body">{t("form.save")}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Categories", value: categoryList.length, icon: FolderTree },
            { label: "Active Categories", value: categoryList.filter(c => getProductCount(c.slug) > 0).length, icon: FolderTree },
            { label: "Empty Categories", value: categoryList.filter(c => getProductCount(c.slug) === 0).length, icon: FolderTree },
            { label: "Total Products", value: totalProducts, icon: FolderTree },
          ].map(k => (
            <Card key={k.label}>
              <CardContent className="p-4 lg:p-6">
                <k.icon className="w-5 h-5 text-muted-foreground mb-3" />
                <p className="font-body text-2xl font-semibold text-foreground">{k.value}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{k.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={`${t("common.search")}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="ps-9 font-body"
          />
        </div>

        {/* Table */}
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-body text-xs">{t("form.categoryName")}</TableHead>
                  <TableHead className="font-body text-xs">Slug</TableHead>
                  <TableHead className="font-body text-xs">{t("form.description")}</TableHead>
                  <TableHead className="font-body text-xs text-right">Products</TableHead>
                  <TableHead className="font-body text-xs">{t("form.status")}</TableHead>
                  <TableHead className="w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(cat => {
                  const count = getProductCount(cat.slug);
                  return (
                    <TableRow key={cat.id} className="hover:bg-secondary/30">
                      <TableCell className="font-body text-sm font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <FolderTree className="w-4 h-4 text-muted-foreground" />
                          {cat.name}
                        </div>
                      </TableCell>
                      <TableCell className="font-body text-sm text-muted-foreground font-mono text-xs">
                        {cat.slug}
                      </TableCell>
                      <TableCell className="font-body text-sm text-muted-foreground max-w-[200px] truncate">
                        {cat.description}
                      </TableCell>
                      <TableCell className="font-body text-sm text-foreground text-right">
                        {count}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={count > 0 ? "outline" : "secondary"}
                          className="font-body text-xs"
                        >
                          {count > 0 ? t("common.active") : "Empty"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEdit(cat)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setDeleteConfirmId(cat.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="font-body text-muted-foreground">{t("common.noResults")}</p>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) setEditingCategory(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">{t("common.edit")} Category</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <Label className="font-body text-sm">{t("form.categoryName")}</Label>
                <Input name="name" required className="mt-1" defaultValue={editingCategory.name} />
              </div>
              <div>
                <Label className="font-body text-sm">{t("form.description")}</Label>
                <Textarea name="description" className="mt-1" defaultValue={editingCategory.description} />
              </div>
              <Button type="submit" className="w-full font-body">{t("settings.saveChanges")}</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Delete Category?</DialogTitle>
          </DialogHeader>
          <p className="font-body text-sm text-muted-foreground">
            This action cannot be undone. Categories with products cannot be deleted.
          </p>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1 font-body" onClick={() => setDeleteConfirmId(null)}>
              {t("common.cancel")}
            </Button>
            <Button variant="destructive" className="flex-1 font-body" onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}>
              {t("common.delete")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCategories;
