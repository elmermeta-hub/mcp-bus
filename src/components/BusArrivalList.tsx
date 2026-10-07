import React, { useState, useMemo } from 'react';
import { BusStop, BusServiceTiming } from '../types/transit';
import { BusTimingCard } from './BusTimingCard';
import { Search, X, MapPin, Navigation, Clock, ShieldCheck, Bus, Sparkles } from 'lucide-react';

interface BusArrivalListProps {
  stops: BusStop[];
  selectedStop: BusStop;
  onSelectStop: (stop: BusStop) => void;
  timings: BusServiceTiming[];
  favorites: string[];
  onToggleFavorite: (serviceNo: string) => void;
  onSelectService: (serviceNo: string) => void;
  lastUpdated: Date;
  onOpenLegend: () => void;
}

export const BusArrivalList: React.FC<BusArrivalListProps> = ({
  stops,
  selectedStop,
  onSelectStop,
  timings,
  favorites,
  onToggleFavorite,
  onSelectService,
  lastUpdated,
  onOpenLegend,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'favorites' | 'sbst' | 'urgent'>('all');

  // Filter timings based on tab & query
  const filteredTimings = useMemo(() => {
    return timings.filter((item) => {
      // Tab filter
      if (activeFilterTab === 'favorites' && !favorites.includes(item.serviceNo)) {
        return false;
      }
      if (activeFilterTab === 'sbst' && item.operator !== 'SBST') {
        return false;
      }
      if (activeFilterTab === 'urgent' && item.nextBus && item.nextBus.countdownSeconds > 180) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesService = item.serviceNo.toLowerCase().includes(query);
        const matchesDest = item.destinationName.toLowerCase().includes(query);
        return matchesService || matchesDest;
      }

      return true;
    });
  }, [timings, activeFilterTab, favorites, searchQuery]);

  // Stops matching search for quick drop-down switch
  const matchedStops = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return stops.filter(
      (s) =>
        s.code.includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.roadName.toLowerCase().includes(q) ||
        s.services.some((srv) => srv.toLowerCase() === q)
    );
  }, [stops, searchQuery]);

  return (
    <div className="space-y-4">
      {/* 48px Input Field & Transit Search per Design Spec */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bus stop (e.g. 09023, Orchard, Chinatown) or bus (147, 190)..."
            className="w-full h-12 pl-10 pr-10 bg-[#F8FAFC] border-[1.5px] border-[#E2E8F0] rounded-lg text-sm text-[#111C2D] placeholder-slate-400 focus:outline-none focus:border-[#5B1B6A] focus:ring-3 focus:ring-[#F6EEF8] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Dropdown for Matched Stops if searching */}
        {matchedStops.length > 0 && searchQuery && (
          <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white rounded-lg border border-slate-200 shadow-xl overflow-hidden divide-y divide-slate-100 max-h-64 overflow-y-auto">
            <div className="px-3 py-1.5 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Matching Bus Stops ({matchedStops.length})
            </div>
            {matchedStops.map((stop) => (
              <button
                key={stop.code}
                onClick={() => {
                  onSelectStop(stop);
                  setSearchQuery('');
                }}
                className="w-full px-3.5 py-2.5 text-left hover:bg-[#F6EEF8] transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-xs bg-[#5B1B6A] text-white px-1.5 py-0.5 rounded">
                      {stop.code}
                    </span>
                    <span className="font-semibold text-xs text-[#111C2D]">{stop.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">{stop.roadName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400">
                    {stop.services.length} services
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Bus Stop Identity Banner */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#5B1B6A]/10 text-[#5B1B6A] flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-5 h-5 text-[#5B1B6A]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-heading font-extrabold text-lg sm:text-xl text-[#111C2D]">
                  {selectedStop.name}
                </span>
                <span className="px-2 py-0.5 bg-[#5B1B6A] text-white font-mono font-bold text-xs rounded-md tracking-wider">
                  {selectedStop.code}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedStop.roadName} {selectedStop.interchangeName ? `· ${selectedStop.interchangeName}` : ''}
              </p>
            </div>
          </div>

          {/* MRT Interchanges & Live Update time */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
            {selectedStop.mrtConnections && selectedStop.mrtConnections.length > 0 ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  MRT Link:
                </span>
                {selectedStop.mrtConnections.map((mrt) => (
                  <span
                    key={mrt}
                    className="px-1.5 py-0.5 bg-[#00413B] text-[#42B4A7] font-mono text-[10px] font-extrabold rounded-sm"
                  >
                    {mrt}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-[11px] text-slate-400">Regular Civic Stop</span>
            )}

            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
              <Clock className="w-3 h-3 text-[#EA580C]" />
              <span className="tabular-nums">
                Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stop Switcher Pills */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
            Nearby Hubs:
          </span>
          {stops.map((stop) => (
            <button
              key={stop.code}
              onClick={() => onSelectStop(stop)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-all ${
                selectedStop.code === stop.code
                  ? 'bg-[#5B1B6A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {stop.name.replace(' Stn', '').replace(' Exit A', '').replace(' / Tangs', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Service Selector Segmented Tabs per Design Spec */}
      {/* Container in #F1F5F9 with 8px radius. Active tab slides over with #FFFFFF, subtle shadow, and primary purple text (#5B1B6A), while inactive tabs use #64748B */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-lg w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveFilterTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all ${
              activeFilterTab === 'all'
                ? 'bg-white text-[#5B1B6A] shadow-xs'
                : 'text-[#64748B] hover:text-[#111C2D]'
            }`}
          >
            All Services ({timings.length})
          </button>
          <button
            onClick={() => setActiveFilterTab('favorites')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all ${
              activeFilterTab === 'favorites'
                ? 'bg-white text-[#5B1B6A] shadow-xs'
                : 'text-[#64748B] hover:text-[#111C2D]'
            }`}
          >
            Starred ({favorites.length})
          </button>
          <button
            onClick={() => setActiveFilterTab('sbst')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all ${
              activeFilterTab === 'sbst'
                ? 'bg-white text-[#5B1B6A] shadow-xs'
                : 'text-[#64748B] hover:text-[#111C2D]'
            }`}
          >
            SBS Transit Only
          </button>
          <button
            onClick={() => setActiveFilterTab('urgent')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all ${
              activeFilterTab === 'urgent'
                ? 'bg-white text-[#5B1B6A] shadow-xs'
                : 'text-[#64748B] hover:text-[#111C2D]'
            }`}
          >
            Arriving &lt;3 min
          </button>
        </div>

        {/* Legend trigger */}
        <button
          onClick={onOpenLegend}
          className="hidden sm:flex items-center gap-1 text-xs font-semibold text-[#5B1B6A] hover:text-[#722082] px-2 py-1 rounded hover:bg-[#F6EEF8] transition-colors whitespace-nowrap"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
          LTA Load Legend
        </button>
      </div>

      {/* Bus Arrival Cards Feed */}
      {filteredTimings.length > 0 ? (
        <div className="space-y-2.5">
          {filteredTimings.map((timing) => (
            <BusTimingCard
              key={timing.serviceNo}
              timing={timing}
              isFavorite={favorites.includes(timing.serviceNo)}
              onToggleFavorite={onToggleFavorite}
              onSelectService={onSelectService}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-lg border border-[#E2E8F0] space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-base text-slate-800">No Bus Services Matched</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {activeFilterTab === 'favorites'
                ? 'You have not starred any bus services at this stop yet. Click the star icon on any card to bookmark.'
                : 'Try adjusting your search query or switching to another transit hub.'}
            </p>
          </div>
          {activeFilterTab !== 'all' && (
            <button
              onClick={() => setActiveFilterTab('all')}
              className="px-3.5 py-1.5 bg-[#5B1B6A] text-white text-xs font-semibold rounded-md hover:bg-[#722082] transition-colors"
            >
              Show All Services
            </button>
          )}
        </div>
      )}
    </div>
  );
};
