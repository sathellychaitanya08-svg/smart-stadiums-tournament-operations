/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Lock, 
  User as UserIcon, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Leaf,
  Users
} from 'lucide-react';

import { User, StadiumState, Match, Zone, Incident, ChatMessage } from './types.ts';
import Sidebar from './components/Sidebar.tsx';
import DashboardView from './components/DashboardView.tsx';
import SchedulerView from './components/SchedulerView.tsx';
import CrowdDashboard from './components/CrowdDashboard.tsx';
import SecurityView from './components/SecurityView.tsx';
import ResourceView from './components/ResourceView.tsx';
import SustainabilityView from './components/SustainabilityView.tsx';
import AssistantView from './components/AssistantView.tsx';
import TournamentView from './components/TournamentView.tsx';
import QualityDashboard from './components/QualityDashboard.tsx';

export default function App() {
  // Auth state
 const [user, setUser] = useState<User | null>({
  id: 'demo-user',
  name: 'S. Chaitanya',
  email: 'demo@arenaops.ai',
  role: 'operator'
} as User);
  const [loginEmail, setLoginEmail] = useState('sathellychaitanya08@gmail.com');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Tab routing state
  const [activeTab, setActiveTab] = useState('dashboard');

  // Stadium metrics state synchronized with express server
  const [stadiumState, setStadiumState] = useState<StadiumState | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  
  // AI assistant chat history
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: 'Hello! I am the ArenaOps AI Assistant. I have audited current sensors and matches. Let me know if you would like me to analyze crowd bottlenecks or schedule player rest day reviews!',
      timestamp: new Date().toISOString()
    }
  ]);
  const [isSendingChat, setIsSendingChat] = useState(false);

  // Global Accessibility Settings States
  const [highContrast, setHighContrast] = useState(false);
  const [textScale, setTextScale] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [focusIndicators, setFocusIndicators] = useState(false);
  const [voiceNarration, setVoiceNarration] = useState(false);
  const [accessibleAnnouncements, setAccessibleAnnouncements] = useState<string[]>(['Screen Reader initialized. Voice Narration ready.']);

  const announce = (message: string) => {
    setAccessibleAnnouncements(prev => [message, ...prev.slice(0, 4)]);
    if (voiceNarration && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    announce(`Switched navigation view to ${activeTab.toUpperCase()} tab.`);
  }, [activeTab]);

  useEffect(() => {
    if (stadiumState) {
      const activeMatch = stadiumState.matches.find(m => m.status === 'live');
      if (activeMatch) {
        announce(`Live update: Current match ${activeMatch.homeTeam} vs ${activeMatch.awayTeam}. Occupancy: ${activeMatch.crowdForecast}%.`);
      }
    }
  }, [stadiumState]);

  // Auto-load state on session mount or login
  useEffect(() => {
    // Check if token already exists to auto login
    const savedUser = sessionStorage.getItem('arenaops_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchStadiumState();
    }
  }, [user]);

  const fetchStadiumState = async () => {
  try {
    setStadiumState({
      matches: [],
      zones: [],
      incidents: [],
      resources: [],
      utility: {
        powerUsageKw: 1450,
        powerLoadPrediction: 1600,
        powerLimitKw: 2200,
        waterGallonsMin: 120,
        waterLimitGallons: 350,
        savingModeActive: false,
        gridStatus: 'normal'
      },
      sustainability: {
        wasteRecycledKg: 1500,
        foodWasteKg: 120,
        transitCo2Kg: 32000,
        energySavedKwh: 420,
        waterSavedGallons: 900,
        targetWasteRecycledKg: 2000,
        targetFoodWasteKg: 200,
        targetTransitCo2Kg: 50000
      }
    } as StadiumState);
  } catch (e) {
    console.error(e);
  }
};

  // Auth handler
 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  const demoUser = {
    id: 'demo-user',
    name: 'S. Chaitanya',
    email: loginEmail,
    role: 'operator'
  };

  setUser(demoUser as User);
  sessionStorage.setItem('arenaops_user', JSON.stringify(demoUser));
};

  // Simulation tick progression handler
  const triggerSimulationTick = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/stadium/simulate-tick', {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setStadiumState(data);
      }
    } catch (e) {
      console.error('Simulation tick failure', e);
    } finally {
      setIsSimulating(false);
    }
  };

  // MATCH BOOKINGS
  const handleAddMatch = async (matchData: Omit<Match, 'id' | 'stadiumId'>) => {
    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchData)
      });
      const data = await res.json();
      if (res.ok) {
        await fetchStadiumState();
        return { success: true };
      } else {
        return { success: false, error: data.error, details: data.details };
      }
    } catch (e) {
      return { success: false, error: 'Connection failure booking match slot.' };
    }
  };

  // MATCH CALENDAR OPTIMIZATION
  const handleAIOptimize = async () => {
    try {
      const res = await fetch('/api/matches/ai-optimize', {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok) {
        await fetchStadiumState();
        return { success: true, message: data.message };
      }
    } catch (e) {
      console.error('Optimizing calendar error', e);
    }
    return { success: false, message: 'Optimization error.' };
  };

  // ZONE UPDATING
  const handleUpdateZone = async (id: string, updates: Partial<Zone>) => {
    try {
      const res = await fetch(`/api/zones/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        await fetchStadiumState();
        return true;
      }
    } catch (e) {
      console.error('Updating zone failed', e);
    }
    return false;
  };

  // INCIDENT MANAGING
  const handleAddIncident = async (incData: Omit<Incident, 'id' | 'timestamp'>) => {
    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incData)
      });
      if (res.ok) {
        await fetchStadiumState();
        return true;
      }
    } catch (e) {
      console.error('Adding incident error', e);
    }
    return false;
  };

  const handleResolveIncident = async (id: string) => {
    try {
      const res = await fetch(`/api/incidents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' })
      });
      if (res.ok) {
        await fetchStadiumState();
      }
    } catch (e) {
      console.error('Resolving incident failed', e);
    }
  };

  // RESOURCES DEPLOYMENT
  const handleUpdateResources = async (role: string, staffOnDuty: number) => {
    try {
      const res = await fetch(`/api/resources/${role}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onDuty: staffOnDuty })
      });
      if (res.ok) {
        await fetchStadiumState();
        return true;
      }
    } catch (e) {
      console.error('Resource adjust failed', e);
    }
    return false;
  };

  // UTILITY SAVING MODE
  const handleToggleSavingMode = async (active: boolean) => {
    try {
      const res = await fetch('/api/utility/saving-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active })
      });
      if (res.ok) {
        await fetchStadiumState();
        return true;
      }
    } catch (e) {
      console.error('Toggling saving mode failed', e);
    }
    return false;
  };

  // AI CHAT SENDING
  const handleSendMessage = async (
    text: string, 
    extraParams?: { role?: string; userLocation?: string; seatNumber?: string }
  ) => {
    const userMsg: ChatMessage = {
      id: `usr-chat-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };
    
    const nextHistory = [...chatHistory, userMsg];
    setChatHistory(nextHistory);
    setIsSendingChat(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: nextHistory,
          role: extraParams?.role,
          userLocation: extraParams?.userLocation,
          seatNumber: extraParams?.seatNumber
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: `ai-chat-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toISOString()
        };
        setChatHistory(prev => [...prev, aiMsg]);
      } else {
        throw new Error('Chat API returned error status.');
      }
    } catch (e) {
      const errorMsg: ChatMessage = {
        id: `err-chat-${Date.now()}`,
        sender: 'assistant',
        text: 'I apologize, I experienced a sensory timeout trying to compile stadium parameters. Let me know if you would like me to try again.',
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleClearHistory = () => {
    setChatHistory([
      {
        id: 'welcome-msg',
        sender: 'assistant',
        text: 'System Chat Log Cleared. Ask me anything about current arena bottlenecks, rest day schedules, or sustainability offsets.',
        timestamp: new Date().toISOString()
      }
    ]);
  };

  // Routing Switchboard
  const renderCurrentView = () => {
    if (!stadiumState) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-slate-500 font-mono text-sm space-y-2">
          <span className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></span>
          <span>Awaiting Stadium Sensory Synchronization...</span>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            stadiumState={stadiumState} 
            onSimulateTick={triggerSimulationTick}
            onResolveIncident={handleResolveIncident}
            onDirectRedirect={setActiveTab}
          />
        );
      case 'scheduler':
        return (
          <SchedulerView 
            matches={stadiumState.matches}
            onAddMatch={handleAddMatch}
            onAIOptimize={handleAIOptimize}
            isOptimizing={isSimulating}
          />
        );
      case 'crowd':
        return (
          <CrowdDashboard 
            zones={stadiumState.zones}
            onUpdateZone={handleUpdateZone}
          />
        );
      case 'security':
        return (
          <SecurityView 
            incidents={stadiumState.incidents}
            onAddIncident={handleAddIncident}
            onResolveIncident={handleResolveIncident}
          />
        );
      case 'resources':
        return (
          <ResourceView 
            resources={stadiumState.resources}
            utility={stadiumState.utility}
            onUpdateResources={handleUpdateResources}
            onToggleSavingMode={handleToggleSavingMode}
          />
        );
      case 'sustainability':
        return (
          <SustainabilityView 
            metrics={stadiumState.sustainability}
          />
        );
      case 'tournament':
        return <TournamentView />;
      case 'assistant':
        return (
          <AssistantView 
            chatHistory={chatHistory}
            onSendMessage={handleSendMessage}
            onClearHistory={handleClearHistory}
            isSending={isSendingChat}
          />
        );
      case 'testing':
        return <QualityDashboard />;
      default:
        return <div className="text-center p-10 font-mono text-sm">Target module not found.</div>;
    }
  };

  // Render Login state
  if (!user) {
    return (
      <div id="login-layout" className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden font-sans select-none text-slate-100">
        {/* Abstract background graphics */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl"></div>

        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 relative shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/25">
              <Radio className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="font-extrabold text-2xl tracking-tight text-white">ArenaOps</h1>
              <p className="text-xs text-slate-400 font-mono uppercase tracking-widest mt-1">Smart Stadiums Command Portal</p>
            </div>
          </div>

          {authError && (
            <div id="login-error" className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <UserIcon className="w-3 h-3 text-slate-500" /> Authorized operator Email
              </label>
              <input
                id="email-input"
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="operator@arenaops.org"
                className="w-full text-xs px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-500" /> Secure Pin / Password
              </label>
              <input
                id="password-input"
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full text-xs px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white font-mono"
              />
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-550 text-white font-mono text-xs font-bold rounded-xl shadow-md shadow-indigo-600/15 transition flex items-center justify-center gap-2"
            >
              {isLoggingIn ? 'Verifying Credentials...' : 'Access Command Center'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick specs footer for developers */}
          <div className="pt-4 border-t border-slate-800 text-center space-y-2 font-mono text-[9px] text-slate-500 select-none">
            <div className="flex justify-around">
              <span className="flex items-center gap-0.5"><ShieldCheck className="w-3 h-3 text-emerald-500" /> SECURE AUTH</span>
              <span className="flex items-center gap-0.5"><Zap className="w-3 h-3 text-yellow-500" /> IoT GRID SYNC</span>
              <span className="flex items-center gap-0.5"><Leaf className="w-3 h-3 text-teal-500" /> ISO CERTIFIED</span>
            </div>
            <p className="text-slate-600">Enterprise High-Availability Operations Environment</p>
          </div>
        </div>
      </div>
    );
  }

  // Render main layout
  return (
    <div 
      id="command-center-layout" 
      className={`flex ${highContrast ? 'bg-black text-white font-bold' : 'bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100'} min-h-screen font-sans`}
    >
      <style>{`
        ${focusIndicators ? `
          *:focus-visible, *:focus {
            outline: 3.5px double #f59e0b !important;
            outline-offset: 3px !important;
            box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.4) !important;
          }
        ` : ''}
        ${textScale === 'large' ? `
          html, body, div, p, span, button, h2, h3, h4, input {
            font-size: 104% !important;
          }
        ` : textScale === 'xlarge' ? `
          html, body, div, p, span, button, h2, h3, h4, input {
            font-size: 110% !important;
          }
        ` : ''}
        ${highContrast ? `
          .bg-white, .bg-slate-50, .bg-slate-100, .bg-slate-900, .bg-slate-950, .bg-indigo-950/20, .bg-indigo-50/50, .bg-indigo-600 {
            background-color: #000000 !important;
            color: #ffffff !important;
            border-color: #ffffff !important;
          }
          .text-slate-900, .text-slate-800, .text-slate-700, .text-slate-650, .text-slate-600, .text-slate-500, .text-slate-400, .text-indigo-400, .text-indigo-600, .text-emerald-400, .text-emerald-600, .text-rose-500, .text-indigo-300 {
            color: #ffffff !important;
          }
          .border, .border-slate-100, .border-slate-200, .border-slate-800, .border-indigo-500/20 {
            border-color: #ffffff !important;
            border-width: 1.5px !important;
          }
          button {
            border: 1.5px solid #ffffff !important;
            color: #ffffff !important;
            background-color: #000000 !important;
          }
          button:hover {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          svg {
            stroke: #ffffff !important;
          }
        ` : ''}
      `}</style>

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout}
        stadiumState={stadiumState || { matches: [], zones: [], incidents: [], resources: [], utility: { powerUsageKw: 0, powerLoadPrediction: 0, powerLimitKw: 2200, waterGallonsMin: 0, waterLimitGallons: 350, savingModeActive: false, gridStatus: 'normal' }, sustainability: { wasteRecycledKg: 0, foodWasteKg: 0, transitCo2Kg: 0, energySavedKwh: 0, waterSavedGallons: 0, targetWasteRecycledKg: 2000, targetFoodWasteKg: 200, targetTransitCo2Kg: 50000 } }}
        onSimulateTick={triggerSimulationTick}
        isSimulating={isSimulating}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        textScale={textScale}
        setTextScale={setTextScale}
        focusIndicators={focusIndicators}
        setFocusIndicators={setFocusIndicators}
        voiceNarration={voiceNarration}
        setVoiceNarration={setVoiceNarration}
      />

      <main id="view-portal" className="flex-1 overflow-y-auto h-screen p-8 bg-slate-50 dark:bg-slate-950">
        {renderCurrentView()}
      </main>

      {/* Persistent Visible Captions Box (Screen Reader Narrator Output) */}
      <div 
        id="a11y-narration-output"
        className="fixed bottom-4 right-4 bg-slate-950/95 border border-amber-500/40 p-4 rounded-xl shadow-xl w-72 text-left z-50 text-[11px] font-mono leading-normal text-slate-200"
        role="log"
        aria-live="assertive"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
          <span className="text-amber-400 font-bold tracking-wider uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></span>
            Screen Reader Simulation
          </span>
          <span className="text-[9px] text-slate-500 uppercase">WCAG 2.1 AA</span>
        </div>
        <p className="text-amber-200/90 italic">"{accessibleAnnouncements[0] || 'Awaiting interface events...'}"</p>
        <div className="mt-2 text-[9px] text-slate-500 space-y-1 max-h-16 overflow-y-auto">
          {accessibleAnnouncements.slice(1).map((ann, i) => (
            <div key={i} className="truncate">• {ann}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
