import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground mt-20">
    <div className="container mx-auto px-4 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-display text-xl font-semibold mb-4">MAISON</h3>
          <p className="font-body text-sm text-primary-foreground/70 leading-relaxed">
            Curated premium lifestyle products for the modern individual.
          </p>
        </div>
        <div>
          <h4 className="font-body text-sm font-semibold tracking-wide uppercase mb-4">Shop</h4>
          <ul className="space-y-2">
            <li><Link to="/catalog" className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">All Products</Link></li>
            <li><Link to="/catalog?category=clothing" className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Clothing</Link></li>
            <li><Link to="/catalog?category=accessories" className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Accessories</Link></li>
            <li><Link to="/catalog?category=home" className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Home</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-body text-sm font-semibold tracking-wide uppercase mb-4">Help</h4>
          <ul className="space-y-2">
            <li><span className="font-body text-sm text-primary-foreground/70">Shipping & Returns</span></li>
            <li><span className="font-body text-sm text-primary-foreground/70">FAQ</span></li>
            <li><span className="font-body text-sm text-primary-foreground/70">Contact Us</span></li>
            <li><span className="font-body text-sm text-primary-foreground/70">Size Guide</span></li>
          </ul>
        </div>
        <div>
          <h4 className="font-body text-sm font-semibold tracking-wide uppercase mb-4">Newsletter</h4>
          <p className="font-body text-sm text-primary-foreground/70 mb-3">Get early access to new arrivals and exclusive offers.</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-primary-foreground/10 border border-primary-foreground/20 rounded-l-md px-3 py-2 text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:border-accent"
            />
            <button className="bg-accent text-accent-foreground px-4 py-2 rounded-r-md text-sm font-medium hover:opacity-90 transition-opacity">
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
        <p className="font-body text-xs text-primary-foreground/50">© 2026 MAISON. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
