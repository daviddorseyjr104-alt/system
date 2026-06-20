import React from 'react';
import {
  LayoutDashboard, Bot, Palette, Megaphone, TrendingUp, BarChart2,
  Settings2, ShoppingBag, Store, Library, LineChart, CheckSquare,
  BookOpen, Settings, ChevronRight, Sparkles, Search
} from 'lucide-react';
import type { View } from '../types';

interface NavItem { id: View; label: string; icon: React.ReactNode; group: string }

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',   label: 'Command Center',   icon: <LayoutDashboard size={15} />, group: 'main' },
  { id: 'ai',          label: 'AI Workspace',      icon: <Bot size={15} />,            group: 'main' },
  { id: 'design',      label: 'Design & Product',  icon: <Palette size={15} />,        group: 'departments' },
  { id: 'marketing',   label: 'Marketing',         icon: <Megaphone size={15} />,      group: 'departments' },
  { id: 'sales',       label: 'Sales & Wholesale', icon: <TrendingUp size={15} />,     group: 'departments' },
  { id: 'planning',    label: 'Planning & Finance',icon: <BarChart2 size={15} />,      group: 'departments' },
  { id: 'operations',  label: 'Operations',        icon: <Settings2 size={15} />,      group: 'departments' },
  { id: 'ecommerce',   label: 'E-Commerce',        icon: <ShoppingBag size={15} />,    group: 'departments' },
  { id: 'retail',      label: 'Retail Stores',     icon: <Store size={15} />,          group: 'departments' },
  { id: 'prompts',     label: 'Prompt Library',    icon: <Library size={15} />,        group: 'tools' },
  { id: 'metrics',     label: 'Success Metrics',   icon: <LineChart size={15} />,      group: 'tools' },
  { id: 'wins',        label: '90-Day Quick Wins', icon: <CheckSquare size={15} />,    group: 'tools' },
  { id: 'brand',       label: 'Brand Voice Engine',icon: <BookOpen size={15} />,       group: 'tools' },
  { id: 'settings',    label: 'Settings',          icon: <Settings size={15} />,       group: 'system' },
];

const GROUPS = [
  { key: 'main',        label: null },
  { key: 'departments', label: 'Departments' },
  { key: 'tools',       label: 'Intelligence' },
  { key: 'system',      label: null },
];

interface Props {
  current: View;
  onNavigate: (v: View) => void;
  onOpenCmd: () => void;
  stats: { promptsRun: number; minutesSaved: number };
}

export default function Navigation({ current, onNavigate, onOpenCmd, stats }: Props) {
  return (
    <nav style={{
      position: 'fixed', left: 0, top: 0, width: '224px', height: '100vh',
      background: 'rgba(6,6,6,0.97)', borderRight: '1px solid rgba(255,255,255,0.055)',
      display: 'flex', flexDirection: 'column', zIndex: 100,
      backdropFilter: 'blur(20px)',
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
            background: 'linear-gradient(135deg, #C9A84C 0%, #E8C870 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#0D0D0D', fontFamily: 'Cormorant Garamond, serif', fontSize: '13px', fontWeight: 700,
            boxShadow: '0 2px 12px rgba(201,168,76,0.3)',
          }}>SM</div>
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', color: '#C9A84C', lineHeight: 1.2 }}>SIMON MILLER</div>
            <div style={{ fontSize: '9px', color: 'rgba(245,230,200,0.35)', lineHeight: 1.4 }}>AI Command Center</div>
          </div>
        </div>
      </div>

      {/* Search / command palette trigger */}
      <div style={{ padding: '10px 10px 6px', flexShrink: 0 }}>
        <button
          onClick={onOpenCmd}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '8px', padding: '7px 10px', cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
        >
          <Search size={12} style={{ color: 'rgba(245,230,200,0.3)', flexShrink: 0 }} />
          <span style={{ flex: 1, fontSize: '11px', color: 'rgba(245,230,200,0.3)', textAlign: 'left' }}>Search…</span>
          <kbd style={{ fontSize: '9px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '1px 4px', color: 'rgba(245,230,200,0.25)', fontFamily: 'JetBrains Mono, monospace' }}>⌘K</kbd>
        </button>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 8px 8px' }}>
        {GROUPS.map(group => {
          const items = NAV_ITEMS.filter(i => i.group === group.key);
          return (
            <div key={group.key} style={{ marginTop: group.label ? '16px' : '4px' }}>
              {group.label && (
                <div style={{ padding: '0 8px 6px', fontSize: '9px', fontWeight: 600, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(245,230,200,0.2)' }}>
                  {group.label}
                </div>
              )}
              {items.map(item => {
                const active = current === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '9px',
                      padding: '7px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                      background: active ? 'rgba(201,168,76,0.1)' : 'transparent',
                      color: active ? '#C9A84C' : 'rgba(245,230,200,0.5)',
                      fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: active ? 500 : 400,
                      transition: 'all 0.12s', textAlign: 'left', marginBottom: '1px',
                      borderLeft: active ? '2px solid #C9A84C' : '2px solid transparent',
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(245,230,200,0.75)'; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(245,230,200,0.5)'; } }}
                  >
                    <span style={{ flexShrink: 0, opacity: active ? 1 : 0.7 }}>{item.icon}</span>
                    <span style={{ flex: 1, lineHeight: 1 }}>{item.label}</span>
                    {active && <ChevronRight size={11} style={{ color: '#C9A84C', opacity: 0.6, flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Session stats footer */}
      <div style={{ padding: '10px 10px 14px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <div style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: '10px', padding: '10px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Sparkles size={9} style={{ color: '#C9A84C' }} />
            <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase' }}>Session</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', color: '#C9A84C', lineHeight: 1 }}>{stats.promptsRun}</div>
              <div style={{ fontSize: '9px', color: 'rgba(245,230,200,0.35)', marginTop: '2px' }}>prompts run</div>
            </div>
            <div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', color: '#C9A84C', lineHeight: 1 }}>
                {stats.minutesSaved >= 60 ? `${(stats.minutesSaved / 60).toFixed(1)}h` : `${stats.minutesSaved}m`}
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(245,230,200,0.35)', marginTop: '2px' }}>time saved</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
