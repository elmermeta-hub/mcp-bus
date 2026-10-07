import React from 'react';
import { BusServiceTiming, NextBus, CrowdLevel } from '../types/transit';
import { Star, ChevronRight, Bus } from 'lucide-react';

interface BusTimingCardProps {
  timing: BusServiceTiming;
  isFavorite: boolean;
  onToggleFavorite: (serviceNo: string) => void;
  onSelectService: (serviceNo: string) => void;
}

// Convert seconds remaining to display text ('Arr', '1 min', '12 min')
const formatArrivalCountdown = (seconds: number): string => {
  if (seconds <= 30) return 'Arr';
  if (seconds <= 90) return '1 min';
  const mins = Math.ceil(seconds / 60);
  return `${mins} min`;
};

// Map LTA load to color styles
const getCrowdColorClasses = (load: CrowdLevel) => {
  switch (load) {
    case 'SEA':
      return {
        border: 'border-[#16A34A]',
        text: 'text-[#16A34A]',
        bg: 'bg-[#16A34A]/10',
        dot: 'bg-[#16A34A]',
        label: 'Seats Avail',
      };
    case 'SDA':
      return {
        border: 'border-[#D97706]',
        text: 'text-[#D97706]',
        bg: 'bg-[#D97706]/10',
        dot: 'bg-[#D97706]',
        label: 'Standing Avail',
      };
    case 'LSD':
    default:
      return {
        border: 'border-[#DC2626]',
        text: 'text-[#DC2626]',
        bg: 'bg-[#DC2626]/10',
        dot: 'bg-[#DC2626]',
        label: 'Limited Standing',
      };
  }
};

export const BusTimingCard: React.FC<BusTimingCardProps> = ({
  timing,
  isFavorite,
  onToggleFavorite,
  onSelectService,
}) => {
  const { serviceNo, destinationName, nextBus, nextBus2, nextBus3, routeCategory } = timing;

  const renderArrivalBubble = (bus?: NextBus, isNext = false) => {
    if (!bus) {
      return (
        <div className="flex flex-col items-center justify-center min-w-[70px] sm:min-w-[78px] h-12 px-2.5 rounded-full border border-dashed border-slate-200 bg-slate-50 text-slate-400">
          <span className="text-xs font-medium">--</span>
        </div>
      );
    }

    const { border, text, bg, dot, label } = getCrowdColorClasses(bus.load);
    const timeDisplay = formatArrivalCountdown(bus.countdownSeconds);
    const isArrivingSoon = bus.countdownSeconds <= 120; // within 2 minutes

    return (
      <div
        className={`relative flex flex-col items-center justify-center min-w-[72px] sm:min-w-[80px] h-12 px-2.5 rounded-full border-2 ${border} ${bg} transition-transform active:scale-95`}
        title={`Status: ${label} (${bus.type === 'DD' ? 'Double Decker' : 'Single Decker'}${bus.feature === 'WAB' ? ', Wheelchair Accessible' : ''})`}
      >
        <div className="flex items-center gap-1.5">
          {/* 6px status dot inside the badge pulsing slowly if bus is currently arriving within 2 minutes */}
          <span
            className={`w-1.5 h-1.5 rounded-full ${dot} ${
              isArrivingSoon ? 'animate-live-pulse ring-2 ring-offset-1 ring-current' : ''
            }`}
          />
          <span className={`font-heading font-bold text-sm sm:text-base tabular-nums leading-none ${text}`}>
            {timeDisplay}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-[10px] uppercase font-bold tracking-tight text-slate-500 tabular-nums">
            {bus.type === 'DD' ? 'DD' : 'SD'}
          </span>
          {bus.feature === 'WAB' && (
            <span className="text-[9px] font-bold text-[#0284C7]">WAB</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      onClick={() => onSelectService(serviceNo)}
      className="group relative bg-white rounded-lg border border-[#E2E8F0] p-3 sm:p-4 hover:border-[#5B1B6A]/40 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        {/* Left Side: Bus Number Badge, Destination, WAB indicator, Operator */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Prominent Bus Route Plate in Solid SBS Imperial Purple */}
          <div className="shrink-0 flex items-center justify-center bg-[#5B1B6A] group-hover:bg-[#722082] text-white px-3 py-1.5 rounded-md min-w-[68px] sm:min-w-[76px] h-11 shadow-xs transition-colors">
            <span className="font-heading font-extrabold text-xl sm:text-2xl tabular-nums tracking-tight">
              {serviceNo}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <span className="font-bold text-[11px] tracking-wider uppercase text-slate-600">
                TO {destinationName}
              </span>
              {routeCategory === 'EXPRESS' && (
                <span className="px-1.5 py-0.2 bg-[#EA580C]/10 text-[#EA580C] text-[10px] font-extrabold rounded-sm uppercase tracking-wider">
                  Express
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1">
              {/* 24x24px compact accessibility pill with white wheelchair symbol */}
              {nextBus?.feature === 'WAB' && (
                <div
                  className="w-6 h-6 rounded-full bg-[#0284C7] flex items-center justify-center text-white shrink-0 shadow-2xs"
                  title="Wheelchair-Accessible Bus (WAB)"
                >
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
              )}

              <span className="text-xs text-slate-500 font-medium">
                Operated by {timing.operator === 'SBST' ? 'SBS Transit' : timing.operator}
              </span>

              <span className="hidden sm:inline text-slate-300">·</span>
              <span className="hidden sm:inline text-xs text-[#5B1B6A] font-semibold group-hover:underline">
                View Route & Radar
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Up to 3 Sequential Arrival Bubbles & Favorite Action */}
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {renderArrivalBubble(nextBus, true)}
            {renderArrivalBubble(nextBus2)}
            {renderArrivalBubble(nextBus3)}
          </div>

          <div className="flex items-center gap-1 ml-1 sm:ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(serviceNo);
              }}
              className={`p-2 rounded-lg transition-colors ${
                isFavorite
                  ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                  : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorite buses'}
              aria-label="Toggle Favorite"
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-500' : ''}`} />
            </button>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#5B1B6A] group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
};
