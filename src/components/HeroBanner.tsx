import React from 'react';
import { ShieldCheck, Sparkles, Download, Code, Award, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  onOpenAIConcierge: () => void;
  onExploreCategory: (category: any) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenAIConcierge,
  onExploreCategory,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Hero Section Card */}
        <div className="w-full rounded-3xl overflow-hidden relative border border-white/10 bg-gradient-to-br from-[#161616] via-[#111111] to-[#0A0A0A] p-8 sm:p-12 shadow-2xl flex flex-col lg:flex-row gap-8 items-center">
          
          <div className="flex-1 space-y-6 z-10 text-center lg:text-left">
            <div>
              <span className="inline-block px-3.5 py-1 rounded-full border border-white/20 text-[10px] uppercase tracking-widest font-bold text-white/60 mb-4 bg-white/5">
                New Atelier Release
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter leading-[0.95] text-white">
                Aether OS<br />
                <span className="text-white/40 font-light">Ultimate UI System</span>
              </h1>
            </div>

            <p className="text-white/50 text-sm sm:text-base max-w-lg font-light leading-relaxed mx-auto lg:mx-0">
              The world's most comprehensive design framework for high-fidelity spatial computing interfaces, variable fonts, 3D renders, and Node.js backend engines.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onExploreCategory('ui-kits')}
                className="bg-white text-black px-8 py-3.5 rounded-full font-bold text-sm hover:bg-white/90 transition-all flex items-center gap-2 shadow-xl hover:scale-105"
              >
                <span>Acquire License — $149</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenAIConcierge}
                className="px-8 py-3.5 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2 bg-white/5"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Curator Search</span>
              </button>
            </div>

            {/* Quick Filter Tags */}
            <div className="flex items-center justify-center lg:justify-start gap-3 text-xs text-white/40 pt-2">
              <span className="uppercase tracking-widest font-bold text-[10px]">Vault:</span>
              <button onClick={() => onExploreCategory('ui-kits')} className="hover:text-white transition-colors">UI Kits</button>
              <span>•</span>
              <button onClick={() => onExploreCategory('fonts')} className="hover:text-white transition-colors">Typefaces</button>
              <span>•</span>
              <button onClick={() => onExploreCategory('mockups')} className="hover:text-white transition-colors">3D Render</button>
              <span>•</span>
              <button onClick={() => onExploreCategory('software')} className="hover:text-white transition-colors">Node API</button>
            </div>
          </div>

          {/* Right Cards Stack Graphic */}
          <div className="flex-1 relative w-full flex items-center justify-center min-h-[260px] sm:min-h-[300px]">
            <div className="absolute w-72 h-72 bg-white/5 blur-[100px] rounded-full" />
            <div className="relative flex gap-4 rotate-6 hover:rotate-0 transition-transform duration-500">
              <div className="w-44 sm:w-52 h-60 sm:h-72 bg-[#1a1a1a] border border-white/20 rounded-2xl shadow-2xl flex flex-col justify-between p-4 transform hover:-translate-y-2 transition-transform">
                <div className="text-[10px] uppercase tracking-widest font-bold text-white/40">Figma + React</div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white">Atelier System</div>
                  <div className="text-xs text-white/50">$149 USD</div>
                </div>
                <div className="w-full h-1/2 bg-gradient-to-t from-white/10 to-transparent rounded-xl" />
              </div>

              <div className="w-44 sm:w-52 h-60 sm:h-72 bg-[#111111] border border-white/20 rounded-2xl shadow-2xl transform translate-y-8 flex flex-col justify-between p-4 hover:-translate-y-2 transition-transform">
                <div className="text-[10px] uppercase tracking-widest font-bold text-white/40">Variable Font</div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white">AURA Serif</div>
                  <div className="text-xs text-white/50">$129 USD</div>
                </div>
                <div className="w-full h-1/2 bg-gradient-to-t from-white/10 to-transparent rounded-xl" />
              </div>
            </div>
          </div>

        </div>

        {/* Feature Pillars Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          <div className="p-6 rounded-2xl bg-[#111111] border border-white/10 flex items-start gap-4 hover:border-white/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white shrink-0 border border-white/10">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">Cryptographic Licenses</h3>
              <p className="text-xs text-white/40 mt-1">Every download receives a cryptographically signed HMAC license certificate.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#111111] border border-white/10 flex items-start gap-4 hover:border-white/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white shrink-0 border border-white/10">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">Instant Digital Vault</h3>
              <p className="text-xs text-white/40 mt-1">Node.js served source code, vector files, WOFF2 fonts & Blender assets.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#111111] border border-white/10 flex items-start gap-4 hover:border-white/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white shrink-0 border border-white/10">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">TypeScript & Express</h3>
              <p className="text-xs text-white/40 mt-1">Engineered for React 19, Tailwind CSS v4, Docker, and Express microservices.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
