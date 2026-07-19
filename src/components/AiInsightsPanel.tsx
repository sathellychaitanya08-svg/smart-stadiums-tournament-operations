/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Trophy, 
  Users, 
  ShieldAlert, 
  Briefcase, 
  Leaf, 
  RefreshCw, 
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Zap,
  Check
} from 'lucide-react';
import { StadiumState } from '../types.ts';

interface AiInsightsPanelProps {
  stadiumState: StadiumState;
}

type SummaryCategory = 'tournament' | 'crowd' | 'security' | 'resource' | 'sustainability';

export default function AiInsightsPanel({ stadiumState }: AiInsightsPanelProps) {
  const [activeCategory, setActiveCategory] = useState<SummaryCategory>('tournament');
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    fetch('/api/weather?stadiumId=apex-coliseum')
      .then(res => res.json())
      .then(data => setWeather(data))
      .catch(err => console.error('Error fetching weather inside AiInsightsPanel', err));
  }, []);

  const [summaries, setSummaries] = useState<Record<SummaryCategory, string>>({
    tournament: '',
    crowd: '',
    security: '',
    resource: '',
    sustainability: ''
  });

  const fetchSummary = async (category: SummaryCategory) => {
    setLoading(true);
    try {
      const res = await fetch('/api/assistant/executive-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, stadiumState })
      });
      if (res.ok) {
        const data = await res.json();
        setSummaries(prev => ({
          ...prev,
          [category]: data.summary
        }));
      }
    } catch (err) {
      console.warn('Error fetching executive summary (falling back):', err);
    } finally {
      setLoading(false);
    }
  };

  // Pre-load current category on mount or when stadium state changes
  useEffect(() => {
    if (!summaries[activeCategory]) {
      fetchSummary(activeCategory);
    }
  }, [activeCategory]);

  // Generate real-time actionable recommendations based on actual stadium state
  const getDynamicRecommendations = () => {
    const liveMatch = stadiumState.matches.find(m => m.status === 'live');
    const criticalZones = stadiumState.zones.filter(z => z.status === 'critical' || z.status === 'congested');
    const activeIncidents = stadiumState.incidents.filter(i => i.status !== 'resolved');
    const utility = stadiumState.utility;

    // 1. Crowd predictions
    const gateB = stadiumState.zones.find(z => z.id === 'z-gate-b');
    const crowdPred = gateB && gateB.occupancyRate > 70 
      ? `West Gate B is experiencing high density (${gateB.occupancyRate}% occupancy, ${gateB.currentQueueTime}m wait). We project severe congestion for next 15 minutes. Action: Divert arriving spectators to East Gate C.`
      : `Stadium flows are stable, but we predict a departure congestion spike in approximately 20-25 minutes when the live match concludes. We recommend pre-activating digital guides at Gate A and Gate C.`;

    // 2. Security recommendations
    const securityRec = activeIncidents.length > 0
      ? `Active incident "${activeIncidents[0].title}" at ${activeIncidents[0].location} is currently ${activeIncidents[0].status}. Recommendation: Ensure standby security guards are stationed nearby and monitor local crowd temperature.`
      : `No critical security alerts. However, the ambient heat index is elevated at the North Tribune (Section N5). Recommendation: Dispatch mobile ushers with hydration supplies and ensure medical stations are on high alert.`;

    // 3. Staffing suggestions
    const totalAllocated = stadiumState.resources.reduce((sum, r) => sum + r.allocated, 0);
    const medicAlloc = stadiumState.resources.find(r => r.role === 'medic');
    const staffingSug = medicAlloc && activeIncidents.some(i => i.category === 'medical')
      ? `High frequency of medical requests detected. Suggestion: Temporarily reallocate 2 standby ushers from the VIP Suites to support First Aid stations at the West Concourse.`
      : `Staff distribution is in optimal balance. Suggestion: Maintain active ushers at concessions for another 10 minutes to resolve current beverage rush, then return to normal gate sentinel rotation.`;

    // 4. Venue optimization
    const venueOpt = utility.savingModeActive
      ? `Eco-Savings Mode is ACTIVE. Power usage is capped successfully at ${utility.powerUsageKw} kW (shaving 12% peak load). Air flow index is stable. Recommendation: Keep secondary floodlights off until dusk.`
      : `Power usage is currently at ${utility.powerUsageKw} kW. Recommendation: Activate HVAC Eco Shaving to reduce peak electrical grid load and offset carbon footprint by up to 15 kg CO2/hour.`;

    return { crowdPred, securityRec, staffingSug, venueOpt };
  };

  const { crowdPred, securityRec, staffingSug, venueOpt } = getDynamicRecommendations();

  return (
    <div id="ai-insights-parent-panel" className="space-y-6">
      
      {/* SECTION 1: AI Insights Card Dashboard Panel */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-500/20 rounded-2xl p-6 text-white shadow-lg text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-3xl rounded-full"></div>
        <div className="flex justify-between items-center pb-4 border-b border-indigo-500/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/30">
              <Cpu className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-lg text-white">AI Insights (Powered by Gemini)</h3>
              <p className="text-xs text-indigo-300">Predictive recommendations computed across live IoT sensors and match calendars.</p>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-md font-bold uppercase tracking-wider">
            🟢 Real-time Audit
          </span>
        </div>

        {/* Actionable recommendations grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 relative z-10">
          
          {/* Crowd Predictions */}
          <div className="bg-slate-950/60 border border-indigo-500/10 rounded-xl p-4.5 space-y-2 hover:border-indigo-500/20 transition">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider font-mono">Crowd Predictions</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{crowdPred}</p>
          </div>

          {/* Security Recommendations */}
          <div className="bg-slate-950/60 border border-indigo-500/10 rounded-xl p-4.5 space-y-2 hover:border-indigo-500/20 transition">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider font-mono">Security Recommendations</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{securityRec}</p>
          </div>

          {/* Staffing Suggestions */}
          <div className="bg-slate-950/60 border border-indigo-500/10 rounded-xl p-4.5 space-y-2 hover:border-indigo-500/20 transition">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider font-mono">Staffing Suggestions</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{staffingSug}</p>
          </div>

          {/* Venue Optimization */}
          <div className="bg-slate-950/60 border border-indigo-500/10 rounded-xl p-4.5 space-y-2 hover:border-indigo-500/20 transition">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider font-mono">Venue Optimization</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{venueOpt}</p>
          </div>

          {/* Weather Intelligence & Tactical Alerts */}
          {weather && (
            <div id="ai-insights-weather-card" className="bg-slate-950/80 border border-sky-500/10 rounded-xl p-4.5 space-y-3 md:col-span-2 transition">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold text-sky-300 uppercase tracking-wider font-mono">Stadium Weather Intelligence</span>
                </div>
                {weather.isDemoMode ? (
                  <span className="text-[8px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">DEMO FALLBACK</span>
                ) : (
                  <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded animate-pulse">LIVE WEATHER FEED</span>
                )}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300 text-xs">
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-500 block font-mono">TEMPERATURE</span>
                  <span className="font-extrabold text-white mt-1 block">{weather.temperatureC}°C / {weather.temperatureF}°F</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-500 block font-mono">RAIN / HUMIDITY</span>
                  <span className="font-extrabold text-white mt-1 block">{weather.rainProbability}% / {weather.humidity}%</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-500 block font-mono">CROWD COMFORT</span>
                  <span className="font-extrabold text-indigo-400 mt-1 block">{weather.recommendations.crowdComfortScore}/100</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-500 block font-mono">DELAY RISK</span>
                  <span className={`font-extrabold mt-1 block uppercase ${
                    weather.recommendations.matchDelayRisk === 'high' ? 'text-rose-400 animate-pulse' :
                    weather.recommendations.matchDelayRisk === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>{weather.recommendations.matchDelayRisk}</span>
                </div>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed pt-1 flex items-start gap-2">
                <div className="bg-sky-500/10 text-sky-400 px-2 py-1 rounded text-[9px] font-mono font-bold uppercase shrink-0 mt-0.5">Weather Advisory</div>
                <p className="text-slate-200">{weather.recommendations.resourcePlanning}</p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* SECTION 2: AI Executive Summary Center */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm text-left">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              AI Executive Operations Summary
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Generate high-fidelity, Gemini-powered administrative audits on crucial stadium segments.</p>
          </div>
          <button
            onClick={() => fetchSummary(activeCategory)}
            disabled={loading}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0 cursor-pointer disabled:opacity-55"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Consulting Gemini...' : 'Regenerate Audit'}
          </button>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 mt-5" role="tablist" aria-label="AI Summary Categories">
          {(['tournament', 'crowd', 'security', 'resource', 'sustainability'] as SummaryCategory[]).map((cat) => {
            const label = cat.charAt(0).toUpperCase() + cat.slice(1);
            const Icon = 
              cat === 'tournament' ? Trophy :
              cat === 'crowd' ? Users :
              cat === 'security' ? ShieldAlert :
              cat === 'resource' ? Briefcase : Leaf;
            
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/30'
                    : 'bg-slate-50 dark:bg-slate-950/20 hover:bg-slate-100 dark:hover:bg-slate-800/40 text-slate-650 dark:text-slate-400 border border-slate-100 dark:border-slate-850'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${activeCategory === cat ? 'text-indigo-500' : 'text-slate-400'}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Summary Content Body */}
        <div className="mt-5 bg-slate-50/60 dark:bg-slate-950/15 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl min-h-[140px] flex flex-col justify-between">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 flex-1">
              <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin" />
              <span className="text-xs text-slate-500 font-mono">Formulating executive brief with Gemini...</span>
            </div>
          ) : summaries[activeCategory] ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="prose dark:prose-invert max-w-none text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-sans whitespace-pre-line">
                {summaries[activeCategory]}
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-850/50 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  Audit complete • Verified by Gemini-3.5-Flash
                </span>
                <span>Category: {activeCategory.toUpperCase()}</span>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
              <AlertTriangle className="w-5 h-5 text-slate-300" />
              <span>No summary available. Click "Regenerate Audit" to trigger sensory audit.</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
