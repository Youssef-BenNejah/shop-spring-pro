import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import StorefrontLayout from "@/components/storefront/StorefrontLayout";
import ProductCard from "@/components/storefront/ProductCard";
import { products, categories, getBestSellers } from "@/data/mock-data";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-image.jpg";

const Home = () => {
  const bestSellers = getBestSellers();
  const featured = products.slice(0, 8);

  return (
    <StorefrontLayout>
      {/* Hero */}
      <section className="relative h-[70vh] lg:h-[85vh] overflow-hidden">
        <img src={heroImage} alt="Premium lifestyle products" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative h-full container mx-auto px-4 lg:px-8 flex items-end pb-16 lg:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <h1 className="font-display text-4xl lg:text-6xl font-semibold text-primary-foreground leading-tight mb-4">
              Curated for the <span className="italic">modern</span> life
            </h1>
            <p className="font-body text-base lg:text-lg text-primary-foreground/80 mb-8">
              Discover premium essentials crafted with intention and care.
            </p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-body" asChild>
              <Link to="/catalog">
                Shop Collection <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <h2 className="font-display text-2xl lg:text-3xl text-foreground mb-10 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/catalog?category=${cat.slug}`}
                className="block group relative aspect-[4/5] bg-secondary rounded-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/10 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <h3 className="font-display text-xl lg:text-2xl text-foreground font-medium mb-1">{cat.name}</h3>
                  <p className="font-body text-xs text-muted-foreground">{cat.productCount} products</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-display text-2xl lg:text-3xl text-foreground">Best Sellers</h2>
          <Link to="/catalog" className="font-body text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {bestSellers.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-24">
        <h2 className="font-display text-2xl lg:text-3xl text-foreground mb-10 text-center">New Arrivals</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-24">
        <div className="bg-primary rounded-xl p-10 lg:p-16 text-center">
          <h2 className="font-display text-2xl lg:text-4xl text-primary-foreground mb-4">Join the MAISON World</h2>
          <p className="font-body text-sm lg:text-base text-primary-foreground/70 mb-8 max-w-md mx-auto">
            Subscribe for exclusive access to new collections, limited editions, and member-only offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-md px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-body px-8">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </StorefrontLayout>
  );
};

export default Home;
