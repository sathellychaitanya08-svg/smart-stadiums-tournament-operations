/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Briefcase, 
  Flame, 
  Droplet, 
  Sliders, 
  CheckCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Leaf,
  RefreshCw,
  Power
} from 'lucide-react';
import { ResourceAllocation, UtilityGrid } from '../types.ts';

interface ResourceViewProps {
  resources: ResourceAllocation[];
  utility: UtilityGrid;
  onUpdateResources: (role: string, staffOnDuty: number) => Promise<boolean>;
  onToggleSavingMode: (active: boolean) => Promise<boolean>;
}

export default function ResourceView({
  resources,
  utility,
  onUpdateResources,
  onToggleSavingMode
}: ResourceViewProps) {
  // Local adjustment state
  const [securityOnDuty, setSecurityOnDuty] = useState(resources.find(r => r.role === 'security')?.onDuty || 145);
  const [medicOnDuty, setMedicOnDuty] = useState(resources.find(r => r.role === 'medic')?.onDuty || 12);
  const [usherOnDuty, setUsherOnDuty] = useState(resources.find(r => r.role === 'usher')?.onDuty || 110);
  const [custodianOnDuty, setCustodianOnDuty] = useState(resources.find(r => r.role === 'custodian')?.onDuty || 42);

  const [savingModeLoading, setSavingModeLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleStaffChange = async (role: string, val: number, setter: (v: number) => void) => {
    setter(val);
    await onUpdateResources(role, val);
  };

  const handleToggleEco = async () => {
    setSavingModeLoading(true);
    const newMode = !utility.savingModeActive;
    const success = await onToggleSavingMode(newMode);
    setSavingModeLoading(false);
    if (success) {
      setSuccessMsg(newMode ? 'Eco-Savings Mode Engaged.' : 'Normal High-Output Power Mode Engaged.');
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  return (
    <div id="resources-container" className="space-y-8 max-w-7xl mx-auto p-2">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <h2 className="font-sans font-extrabold text-3xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Briefcase className="w-8 h-8 text-indigo-600" />
          Resource Optimization Center
        </h2>
        <p className="text-sm text-slate-500">Configure safety marshal deployments, dispatch stewards, and balance power grid loads dynamically.</p>
      </div>

      {/* Grid: Staff deployment controls & Utility Grid controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Staff deployment panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-500" />
              Dynamic Staff Deployment Desk
            </h3>
            <p className="text-xs text-slate-400">Shift on-duty staff quotas to cover stadium gate crowding and medical alerts.</p>
          </div>

          <div className="space-y-5">
            {/* Security */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-slate-700 dark:text-slate-300">Security Officers On Duty</span>
                <span className="text-indigo-600 font-bold">{securityOnDuty} / 180 (Limit)</span>
              </div>
              <input
                id="slider-security"
                type="range"
                min="50"
                max="180"
                value={securityOnDuty}
                onChange={(e) => handleStaffChange('security', Number(e.target.value), setSecurityOnDuty)}
                className="w-full accent-indigo-600 h-1 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="text-[10px] text-slate-400 flex justify-between font-mono">
                <span>Min: 50 Officers</span>
                <span className={securityOnDuty < 110 ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>
                  {securityOnDuty < 110 ? '⚠️ Understaffed Alert' : '✓ Guard levels optimal'}
                </span>
              </div>
            </div>

            {/* Medics */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-slate-700 dark:text-slate-300">Paramedic / Medic Dispatch</span>
                <span className="text-indigo-600 font-bold">{medicOnDuty} / 30 (Limit)</span>
              </div>
              <input
                id="slider-medic"
                type="range"
                min="5"
                max="30"
                value={medicOnDuty}
                onChange={(e) => handleStaffChange('medic', Number(e.target.value), setMedicOnDuty)}
                className="w-full accent-indigo-600 h-1 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="text-[10px] text-slate-400 flex justify-between font-mono">
                <span>Min: 5 Medics</span>
                <span className="text-emerald-500 font-bold">✓ Response times normal</span>
              </div>
            </div>

            {/* Ushers */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-slate-700 dark:text-slate-300">Ushers & Ticketing Stewards</span>
                <span className="text-indigo-600 font-bold">{usherOnDuty} / 120 (Limit)</span>
              </div>
              <input
                id="slider-usher"
                type="range"
                min="30"
                max="120"
                value={usherOnDuty}
                onChange={(e) => handleStaffChange('usher', Number(e.target.value), setUsherOnDuty)}
                className="w-full accent-indigo-600 h-1 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="text-[10px] text-slate-400 flex justify-between font-mono">
                <span>Min: 30 Ushers</span>
                <span className="text-emerald-500 font-bold">✓ Gate flow support optimal</span>
              </div>
            </div>

            {/* Custodians */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-slate-700 dark:text-slate-300">Custodial & Waste Staff</span>
                <span className="text-indigo-600 font-bold">{custodianOnDuty} / 50 (Limit)</span>
              </div>
              <input
                id="slider-custodian"
                type="range"
                min="10"
                max="50"
                value={custodianOnDuty}
                onChange={(e) => handleStaffChange('custodian', Number(e.target.value), setCustodianOnDuty)}
                className="w-full accent-indigo-600 h-1 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="text-[10px] text-slate-400 flex justify-between font-mono">
                <span>Min: 10 Custodians</span>
                <span className="text-emerald-500 font-bold">✓ Arena recycling active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Utility Grid Optimizations */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-1.5 mb-6">
              <div className="flex justify-between items-center">
                <h3 className="font-sans font-bold text-lg flex items-center gap-2">
                  <Flame className="w-5 h-5 text-yellow-500" />
                  Smart Grid Utility Manager
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                  utility.savingModeActive 
                    ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' 
                    : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                }`}>
                  {utility.gridStatus.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400">Lock non-essential systems to preserve power capacity and water grids during full spectator matches.</p>
            </div>

            {/* Utility graphs */}
            <div className="space-y-5 mb-6 font-mono text-xs">
              {/* Power */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Current Power Usage</span>
                  <span className="text-yellow-400 font-bold">{utility.powerUsageKw} kW / {utility.powerLimitKw} kW limit</span>
                </div>
                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-yellow-400 rounded-full transition-all duration-300" style={{ width: `${(utility.powerUsageKw / utility.powerLimitKw) * 100}%` }}></div>
                </div>
              </div>

              {/* Water */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Inflow Water Pressure</span>
                  <span className="text-blue-400 font-bold">{utility.waterGallonsMin} GPM / {utility.waterLimitGallons} GPM Limit</span>
                </div>
                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${(utility.waterGallonsMin / utility.waterLimitGallons) * 100}%` }}></div>
                </div>
              </div>
            </div>

            {/* Eco Saving Switch button */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <button
                id="toggle-eco-mode-btn"
                onClick={handleToggleEco}
                disabled={savingModeLoading}
                className={`w-full py-3 px-4 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-2 ${
                  utility.savingModeActive
                    ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/10'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
                }`}
              >
                <Power className="w-4 h-4 shrink-0" />
                {utility.savingModeActive ? 'Eco-Savings Mode Active (Disengage)' : 'Engage Smart Eco-Savings Mode'}
              </button>

              {successMsg && (
                <p className="text-[10px] text-teal-400 font-mono text-center font-bold">
                  ✓ {successMsg}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-teal-500/10 rounded-2xl text-teal-500 shrink-0">
              <Leaf className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-white">CO2 Energy Reduction Impact</h4>
              <p className="text-xs text-slate-400 mt-0.5">ArenaOps eco mode reduces aggregate power grid draw by 18%, saving approximately 380kg of carbon emissions per Live Match.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
