import React from 'react';
import { X, ShieldCheck, Info } from 'lucide-react';

interface CrowdLegendModalProps {
  onClose: () => void;
}

export const CrowdLegendModal: React.FC<CrowdLegendModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#5B1B6A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            <h3 className="font-heading font-extrabold text-base text-white">
              LTA Real-Time Operational Standards
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto text-xs text-slate-700">
          <div>
            <h4 className="font-heading font-bold text-sm text-[#111C2D] mb-1">
              Passenger Load Capacity Tiers
            </h4>
            <p className="text-slate-500 mb-3">
              Standardized Land Transport Authority (LTA) passenger occupancy indicators live-calculated via contactless fare gantry taps.
            </p>

            <div className="space-y-2.5">
              {/* Green */}
              <div className="flex items-start gap-3 p-3 rounded-lg border-2 border-[#16A34A] bg-[#16A34A]/10">
                <span className="w-3.5 h-3.5 rounded-full bg-[#16A34A] shrink-0 mt-0.5" />
                <div>
                  <div className="font-heading font-bold text-sm text-[#16A34A]">
                    Seats Available (SEA)
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    Seated capacity remains open on upper/lower deck. Commuters will easily find a seat.
                  </p>
                </div>
              </div>

              {/* Amber */}
              <div className="flex items-start gap-3 p-3 rounded-lg border-2 border-[#D97706] bg-[#D97706]/10">
                <span className="w-3.5 h-3.5 rounded-full bg-[#D97706] shrink-0 mt-0.5" />
                <div>
                  <div className="font-heading font-bold text-sm text-[#D97706]">
                    Standing Space Available (SDA)
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    Most or all seats occupied, but comfortable standing space is available along the lower deck aisle.
                  </p>
                </div>
              </div>

              {/* Red */}
              <div className="flex items-start gap-3 p-3 rounded-lg border-2 border-[#DC2626] bg-[#DC2626]/10">
                <span className="w-3.5 h-3.5 rounded-full bg-[#DC2626] shrink-0 mt-0.5" />
                <div>
                  <div className="font-heading font-bold text-sm text-[#DC2626]">
                    Limited Standing (LSD)
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    Bus is heavily packed. Only very limited standing space remains; boarding may be restricted at peak interchanges.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <h4 className="font-heading font-bold text-sm text-[#111C2D] mb-2">
              Vehicle Accessibility & Fleet Badges
            </h4>

            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-[#0284C7] flex items-center justify-center text-white shrink-0">
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="4" r="2" />
                    <path d="M7 11.5a5 5 0 0 1 7-4.5" />
                    <path d="M12 9v6l3 4" />
                    <path d="M10 17a5 5 0 1 1-5-5" />
                  </svg>
                </div>
                <div>
                  <span className="font-bold text-slate-800">WAB (Wheelchair Accessible Bus)</span>
                  <p className="text-[11px] text-slate-500">
                    Equipped with automated boarding ramp and priority dedicated wheelchair space.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="px-2 py-0.5 bg-[#5B1B6A] text-white font-heading font-bold text-xs rounded">
                  DD
                </span>
                <div>
                  <span className="font-bold text-slate-800">Double Decker Fleet</span>
                  <p className="text-[11px] text-slate-500">
                    High capacity two-story vehicle (e.g. Volvo B9TL / MAN A95) accommodating up to 132 commuters.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-3 h-3 rounded-full bg-[#EA580C] animate-live-pulse ml-1" />
                <div>
                  <span className="font-bold text-slate-800">Pulsing Telemetry Dot</span>
                  <p className="text-[11px] text-slate-500">
                    Indicates bus is currently arriving within 2 minutes of the berth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#5B1B6A] text-white font-semibold rounded-md hover:bg-[#722082] transition-colors text-xs"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
