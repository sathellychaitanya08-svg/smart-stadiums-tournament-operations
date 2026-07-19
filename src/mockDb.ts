/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StadiumState, Match, Zone, Incident, ResourceAllocation, UtilityGrid, SustainabilityMetric } from './types.ts';

// Initial seed data for the ArenaOps Smart Stadiums Platform
export const initialMatches: Match[] = [
  {
    id: 'm-1',
    homeTeam: 'Thunder FC',
    awayTeam: 'Lightning Rangers',
    status: 'live',
    datetime: new Date().toISOString(), // live right now
    durationMinutes: 90,
    priority: 'high',
    demandScore: 85,
    ticketSales: 48500,
    capacity: 55000,
    crowdForecast: 92,
    weatherForecast: 'sunny',
    stadiumId: 'apex-coliseum',
    restDaysHome: 4,
    restDaysAway: 3,
    referee: 'Marcus Oliver'
  },
  {
    id: 'm-2',
    homeTeam: 'Metro United',
    awayTeam: 'Apex Athletic',
    status: 'scheduled',
    datetime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    durationMinutes: 90,
    priority: 'medium',
    demandScore: 68,
    ticketSales: 35000,
    capacity: 55000,
    crowdForecast: 64,
    weatherForecast: 'rainy',
    stadiumId: 'apex-coliseum',
    restDaysHome: 5,
    restDaysAway: 5,
    referee: 'Clara Dupont'
  },
  {
    id: 'm-3',
    homeTeam: 'Titanium City',
    awayTeam: 'Solar Rovers',
    status: 'scheduled',
    datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // In 2 days
    durationMinutes: 90,
    priority: 'critical',
    demandScore: 98,
    ticketSales: 54100,
    capacity: 55000,
    crowdForecast: 98,
    weatherForecast: 'sunny',
    stadiumId: 'apex-coliseum',
    restDaysHome: 6,
    restDaysAway: 6,
    referee: 'Alistair Webb'
  },
  {
    id: 'm-4',
    homeTeam: 'Nova Warriors',
    awayTeam: 'Vortex SC',
    status: 'scheduled',
    datetime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // In 3 days
    durationMinutes: 90,
    priority: 'low',
    demandScore: 45,
    ticketSales: 21000,
    capacity: 55000,
    crowdForecast: 38,
    weatherForecast: 'thunderstorm',
    stadiumId: 'apex-coliseum',
    restDaysHome: 3,
    restDaysAway: 4,
    referee: 'Elena Rostova'
  },
  {
    id: 'm-5',
    homeTeam: 'Gale Force FC',
    awayTeam: 'Ironclad Giants',
    status: 'completed',
    datetime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    durationMinutes: 90,
    priority: 'medium',
    demandScore: 72,
    ticketSales: 41200,
    capacity: 55000,
    crowdForecast: 75,
    weatherForecast: 'sunny',
    stadiumId: 'apex-coliseum',
    restDaysHome: 4,
    restDaysAway: 4,
    referee: 'Kenji Tanaka'
  }
];

export const initialZones: Zone[] = [
  // Gates
  { id: 'z-gate-a', name: 'Main Gate A (North)', type: 'gate', occupancyRate: 78, currentQueueTime: 12, capacity: 15000, currentCount: 11700, status: 'normal' },
  { id: 'z-gate-b', name: 'West Gate B', type: 'gate', occupancyRate: 94, currentQueueTime: 25, capacity: 12000, currentCount: 11280, status: 'congested', alertMessage: 'Heavy inflow. Suggest diverting fans to Gate C.' },
  { id: 'z-gate-c', name: 'East Gate C', type: 'gate', occupancyRate: 42, currentQueueTime: 4, capacity: 12000, currentCount: 5040, status: 'normal' },
  { id: 'z-gate-d', name: 'South VIP Gate D', type: 'gate', occupancyRate: 60, currentQueueTime: 3, capacity: 6000, currentCount: 3600, status: 'normal' },

  // Concessions
  { id: 'z-con-1', name: 'North Fan Feast Food Court', type: 'concession', occupancyRate: 85, currentQueueTime: 18, capacity: 500, currentCount: 425, status: 'congested' },
  { id: 'z-con-2', name: 'West Brew & Dogs Bar', type: 'concession', occupancyRate: 97, currentQueueTime: 22, capacity: 300, currentCount: 291, status: 'critical', alertMessage: 'Queue spillover blocking walkway near Zone B4.' },
  { id: 'z-con-3', name: 'East Side Green-Bites Vegan', type: 'concession', occupancyRate: 35, currentQueueTime: 3, capacity: 250, currentCount: 87, status: 'normal' },

  // Restrooms
  { id: 'z-rest-n', name: 'North Concourse Restrooms', type: 'restroom', occupancyRate: 91, currentQueueTime: 10, capacity: 80, currentCount: 73, status: 'congested' },
  { id: 'z-rest-w', name: 'West Concourse Restrooms', type: 'restroom', occupancyRate: 55, currentQueueTime: 4, capacity: 80, currentCount: 44, status: 'normal' },
  { id: 'z-rest-e', name: 'East Concourse Restrooms', type: 'restroom', occupancyRate: 38, currentQueueTime: 2, capacity: 80, currentCount: 30, status: 'normal' },

  // Seating
  { id: 'z-seat-n', name: 'North Tribune (Ultra Supporters)', type: 'seating', occupancyRate: 96, currentCount: 14400, capacity: 15000, currentQueueTime: 0, status: 'congested' },
  { id: 'z-seat-w', name: 'West Grandstand', type: 'seating', occupancyRate: 88, currentCount: 10560, capacity: 12000, currentQueueTime: 0, status: 'normal' },
  { id: 'z-seat-e', name: 'East Grandstand', type: 'seating', occupancyRate: 81, currentCount: 9720, capacity: 12000, currentQueueTime: 0, status: 'normal' },
  { id: 'z-seat-s', name: 'South VIP Suites & Club Seating', type: 'seating', occupancyRate: 70, currentCount: 4200, capacity: 6000, currentQueueTime: 0, status: 'normal' }
];

export const initialIncidents: Incident[] = [
  {
    id: 'inc-1',
    title: 'Dehydration/Heatstroke in North Tribune',
    category: 'medical',
    description: 'Male fan, early 20s, showing severe signs of dehydration in Section N5. Companion flagged security.',
    location: 'North Tribune - Section N5',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 mins ago
    severity: 'medium',
    status: 'dispatched',
    responderAllocated: 'Medic Team 3'
  },
  {
    id: 'inc-2',
    title: 'Verbal Altercation near West Gate B',
    category: 'security',
    description: 'Minor dispute between opposing fan groups regarding banner placement. Stewards responding, crowd-monitoring active.',
    location: 'Concourse - West Gate B Entrance',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 mins ago
    severity: 'low',
    status: 'investigating',
    responderAllocated: 'Security Patrol A'
  },
  {
    id: 'inc-3',
    title: 'Water Leak in Level 2 Women\'s Restroom',
    category: 'facility',
    description: 'Burst valve reporting under sink #4, minor flooding in North Concourse restroom hallway.',
    location: 'North Concourse - Level 2 Restroom',
    timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(), // 40 mins ago
    severity: 'low',
    status: 'resolved',
    responderAllocated: 'Plumbing Dispatch B'
  }
];

export const initialResources: ResourceAllocation[] = [
  { id: 'r-1', role: 'security', totalStaff: 180, allocated: 145, onDuty: 145, status: 'optimal' },
  { id: 'r-2', role: 'medic', totalStaff: 30, allocated: 12, onDuty: 12, status: 'optimal' },
  { id: 'r-3', role: 'usher', totalStaff: 120, allocated: 110, onDuty: 110, status: 'optimal' },
  { id: 'r-4', role: 'custodian', totalStaff: 50, allocated: 42, onDuty: 42, status: 'optimal' }
];

export const initialUtility: UtilityGrid = {
  powerUsageKw: 1420,
  powerLoadPrediction: 1550,
  powerLimitKw: 2200,
  waterGallonsMin: 180,
  waterLimitGallons: 350,
  savingModeActive: false,
  gridStatus: 'normal'
};

export const initialSustainability: SustainabilityMetric = {
  wasteRecycledKg: 1480,
  foodWasteKg: 320,
  transitCo2Kg: 58400,
  energySavedKwh: 1240,
  waterSavedGallons: 4800,
  targetWasteRecycledKg: 2000,
  targetFoodWasteKg: 200,
  targetTransitCo2Kg: 50000
};

// Memory-based state store for the tournament instance
class MemoryDatabase {
  private state: StadiumState;

  constructor() {
    this.state = {
      matches: [...initialMatches],
      zones: [...initialZones],
      incidents: [...initialIncidents],
      resources: [...initialResources],
      utility: { ...initialUtility },
      sustainability: { ...initialSustainability }
    };
  }

  getState(): StadiumState {
    return this.state;
  }

  // Matches
  getMatches(): Match[] {
    return this.state.matches;
  }

  addMatch(match: Omit<Match, 'id'>): Match {
    const id = `m-${this.state.matches.length + 1}`;
    const newMatch: Match = { id, ...match };
    this.state.matches.push(newMatch);
    return newMatch;
  }

  updateMatchStatus(id: string, status: Match['status']): Match | null {
    const match = this.state.matches.find(m => m.id === id);
    if (match) {
      match.status = status;
      return match;
    }
    return null;
  }

  // Conflict and Rest Validation for Matches
  validateMatchSchedule(match: Partial<Match>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!match.datetime) return { valid: false, errors: ['Datetime is required.'] };

    const proposedTime = new Date(match.datetime).getTime();
    const proposedDurationMs = (match.durationMinutes || 90) * 60 * 1000;
    const proposedEndTime = proposedTime + proposedDurationMs;

    // 1. Double scheduling collision check (same venue/stadium context)
    for (const existing of this.state.matches) {
      if (existing.status === 'completed' || existing.id === match.id) continue;
      const existingTime = new Date(existing.datetime).getTime();
      const existingDurationMs = existing.durationMinutes * 60 * 1000;
      const existingEndTime = existingTime + existingDurationMs;

      // Add a 3-hour buffer between matches for crowd transition
      const transitionBuffer = 3 * 60 * 60 * 1000;

      const overlap = (proposedTime < existingEndTime + transitionBuffer) && 
                      (proposedEndTime + transitionBuffer > existingTime);

      if (overlap) {
        errors.push(`Time conflict: Overlaps with ${existing.homeTeam} vs ${existing.awayTeam} (including a 3-hour crowd clearing buffer).`);
      }
    }

    // 2. Team Fatigue/Rest checks
    if (match.restDaysHome !== undefined && match.restDaysHome < 3) {
      errors.push(`Rest Day Warning: ${match.homeTeam || 'Home team'} has only ${match.restDaysHome} rest days (Minimum recommended is 3).`);
    }
    if (match.restDaysAway !== undefined && match.restDaysAway < 3) {
      errors.push(`Rest Day Warning: ${match.awayTeam || 'Away team'} has only ${match.restDaysAway} rest days (Minimum recommended is 3).`);
    }

    // 3. Extreme Weather Check
    if (match.weatherForecast === 'thunderstorm') {
      errors.push(`Severe Weather Alert: Active lightning warning on proposed day. Recommended indoor venue adjustment or postponement.`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // AI Scheduling Assistant Optimizer simulation logic
  optimizeMatches(): { changesApplied: number; optimizedMatches: Match[] } {
    let changesApplied = 0;
    this.state.matches = this.state.matches.map(m => {
      let changed = false;
      let weather = m.weatherForecast;
      let datetime = m.datetime;

      // Rule A: Postpone if severe weather is thunderstorm
      if (m.status === 'scheduled' && m.weatherForecast === 'thunderstorm') {
        // Move tomorrow + 4 days, adjust weather
        const newDate = new Date(new Date(m.datetime).getTime() + 4 * 24 * 60 * 60 * 1000);
        datetime = newDate.toISOString();
        weather = 'sunny';
        changed = true;
      }

      // Rule B: Low demand matches rescheduled to off-peak slots to balance system load
      if (m.status === 'scheduled' && m.demandScore < 50 && new Date(m.datetime).getHours() > 19) {
        // Shift from evening to afternoon slot (14:00) to conserve power / security shifts
        const d = new Date(m.datetime);
        d.setHours(14, 0, 0, 0);
        datetime = d.toISOString();
        changed = true;
      }

      if (changed) {
        changesApplied++;
        return { ...m, datetime, weatherForecast: weather };
      }
      return m;
    });

    return {
      changesApplied,
      optimizedMatches: this.state.matches
    };
  }

  // Zones
  getZones(): Zone[] {
    return this.state.zones;
  }

  updateZone(id: string, updates: Partial<Zone>): Zone | null {
    const zone = this.state.zones.find(z => z.id === id);
    if (zone) {
      Object.assign(zone, updates);
      // Automatically calculate queue times and critical status based on occupancy
      if (zone.occupancyRate >= 95) {
        zone.status = 'critical';
        zone.currentQueueTime = Math.max(zone.currentQueueTime, 20);
      } else if (zone.occupancyRate >= 80) {
        zone.status = 'congested';
        zone.currentQueueTime = Math.max(zone.currentQueueTime, 12);
      } else {
        zone.status = 'normal';
        zone.currentQueueTime = Math.min(zone.currentQueueTime, 8);
      }
      return zone;
    }
    return null;
  }

  // Crowd simulation ticks (fans entering, queues shifting)
  progressSimulation(): StadiumState {
    // Modify values slightly to mimic realistic crowd and IoT sensory streams
    this.state.zones = this.state.zones.map(z => {
      const isGate = z.type === 'gate';
      const isConcession = z.type === 'concession';
      const isRestroom = z.type === 'restroom';

      let countChange = 0;
      if (isGate) {
        // During live game gates clear, pre-game they fill
        countChange = Math.floor((Math.random() - 0.5) * 150);
      } else if (isConcession || isRestroom) {
        // Fluctuating queues
        countChange = Math.floor((Math.random() - 0.45) * 40);
      }

      const newCount = Math.max(0, Math.min(z.capacity, z.currentCount + countChange));
      const occupancyRate = Math.round((newCount / z.capacity) * 100);

      let status: Zone['status'] = 'normal';
      let queue = z.currentQueueTime;

      if (occupancyRate >= 92) {
        status = 'critical';
        queue = Math.floor(20 + Math.random() * 10);
      } else if (occupancyRate >= 75) {
        status = 'congested';
        queue = Math.floor(10 + Math.random() * 10);
      } else {
        status = 'normal';
        queue = Math.max(1, Math.floor(1 + Math.random() * 8));
      }

      return {
        ...z,
        currentCount: newCount,
        occupancyRate,
        currentQueueTime: z.type === 'seating' ? 0 : queue,
        status
      };
    });

    // Simulating Utility updates
    const savingMode = this.state.utility.savingModeActive;
    const basePower = savingMode ? 1100 : 1450;
    const powerFluctuation = Math.floor((Math.random() - 0.5) * 80);
    this.state.utility.powerUsageKw = Math.max(800, basePower + powerFluctuation);
    this.state.utility.powerLoadPrediction = this.state.utility.powerUsageKw + 100;

    const baseWater = savingMode ? 140 : 190;
    const waterFluctuation = Math.floor((Math.random() - 0.5) * 20);
    this.state.utility.waterGallonsMin = Math.max(50, baseWater + waterFluctuation);

    // Accumulating sustainability
    this.state.sustainability.wasteRecycledKg += Math.round(Math.random() * 5);
    this.state.sustainability.foodWasteKg += Math.round(Math.random() * 2);
    if (savingMode) {
      this.state.sustainability.energySavedKwh += 2;
      this.state.sustainability.waterSavedGallons += 5;
    }

    return this.state;
  }

  // Incidents
  getIncidents(): Incident[] {
    return this.state.incidents;
  }

  addIncident(incident: Omit<Incident, 'id' | 'timestamp'>): Incident {
    const id = `inc-${this.state.incidents.length + 1}`;
    const newIncident: Incident = {
      id,
      timestamp: new Date().toISOString(),
      ...incident
    };
    this.state.incidents.unshift(newIncident);

    // Auto-alerting system based on security logs: trigger staff reallocation checks
    if (incident.severity === 'critical' || incident.severity === 'high') {
      const secResource = this.state.resources.find(r => r.role === 'security');
      if (secResource && secResource.totalStaff - secResource.allocated > 5) {
        secResource.allocated += 5; // dispatch 5 safety wardens
      }
    }

    return newIncident;
  }

  updateIncident(id: string, updates: Partial<Incident>): Incident | null {
    const incident = this.state.incidents.find(i => i.id === id);
    if (incident) {
      Object.assign(incident, updates);
      return incident;
    }
    return null;
  }

  // Resources
  getResources(): ResourceAllocation[] {
    return this.state.resources;
  }

  updateResources(role: string, staffOnDuty: number): ResourceAllocation | null {
    const res = this.state.resources.find(r => r.role === role);
    if (res) {
      res.onDuty = staffOnDuty;
      res.allocated = Math.min(res.totalStaff, staffOnDuty);
      res.status = (res.allocated < res.totalStaff * 0.7) ? 'understaffed' : 'optimal';
      return res;
    }
    return null;
  }

  // Utility Actions
  setSavingMode(active: boolean): UtilityGrid {
    this.state.utility.savingModeActive = active;
    this.state.utility.gridStatus = active ? 'saving_mode' : 'normal';
    return this.state.utility;
  }
}

export const db = new MemoryDatabase();
