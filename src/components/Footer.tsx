import React from 'react';
import { Crown, ShieldCheck, Heart, Github, Code, ArrowUpRight } from 'lucide-react';
import { Category } from '../types';

interface FooterProps {
  onSelectCategory: (category: Category) => void;
  onOpenAIConcierge: () => void;
  onOpenCreatorStudio: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenAIConcierge,
  onOpenCreatorStudio,
}) => {
  return (
    <footer className="bg-[#0b0c0e] border-t border-white/5 text-slate-400 text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Manifesto */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#181b21] border border-gold-glow flex items-center justify-center text-[#D4AF37]">
                <Crown className="w-4 h-4" />
              </div>
              <span className="font-serif-luxury text-xl font-bold text-gold-gradient tracking-widest">
                AURA
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The world's premier digital atelier for studio-grade UI systems, variable typography foundries, 3D spatial renders, fine digital art, and production-ready Node.js code resources.
            </p>

            <div className="flex items-center gap-2 text-[10px] font-mono-code text-[#D4AF37]">
              <ShieldCheck className="w-4 h-4" />
              <span>SHA-256 Cryptographically Signed License Certificates</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif-luxury font-bold text-sm text-slate-200">Atelier Collections</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectCategory('ui-kits')} className="hover:text-[#D4AF37] transition-colors">
                  UI Kits & Design Systems
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('fonts')} className="hover:text-[#D4AF37] transition-colors">
                  Typography & Fonts
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('mockups')} className="hover:text-[#D4AF37] transition-colors">
                  3D & Device Mockups
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('digital-art')} className="hover:text-[#D4AF37] transition-colors">
                  Digital Art & Fine Canvas
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('software')} className="hover:text-[#D4AF37] transition-colors">
                  Software & Developer Tools
                </button>
              </li>
            </ul>
          </div>

          {/* Studio & Concierge */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif-luxury font-bold text-sm text-slate-200">Curator Services</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenAIConcierge} className="hover:text-[#D4AF37] transition-colors flex items-center gap-1">
                  <span>Gemini AI Asset Curator</span>
                  <ArrowUpRight className="w-3 h-3 text-[#D4AF37]" />
                </button>
              </li>
              <li>
                <button onClick={onOpenCreatorStudio} className="hover:text-[#D4AF37] transition-colors flex items-center gap-1">
                  <span>Publish Asset in Atelier Studio</span>
                  <ArrowUpRight className="w-3 h-3 text-[#D4AF37]" />
                </button>
              </li>
              <li className="pt-2 text-slate-500 leading-relaxed text-[11px]">
                Powered by Node.js Express 4.21, TypeScript, Vite, Tailwind v4 CSS, and Gemini 2.5 Flash API.
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 AURA Digital Atelier. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Terms of License</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Node.js Express API Status: <strong className="text-emerald-400">Online</strong></span>
          </div>
        </div>

      </div>
    </footer>
  );
};
