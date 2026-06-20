import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, Target } from 'lucide-react';
import { METRICS } from '../data';

const CATEGORY_COLORS: Record<string, string> = {
  efficiency: '#C9A84C',
  revenue:    '#10B981',
  compliance: '#3B82F6',
  engagement: '#8B5CF6',
};

const WEEKS = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Now'];

interface TooltipEntry { value: number; color: string; dataKey: string; name?: string }
interface TooltipProps { active?: boolean; payload?: TooltipEntry[]; label?: string }

function DarkTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(10,10,10,0.97)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '8px', padding: '8px 12px', fontSize: '11px', color: '#F5E6C8' }}>
      <div style={{ color: 'rgba(245,230,200,0.45)', marginBottom: '4px', fontSize: '10px' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, lineHeight: 1.6 }}>{p.dataKey}: {p.value}</div>
      ))}
    </div>
  );
}

function pct(current: number, target: number) {
  if (target === 0) return 0;
  return Math.min(Math.round((Math.abs(current) / Math.abs(target)) * 100), 100);
}

type Category = 'efficiency' | 'revenue' | 'compliance' | 'engagement' | '';

export default function MetricsDashboard() {
  const [activeCategory, setActiveCategory] = useState<Category>('');

  const filteredMetrics = useMemo(() =>
    activeCategory ? METRICS.filter(m => m.category === activeCategory) : METRICS,
    [activeCategory]
  );

  // Compute category summaries once
  const categorySummaries = useMemo(() => {
    const cats = ['efficiency', 'revenue', 'compliance', 'engagement'] as const;
    return cats.map(key => {
      const items = METRICS.filter(m => m.category === key);
      const avg = items.length > 0
        ? Math.round(items.reduce((s, m) => s + pct(m.current, m.targetValue), 0) / items.length)
        : 0;
      return { key, label: key.charAt(0).toUpperCase() + key.slice(1), count: items.length, avg, color: CATEGORY_COLORS[key] };
    });
  }, []);

  const overallProgress = useMemo(() =>
    METRICS.length > 0
      ? Math.round(METRICS.reduce((s, m) => s + pct(m.current, m.targetValue), 0) / METRICS.length)
      : 0,
    []
  );

  // Trend chart data — top 4 metrics
  const trendData = useMemo(() =>
    WEEKS.map((week, i) => {
      const row: Record<string, number | string> = { week };
      METRICS.slice(0, 4).forEach(m => { row[m.id] = m.history[i] ?? 0; });
      return row;
    }),
    []
  );

  const TREND_LINES = [
    { id: METRICS[0]?.id, color: '#C9A84C', label: METRICS[0]?.name },
    { id: METRICS[1]?.id, color: '#8B5CF6', label: METRICS[1]?.name },
    { id: METRICS[2]?.id, color: '#10B981', label: METRICS[2]?.name },
    { id: METRICS[3]?.id, color: '#3B82F6', label: METRICS[3]?.name },
  ].filter(t => t.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-header mb-1">Success Metrics</h1>
          <p style={{ fontSize: '13px', color: 'rgba(245,230,200,0.45)' }}>
            Year-1 targets from the Simon Miller AI Roadmap. Adoption measured by outcomes — not prompts run.
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', color: '#C9A84C', lineHeight: 1 }}>
            {overallProgress}%
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(245,230,200,0.4)' }}>overall vs target</div>
        </div>
      </div>

      {/* Category summary cards */}
      <div className="grid grid-cols-4 gap-3">
        {categorySummaries.map(cat => (
          <div key={cat.key} className="metric-card" style={{ cursor: 'default' }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: '11px', fontWeight: 500, color: cat.color }}>{cat.label}</span>
              <span style={{ fontSize: '10px', color: 'rgba(245,230,200,0.3)' }}>{cat.count} metrics</span>
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: cat.color, lineHeight: 1 }}>
              {cat.avg}%
            </div>
            <div className="progress-bar mt-2">
              <div className="progress-fill" style={{ width: `${cat.avg}%`, background: cat.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Trend chart */}
      <div className="glass rounded-xl p-5">
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#F5E6C8', marginBottom: '1rem' }}>
          Key Metric Trends (Week over Week)
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={trendData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="week" tick={{ fill: 'rgba(245,230,200,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(245,230,200,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<DarkTooltip />} />
            {TREND_LINES.map(t => (
              <Area key={t.id} type="monotone" dataKey={t.id} stroke={t.color} fill={`${t.color}08`} strokeWidth={2} dot={false} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '10px', flexWrap: 'wrap' }}>
          {TREND_LINES.map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '2px', borderRadius: '1px', background: t.color }} />
              <span style={{ fontSize: '10px', color: 'rgba(245,230,200,0.4)' }}>{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {[{ key: '' as Category, label: 'All Metrics' }, ...categorySummaries.map(c => ({ key: c.key as Category, label: c.label }))].map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            aria-pressed={activeCategory === cat.key}
            style={{
              fontSize: '11px', padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'all 0.15s',
              background: activeCategory === cat.key ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.03)',
              color: activeCategory === cat.key ? '#C9A84C' : 'rgba(245,230,200,0.45)',
              outline: activeCategory === cat.key ? '1px solid rgba(201,168,76,0.25)' : '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-3">
        {filteredMetrics.map(metric => {
          const progress = pct(metric.current, metric.targetValue);
          const color = CATEGORY_COLORS[metric.category];
          const TrendIcon = metric.trend === 'up' ? TrendingUp : metric.trend === 'down' ? TrendingDown : Minus;
          const trendColor = metric.trend === 'up' ? '#10B981' : metric.trend === 'down' ? '#F87171' : 'rgba(245,230,200,0.4)';
          const sparkData = metric.history.map((v, i) => ({ v, i }));

          return (
            <div key={metric.id} className="metric-card" style={{ cursor: 'default' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: '#F5E6C8', marginBottom: '3px' }}>{metric.name}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(245,230,200,0.35)', lineHeight: 1.4 }}>{metric.definition}</div>
                </div>
                <TrendIcon size={13} style={{ color: trendColor, flexShrink: 0, marginTop: '2px' }} aria-label={`Trend: ${metric.trend}`} />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color, lineHeight: 1 }}>
                    {metric.current}{metric.unit}
                  </div>
                  <div style={{ fontSize: '10px', color: 'rgba(245,230,200,0.3)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Target size={9} aria-hidden="true" /> Target: {metric.target}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: progress >= 80 ? '#10B981' : progress >= 50 ? '#C9A84C' : '#F59E0B' }}>{progress}%</div>
                  <div style={{ fontSize: '10px', color: 'rgba(245,230,200,0.3)' }}>to target</div>
                </div>
              </div>

              <div className="progress-bar" style={{ marginBottom: '8px' }}>
                <div className="progress-fill" style={{ width: `${progress}%`, background: progress >= 80 ? '#10B981' : color }} />
              </div>

              <div style={{ height: '28px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparkData}>
                    <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>

      {/* Honest note */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', fontSize: '13px', color: 'rgba(245,230,200,0.45)', lineHeight: 1.7 }}>
        <strong style={{ color: 'rgba(245,230,200,0.7)' }}>On targets:</strong> These numbers are intentionally honest. A 25-person brand will not 10× revenue from AI in year one. It will recover meaningful hours, sharpen its decisions, and build a knowledge base that becomes the most valuable onboarding asset in the company.
      </div>
    </div>
  );
}
