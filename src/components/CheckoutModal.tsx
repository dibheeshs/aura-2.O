import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  CheckCircle2, 
  Download, 
  ShieldCheck, 
  Lock, 
  Key, 
  Sparkles, 
  ArrowRight, 
  FileText 
} from 'lucide-react';
import { CartItem, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  voucherCode: string;
  onClearCart: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  voucherCode,
  onClearCart,
  onOrderCompleted,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('Alexander Wright');
  const [customerEmail, setCustomerEmail] = useState('alexander.wright@luxury.atelier');
  const [paymentMethod, setPaymentMethod] = useState('Instant Atelier Pay (Apple Pay / Card)');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.selectedLicense.price * item.quantity, 0);
  const isDiscountApplied = voucherCode.toUpperCase().trim() === 'LUXURY20';
  const discount = isDiscountApplied ? subtotal * 0.2 : 0;
  const total = Math.max(0, subtotal - discount);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail || !customerName) {
      setErrorMsg('Please enter your full name and email address.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          items: cartItems.map(i => ({
            productId: i.product.id,
            selectedLicenseType: i.selectedLicense.type,
          })),
          voucherCode,
          paymentMethod,
        }),
      });

      const resData = await response.json();

      if (resData.success && resData.order) {
        setCompletedOrder(resData.order);
        onOrderCompleted(resData.order);
        onClearCart();
      } else {
        setErrorMsg(resData.error || 'Failed to authenticate transaction.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMsg('Network error while communicating with Node Atelier server.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      
      <div className="relative w-full max-w-2xl bg-[#121418] border border-gold-glow rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0b0c0e]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-serif-luxury text-xl font-bold text-slate-100">
              {completedOrder ? 'Purchase & License Receipt' : 'Secure Atelier Checkout'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {completedOrder ? (
            /* SUCCESS CONFIRMATION STATE */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(212,175,55,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-serif-luxury text-2xl font-bold text-slate-100">
                  Transaction Authenticated
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Cryptographic license keys issued & registered in your Digital Vault.
                </p>
              </div>

              {/* Order Manifest Summary Box */}
              <div className="p-5 rounded-xl bg-[#0b0c0e] border border-white/10 text-left space-y-3 font-mono-code text-xs">
                <div className="flex justify-between text-slate-400 pb-2 border-b border-white/5">
                  <span>Order ID: <strong className="text-slate-200">{completedOrder.id}</strong></span>
                  <span>Certificate ID: <strong className="text-[#D4AF37]">{completedOrder.licenseCertificateId}</strong></span>
                </div>

                <div className="space-y-2 pt-1">
                  {completedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded bg-[#181b21] border border-white/5">
                      <div>
                        <div className="text-slate-200 font-bold font-serif-luxury text-sm">{item.title}</div>
                        <div className="text-[10px] text-[#D4AF37]">{item.licenseName}</div>
                        <div className="text-[10px] text-slate-500 font-mono-code mt-0.5">SHA Token: {item.downloadKey}</div>
                      </div>

                      <a
                        href={`/api/download/${completedOrder.id}/${item.productId}`}
                        download
                        className="px-3 py-1.5 rounded bg-gradient-to-r from-[#D4AF37] to-[#9A7B38] text-black font-bold text-xs flex items-center gap-1.5 hover:scale-105 transition-transform"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Asset</span>
                      </a>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-slate-300 pt-2 border-t border-white/5 font-bold">
                  <span>Total Paid</span>
                  <span className="text-[#D4AF37]">${completedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold uppercase tracking-wider"
                >
                  Return to Atelier
                </button>
              </div>
            </div>
          ) : (
            /* CHECKOUT FORM STATE */
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* Customer Contact */}
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Patron & Licensee Identity
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500">Full Name / Organization</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#0b0c0e] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500">License Delivery Email</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-[#0b0c0e] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Privilege Payment Authorization
                </label>
                <div className="space-y-2">
                  {[
                    'Instant Atelier Pay (Apple Pay / Credit Card)',
                    'Cryptographic Web3 Wallet (USDC / ETH)',
                    'Atelier VIP Corporate Account',
                  ].map((method) => (
                    <label
                      key={method}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer text-xs transition-all ${
                        paymentMethod === method
                          ? 'bg-[#1c1a12] border-[#D4AF37] text-slate-100 font-medium'
                          : 'bg-[#0b0c0e] border-white/5 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === method}
                          onChange={() => setPaymentMethod(method)}
                          className="accent-[#D4AF37]"
                        />
                        <span>{method}</span>
                      </div>
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Manifest Summary */}
              <div className="p-4 rounded-xl bg-[#0b0c0e] border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Selected Assets ({cartItems.length})</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {isDiscountApplied && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Privilege Voucher (LUXURY20)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-100 font-bold text-sm pt-2 border-t border-white/10">
                  <span>Total Amount Authorized</span>
                  <span className="text-[#D4AF37] font-mono-code">${total.toFixed(2)}</span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#C5A028] text-black font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-black" />
                    <span>Generating SHA-256 License Keys...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>Confirm Order & Issue License Keys — ${total.toFixed(2)}</span>
                  </>
                )}
              </button>

            </form>
          )}

        </div>

      </div>

    </div>
  );
};
