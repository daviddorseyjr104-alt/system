import React, { useState, useMemo, useCallback } from 'react';
import { Search, Play, Copy, CheckCheck, Clock, Filter, Star, Zap, X } from 'lucide-react';
import type { View, Prompt } from '../types';
import { ALL_PROMPTS, DEPARTMENTS } from '../data';
import { useToast } from '../context/ToastContext';

interface Props {
  onNavigate: (v: View) => void;
  onLaunchPrompt: (prompt: string) => void;
}

const DEPT_COLORS: Record<string, string> = {
  design: '#C9A84C', marketing: '#8B5CF6', sales: '#10B981',
  planning: '#3B82F6', operations: '#F59E0B', ecommerce: '#EC4899', retail: '#06B6D4',
};

function loadFavorites(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem('sm-favorites') || '[]')); } catch { return new Set(); }
}

function renderWithVars(text: string) {
  return text.split(/(\[[A-Z][A-Z0-9 /\-]*\])/g).map((part, i) =>
    /^\[[A-Z]/.test(part)
      ? <mark key={i} style={{ background: 'rgba(201,168,76,0.15)', color: '#C9A84C', borderRadius: '2px', padding: '0 2px', fontStyle: 'normal' }}>{part}</mark>
      : <React.Fragment key={i}>{part}</React.Fragment>
  );
}

function PromptCard({ prompt, onLaunch }: { prompt: Prompt; onLaunch: (p: string) => void }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const color = DEPT_COLORS[prompt.departmentId] || '#C9A84C';

  const copy = useCallback(() => {
    navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    toast('Prompt copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  }, [prompt.prompt, toast]);

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', transition: 'border-color 0.15s' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
      <div className="p-4">
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ width: '3px', borderRadius: '2px', background: color, flexShrink: 0, alignSelf: 'stretch' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '4px' }}>
              <span className={`badge ${prompt.type === 'appendix' ? 'badge-blue' : prompt.type === 'workflow' ? 'badge-gold' : 'badge-purple'}`} style={{ fontSize: '9px' }}>
                {prompt.type}
              </span>
              <span style={{ fontSize: '10px', padding: '1px 7px', borderRadius: '99px', background: `${color}12`, color, border: `1px solid ${color}25` }}>
                {prompt.department.split(' ')[0]}
              </span>
              <span style={{ fontSize: '10px', color: 'rgba(245,230,200,0.3)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Clock size={9} /> saves {prompt.timeSaved}
              </span>
              <span style={{ fontSize: '10px', color: 'rgba(245,230,200,0.3)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Zap size={9} /> {prompt.timeEstimate} to run
              </span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#F5E6C8', marginBottom: '3px' }}>{prompt.title}</div>
            <div style={{ fontSize: '11px', color: 'rgba(245,230,200,0.45)', lineHeight: 1.55, marginBottom: '10px' }}>{prompt.description}</div>
            {prompt.variables.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                {prompt.variables.map(v => (
                  <span key={v} style={{ fontSize: '9px', padding: '1px 6px', borderRadius: '3px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.18)', color: 'rgba(201,168,76,0.7)', fontFamily: 'JetBrains Mono, monospace' }}>
                    [{v}]
                  </span>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button className="btn-gold" style={{ padding: '5px 12px', fontSize: '11px' }} onClick={() => onLaunch(prompt.prompt)} aria-label={`Launch ${prompt.title} in AI Workspace`}>
                <Play size={11} /> Launch in AI
              </button>
              <button className="btn-ghost" style={{ padding: '5px 10px', fontSize: '11px' }} onClick={copy} aria-label="Copy prompt">
                {copied ? <CheckCheck size={11} style={{ color: '#10B981' }} /> : <Copy size={11} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button className="btn-ghost" style={{ padding: '5px 10px', fontSize: '11px' }} onClick={() => setExpanded(e => !e)} aria-expanded={expanded} aria-label={expanded ? 'Hide prompt text' : 'View prompt text'}>
                {expanded ? 'Hide' : 'View prompt'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {expanded && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '12px 16px 14px' }}>
          <div className="prompt-block" style={{ maxHeight: '360px', overflowY: 'auto', fontSize: '11px' }}>
            {renderWithVars(prompt.prompt)}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PromptLibrary({ onNavigate, onLaunchPrompt }: Props) {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showFavsOnly, setShowFavsOnly] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(loadFavorites);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return ALL_PROMPTS.filter(p => {
      if (showFavsOnly && !favorites.has(p.id)) return false;
      if (filterDept && p.departmentId !== filterDept) return false;
      if (filterType && p.type !== filterType) return false;
      if (q && !p.title.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q) && !p.department.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, filterDept, filterType, showFavsOnly, favorites]);

  const toggleFav = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast('Removed from favorites', 'info'); }
      else { next.add(id); toast('Added to favorites', 'success'); }
      localStorage.setItem('sm-favorites', JSON.stringify([...next]));
      return next;
    });
  }, [toast]);

  const handleLaunch = useCallback((prompt: string) => {
    onLaunchPrompt(prompt);
    onNavigate('ai');
  }, [onLaunchPrompt, onNavigate]);

  const clearFilters = () => { setSearch(''); setFilterDept(''); setFilterType(''); setShowFavsOnly(false); };
  const hasFilters = search || filterDept || filterType || showFavsOnly;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-header mb-1">Prompt Library</h1>
        <p style={{ fontSize: '13px', color: 'rgba(245,230,200,0.45)' }}>
          {ALL_PROMPTS.length} production-ready prompts from the Simon Miller AI Roadmap. Each one launch-ready — click to open directly in AI Workspace.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Prompts',    value: ALL_PROMPTS.length,                                      color: '#C9A84C' },
          { label: 'Departments',      value: DEPARTMENTS.length,                                      color: '#8B5CF6' },
          { label: 'Workflow Prompts', value: ALL_PROMPTS.filter(p => p.type === 'workflow').length,   color: '#10B981' },
          { label: 'Favorited',        value: favorites.size,                                          color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="metric-card text-center" style={{ cursor: 'default' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '10px', color: 'rgba(245,230,200,0.4)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,230,200,0.3)', pointerEvents: 'none' }} />
          <input
            className="sm-input"
            style={{ paddingLeft: '36px' }}
            placeholder="Search prompts, departments, descriptions…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search prompts"
          />
        </div>
        <select className="sm-input" style={{ width: '170px' }} value={filterDept} onChange={e => setFilterDept(e.target.value)} aria-label="Filter by department">
          <option value="">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.shortName}</option>)}
        </select>
        <select className="sm-input" style={{ width: '130px' }} value={filterType} onChange={e => setFilterType(e.target.value)} aria-label="Filter by type">
          <option value="">All Types</option>
          <option value="workflow">Workflow</option>
          <option value="appendix">Appendix</option>
          <option value="template">Template</option>
        </select>
        <button
          className={showFavsOnly ? 'btn-gold' : 'btn-ghost'}
          style={{ padding: '8px 14px', fontSize: '12px', flexShrink: 0 }}
          onClick={() => setShowFavsOnly(f => !f)}
          aria-pressed={showFavsOnly}
          aria-label="Show favorites only"
        >
          <Star size={13} style={{ fill: showFavsOnly ? 'currentColor' : 'none' }} />
          Favorites {favorites.size > 0 && `(${favorites.size})`}
        </button>
        {hasFilters && (
          <button className="btn-ghost" style={{ padding: '8px 12px', fontSize: '12px', flexShrink: 0 }} onClick={clearFilters} aria-label="Clear all filters">
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {/* Result count */}
      <div style={{ fontSize: '11px', color: 'rgba(245,230,200,0.3)' }}>
        Showing <strong style={{ color: 'rgba(245,230,200,0.6)' }}>{filtered.length}</strong> of {ALL_PROMPTS.length} prompts
        {favorites.size > 0 && ` · ${favorites.size} favorited`}
      </div>

      {/* Prompt cards with inline favorite button */}
      <div className="space-y-2">
        {filtered.map(prompt => (
          <div key={prompt.id} style={{ position: 'relative' }}>
            <button
              onClick={() => toggleFav(prompt.id)}
              aria-label={favorites.has(prompt.id) ? `Remove ${prompt.title} from favorites` : `Add ${prompt.title} to favorites`}
              aria-pressed={favorites.has(prompt.id)}
              style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 2, background: 'none', border: 'none', cursor: 'pointer', color: favorites.has(prompt.id) ? '#C9A84C' : 'rgba(245,230,200,0.2)', transition: 'color 0.15s', padding: '4px' }}
              onMouseEnter={e => { if (!favorites.has(prompt.id)) e.currentTarget.style.color = 'rgba(245,230,200,0.5)'; }}
              onMouseLeave={e => { if (!favorites.has(prompt.id)) e.currentTarget.style.color = 'rgba(245,230,200,0.2)'; }}
            >
              <Star size={13} style={{ fill: favorites.has(prompt.id) ? 'currentColor' : 'none' }} />
            </button>
            <PromptCard prompt={prompt} onLaunch={handleLaunch} />
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '56px 24px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px', opacity: 0.15 }}>◻</div>
            <div style={{ fontSize: '14px', color: 'rgba(245,230,200,0.35)', marginBottom: '6px' }}>
              {showFavsOnly ? 'No favorites yet' : 'No prompts match your filters'}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(245,230,200,0.2)' }}>
              {showFavsOnly ? 'Click the star on any prompt to save it here' : 'Try adjusting or clearing the filters above'}
            </div>
            {hasFilters && (
              <button className="btn-ghost" style={{ margin: '16px auto 0', fontSize: '12px', padding: '7px 16px' }} onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
