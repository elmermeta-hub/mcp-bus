import React, { useState } from 'react';
import { BusStop, JourneyOption } from '../types/transit';
import { ArrowLeftRight, Clock, DollarSign, Footprints, Bus, Train, CheckCircle2, ChevronRight } from 'lucide-react';

interface JourneyPlannerProps {
  stops: BusStop[];
  onSelectService: (serviceNo: string) => void;
}

export const JourneyPlanner: React.FC<JourneyPlannerProps> = ({ stops, onSelectService }) => {
  const [originStopCode, setOriginStopCode] = useState('09023'); // Orchard
  const [destStopCode, setDestStopCode] = useState('05049'); // Chinatown
  const [concessionTier, setConcessionTier] = useState<'adult' | 'student' | 'senior'>('adult');
  const [selectedOptionId, setSelectedOptionId] = useState('opt_1');

  const originStop = stops.find((s) => s.code === originStopCode) || stops[0];
  const destStop = stops.find((s) => s.code === destStopCode) || stops[2];

  const handleSwapStops = () => {
    const temp = originStopCode;
    setOriginStopCode(destStopCode);
    setDestStopCode(temp);
  };

  // Mock computed journey routes
  const journeyOptions: JourneyOption[] = [
    {
      id: 'opt_1',
      title: 'Fastest: Direct Trunk Bus 190 / 143',
      totalDurationMin: 14,
      fareAdultSgd: 1.29,
      fareStudentSgd: 0.64,
      fareSeniorSgd: 0.72,
      walkingDistanceM: 180,
      caloriesKcal: 42,
      legs: [
        { type: 'WALK', from: 'Current Location', to: `${originStop.name} (${originStop.code})`, durationMin: 2 },
        { type: 'BUS', lineOrService: '190', from: originStop.name, to: destStop.name, durationMin: 10, stopsCount: 4, load: 'SDA' },
        { type: 'WALK', from: `${destStop.name} (${destStop.code})`, to: 'Destination Hub', durationMin: 2 },
      ],
    },
    {
      id: 'opt_2',
      title: 'North-South Line to North-East Line via Dhoby Ghaut',
      totalDurationMin: 16,
      fareAdultSgd: 1.34,
      fareStudentSgd: 0.67,
      fareSeniorSgd: 0.76,
      walkingDistanceM: 260,
      caloriesKcal: 58,
      legs: [
        { type: 'MRT', lineOrService: 'NSL', from: 'Orchard (NS22)', to: 'Dhoby Ghaut (NS24)', durationMin: 4 },
        { type: 'MRT', lineOrService: 'NEL', from: 'Dhoby Ghaut (NE6)', to: 'Chinatown (NE4)', durationMin: 6 },
        { type: 'WALK', from: 'Chinatown Exit E', to: 'Destination Hub', durationMin: 2 },
      ],
    },
    {
      id: 'opt_3',
      title: 'Scenic Trunk: SBS Transit Bus 147',
      totalDurationMin: 19,
      fareAdultSgd: 1.29,
      fareStudentSgd: 0.64,
      fareSeniorSgd: 0.72,
      walkingDistanceM: 140,
      caloriesKcal: 35,
      legs: [
        { type: 'BUS', lineOrService: '147', from: originStop.name, to: destStop.name, durationMin: 15, stopsCount: 6, load: 'SEA' },
        { type: 'WALK', from: destStop.name, to: 'Destination Hub', durationMin: 2 },
      ],
    },
  ];

  const currentOption = journeyOptions.find((o) => o.id === selectedOptionId) || journeyOptions[0];

  const getFare = (opt: JourneyOption) => {
    if (concessionTier === 'student') return opt.fareStudentSgd;
    if (concessionTier === 'senior') return opt.fareSeniorSgd;
    return opt.fareAdultSgd;
  };

  return (
    <div className="space-y-6">
      {/* Route Query Formulation Card */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] p-4 sm:p-5 shadow-xs">
        <h3 className="font-heading font-extrabold text-base text-[#111C2D] mb-4">
          LTA Distance-Based Journey & Fare Planner
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-3">
          {/* Origin Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Origin Interchange / Stop
            </label>
            <select
              value={originStopCode}
              onChange={(e) => setOriginStopCode(e.target.value)}
              className="w-full h-11 px-3 bg-[#F8FAFC] border-[1.5px] border-[#E2E8F0] rounded-lg text-sm text-[#111C2D] font-medium focus:outline-none focus:border-[#5B1B6A]"
            >
              {stops.map((stop) => (
                <option key={stop.code} value={stop.code} disabled={stop.code === destStopCode}>
                  [{stop.code}] {stop.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center pt-2 sm:pt-4">
            <button
              onClick={handleSwapStops}
              className="p-2.5 rounded-full bg-slate-100 hover:bg-[#F6EEF8] text-[#5B1B6A] transition-colors border border-slate-200"
              title="Swap Origin and Destination"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* Destination Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Destination Interchange / Stop
            </label>
            <select
              value={destStopCode}
              onChange={(e) => setDestStopCode(e.target.value)}
              className="w-full h-11 px-3 bg-[#F8FAFC] border-[1.5px] border-[#E2E8F0] rounded-lg text-sm text-[#111C2D] font-medium focus:outline-none focus:border-[#5B1B6A]"
            >
              {stops.map((stop) => (
                <option key={stop.code} value={stop.code} disabled={stop.code === originStopCode}>
                  [{stop.code}] {stop.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Fare Concession Tier Selector */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1">Fare Category:</span>
            <button
              onClick={() => setConcessionTier('adult')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                concessionTier === 'adult'
                  ? 'bg-[#5B1B6A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Adult Standard
            </button>
            <button
              onClick={() => setConcessionTier('student')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                concessionTier === 'student'
                  ? 'bg-[#5B1B6A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Student Concession
            </button>
            <button
              onClick={() => setConcessionTier('senior')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                concessionTier === 'senior'
                  ? 'bg-[#5B1B6A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Senior Citizen
            </button>
          </div>

          <span className="text-[11px] text-slate-400">
            LTA Fare Structure 2026 Verified
          </span>
        </div>
      </div>

      {/* Journey Options List */}
      <div className="space-y-3">
        {journeyOptions.map((opt) => {
          const isSelected = opt.id === selectedOptionId;
          const fare = getFare(opt);

          return (
            <div
              key={opt.id}
              onClick={() => setSelectedOptionId(opt.id)}
              className={`p-4 rounded-lg border transition-all cursor-pointer bg-white ${
                isSelected
                  ? 'border-[#5B1B6A] ring-2 ring-[#F6EEF8] shadow-md'
                  : 'border-[#E2E8F0] hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading font-bold text-sm sm:text-base text-[#111C2D]">
                      {opt.title}
                    </h4>
                    {opt.id === 'opt_1' && (
                      <span className="px-2 py-0.5 bg-[#EA580C] text-white text-[10px] font-bold rounded uppercase">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-[#5B1B6A]" />
                      <strong className="tabular-nums font-heading">{opt.totalDurationMin} min</strong>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 font-semibold text-[#16A34A]">
                      <DollarSign className="w-3.5 h-3.5" />
                      <strong className="tabular-nums font-mono">${fare.toFixed(2)} SGD</strong>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Footprints className="w-3.5 h-3.5 text-slate-400" />
                      <span className="tabular-nums">{opt.walkingDistanceM}m walk</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {opt.legs.map((leg, lIdx) => (
                    <React.Fragment key={lIdx}>
                      {leg.type === 'WALK' && (
                        <div className="px-2 py-1 bg-slate-100 rounded text-[11px] font-medium text-slate-600 flex items-center gap-1">
                          <Footprints className="w-3 h-3 text-slate-400" />
                          <span>{leg.durationMin}m</span>
                        </div>
                      )}
                      {leg.type === 'BUS' && (
                        <div className="px-2.5 py-1 bg-[#5B1B6A] text-white rounded font-heading font-bold text-xs flex items-center gap-1 tabular-nums">
                          <Bus className="w-3 h-3 text-[#F58220]" />
                          <span>{leg.lineOrService}</span>
                        </div>
                      )}
                      {leg.type === 'MRT' && (
                        <div className="px-2.5 py-1 bg-[#00413B] text-[#42B4A7] rounded font-mono font-bold text-xs flex items-center gap-1">
                          <Train className="w-3 h-3" />
                          <span>{leg.lineOrService}</span>
                        </div>
                      )}
                      {lIdx < opt.legs.length - 1 && (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Expanded Route Step Breakdown if Selected */}
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Step-by-Step Navigation
                  </span>
                  <div className="space-y-2">
                    {opt.legs.map((leg, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs">
                        <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          {leg.type === 'WALK' && (
                            <p className="text-slate-600">
                              Walk <strong>{leg.durationMin} mins</strong> from {leg.from} to {leg.to}.
                            </p>
                          )}
                          {leg.type === 'BUS' && (
                            <div className="flex items-center justify-between">
                              <p className="text-slate-800">
                                Board <strong>Bus {leg.lineOrService}</strong> at {leg.from}. Ride {leg.stopsCount} stops ({leg.durationMin} mins) to {leg.to}.
                              </p>
                              {leg.lineOrService && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectService(leg.lineOrService!);
                                  }}
                                  className="text-[11px] text-[#5B1B6A] hover:underline font-semibold ml-2 shrink-0"
                                >
                                  View Bus Route
                                </button>
                              )}
                            </div>
                          )}
                          {leg.type === 'MRT' && (
                            <p className="text-slate-800">
                              Take <strong>{leg.lineOrService}</strong> train from {leg.from} to {leg.to} ({leg.durationMin} mins).
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
