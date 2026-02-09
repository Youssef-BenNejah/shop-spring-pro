import { useState } from "react";
import { Search, Plus, Star, MoreHorizontal } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { products, categories } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AdminProducts = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || p.categorySlug === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-foreground">Products</h1>
            <p className="font-body text-sm text-muted-foreground mt-1">{products.length} total products</p>
          </div>
          <Button className="font-body">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 font-body"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant={!categoryFilter ? "default" : "outline"} size="sm" className="font-body text-xs" onClick={() => setCategoryFilter("")}>All</Button>
            {categories.map(cat => (
              <Button key={cat.id} variant={categoryFilter === cat.slug ? "default" : "outline"} size="sm" className="font-body text-xs" onClick={() => setCategoryFilter(cat.slug)}>
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-body text-xs">Product</TableHead>
                  <TableHead className="font-body text-xs">Category</TableHead>
                  <TableHead className="font-body text-xs text-right">Price</TableHead>
                  <TableHead className="font-body text-xs text-right">Stock</TableHead>
                  <TableHead className="font-body text-xs">Rating</TableHead>
                  <TableHead className="font-body text-xs">Status</TableHead>
                  <TableHead className="font-body text-xs w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((product) => (
                  <TableRow key={product.id} className="hover:bg-secondary/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary rounded overflow-hidden flex-shrink-0">
                          <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-body text-sm font-medium text-foreground">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-body text-sm text-muted-foreground">{product.category}</TableCell>
                    <TableCell className="font-body text-sm text-foreground text-right">
                      ${product.price}
                      {product.compareAtPrice && (
                        <span className="text-xs text-muted-foreground line-through ml-1">${product.compareAtPrice}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-body text-sm ${product.stockCount < 20 ? "text-warning font-medium" : "text-foreground"}`}>
                        {product.stockCount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-accent text-accent" />
                        <span className="font-body text-sm text-foreground">{product.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.inStock ? "outline" : "destructive"} className="font-body text-xs">
                        {product.inStock ? "Active" : "Sold Out"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
