import React, { useState } from 'react';
import { Key, Eye, EyeOff, CheckCircle2, AlertCircle, Cpu, Shield, BookOpen, Zap, Save, RotateCcw, Trash2 } from 'lucide-react';
import type { AppStats } from '../types';
import { useToast } from '../context/ToastContext';

interface Props {
  apiKey: string;
  model: string;
  stats: AppStats;
  onApiKeyChange: (k: string) => void;
  onModelChange: (m: string) => void;
  onStatsReset: () => void;
  onClearConversations: () => void;
}

const MODELS = [
  {
    id: 'claude-sonnet-4-6',
    name: 'Claude Sonnet 4.6',
    speed: 'Fast',
    quality: 'Excellent',
    recommended: false,
    description: 'Fast and capable. Good for high-volume repetitive tasks where speed matters more than depth.',
    color: '#C9A84C',
  },
  {
    id: 'claude-opus-4-8',
    name: 'Claude Opus 4.8',
    speed: 'Deep',
    quality: 'Maximum',
    recommended: true,
    description: 'The most powerful Claude model. Best for complex reasoning, strategic memos, trend synthesis, nuanced brand voice work, and any high-stakes output.',
    color: '#8B5CF6',
  },
  {
    id: 'claude-haiku-4-5-20251001',
    name: 'Claude Haiku 4.5',
    speed: 'Instant',
    quality: 'Good',
    recommended: false,
    description: 'Fastest responses. Great for quick CS drafts, short email subjects, and repetitive classification tasks.',
    color: '#10B981',
  },
];

const GUARDRAILS = [
  { icon: <Shield size={14} />, text: 'AI does not make final buy decisions — it drafts, you decide.' },
  { icon: <Shield size={14} />, text: 'All pricing outputs are directional — finance reviews before market.' },
  { icon: <Shield size={14} />, text: 'CS responses are drafts — a human clicks send.' },
  { icon: <Shield size={14} />, text: 'AI does not have access to live inventory or order systems.' },
  { icon: <Shield size={14} />, text: 'Brand voice outputs require human editorial judgment before publishing.' },
  { icon: <Shield size={14} />, text: 'AI does not author design briefs autonomously — it drafts, designers decide.' },
];

export default function Settings({ apiKey, model, stats, onApiKeyChange, onModelChange, onStatsReset, onClearConversations }: Props) {
  const { toast } = useToast();
  const [keyInput, setKeyInput] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'ok' | 'fail' | null>(null);

  const keyValid = !keyInput || keyInput.startsWith('sk-ant-');

  const saveSettings = () => {
    if (keyInput && !keyInput.startsWith('sk-ant-')) {
      toast('API key must start with sk-ant-', 'error');
      return;
    }
    onApiKeyChange(keyInput);
    localStorage.setItem('sm-api-key', keyInput);
    localStorage.setItem('sm-model', model);
    setSaved(true);
    toast('Settings saved', 'success');
    setTimeout(() => setSaved(false), 2500);
  };

  const clearConversations = () => {
    localStorage.removeItem('sm-conversations');
    onClearConversations();
    toast('Conversation history cleared', 'info');
  };

  const testConnection = async () => {
    if (!keyInput.trim()) return;
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: keyInput }),
      });
      setTestResult(res.ok ? 'ok' : 'fail');
    } catch {
      setTestResult('fail');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="section-header mb-1">Settings</h1>
        <p className="text-sm" style={{ color: 'rgba(245,230,200,0.45)' }}>
          Configure your Claude API key and preferred model. Keys are stored locally in your browser — never sent to third-party servers.
        </p>
      </div>

      {/* API Key */}
      <div className="glass rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Key size={16} style={{ color: '#C9A84C' }} />
          <h2 className="text-sm font-medium" style={{ color: '#F5E6C8' }}>Anthropic API Key</h2>
        </div>

        <div>
          <label className="block text-xs mb-2" style={{ color: 'rgba(245,230,200,0.45)' }}>
            Your personal API key from console.anthropic.com
            {keyInput && !keyValid && <span style={{ color: '#F87171', marginLeft: '8px' }}>· must start with sk-ant-</span>}
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                className="sm-input pr-10 font-mono text-xs"
                style={{ borderColor: keyInput && !keyValid ? 'rgba(239,68,68,0.4)' : undefined }}
                type={showKey ? 'text' : 'password'}
                placeholder="sk-ant-api03-..."
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey
                  ? <EyeOff size={14} style={{ color: 'rgba(245,230,200,0.35)' }} />
                  : <Eye size={14} style={{ color: 'rgba(245,230,200,0.35)' }} />
                }
              </button>
            </div>
            <button
              className="btn-ghost text-xs px-3"
              onClick={testConnection}
              disabled={testing || !keyInput.trim()}
            >
              {testing ? 'Testing...' : 'Test'}
            </button>
          </div>

          {testResult === 'ok' && (
            <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: '#10B981' }}>
              <CheckCircle2 size={12} /> Connection successful
            </div>
          )}
          {testResult === 'fail' && (
            <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: '#F87171' }}>
              <AlertCircle size={12} /> Connection failed — check your API key
            </div>
          )}
        </div>

        <div className="rounded-lg p-3 text-xs" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(245,230,200,0.4)', lineHeight: 1.6 }}>
          <strong style={{ color: 'rgba(245,230,200,0.6)' }}>Security note:</strong> Your API key is stored only in localStorage on this device and sent to the local Express server, which forwards it directly to Anthropic. No third-party services, no remote logging, no storage beyond your device.
        </div>
      </div>

      {/* Model selection */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Cpu size={16} style={{ color: '#C9A84C' }} />
          <h2 className="text-sm font-medium" style={{ color: '#F5E6C8' }}>Default Model</h2>
        </div>
        <div className="space-y-3">
          {MODELS.map(m => (
            <button
              key={m.id}
              onClick={() => onModelChange(m.id)}
              className="w-full text-left rounded-xl p-4 transition-all"
              style={{
                background: model === m.id ? `${m.color}08` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${model === m.id ? `${m.color}30` : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: model === m.id ? m.color : 'rgba(255,255,255,0.15)' }} />
                  <span className="text-sm font-medium" style={{ color: model === m.id ? m.color : '#F5E6C8' }}>
                    {m.name}
                  </span>
                  {m.recommended && (
                    <span className="badge badge-gold text-xs" style={{ fontSize: '9px', padding: '1px 6px' }}>Recommended</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(245,230,200,0.45)', fontSize: '10px' }}>
                    <Zap size={8} className="inline mr-1" />{m.speed}
                  </span>
                </div>
              </div>
              <p className="text-xs ml-4 leading-relaxed" style={{ color: 'rgba(245,230,200,0.45)' }}>
                {m.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button className="btn-gold" onClick={saveSettings}>
          {saved
            ? <><CheckCircle2 size={15} /> Settings Saved</>
            : <><Save size={15} /> Save Settings</>
          }
        </button>
      </div>

      {/* AI Use Policy */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen size={16} style={{ color: '#C9A84C' }} />
          <h2 className="text-sm font-medium" style={{ color: '#F5E6C8' }}>Simon Miller AI Use Policy</h2>
        </div>
        <p className="text-xs mb-4" style={{ color: 'rgba(245,230,200,0.45)', lineHeight: 1.7 }}>
          From the Simon Miller AI Optimization Roadmap. Post this in your team Notion or Slack.
        </p>
        <div className="space-y-2">
          {GUARDRAILS.map((g, i) => (
            <div key={i} className="flex items-start gap-3 text-xs" style={{ color: 'rgba(245,230,200,0.6)', lineHeight: 1.6 }}>
              <span style={{ color: '#F59E0B', flexShrink: 0, marginTop: '1px' }}>{g.icon}</span>
              {g.text}
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', color: 'rgba(245,230,200,0.5)', lineHeight: 1.6 }}>
          <strong style={{ color: 'rgba(245,230,200,0.7)' }}>The three rules for Claude outputs:</strong> Taste, truth, and timing. Does it sound like us? Is it accurate? Is this the right moment to send it? If any answer is no, don't send it.
        </div>
      </div>

      {/* Data Management */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Trash2 size={16} style={{ color: '#C9A84C' }} />
          <h2 className="text-sm font-medium" style={{ color: '#F5E6C8' }}>Data Management</h2>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Prompts Run', value: stats.promptsRun },
            { label: 'Minutes Saved', value: stats.minutesSaved },
            { label: 'Wins Completed', value: stats.winsCompleted },
          ].map(s => (
            <div key={s.label} className="rounded-lg p-3 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: '#C9A84C', lineHeight: 1 }}>{s.value}</div>
              <div className="text-xs mt-1" style={{ color: 'rgba(245,230,200,0.4)' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button className="btn-ghost text-xs" onClick={onStatsReset}>
            <RotateCcw size={12} /> Reset Session Stats
          </button>
          <button className="btn-ghost text-xs" onClick={clearConversations}>
            <Trash2 size={12} /> Clear Conversation History
          </button>
        </div>
      </div>

      {/* About */}
      <div className="rounded-xl p-5 text-xs" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', color: 'rgba(245,230,200,0.3)', lineHeight: 1.7 }}>
        <div className="flex items-center justify-between">
          <div>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: 'rgba(245,230,200,0.5)' }}>
              Simon Miller AI Command Center
            </span>
            <div className="mt-0.5">Built from the Simon Miller AI Optimization Roadmap · Powered by Claude</div>
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'rgba(201,168,76,0.15)' }}>SM</div>
        </div>
      </div>
    </div>
  );
}
