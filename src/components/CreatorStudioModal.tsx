import React, { useState } from 'react';
import { X, PlusCircle, Upload, CheckCircle2, FileCode2 } from 'lucide-react';

interface CreatorStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatorStudioModal: React.FC<CreatorStudioModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'ui-kits',
    price: '99',
    tagline: '',
    description: '',
    fileFormats: 'Figma, React, Tailwind',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#111111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-auto p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Sell Digital Asset</h2>
              <p className="text-xs text-white/50">Submit your design systems, fonts, or software to AURA Atelier</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Asset Submitted for Curation</h3>
            <p className="text-xs text-white/50 font-light max-w-xs mx-auto">
              Our studio curation panel will review your cryptographic asset package within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Asset Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Zenith Variable Serif Font"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#161616] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#161616] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white/30"
                >
                  <option value="ui-kits">UI Kits & Systems</option>
                  <option value="fonts">Typography & Fonts</option>
                  <option value="mockups">3D & Render Assets</option>
                  <option value="digital-art">Digital Art</option>
                  <option value="software">Software & Node Code</option>
                  <option value="templates">Design Templates</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Base Price ($ USD)</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-[#161616] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white/30 font-mono-code"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Tagline</label>
              <input
                type="text"
                required
                placeholder="Short 1-sentence headline"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-[#161616] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Included File Formats</label>
              <input
                type="text"
                placeholder="e.g. FIG, WOFF2, TSX, ZIP"
                value={formData.fileFormats}
                onChange={(e) => setFormData({ ...formData, fileFormats: e.target.value })}
                className="w-full bg-[#161616] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30"
              />
            </div>

            <div className="p-6 border-2 border-dashed border-white/10 rounded-2xl text-center space-y-2 bg-[#161616]/50">
              <Upload className="w-6 h-6 text-white/40 mx-auto" />
              <div className="text-xs text-white font-medium">Drop Archive Zip or Figma File</div>
              <div className="text-[10px] text-white/40">Max package file size: 2.5 GB</div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-all shadow-xl"
            >
              Publish to Atelier
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
