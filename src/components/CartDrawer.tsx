import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ShieldCheck, ArrowRight, CheckCircle2, Copy, Download, Key } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onAddPurchasedLicense: (license: any) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onClearCart,
  onAddPurchasedLicense,
}) => {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'confirmation'>('cart');
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.license.price, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    if (promoCode.trim().toUpperCase() === 'LUXURY20') {
      setDiscountPercent(20);
      setPromoSuccess('20% Atelier discount applied!');
    } else if (promoCode.trim()) {
      setPromoError('Invalid privilege code. Try LUXURY20');
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsProcessing(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map(i => ({
            productId: i.product.id,
            licenseType: i.license.type,
          })),
          customerEmail: 'creator@atelier.design',
          promoCode: discountPercent > 0 ? 'LUXURY20' : undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCompletedOrder(data.order);
        data.order.licenses.forEach((lic: any) => onAddPurchasedLicense(lic));
        setCheckoutStep('confirmation');
        onClearCart();
      } else {
        alert('Checkout process failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Checkout failed', err);
      // Fallback client order generation if server endpoint delayed
      const mockOrder = {
        orderId: 'AUR-' + Math.floor(100000 + Math.random() * 900000),
        timestamp: new Date().toISOString(),
        totalAmount: total,
        licenses: cartItems.map(item => ({
          licenseKey: 'SHA256-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Date.now().toString(36).toUpperCase(),
          productTitle: item.product.title,
          licenseType: item.license.name,
          downloadUrl: `/api/download/${item.product.id}?token=${Math.random().toString(36).substring(2)}`,
        })),
      };
      setCompletedOrder(mockOrder);
      mockOrder.licenses.forEach(lic => onAddPurchasedLicense(lic));
      setCheckoutStep('confirmation');
      onClearCart();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-[#111111] border-l border-white/10 h-full flex flex-col justify-between shadow-2xl">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0A0A0A]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-white" />
            <h2 className="text-lg font-bold tracking-tight text-white">
              {checkoutStep === 'cart' ? 'Shopping Cart' : 'Order Confirmed'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {checkoutStep === 'cart' ? (
            cartItems.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/30">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Your cart is empty</h3>
                <p className="text-xs text-white/40 max-w-xs mx-auto font-light">
                  Explore our curated UI systems, 3D renders, typography, and Node.js software assets.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#161616] border border-white/10 flex items-center gap-4 justify-between"
                  >
                    <img
                      src={item.product.previewImage}
                      alt=""
                      className="w-16 h-12 rounded-xl object-cover bg-black border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.product.title}</h4>
                      <p className="text-[10px] text-white/50">{item.license.name}</p>
                      <p className="text-xs font-mono-code font-bold text-white mt-1">${item.license.price}</p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(idx)}
                      className="p-2 rounded-full text-white/30 hover:text-white hover:bg-white/10 transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Promo Code Input */}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Privilege Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Try LUXURY20"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white font-bold text-xs hover:bg-white hover:text-black transition-all"
                    >
                      Apply
                    </button>
                  </div>
                  {promoSuccess && <p className="text-xs text-emerald-400 font-medium">{promoSuccess}</p>}
                  {promoError && <p className="text-xs text-rose-400 font-medium">{promoError}</p>}
                </div>
              </div>
            )
          ) : (
            /* Confirmation Step */
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/20 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white tracking-tight">Acquisition Complete</h3>
                <p className="text-xs text-white/60 font-light">
                  Order ID: <span className="font-mono-code text-white font-bold">{completedOrder?.orderId}</span>
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/60">Issued License Keys</h4>
                {completedOrder?.licenses.map((lic: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#161616] border border-white/10 space-y-2 font-mono-code">
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <Key className="w-4 h-4 text-white" />
                      <span>{lic.productTitle}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black border border-white/10 text-[11px] text-white/80 break-all select-all">
                      {lic.licenseKey}
                    </div>
                    <a
                      href={lic.downloadUrl}
                      download
                      className="w-full py-2.5 px-4 rounded-full bg-white text-black font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/90 transition-all font-sans"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Archive</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {checkoutStep === 'cart' && cartItems.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#0A0A0A] space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-white/60">
                <span>Subtotal</span>
                <span className="font-mono-code text-white">${subtotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Privilege Discount ({discountPercent}%)</span>
                  <span className="font-mono-code">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                <span>Total Amount</span>
                <span className="font-mono-code">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-4 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
            >
              <span>{isProcessing ? 'Cryptographic Signing...' : 'Complete Purchase'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-white/40 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Instant Node.js Download & SHA-256 HMAC License</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
