/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  SINGAPORE_BUS_STOPS,
  INITIAL_BUS_TIMINGS,
  BUS_ROUTES_DATABASE,
  MRT_LINES,
  INITIAL_TRANSIT_CARD,
} from './data/singaporeTransitData';
import { BusStop, BusServiceTiming, BusRouteDetail, CardTransaction } from './types/transit';
import { TopBar } from './components/TopBar';
import { BusArrivalList } from './components/BusArrivalList';
import { TransitMapRadar } from './components/TransitMapRadar';
import { BusRouteModal } from './components/BusRouteModal';
import { MrtStatusBoard } from './components/MrtStatusBoard';
import { JourneyPlanner } from './components/JourneyPlanner';
import { SimplyGoCardModal } from './components/SimplyGoCardModal';
import { CrowdLegendModal } from './components/CrowdLegendModal';
import {
  Bus,
  MapPin,
  Train,
  Navigation,
  CreditCard,
  Sparkles,
  ShieldCheck,
  RotateCw,
  Clock,
  Compass,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'arrivals' | 'map' | 'mrt' | 'journey' | 'card'>('arrivals');
  const [selectedStop, setSelectedStop] = useState<BusStop>(SINGAPORE_BUS_STOPS[0]);
  const [timingsData, setTimingsData] = useState<Record<string, BusServiceTiming[]>>(INITIAL_BUS_TIMINGS);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sg_transit_favorites');
      return saved ? JSON.parse(saved) : ['147', '190'];
    } catch {
      return ['147', '190'];
    }
  });

  const [selectedServiceNo, setSelectedServiceNo] = useState<string | null>(null);
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [cardBalance, setCardBalance] = useState<number>(INITIAL_TRANSIT_CARD.balanceSgd);
  const [transactions, setTransactions] = useState<CardTransaction[]>(INITIAL_TRANSIT_CARD.recentTransactions);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sg_transit_favorites', JSON.stringify(favorites));
    } catch {
      // Ignore
    }
  }, [favorites]);

  // Real-time 1-second interval poll with tabular-nums countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimingsData((prev) => {
        const nextState = { ...prev };

        Object.keys(nextState).forEach((stopCode) => {
          nextState[stopCode] = nextState[stopCode].map((service) => {
            const updatedNext = { ...service.nextBus };
            if (updatedNext.countdownSeconds > 0) {
              updatedNext.countdownSeconds -= 1;
            } else {
              // Rollover: simulate arrival cycle
              updatedNext.countdownSeconds = Math.floor(Math.random() * 240) + 360; // 6 - 10 min
            }

            let updatedNext2 = service.nextBus2 ? { ...service.nextBus2 } : undefined;
            if (updatedNext2) {
              if (updatedNext2.countdownSeconds > 0) {
                updatedNext2.countdownSeconds -= 1;
              } else {
                updatedNext2.countdownSeconds = Math.floor(Math.random() * 300) + 600;
              }
            }

            let updatedNext3 = service.nextBus3 ? { ...service.nextBus3 } : undefined;
            if (updatedNext3 && updatedNext3.countdownSeconds > 0) {
              updatedNext3.countdownSeconds -= 1;
            }

            return {
              ...service,
              nextBus: updatedNext,
              nextBus2: updatedNext2,
              nextBus3: updatedNext3,
            };
          });
        });

        return nextState;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleToggleFavorite = (serviceNo: string) => {
    setFavorites((prev) =>
      prev.includes(serviceNo) ? prev.filter((s) => s !== serviceNo) : [...prev, serviceNo]
    );
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 600);
  };

  const handleTopUp = (amount: number) => {
    const newBal = cardBalance + amount;
    setCardBalance(newBal);
    const newTx: CardTransaction = {
      id: `tx_${Date.now()}`,
      timestamp: 'Just now',
      type: 'TOPUP',
      serviceOrStation: 'PayNow Instant Top-Up',
      entryPoint: 'Online Top-Up',
      exitPoint: 'Transit Account',
      amountSgd: amount,
      balanceAfterSgd: newBal,
    };
    setTransactions([newTx, ...transactions]);
  };

  const handleSimulateTap = (type: 'BUS' | 'MRT', amount: number, name: string) => {
    const newBal = Math.max(0, cardBalance - amount);
    setCardBalance(newBal);
    const newTx: CardTransaction = {
      id: `tx_${Date.now()}`,
      timestamp: 'Just now',
      type,
      serviceOrStation: name,
      entryPoint: selectedStop.name,
      exitPoint: type === 'BUS' ? 'Alighting Stop' : 'Destination Gantry',
      amountSgd: -amount,
      balanceAfterSgd: newBal,
    };
    setTransactions([newTx, ...transactions]);
  };

  // Current bus timings for selected stop
  const currentTimings = timingsData[selectedStop.code] || [];

  // Selected route detail for modal
  const currentRouteDetail: BusRouteDetail | null = selectedServiceNo
    ? BUS_ROUTES_DATABASE[selectedServiceNo] || {
        serviceNo: selectedServiceNo,
        operator: 'SBST',
        origin: selectedStop.name,
        destination: 'Integrated Hub',
        routeType: 'Civic Trunk',
        firstBus: '05:30',
        lastBus: '23:45',
        peakFrequency: '4 – 8 min',
        offPeakFrequency: '8 – 12 min',
        stops: selectedStop.services.map((srv, idx) => ({
          stopCode: `${10000 + idx * 420}`,
          stopName: `Berth ${idx + 1} Corridor`,
          roadName: selectedStop.roadName,
          sequence: idx + 1,
          distanceKm: idx * 1.8,
          hasMrt: idx % 2 === 0,
        })),
        activeBuses: [
          { id: `SBS${selectedServiceNo}X`, stopSequence: 1, load: 'SEA', type: 'DD' },
        ],
      }
    : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111C2D] flex flex-col antialiased">
      {/* 3-Zone Top Bar Contract */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefresh={handleManualRefresh}
        isRefreshing={isRefreshing}
        onOpenLegend={() => setIsLegendOpen(true)}
        onOpenCardModal={() => setIsCardModalOpen(true)}
        cardBalance={cardBalance}
      />

      {/* Main Responsive Layout: 12-Column Grid baseline (Desktop) & Split 3:5 on Tablet */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 pb-24 md:pb-8">
        {/* Civic Hero Photographic Showcase (with Singapore Interchange Banner) */}
        {activeTab === 'arrivals' && (
          <div className="relative mb-5 rounded-xl overflow-hidden border border-[#E2E8F0] shadow-2xs bg-[#5B1B6A] text-white">
            <div className="relative h-28 sm:h-36 w-full overflow-hidden">
              <img
                src="/src/assets/images/sg_transit_interchange_banner_1791350600789.jpg"
                alt="Singapore Bus Interchange"
                className="w-full h-full object-cover opacity-25"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#410050] via-[#5B1B6A]/80 to-transparent" />
              <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-live-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                    Live Telemetry Active
                  </span>
                </div>
                <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-white mt-0.5">
                  Singapore Civic Transit Pulse
                </h1>
                <p className="text-xs sm:text-sm text-white/85 max-w-xl line-clamp-1 mt-0.5">
                  High-contrast real-time arrivals with LTA crowd capacity & wheelchair accessibility.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Bus Arrivals & Interchange Radar (Split 3:5 Layout on Tablet/Desktop) */}
        {activeTab === 'arrivals' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
            {/* Left Column (5 of 12 cols): Bus Stops & Real-Time Timing Cards */}
            <div className="lg:col-span-6 xl:col-span-5 space-y-4">
              <BusArrivalList
                stops={SINGAPORE_BUS_STOPS}
                selectedStop={selectedStop}
                onSelectStop={setSelectedStop}
                timings={currentTimings}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onSelectService={(srv) => setSelectedServiceNo(srv)}
                lastUpdated={lastUpdated}
                onOpenLegend={() => setIsLegendOpen(true)}
              />
            </div>

            {/* Right Column (7 of 12 cols): Interactive Schematic Map & Radar */}
            <div className="lg:col-span-6 xl:col-span-7 sticky top-20">
              <TransitMapRadar
                stops={SINGAPORE_BUS_STOPS}
                selectedStop={selectedStop}
                onSelectStop={setSelectedStop}
                timings={currentTimings}
                onSelectService={(srv) => setSelectedServiceNo(srv)}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Full Screen Radar Map */}
        {activeTab === 'map' && (
          <div className="h-[calc(100vh-140px)] min-h-[500px]">
            <TransitMapRadar
              stops={SINGAPORE_BUS_STOPS}
              selectedStop={selectedStop}
              onSelectStop={(stop) => {
                setSelectedStop(stop);
                setActiveTab('arrivals');
              }}
              timings={currentTimings}
              onSelectService={(srv) => setSelectedServiceNo(srv)}
            />
          </div>
        )}

        {/* Tab 3: MRT / Rail Operations Status Board */}
        {activeTab === 'mrt' && <MrtStatusBoard lines={MRT_LINES} />}

        {/* Tab 4: Journey & LTA Fare Planner */}
        {activeTab === 'journey' && (
          <JourneyPlanner
            stops={SINGAPORE_BUS_STOPS}
            onSelectService={(srv) => {
              setSelectedServiceNo(srv);
            }}
          />
        )}

        {/* Tab 5: SimplyGo Transit Wallet */}
        {activeTab === 'card' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs">
              <h2 className="font-heading font-extrabold text-xl text-[#111C2D] mb-4">
                SimplyGo Contactless Transit Account
              </h2>
              {/* Card visual */}
              <div className="relative rounded-xl overflow-hidden shadow-md border border-slate-200 aspect-[1.586/1] max-w-md mx-auto bg-gradient-to-br from-[#410050] via-[#5B1B6A] to-[#EA580C] text-white p-6 flex flex-col justify-between">
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
                    <p className="text-[10px] text-white/70">Mastercard / EZ-Link Certified</p>
                  </div>
                  <div className="px-2.5 py-0.5 bg-white/20 backdrop-blur-xs rounded text-[10px] font-bold tracking-widest uppercase">
                    Adult Standard
                  </div>
                </div>

                <div className="relative z-10 my-auto">
                  <div className="text-[11px] text-white/80 uppercase tracking-wider font-semibold">
                    Current Balance
                  </div>
                  <div className="font-heading font-extrabold text-4xl tabular-nums text-white mt-1">
                    ${cardBalance.toFixed(2)}{' '}
                    <span className="text-sm font-normal text-white/80">SGD</span>
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between text-xs text-white/90">
                  <span className="font-mono tracking-widest">•••• •••• •••• 0312</span>
                  <span className="font-mono text-[11px]">EXP 10/29</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-3 gap-3 mt-6 max-w-md mx-auto">
                <button
                  onClick={() => handleTopUp(10)}
                  className="py-2.5 px-3 bg-[#F6EEF8] hover:bg-[#5B1B6A] hover:text-white text-[#5B1B6A] border border-[#5B1B6A] font-heading font-bold text-xs rounded-lg transition-colors active:scale-95"
                >
                  +$10 Top-Up
                </button>
                <button
                  onClick={() => handleTopUp(20)}
                  className="py-2.5 px-3 bg-[#F6EEF8] hover:bg-[#5B1B6A] hover:text-white text-[#5B1B6A] border border-[#5B1B6A] font-heading font-bold text-xs rounded-lg transition-colors active:scale-95"
                >
                  +$20 Top-Up
                </button>
                <button
                  onClick={() => handleTopUp(50)}
                  className="py-2.5 px-3 bg-[#FFF4ED] hover:bg-[#EA580C] hover:text-white text-[#EA580C] border border-[#EA580C] font-heading font-bold text-xs rounded-lg transition-colors active:scale-95"
                >
                  +$50 Top-Up
                </button>
              </div>

              {/* Transactions */}
              <div className="mt-8 pt-6 border-t border-slate-100 max-w-md mx-auto">
                <h3 className="font-heading font-bold text-sm text-[#111C2D] mb-3">
                  Recent Fare Deductions
                </h3>
                <div className="space-y-2">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-800">{tx.serviceOrStation}</div>
                        <div className="text-[11px] text-slate-500">
                          {tx.entryPoint} → {tx.exitPoint}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-heading font-bold tabular-nums ${
                            tx.amountSgd > 0 ? 'text-[#16A34A]' : 'text-slate-800'
                          }`}
                        >
                          {tx.amountSgd > 0
                            ? `+$${tx.amountSgd.toFixed(2)}`
                            : `-$${Math.abs(tx.amountSgd).toFixed(2)}`}
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
          </div>
        )}
      </main>

      {/* Fixed Bottom Tab Bar on Mobile (Natural Thumb Ergonomic Zone) */}
      {/* 15% mobile sticky cap compliant */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
        <div className="grid grid-cols-5 h-16 items-center px-2">
          <button
            onClick={() => setActiveTab('arrivals')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              activeTab === 'arrivals' ? 'text-[#5B1B6A]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Bus className={`w-5 h-5 ${activeTab === 'arrivals' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] font-semibold tracking-tight mt-0.5">Arrivals</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              activeTab === 'map' ? 'text-[#5B1B6A]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Compass className={`w-5 h-5 ${activeTab === 'map' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] font-semibold tracking-tight mt-0.5">Radar</span>
          </button>

          <button
            onClick={() => setActiveTab('mrt')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              activeTab === 'mrt' ? 'text-[#5B1B6A]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Train className={`w-5 h-5 ${activeTab === 'mrt' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] font-semibold tracking-tight mt-0.5">MRT</span>
          </button>

          <button
            onClick={() => setActiveTab('journey')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              activeTab === 'journey' ? 'text-[#5B1B6A]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Navigation className={`w-5 h-5 ${activeTab === 'journey' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] font-semibold tracking-tight mt-0.5">Planner</span>
          </button>

          <button
            onClick={() => setActiveTab('card')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              activeTab === 'card' ? 'text-[#EA580C]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <CreditCard className={`w-5 h-5 ${activeTab === 'card' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] font-semibold tracking-tight mt-0.5">SimplyGo</span>
          </button>
        </div>
      </div>

      {/* Bus Route Sequence Sheet / Modal */}
      {currentRouteDetail && (
        <BusRouteModal
          routeDetail={currentRouteDetail}
          selectedStopCode={selectedStop.code}
          onClose={() => setSelectedServiceNo(null)}
          onSelectStopCode={(code) => {
            const found = SINGAPORE_BUS_STOPS.find((s) => s.code === code);
            if (found) {
              setSelectedStop(found);
            }
            setSelectedServiceNo(null);
          }}
        />
      )}

      {/* LTA Crowd Capacity & Accessibility Legend Modal */}
      {isLegendOpen && <CrowdLegendModal onClose={() => setIsLegendOpen(false)} />}

      {/* SimplyGo Card Drawer Modal */}
      {isCardModalOpen && (
        <SimplyGoCardModal
          cardBalance={cardBalance}
          onTopUp={handleTopUp}
          onSimulateTap={handleSimulateTap}
          transactions={transactions}
          onClose={() => setIsCardModalOpen(false)}
        />
      )}
    </div>
  );
}
