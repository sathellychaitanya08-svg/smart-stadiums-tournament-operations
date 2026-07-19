/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Cpu, 
  Send, 
  Sparkles, 
  Trash2, 
  Clock, 
  TrendingUp, 
  Zap, 
  AlertTriangle,
  Users,
  Compass,
  Utensils,
  Volume2,
  ShieldAlert,
  Info,
  Keyboard,
  MapPin,
  Bookmark
} from 'lucide-react';
import { ChatMessage } from '../types.ts';

type RoleType = 'spectator' | 'organizer' | 'security';

interface AssistantViewProps {
  chatHistory: ChatMessage[];
  onSendMessage: (text: string, extraParams?: { role: string; userLocation?: string; seatNumber?: string }) => Promise<void>;
  onClearHistory: () => void;
  isSending: boolean;
}

export default function AssistantView({
  chatHistory,
  onSendMessage,
  onClearHistory,
  isSending
}: AssistantViewProps) {
  const [inputText, setInputText] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleType>('spectator');
  const [userLocation, setUserLocation] = useState('Section N5');
  const [seatNumber, setSeatNumber] = useState('Row 12, Seat 4');
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat history
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isSending]);

  // Keyboard Shortcuts for Roles Navigation (Accessibility)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + S -> Spectator
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setSelectedRole('spectator');
      }
      // Alt + O -> Organizer
      if (e.altKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        setSelectedRole('organizer');
      }
      // Alt + t -> Security
      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        setSelectedRole('security');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;
    const textToSend = inputText;
    setInputText('');
    await onSendMessage(textToSend, {
      role: selectedRole,
      userLocation: selectedRole === 'spectator' ? userLocation : undefined,
      seatNumber: selectedRole === 'spectator' ? seatNumber : undefined
    });
  };

  const handleQuickAction = async (text: string) => {
    if (isSending) return;
    await onSendMessage(text, {
      role: selectedRole,
      userLocation: selectedRole === 'spectator' ? userLocation : undefined,
      seatNumber: selectedRole === 'spectator' ? seatNumber : undefined
    });
  };

  // Prompts adapted by active Role selection
  const quickActionsByRole: Record<RoleType, Array<{ label: string; icon: any; query: string }>> = {
    spectator: [
      { 
        label: 'Which gate should I use?', 
        icon: Compass, 
        query: 'Which gate should I use?' 
      },
      { 
        label: 'Where should I park?', 
        icon: MapPin, 
        query: 'Where should I park?' 
      },
      { 
        label: 'How crowded is the stadium?', 
        icon: Users, 
        query: 'How crowded is the stadium?' 
      },
      {
        label: 'What is the fastest route to my seat?',
        icon: Compass,
        query: 'What is the fastest route to my seat?'
      },
      { 
        label: "Summarize today's matches.", 
        icon: Sparkles, 
        query: "Summarize today's matches." 
      },
      { 
        label: 'Are there any security alerts?', 
        icon: ShieldAlert, 
        query: 'Are there any security alerts?' 
      },
      {
        label: 'Predict crowd congestion.',
        icon: TrendingUp,
        query: 'Predict crowd congestion.'
      }
    ],
    organizer: [
      { 
        label: 'Audit Athlete Rest Days', 
        icon: Cpu, 
        query: 'Verify athletic rest day compliance across the tournament fixture calendar. Identify risks.' 
      },
      { 
        label: 'Power Saving Action Plan', 
        icon: Zap, 
        query: 'Suggest a grid optimization action plan to reduce power grid consumption and conserve resources.' 
      },
      { 
        label: 'Match Scheduling Review', 
        icon: Clock, 
        query: 'Audit the tournament scheduling calendar for upcoming weather hazard delays.' 
      },
      { 
        label: 'Sustainability Metrics', 
        icon: TrendingUp, 
        query: 'Summarize today\'s operational metrics, waste counts, and carbon offsets.' 
      }
    ],
    security: [
      { 
        label: 'Crowd Hazard Assessment', 
        icon: AlertTriangle, 
        query: 'Summarize current safety alert status, active security incident logs, and crowd risk scores.' 
      },
      { 
        label: 'Gate Congestion Divert', 
        icon: TrendingUp, 
        query: 'Generate an emergency gate congestion divert instruction protocol for West Gate B.' 
      },
      { 
        label: 'Incident Command Protocol', 
        icon: ShieldAlert, 
        query: 'Review active incident dispatch response protocol and resource allocations.' 
      },
      { 
        label: 'Threat Predictive Assessment', 
        icon: Sparkles, 
        query: 'Run a risk assessment based on spectator entry rates and local support group sectors.' 
      }
    ]
  };

  const getAiRecommendationsByRole = (role: RoleType) => {
    switch (role) {
      case 'spectator':
        return [
          { type: 'flow', text: 'Gate C & Gate G are completely clear for exit.', badge: 'Fastest' },
          { type: 'dining', text: 'Short queues reported at section B food court.', badge: 'Short Lines' },
          { type: 'parking', text: 'Avoid Parking Lot 2; Lot 4 has 45+ open slots.', badge: 'Open' }
        ];
      case 'organizer':
        return [
          { type: 'staff', text: 'High spectator flow at West concourse; dispatch 2 extra guides.', badge: 'Dispatch Plan' },
          { type: 'utility', text: 'Activate eco HVAC mode to shave 12% peak electrical load.', badge: 'Eco Shaving' },
          { type: 'alert', text: 'Alert security responders of Section N5 congestion.', badge: 'Pre-Incident' }
        ];
      case 'security':
        return [
          { type: 'crowd', text: 'High density at South Gate; advise supervisors to re-route.', badge: 'Priority 1' },
          { type: 'incident', text: 'Keep dispatch vehicles standby near Section B due to congestion.', badge: 'Standby Route' },
          { type: 'hazard', text: 'Heat warning in Lower Deck Section 14; check hydration stations.', badge: 'Health/Safety' }
        ];
    }
  };

  const activeActions = quickActionsByRole[selectedRole];

  return (
    <div id="assistant-parent-container" className="space-y-6 max-w-7xl mx-auto p-2 flex flex-col h-[calc(100vh-120px)] font-sans">
      
      {/* Header Banner */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-sans font-extrabold text-3xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-8 h-8 text-indigo-500 animate-spin" style={{ animationDuration: '10s' }} />
            Ask My Stadium Assistant
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Production-ready Gemini-powered platform offering tailored assistance for Spectators, organizers, and safety commanders.
          </p>
        </div>
        
        <div className="flex items-center gap-2.5">
          <button
            id="accessibility-shortcut-btn"
            onClick={() => setShowShortcutsHelp(!showShortcutsHelp)}
            className="text-xs font-semibold text-slate-500 hover:text-indigo-600 bg-slate-100 dark:bg-slate-900 px-3 py-2 rounded-xl transition flex items-center gap-1.5"
            aria-label="Keyboard Shortcuts Help"
          >
            <Keyboard className="w-4 h-4 text-indigo-400" />
            Shortcuts
          </button>

          <button
            id="clear-assistant-history-btn"
            onClick={onClearHistory}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-xl transition flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            Clear Chat
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Help banner */}
      {showShortcutsHelp && (
        <div className="bg-indigo-950/20 border border-indigo-500/20 p-4 rounded-2xl flex items-center gap-3 text-xs text-indigo-300">
          <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          <p>
            <strong>Accessibility Keyboards Navigation:</strong> Switch roles instantly with: 
            <kbd className="mx-1 bg-slate-800 px-1.5 py-0.5 rounded font-mono border border-slate-700 text-white">Alt + S</kbd> (Spectator Mode), 
            <kbd className="mx-1 bg-slate-800 px-1.5 py-0.5 rounded font-mono border border-slate-700 text-white">Alt + O</kbd> (Operations/Organizer), or 
            <kbd className="mx-1 bg-slate-800 px-1.5 py-0.5 rounded font-mono border border-slate-700 text-white">Alt + T</kbd> (Tactical Security).
          </p>
        </div>
      )}

      {/* Grid Configuration Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        
        {/* Role Config Panel (Left Column) */}
        <div className="lg:col-span-1 space-y-4 shrink-0 flex flex-col justify-start">
          
          {/* Role selector panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 text-left">
            <div>
              <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-indigo-500" />
                Select Console Role
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Each role unlocks targeted stadium assistance and customized commands.</p>
            </div>

            <div className="space-y-2" role="tablist" aria-label="Assistant Role Switcher">
              {/* Spectator Role */}
              <button
                id="role-tab-spectator"
                role="tab"
                aria-selected={selectedRole === 'spectator'}
                onClick={() => setSelectedRole('spectator')}
                className={`w-full text-left p-3 rounded-xl border transition text-xs font-semibold flex items-center justify-between cursor-pointer ${
                  selectedRole === 'spectator' 
                    ? 'border-indigo-500 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400' 
                    : 'border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span>Spectator (Concierge)</span>
                <span className="text-[9px] font-mono opacity-60">Alt+S</span>
              </button>

              {/* Organizer Role */}
              <button
                id="role-tab-organizer"
                role="tab"
                aria-selected={selectedRole === 'organizer'}
                onClick={() => setSelectedRole('organizer')}
                className={`w-full text-left p-3 rounded-xl border transition text-xs font-semibold flex items-center justify-between cursor-pointer ${
                  selectedRole === 'organizer' 
                    ? 'border-indigo-500 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400' 
                    : 'border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span>Organizer (Operations)</span>
                <span className="text-[9px] font-mono opacity-60">Alt+O</span>
              </button>

              {/* Security Role */}
              <button
                id="role-tab-security"
                role="tab"
                aria-selected={selectedRole === 'security'}
                onClick={() => setSelectedRole('security')}
                className={`w-full text-left p-3 rounded-xl border transition text-xs font-semibold flex items-center justify-between cursor-pointer ${
                  selectedRole === 'security' 
                    ? 'border-indigo-500 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400' 
                    : 'border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span>Security Chief (Tactical)</span>
                <span className="text-[9px] font-mono opacity-60">Alt+T</span>
              </button>
            </div>
          </div>

          {/* Context Input panels (Spectator Location Fields) */}
          {selectedRole === 'spectator' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3.5 text-left animate-in fade-in slide-in-from-top-2 duration-200">
              <h3 className="font-sans font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5 pb-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                Live Spectator Location
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block mb-1">Current Section</label>
                  <input
                    id="spec-location-input"
                    type="text"
                    value={userLocation}
                    onChange={(e) => setUserLocation(e.target.value)}
                    placeholder="e.g. Section N5"
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-transparent text-slate-850 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block mb-1">Seat Number</label>
                  <input
                    id="spec-seat-input"
                    type="text"
                    value={seatNumber}
                    onChange={(e) => setSeatNumber(e.target.value)}
                    placeholder="e.g. Row 12, Seat 4"
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-transparent text-slate-850 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Dynamic AI recommendations panel */}
          <div className="bg-gradient-to-br from-indigo-950/45 to-slate-900 border border-indigo-500/15 rounded-2xl p-4 shadow-sm space-y-3 text-left">
            <h3 className="font-sans font-bold text-xs text-indigo-400 flex items-center gap-1.5 pb-1 border-b border-indigo-500/10">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              AI Live Recommendations
            </h3>
            <div className="space-y-2">
              {getAiRecommendationsByRole(selectedRole).map((rec, idx) => (
                <div key={idx} className="text-[11px] leading-relaxed text-slate-300 bg-slate-950/40 border border-indigo-500/5 p-2 rounded-xl flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-wider">{rec.type}</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-[8px] font-mono font-bold text-indigo-300">{rec.badge}</span>
                  </div>
                  <p className="text-slate-300">{rec.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action prompts sidebar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 text-left flex-1 overflow-y-auto min-h-0">
            <div>
              <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                Suggested Queries
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Select context-aware prompts designed for the active console role.</p>
            </div>

            <div className="space-y-2">
              {activeActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <button
                    id={`suggested-prompt-btn-${i}`}
                    key={i}
                    onClick={() => handleQuickAction(action.query)}
                    disabled={isSending}
                    className="w-full text-left p-3 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-950/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-start gap-2.5 disabled:opacity-50 cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chat Feed Console Log Column (Right Side) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col min-h-0 overflow-hidden">
          
          {/* Chat Feed */}
          <div id="assistant-chat-feed" className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20 dark:bg-slate-950/10">
            {chatHistory.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs border select-none ${
                    isUser 
                      ? 'bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700' 
                      : 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-500/10'
                  }`}>
                    {isUser ? 'OP' : 'AI'}
                  </div>

                  <div className={`max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed space-y-2 border text-left ${
                    isUser 
                      ? 'bg-slate-100 text-slate-800 border-slate-200/50 rounded-tr-none dark:bg-slate-850 dark:text-slate-200 dark:border-slate-850' 
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-100 dark:border-slate-850 rounded-tl-none shadow-xs'
                  }`}>
                    <div className="whitespace-pre-line font-sans prose dark:prose-invert">
                      {msg.text}
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 block pt-1 select-none text-right">
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex items-center gap-2.5 text-xs text-slate-400 font-mono pl-1 animate-pulse text-left">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span>My Stadium Assistant is analyzing context ({selectedRole.toUpperCase()})...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form input */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 flex gap-3">
            <input
              id="assistant-chat-input"
              type="text"
              required
              disabled={isSending}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isSending 
                  ? 'Awaiting AI sensory audit response...' 
                  : `Ask anything in ${selectedRole.toUpperCase()} console mode...`
              }
              className="w-full text-xs px-4 py-3 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-transparent text-slate-850 dark:text-white"
            />
            <button
              id="send-chat-msg-btn"
              type="submit"
              disabled={isSending || !inputText.trim()}
              className="py-3 px-4 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl transition font-semibold flex items-center justify-center shrink-0 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
