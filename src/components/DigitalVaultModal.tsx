import React from 'react';
import { X, Key, Download, ShieldCheck, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { Order } from '../types';

interface DigitalVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const DigitalVaultModal: React.FC<DigitalVaultModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      
      <div className="relative w-full max-w-3xl bg-[#121418] border border-gold-glow rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0b0c0e]">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-serif-luxury text-xl font-bold text-slate-100">
              My Digital License Vault
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-3">
              <Key className="w-12 h-12 text-slate-700 mx-auto stroke-1" />
              <h3 className="text-sm font-semibold text-slate-300">No Licenses Found in Vault</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Once you acquire digital assets, your cryptographic license certificates and instant Node.js download packages will be safely anchored here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-xl bg-[#0b0c0e] border border-white/10 space-y-4 font-mono-code text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Order Reference</div>
                      <div className="text-slate-200 font-bold">{order.id}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Date Issued</div>
                      <div className="text-slate-300 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#D4AF37]" />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Certificate Token</div>
                      <div className="text-[#D4AF37] font-bold">{order.licenseCertificateId}</div>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-[#181b21] border border-white/5 flex flex-wrap items-center justify-between gap-3"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="font-serif-luxury font-bold text-sm text-slate-100 truncate">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-[#D4AF37] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{item.licenseName}</span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Key: {item.downloadKey}
                          </div>
                        </div>

                        <a
                          href={`/api/download/${order.id}/${item.productId}`}
                          download
                          className="px-3.5 py-1.5 rounded-lg bg-[#D4AF37] text-black font-bold text-xs flex items-center gap-1.5 hover:shadow-[0_0_12px_rgba(212,175,55,0.4)] transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download License & Files</span>
                        </a>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                    <span>Issued to: {order.customerName} ({order.customerEmail})</span>
                    <span className="text-[#D4AF37] font-bold">${order.total.toFixed(2)} Paid</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
