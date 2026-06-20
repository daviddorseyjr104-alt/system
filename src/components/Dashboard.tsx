import React, { useState } from 'react';
import {
  Palette, Megaphone, TrendingUp, BarChart2, Settings2, ShoppingBag,
  Store, ArrowRight, Clock, Zap, CheckCircle2, Target,
  ChevronRight, BookOpen, Sparkles
} from 'lucide-react';
import type { View, AppStats } from '../types';
import { DEPARTMENTS, PHASES, STRATEGIC_PRINCIPLES, QUICK_WINS, ALL_PROMPTS, METRICS } from '../data';

const DEPT_ICONS: Record<string, React.ReactNode> = {
  design:     <Palette size={18} />,
  marketing:  <Megaphone size={18} />,
  sales:      <TrendingUp size={18} />,
  planning:   <BarChart2 size={18} />,
  operations: <Settings2 size={18} />,
  ecommerce:  <ShoppingBag size={18} />,
  retail:     <Store size={18} />,
};

const PHASE_STATUS_STYLE: Record<string, { dot: string; text: string; bar: string; width: string }> = {
  complete: { dot: '#10B981', text: '#10B981', bar: '#10B981', width: '100%' },
  active:   { dot: '#C9A84C', text: '#C9A84C', bar: '#C9A84C', width: '40%' },
  upcoming: { dot: 'rgba(255,255,255,0.15)', text: 'rgba(245,230,200,0.4)', bar: '#C9A84C', width: '0%' },
};

interface Props {
  onNavigate: (v: View) => void;
  onLaunchPrompt: (p: string) => void;
  stats: AppStats;
}

function loadWinStatuses() {
  try {
    const saved = localStorage.getItem('sm-quick-wins');
    if (!saved) return QUICK_WINS;
    const parsed: { id: number; status: string }[] = JSON.parse(saved);
    return QUICK_WINS.map(w => {
      const found = parsed.find(p => p.id === w.id);
      return found ? { ...w, status: found.status as typeof w.status } : w;
    });
  } catch { return QUICK_WINS; }
}

export default function Dashboard({ onNavigate, onLaunchPrompt, stats }: Props) {
  const [showPrinciples, setShowPrinciples] = useState(false);

  // All derived from real roadmap data — no session inflation
  const liveWins   = loadWinStatuses();
  const doneWins   = liveWins.filter(w => w.status === 'done').length;
  const activeWins = liveWins.filter(w => w.status === 'in-progress').length;
  const totalUseCases = DEPARTMENTS.reduce((s, d) => s + d.useCases.length, 0);

  const avgMetricPct = Math.round(
    METRICS.reduce((s, m) => s + Math.min(Math.round((Math.abs(m.current) / Math.abs(m.targetValue)) * 100), 100), 0) / METRICS.length
  );

  // Pull the hours-saved benchmark directly from the metrics model
  const hoursSavedMetric = METRICS.find(m => m.id === 'hours-saved');
  const hoursSavedVal = hoursSavedMetric ? hoursSavedMetric.current : 0;

  const winsProgress = Math.round((doneWins / QUICK_WINS.length) * 100);

  // Four clean, always-meaningful cards — no session counters that inflate during testing
  const statCards = [
    {
      label: 'Hrs Saved / Role / Wk',
      value: `${hoursSavedVal}h`,
      color: '#C9A84C',
      icon: <Clock size={16} />,
      sub: `Target: ${hoursSavedMetric?.target ?? '6–10 hrs'}`,
      onClick: () => onNavigate('metrics'),
    },
    {
      label: 'Prompts in Library',
      value: `${ALL_PROMPTS.length}`,
      color: '#8B5CF6',
      icon: <Zap size={16} />,
      sub: `Across ${DEPARTMENTS.length} functional areas`,
      onClick: () => onNavigate('prompts'),
    },
    {
      label: 'Quick Wins Progress',
      value: `${doneWins}/${QUICK_WINS.length}`,
      color: '#10B981',
      icon: <CheckCircle2 size={16} />,
      sub: activeWins > 0 ? `${activeWins} in progress · ${winsProgress}% complete` : `${winsProgress}% complete`,
      onClick: () => onNavigate('wins'),
    },
    {
      label: 'Avg. Metric vs Target',
      value: `${avgMetricPct}%`,
      color: '#3B82F6',
      icon: <Target size={16} />,
      sub: `Across ${METRICS.length} tracked KPIs`,
      onClick: () => onNavigate('metrics'),
    },
  ];

  return (
    <div className="space-y-7">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl px-8 py-10"
        style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.07) 0%, rgba(201,168,76,0.02) 60%, transparent 100%)', border: '1px solid rgba(201,168,76,0.14)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 78% 50%, rgba(201,168,76,0.12) 0%, transparent 55%)', pointerEvents: 'none' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={11} style={{ color: '#C9A84C' }} />
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: '#C9A84C', textTransform: 'uppercase' }}>
              Simon Miller · AI Command Center
            </span>
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', fontWeight: 500, color: '#F5E6C8', lineHeight: 1.08, marginBottom: '12px' }}>
            Remove the friction.<br />
            <span className="text-gold-gradient">Keep the craft.</span>
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(245,230,200,0.5)', lineHeight: 1.8, maxWidth: '520px' }}>
            {DEPARTMENTS.length} functional areas. {ALL_PROMPTS.length} ready-to-run prompts. One brand voice.
            Claude AI embedded across every workflow so a {' '}
            <span style={{ color: 'rgba(245,230,200,0.8)' }}>25-person team operates like one three times its size.</span>
          </p>
          <div className="flex gap-3 mt-6">
            <button className="btn-gold" onClick={() => onNavigate('ai')}>
              <Zap size={14} />
              Open AI Workspace
            </button>
            <button className="btn-ghost" onClick={() => onNavigate('prompts')}>
              Browse {ALL_PROMPTS.length} Prompts
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((card) => (
          <button
            key={card.label}
            className="metric-card text-left"
            style={{ cursor: 'pointer' }}
            onClick={card.onClick}
            onMouseEnter={e => (e.currentTarget.style.borderColor = `${card.color}35`)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg" style={{ background: `${card.color}12`, color: card.color }}>
                {card.icon}
              </div>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: card.color, opacity: 0.6, boxShadow: `0 0 6px ${card.color}` }} />
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', fontWeight: 500, color: card.color, lineHeight: 1, marginBottom: '6px' }}>
              {card.value}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(245,230,200,0.6)', fontWeight: 500, marginBottom: '4px' }}>{card.label}</div>
            <div style={{ fontSize: '10px', color: 'rgba(245,230,200,0.3)', lineHeight: 1.4 }}>{card.sub}</div>
          </button>
        ))}
      </div>

      {/* Department grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.35rem', fontWeight: 400, color: '#F5E6C8' }}>
            Functional Hubs
          </h2>
          <span style={{ fontSize: '11px', color: 'rgba(245,230,200,0.3)' }}>
            {DEPARTMENTS.length} departments · {totalUseCases} use cases
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {DEPARTMENTS.slice(0, 6).map(dept => (
            <button
              key={dept.id}
              className="dept-card p-5 text-left"
              style={{ background: dept.bgPattern }}
              onClick={() => onNavigate(dept.id as View)}
              aria-label={`Open ${dept.name} hub`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg" style={{ background: `${dept.color}14`, color: dept.color }}>
                  {DEPT_ICONS[dept.id]}
                </div>
                <ArrowRight size={14} className="dept-card-arrow transition-all duration-200"
                  style={{ color: 'rgba(245,230,200,0.2)', marginTop: '3px' }} />
              </div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: '#F5E6C8', marginBottom: '4px' }}>{dept.shortName}</div>
              <div style={{ fontSize: '11px', color: 'rgba(245,230,200,0.42)', lineHeight: 1.55, marginBottom: '12px' }}>
                {dept.description.length > 72
                  ? dept.description.slice(0, dept.description.lastIndexOf(' ', 72)) + '…'
                  : dept.description}
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-gold" style={{ fontSize: '9px' }}>{dept.useCases.length} use cases</span>
                <span className="badge" style={{ background: `${dept.color}10`, color: dept.color, border: `1px solid ${dept.color}25`, fontSize: '9px' }}>
                  {dept.workflows.length} workflow{dept.workflows.length !== 1 ? 's' : ''}
                </span>
              </div>
            </button>
          ))}
        </div>
        {DEPARTMENTS[6] && (
          <button
            className="dept-card p-5 text-left w-full"
            style={{ background: DEPARTMENTS[6].bgPattern }}
            onClick={() => onNavigate(DEPARTMENTS[6].id as View)}
            aria-label={`Open ${DEPARTMENTS[6].name} hub`}
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-lg flex-shrink-0" style={{ background: `${DEPARTMENTS[6].color}14`, color: DEPARTMENTS[6].color }}>
                {DEPT_ICONS['retail']}
              </div>
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: '13px', fontWeight: 500, color: '#F5E6C8', marginBottom: '3px' }}>{DEPARTMENTS[6].name}</div>
                <div style={{ fontSize: '11px', color: 'rgba(245,230,200,0.42)', lineHeight: 1.5 }}>
                  {DEPARTMENTS[6].description.length > 100
                    ? DEPARTMENTS[6].description.slice(0, DEPARTMENTS[6].description.lastIndexOf(' ', 100)) + '…'
                    : DEPARTMENTS[6].description}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="badge badge-gold" style={{ fontSize: '9px' }}>{DEPARTMENTS[6].useCases.length} use cases</span>
                <ArrowRight size={14} className="dept-card-arrow" style={{ color: 'rgba(245,230,200,0.2)' }} />
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Phase progress + Quick wins */}
      <div className="grid grid-cols-2 gap-5">
        {/* Phase progress */}
        <div className="glass rounded-xl p-5">
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#F5E6C8', marginBottom: '1.1rem' }}>
            12-Month Rollout
          </h3>
          <div className="space-y-4">
            {PHASES.map(phase => {
              const s = PHASE_STATUS_STYLE[phase.status];
              return (
                <div key={phase.number}>
                  <div className="flex items-center gap-3 mb-2">
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.dot, flexShrink: 0, boxShadow: phase.status === 'active' ? `0 0 8px ${s.dot}` : 'none' }} />
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 500, color: s.text }}>
                        Phase {phase.number}: {phase.name}
                      </span>
                      <span style={{ fontSize: '10px', color: 'rgba(245,230,200,0.28)' }}>{phase.months}</span>
                    </div>
                  </div>
                  <div className="ml-5 progress-bar">
                    <div className="progress-fill" style={{ width: s.width, background: s.bar }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick wins summary */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#F5E6C8' }}>
              90-Day Quick Wins
            </h3>
            <button onClick={() => onNavigate('wins')} style={{ fontSize: '11px', color: '#C9A84C', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
              aria-label="View all quick wins">
              View all <ChevronRight size={11} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'Done',         count: doneWins,    color: '#10B981' },
              { label: 'In Progress',  count: activeWins,  color: '#C9A84C' },
              { label: 'Not Started',  count: liveWins.filter(w => w.status === 'not-started').length, color: 'rgba(245,230,200,0.25)' },
            ].map(s => (
              <div key={s.label} className="rounded-lg p-3 text-center"
                style={{ background: `${s.color}09`, border: `1px solid ${s.color}1A` }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: s.color, lineHeight: 1 }}>{s.count}</div>
                <div style={{ fontSize: '10px', color: 'rgba(245,230,200,0.4)', marginTop: '3px' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div className="progress-bar mb-4">
            <div className="progress-fill" style={{ width: `${liveWins.length > 0 ? (doneWins / liveWins.length) * 100 : 0}%` }} />
          </div>
          <div className="space-y-2">
            {liveWins.filter(w => w.status === 'in-progress').slice(0, 3).map(win => (
              <div key={win.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#C9A84C', flexShrink: 0 }} />
                <span style={{ fontSize: '11px', color: 'rgba(245,230,200,0.6)', flex: 1 }}>{win.title}</span>
                <span style={{ fontSize: '10px', color: 'rgba(245,230,200,0.28)' }}>Wk {win.week.split('-')[0]}</span>
              </div>
            ))}
            {liveWins.filter(w => w.status === 'in-progress').length === 0 && (
              <p style={{ fontSize: '11px', color: 'rgba(245,230,200,0.3)', textAlign: 'center', padding: '8px 0' }}>No items in progress</p>
            )}
          </div>
        </div>
      </div>

      {/* Strategic principles */}
      <div className="glass rounded-xl overflow-hidden">
        <button
          className="flex items-center justify-between w-full p-5"
          onClick={() => setShowPrinciples(p => !p)}
          aria-expanded={showPrinciples}
          aria-controls="principles-panel"
        >
          <div className="flex items-center gap-3">
            <BookOpen size={15} style={{ color: '#C9A84C' }} />
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#F5E6C8' }}>
              {STRATEGIC_PRINCIPLES.length} Strategic Principles
            </h3>
          </div>
          <ChevronRight size={14} style={{ color: 'rgba(245,230,200,0.35)', transform: showPrinciples ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
        </button>
        {showPrinciples && (
          <div id="principles-panel" className="grid grid-cols-2 gap-3 px-5 pb-5">
            {STRATEGIC_PRINCIPLES.map(p => (
              <div key={p.number} className="rounded-lg p-3"
                style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.1)' }}>
                <div style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: '#C9A84C', marginBottom: '4px' }}>{p.number}</div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: '#F5E6C8', marginBottom: '4px' }}>{p.title}</div>
                <div style={{ fontSize: '11px', color: 'rgba(245,230,200,0.42)', lineHeight: 1.55 }}>
                  {p.body.length > 90 ? p.body.slice(0, p.body.lastIndexOf(' ', 90)) + '…' : p.body}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
