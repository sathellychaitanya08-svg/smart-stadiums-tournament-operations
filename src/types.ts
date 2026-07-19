/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'operator' | 'admin' | 'security_chief';
  token?: string;
}

export type MatchStatus = 'scheduled' | 'live' | 'completed' | 'delayed';
export type MatchPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  status: MatchStatus;
  datetime: string;
  durationMinutes: number;
  priority: MatchPriority;
  demandScore: number; // 0 - 100
  ticketSales: number;
  capacity: number;
  crowdForecast: number; // occupancy percentage
  weatherForecast: string; // sunny, rainy, cold, hot, thunderstorm
  stadiumId: string;
  restDaysHome: number;
  restDaysAway: number;
  referee: string;
}

export type ZoneType = 'gate' | 'concession' | 'restroom' | 'seating';
export type ZoneStatus = 'normal' | 'congested' | 'critical';

export interface Zone {
  id: string;
  name: string;
  type: ZoneType;
  occupancyRate: number; // percentage (0 - 100)
  currentQueueTime: number; // minutes
  capacity: number;
  currentCount: number;
  status: ZoneStatus;
  alertMessage?: string;
}

export type IncidentCategory = 'medical' | 'security' | 'facility' | 'fire' | 'crowd';
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'reported' | 'investigating' | 'dispatched' | 'resolved';

export interface Incident {
  id: string;
  title: string;
  category: IncidentCategory;
  description: string;
  location: string;
  timestamp: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  responderAllocated?: string;
}

export type ResourceRole = 'security' | 'medic' | 'usher' | 'custodian';

export interface ResourceAllocation {
  id: string;
  role: ResourceRole;
  totalStaff: number;
  allocated: number;
  onDuty: number;
  status: 'optimal' | 'understaffed' | 'surplus';
}

export interface UtilityGrid {
  powerUsageKw: number;
  powerLoadPrediction: number;
  powerLimitKw: number;
  waterGallonsMin: number;
  waterLimitGallons: number;
  savingModeActive: boolean;
  gridStatus: 'normal' | 'high_load' | 'saving_mode';
}

export interface SustainabilityMetric {
  wasteRecycledKg: number;
  foodWasteKg: number;
  transitCo2Kg: number; // kg of CO2 equivalent
  energySavedKwh: number;
  waterSavedGallons: number;
  targetWasteRecycledKg: number;
  targetFoodWasteKg: number;
  targetTransitCo2Kg: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
  systemAction?: {
    type: string;
    payload: any;
  };
}

export interface StadiumState {
  matches: Match[];
  zones: Zone[];
  incidents: Incident[];
  resources: ResourceAllocation[];
  utility: UtilityGrid;
  sustainability: SustainabilityMetric;
}
