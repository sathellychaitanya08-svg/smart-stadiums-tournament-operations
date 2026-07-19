/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CalendarRange, 
  Plus, 
  Trash2, 
  Zap, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Users, 
  CloudSun, 
  RotateCcw,
  User,
  Heart,
  ChevronDown
} from 'lucide-react';
import { Match, MatchStatus, MatchPriority } from '../types.ts';

interface SchedulerViewProps {
  matches: Match[];
  onAddMatch: (matchData: Omit<Match, 'id' | 'stadiumId'>) => Promise<{ success: boolean; error?: string; details?: string[] }>;
  onAIOptimize: () => Promise<{ success: boolean; message: string }>;
  isOptimizing: boolean;
}

export default function SchedulerView({
  matches,
  onAddMatch,
  onAIOptimize,
  isOptimizing
}: SchedulerViewProps) {
  // Form State
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [datetime, setDatetime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [priority, setPriority] = useState<MatchPriority>('medium');
  const [ticketSales, setTicketSales] = useState(30000);
  const [weatherForecast, setWeatherForecast] = useState('sunny');
  const [restDaysHome, setRestDaysHome] = useState(5);
  const [restDaysAway, setRestDaysAway] = useState(5);
  const [referee, setReferee] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; errors: string[] } | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string; details?: string[] } | null>(null);

  // Quick simulation inputs helper
  const fillSampleTeams = (home: string, away: string, priorityValue: MatchPriority, weather: string, homeRest: number, awayRest: number) => {
    setHomeTeam(home);
    setAwayTeam(away);
    setDatetime(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)); // 5 days out
    setPriority(priorityValue);
    setWeatherForecast(weather);
    setRestDaysHome(homeRest);
    setRestDaysAway(awayRest);
    setReferee('Danilo Santos');
  };

  const handleValidateOnly = async () => {
    if (!homeTeam || !awayTeam || !datetime) {
      setNotification({ type: 'error', text: 'Please fill in Home Team, Away Team and Match Datetime before validating.' });
      return;
    }

    try {
      const response = await fetch('/api/matches/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeTeam,
          awayTeam,
          datetime,
          durationMinutes,
          weatherForecast,
          restDaysHome,
          restDaysAway
        })
      });
      const data = await response.json();
      setValidationResult(data);
      if (data.valid) {
        setNotification({ type: 'success', text: 'Scheduler Validation Succeeded: No operational conflicts detected.' });
      } else {
        setNotification({ type: 'error', text: 'Operational Fatigue or Time Conflict Found:', details: data.errors });
      }
    } catch (e) {
      setNotification({ type: 'error', text: 'Error contacting validation service.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeTeam || !awayTeam || !datetime) {
      setNotification({ type: 'error', text: 'Please fill in Home Team, Away Team, and Date/Time.' });
      return;
    }

    setIsSubmitting(true);
    setNotification(null);
    setValidationResult(null);

    const result = await onAddMatch({
      homeTeam,
      awayTeam,
      status: 'scheduled',
      datetime: new Date(datetime).toISOString(),
      durationMinutes: Number(durationMinutes),
      priority,
      demandScore: priority === 'critical' ? 95 : priority === 'high' ? 80 : priority === 'medium' ? 65 : 40,
      ticketSales: Number(ticketSales),
      capacity: 55000,
      crowdForecast: Math.round((Number(ticketSales) / 55000) * 100),
      weatherForecast,
      restDaysHome: Number(restDaysHome),
      restDaysAway: Number(restDaysAway),
      referee: referee || 'Marcus Oliver'
    });

    setIsSubmitting(false);

    if (result.success) {
      setNotification({ type: 'success', text: 'Tournament match successfully booked and cleared by scheduling rules.' });
      // Clear form
      setHomeTeam('');
      setAwayTeam('');
      setDatetime('');
      setReferee('');
    } else {
      setNotification({
        type: 'error',
        text: result.error || 'Failed to book match schedule.',
        details: result.details
      });
    }
  };

  const triggerAIOptimizer = async () => {
    setNotification(null);
    const result = await onAIOptimize();
    if (result.success) {
      setNotification({
        type: 'success',
        text: result.message
      });
    } else {
      setNotification({
        type: 'error',
        text: 'Failed to optimize tournament calendar.'
      });
    }
  };

  return (
    <div id="scheduler-container" className="space-y-8 max-w-7xl mx-auto p-2">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h2 className="font-sans font-extrabold text-3xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarRange className="w-8 h-8 text-indigo-600" />
            Match Scheduling Engine
          </h2>
          <p className="text-sm text-slate-500">Book new matches, validate team recovery times, and optimize calendar slots using Gemini AI guidelines.</p>
        </div>
        <button
          id="ai-optimize-calendar-btn"
          onClick={triggerAIOptimizer}
          disabled={isOptimizing}
          className="flex items-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/10 transition disabled:opacity-50"
        >
          <Zap className="w-4 h-4 text-amber-300 animate-bounce" />
          {isOptimizing ? 'AI Optimizing Calendar...' : 'AI Optimize Calendar'}
        </button>
      </div>

      {/* Notifications */}
      {notification && (
        <div id="scheduler-notifications" className={`p-4 rounded-xl flex items-start gap-3 border ${
          notification.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30 text-emerald-900 dark:text-emerald-300' 
            : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/30 text-rose-900 dark:text-rose-300'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="text-sm font-bold">{notification.text}</p>
            {notification.details && notification.details.length > 0 && (
              <ul className="list-disc pl-5 mt-2 text-xs space-y-1">
                {notification.details.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Scheduler split view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Book new match card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs lg:col-span-1 h-fit">
          <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-1.5">
            <Plus className="w-5 h-5 text-indigo-500" />
            Schedule Match Slot
          </h3>

          {/* Quick simulators */}
          <div className="mb-4 bg-slate-50 dark:bg-slate-950/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60">
            <span className="text-[10px] font-mono font-bold text-slate-400 block mb-1">QUICK INJECT MOCK CASUISTRY</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                id="inject-fatigue-btn"
                type="button"
                onClick={() => fillSampleTeams('FC Spartans', 'Gladiator Athletic', 'medium', 'sunny', 1, 5)}
                className="text-left text-[9px] p-1.5 rounded bg-slate-200/50 dark:bg-slate-800 hover:bg-slate-300/50 font-mono text-slate-600 dark:text-slate-300 truncate"
              >
                🚨 Inject Team Fatigue (Rest: 1d)
              </button>
              <button
                id="inject-storm-btn"
                type="button"
                onClick={() => fillSampleTeams('Valkyries SC', 'Phoenix Red', 'critical', 'thunderstorm', 5, 5)}
                className="text-left text-[9px] p-1.5 rounded bg-slate-200/50 dark:bg-slate-800 hover:bg-slate-300/50 font-mono text-slate-600 dark:text-slate-300 truncate"
              >
                ⛈️ Inject Severe Lightning Weather
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-500 uppercase">Home Team</label>
                <input
                  id="home-team-input"
                  type="text"
                  required
                  value={homeTeam}
                  onChange={(e) => setHomeTeam(e.target.value)}
                  placeholder="e.g. Thunder FC"
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-transparent text-slate-800 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-500 uppercase">Away Team</label>
                <input
                  id="away-team-input"
                  type="text"
                  required
                  value={awayTeam}
                  onChange={(e) => setAwayTeam(e.target.value)}
                  placeholder="e.g. Lightning Rangers"
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-transparent text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-500 uppercase">Match Date / Time</label>
              <input
                id="match-datetime-input"
                type="datetime-local"
                required
                value={datetime}
                onChange={(e) => setDatetime(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-transparent text-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-500 uppercase">Home Rest (Days)</label>
                <input
                  id="home-rest-input"
                  type="number"
                  min="0"
                  required
                  value={restDaysHome}
                  onChange={(e) => setRestDaysHome(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-transparent text-slate-800 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-500 uppercase">Away Rest (Days)</label>
                <input
                  id="away-rest-input"
                  type="number"
                  min="0"
                  required
                  value={restDaysAway}
                  onChange={(e) => setRestDaysAway(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-transparent text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-500 uppercase">Risk Rating</label>
                <select
                  id="match-priority-input"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as MatchPriority)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-transparent text-slate-800 dark:text-white"
                >
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                  <option value="critical">Critical Risk</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-500 uppercase">Weather Forecast</label>
                <select
                  id="match-weather-input"
                  value={weatherForecast}
                  onChange={(e) => setWeatherForecast(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-transparent text-slate-800 dark:text-white"
                >
                  <option value="sunny">Sunny / Optimal</option>
                  <option value="rainy">Rainy</option>
                  <option value="cold">Cold</option>
                  <option value="thunderstorm">Thunderstorm / Hazard</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-500 uppercase">Tickets Allocated</label>
                <input
                  id="ticket-sales-input"
                  type="number"
                  step="1000"
                  max="55000"
                  value={ticketSales}
                  onChange={(e) => setTicketSales(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-transparent text-slate-800 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-500 uppercase">Match Referee</label>
                <input
                  id="referee-input"
                  type="text"
                  value={referee}
                  onChange={(e) => setReferee(e.target.value)}
                  placeholder="e.g. Alistair Webb"
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-transparent text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3">
              <button
                id="validate-slot-btn"
                type="button"
                onClick={handleValidateOnly}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-semibold rounded-lg transition"
              >
                Validate Slot
              </button>
              <button
                id="submit-match-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
              >
                {isSubmitting ? 'Booking...' : 'Book Match'}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Matches List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white flex items-center gap-1.5">
            <Clock className="w-5 h-5 text-indigo-500 animate-spin" style={{ animationDuration: '6s' }} />
            Tournament Match Fixture List
          </h3>

          <div id="scheduler-matches-list" className="space-y-3">
            {matches.map((m) => {
              const dateObj = new Date(m.datetime);
              const isSevereWeather = m.weatherForecast === 'thunderstorm';
              const isLive = m.status === 'live';
              const isCompleted = m.status === 'completed';

              return (
                <div key={m.id} className={`p-4 bg-white dark:bg-slate-900 border rounded-2xl shadow-xs transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                  isLive ? 'border-indigo-500/50 ring-1 ring-indigo-500/20' : 'border-slate-200 dark:border-slate-800'
                }`}>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-800 dark:text-white">
                        {m.homeTeam} <span className="text-slate-400 font-light">vs</span> {m.awayTeam}
                      </span>
                      
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wide border ${
                        isLive ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 font-bold animate-pulse' :
                        isCompleted ? 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:border-slate-700' :
                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      }`}>
                        {m.status}
                      </span>

                      {isSevereWeather && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-400 font-mono border border-rose-500/30 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Weather Warning
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-[11px] text-slate-500 font-mono">
                      <div className="flex items-center gap-1">
                        <CalendarRange className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{dateObj.toLocaleDateString()} at {dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{(m.ticketSales / 1000).toFixed(1)}k / {(m.capacity / 1000).toFixed(0)}k tix</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CloudSun className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="capitalize">{m.weatherForecast}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Rest: {m.restDaysHome}d / {m.restDaysAway}d</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wide block w-fit md:ml-auto mb-1 ${
                      m.priority === 'critical' ? 'bg-rose-600 text-white' :
                      m.priority === 'high' ? 'bg-amber-500 text-slate-900 font-semibold' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {m.priority} Priority
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">Ref: {m.referee}</span>
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
