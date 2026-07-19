/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Tv, 
  Activity, 
  RefreshCw, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Users, 
  Compass, 
  TrendingUp, 
  BarChart3, 
  CheckCircle2, 
  MapPin, 
  Award,
  ChevronRight,
  Flame,
  CloudSun,
  Droplets,
  Wind,
  Sun,
  AlertTriangle
} from 'lucide-react';

interface CommentaryItem {
  time: string;
  event: string;
  isCritical: boolean;
}

interface LiveMatch {
  id: string;
  sport: 'soccer' | 'cricket';
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
  possession: string;
  shots: string;
  fouls: string;
  stadium: string;
  occupancy: number;
  commentary: CommentaryItem[];
  weather?: {
    stadiumId: string;
    stadiumName: string;
    city: string;
    temperatureC: number;
    temperatureF: number;
    condition: string;
    humidity: number;
    windSpeedKph: number;
    rainProbability: number;
    uvIndex: number;
    isDemoMode: boolean;
    recommendations: {
      matchDelayRisk: 'low' | 'medium' | 'high';
      crowdComfortScore: number;
      rainAlert: boolean;
      heatRiskAlert: boolean;
      resourcePlanning: string;
    };
  };
}

interface Standing {
  rank: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  gd: number;
}

interface Fixture {
  id: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  status: string;
  venue: string;
}

interface SportsData {
  source: string;
  stadiumOccupancy: number;
  liveMatches: LiveMatch[];
  standings: Standing[];
  fixtures: Fixture[];
}

export default function TournamentView() {
  const [data, setData] = useState<SportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(10); // seconds
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [activeSportFilter, setActiveSportFilter] = useState<'all' | 'soccer' | 'cricket'>('all');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  const fetchSportsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/sports/data');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.liveMatches && json.liveMatches.length > 0 && !selectedMatchId) {
          setSelectedMatchId(json.liveMatches[0].id);
        }
        setLastRefreshed(new Date());
      } else {
        throw new Error('Failed to retrieve sports stream data.');
      }
    } catch (e: any) {
      setError(e.message || 'Error connecting to sports proxy endpoint.');
    } finally {
      setLoading(false);
    }
  };

  // Poll for real-time updates every refreshInterval seconds
  useEffect(() => {
    fetchSportsData();
    const interval = setInterval(() => {
      fetchSportsData();
    }, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const handleManualRefresh = () => {
    fetchSportsData();
  };

  const [aiInsightLoading, setAiInsightLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<{ summary: string; prediction: string } | null>(null);

  const selectedMatch = data?.liveMatches.find(m => m.id === selectedMatchId) || data?.liveMatches?.[0];

  const fetchAiInsight = async (match: LiveMatch) => {
    try {
      setAiInsightLoading(true);
      const res = await fetch('/api/sports/ai-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: match.id,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          homeScore: match.homeScore,
          awayScore: match.awayScore,
          status: match.status,
          commentary: match.commentary,
          occupancy: match.occupancy
        })
      });
      if (res.ok) {
        const json = await res.json();
        setAiInsight(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiInsightLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMatch) {
      fetchAiInsight(selectedMatch);
    } else {
      setAiInsight(null);
    }
  }, [selectedMatchId, data?.liveMatches?.[0]?.homeScore]);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] text-slate-500 font-mono text-xs space-y-3">
        <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin" />
        <span>Loading Real-Time Sports Intelligence Feed...</span>
      </div>
    );
  }

  const matchesFiltered = data?.liveMatches.filter(m => 
    activeSportFilter === 'all' ? true : m.sport === activeSportFilter
  ) || [];

  return (
    <div id="tournament-intel-container" className="space-y-6 max-w-7xl mx-auto p-2">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h2 className="font-sans font-extrabold text-3xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-8 h-8 text-indigo-500 shrink-0" />
            Tournament Intelligence Center
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time fixtures tracking, scores, dynamic team standings, and commentary tickers powered by ESPN.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Polling Timer indicator */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Polls: {refreshInterval}s</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>Refreshed: {lastRefreshed.toLocaleTimeString()}</span>
          </div>

          <button
            id="manual-refresh-sports-btn"
            onClick={handleManualRefresh}
            className="p-2 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl shadow-xs transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* API Source Banner */}
      {data && (
        <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
          data.source.includes('ESPN') 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300' 
            : 'bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300'
        }`}>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{data.source.includes('ESPN') ? 'Live Stream Synchronized:' : 'Demo Mode Active:'} {data.source}</span>
          </div>
          {!data.source.includes('ESPN') && (
            <span className="text-[10px] font-mono opacity-80 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              Credentials can be injected via settings for full API-Football / Cricbuzz / TheSportsDB coverage.
            </span>
          )}
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Live Scoreboards Selector */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Tv className="w-4 h-4 text-indigo-500" />
                Live Sports scoreboards
              </h3>
              <div className="flex bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <button 
                  onClick={() => setActiveSportFilter('all')}
                  className={`px-2 py-1 text-[10px] font-semibold rounded-md ${activeSportFilter === 'all' ? 'bg-white dark:bg-slate-800 shadow-xs text-indigo-500' : 'text-slate-400'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setActiveSportFilter('soccer')}
                  className={`px-2 py-1 text-[10px] font-semibold rounded-md ${activeSportFilter === 'soccer' ? 'bg-white dark:bg-slate-800 shadow-xs text-indigo-500' : 'text-slate-400'}`}
                >
                  Soccer
                </button>
                <button 
                  onClick={() => setActiveSportFilter('cricket')}
                  className={`px-2 py-1 text-[10px] font-semibold rounded-md ${activeSportFilter === 'cricket' ? 'bg-white dark:bg-slate-800 shadow-xs text-indigo-500' : 'text-slate-400'}`}
                >
                  Cricket
                </button>
              </div>
            </div>

            {/* Scoreboards list */}
            <div className="space-y-3">
              {matchesFiltered.length > 0 ? (
                matchesFiltered.map((match) => {
                  const isSelected = selectedMatchId === match.id;
                  return (
                    <div
                      id={`match-card-${match.id}`}
                      key={match.id}
                      onClick={() => setSelectedMatchId(match.id)}
                      className={`p-4 rounded-xl border transition cursor-pointer text-left space-y-3 ${
                        isSelected 
                          ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20' 
                          : 'border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/30'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold font-mono bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 uppercase">
                          {match.sport}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-red-500 font-mono font-bold animate-pulse">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                          {match.status}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-850 dark:text-slate-100">{match.homeTeam}</span>
                          <span className="font-mono font-black text-sm text-slate-900 dark:text-white">{match.homeScore}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-850 dark:text-slate-100">{match.awayTeam}</span>
                          <span className="font-mono font-black text-sm text-slate-900 dark:text-white">{match.awayScore}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-850/50 text-[10px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-indigo-400" />
                          Occ: {match.occupancy}%
                        </span>
                        <span className="flex items-center gap-0.5 hover:underline text-indigo-500">
                          Inspect Stats <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">No matches found for filter.</div>
              )}
            </div>
          </div>

          {/* Standings widget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Award className="w-4 h-4 text-indigo-500" />
              Tournament standings
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] font-mono">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <th className="py-1.5 font-bold">POS</th>
                    <th className="py-1.5 font-bold">TEAM</th>
                    <th className="py-1.5 font-bold text-center">PL</th>
                    <th className="py-1.5 font-bold text-center">PTS</th>
                    <th className="py-1.5 font-bold text-center">GD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {data?.standings.map((team) => (
                    <tr key={team.rank} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                      <td className="py-2 text-slate-400">{team.rank}</td>
                      <td className="py-2 font-bold text-slate-800 dark:text-slate-200">{team.team}</td>
                      <td className="py-2 text-center text-slate-500">{team.played}</td>
                      <td className="py-2 text-center font-bold text-slate-900 dark:text-white">{team.points}</td>
                      <td className="py-2 text-center text-slate-500">{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Rich Commentary Timeline & Team Statistics */}
        <div className="lg:col-span-2 space-y-6">
          {selectedMatch ? (
            <div className="space-y-6">
              
              {/* Scoreboard display */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-md">
                <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-600/10 blur-3xl rounded-full"></div>

                <div className="flex justify-between items-center mb-6">
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 font-mono text-[10px] font-bold animate-pulse">
                    LIVE SPORTS CONSOLE
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    {selectedMatch.stadium}
                  </span>
                </div>

                <div className="flex items-center justify-between py-4">
                  <div className="text-center flex-1">
                    <div className="text-xl font-extrabold text-white">{selectedMatch.homeTeam}</div>
                    <div className="text-[10px] text-indigo-300 font-mono uppercase tracking-wider mt-1">Home Team</div>
                  </div>

                  <div className="text-center px-6">
                    <div className="text-4xl font-extrabold font-mono tracking-tight text-white flex items-center gap-4">
                      <span>{selectedMatch.homeScore}</span>
                      <span className="text-slate-500 text-2xl font-light font-sans">:</span>
                      <span>{selectedMatch.awayScore}</span>
                    </div>
                    <span className="px-2 py-1 rounded bg-slate-950 font-mono text-[10px] text-amber-400 font-semibold border border-slate-850 mt-3 block animate-pulse">
                      {selectedMatch.status}
                    </span>
                  </div>

                  <div className="text-center flex-1">
                    <div className="text-xl font-extrabold text-white">{selectedMatch.awayTeam}</div>
                    <div className="text-[10px] text-indigo-300 font-mono uppercase tracking-wider mt-1">Away Team</div>
                  </div>
                </div>

                {/* Sub Sensory Occupancy indicator */}
                <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-4 text-center mt-2">
                  <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/40 flex items-center justify-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div className="text-left">
                      <span className="text-[10px] text-slate-500 font-mono uppercase block">Arena Occupancy</span>
                      <span className="text-xs font-bold text-white">{selectedMatch.occupancy}% occupancy</span>
                    </div>
                  </div>
                  <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/40 flex items-center justify-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="text-left">
                      <span className="text-[10px] text-slate-500 font-mono uppercase block">Commentary Stream</span>
                      <span className="text-xs font-bold text-white">Active Feed • Sync</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stadium Weather Intelligence */}
              {selectedMatch.weather && (
                <div id="stadium-weather-intelligence-card" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-left text-white shadow-md relative overflow-hidden">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800/80 mb-4">
                    <div className="flex items-center gap-2">
                      <CloudSun className="w-5 h-5 text-sky-400" />
                      <h3 className="font-sans font-bold text-sm text-slate-100">Stadium Weather Intelligence</h3>
                    </div>
                    {selectedMatch.weather.isDemoMode ? (
                      <span id="weather-demo-badge" className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[9px] font-semibold">
                        WEATHER: DEMO MODE
                      </span>
                    ) : (
                      <span id="weather-live-badge" className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[9px] font-semibold animate-pulse">
                        LIVE WEATHER FEED
                      </span>
                    )}
                  </div>

                  {/* Main Grid: Weather Parameters & Comfort / Risk */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Primary weather reading */}
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Conditions</span>
                        <div className="text-sm font-extrabold text-white">{selectedMatch.weather.condition}</div>
                        <span className="text-xs text-slate-400">{selectedMatch.weather.city}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black font-mono text-indigo-400">{selectedMatch.weather.temperatureC}°C</div>
                        <div className="text-[10px] text-slate-500 font-mono">{selectedMatch.weather.temperatureF}°F</div>
                      </div>
                    </div>

                    {/* Sensor Readings */}
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850 grid grid-cols-3 gap-2 text-center">
                      <div className="flex flex-col justify-center items-center">
                        <Droplets className="w-4.5 h-4.5 text-sky-400 mb-1" />
                        <span className="text-[8px] font-mono text-slate-500 uppercase">Humidity</span>
                        <span className="text-xs font-bold text-white font-mono mt-0.5">{selectedMatch.weather.humidity}%</span>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <Wind className="w-4.5 h-4.5 text-slate-400 mb-1" />
                        <span className="text-[8px] font-mono text-slate-500 uppercase">Wind</span>
                        <span className="text-xs font-bold text-white font-mono mt-0.5">{selectedMatch.weather.windSpeedKph} <span className="text-[8px]">kph</span></span>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <Sun className="w-4.5 h-4.5 text-amber-500 mb-1" />
                        <span className="text-[8px] font-mono text-slate-500 uppercase">UV Index</span>
                        <span className="text-xs font-bold text-white font-mono mt-0.5">{selectedMatch.weather.uvIndex}</span>
                      </div>
                    </div>

                    {/* Comfort & Delay Risk Scores */}
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono text-slate-500 uppercase">Comfort Score</span>
                        <span className={`text-xs font-bold font-mono ${
                          selectedMatch.weather.recommendations.crowdComfortScore >= 75 ? 'text-emerald-400' :
                          selectedMatch.weather.recommendations.crowdComfortScore >= 45 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {selectedMatch.weather.recommendations.crowdComfortScore}/100
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            selectedMatch.weather.recommendations.crowdComfortScore >= 75 ? 'bg-emerald-500' :
                            selectedMatch.weather.recommendations.crowdComfortScore >= 45 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${selectedMatch.weather.recommendations.crowdComfortScore}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] pt-1">
                        <span className="text-slate-400 font-mono font-bold">Delay Risk:</span>
                        <span className={`px-1.5 py-0.5 rounded font-mono font-bold text-[9px] uppercase ${
                          selectedMatch.weather.recommendations.matchDelayRisk === 'high' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25 animate-pulse' :
                          selectedMatch.weather.recommendations.matchDelayRisk === 'medium' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' :
                          'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                        }`}>
                          {selectedMatch.weather.recommendations.matchDelayRisk}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Active Weather Alerts */}
                  {(selectedMatch.weather.recommendations.rainAlert || selectedMatch.weather.recommendations.heatRiskAlert) && (
                    <div id="weather-threat-alert-box" className="flex gap-2.5 bg-rose-500/10 border border-rose-500/25 p-3 rounded-xl mb-4 text-xs text-rose-300">
                      <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse text-rose-400" />
                      <div className="space-y-0.5">
                        <span className="font-bold uppercase tracking-wider text-[9px] font-mono text-rose-400 block">ACTIVE METEOROLOGICAL THREAT</span>
                        <p className="leading-relaxed text-[11px]">
                          {selectedMatch.weather.recommendations.rainAlert && "⚠️ High Rain Probability / Storm warning: Prep drainage & wet-weather crowd guidance. "}
                          {selectedMatch.weather.recommendations.heatRiskAlert && "🥵 Extreme UV / Heat Risk: Deploy hydration stations, sunscreens, & medical ushers."}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Resource & Operational Advisory */}
                  <div className="bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-xs space-y-1">
                    <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">AI Operational Advisory</span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{selectedMatch.weather.recommendations.resourcePlanning}</p>
                  </div>
                </div>
              )}

              {/* AI Co-Pilot Tactical Insights Panel */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-500/20 rounded-2xl p-5 shadow-sm space-y-4 text-left">
                <div className="flex justify-between items-center pb-2 border-b border-indigo-500/10">
                  <h4 className="font-sans font-bold text-sm text-indigo-300 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                    AI Sports Co-pilot Tactical Insights
                  </h4>
                  <button
                    onClick={() => selectedMatch && fetchAiInsight(selectedMatch)}
                    disabled={aiInsightLoading}
                    className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer disabled:opacity-55"
                  >
                    {aiInsightLoading ? 'Analyzing...' : 'Re-analyze with Gemini'}
                  </button>
                </div>

                {aiInsightLoading ? (
                  <div className="py-6 flex flex-col items-center justify-center space-y-2">
                    <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
                    <span className="text-xs text-slate-400 font-mono">Consulting Gemini-3.5-Flash analyst...</span>
                  </div>
                ) : aiInsight ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950/60 border border-indigo-500/15">
                      <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">AI Match summary</span>
                      <p className="text-slate-300 leading-relaxed">{aiInsight.summary}</p>
                    </div>
                    <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950/60 border border-emerald-500/15">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">AI Crowd flow prediction</span>
                      <p className="text-slate-300 leading-relaxed">{aiInsight.prediction}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs">No insights generated. Click re-analyze to consult the AI.</p>
                )}
              </div>

              {/* Stats & Commentary Tabs layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Team Statistics */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                  <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <BarChart3 className="w-4 h-4 text-indigo-500" />
                    Team performance stats
                  </h4>

                  <div className="space-y-4">
                    {/* Possession */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="font-bold">{selectedMatch.possession.split(' - ')[0]}</span>
                        <span className="text-slate-400">Possession</span>
                        <span className="font-bold">{selectedMatch.possession.split(' - ')[1]}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-950 rounded-full flex overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: selectedMatch.possession.split(' - ')[0] }}></div>
                        <div className="h-full bg-emerald-500" style={{ width: selectedMatch.possession.split(' - ')[1] }}></div>
                      </div>
                    </div>

                    {/* Shots */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="font-bold">{selectedMatch.shots.split(' - ')[0]}</span>
                        <span className="text-slate-400">Total Shots</span>
                        <span className="font-bold">{selectedMatch.shots.split(' - ')[1]}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-950 rounded-full flex overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: '60%' }}></div>
                        <div className="h-full bg-emerald-500" style={{ width: '40%' }}></div>
                      </div>
                    </div>

                    {/* Fouls */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="font-bold">{selectedMatch.fouls.split(' - ')[0]}</span>
                        <span className="text-slate-400">Fouls / Extras</span>
                        <span className="font-bold">{selectedMatch.fouls.split(' - ')[1]}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-950 rounded-full flex overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: '45%' }}></div>
                        <div className="h-full bg-emerald-500" style={{ width: '55%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-time commentary Events */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                  <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    Live Commentary timeline
                  </h4>

                  <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                    {selectedMatch.commentary.map((log, index) => (
                      <div key={index} className="flex gap-3 text-xs text-left">
                        <span className="font-mono font-bold text-indigo-500 select-none bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded shrink-0 h-fit">
                          {log.time}
                        </span>
                        <div className="flex-1 space-y-1">
                          <p className={`font-medium ${log.isCritical ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                            {log.event}
                          </p>
                          {log.isCritical && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] text-rose-500 font-mono uppercase bg-rose-50 dark:bg-rose-950 px-1 rounded font-bold">
                              <Flame className="w-2.5 h-2.5" /> High priority Match Event
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
              Select a live scoreboard card from the list to view stats.
            </div>
          )}

          {/* Upcoming fixtures list */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Calendar className="w-4 h-4 text-indigo-500" />
              Tournament fixture schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data?.fixtures.map((fix) => (
                <div key={fix.id} className="p-3.5 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl text-left space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span className="uppercase">{fix.sport} • {fix.venue}</span>
                    <span className="flex items-center gap-0.5"><Clock className="w-3 h-3 text-indigo-400" /> {new Date(fix.date).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {fix.homeTeam} vs {fix.awayTeam}
                  </div>
                  <div className="text-[10px] font-semibold text-indigo-500 font-mono uppercase">
                    Scheduled fixture
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
