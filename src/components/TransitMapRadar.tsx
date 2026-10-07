import React, { useState } from 'react';
import { BusStop, BusServiceTiming } from '../types/transit';
import { MapPin, Navigation, ZoomIn, ZoomOut, RotateCcw, Layers, Bus, Radio } from 'lucide-react';

interface TransitMapRadarProps {
  stops: BusStop[];
  selectedStop: BusStop;
  onSelectStop: (stop: BusStop) => void;
  timings: BusServiceTiming[];
  onSelectService: (serviceNo: string) => void;
}

export const TransitMapRadar: React.FC<TransitMapRadarProps> = ({
  stops,
  selectedStop,
  onSelectStop,
  timings,
  onSelectService,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showMrtLines, setShowMrtLines] = useState(true);
  const [showBusFleet, setShowBusFleet] = useState(true);
  const [hoveredStop, setHoveredStop] = useState<BusStop | null>(null);
  const [hoveredBus, setHoveredBus] = useState<string | null>(null);

  // SVG coordinate transformation for Singapore bounds (approx Lat 1.27 - 1.37, Lon 103.72 - 103.96)
  const getCoordinates = (lat: number, lon: number) => {
    const minLat = 1.265;
    const maxLat = 1.365;
    const minLon = 103.730;
    const maxLon = 103.960;

    const x = ((lon - minLon) / (maxLon - minLon)) * 600 + 40;
    const y = 460 - ((lat - minLat) / (maxLat - minLat)) * 400;
    return { x, y };
  };

  // Sample fleet vehicles on the map based on current stop timings
  const fleetVehicles = [
    { id: 'SBS3421Z', service: '147', x: 380, y: 310, load: 'SDA', dir: 'SW', type: 'DD' },
    { id: 'SMB5891P', service: '190', x: 330, y: 260, load: 'SEA', dir: 'S', type: 'DD' },
    { id: 'SBS7412A', service: '65', x: 420, y: 240, load: 'SEA', dir: 'SW', type: 'DD' },
    { id: 'TTS2019K', service: '106', x: 410, y: 340, load: 'LSD', dir: 'W', type: 'DD' },
    { id: 'GAS1092M', service: '36', x: 480, y: 220, load: 'SEA', dir: 'E', type: 'SD' },
    { id: 'SBS8823J', service: '12e', x: 450, y: 280, load: 'SEA', dir: 'SW', type: 'DD' },
  ];

  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden shadow-xs flex flex-col h-full min-h-[460px] sm:min-h-[540px]">
      {/* Map Control Header */}
      <div className="p-3 sm:p-4 border-b border-[#E2E8F0] bg-slate-50 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-live-pulse" />
          <span className="font-heading font-extrabold text-sm text-[#111C2D]">
            Civic Radar Map
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            · Singapore Island Real-Time Telemetry
          </span>
        </div>

        {/* Layer Toggles & Zoom Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowMrtLines(!showMrtLines)}
            className={`px-2 py-1 text-[11px] font-semibold rounded border transition-colors ${
              showMrtLines
                ? 'bg-[#5B1B6A] text-white border-[#5B1B6A]'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            MRT Lines
          </button>
          <button
            onClick={() => setShowBusFleet(!showBusFleet)}
            className={`px-2 py-1 text-[11px] font-semibold rounded border transition-colors ${
              showBusFleet
                ? 'bg-[#EA580C] text-white border-[#EA580C]'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Live Buses
          </button>

          <div className="flex items-center border border-slate-200 rounded bg-white ml-1">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
              className="p-1 hover:bg-slate-100 text-slate-600 border-r border-slate-200"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
              className="p-1 hover:bg-slate-100 text-slate-600 border-r border-slate-200"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 hover:bg-slate-100 text-slate-600"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div className="relative flex-1 bg-[#F0F4FF] overflow-hidden select-none">
        <svg
          viewBox="0 0 680 500"
          className="w-full h-full transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Subtle Singapore Coastline Base Geo Shading */}
          <path
            d="M 60,320 C 80,300 120,290 160,280 C 220,270 280,240 340,230 C 420,220 500,210 580,240 C 620,260 640,300 620,340 C 600,370 540,410 480,420 C 400,430 320,440 240,430 C 160,420 100,380 60,320 Z"
            fill="#E2EBFC"
            stroke="#CFDAF2"
            strokeWidth="2"
          />

          {/* Southern Islands (Sentosa & Marina Bay contour) */}
          <ellipse cx="360" cy="450" rx="45" ry="14" fill="#D8E3FB" stroke="#CFDAF2" strokeWidth="1.5" />
          <ellipse cx="510" cy="410" rx="35" ry="12" fill="#D8E3FB" stroke="#CFDAF2" strokeWidth="1.5" />

          {/* MRT Network Lines */}
          {showMrtLines && (
            <g opacity="0.85">
              {/* North-South Line (Red) */}
              <path
                d="M 120,320 Q 220,180 340,160 T 360,310 T 380,410"
                fill="none"
                stroke="#D42E12"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* East-West Line (Green) */}
              <path
                d="M 80,330 L 140,330 L 320,325 L 390,325 L 520,260 L 610,250"
                fill="none"
                stroke="#009640"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* North-East Line (Purple - SBS Transit) */}
              <path
                d="M 330,370 L 350,330 L 390,260 L 460,190"
                fill="none"
                stroke="#722082"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Downtown Line (Blue - SBS Transit) */}
              <path
                d="M 230,190 L 320,270 L 380,340 L 420,310 L 530,290"
                fill="none"
                stroke="#0055B8"
                strokeWidth="3.5"
                strokeDasharray="6 3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Circle Line (Orange) */}
              <path
                d="M 370,300 C 430,270 480,340 430,380 C 370,410 320,360 370,300"
                fill="none"
                stroke="#FA9E0D"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Interactive Bus Stop Interchanges */}
          {stops.map((stop) => {
            const { x, y } = getCoordinates(stop.latitude, stop.longitude);
            const isSelected = selectedStop.code === stop.code;

            return (
              <g
                key={stop.code}
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={() => onSelectStop(stop)}
                onMouseEnter={() => setHoveredStop(stop)}
                onMouseLeave={() => setHoveredStop(null)}
              >
                {/* Selected Pulse Ring */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="18"
                    fill="#5B1B6A"
                    fillOpacity="0.2"
                    stroke="#5B1B6A"
                    strokeWidth="1.5"
                    className="animate-pulse"
                  />
                )}

                {/* Outer Marker */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? "9" : "7"}
                  fill={isSelected ? "#5B1B6A" : "#FFFFFF"}
                  stroke={isSelected ? "#FFFFFF" : "#5B1B6A"}
                  strokeWidth="2.5"
                  className="shadow-sm drop-shadow-md"
                />

                {/* Inner Dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? "3.5" : "2.5"}
                  fill={isSelected ? "#FFFFFF" : "#EA580C"}
                />

                {/* Label */}
                <text
                  x={x}
                  y={y - 12}
                  textAnchor="middle"
                  fill="#111C2D"
                  fontSize={isSelected ? "11" : "10"}
                  fontWeight={isSelected ? "800" : "600"}
                  fontFamily="Plus Jakarta Sans"
                  className="pointer-events-none drop-shadow-xs"
                >
                  {stop.name.replace(' Stn', '').replace(' / Tangs', '')}
                </text>
              </g>
            );
          })}

          {/* Live Fleet Vehicles */}
          {showBusFleet &&
            fleetVehicles.map((bus) => {
              const isHovered = hoveredBus === bus.id;
              const loadColor =
                bus.load === 'SEA' ? '#16A34A' : bus.load === 'SDA' ? '#D97706' : '#DC2626';

              return (
                <g
                  key={bus.id}
                  className="cursor-pointer"
                  onClick={() => onSelectService(bus.service)}
                  onMouseEnter={() => setHoveredBus(bus.id)}
                  onMouseLeave={() => setHoveredBus(null)}
                >
                  {/* Radar Wave */}
                  <circle
                    cx={bus.x}
                    cy={bus.y}
                    r="14"
                    fill={loadColor}
                    fillOpacity="0.18"
                    stroke={loadColor}
                    strokeWidth="1"
                    className="animate-live-pulse"
                  />

                  {/* Bus Vehicle Plate */}
                  <rect
                    x={bus.x - 16}
                    y={bus.y - 10}
                    width="32"
                    height="20"
                    rx="4"
                    fill="#5B1B6A"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    className="drop-shadow-md hover:fill-[#722082]"
                  />

                  <text
                    x={bus.x}
                    y={bus.y + 4}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="10"
                    fontWeight="800"
                    fontFamily="Plus Jakarta Sans"
                    className="tabular-nums"
                  >
                    {bus.service}
                  </text>

                  {/* Occupancy Indicator Dot */}
                  <circle
                    cx={bus.x + 12}
                    cy={bus.y - 8}
                    r="4"
                    fill={loadColor}
                    stroke="#FFFFFF"
                    strokeWidth="1"
                  />
                </g>
              );
            })}
        </svg>

        {/* Selected Hub Floating Information Pill */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto bg-white/95 backdrop-blur-md rounded-lg border border-[#E2E8F0] p-3 shadow-lg max-w-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5B1B6A]" />
              <span className="font-heading font-extrabold text-xs text-[#111C2D]">
                {selectedStop.name}
              </span>
              <span className="text-[10px] font-mono font-bold bg-[#F6EEF8] text-[#5B1B6A] px-1.5 py-0.2 rounded">
                {selectedStop.code}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              {selectedStop.services.length} Routes
            </span>
          </div>

          <div className="text-[11px] text-slate-500 mt-1 truncate">
            {selectedStop.roadName} · Connecting {selectedStop.mrtConnections?.join(', ') || 'Direct Civic Routes'}
          </div>

          {/* Quick Route Badges at this Stop */}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {selectedStop.services.slice(0, 6).map((srv) => (
              <button
                key={srv}
                onClick={() => onSelectService(srv)}
                className="px-2 py-0.5 bg-[#5B1B6A] hover:bg-[#722082] text-white text-[10px] font-extrabold rounded tabular-nums transition-colors"
              >
                {srv}
              </button>
            ))}
            {selectedStop.services.length > 6 && (
              <span className="text-[10px] text-slate-400 font-semibold">
                +{selectedStop.services.length - 6} more
              </span>
            )}
          </div>
        </div>

        {/* Radar Map Legend in Top Right */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs rounded-md border border-slate-200 p-2 text-[10px] space-y-1 shadow-xs hidden sm:block">
          <div className="font-bold text-slate-700 uppercase tracking-wider text-[9px]">
            Network Legend
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#722082]" />
            <span className="text-slate-600">NEL (SBS Transit)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0055B8]" />
            <span className="text-slate-600">DTL (SBS Transit)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D42E12]" />
            <span className="text-slate-600">NSL / EWL (SMRT)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
            <span className="text-slate-600">Seats Avail</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D97706]" />
            <span className="text-slate-600">Standing Avail</span>
          </div>
        </div>
      </div>
    </div>
  );
};
