import { useState } from "react";
import { Search, Plus, Star, MoreHorizontal, Edit, Trash2, Ruler, Palette, Maximize, Layers, Scale, Sparkles, Settings, X } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { products as initialProducts, categories } from "@/data/mock-data";
import { useTranslation } from "@/context/LanguageContext";
import { Product, ProductAttribute, ProductAttributeType, ATTRIBUTE_PRESETS } from "@/types/ecommerce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const ATTR_ICONS: Record<string, React.ReactNode> = {
  Ruler: <Ruler className="w-4 h-4" />,
  Palette: <Palette className="w-4 h-4" />,
  Maximize: <Maximize className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
  Scale: <Scale className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />,
};

const AttributesEditor = ({ attributes, onChange }: { attributes: ProductAttribute[]; onChange: (attrs: ProductAttribute[]) => void }) => {
  const addAttribute = (type: ProductAttributeType) => {
    const preset = ATTRIBUTE_PRESETS.find(p => p.type === type)!;
    const existing = attributes.find(a => a.type === type && type !== "custom");
    if (existing) return;
    onChange([...attributes, { id: `attr-${Date.now()}`, type, label: type === "custom" ? "" : preset.label, value: "" }]);
  };

  const updateAttribute = (id: string, field: "label" | "value", val: string) => {
    onChange(attributes.map(a => a.id === id ? { ...a, [field]: val } : a));
  };

  const removeAttribute = (id: string) => {
    onChange(attributes.filter(a => a.id !== id));
  };

  const usedTypes = attributes.map(a => a.type);
  const availablePresets = ATTRIBUTE_PRESETS.filter(p => p.type === "custom" || !usedTypes.includes(p.type));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="font-body text-sm font-medium">Product Attributes</Label>
      </div>

      {attributes.length > 0 && (
        <div className="space-y-2">
          {attributes.map(attr => {
            const preset = ATTRIBUTE_PRESETS.find(p => p.type === attr.type);
            return (
              <div key={attr.id} className="flex items-start gap-2 p-3 border border-border rounded-lg bg-secondary/30">
                <div className="mt-1.5 text-muted-foreground">{ATTR_ICONS[preset?.icon || "Settings"]}</div>
                <div className="flex-1 space-y-2">
                  {attr.type === "custom" ? (
                    <Input placeholder="Attribute name" value={attr.label} onChange={e => updateAttribute(attr.id, "label", e.target.value)} className="h-8 text-sm" />
                  ) : (
                    <span className="font-body text-sm font-medium text-foreground">{attr.label}</span>
                  )}
                  <Input placeholder={preset?.placeholder || "Enter value"} value={attr.value} onChange={e => updateAttribute(attr.id, "value", e.target.value)} className="h-8 text-sm" />
                </div>
                <button onClick={() => removeAttribute(attr.id)} className="mt-1.5 text-muted-foreground hover:text-destructive transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {availablePresets.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {availablePresets.map(preset => (
            <button key={`${preset.type}-${preset.label}`} type="button" onClick={() => addAttribute(preset.type)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-body border border-dashed border-border rounded-md text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
              {ATTR_ICONS[preset.icon]}<span>+ {preset.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminProducts = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formAttributes, setFormAttributes] = useState<ProductAttribute[]>([]);

  const filtered = productList.filter(p => {
    const ms = p.name.toLowerCase().includes(search.toLowerCase());
    const mc = !categoryFilter || p.categorySlug === categoryFilter;
    return ms && mc;
  });

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const cat = categories.find(c => c.slug === fd.get("category")) || categories[0];
    const newProduct: Product = {
      id: `p${Date.now()}`, name: fd.get("name") as string, slug: (fd.get("name") as string).toLowerCase().replace(/\s+/g, "-"),
      description: fd.get("description") as string, price: Number(fd.get("price")),
      compareAtPrice: fd.get("comparePrice") ? Number(fd.get("comparePrice")) : undefined,
      images: ["/placeholder.svg"], category: cat.name, categorySlug: cat.slug,
      tags: (fd.get("tags") as string || "").split(",").map(t => t.trim()).filter(Boolean),
      rating: 0, reviewCount: 0, inStock: true, stockCount: Number(fd.get("stock") || 0),
      attributes: formAttributes.filter(a => a.value.trim()),
    };
    setProductList(prev => [newProduct, ...prev]);
    setOpen(false);
    setFormAttributes([]);
    toast.success(t("common.success"), { description: newProduct.name });
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;
    const fd = new FormData(e.currentTarget);
    const cat = categories.find(c => c.slug === fd.get("category")) || categories[0];
    setProductList(prev => prev.map(p => p.id === editingProduct.id ? {
      ...p,
      name: fd.get("name") as string,
      slug: (fd.get("name") as string).toLowerCase().replace(/\s+/g, "-"),
      description: fd.get("description") as string,
      price: Number(fd.get("price")),
      compareAtPrice: fd.get("comparePrice") ? Number(fd.get("comparePrice")) : undefined,
      category: cat.name,
      categorySlug: cat.slug,
      stockCount: Number(fd.get("stock") || 0),
      inStock: Number(fd.get("stock") || 0) > 0,
      tags: (fd.get("tags") as string || "").split(",").map(t => t.trim()).filter(Boolean),
      attributes: formAttributes.filter(a => a.value.trim()),
    } : p));
    setEditOpen(false);
    setEditingProduct(null);
    setFormAttributes([]);
    toast.success(t("common.success"), { description: "Product updated" });
  };

  const handleDelete = (id: string) => {
    setProductList(prev => prev.filter(p => p.id !== id));
    setDeleteConfirmId(null);
    toast.success("Product deleted");
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormAttributes(product.attributes || []);
    setEditOpen(true);
  };

  const openAdd = () => {
    setFormAttributes([]);
    setOpen(true);
  };

  const ProductForm = ({ onSubmit, defaultValues, title }: { onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; defaultValues?: Product; title: string }) => (
    <form onSubmit={onSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pe-2">
      <div><Label className="font-body text-sm">{t("form.productName")}</Label><Input name="name" required className="mt-1" defaultValue={defaultValues?.name} /></div>
      <div><Label className="font-body text-sm">{t("form.description")}</Label><Textarea name="description" required className="mt-1" defaultValue={defaultValues?.description} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label className="font-body text-sm">{t("form.price")}</Label><Input name="price" type="number" step="0.01" required className="mt-1" defaultValue={defaultValues?.price} /></div>
        <div><Label className="font-body text-sm">{t("form.comparePrice")}</Label><Input name="comparePrice" type="number" step="0.01" className="mt-1" defaultValue={defaultValues?.compareAtPrice} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label className="font-body text-sm">{t("form.category")}</Label>
          <Select name="category" defaultValue={defaultValues?.categorySlug || "clothing"}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>
            {categories.map(c => <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>)}
          </SelectContent></Select></div>
        <div><Label className="font-body text-sm">{t("form.stock")}</Label><Input name="stock" type="number" required className="mt-1" defaultValue={defaultValues?.stockCount} /></div>
      </div>
      <div><Label className="font-body text-sm">{t("form.tags")}</Label><Input name="tags" className="mt-1" placeholder="luxury, premium" defaultValue={defaultValues?.tags.join(", ")} /></div>

      <div className="border-t border-border pt-4">
        <AttributesEditor attributes={formAttributes} onChange={setFormAttributes} />
      </div>

      <Button type="submit" className="w-full font-body">{t("form.save")}</Button>
    </form>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="font-display text-2xl text-foreground">{t("admin.products")}</h1><p className="font-body text-sm text-muted-foreground mt-1">{productList.length} {t("admin.totalProducts")}</p></div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="font-body" onClick={openAdd}><Plus className="w-4 h-4 me-2" />{t("admin.addProduct")}</Button></DialogTrigger>
            <DialogContent className="max-w-lg"><DialogHeader><DialogTitle className="font-display">{t("admin.addProduct")}</DialogTitle></DialogHeader>
              <ProductForm onSubmit={handleAdd} title={t("admin.addProduct")} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1"><Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder={`${t("common.search")}...`} value={search} onChange={e => setSearch(e.target.value)} className="ps-9 font-body" /></div>
          <div className="flex gap-2 flex-wrap">
            <Button variant={!categoryFilter ? "default" : "outline"} size="sm" className="font-body text-xs" onClick={() => setCategoryFilter("")}>{t("common.all")}</Button>
            {categories.map(c => <Button key={c.id} variant={categoryFilter === c.slug ? "default" : "outline"} size="sm" className="font-body text-xs" onClick={() => setCategoryFilter(c.slug)}>{c.name}</Button>)}
          </div>
        </div>
        <div className="border border-border rounded-lg overflow-hidden bg-card"><div className="overflow-x-auto">
          <Table><TableHeader><TableRow>
            <TableHead className="font-body text-xs">{t("admin.products")}</TableHead><TableHead className="font-body text-xs">{t("form.category")}</TableHead>
            <TableHead className="font-body text-xs text-right">{t("form.price")}</TableHead><TableHead className="font-body text-xs text-right">{t("form.stock")}</TableHead>
            <TableHead className="font-body text-xs">Rating</TableHead><TableHead className="font-body text-xs">Attrs</TableHead><TableHead className="font-body text-xs">{t("form.status")}</TableHead><TableHead className="w-10"></TableHead>
          </TableRow></TableHeader>
          <TableBody>{filtered.map(p => (
            <TableRow key={p.id} className="hover:bg-secondary/30">
              <TableCell><div className="flex items-center gap-3"><div className="w-10 h-10 bg-secondary rounded overflow-hidden flex-shrink-0"><img src={p.images[0]} alt="" className="w-full h-full object-cover" /></div><span className="font-body text-sm font-medium text-foreground">{p.name}</span></div></TableCell>
              <TableCell className="font-body text-sm text-muted-foreground">{p.category}</TableCell>
              <TableCell className="font-body text-sm text-foreground text-right">${p.price}{p.compareAtPrice && <span className="text-xs text-muted-foreground line-through ms-1">${p.compareAtPrice}</span>}</TableCell>
              <TableCell className="text-right"><span className={`font-body text-sm ${p.stockCount < 20 ? "text-warning font-medium" : "text-foreground"}`}>{p.stockCount}</span></TableCell>
              <TableCell><div className="flex items-center gap-1"><Star className="w-3 h-3 fill-accent text-accent" /><span className="font-body text-sm">{p.rating}</span></div></TableCell>
              <TableCell><span className="font-body text-sm text-muted-foreground">{p.attributes?.length || 0}</span></TableCell>
              <TableCell><Badge variant={p.inStock ? "outline" : "destructive"} className="font-body text-xs">{p.inStock ? t("common.active") : t("product.soldOut")}</Badge></TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="font-body text-sm">
                    <DropdownMenuItem onClick={() => openEdit(p)}><Edit className="w-4 h-4 me-2" />{t("common.edit")}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeleteConfirmId(p.id)} className="text-destructive"><Trash2 className="w-4 h-4 me-2" />{t("common.delete")}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}</TableBody></Table>
        </div></div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) { setEditingProduct(null); setFormAttributes([]); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-display">{t("common.edit")} Product</DialogTitle></DialogHeader>
          {editingProduct && <ProductForm onSubmit={handleEdit} defaultValues={editingProduct} title={`${t("common.edit")} Product`} />}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="font-display">Delete Product?</DialogTitle></DialogHeader>
          <p className="font-body text-sm text-muted-foreground">This action cannot be undone. The product will be permanently removed.</p>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1 font-body" onClick={() => setDeleteConfirmId(null)}>{t("common.cancel")}</Button>
            <Button variant="destructive" className="flex-1 font-body" onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}>{t("common.delete")}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};
export default AdminProducts;
