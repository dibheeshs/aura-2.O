import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductInspectorModal } from './components/ProductInspectorModal';
import { CartDrawer } from './components/CartDrawer';
import { AIConciergeModal } from './components/AIConciergeModal';
import { CreatorStudioModal } from './components/CreatorStudioModal';
import { VaultModal } from './components/VaultModal';

import { Category, Product, CartItem, LicenseOption } from './types';
import { INITIAL_PRODUCTS } from './data/products';
import { SlidersHorizontal, RefreshCw, AlertCircle, Crown, ShieldCheck } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price-low' | 'price-high'>('popular');

  // Shopping Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Vault Purchased Licenses
  const [purchasedLicenses, setPurchasedLicenses] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('aura_vault_licenses');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals Control State
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isAIConciergeOpen, setIsAIConciergeOpen] = useState(false);
  const [isCreatorStudioOpen, setIsCreatorStudioOpen] = useState(false);

  // Save State
  useEffect(() => {
    localStorage.setItem('aura_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('aura_vault_licenses', JSON.stringify(purchasedLicenses));
  }, [purchasedLicenses]);

  // Fetch Products from Express Node.js Backend API
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== 'all') params.append('category', activeCategory);
      if (searchQuery) params.append('search', searchQuery);
      if (sortBy) params.append('sort', sortBy);

      const res = await fetch(`/api/products?${params.toString()}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProducts(json.data);
      }
    } catch (err) {
      console.warn('Node.js API fallback to initial catalog:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, searchQuery, sortBy]);

  // Cart Handlers
  const handleAddToCart = (product: Product, selectedLicense?: LicenseOption) => {
    const lic = selectedLicense || product.licenses[0];
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.product.id === product.id && i.license.type === lic.type
      );
      if (existingIdx > -1) {
        return prev;
      }
      return [...prev, { product, license: lic }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddPurchasedLicense = (license: any) => {
    setPurchasedLicenses((prev) => [license, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F7] flex flex-col font-sans selection:bg-white selection:text-black">
      
      {/* Sleek Navigation Header */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAIConcierge={() => setIsAIConciergeOpen(true)}
        onOpenCreatorStudio={() => setIsCreatorStudioOpen(true)}
        onOpenVault={() => setIsVaultOpen(true)}
      />

      {/* Sleek Featured Hero */}
      <HeroBanner
        onOpenAIConcierge={() => setIsAIConciergeOpen(true)}
        onExploreCategory={(cat) => setActiveCategory(cat)}
      />

      {/* Main Catalog Workspace */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Catalog Bar Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {activeCategory === 'all'
                ? 'Curated Digital Atelier'
                : `${activeCategory.toUpperCase().replace('-', ' ')} Collection`}
            </h2>
            <p className="text-xs text-white/50 mt-1 font-light">
              Showing {products.length} studio-grade digital products with instant Node.js license generation.
            </p>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-white/60 bg-[#111111] border border-white/10 px-4 py-2 rounded-full">
              <SlidersHorizontal className="w-3.5 h-3.5 text-white" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-white focus:outline-none text-xs font-semibold cursor-pointer"
              >
                <option value="popular" className="bg-[#111111]">Most Popular</option>
                <option value="rating" className="bg-[#111111]">Highest Rated</option>
                <option value="price-low" className="bg-[#111111]">Price: Low to High</option>
                <option value="price-high" className="bg-[#111111]">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Listing */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-white animate-spin mx-auto" />
            <p className="text-xs text-white/40 font-mono-code">Connecting to Node.js Microservice...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center space-y-4 bg-[#111111] rounded-3xl border border-white/10 p-8">
            <AlertCircle className="w-10 h-10 text-white/30 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Assets Found</h3>
            <p className="text-xs text-white/50 max-w-sm mx-auto font-light">
              No digital products match your filter search. Try resetting your query or selecting another category.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onInspect={(p) => setInspectingProduct(p)}
                onAddToCart={(p) => handleAddToCart(p)}
                isInCart={cartItems.some((i) => i.product.id === product.id)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Sleek Footer */}
      <footer className="border-t border-white/10 bg-[#0A0A0A] py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-bold tracking-widest text-lg">
                <Crown className="w-5 h-5" />
                <span>AURA ATELIER</span>
              </div>
              <p className="text-xs text-white/40 leading-relaxed font-light">
                The premier digital web application for software, UI systems, 3D renders, and variable typography with cryptographic licensing.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-white/40">Collections</h4>
              <ul className="space-y-1.5 text-white/60">
                <li><button onClick={() => setActiveCategory('ui-kits')} className="hover:text-white">UI Kits & Systems</button></li>
                <li><button onClick={() => setActiveCategory('fonts')} className="hover:text-white">Typography & Fonts</button></li>
                <li><button onClick={() => setActiveCategory('mockups')} className="hover:text-white">3D Mockups</button></li>
                <li><button onClick={() => setActiveCategory('software')} className="hover:text-white">Node.js Software</button></li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-white/40">Services</h4>
              <ul className="space-y-1.5 text-white/60">
                <li><button onClick={() => setIsAIConciergeOpen(true)} className="hover:text-white">AI Curator Search</button></li>
                <li><button onClick={() => setIsCreatorStudioOpen(true)} className="hover:text-white">Creator Studio Upload</button></li>
                <li><button onClick={() => setIsVaultOpen(true)} className="hover:text-white">License Key Vault</button></li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-white/40">Guarantees</h4>
              <div className="p-4 rounded-2xl bg-[#111111] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>SHA-256 HMAC Verified</span>
                </div>
                <p className="text-[10px] text-white/40 font-light">
                  All software assets are cryptographically signed and tested on Node.js 22 LTS.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/40 gap-4">
            <div>© 2026 AURA Digital Atelier. Engineered with Node.js, Express & React.</div>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Commercial Terms</span>
              <span>•</span>
              <span>HMAC Security</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProductInspectorModal
        product={inspectingProduct}
        onClose={() => setInspectingProduct(null)}
        onAddToCart={(prod, lic) => handleAddToCart(prod, lic)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
        onAddPurchasedLicense={handleAddPurchasedLicense}
      />

      <AIConciergeModal
        isOpen={isAIConciergeOpen}
        onClose={() => setIsAIConciergeOpen(false)}
        products={products}
        onSelectProduct={(p) => setInspectingProduct(p)}
      />

      <CreatorStudioModal
        isOpen={isCreatorStudioOpen}
        onClose={() => setIsCreatorStudioOpen(false)}
      />

      <VaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        purchasedLicenses={purchasedLicenses}
      />

    </div>
  );
}
