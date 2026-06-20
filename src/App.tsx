import React, { useState, useEffect, useCallback } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import AccessGate from './components/AccessGate';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import AIWorkspace from './components/AIWorkspace';
import DepartmentHub from './components/DepartmentHub';
import PromptLibrary from './components/PromptLibrary';
import MetricsDashboard from './components/MetricsDashboard';
import QuickWins from './components/QuickWins';
import BrandVoiceEditor from './components/BrandVoice';
import Settings from './components/Settings';
import CommandPalette from './components/CommandPalette';
import { ToastProvider, useToast } from './context/ToastContext';
import type { View, AppStats, BrandVoice } from './types';
import { DEFAULT_BRAND_VOICE } from './data';

const DEPT_IDS = ['design', 'marketing', 'sales', 'planning', 'operations', 'ecommerce', 'retail'];

const DEFAULT_STATS: AppStats = {
  promptsRun: 0,
  minutesSaved: 0,
  pdpsDrafted: 0,
  emailsDrafted: 0,
  winsCompleted: 0,
};

function loadStats(): AppStats {
  try {
    const s = localStorage.getItem('sm-stats');
    return s ? { ...DEFAULT_STATS, ...JSON.parse(s) } : DEFAULT_STATS;
  } catch { return DEFAULT_STATS; }
}

function loadBrandVoice(): BrandVoice {
  try {
    const s = localStorage.getItem('sm-brand-voice');
    return s ? { ...DEFAULT_BRAND_VOICE, ...JSON.parse(s) } : DEFAULT_BRAND_VOICE;
  } catch { return DEFAULT_BRAND_VOICE; }
}

function AppInner() {
  const { toast } = useToast();
  const [view, setView] = useState<View>('dashboard');
  const [stats, setStats] = useState<AppStats>(loadStats);
  const [brandVoice, setBrandVoice] = useState<BrandVoice>(loadBrandVoice);
  const [initialPrompt, setInitialPrompt] = useState('');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('sm-api-key') || '');
  const [model, setModel] = useState(() => localStorage.getItem('sm-model') || 'claude-opus-4-8');
  const [serverHasKey, setServerHasKey] = useState(true);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [conversationsClearedAt, setConversationsClearedAt] = useState(0);

  // Check if server has API key
  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(d => setServerHasKey(!!d.hasKey))
      .catch(() => setServerHasKey(false));
  }, []);

  // Persist stats & brand voice
  useEffect(() => { localStorage.setItem('sm-stats', JSON.stringify(stats)); }, [stats]);
  useEffect(() => { localStorage.setItem('sm-brand-voice', JSON.stringify(brandVoice)); }, [brandVoice]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === 'k') { e.preventDefault(); setCmdOpen(o => !o); return; }
      if (meta && e.key === '1') { e.preventDefault(); setView('dashboard'); }
      if (meta && e.key === '2') { e.preventDefault(); setView('ai'); }
      if (meta && e.key === 'p') { e.preventDefault(); setView('prompts'); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleApiKeyChange = (k: string) => {
    setApiKey(k);
    localStorage.setItem('sm-api-key', k);
  };

  const handleModelChange = (m: string) => {
    setModel(m);
    localStorage.setItem('sm-model', m);
  };

  const handleLaunchPrompt = useCallback((prompt: string) => {
    setInitialPrompt(prompt);
    setView('ai');
    toast('Prompt loaded in AI Workspace', 'success');
  }, [toast]);

  const handleNavigate = useCallback((v: View) => {
    setView(v);
  }, []);

  const handleStatsReset = () => {
    setStats(DEFAULT_STATS);
    localStorage.removeItem('sm-stats');
    toast('Session stats reset', 'info');
  };

  // Brand voice as string for AI
  const brandVoiceText = [
    brandVoice.whoWeAre && `## Who We Are\n${brandVoice.whoWeAre}`,
    brandVoice.whoWeServe && `## Who We Make For\n${brandVoice.whoWeServe}`,
    brandVoice.voiceParagraph && `## Voice\n${brandVoice.voiceParagraph}`,
    brandVoice.voiceRules.filter(r => r.yes).length > 0
      && `## Voice Rules\n${brandVoice.voiceRules.filter(r => r.yes).map(r => `✓ "${r.yes}"\n✕ "${r.no}"`).join('\n')}`,
    brandVoice.bannedWords.length > 0 && `## Banned Words\n${brandVoice.bannedWords.join(', ')}`,
  ].filter(Boolean).join('\n\n');

  const showBanner = !apiKey && !serverHasKey && view !== 'settings';

  const renderMain = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard stats={stats} onNavigate={handleNavigate} onLaunchPrompt={handleLaunchPrompt} />;
      case 'ai':
        return (
          <AIWorkspace
            initialPrompt={initialPrompt}
            onClearInitialPrompt={() => setInitialPrompt('')}
            apiKey={apiKey}
            model={model}
            brandVoice={brandVoiceText}
            conversationsClearedAt={conversationsClearedAt}
            onPromptRun={() => setStats(prev => ({ ...prev, promptsRun: prev.promptsRun + 1, minutesSaved: prev.minutesSaved + 8 }))}
          />
        );
      case 'prompts':
        return <PromptLibrary onNavigate={handleNavigate} onLaunchPrompt={handleLaunchPrompt} />;
      case 'metrics':
        return <MetricsDashboard />;
      case 'wins':
        return <QuickWins />;
      case 'brand':
        return <BrandVoiceEditor value={brandVoice} onChange={setBrandVoice} />;
      case 'settings':
        return (
          <Settings
            apiKey={apiKey}
            model={model}
            stats={stats}
            onApiKeyChange={handleApiKeyChange}
            onModelChange={handleModelChange}
            onStatsReset={handleStatsReset}
            onClearConversations={() => setConversationsClearedAt(Date.now())}
          />
        );
      default:
        if (DEPT_IDS.includes(view)) {
          return <DepartmentHub deptId={view} onNavigate={handleNavigate} onLaunchPrompt={handleLaunchPrompt} />;
        }
        return null;
    }
  };

  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      {/* Fixed ambient glows */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '20%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(201,168,76,0.035) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-5%', right: '5%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(139,92,246,0.025) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* Sidebar nav — fixed, 224px wide */}
      <Navigation current={view} onNavigate={handleNavigate} stats={stats} onOpenCmd={() => setCmdOpen(true)} />

      {/* Main content — pushed right by nav width, full viewport height scrollable */}
      <div style={{ marginLeft: '224px', height: '100vh', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* No API key banner */}
        {showBanner && (
          <div
            onClick={() => setView('settings')}
            style={{ background: 'rgba(201,168,76,0.07)', borderBottom: '1px solid rgba(201,168,76,0.15)', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', flexShrink: 0 }}
          >
            <span style={{ color: 'rgba(245,230,200,0.65)', fontSize: '13px' }}>No API key configured — AI Workspace requires one to function.</span>
            <span style={{ color: '#C9A84C', fontSize: '12px', fontWeight: 500 }}>Add in Settings →</span>
          </div>
        )}

        {/* Page content */}
        <div style={{ flex: 1, minHeight: 0, padding: view === 'ai' ? '0' : '36px 40px', maxWidth: view === 'ai' ? 'none' : '1400px', width: '100%', overflow: view === 'ai' ? 'hidden' : 'auto', display: view === 'ai' ? 'flex' : 'block', flexDirection: 'column' }}>
          <ErrorBoundary>
            {renderMain()}
          </ErrorBoundary>
        </div>
      </div>

      {/* Command palette */}
      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onNavigate={v => { handleNavigate(v); setCmdOpen(false); }}
        onLaunchPrompt={handleLaunchPrompt}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AccessGate>
        <ToastProvider>
          <AppInner />
        </ToastProvider>
      </AccessGate>
    </ErrorBoundary>
  );
}
