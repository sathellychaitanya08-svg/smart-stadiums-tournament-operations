import React, { useState, useEffect } from 'react';
import { ShieldCheck, Eye, ShieldAlert, Server, Radio, Lock, RefreshCw } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  ip: string;
  status: 'success' | 'alert' | 'critical';
}

export default function SecurityHealthWidget() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [healthScore, setHealthScore] = useState(98);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/security/audit-logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.auditLogs || []);
        
        // Calculate a dynamic score based on the critical and alert events
        const criticalCount = (data.auditLogs || []).filter((l: AuditLog) => l.status === 'critical').length;
        const alertCount = (data.auditLogs || []).filter((l: AuditLog) => l.status === 'alert').length;
        const newScore = Math.max(60, 100 - (criticalCount * 10) - (alertCount * 3));
        setHealthScore(newScore);
      }
    } catch (e) {
      console.warn('Error fetching audit logs (will retry):', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      id="security-health-card" 
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Security & Access Health
            </h3>
            <p className="text-xs text-slate-400">Role-Based Access Controls (RBAC) and real-time audit logs.</p>
          </div>
          <button 
            id="refresh-audit-logs-btn"
            onClick={fetchLogs} 
            disabled={loading}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            title="Refresh Security State"
          >
            <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Security Summary row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div className="p-3 bg-slate-55 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800/80 text-center">
            <span className="text-[10px] text-slate-400 block font-mono font-semibold uppercase">Security Score</span>
            <span className={`text-2xl font-black font-mono tracking-tight ${healthScore > 90 ? 'text-emerald-500' : healthScore > 75 ? 'text-amber-500' : 'text-rose-500'}`}>
              {healthScore}%
            </span>
          </div>

          <div className="p-3 bg-slate-55 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800/80 text-center">
            <span className="text-[10px] text-slate-400 block font-mono font-semibold uppercase">Enforcement</span>
            <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 block mt-1">
              Active RBAC v2
            </span>
          </div>

          <div className="p-3 bg-slate-55 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800/80 text-center">
            <span className="text-[10px] text-slate-400 block font-mono font-semibold uppercase">SSL / Encryption</span>
            <span className="text-xs font-bold text-emerald-500 block mt-1">
              AES-256 GCM
            </span>
          </div>
        </div>

        {/* Policies Checklist */}
        <div className="space-y-2 mb-5">
          <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Active Defense Matrix</h4>
          
          <div className="flex items-center justify-between p-2 bg-slate-55 dark:bg-slate-950/40 rounded-lg text-xs">
            <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-400" /> Administrative API Gateways
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase px-1.5 py-0.5 bg-emerald-500/10 rounded">RBAC RESTRICTED</span>
          </div>

          <div className="flex items-center justify-between p-2 bg-slate-55 dark:bg-slate-950/40 rounded-lg text-xs">
            <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-indigo-400" /> IoT Boundary Sanitization
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase px-1.5 py-0.5 bg-emerald-500/10 rounded">SANITIZED</span>
          </div>

          <div className="flex items-center justify-between p-2 bg-slate-55 dark:bg-slate-950/40 rounded-lg text-xs">
            <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-indigo-400" /> IP Rate Capping Rules
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase px-1.5 py-0.5 bg-emerald-500/10 rounded">ACTIVE (60r/m)</span>
          </div>
        </div>
      </div>

      {/* Audit Log list */}
      <div>
        <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold mb-2 flex justify-between items-center">
          <span>Dynamic Administrative Audit Logs</span>
          <span className="text-[8px] text-slate-500 font-normal">Real-Time Sync</span>
        </h4>
        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
          {logs.slice(0, 4).map((log) => (
            <div 
              key={log.id} 
              className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-[11px] font-mono flex items-start gap-2 justify-between"
            >
              <div className="space-y-0.5 truncate">
                <p className="font-bold text-slate-700 dark:text-slate-200 truncate">{log.action}</p>
                <p className="text-[9px] text-slate-400 flex items-center gap-1">
                  <span>{log.actor}</span>
                  <span>•</span>
                  <span>IP: {log.ip}</span>
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className={`text-[8px] font-bold uppercase px-1 py-0.2 rounded ${
                  log.status === 'critical' ? 'bg-rose-500/10 text-rose-500' :
                  log.status === 'alert' ? 'bg-amber-500/10 text-amber-500' :
                  'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {log.status}
                </span>
                <span className="text-[8px] text-slate-500 block mt-0.5">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-xs text-slate-500 text-center italic py-2 font-mono">No audit logs logged on this channel.</p>
          )}
        </div>
      </div>
    </div>
  );
}
