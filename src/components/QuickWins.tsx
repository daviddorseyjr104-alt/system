import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, AlertCircle, ChevronRight, ArrowRight, Trophy } from 'lucide-react';
import { QUICK_WINS } from '../data';
import type { QuickWin } from '../types';

const STATUS_CONFIG = {
  'done': { label: 'Done', color: '#10B981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', icon: <CheckCircle2 size={14} /> },
  'in-progress': { label: 'In Progress', color: '#C9A84C', bg: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.2)', icon: <Clock size={14} /> },
  'not-started': { label: 'Not Started', color: 'rgba(245,230,200,0.3)', bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.08)', icon: <Circle size={14} /> },
  'blocked': { label: 'Blocked', color: '#F87171', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', icon: <AlertCircle size={14} /> },
};

const PRIORITY_COLORS = {
  high: '#C9A84C',
  medium: '#8B5CF6',
  low: 'rgba(245,230,200,0.3)',
};

function KanbanColumn({
  title,
  status,
  wins,
  color,
  onMove,
}: {
  title: string;
  status: QuickWin['status'];
  wins: QuickWin[];
  color: string;
  onMove: (id: number, direction: 'forward' | 'back' | 'unblock') => void;
}) {
  const cfg = STATUS_CONFIG[status];
  const idx = PROGRESS_STATUSES.indexOf(status);

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-3 px-1">
        <div style={{ color }}>{cfg.icon}</div>
        <span className="text-xs font-medium" style={{ color }}>{title}</span>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full"
          style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}>
          {wins.length}
        </span>
      </div>
      <div className="space-y-2">
        {wins.map(win => (
          <div key={win.id} className="kanban-card group">
            <div className="flex items-start gap-2 mb-2">
              <div className="w-4 h-4 rounded flex items-center justify-center text-xs font-mono flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C', fontSize: '9px' }}>
                {win.id.toString().padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium leading-tight" style={{ color: '#F5E6C8' }}>{win.title}</div>
              </div>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1"
                style={{ background: PRIORITY_COLORS[win.priority] }} />
            </div>
            <div className="text-xs mb-2 leading-relaxed" style={{ color: 'rgba(245,230,200,0.4)', fontSize: '10px' }}>
              {win.output}
            </div>
            <div className="flex items-center gap-2">
              <span className="badge" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(245,230,200,0.4)', border: '1px solid rgba(255,255,255,0.06)', fontSize: '9px' }}>
                {win.owner}
              </span>
              <span className="ml-auto text-xs" style={{ color: 'rgba(245,230,200,0.25)', fontSize: '9px' }}>Wk {win.week}</span>
            </div>
            {/* Move buttons */}
            <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {status === 'blocked' ? (
                <button className="text-xs px-2 py-0.5 rounded"
                  style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C', fontSize: '9px', border: '1px solid rgba(201,168,76,0.2)' }}
                  onClick={() => onMove(win.id, 'unblock')}>
                  Unblock →
                </button>
              ) : (
                <>
                  {idx > 0 && (
                    <button className="text-xs px-2 py-0.5 rounded"
                      style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(245,230,200,0.4)', fontSize: '9px' }}
                      onClick={() => onMove(win.id, 'back')}>
                      ← Back
                    </button>
                  )}
                  {idx >= 0 && idx < PROGRESS_STATUSES.length - 1 && (
                    <button className="text-xs px-2 py-0.5 rounded ml-auto"
                      style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C', fontSize: '9px', border: '1px solid rgba(201,168,76,0.2)' }}
                      onClick={() => onMove(win.id, 'forward')}>
                      Move → {STATUS_CONFIG[PROGRESS_STATUSES[idx + 1]].label}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
        {wins.length === 0 && (
          <div className="rounded-lg p-4 text-center text-xs border-2 border-dashed"
            style={{ color: 'rgba(245,230,200,0.2)', borderColor: 'rgba(255,255,255,0.05)' }}>
            None
          </div>
        )}
      </div>
    </div>
  );
}

const PROGRESS_STATUSES: QuickWin['status'][] = ['not-started', 'in-progress', 'done'];

function loadWins(): typeof QUICK_WINS {
  try {
    const saved = localStorage.getItem('sm-quick-wins');
    if (!saved) return QUICK_WINS;
    const parsed: { id: number; status: QuickWin['status'] }[] = JSON.parse(saved);
    return QUICK_WINS.map(w => {
      const found = parsed.find(p => p.id === w.id);
      return found ? { ...w, status: found.status } : w;
    });
  } catch { return QUICK_WINS; }
}

function saveWins(wins: typeof QUICK_WINS) {
  localStorage.setItem('sm-quick-wins', JSON.stringify(wins.map(w => ({ id: w.id, status: w.status }))));
}

export default function QuickWins() {
  const [wins, setWins] = useState(loadWins);

  const moveWin = (id: number, direction: 'forward' | 'back' | 'unblock') => {
    setWins(prev => {
      const next = prev.map(w => {
        if (w.id !== id) return w;
        if (direction === 'unblock') return { ...w, status: 'not-started' as const };
        const idx = PROGRESS_STATUSES.indexOf(w.status as typeof PROGRESS_STATUSES[number]);
        if (idx === -1) return w; // blocked — use unblock
        if (direction === 'forward') return { ...w, status: PROGRESS_STATUSES[Math.min(idx + 1, PROGRESS_STATUSES.length - 1)] };
        return { ...w, status: PROGRESS_STATUSES[Math.max(idx - 1, 0)] };
      });
      saveWins(next);
      return next;
    });
  };

  const doneCount = wins.filter(w => w.status === 'done').length;
  const progress = Math.round((doneCount / wins.length) * 100);

  const getColumnWins = (status: QuickWin['status']) => wins.filter(w => w.status === status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="section-header mb-1">90-Day Quick Wins</h1>
        <p className="text-sm" style={{ color: 'rgba(245,230,200,0.45)' }}>
          12 actionable items — each small, reversible, and visible. Build team conviction that AI is a real tool through concrete weekly experience.
        </p>
      </div>

      {/* Progress overview */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Trophy size={20} style={{ color: '#C9A84C' }} />
            <div>
              <div className="text-sm font-medium" style={{ color: '#F5E6C8' }}>Overall Progress</div>
              <div className="text-xs" style={{ color: 'rgba(245,230,200,0.4)' }}>{doneCount} of {wins.length} shipped</div>
            </div>
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: '#C9A84C', lineHeight: 1 }}>
            {progress}%
          </div>
        </div>
        <div className="progress-bar h-2">
          <div className="progress-fill" style={{ width: `${progress}%`, height: '100%' }} />
        </div>
        <div className="flex gap-6 mt-3">
          {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
            <div key={status} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
              <span className="text-xs" style={{ color: 'rgba(245,230,200,0.4)' }}>
                {cfg.label}: {getColumnWins(status as QuickWin['status']).length}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Priority note */}
      <div className="rounded-xl p-4 text-sm" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)' }}>
        <strong style={{ color: '#C9A84C' }}>If only three things ship in 90 days:</strong>
        <span style={{ color: 'rgba(245,230,200,0.6)' }}> (1) Brand Voice document v1 in active use, (2) Team-tier Claude with the AI Use Policy posted, (3) one workflow with visible weekly time savings (PDP writing OR weekly trade synthesis).</span>
      </div>

      {/* Kanban board */}
      <div className="flex gap-4" style={{ minHeight: '500px' }}>
        <KanbanColumn
          title="Not Started"
          status="not-started"
          wins={getColumnWins('not-started')}
          color="rgba(245,230,200,0.4)"
          onMove={moveWin}
        />
        <KanbanColumn
          title="In Progress"
          status="in-progress"
          wins={getColumnWins('in-progress')}
          color="#C9A84C"
          onMove={moveWin}
        />
        <KanbanColumn
          title="Done ✓"
          status="done"
          wins={getColumnWins('done')}
          color="#10B981"
          onMove={moveWin}
        />
        <KanbanColumn
          title="Blocked"
          status="blocked"
          wins={getColumnWins('blocked')}
          color="#F87171"
          onMove={moveWin}
        />
      </div>

      {/* Timeline view */}
      <div className="glass rounded-xl p-5">
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#F5E6C8', marginBottom: '1rem' }}>
          Timeline View
        </h3>
        <div className="relative">
          <div className="absolute left-16 top-0 bottom-0 w-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="space-y-2">
            {wins.map(win => {
              const cfg = STATUS_CONFIG[win.status];
              return (
                <div key={win.id} className="flex items-start gap-4">
                  <div className="w-12 text-right text-xs flex-shrink-0 mt-1.5" style={{ color: 'rgba(245,230,200,0.35)' }}>
                    Wk {win.week.split('-')[0]}
                  </div>
                  <div className="flex-shrink-0 relative z-10 mt-1.5">
                    <div className="w-3 h-3 rounded-full border-2" style={{ background: cfg.bg, borderColor: cfg.color }} />
                  </div>
                  <div className="flex-1 flex items-center gap-3 pb-2">
                    <div className="flex-1">
                      <div className="text-xs font-medium" style={{ color: '#F5E6C8' }}>{win.title}</div>
                      <div className="text-xs" style={{ color: 'rgba(245,230,200,0.35)' }}>{win.owner}</div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0"
                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                      {cfg.icon}
                      {cfg.label}
                    </span>
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
