/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  CornerDownRight, 
  Grid,
  Info,
  Check
} from 'lucide-react';
import { Zone } from '../types.ts';

interface CrowdDashboardProps {
  zones: Zone[];
  onUpdateZone: (id: string, updates: Partial<Zone>) => Promise<boolean>;
}

export default function CrowdDashboard({
  zones,
  onUpdateZone
}: CrowdDashboardProps) {
  const [selectedZoneId, setSelectedZoneId] = useState<string>('z-gate-b'); // default selected West Gate B
  const [manualCount, setManualCount] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    fetch('/api/weather?stadiumId=apex-coliseum')
      .then(res => res.json())
      .then(data => setWeather(data))
      .catch(err => console.error('Error loading weather on Crowd Dashboard', err));
  }, []);

  const selectedZone = zones.find(z => z.id === selectedZoneId) || zones[0];

  const handleUpdateZoneCount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedZone) return;
    setIsUpdating(true);
    setSuccessMsg(false);

    const targetCount = Number(manualCount);
    const rate = Math.round((targetCount / selectedZone.capacity) * 100);

    const success = await onUpdateZone(selectedZone.id, {
      currentCount: targetCount,
      occupancyRate: rate
    });

    setIsUpdating(false);
    if (success) {
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    }
  };

  // Calculations for map styles
  const getZoneColorClass = (zone: Zone) => {
    if (zone.status === 'critical') return 'fill-rose-500/80 stroke-rose-600 animate-pulse';
    if (zone.status === 'congested') return 'fill-amber-500/80 stroke-amber-600';
    return 'fill-emerald-500/80 stroke-emerald-600';
  };

  return (
    <div id="crowd-dashboard-container" className="space-y-8 max-w-7xl mx-auto p-2">
      {/* Header section */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <h2 className="font-sans font-extrabold text-3xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-8 h-8 text-indigo-600" />
          Crowd Intelligence & Sensor Map
        </h2>
        <p className="text-sm text-slate-500">Real-time IoT crowd density streams, checkpoint turnstile flows, and predictive concourse routing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive Stadium Map Layout */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white">Apex Coliseum Tactile Layout</h3>
              <p className="text-xs text-slate-400">Click any sector or gate node to audit live sensor telemetry streams.</p>
            </div>
            {/* Legend */}
            <div className="flex gap-3 text-[10px] font-mono font-semibold">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                <span>Normal</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-amber-500 animate-pulse"></span>
                <span>Congested</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-rose-500 animate-pulse"></span>
                <span>Critical</span>
              </div>
            </div>
          </div>

          {/* Render Vector Map of Stadium */}
          <div className="relative flex justify-center bg-slate-950 rounded-2xl p-6 overflow-hidden border border-slate-800">
            <svg viewBox="0 0 500 400" className="w-full max-w-lg aspect-4/3">
              {/* Outer Stadium Perimeter */}
              <rect x="50" y="50" width="400" height="300" rx="100" className="fill-slate-900 stroke-slate-800" strokeWidth="4" />
              
              {/* Pitch Field Ground */}
              <rect x="150" y="130" width="200" height="140" rx="20" className="fill-emerald-800/20 stroke-emerald-500/30" strokeWidth="2" />
              <line x1="250" y1="130" x2="250" y2="270" className="stroke-emerald-500/20" strokeWidth="2" />
              <circle cx="250" cy="200" r="30" className="fill-none stroke-emerald-500/20" strokeWidth="2" />

              {/* Seating Sectors (Interactive clickable wedges/polygons) */}
              {/* North Tribune */}
              <path 
                d="M 120 100 L 380 100 L 330 140 L 170 140 Z" 
                onClick={() => { setSelectedZoneId('z-seat-n'); setManualCount(zones.find(z => z.id === 'z-seat-n')?.currentCount || 0); }}
                className={`cursor-pointer transition-colors duration-200 ${getZoneColorClass(zones.find(z => z.id === 'z-seat-n')!)} ${selectedZoneId === 'z-seat-n' ? 'stroke-white stroke-2' : ''}`}
              />
              <text x="250" y="120" className="fill-slate-100 text-[10px] font-mono pointer-events-none text-center font-bold" textAnchor="middle">North Supporters</text>

              {/* West Grandstand */}
              <path 
                d="M 90 120 L 140 160 L 140 240 L 90 280 Z" 
                onClick={() => { setSelectedZoneId('z-seat-w'); setManualCount(zones.find(z => z.id === 'z-seat-w')?.currentCount || 0); }}
                className={`cursor-pointer transition-colors duration-200 ${getZoneColorClass(zones.find(z => z.id === 'z-seat-w')!)} ${selectedZoneId === 'z-seat-w' ? 'stroke-white stroke-2' : ''}`}
              />
              <text x="110" y="200" className="fill-slate-100 text-[10px] font-mono pointer-events-none font-bold" transform="rotate(-90 110 200)" textAnchor="middle">West Grandstand</text>

              {/* East Grandstand */}
              <path 
                d="M 410 120 L 360 160 L 360 240 L 410 280 Z" 
                onClick={() => { setSelectedZoneId('z-seat-e'); setManualCount(zones.find(z => z.id === 'z-seat-e')?.currentCount || 0); }}
                className={`cursor-pointer transition-colors duration-200 ${getZoneColorClass(zones.find(z => z.id === 'z-seat-e')!)} ${selectedZoneId === 'z-seat-e' ? 'stroke-white stroke-2' : ''}`}
              />
              <text x="390" y="200" className="fill-slate-100 text-[10px] font-mono pointer-events-none font-bold" transform="rotate(90 390 200)" textAnchor="middle">East Grandstand</text>

              {/* South VIP suites */}
              <path 
                d="M 120 300 L 380 300 L 330 260 L 170 260 Z" 
                onClick={() => { setSelectedZoneId('z-seat-s'); setManualCount(zones.find(z => z.id === 'z-seat-s')?.currentCount || 0); }}
                className={`cursor-pointer transition-colors duration-200 ${getZoneColorClass(zones.find(z => z.id === 'z-seat-s')!)} ${selectedZoneId === 'z-seat-s' ? 'stroke-white stroke-2' : ''}`}
              />
              <text x="250" y="285" className="fill-slate-100 text-[10px] font-mono pointer-events-none text-center font-bold" textAnchor="middle">South VIP Club</text>

              {/* GATES (Outer circles) */}
              {/* Gate A */}
              <circle 
                cx="250" cy="40" r="14" 
                onClick={() => { setSelectedZoneId('z-gate-a'); setManualCount(zones.find(z => z.id === 'z-gate-a')?.currentCount || 0); }}
                className={`cursor-pointer transition-colors duration-200 ${getZoneColorClass(zones.find(z => z.id === 'z-gate-a')!)} ${selectedZoneId === 'z-gate-a' ? 'stroke-white stroke-2' : ''}`} 
              />
              <text x="250" y="44" className="fill-slate-900 text-[9px] font-mono font-extrabold pointer-events-none" textAnchor="middle">GA</text>

              {/* Gate B */}
              <circle 
                cx="40" cy="200" r="14" 
                onClick={() => { setSelectedZoneId('z-gate-b'); setManualCount(zones.find(z => z.id === 'z-gate-b')?.currentCount || 0); }}
                className={`cursor-pointer transition-colors duration-200 ${getZoneColorClass(zones.find(z => z.id === 'z-gate-b')!)} ${selectedZoneId === 'z-gate-b' ? 'stroke-white stroke-2' : ''}`} 
              />
              <text x="40" y="204" className="fill-slate-900 text-[9px] font-mono font-extrabold pointer-events-none" textAnchor="middle">GB</text>

              {/* Gate C */}
              <circle 
                cx="460" cy="200" r="14" 
                onClick={() => { setSelectedZoneId('z-gate-c'); setManualCount(zones.find(z => z.id === 'z-gate-c')?.currentCount || 0); }}
                className={`cursor-pointer transition-colors duration-200 ${getZoneColorClass(zones.find(z => z.id === 'z-gate-c')!)} ${selectedZoneId === 'z-gate-c' ? 'stroke-white stroke-2' : ''}`} 
              />
              <text x="460" y="204" className="fill-slate-900 text-[9px] font-mono font-extrabold pointer-events-none" textAnchor="middle">GC</text>

              {/* Gate D */}
              <circle 
                cx="250" cy="360" r="14" 
                onClick={() => { setSelectedZoneId('z-gate-d'); setManualCount(zones.find(z => z.id === 'z-gate-d')?.currentCount || 0); }}
                className={`cursor-pointer transition-colors duration-200 ${getZoneColorClass(zones.find(z => z.id === 'z-gate-d')!)} ${selectedZoneId === 'z-gate-d' ? 'stroke-white stroke-2' : ''}`} 
              />
              <text x="250" y="364" className="fill-slate-900 text-[9px] font-mono font-extrabold pointer-events-none" textAnchor="middle">GD</text>
            </svg>
          </div>
        </div>

        {/* Selected Zone Telemetry and Control panel */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight">{selectedZone.name}</h4>
                <span className="text-[10px] font-mono text-slate-400 capitalize">{selectedZone.type} Sensor Hub</span>
              </div>
            </div>

            {/* Alarm box if congested */}
            {selectedZone.alertMessage && (
              <div className="p-3.5 mb-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-900 dark:text-amber-400 rounded-xl flex items-start gap-2 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0 animate-bounce" />
                <p className="font-semibold">{selectedZone.alertMessage}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-center mb-6">
              <div className="bg-slate-50 dark:bg-slate-950/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Occupancy</span>
                <span className={`text-xl font-extrabold font-mono block mt-1 ${
                  selectedZone.status === 'critical' ? 'text-rose-500' :
                  selectedZone.status === 'congested' ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  {selectedZone.occupancyRate}%
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Queue Delay</span>
                <span className="text-xl font-extrabold font-mono block text-slate-800 dark:text-white mt-1">
                  {selectedZone.type === 'seating' ? 'N/A' : `${selectedZone.currentQueueTime} min`}
                </span>
              </div>
            </div>

            {/* Details list */}
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 mb-6 font-mono border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="flex justify-between">
                <span>Current headcount:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">{selectedZone.currentCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Sensor Capacity:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">{selectedZone.capacity.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Thermal Status:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200 capitalize">{selectedZone.status}</span>
              </div>
            </div>

            {/* Weather-Crowd Comfort Influence metrics */}
            {weather && (
              <div id="crowd-weather-comfort-metrics" className="bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/60 p-4 rounded-xl mb-4 text-xs space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider block">Weather Impact & Comfort</span>
                  {weather.isDemoMode ? (
                    <span className="text-[8px] font-mono font-bold bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/10">DEMO</span>
                  ) : (
                    <span className="text-[8px] font-mono font-bold bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded border border-emerald-500/10 animate-pulse">LIVE</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-slate-700 dark:text-slate-300">
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800/60 flex flex-col justify-center">
                    <span className="text-[8px] text-slate-400 font-mono block">TEMP / UV</span>
                    <span className="text-[11px] font-bold font-mono text-slate-900 dark:text-white mt-0.5">{weather.temperatureC}°C (UV: {weather.uvIndex})</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800/60 flex flex-col justify-center">
                    <span className="text-[8px] text-slate-400 font-mono block">COMFORT SCORE</span>
                    <span className="text-[11px] font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">{weather.recommendations.crowdComfortScore}/100</span>
                  </div>
                </div>
                {weather.recommendations.heatRiskAlert && (
                  <p className="text-[10px] text-rose-500 font-semibold leading-tight font-sans">
                    🥵 HEAT THREAT: Elevated UV is increasing hydration fatigue. Expect high concession/beverage congestion.
                  </p>
                )}
                {weather.recommendations.rainAlert && (
                  <p className="text-[10px] text-sky-500 font-semibold leading-tight font-sans">
                    🌧️ WET THREAT: High rain risk may trigger spectator grouping in covered concourses and gate areas.
                  </p>
                )}
                {!weather.recommendations.heatRiskAlert && !weather.recommendations.rainAlert && (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold leading-tight font-sans">
                    🟢 Normal operations: Weather conditions are comfortable. Low risk of crowd bundling.
                  </p>
                )}
              </div>
            )}

            {/* Manual Override Form */}
            <form onSubmit={handleUpdateZoneCount} className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">Manual Sensory Override</span>
              <div className="flex gap-2">
                <input
                  id="manual-count-input"
                  type="number"
                  max={selectedZone.capacity}
                  min="0"
                  value={manualCount}
                  onChange={(e) => setManualCount(Number(e.target.value))}
                  placeholder="Set headcount count"
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-transparent text-slate-800 dark:text-white font-mono"
                />
                <button
                  id="override-sensor-btn"
                  type="submit"
                  disabled={isUpdating}
                  className="py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold rounded-lg transition shrink-0"
                >
                  Override
                </button>
              </div>
              {successMsg && (
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Sensor overridden successfully.
                </div>
              )}
            </form>
          </div>

          {/* AI Predicted flow analytics */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white">
            <h4 className="font-sans font-bold text-base text-white mb-2 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-400 shrink-0" />
              AI Fan-Flow Forecast (+30m)
            </h4>
            <p className="text-xs text-slate-400 mb-4">Gemini-modelled proactive entry rerouting queues.</p>

            <div className="space-y-3 font-mono text-[11px]">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Gate A Wait Time</span>
                  <span className="text-emerald-400">Stable (10m)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Gate B Wait Time</span>
                  <span className="text-amber-400 font-bold">Peaking (32m)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Gate C Wait Time</span>
                  <span className="text-emerald-400">Clearing (3m)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-indigo-950/50 border border-indigo-900/40 rounded-xl text-[10px] text-indigo-300">
              <span className="font-bold uppercase tracking-wider block mb-1">AI Proactive Intervention:</span>
              Diverting Gate B overflow to East Gate C can reduce aggregate entry queues by 12 minutes platform-wide.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
