import React, { useState } from 'react';
import { X, Key, Download, ShieldCheck, Check, Search, FileCode2 } from 'lucide-react';

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchasedLicenses: any[];
}

export const VaultModal: React.FC<VaultModalProps> = ({
  isOpen,
  onClose,
  purchasedLicenses,
}) => {
  if (!isOpen) return null;

  const [verifyKeyInput, setVerifyKeyInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyKey = async () => {
    if (!verifyKeyInput.trim()) return;
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const res = await fetch(`/api/licenses/verify/${encodeURIComponent(verifyKeyInput.trim())}`);
      const data = await res.json();
      setVerificationResult(data);
    } catch (err) {
      setVerificationResult({ valid: false, error: 'Network error verifying key' });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#111111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-auto p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Digital License Vault</h2>
              <p className="text-xs text-white/50">Manage cryptographically signed licenses & instant Node.js asset downloads</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Key Verification Input Tool */}
        <div className="p-4 rounded-2xl bg-[#161616] border border-white/10 space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>Verify HMAC SHA-256 License Key</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. SHA256-AURA-9823..."
              value={verifyKeyInput}
              onChange={(e) => setVerifyKeyInput(e.target.value)}
              className="flex-1 bg-[#0A0A0A] border border-white/10 rounded-full px-4 py-2 text-xs font-mono-code text-white placeholder-white/20 focus:outline-none focus:border-white/30"
            />
            <button
              onClick={handleVerifyKey}
              disabled={isVerifying}
              className="px-5 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-white/90 transition-all"
            >
              {isVerifying ? 'Checking...' : 'Verify Key'}
            </button>
          </div>

          {verificationResult && (
            <div className={`p-3 rounded-xl border text-xs font-mono-code ${verificationResult.valid ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'}`}>
              {verificationResult.valid ? (
                <div className="space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    <span>VERIFIED AUTHENTIC LICENSE</span>
                  </div>
                  <div>Asset: {verificationResult.license?.productTitle || 'AURA Digital Asset'}</div>
                  <div>Rights: Commercial Unlimited Project License</div>
                </div>
              ) : (
                <div>Key status: {verificationResult.error || 'Invalid or unregistered key token.'}</div>
              )}
            </div>
          )}
        </div>

        {/* Vault Purchased Items List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">Your Active Asset Licenses ({purchasedLicenses.length})</h3>

          {purchasedLicenses.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#161616] border border-white/10 space-y-2">
              <Key className="w-8 h-8 text-white/20 mx-auto" />
              <p className="text-xs text-white/40">No licenses acquired yet. Items purchased in the atelier will automatically appear here with instant download links.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {purchasedLicenses.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#161616] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono-code">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-white font-sans">{item.productTitle || item.title || 'Atelier Asset'}</div>
                    <div className="text-[10px] text-white/50">{item.licenseType || 'Commercial License'}</div>
                    <div className="text-[10px] text-white/70 bg-black px-2 py-0.5 rounded border border-white/10 inline-block">
                      {item.licenseKey}
                    </div>
                  </div>

                  <a
                    href={item.downloadUrl || `/api/download/sample?key=${item.licenseKey}`}
                    download
                    className="px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/90 transition-all font-sans shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Package</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
