import React from 'react';
import { Star, Download, Eye, ShoppingBag, CheckCircle2, FileCode2 } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onInspect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isInCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onInspect,
  onAddToCart,
  isInCart = false,
}) => {
  return (
    <div className="group relative bg-[#111111] rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      
      {/* Image Thumbnail Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-black">
        <img
          src={product.previewImage}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />

        {/* Overlay Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className="px-3 py-1 rounded-full bg-[#050505]/90 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold tracking-widest uppercase">
            {product.categoryLabel}
          </span>
          {product.featured && (
            <span className="px-3 py-1 rounded-full bg-white text-black text-[10px] font-bold tracking-widest uppercase shadow-md">
              Featured
            </span>
          )}
        </div>

        {/* Quick Action Overlay Button */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
          <button
            onClick={() => onInspect(product)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs hover:bg-white/90 transition-all shadow-xl hover:scale-105"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Inspect Asset</span>
          </button>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          {/* Author info */}
          <div className="flex items-center gap-2 text-xs text-white/50">
            <img
              src={product.author.avatar}
              alt={product.author.name}
              className="w-5 h-5 rounded-full object-cover border border-white/20"
            />
            <span className="truncate">{product.author.studio}</span>
            {product.author.verified && (
              <CheckCircle2 className="w-3.5 h-3.5 text-white/80 flex-shrink-0" />
            )}
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onInspect(product)}
            className="text-lg font-bold text-white group-hover:text-white/80 transition-colors cursor-pointer line-clamp-1 tracking-tight"
          >
            {product.title}
          </h3>

          {/* Tagline */}
          <p className="text-xs text-white/40 line-clamp-2 leading-relaxed font-light">
            {product.tagline}
          </p>
        </div>

        {/* Formats Tags */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          {product.fileFormats.map((fmt) => (
            <span
              key={fmt}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono-code text-white/70"
            >
              <FileCode2 className="w-2.5 h-2.5 text-white/50" />
              {fmt}
            </span>
          ))}
          <span className="text-[10px] text-white/30 ml-auto">{product.fileSize}</span>
        </div>

        {/* Footer Rating & Price */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-white fill-white" />
            <span className="text-xs font-bold text-white">{product.rating.toFixed(2)}</span>
            <span className="text-[10px] text-white/40">({product.reviewsCount})</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[9px] text-white/40 uppercase tracking-widest font-semibold">Price</div>
              <div className="text-base font-bold text-white font-mono-code">
                ${product.price}
              </div>
            </div>

            <button
              onClick={() => onAddToCart(product)}
              className={`p-2.5 rounded-full border transition-all ${
                isInCart
                  ? 'bg-white text-black border-white'
                  : 'bg-white/5 hover:bg-white hover:text-black border-white/20 text-white'
              }`}
              title={isInCart ? 'In Cart' : 'Add to Cart'}
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
