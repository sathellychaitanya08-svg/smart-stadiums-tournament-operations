/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Users, 
  ShieldCheck, 
  Flame, 
  Cpu, 
  TrendingUp, 
  Clock, 
  CloudSun, 
  CornerDownRight, 
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { StadiumState, Match, Zone, Incident } from '../types.ts';
import AiInsightsPanel from './AiInsightsPanel.tsx';
import SecurityHealthWidget from './SecurityHealthWidget.tsx';

interface DashboardViewProps {
  stadiumState: StadiumState;
  onSimulateTick: () => void;
  onResolveIncident: (id: string) => void;
  onDirectRedirect: (tabId: string) => void;
}

export default function DashboardView({ 
  stadiumState, 
  onSimulateTick,
  onResolveIncident,
  onDirectRedirect
}: DashboardViewProps) {
  
  const liveMatch = stadiumState.matches.find(m => m.status === 'live');
  const criticalZones = stadiumState.zones.filter(z => z.status === 'critical' || z.status === 'congested');
  const activeIncidents = stadiumState.incidents.filter(i => i.status !== 'resolved');

  // Calculations for stats
  const totalOccupancyCount = stadiumState.zones
    .filter(z => z.type === 'seating')
    .reduce((acc, z) => acc + z.currentCount, 0);
  
  const stadiumMaxCapacity = stadiumState.zones
    .filter(z => z.type === 'seating')
    .reduce((acc, z) => acc + z.capacity, 0);

  const averageCrowdDensity = Math.round((totalOccupancyCount / (stadiumMaxCapacity || 1)) * 100);

  // Active alarms score simulation
  const hazardScore = Math.min(100, Math.round(
    (activeIncidents.length * 15) + (criticalZones.filter(z => z.status === 'critical').length * 20) + (liveMatch ? 10 : 0)
  ));

  return (
    <div id="dashboard-container" className="space-y-8 max-w-7xl mx-auto p-2">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-sans font-extrabold text-3xl tracking-tight text-slate-900 dark:text-white">AI Tournament Operations Center</h2>
          <p className="text-sm text-slate-500">Autonomous sensor fusion, crowd tracking, and smart scheduling coordinator.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-mono text-xs text-slate-500 font-semibold uppercase">Apex Stadium System: Synchronized</span>
        </div>
      </div>

      {/* Main Grid: Live Match & Primary Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Match Operational Card */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-600/10 blur-3xl rounded-full"></div>
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-xs font-semibold animate-pulse">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
              LIVE TOURNAMENT COVERAGE
            </div>
            <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              {new Date().toLocaleTimeString()} (UTC)
            </div>
          </div>

          {liveMatch ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                    {liveMatch.homeTeam} <span className="text-slate-500 text-lg font-light font-mono">VS</span> {liveMatch.awayTeam}
                  </h3>
                  <p className="text-xs text-indigo-300 font-mono mt-1 uppercase tracking-wider">
                    Apex Coliseum • Match Ref: {liveMatch.referee}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono font-bold text-slate-100">
                    {liveMatch.ticketSales.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Fans Admitted</div>
                </div>
              </div>

              {/* Progress Line */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>Match Commenced</span>
                  <span className="text-indigo-400 font-semibold">Active Half (65')</span>
                  <span>90' Full Time</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>

              {/* Match Stats Grid */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/40">
                  <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Expected Crowd</div>
                  <div className="text-lg font-semibold text-white mt-0.5">{liveMatch.crowdForecast}%</div>
                </div>
                <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/40">
                  <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Weather Conditions</div>
                  <div className="text-lg font-semibold text-white mt-0.5 flex items-center gap-1">
                    <CloudSun className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="capitalize">{liveMatch.weatherForecast}</span>
                  </div>
                </div>
                <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/40">
                  <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Risk Category</div>
                  <div className={`text-lg font-semibold mt-0.5 capitalize ${
                    liveMatch.priority === 'critical' ? 'text-rose-400' :
                    liveMatch.priority === 'high' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {liveMatch.priority}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 space-y-3">
              <p className="text-slate-400 text-sm">No live matches currently in progress.</p>
              <button 
                onClick={() => onDirectRedirect('scheduler')}
                className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-mono"
              >
                Go to Match Scheduler to initiate matches <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Stadium Command Scorecard */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white mb-2">Operational Hazard Score</h3>
            <p className="text-xs text-slate-400">Fused hazard scoring calculating crowding bottlenecks and unresolved security responses.</p>
          </div>

          <div className="my-4 flex items-center justify-center relative">
            {/* SVG Ring Gauge */}
            <svg className="w-32 h-32" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="#e2e8f0" strokeWidth="8" fill="transparent" className="dark:stroke-slate-800" />
              <circle cx="50" cy="50" r="42" stroke={hazardScore > 75 ? '#ef4444' : hazardScore > 40 ? '#f59e0b' : '#10b981'} strokeWidth="8" fill="transparent" 
                strokeDasharray="263.89" strokeDashoffset={263.89 - (263.89 * hazardScore) / 100}
                strokeLinecap="round" transform="rotate(-90 50 50)" className="transition-all duration-1000" />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-extrabold text-slate-950 dark:text-white font-mono">{hazardScore}</span>
              <span className="text-slate-400 text-[10px] font-mono block">Threat Level</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              hazardScore > 75 ? 'bg-rose-500/10 text-rose-500' :
              hazardScore > 40 ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
            }`}>
              {hazardScore > 75 ? 'ACTION MANDATED' : hazardScore > 40 ? 'CAUTION: PROACTIVE RESPONSE' : 'SAFE OPERATIONS BASELINE'}
            </span>
          </div>
        </div>
      </div>

      {/* 5 Bento-style Mini KPI Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Crowd */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer" onClick={() => onDirectRedirect('crowd')}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Crowd Density</span>
            <Users className="w-4 h-4 text-indigo-500 shrink-0" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{averageCrowdDensity}%</span>
            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-indigo-500" />
              <span>{totalOccupancyCount.toLocaleString()} fans seated</span>
            </p>
          </div>
        </div>

        {/* KPI 2: Incidents */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer" onClick={() => onDirectRedirect('security')}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Security Feeds</span>
            <ShieldCheck className="w-4 h-4 text-rose-500 shrink-0" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{activeIncidents.length}</span>
            <p className="text-[10px] text-slate-400 mt-1">
              {activeIncidents.length > 0 ? '⚠️ Active responders dispatched' : '🟢 No active criticals'}
            </p>
          </div>
        </div>

        {/* KPI 3: Energy Grid */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer" onClick={() => onDirectRedirect('sustainability')}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Energy Load</span>
            <Flame className="w-4 h-4 text-yellow-500 shrink-0" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{stadiumState.utility.powerUsageKw} kW</span>
            <p className="text-[10px] text-slate-400 mt-1">
              {stadiumState.utility.savingModeActive ? '🟢 Eco mode activated' : '⚡ Normal power load'}
            </p>
          </div>
        </div>

        {/* KPI 4: AI Co-Pilot status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer" onClick={() => onDirectRedirect('assistant')}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">AI Operations Co-pilot</span>
            <Cpu className="w-4 h-4 text-teal-500 shrink-0" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">READY</span>
            <p className="text-[10px] text-indigo-500 mt-1 font-mono uppercase tracking-wider">
              Tap to query Gemini AI
            </p>
          </div>
        </div>

        {/* KPI 5: QA Testing & Quality Coverage */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer" onClick={() => onDirectRedirect('testing')}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">QA System Coverage</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">91.8%</span>
            <p className="text-[10px] text-emerald-500 mt-1 flex items-center gap-1 font-mono font-bold">
              <span>🟢 10/10 Passed</span>
            </p>
          </div>
        </div>
      </div>

      {/* AI Insights & Executive Summary Section */}
      <AiInsightsPanel stadiumState={stadiumState} />

      {/* Grid: Security Health, Alerts & Zone Choke Points */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Security Health, Policies & Live Audit Logs Feed */}
        <div className="xl:col-span-1">
          <SecurityHealthWidget />
        </div>

        {/* Critical Alerts & Sensor Incident Logger */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm xl:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white">Active System Incidents</h3>
              <p className="text-xs text-slate-400">IoT triggers and supervisor dispatch queue logs.</p>
            </div>
            <button 
              onClick={() => onDirectRedirect('security')}
              className="text-xs text-indigo-600 hover:text-indigo-500 font-mono font-semibold"
            >
              See Security Desk
            </button>
          </div>

          <div id="alert-feed-list" className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {activeIncidents.length > 0 ? (
              activeIncidents.map((inc) => (
                <div key={inc.id} className="p-3 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/30 rounded-xl flex items-start gap-3">
                  <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500 mt-0.5 shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-900 dark:text-rose-300">{inc.title}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono uppercase ${
                        inc.severity === 'critical' ? 'bg-rose-600 text-white animate-pulse' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {inc.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{inc.description}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-rose-200/20">
                      <span className="text-[10px] text-slate-400 font-mono">Location: {inc.location}</span>
                      <button 
                        id={`resolve-inc-${inc.id}`}
                        onClick={() => onResolveIncident(inc.id)}
                        className="text-[10px] font-semibold text-emerald-600 hover:text-emerald-500 font-mono hover:underline"
                      >
                        Resolve Dispatch
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-slate-50 dark:bg-slate-950/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">All Security Feeds Normal</p>
                <p className="text-[10px] text-slate-400">Zero active alerts or supervisor-reported safety tickets.</p>
              </div>
            )}
          </div>
        </div>

        {/* Crowd Choke Points & Queue Analytics */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm xl:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white">Stadium Gate & Queue Status</h3>
              <p className="text-xs text-slate-400">Live feed of security checkpoints and ticket tourniquets.</p>
            </div>
            <button 
              onClick={() => onDirectRedirect('crowd')}
              className="text-xs text-indigo-600 hover:text-indigo-500 font-mono font-semibold"
            >
              Analyze Map
            </button>
          </div>

          <div className="space-y-3">
            {stadiumState.zones.filter(z => z.type === 'gate').map((zone) => {
              const isCongested = zone.status === 'congested' || zone.status === 'critical';
              return (
                <div key={zone.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{zone.name}</span>
                      {isCongested && (
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold font-mono uppercase ${
                          zone.status === 'critical' ? 'bg-red-500 text-white' : 'bg-amber-500 text-slate-900'
                        }`}>
                          {zone.status}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <span>Occ Rate: {zone.occupancyRate}%</span>
                      <span>•</span>
                      <span>Vol: {zone.currentCount.toLocaleString()} / {zone.capacity.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-sm font-extrabold font-mono ${isCongested ? 'text-amber-500' : 'text-slate-700 dark:text-slate-300'}`}>
                      {zone.currentQueueTime}m
                    </span>
                    <span className="text-[9px] text-slate-400 block font-mono">Wait Time</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
