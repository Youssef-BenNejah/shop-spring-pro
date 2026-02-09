import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import StorefrontLayout from "@/components/storefront/StorefrontLayout";
import ProductCard from "@/components/storefront/ProductCard";
import { products, categories } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortOption } from "@/types/ecommerce";

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const selectedCategory = searchParams.get("category") || "";

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory) result = result.filter(p => p.categorySlug === selectedCategory);
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sort) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "name": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }
    return result;
  }, [selectedCategory, sort, priceRange]);

  const setCategory = (slug: string) => {
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      setSearchParams({});
    }
  };

  return (
    <StorefrontLayout>
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl lg:text-4xl text-foreground mb-2">
            {selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name || "Shop" : "Shop All"}
          </h1>
          <p className="font-body text-sm text-muted-foreground">{filtered.length} products</p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden font-body"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
          </Button>

          <div className="hidden lg:flex items-center gap-2 flex-wrap">
            <Button
              variant={!selectedCategory ? "default" : "outline"}
              size="sm"
              className="font-body text-xs"
              onClick={() => setCategory("")}
            >
              All
            </Button>
            {categories.map(cat => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.slug ? "default" : "outline"}
                size="sm"
                className="font-body text-xs"
                onClick={() => setCategory(cat.slug)}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger className="w-[160px] font-body text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Best Rating</SelectItem>
              <SelectItem value="name">Name A–Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile filters */}
        {showFilters && (
          <div className="lg:hidden mb-6 p-4 border border-border rounded-lg bg-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-body text-sm font-medium">Category</span>
              <button onClick={() => setShowFilters(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant={!selectedCategory ? "default" : "outline"} size="sm" className="font-body text-xs" onClick={() => setCategory("")}>All</Button>
              {categories.map(cat => (
                <Button key={cat.id} variant={selectedCategory === cat.slug ? "default" : "outline"} size="sm" className="font-body text-xs" onClick={() => setCategory(cat.slug)}>{cat.name}</Button>
              ))}
            </div>
          </div>
        )}

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-body text-muted-foreground">No products found matching your filters.</p>
            <Button variant="outline" className="mt-4 font-body" onClick={() => { setCategory(""); setPriceRange([0, 1000]); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
};

export default Catalog;
