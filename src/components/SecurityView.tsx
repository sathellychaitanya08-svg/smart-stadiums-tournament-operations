/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Eye, 
  Plus, 
  Sparkles, 
  AlertOctagon, 
  FileText, 
  Heart, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  BellRing
} from 'lucide-react';
import { Incident, IncidentCategory, IncidentSeverity } from '../types.ts';

interface SecurityViewProps {
  incidents: Incident[];
  onAddIncident: (incData: Omit<Incident, 'id' | 'timestamp'>) => Promise<boolean>;
  onResolveIncident: (id: string) => void;
}

export default function SecurityView({
  incidents,
  onAddIncident,
  onResolveIncident
}: SecurityViewProps) {
  // Incident Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('security');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState<IncidentSeverity>('medium');
  const [responder, setResponder] = useState('');

  // AI assessment state
  const [aiReport, setAiReport] = useState<string>('');
  const [isLoadingRisk, setIsLoadingRisk] = useState(false);
  const [weather, setWeather] = useState<any>(null);

  React.useEffect(() => {
    fetch('/api/weather?stadiumId=apex-coliseum')
      .then(res => res.json())
      .then(data => setWeather(data))
      .catch(err => console.error('Error fetching weather on SecurityView', err));
  }, []);

  // emergency guide states
  const [selectedIncId, setSelectedIncId] = useState<string>('inc-1');
  const [aiGuide, setAiGuide] = useState<string>('');
  const [isLoadingGuide, setIsLoadingGuide] = useState(false);

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notif, setNotif] = useState(false);

  const handleSubmitIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location) return;
    setIsSubmitting(true);
    
    const success = await onAddIncident({
      title,
      category,
      description,
      location,
      severity,
      status: 'reported',
      responderAllocated: responder || 'Security Standby'
    });

    setIsSubmitting(false);
    if (success) {
      setNotif(true);
      setTitle('');
      setDescription('');
      setLocation('');
      setResponder('');
      setTimeout(() => setNotif(false), 4000);
    }
  };

  const triggerRiskPrediction = async () => {
    setIsLoadingRisk(true);
    setAiReport('');
    try {
      const res = await fetch('/api/security/ai-risk-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setAiReport(data.prediction);
    } catch (e) {
      setAiReport('Error evaluating dynamic stadium risks. AI Core offline.');
    } finally {
      setIsLoadingRisk(false);
    }
  };

  const triggerEmergencyGuide = async (inc: Incident) => {
    setIsLoadingGuide(true);
    setAiGuide('');
    try {
      const prompt = `Create a strict 4-bullet point first-responder operational guide for the stadium incident:
Title: ${inc.title}
Severity: ${inc.severity}
Location: ${inc.location}
Details: ${inc.description}
Include radio channels, dispatch speed, and crowd cordon safety instructions.`;

      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ sender: 'user', text: prompt }]
        })
      });
      const data = await res.json();
      setAiGuide(data.reply);
    } catch (e) {
      setAiGuide('Error generating operational protocol guidelines.');
    } finally {
      setIsLoadingGuide(false);
    }
  };

  return (
    <div id="security-container" className="space-y-8 max-w-7xl mx-auto p-2">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <h2 className="font-sans font-extrabold text-3xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-8 h-8 text-rose-600" />
          Security Monitoring & Risk Prediction
        </h2>
        <p className="text-sm text-slate-500">Autonomous CCTV simulation monitoring, emergency loggers, and dynamic AI-powered threat analysis.</p>
      </div>

      {/* Grid: CCTV Camera matrix */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 text-white space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-400 shrink-0" />
            <h3 className="font-sans font-bold text-base">CCTV Simulated Digital Streams</h3>
          </div>
          <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest animate-pulse">4 LIVE FEEDS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Feed 1 */}
          <div className="aspect-video bg-slate-900 border border-slate-850 rounded-xl relative overflow-hidden flex items-center justify-center">
            <span className="absolute left-2.5 top-2.5 font-mono text-[9px] bg-slate-950/80 px-1.5 py-0.5 rounded text-slate-300">CAM-01 (Gate A Entrance)</span>
            <div className="space-y-1 text-center">
              <Eye className="w-6 h-6 text-slate-700 mx-auto animate-pulse" />
              <span className="text-[10px] font-mono text-slate-500">Video active [30fps]</span>
            </div>
            <div className="absolute right-2 bottom-2 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
          </div>
          {/* Feed 2 */}
          <div className="aspect-video bg-slate-900 border border-slate-850 rounded-xl relative overflow-hidden flex items-center justify-center">
            <span className="absolute left-2.5 top-2.5 font-mono text-[9px] bg-slate-950/80 px-1.5 py-0.5 rounded text-slate-300">CAM-02 (West Gate B)</span>
            <div className="space-y-1 text-center">
              <Eye className="w-6 h-6 text-slate-700 mx-auto animate-pulse" style={{ animationDelay: '0.4s' }} />
              <span className="text-[10px] font-mono text-slate-500">Active crowd tracking</span>
            </div>
            <div className="absolute right-2 bottom-2 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
          </div>
          {/* Feed 3 */}
          <div className="aspect-video bg-slate-900 border border-slate-850 rounded-xl relative overflow-hidden flex items-center justify-center">
            <span className="absolute left-2.5 top-2.5 font-mono text-[9px] bg-slate-950/80 px-1.5 py-0.5 rounded text-slate-300">CAM-03 (North Tribune Ultra)</span>
            <div className="space-y-1 text-center text-amber-400">
              <Eye className="w-6 h-6 text-amber-500/80 mx-auto animate-bounce" />
              <span className="text-[10px] font-mono text-amber-500/80">Visual Congestion Alert</span>
            </div>
            <div className="absolute right-2 bottom-2 w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></div>
          </div>
          {/* Feed 4 */}
          <div className="aspect-video bg-slate-900 border border-slate-850 rounded-xl relative overflow-hidden flex items-center justify-center">
            <span className="absolute left-2.5 top-2.5 font-mono text-[9px] bg-slate-950/80 px-1.5 py-0.5 rounded text-slate-300">CAM-04 (VIP Suites)</span>
            <div className="space-y-1 text-center">
              <Eye className="w-6 h-6 text-slate-700 mx-auto animate-pulse" style={{ animationDelay: '0.8s' }} />
              <span className="text-[10px] font-mono text-slate-500">Field panorama lock</span>
            </div>
            <div className="absolute right-2 bottom-2 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Grid splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Incident Logger Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs h-fit">
          <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-1.5">
            <Plus className="w-5 h-5 text-indigo-500" />
            Log Operational Safety Incident
          </h3>

          <form onSubmit={handleSubmitIncident} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-500 uppercase">Incident Summary</label>
              <input
                id="inc-title-input"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Minor Slip near Food Stall"
                className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-transparent text-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-500 uppercase">Category</label>
                <select
                  id="inc-category-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-transparent text-slate-800 dark:text-white"
                >
                  <option value="security">Security / Crowd</option>
                  <option value="medical">Medical emergency</option>
                  <option value="facility">Facility hazard</option>
                  <option value="fire">Fire threat</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-500 uppercase">Severity</label>
                <select
                  id="inc-severity-input"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-transparent text-slate-800 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-500 uppercase">Operational Location</label>
              <input
                id="inc-location-input"
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Section B2 level 1 concourse"
                className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-transparent text-slate-800 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-500 uppercase">Responder Dispatch Allocation</label>
              <input
                id="inc-responder-input"
                type="text"
                value={responder}
                onChange={(e) => setResponder(e.target.value)}
                placeholder="e.g. Warden Patrol Team 4"
                className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-transparent text-slate-800 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-500 uppercase">Context Details</label>
              <textarea
                id="inc-desc-input"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe emergency parameters..."
                className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-transparent text-slate-800 dark:text-white"
              />
            </div>

            <button
              id="report-incident-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold rounded-lg transition"
            >
              {isSubmitting ? 'Logging...' : 'Log Security Incident'}
            </button>

            {notif && (
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono text-center">
                ✓ Incident dispatched to local precinct and logged.
              </div>
            )}
          </form>
        </div>

        {/* Incidents Queue & Emergency responder checklists */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Risk predictor block */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
                <h4 className="font-sans font-bold text-base text-white">Dynamic AI Risk & Hazard Audit</h4>
              </div>
              <button
                id="run-risk-audit-btn"
                onClick={triggerRiskPrediction}
                disabled={isLoadingRisk}
                className="py-1.5 px-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10px] font-semibold rounded-lg transition disabled:opacity-50"
              >
                {isLoadingRisk ? 'Analyzing Sensor Signals...' : 'Run Dynamic Risk Audit'}
              </button>
            </div>

            {/* Meteorological Security Risk Advisory */}
            {weather && (
              <div id="security-weather-advisory" className="p-4 bg-slate-950/60 border border-slate-850 rounded-xl space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Meteorological Threat Assessment</span>
                  {weather.isDemoMode ? (
                    <span className="text-[8px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">DEMO MODE</span>
                  ) : (
                    <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded animate-pulse">LIVE WEATHER DATA</span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-slate-900/60 p-2 rounded border border-slate-850">
                    <span className="text-[8px] text-slate-500 font-mono block uppercase">TEMPERATURE</span>
                    <span className="font-bold text-slate-200 mt-0.5 block">{weather.temperatureC}°C ({weather.temperatureF}°F)</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded border border-slate-850">
                    <span className="text-[8px] text-slate-500 font-mono block uppercase">RAIN RISK / HUMIDITY</span>
                    <span className="font-bold text-slate-200 mt-0.5 block">{weather.rainProbability}% / {weather.humidity}%</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded border border-slate-850">
                    <span className="text-[8px] text-slate-500 font-mono block uppercase">MATCH DELAY RISK</span>
                    <span className={`font-bold mt-0.5 block uppercase ${
                      weather.recommendations.matchDelayRisk === 'high' ? 'text-rose-400 animate-pulse' :
                      weather.recommendations.matchDelayRisk === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>{weather.recommendations.matchDelayRisk}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 leading-normal">
                  <span className="font-semibold text-indigo-400 font-mono text-[9px] uppercase tracking-wider block">Security Actionable Recommendation:</span>
                  <p className="text-slate-200 mt-0.5">{weather.recommendations.resourcePlanning}</p>
                </div>
              </div>
            )}

            {aiReport ? (
              <div id="risk-assessment-report" className="p-4 bg-slate-950/80 border border-indigo-900/40 rounded-xl font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {aiReport}
              </div>
            ) : (
              <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl text-center text-xs text-slate-400 font-mono">
                Click "Run Dynamic Risk Audit" to evaluate current stadium hazards using Gemini AI.
              </div>
            )}
          </div>

          {/* Active incidents grid */}
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-lg text-slate-900 dark:text-white flex items-center gap-1.5">
              <AlertOctagon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              Active Operations Queue ({incidents.filter(i => i.status !== 'resolved').length})
            </h4>

            <div id="incidents-deck" className="space-y-3">
              {incidents.map((inc) => {
                const isResolved = inc.status === 'resolved';
                return (
                  <div key={inc.id} className={`p-4 bg-white dark:bg-slate-900 border rounded-2xl shadow-xs transition flex flex-col md:flex-row justify-between items-start gap-4 ${
                    isResolved ? 'opacity-60 border-slate-200' : 'border-slate-200 dark:border-slate-800 ring-1 ring-slate-100 dark:ring-slate-950'
                  }`}>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`w-2 h-2 rounded-full ${
                          inc.severity === 'critical' ? 'bg-red-500 animate-ping' :
                          inc.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                        }`}></span>
                        <span className="text-sm font-bold text-slate-800 dark:text-white">{inc.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                          inc.status === 'resolved' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950' : 'bg-rose-50 text-rose-600 dark:bg-rose-950'
                        }`}>
                          {inc.status}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-500 dark:text-slate-400">{inc.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-[11px] text-slate-400 font-mono">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                          <span>{inc.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                          <span>{new Date(inc.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BellRing className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                          <span>Unit: {inc.responderAllocated || 'None'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col justify-end gap-2 shrink-0 w-full md:w-auto">
                      {!isResolved && (
                        <button
                          onClick={() => onResolveIncident(inc.id)}
                          className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10px] font-bold rounded-lg transition"
                        >
                          Resolve dispatch
                        </button>
                      )}
                      {!isResolved && (
                        <button
                          onClick={() => triggerEmergencyGuide(inc)}
                          className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750 font-mono text-[10px] font-bold rounded-lg transition flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3 text-indigo-500" />
                          AI Guide
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI response checklist guideline rendering */}
            {aiGuide && (
              <div id="ai-guideline-popover" className="p-4 bg-indigo-950/20 border border-indigo-900/40 rounded-2xl text-slate-300 space-y-2 mt-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                  <span>AI First Responder Emergency Guide Checklist:</span>
                </div>
                <div className="text-xs font-mono whitespace-pre-line leading-relaxed">
                  {aiGuide}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
