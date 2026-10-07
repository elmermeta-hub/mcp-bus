import React, { useState } from 'react';
import { MrtLine } from '../types/transit';
import { ShieldCheck, AlertTriangle, Train, Clock, ArrowRight, Radio } from 'lucide-react';

interface MrtStatusBoardProps {
  lines: MrtLine[];
}

export const MrtStatusBoard: React.FC<MrtStatusBoardProps> = ({ lines }) => {
  const [selectedLine, setSelectedLine] = useState<MrtLine | null>(lines[0]);

  return (
    <div className="space-y-6">
      {/* Network Overview Banner with Authentic Station Photography */}
      <div className="relative rounded-xl overflow-hidden border border-[#E2E8F0] shadow-sm bg-[#5B1B6A] text-white">
        <div className="relative h-44 sm:h-52 w-full overflow-hidden">
          <img
            src="/src/assets/images/sg_mrt_train_station_1791350630664.jpg"
            alt="Singapore MRT Train Platform"
            className="w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#5B1B6A] via-[#5B1B6A]/70 to-transparent" />

          <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-live-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                All Lines Operational
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
              Singapore Rail Transit Network
            </h2>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl mt-1">
              Real-time headway telemetrics for SBS Transit (NEL, DTL, LRT) & SMRT heavy rail lines.
            </p>
          </div>
        </div>

        {/* Quick Operational Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10 bg-[#410050] text-xs">
          <div className="p-3 text-center">
            <span className="text-[10px] text-white/60 uppercase font-bold">Network Uptime</span>
            <div className="font-heading font-bold text-sm text-white mt-0.5">99.98%</div>
          </div>
          <div className="p-3 text-center">
            <span className="text-[10px] text-white/60 uppercase font-bold">Peak Headway</span>
            <div className="font-heading font-bold text-sm text-[#F58220] mt-0.5">2.0 – 2.5 min</div>
          </div>
          <div className="p-3 text-center">
            <span className="text-[10px] text-white/60 uppercase font-bold">Active Stations</span>
            <div className="font-heading font-bold text-sm text-white mt-0.5">160+ Stations</div>
          </div>
          <div className="p-3 text-center">
            <span className="text-[10px] text-white/60 uppercase font-bold">Service Disruptions</span>
            <div className="font-heading font-bold text-sm text-emerald-400 mt-0.5">0 Active Incidents</div>
          </div>
        </div>
      </div>

      {/* Grid of MRT Lines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lines.map((line) => {
          const isSelected = selectedLine?.id === line.id;

          return (
            <div
              key={line.id}
              onClick={() => setSelectedLine(line)}
              className={`p-4 rounded-lg border transition-all cursor-pointer bg-white ${
                isSelected
                  ? 'border-[#5B1B6A] ring-2 ring-[#F6EEF8] shadow-md'
                  : 'border-[#E2E8F0] hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Distinct Line Badge */}
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center font-heading font-extrabold text-white text-base shadow-xs"
                    style={{ backgroundColor: line.color }}
                  >
                    {line.shortCode}
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-sm text-[#111C2D]">
                      {line.name}
                    </h3>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span>{line.operator}</span>
                      <span>·</span>
                      <span>{line.stationsCount} Stations</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-[#16A34A] rounded-full text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                  <span>{line.status}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span>Peak: <strong className="text-slate-800 tabular-nums">{line.headwayPeak}</strong></span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Off-peak: <span className="tabular-nums">{line.headwayOffPeak}</span>
                </div>
              </div>

              {line.announcement && (
                <div className="mt-2.5 p-2 bg-[#F8FAFC] rounded text-[11px] text-slate-600 line-clamp-2">
                  {line.announcement}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Line In-Depth Telemetry Inspector */}
      {selectedLine && (
        <div className="p-5 bg-white rounded-lg border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center font-heading font-extrabold text-white text-xs"
                style={{ backgroundColor: selectedLine.color }}
              >
                {selectedLine.shortCode}
              </div>
              <div>
                <h4 className="font-heading font-bold text-base text-[#111C2D]">
                  {selectedLine.name} Corridor Details
                </h4>
                <p className="text-xs text-slate-500">
                  Operated by {selectedLine.operator} under LTA Regulatory Framework
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 bg-[#F6EEF8] text-[#5B1B6A] font-semibold text-xs rounded-md">
              Full Headway Normal
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-100">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Peak Headway
              </span>
              <div className="font-heading font-bold text-base text-[#111C2D] mt-1 tabular-nums">
                {selectedLine.headwayPeak}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">High frequency passenger clearance</p>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-100">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Off-Peak Headway
              </span>
              <div className="font-heading font-bold text-base text-[#111C2D] mt-1 tabular-nums">
                {selectedLine.headwayOffPeak}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Standard daytime interval</p>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-100">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Service Status
              </span>
              <div className="font-heading font-bold text-base text-[#16A34A] mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                Regular Schedule
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">All platform doors & signals optimal</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
