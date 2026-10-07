import React, { useState } from 'react';
import { CardTransaction } from '../types/transit';
import { X, Plus, CreditCard, ArrowDownRight, ArrowUpRight, CheckCircle2, Smartphone, ShieldCheck } from 'lucide-react';

interface SimplyGoCardModalProps {
  cardBalance: number;
  onTopUp: (amount: number) => void;
  onSimulateTap: (type: 'BUS' | 'MRT', amount: number, name: string) => void;
  transactions: CardTransaction[];
  onClose: () => void;
}

export const SimplyGoCardModal: React.FC<SimplyGoCardModalProps> = ({
  cardBalance,
  onTopUp,
  onSimulateTap,
  transactions,
  onClose,
}) => {
  const [tapSuccessMsg, setTapSuccessMsg] = useState<string | null>(null);

  const handleTap = (type: 'BUS' | 'MRT', amount: number, name: string) => {
    onSimulateTap(type, amount, name);
    setTapSuccessMsg(`Tapped: Paid $${amount.toFixed(2)} SGD on ${name}`);
    setTimeout(() => {
      setTapSuccessMsg(null);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-[#5B1B6A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#EA580C]" />
            <h3 className="font-heading font-extrabold text-base text-white">
              SimplyGo / EZ-Link Transit Wallet
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 overflow-y-auto space-y-5">
          {/* Visual Contactless Card Mockup with Authentic Generated Photo Asset */}
          <div className="relative rounded-xl overflow-hidden shadow-md border border-slate-200 aspect-[1.586/1] bg-gradient-to-br from-[#410050] via-[#5B1B6A] to-[#EA580C] text-white p-5 flex flex-col justify-between">
            <img
              src="/src/assets/images/sg_ezlink_transit_card_1791350615047.jpg"
              alt="EZ Link Transit Card"
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
              referrerPolicy="no-referrer"
            />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className="font-heading font-extrabold text-lg tracking-wider">
                  SimplyGo SG
                </span>
                <p className="text-[10px] text-white/70">Contactless Transit Account</p>
              </div>
              <div className="px-2 py-0.5 bg-white/20 backdrop-blur-xs rounded text-[10px] font-bold tracking-widest uppercase">
                Adult Standard
              </div>
            </div>

            <div className="relative z-10 my-auto">
              <div className="text-[11px] text-white/80 uppercase tracking-wider font-semibold">
                Available Card Balance
              </div>
              <div className="font-heading font-extrabold text-3xl sm:text-4xl tabular-nums text-white mt-0.5 drop-shadow-xs">
                ${cardBalance.toFixed(2)}{' '}
                <span className="text-sm font-normal text-white/80">SGD</span>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between text-xs text-white/90">
              <span className="font-mono tracking-widest">•••• •••• •••• 0312</span>
              <span className="font-mono text-[11px]">EXP 10/29</span>
            </div>
          </div>

          {/* Tap Success Feedback Alert */}
          {tapSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>{tapSuccessMsg}</span>
            </div>
          )}

          {/* Quick Top-Up Strip */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Instant Top-Up (PayNow / FAST)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onTopUp(10)}
                className="py-2.5 px-3 rounded-lg border border-[#5B1B6A] bg-[#F6EEF8] hover:bg-[#5B1B6A] hover:text-white text-[#5B1B6A] font-heading font-bold text-xs transition-colors flex items-center justify-center gap-1 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+$10.00</span>
              </button>
              <button
                onClick={() => onTopUp(20)}
                className="py-2.5 px-3 rounded-lg border border-[#5B1B6A] bg-[#F6EEF8] hover:bg-[#5B1B6A] hover:text-white text-[#5B1B6A] font-heading font-bold text-xs transition-colors flex items-center justify-center gap-1 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+$20.00</span>
              </button>
              <button
                onClick={() => onTopUp(50)}
                className="py-2.5 px-3 rounded-lg border border-[#EA580C] bg-[#FFF4ED] hover:bg-[#EA580C] hover:text-white text-[#EA580C] font-heading font-bold text-xs transition-colors flex items-center justify-center gap-1 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+$50.00</span>
              </button>
            </div>
          </div>

          {/* Quick Simulator: Tap into Transit */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Simulator: Fare Gantry Tap-In / Tap-Out
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleTap('BUS', 1.29, 'SBS Transit 147')}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors active:scale-95"
              >
                <div className="font-heading font-bold text-slate-900">Tap on Bus 147</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Deducts $1.29 (Trunk)</div>
              </button>

              <button
                onClick={() => handleTap('MRT', 1.58, 'Dhoby Ghaut Interchange')}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors active:scale-95"
              >
                <div className="font-heading font-bold text-slate-900">Tap at MRT Gantry</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Deducts $1.58 (Rail)</div>
              </button>
            </div>
          </div>

          {/* Recent Transit Transactions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Recent Fare Deductions ({transactions.length})
              </span>
              <span className="text-[11px] text-slate-400">Auto-synced</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-lg p-2 bg-slate-50">
              {transactions.map((tx) => (
                <div key={tx.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        tx.amountSgd > 0
                          ? 'bg-emerald-100 text-[#16A34A]'
                          : 'bg-purple-100 text-[#5B1B6A]'
                      }`}
                    >
                      {tx.amountSgd > 0 ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{tx.serviceOrStation}</div>
                      <div className="text-[10px] text-slate-400">
                        {tx.entryPoint} → {tx.exitPoint} · {tx.timestamp}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-heading font-bold tabular-nums ${
                        tx.amountSgd > 0 ? 'text-[#16A34A]' : 'text-slate-800'
                      }`}
                    >
                      {tx.amountSgd > 0 ? `+$${tx.amountSgd.toFixed(2)}` : `-$${Math.abs(tx.amountSgd).toFixed(2)}`}
                    </div>
                    <div className="text-[10px] text-slate-400 tabular-nums">
                      Bal ${tx.balanceAfterSgd.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span>Secured via LTA SimplyGo Gateway</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#5B1B6A] text-white font-semibold rounded-md hover:bg-[#722082] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
