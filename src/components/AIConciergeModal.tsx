import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, Bot, Compass, Check } from 'lucide-react';
import { Product } from '../types';

interface AIConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  products: Product[];
}

export const AIConciergeModal: React.FC<AIConciergeModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  products,
}) => {
  if (!isOpen) return null;

  const [prompt, setPrompt] = useState('');
  const [projectType, setProjectType] = useState('Fintech Dashboard');
  const [aesthetic, setAesthetic] = useState('Luxury Noir');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);

  const handleConsultAI = async () => {
    setIsLoading(true);
    setRecommendation(null);

    try {
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectType,
          aesthetic,
          userPrompt: prompt || `Looking for top tier ${aesthetic} digital assets for a ${projectType} project.`,
        }),
      });

      const data = await response.json();
      if (data.success && data.recommendation) {
        setRecommendation(data.recommendation);
      } else {
        // Local fallback matching
        const matchedProducts = products.slice(0, 3);
        setRecommendation({
          curatorNote: `For a ${projectType} with a ${aesthetic} aesthetic, we recommend acquiring the Atelier System v2.4 alongside variable serif typography.`,
          recommendedProducts: matchedProducts,
        });
      }
    } catch (err) {
      console.error('AI curator error', err);
      setRecommendation({
        curatorNote: `Curated recommendation for ${projectType}: Pair high-contrast spatial computing components with cryptographic Node microservices.`,
        recommendedProducts: products.slice(0, 3),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#111111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-auto p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">AI Asset Curator</h2>
              <p className="text-xs text-white/50">Gemini-powered personalized atelier concierge</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Project Domain</label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full bg-[#161616] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white/30"
              >
                <option value="Fintech Dashboard">Fintech & Private Banking</option>
                <option value="Spatial AR/VR Interface">Spatial Computing & WebGL</option>
                <option value="Editorial Typography">Editorial & Luxury Magazine</option>
                <option value="Node API Microservice">Node.js Microservices & SaaS</option>
                <option value="Generative AI Tool">Generative AI Studio</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Aesthetic Vibe</label>
              <select
                value={aesthetic}
                onChange={(e) => setAesthetic(e.target.value)}
                className="w-full bg-[#161616] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white/30"
              >
                <option value="Sleek Dark Mode">Sleek Interface Noir</option>
                <option value="Minimalist Champagne">Minimalist Champagne Light</option>
                <option value="Hyper-Futuristic WebGL">Hyper-Futuristic Chrome</option>
                <option value="Swiss Brutalist">Swiss Typography Brutalism</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Custom Requirements (Optional)</label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Need dark mode React components with responsive charts and custom variable font..."
              className="w-full bg-[#161616] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30"
            />
          </div>

          <button
            onClick={handleConsultAI}
            disabled={isLoading}
            className="w-full py-3.5 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Synthesizing Recommendations...' : 'Consult AI Curator'}</span>
          </button>
        </div>

        {/* AI Output */}
        {recommendation && (
          <div className="pt-4 border-t border-white/10 space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/80 leading-relaxed space-y-1">
              <div className="font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <span>Curator Analysis</span>
              </div>
              <p className="font-light">{recommendation.curatorNote}</p>
            </div>

            {recommendation.recommendedProducts && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50">Matched Digital Assets</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {recommendation.recommendedProducts.map((prod: Product) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        onSelectProduct(prod);
                        onClose();
                      }}
                      className="p-3 rounded-2xl bg-[#161616] border border-white/10 hover:border-white/30 cursor-pointer transition-all flex items-center gap-3 group"
                    >
                      <img src={prod.previewImage} alt="" className="w-12 h-12 rounded-xl object-cover bg-black" />
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-bold text-white group-hover:text-white/80 truncate">{prod.title}</h5>
                        <p className="text-[10px] text-white/40 font-mono-code">${prod.price}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
