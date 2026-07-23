import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Copy, 
  Download, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  FileCode2, 
  Type as TypeIcon, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Info 
} from 'lucide-react';
import { Product, LicenseOption } from '../types';

interface ProductInspectorModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedLicense: LicenseOption) => void;
}

export const ProductInspectorModal: React.FC<ProductInspectorModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedLicense, setSelectedLicense] = useState<LicenseOption>(
    product.licenses[0] || {
      type: 'personal',
      name: 'Personal License',
      price: product.price,
      description: 'Standard usage rights.',
      rights: ['1 Active Project'],
    }
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  // Font Live Sandbox State
  const [customFontText, setCustomFontText] = useState(
    product.sampleContent?.fontData?.sampleText || 'AURA HAUTE COUTURE ATELIER MMXXVI'
  );
  const [fontSize, setFontSize] = useState(36);
  const [fontUppercase, setFontUppercase] = useState(true);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      
      <div className="relative w-full max-w-5xl bg-[#111111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Header Modal Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0A0A0A]">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-[10px] font-bold uppercase tracking-widest">
              {product.categoryLabel}
            </span>
            <span className="text-xs text-white/50 font-mono-code">{product.version}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          
          {/* Top Main Section: Image Gallery & Primary Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Image Gallery Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-[16/10] border border-white/10">
                <img
                  src={product.galleryImages[activeImageIndex] || product.previewImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Gallery Thumbnails */}
              {product.galleryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {product.galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                        activeImageIndex === idx ? 'border-white' : 'border-transparent opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Meta Column */}
            <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
                  <img
                    src={product.author.avatar}
                    alt={product.author.name}
                    className="w-6 h-6 rounded-full object-cover border border-white/20"
                  />
                  <span className="font-semibold text-white">{product.author.name}</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/50">{product.author.studio}</span>
                  {product.author.verified && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight tracking-tight">
                  {product.title}
                </h2>

                <p className="text-xs sm:text-sm text-white/60 mt-3 leading-relaxed font-light">
                  {product.description}
                </p>

                {/* Rating & Stats */}
                <div className="flex items-center gap-4 mt-4 text-xs text-white/50 py-2 border-y border-white/10">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-white fill-white" />
                    <span className="font-bold text-white">{product.rating}</span>
                    <span>({product.reviewsCount} reviews)</span>
                  </div>
                  <span>•</span>
                  <div>
                    <span className="font-bold text-white">{product.downloadsCount}</span> downloads
                  </div>
                </div>
              </div>

              {/* License Option Selector */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/60 flex items-center justify-between">
                  <span>Select License Tier</span>
                  <span className="text-[10px] text-white/40 font-normal">SHA-256 HMAC Verified</span>
                </label>

                <div className="space-y-2">
                  {product.licenses.map((lic) => {
                    const isSelected = selectedLicense.type === lic.type;
                    return (
                      <div
                        key={lic.type}
                        onClick={() => setSelectedLicense(lic)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-white/10 border-white shadow-lg'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-xs text-white flex items-center gap-2">
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-white bg-white' : 'border-white/40'}`}>
                              {isSelected && <Check className="w-2.5 h-2.5 text-black" />}
                            </div>
                            <span>{lic.name}</span>
                          </div>
                          <span className="font-mono-code font-bold text-sm text-white">
                            ${lic.price}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/50 mt-1 pl-5 font-light">
                          {lic.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Buy Button */}
                <button
                  onClick={() => {
                    onAddToCart(product, selectedLicense);
                    onClose();
                  }}
                  className="w-full py-3.5 px-6 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-xl"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Acquire License — ${selectedLicense.price}</span>
                </button>
              </div>

            </div>

          </div>

          {/* INTERACTIVE ASSET SANDBOX / SPECIFIC PREVIEW */}
          {product.category === 'fonts' && product.sampleContent?.fontData && (
            <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest">
                  <TypeIcon className="w-4 h-4" />
                  <span>Interactive Font Specimen Tester</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/60">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fontUppercase}
                      onChange={(e) => setFontUppercase(e.target.checked)}
                      className="rounded border-white/20 bg-black text-white"
                    />
                    <span>All Caps</span>
                  </label>
                  <span>Size: {fontSize}px</span>
                  <input
                    type="range"
                    min={18}
                    max={72}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-24 accent-white"
                  />
                </div>
              </div>

              <input
                type="text"
                value={customFontText}
                onChange={(e) => setCustomFontText(e.target.value)}
                className="w-full bg-[#161616] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white/30"
                placeholder="Type custom specimen string..."
              />

              <div className="p-6 rounded-xl bg-[#161616] border border-white/10 overflow-x-auto text-center min-h-[100px] flex items-center justify-center">
                <div 
                  style={{ fontSize: `${fontSize}px` }} 
                  className={`font-serif-editorial text-white tracking-wider leading-tight transition-all ${
                    fontUppercase ? 'uppercase' : ''
                  }`}
                >
                  {customFontText || 'Type something to test font...'}
                </div>
              </div>
            </div>
          )}

          {/* CODE INSPECTOR FOR SOFTWARE & CODE RESOURCES */}
          {product.sampleContent?.codeSnippet && (
            <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/10 space-y-3 font-mono-code">
              <div className="flex items-center justify-between text-xs text-white/60 border-b border-white/10 pb-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <FileCode2 className="w-4 h-4" />
                  <span>{product.sampleContent.codeSnippet.title}</span>
                </div>
                <button
                  onClick={() => handleCopyCode(product.sampleContent!.codeSnippet!.code)}
                  className="flex items-center gap-1 text-[11px] px-3 py-1 rounded-full bg-white/10 hover:bg-white hover:text-black text-white transition-all"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="text-xs text-white/80 overflow-x-auto p-4 bg-[#161616] rounded-xl leading-relaxed border border-white/5">
                <code>{product.sampleContent.codeSnippet.code}</code>
              </pre>
            </div>
          )}

          {/* UI KIT COMPONENT PREVIEWER */}
          {product.sampleContent?.uiKitComponents && (
            <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/10 space-y-4">
              <div className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>UI Kit Live Render Sample Components</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {product.sampleContent.uiKitComponents.map((comp, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#161616] border border-white/10 space-y-3">
                    <div className="text-xs font-bold text-white">{comp.name}</div>
                    <div className="p-3 rounded-xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center min-h-[60px]">
                      {comp.previewType === 'button' && (
                        <button className="px-5 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-white/90">
                          Sleek Pill Button
                        </button>
                      )}
                      {comp.previewType === 'card' && (
                        <div className="text-center">
                          <div className="text-sm font-bold text-white">$1,480,000</div>
                          <div className="text-[10px] text-white/40">Net Atelier Revenue</div>
                        </div>
                      )}
                      {comp.previewType === 'badge' && (
                        <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-mono-code font-bold">
                          AURA-VERIFIED
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-white/40 leading-snug font-light">{comp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Specifications Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 flex items-center gap-2">
              <Info className="w-4 h-4 text-white" />
              <span>Technical Specifications & Metadata</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="p-3 rounded-2xl bg-[#0A0A0A] border border-white/10">
                  <div className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">{key}</div>
                  <div className="font-medium text-white mt-0.5">{val}</div>
                </div>
              ))}
              <div className="p-3 rounded-2xl bg-[#0A0A0A] border border-white/10">
                <div className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">File Size</div>
                <div className="font-medium text-white mt-0.5">{product.fileSize}</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#0A0A0A] border border-white/10">
                <div className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">Included Formats</div>
                <div className="font-medium text-white mt-0.5">{product.fileFormats.join(', ')}</div>
              </div>
            </div>
          </div>

          {/* Rights Granted List */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Rights Granted for "{selectedLicense.name}"</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/70 pt-1">
              {selectedLicense.rights.map((r, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
