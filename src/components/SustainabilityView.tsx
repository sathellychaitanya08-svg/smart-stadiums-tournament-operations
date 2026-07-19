/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Leaf, 
  Trash2, 
  Bus, 
  Car, 
  Train, 
  ShieldCheck, 
  Calculator,
  Flame,
  ArrowDownCircle,
  HelpCircle
} from 'lucide-react';
import { SustainabilityMetric } from '../types.ts';

interface SustainabilityViewProps {
  metrics: SustainabilityMetric;
}

export default function SustainabilityView({
  metrics
}: SustainabilityViewProps) {
  // Transit calculator inputs
  const [fansTrain, setFansTrain] = useState(40); // 40% take trains
  const [fansBus, setFansBus] = useState(25); // 25% take bus
  const [fansCar, setFansCar] = useState(35); // 35% take cars (petrol)

  // Recalculating simulated Co2 emissions
  // Total fans = 50,000 as standard
  const totalFans = 50000;
  const co2PerTrainFan = 0.15; // kg
  const co2PerBusFan = 0.35; // kg
  const co2PerCarFan = 2.4; // kg

  const calculatedCo2 = Math.round(
    (totalFans * (fansTrain / 100) * co2PerTrainFan) +
    (totalFans * (fansBus / 100) * co2PerBusFan) +
    (totalFans * (fansCar / 100) * co2PerCarFan)
  );

  const targetCo2 = metrics.targetTransitCo2Kg;
  const co2SavingsPercent = Math.max(0, Math.round(((targetCo2 - calculatedCo2) / targetCo2) * 100));

  return (
    <div id="sustainability-container" className="space-y-8 max-w-7xl mx-auto p-2">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <h2 className="font-sans font-extrabold text-3xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Leaf className="w-8 h-8 text-emerald-600" />
          Sustainability & Eco Dashboard
        </h2>
        <p className="text-sm text-slate-500">Track carbon footprints, food waste composting pipelines, and interactive transit simulators.</p>
      </div>

      {/* Grid: Eco stats cards & Transit offset calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Statistics list */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white">Active Eco Conservation Telemetry</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Metric 1 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Solid Waste Recycled</span>
                <Trash2 className="w-4 h-4 text-emerald-500 shrink-0" />
              </div>
              <div className="mt-4">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {metrics.wasteRecycledKg.toLocaleString()} kg
                </span>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (metrics.wasteRecycledKg / metrics.targetWasteRecycledKg) * 100)}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono block mt-1.5">Goal: {metrics.targetWasteRecycledKg.toLocaleString()} kg / match</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Food Waste Composted</span>
                <Leaf className="w-4 h-4 text-amber-500 shrink-0" />
              </div>
              <div className="mt-4">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {metrics.foodWasteKg.toLocaleString()} kg
                </span>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, (metrics.foodWasteKg / metrics.targetFoodWasteKg) * 100)}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono block mt-1.5">Goal Limit: Under {metrics.targetFoodWasteKg.toLocaleString()} kg</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Cumulative Grid Power Saved</span>
                <Flame className="w-4 h-4 text-teal-500 shrink-0" />
              </div>
              <div className="mt-4">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {metrics.energySavedKwh.toLocaleString()} kWh
                </span>
                <span className="text-[10px] text-slate-400 font-mono block mt-2">Generated by Eco-Savings Mode activations</span>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Sewer Inflow Water Saved</span>
                <ArrowDownCircle className="w-4 h-4 text-blue-500 shrink-0" />
              </div>
              <div className="mt-4">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {metrics.waterSavedGallons.toLocaleString()} Gal
                </span>
                <span className="text-[10px] text-slate-400 font-mono block mt-2">Saved via smart concourse restroom sensors</span>
              </div>
            </div>

          </div>

          {/* Eco Certifications Box */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-300">ISO 20121 - Sustainable Event Certified</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Apex Coliseum operations adhere to strict international requirements for green stadium design, carbon calculation transparency, and composting pipelines.</p>
            </div>
          </div>
        </div>

        {/* Dynamic Transit Carbon Footprint Calculator */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white flex items-center gap-1.5">
              <Calculator className="w-5 h-5 text-emerald-500" />
              Fan Transit Carbon Calculator
            </h3>
            <p className="text-xs text-slate-400">Simulate fan transportation splits to estimate greenhouse gas (CO2) impact and evaluate transit incentives.</p>
          </div>

          <div className="space-y-4">
            {/* Trains */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <Train className="w-3.5 h-3.5 text-emerald-500" />
                  Train / Metro Transit
                </span>
                <span className="font-bold text-slate-850 dark:text-slate-100">{fansTrain}%</span>
              </div>
              <input
                id="fans-train-slider"
                type="range"
                min="10"
                max="80"
                value={fansTrain}
                onChange={(e) => {
                  const train = Number(e.target.value);
                  setFansTrain(train);
                  // adjust the other two dynamically to keep total 100
                  const diff = 100 - train;
                  setFansBus(Math.round(diff * 0.4));
                  setFansCar(Math.round(diff * 0.6));
                }}
                className="w-full accent-emerald-500 h-1 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Bus */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <Bus className="w-3.5 h-3.5 text-blue-500" />
                  Electric Shuttle Bus
                </span>
                <span className="font-bold text-slate-850 dark:text-slate-100">{fansBus}%</span>
              </div>
              <input
                id="fans-bus-slider"
                type="range"
                min="10"
                max="80"
                value={fansBus}
                onChange={(e) => {
                  const bus = Number(e.target.value);
                  setFansBus(bus);
                  const diff = 100 - bus;
                  setFansTrain(Math.round(diff * 0.5));
                  setFansCar(Math.round(diff * 0.5));
                }}
                className="w-full accent-emerald-500 h-1 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Cars */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <Car className="w-3.5 h-3.5 text-rose-500" />
                  Petrol Passenger Cars
                </span>
                <span className="font-bold text-slate-850 dark:text-slate-100">{fansCar}%</span>
              </div>
              <input
                id="fans-car-slider"
                type="range"
                min="5"
                max="80"
                value={fansCar}
                onChange={(e) => {
                  const car = Number(e.target.value);
                  setFansCar(car);
                  const diff = 100 - car;
                  setFansTrain(Math.round(diff * 0.6));
                  setFansBus(Math.round(diff * 0.4));
                }}
                className="w-full accent-emerald-500 h-1 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Estimated GHG footprint:</span>
              <span className={`font-bold ${calculatedCo2 < targetCo2 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {calculatedCo2.toLocaleString()} kg CO2
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Emissions Target Limit:</span>
              <span>{targetCo2.toLocaleString()} kg</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
              {calculatedCo2 < targetCo2 ? (
                <div className="text-emerald-500 font-bold">
                  ✓ Target Met! Savings: {co2SavingsPercent}%
                </div>
              ) : (
                <div className="text-rose-500 font-bold">
                  ⚠️ Limit Exceeded. Incentivize train travel!
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
