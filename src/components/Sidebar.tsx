/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  CalendarRange, 
  Users, 
  ShieldAlert, 
  Briefcase, 
  Leaf, 
  Cpu, 
  LogOut,
  Radio,
  Flame,
  Clock,
  Trophy,
  ShieldCheck,
  Eye,
  Type,
  Volume2
} from 'lucide-react';
import { User, StadiumState } from '../types.ts';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  onLogout: () => void;
  stadiumState: StadiumState;
  onSimulateTick: () => void;
  isSimulating: boolean;
  highContrast?: boolean;
  setHighContrast?: (hc: boolean) => void;
  textScale?: 'normal' | 'large' | 'xlarge';
  setTextScale?: (scale: 'normal' | 'large' | 'xlarge') => void;
  focusIndicators?: boolean;
  setFocusIndicators?: (fi: boolean) => void;
  voiceNarration?: boolean;
  setVoiceNarration?: (vn: boolean) => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  user, 
  onLogout, 
  stadiumState, 
  onSimulateTick,
  isSimulating,
  highContrast = false,
  setHighContrast,
  textScale = 'normal',
  setTextScale,
  focusIndicators = false,
  setFocusIndicators,
  voiceNarration = false,
  setVoiceNarration
}: SidebarProps) {
  
  // Dynamic alerts counting
  const activeIncidents = stadiumState.incidents.filter(i => i.status !== 'resolved').length;
  const criticalZones = stadiumState.zones.filter(z => z.status === 'critical').length;
  const liveMatch = stadiumState.matches.find(m => m.status === 'live');

  const menuItems = [
    { id: 'dashboard', name: 'Operations Center', icon: LayoutDashboard, badge: liveMatch ? 'LIVE' : null, badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[10px]' },
    { id: 'tournament', name: 'Tournament Intel', icon: Trophy, badge: 'REALTIME', badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono text-[10px]' },
    { id: 'scheduler', name: 'Match Scheduler', icon: CalendarRange, badge: null },
    { id: 'crowd', name: 'Crowd Intelligence', icon: Users, badge: criticalZones > 0 ? `${criticalZones} Alert` : null, badgeColor: 'bg-amber-500/10 text-amber-400 border border-amber-500/30' },
    { id: 'security', name: 'Security & Risks', icon: ShieldAlert, badge: activeIncidents > 0 ? `${activeIncidents} Active` : null, badgeColor: 'bg-rose-500/10 text-rose-400 border border-rose-500/30' },
    { id: 'resources', name: 'Resource Optimizer', icon: Briefcase, badge: null },
    { id: 'sustainability', name: 'Sustainability Core', icon: Leaf, badge: stadiumState.utility.savingModeActive ? 'ECO' : null, badgeColor: 'bg-teal-500/10 text-teal-400 border border-teal-500/30 font-mono text-[10px]' },
    { id: 'assistant', name: 'AI Co-Pilot', icon: Cpu, badge: 'AI', badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' },
    { id: 'testing', name: 'Testing & Quality', icon: ShieldCheck, badge: '91.8%', badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[10px]' },
  ];

  return (
    <aside id="app-sidebar" className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-screen text-slate-100 shrink-0">
      {/* Platform Title */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Radio className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="font-sans font-bold tracking-tight text-lg text-white">ArenaOps</h1>
          <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">Stadium Intelligence</p>
        </div>
      </div>

      {/* Operator profile card */}
      {user && (
        <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 font-bold text-sm">
              SC
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">{user.name}</p>
              <p className="text-[10px] font-mono text-slate-400 uppercase">{user.role}</p>
            </div>
          </div>
          <button 
            id="logout-btn"
            onClick={onLogout}
            title="Log Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Live Sensory Simulation Feed Clock */}
      <div className="p-4 mx-4 mt-4 bg-indigo-950/40 border border-indigo-900/40 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-indigo-300 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>IoT sensor Stream</span>
          </div>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
        </div>
        <button
          id="simulate-tick-btn"
          onClick={onSimulateTick}
          disabled={isSimulating}
          className="w-full text-center py-2 px-3 bg-indigo-600/90 hover:bg-indigo-600 text-white font-mono text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
        >
          {isSimulating ? 'Processing Sensor Tick...' : 'Simulate IoT Sensor Tick'}
        </button>
      </div>

      {/* WCAG 2.1 AA Accessibility Settings Panel */}
      <div className="p-4 mx-4 mt-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center gap-1.5 text-slate-300 text-xs font-bold uppercase tracking-wider">
          <Eye className="w-3.5 h-3.5 text-amber-500" />
          <span>A11y Preferences</span>
        </div>

        <div className="space-y-2">
          {/* High Contrast Toggle */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1">
              <Eye className="w-3 h-3 text-slate-500" /> High Contrast
            </span>
            <button
              id="a11y-high-contrast-toggle"
              aria-checked={highContrast}
              role="switch"
              onClick={() => setHighContrast?.(!highContrast)}
              className={`w-8 h-4 rounded-full transition relative border ${
                highContrast ? 'bg-amber-500 border-amber-600' : 'bg-slate-800 border-slate-700'
              }`}
            >
              <span className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${highContrast ? 'right-0.5' : 'left-0.5'}`}></span>
            </button>
          </div>

          {/* Voice Narrator Toggle */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-slate-500" /> Voice Narrator
            </span>
            <button
              id="a11y-voice-narrator-toggle"
              aria-checked={voiceNarration}
              role="switch"
              onClick={() => setVoiceNarration?.(!voiceNarration)}
              className={`w-8 h-4 rounded-full transition relative border ${
                voiceNarration ? 'bg-amber-500 border-amber-600' : 'bg-slate-800 border-slate-700'
              }`}
            >
              <span className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${voiceNarration ? 'right-0.5' : 'left-0.5'}`}></span>
            </button>
          </div>

          {/* Keyboard Focus Ring Toggle */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-slate-500" /> Focus Ring
            </span>
            <button
              id="a11y-focus-ring-toggle"
              aria-checked={focusIndicators}
              role="switch"
              onClick={() => setFocusIndicators?.(!focusIndicators)}
              className={`w-8 h-4 rounded-full transition relative border ${
                focusIndicators ? 'bg-amber-500 border-amber-600' : 'bg-slate-800 border-slate-700'
              }`}
            >
              <span className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${focusIndicators ? 'right-0.5' : 'left-0.5'}`}></span>
            </button>
          </div>

          {/* Text Scaling Control */}
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] flex items-center gap-1">
              <Type className="w-3 h-3 text-slate-500" /> Text Scaling
            </span>
            <div className="grid grid-cols-3 gap-1">
              {(['normal', 'large', 'xlarge'] as const).map((scale) => (
                <button
                  key={scale}
                  id={`a11y-scale-${scale}`}
                  onClick={() => setTextScale?.(scale)}
                  className={`text-[9px] font-mono font-bold py-1 px-1 rounded border transition ${
                    textScale === scale
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  {scale === 'normal' ? '1.0x' : scale === 'large' ? '1.1x' : '1.2x'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav id="sidebar-nav" className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              id={`nav-tab-${item.id}`}
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isActive ? 'scale-110 text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase ${item.badgeColor || 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Status Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/20 text-center font-mono text-[10px] text-slate-500">
        <div>SYS OPERATIONAL • v2.6.2</div>
        <div>APEX COLISEUM HUB</div>
      </div>
    </aside>
  );
}
