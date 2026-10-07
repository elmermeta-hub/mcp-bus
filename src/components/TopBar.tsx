import React from 'react';
import { RefreshCw, MapPin, Zap, Info, CreditCard } from 'lucide-react';

interface TopBarProps {
  activeTab: 'arrivals' | 'map' | 'mrt' | 'journey' | 'card';
  setActiveTab: (tab: 'arrivals' | 'map' | 'mrt' | 'journey' | 'card') => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenLegend: () => void;
  onOpenCardModal: () => void;
  cardBalance: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  onRefresh,
  isRefreshing,
  onOpenLegend,
  onOpenCardModal,
  cardBalance,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#5B1B6A] text-white shadow-md">
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title, one line wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#EA580C] flex items-center justify-center font-bold text-base shadow-sm">
            SG
          </div>
          <span className="font-heading font-extrabold text-base sm:text-lg tracking-tight text-white whitespace-nowrap">
            Civic Transit Pulse
          </span>
        </div>

        {/* Zone 2: Clean nav links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setActiveTab('arrivals')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'arrivals'
                ? 'bg-white/15 text-white shadow-xs'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Bus Arrivals
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'map'
                ? 'bg-white/15 text-white shadow-xs'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Interchange Radar
          </button>
          <button
            onClick={() => setActiveTab('mrt')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'mrt'
                ? 'bg-white/15 text-white shadow-xs'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            MRT Network
          </button>
          <button
            onClick={() => setActiveTab('journey')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'journey'
                ? 'bg-white/15 text-white shadow-xs'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Journey & Fare
          </button>
          <button
            onClick={() => setActiveTab('card')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'card'
                ? 'bg-white/15 text-white shadow-xs'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            SimplyGo Card
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Refresh, Balance Pill, Legend trigger) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenCardModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#EA580C] hover:bg-[#F58220] active:scale-95 transition-all text-white text-xs font-semibold rounded-md shadow-xs whitespace-nowrap"
            title="View SimplyGo Card Balance"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">EZ-Link:</span>
            <span className="tabular-nums font-bold font-mono">${cardBalance.toFixed(2)}</span>
          </button>

          <button
            onClick={onOpenLegend}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            title="LTA Occupancy Legend & Accessibility Guide"
            aria-label="Occupancy Legend"
          >
            <Info className="w-4 h-4" />
          </button>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors active:scale-90"
            title="Refresh Real-Time Timings"
            aria-label="Refresh Timings"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-300' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
