import React from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Search, 
  PlusCircle, 
  Key, 
  Crown, 
  Layers, 
  Type, 
  Box, 
  Code, 
  Image as ImageIcon, 
  Layout 
} from 'lucide-react';
import { Category } from '../types';

interface HeaderProps {
  activeCategory: Category;
  onSelectCategory: (category: Category) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAIConcierge: () => void;
  onOpenCreatorStudio: () => void;
  onOpenVault: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  onOpenAIConcierge,
  onOpenCreatorStudio,
  onOpenVault,
}) => {
  const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Curated', icon: <Crown className="w-3.5 h-3.5" /> },
    { id: 'ui-kits', label: 'UI Kits', icon: <Layout className="w-3.5 h-3.5" /> },
    { id: 'fonts', label: 'Typography', icon: <Type className="w-3.5 h-3.5" /> },
    { id: 'mockups', label: '3D & Mockups', icon: <Box className="w-3.5 h-3.5" /> },
    { id: 'digital-art', label: 'Digital Art', icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { id: 'software', label: 'Software & Code', icon: <Code className="w-3.5 h-3.5" /> },
    { id: 'templates', label: 'Templates', icon: <Layers className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#050505]/85 backdrop-blur-md border-b border-white/10">
      {/* Top Banner Notice */}
      <div className="bg-[#111111] border-b border-white/10 text-xs py-2 px-4 text-center text-white/70">
        <span className="inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <strong className="text-white font-semibold">AURA ATELIER RELEASE:</strong> Cryptographically Verified Digital Licenses & Node.js Assets. Code <code className="bg-white/10 text-white px-2 py-0.5 rounded font-mono-code border border-white/20">LUXURY20</code> for 20% privilege off.
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onSelectCategory('all')}
              className="group flex items-center gap-3 text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/20 flex items-center justify-center text-white shadow-xl group-hover:border-white/50 transition-all">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold tracking-widest text-white leading-none">
                  AURA<span className="font-light opacity-60 text-sm ml-1">ATELIER</span>
                </div>
                <div className="text-[9px] tracking-[0.25em] text-white/40 uppercase font-medium mt-1">
                  Curated Digital Vault
                </div>
              </div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search UI Kits, 3D Mockups, Fonts, Software..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-white/30 rounded-full pl-11 pr-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* AI Curator Concierge */}
            <button
              onClick={onOpenAIConcierge}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black transition-all text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Curator</span>
            </button>

            {/* Creator Submit Studio */}
            <button
              onClick={onOpenCreatorStudio}
              className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#111111] border border-white/10 hover:border-white/30 text-white/80 hover:text-white transition-all text-xs font-medium"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Sell Asset</span>
            </button>

            {/* Digital Vault / My Purchases */}
            <button
              onClick={onOpenVault}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#111111] border border-white/10 hover:border-white/30 text-white/80 hover:text-white transition-all text-xs font-medium"
              title="My Purchased License Vault"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Vault</span>
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-white/30 text-white transition-all"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center border border-black shadow">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search assets, fonts, code..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-white/30 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-white/20 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Navigation Bar */}
        <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2.5 border-t border-white/10 scroll-smooth">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-black font-bold shadow-lg'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};
