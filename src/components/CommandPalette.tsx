import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Bot, LayoutDashboard, Palette, Megaphone, TrendingUp, BarChart2, Settings2, ShoppingBag, Store, Library, LineChart, CheckSquare, BookOpen, Settings, Play, ArrowRight } from 'lucide-react';
import { ALL_PROMPTS, DEPARTMENTS } from '../data';
import type { View } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onNavigate: (v: View) => void;
  onLaunchPrompt: (p: string) => void;
}

const NAV_ACTIONS = [
  { id: 'dashboard', label: 'Command Center', group: 'Navigate', icon: <LayoutDashboard size={14} /> },
  { id: 'ai', label: 'AI Workspace', group: 'Navigate', icon: <Bot size={14} /> },
  { id: 'design', label: 'Design & Product', group: 'Departments', icon: <Palette size={14} /> },
  { id: 'marketing', label: 'Marketing', group: 'Departments', icon: <Megaphone size={14} /> },
  { id: 'sales', label: 'Sales & Wholesale', group: 'Departments', icon: <TrendingUp size={14} /> },
  { id: 'planning', label: 'Planning & Finance', group: 'Departments', icon: <BarChart2 size={14} /> },
  { id: 'operations', label: 'Operations', group: 'Departments', icon: <Settings2 size={14} /> },
  { id: 'ecommerce', label: 'E-Commerce', group: 'Departments', icon: <ShoppingBag size={14} /> },
  { id: 'retail', label: 'Retail Stores', group: 'Departments', icon: <Store size={14} /> },
  { id: 'prompts', label: 'Prompt Library', group: 'Tools', icon: <Library size={14} /> },
  { id: 'metrics', label: 'Success Metrics', group: 'Tools', icon: <LineChart size={14} /> },
  { id: 'wins', label: '90-Day Quick Wins', group: 'Tools', icon: <CheckSquare size={14} /> },
  { id: 'brand', label: 'Brand Voice Engine', group: 'Tools', icon: <BookOpen size={14} /> },
  { id: 'settings', label: 'Settings', group: 'System', icon: <Settings size={14} /> },
];

const DEPT_COLORS: Record<string, string> = {
  design: '#C9A84C', marketing: '#8B5CF6', sales: '#10B981',
  planning: '#3B82F6', operations: '#F59E0B', ecommerce: '#EC4899', retail: '#06B6D4',
};

export default function CommandPalette({ open, onClose, onNavigate, onLaunchPrompt }: Props) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.toLowerCase();
    const navResults = NAV_ACTIONS
      .filter(a => !q || a.label.toLowerCase().includes(q) || a.group.toLowerCase().includes(q))
      .map(a => ({ ...a, type: 'nav' as const }));

    const promptResults = ALL_PROMPTS
      .filter(p => !q || p.title.toLowerCase().includes(q) || p.department.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
      .slice(0, 6)
      .map(p => ({ id: p.id, label: p.title, group: `Prompt · ${p.department.split(' ')[0]}`, icon: <Play size={14} />, type: 'prompt' as const, prompt: p.prompt, departmentId: p.departmentId }));

    return [...(q ? [] : navResults.slice(0, 5)), ...(q ? navResults : []), ...promptResults];
  }, [query]);

  useEffect(() => { setSelected(0); }, [query]);

  const handleSelect = (item: typeof results[0]) => {
    if (item.type === 'nav') {
      onNavigate(item.id as View);
    } else {
      onLaunchPrompt((item as { prompt: string }).prompt);
      onNavigate('ai');
    }
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === 'Enter' && results.length > 0 && results[selected]) { handleSelect(results[selected]); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, results, selected]);

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.children[selected] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  if (!open) return null;

  const groupedResults: Record<string, typeof results> = {};
  results.forEach(r => {
    if (!groupedResults[r.group]) groupedResults[r.group] = [];
    groupedResults[r.group].push(r);
  });

  let globalIdx = 0;

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '80px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ width: '560px', maxWidth: '90vw', background: 'rgba(12,12,12,0.98)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 32px 80px rgba(0,0,0,0.8)', overflow: 'hidden' }}>
        {/* Search input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Search size={16} style={{ color: 'rgba(245,230,200,0.35)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search pages, prompts, departments…"
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#F5E6C8', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
          />
          <kbd style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', color: 'rgba(245,230,200,0.3)', fontFamily: 'JetBrains Mono, monospace' }}>ESC</kbd>
        </div>

        {/* Results */}
        <div ref={listRef} style={{ maxHeight: '420px', overflowY: 'auto', padding: '8px' }}>
          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: 'rgba(245,230,200,0.3)', fontSize: '13px' }}>No results for "{query}"</div>
          ) : (
            Object.entries(groupedResults).map(([group, items]) => (
              <div key={group}>
                <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,230,200,0.25)', padding: '8px 10px 4px' }}>
                  {group}
                </div>
                {items.map(item => {
                  const idx = globalIdx++;
                  const isSelected = idx === selected;
                  const color = item.type === 'prompt' ? (DEPT_COLORS[(item as { departmentId?: string }).departmentId || ''] || '#C9A84C') : 'rgba(245,230,200,0.5)';
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelected(idx)}
                      style={{
                        width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '8px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                        background: isSelected ? 'rgba(201,168,76,0.08)' : 'transparent',
                        transition: 'background 0.1s',
                      }}
                    >
                      <span style={{ color, flexShrink: 0 }}>{item.icon}</span>
                      <span style={{ flex: 1, fontSize: '13px', color: isSelected ? '#F5E6C8' : 'rgba(245,230,200,0.7)' }}>
                        {item.label}
                      </span>
                      {isSelected && <ArrowRight size={12} style={{ color: '#C9A84C' }} />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '8px 16px', display: 'flex', gap: '16px' }}>
          {[['↑↓', 'navigate'], ['↵', 'select'], ['esc', 'close']].map(([key, action]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <kbd style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '1px 5px', fontSize: '10px', color: 'rgba(245,230,200,0.4)', fontFamily: 'JetBrains Mono, monospace' }}>{key}</kbd>
              <span style={{ fontSize: '10px', color: 'rgba(245,230,200,0.25)' }}>{action}</span>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', fontSize: '10px', color: 'rgba(245,230,200,0.2)' }}>
            {results.length} results
          </div>
        </div>
      </div>
    </div>
  );
}
