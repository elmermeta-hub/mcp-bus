export type CrowdLevel = 'SEA' | 'SDA' | 'LSD'; // Seats Available, Standing Available, Limited Standing
export type BusType = 'SD' | 'DD' | 'BD'; // Single Decker, Double Decker, Bendy
export type BusOperator = 'SBST' | 'SMRT' | 'TTS' | 'GAS'; // SBS Transit, SMRT, Tower Transit, Go-Ahead Singapore

export interface NextBus {
  estimatedArrival: string; // ISO string
  countdownSeconds: number; // remaining seconds
  load: CrowdLevel;
  feature: 'WAB' | 'REG'; // Wheelchair Accessible Bus or Regular
  type: BusType;
  latitude: number;
  longitude: number;
  visitNumber: number;
}

export interface BusServiceTiming {
  serviceNo: string;
  operator: BusOperator;
  destinationCode: string;
  destinationName: string;
  nextBus: NextBus;
  nextBus2?: NextBus;
  nextBus3?: NextBus;
  routeCategory?: 'TRUNK' | 'EXPRESS' | 'FEEDER' | 'CITY_DIRECT';
}

export interface BusStop {
  code: string;
  name: string;
  roadName: string;
  latitude: number;
  longitude: number;
  services: string[];
  mrtConnections?: string[];
  interchangeName?: string;
}

export interface BusRouteStop {
  stopCode: string;
  stopName: string;
  roadName: string;
  sequence: number;
  distanceKm: number;
  hasMrt: boolean;
  mrtLines?: string[];
}

export interface BusRouteDetail {
  serviceNo: string;
  operator: BusOperator;
  origin: string;
  destination: string;
  routeType: string;
  firstBus: string;
  lastBus: string;
  peakFrequency: string;
  offPeakFrequency: string;
  stops: BusRouteStop[];
  activeBuses: {
    id: string;
    stopSequence: number;
    load: CrowdLevel;
    type: BusType;
  }[];
}

export interface MrtLine {
  id: string;
  name: string;
  shortCode: string;
  color: string;
  operator: 'SBS Transit' | 'SMRT';
  status: 'Normal' | 'Minor Delays' | 'Track Fault' | 'Crowded';
  headwayPeak: string;
  headwayOffPeak: string;
  announcement?: string;
  stationsCount: number;
}

export interface JourneyOption {
  id: string;
  title: string;
  totalDurationMin: number;
  fareAdultSgd: number;
  fareStudentSgd: number;
  fareSeniorSgd: number;
  walkingDistanceM: number;
  caloriesKcal: number;
  legs: {
    type: 'WALK' | 'BUS' | 'MRT';
    lineOrService?: string;
    from: string;
    to: string;
    durationMin: number;
    stopsCount?: number;
    load?: CrowdLevel;
  }[];
}

export interface CardTransaction {
  id: string;
  timestamp: string;
  type: 'BUS' | 'MRT' | 'TOPUP';
  serviceOrStation: string;
  entryPoint: string;
  exitPoint: string;
  amountSgd: number;
  balanceAfterSgd: number;
}
