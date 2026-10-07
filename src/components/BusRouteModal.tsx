import React from 'react';
import { BusRouteDetail, BusStop } from '../types/transit';
import { X, Clock, MapPin, Bus, ShieldCheck, ArrowRight, ArrowDown } from 'lucide-react';

interface BusRouteModalProps {
  routeDetail: BusRouteDetail;
  selectedStopCode: string;
  onClose: () => void;
  onSelectStopCode: (code: string) => void;
}

export const BusRouteModal: React.FC<BusRouteModalProps> = ({
  routeDetail,
  selectedStopCode,
  onClose,
  onSelectStopCode,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#5B1B6A] text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-white text-[#5B1B6A] px-3 py-1.5 rounded-md font-heading font-extrabold text-2xl tabular-nums shadow-xs">
              {routeDetail.serviceNo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-sm sm:text-base text-white">
                  {routeDetail.origin}
                </span>
                <ArrowRight className="w-4 h-4 text-white/70" />
                <span className="font-heading font-bold text-sm sm:text-base text-white">
                  {routeDetail.destination}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/80 mt-0.5">
                <span>{routeDetail.operator === 'SBST' ? 'SBS Transit' : routeDetail.operator}</span>
                <span>·</span>
                <span>{routeDetail.routeType}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Operating Hours & Headway Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-50 border-b border-slate-200 text-xs">
          <div className="p-2 bg-white rounded border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">First Bus</div>
            <div className="font-heading font-bold text-slate-800 text-sm mt-0.5 tabular-nums">
              {routeDetail.firstBus}
            </div>
          </div>
          <div className="p-2 bg-white rounded border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Bus</div>
            <div className="font-heading font-bold text-slate-800 text-sm mt-0.5 tabular-nums">
              {routeDetail.lastBus}
            </div>
          </div>
          <div className="p-2 bg-white rounded border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Peak Headway</div>
            <div className="font-heading font-bold text-[#EA580C] text-sm mt-0.5 tabular-nums">
              {routeDetail.peakFrequency}
            </div>
          </div>
          <div className="p-2 bg-white rounded border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Off-Peak</div>
            <div className="font-heading font-bold text-slate-700 text-sm mt-0.5 tabular-nums">
              {routeDetail.offPeakFrequency}
            </div>
          </div>
        </div>

        {/* Active Route Stops Ladder */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span>Route Sequence ({routeDetail.stops.length} Stops)</span>
            <span className="text-[11px] text-[#5B1B6A] font-semibold">
              ● Live Buses on Route
            </span>
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {routeDetail.stops.map((stop, idx) => {
              const isSelected = stop.stopCode === selectedStopCode;
              // Check if any bus is currently approaching this stop
              const approachingBus = routeDetail.activeBuses.find(
                (b) => b.stopSequence === stop.sequence
              );

              return (
                <div
                  key={stop.stopCode}
                  onClick={() => onSelectStopCode(stop.stopCode)}
                  className={`group relative flex items-start justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#F6EEF8] border-[#5B1B6A] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Stop Marker Node on Left Stem */}
                  <div
                    className={`absolute -left-6 top-3.5 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                      isSelected
                        ? 'bg-[#5B1B6A] border-white ring-2 ring-[#5B1B6A]'
                        : 'bg-white border-slate-400 group-hover:border-[#5B1B6A]'
                    }`}
                  />

                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-heading font-bold text-xs text-slate-900 group-hover:text-[#5B1B6A]">
                        {stop.stopName}
                      </span>
                      <span className="font-mono text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                        {stop.stopCode}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-bold bg-[#5B1B6A] text-white px-1.5 py-0.2 rounded uppercase">
                          Current Stop
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {stop.roadName} · {stop.distanceKm.toFixed(1)} km
                    </div>

                    {/* MRT interchange tags */}
                    {stop.mrtLines && stop.mrtLines.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        {stop.mrtLines.map((line) => (
                          <span
                            key={line}
                            className="px-1 py-0.2 bg-[#00413B] text-[#42B4A7] font-mono text-[9px] font-extrabold rounded-2xs"
                          >
                            {line}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Active Live Bus Indicator at this stop */}
                  {approachingBus && (
                    <div className="shrink-0 flex items-center gap-1.5 px-2 py-1 bg-[#EA580C] text-white rounded text-[11px] font-bold shadow-xs">
                      <Bus className="w-3.5 h-3.5" />
                      <span>{approachingBus.id}</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          approachingBus.load === 'SEA'
                            ? 'bg-[#16A34A]'
                            : approachingBus.load === 'SDA'
                            ? 'bg-amber-300'
                            : 'bg-red-300'
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Tap any stop to switch arrivals board</span>
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
