import React, { useState } from 'react';
import {
  Palette, Megaphone, TrendingUp, BarChart2, Settings2, ShoppingBag,
  Store, ArrowRight, ChevronRight, Play, Copy, CheckCheck, Clock,
  AlertTriangle, Workflow, Lightbulb
} from 'lucide-react';
import type { View } from '../types';
import { DEPARTMENTS, ALL_PROMPTS } from '../data';

interface Props {
  deptId: string;
  onNavigate: (v: View) => void;
  onLaunchPrompt: (prompt: string) => void;
}

const DEPT_ICONS: Record<string, React.ReactNode> = {
  design: <Palette size={24} />,
  marketing: <Megaphone size={24} />,
  sales: <TrendingUp size={24} />,
  planning: <BarChart2 size={24} />,
  operations: <Settings2 size={24} />,
  ecommerce: <ShoppingBag size={24} />,
  retail: <Store size={24} />,
};

function VariableTag({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded mx-0.5"
      style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', color: '#C9A84C', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px' }}>
      [{name}]
    </span>
  );
}

function PromptCard({ prompt, color, onLaunch }: { prompt: typeof ALL_PROMPTS[0]; color: string; onLaunch: (p: string) => void }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Highlight variables in prompt text
  const renderPromptWithVars = (text: string) => {
    const parts = text.split(/(\[[A-Z][A-Z\s\/\-]*\])/g);
    return parts.map((part, i) =>
      /^\[[A-Z]/.test(part) ? (
        <span key={i} style={{ background: 'rgba(201,168,76,0.15)', color: '#C9A84C', borderRadius: '2px', padding: '0 3px', fontStyle: 'normal' }}>
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`badge ${prompt.type === 'appendix' ? 'badge-blue' : prompt.type === 'workflow' ? 'badge-gold' : 'badge-purple'}`}>
                {prompt.type}
              </span>
              <span className="text-xs" style={{ color: 'rgba(245,230,200,0.35)' }}>
                <Clock size={10} className="inline mr-1" />saves {prompt.timeSaved}
              </span>
            </div>
            <h4 className="text-sm font-medium" style={{ color: '#F5E6C8' }}>{prompt.title}</h4>
            <p className="text-xs mt-1" style={{ color: 'rgba(245,230,200,0.45)', lineHeight: 1.5 }}>{prompt.description}</p>
          </div>
        </div>

        {prompt.variables.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="text-xs" style={{ color: 'rgba(245,230,200,0.3)' }}>Inputs:</span>
            {prompt.variables.map(v => <VariableTag key={v} name={v} />)}
          </div>
        )}

        <div className="flex gap-2">
          <button
            className="btn-gold text-xs py-1.5 px-3 flex-1"
            onClick={() => onLaunch(prompt.prompt)}
          >
            <Play size={12} />
            Launch in AI Workspace
          </button>
          <button className="btn-ghost text-xs py-1.5 px-3" onClick={copy}>
            {copied ? <CheckCheck size={12} style={{ color: '#10B981' }} /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button className="btn-ghost text-xs py-1.5 px-3" onClick={() => setExpanded(!expanded)}>
            <ChevronRight size={12} style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t px-4 pb-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="mt-3 prompt-block text-xs" style={{ maxHeight: '300px', overflow: 'auto' }}>
            {renderPromptWithVars(prompt.prompt)}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DepartmentHub({ deptId, onNavigate, onLaunchPrompt }: Props) {
  const dept = DEPARTMENTS.find(d => d.id === deptId);
  const prompts = ALL_PROMPTS.filter(p => p.departmentId === deptId);
  const [activeTab, setActiveTab] = useState<'overview' | 'prompts' | 'workflow'>('overview');

  if (!dept) return null;

  const handleLaunchPrompt = (promptText: string) => {
    onLaunchPrompt(promptText);
    onNavigate('ai');
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-7"
        style={{ background: `${dept.bgPattern}, rgba(255,255,255,0.01)`, border: `1px solid ${dept.color}20` }}>
        <div className="flex items-start gap-5">
          <div className="p-3 rounded-xl flex-shrink-0" style={{ background: `${dept.color}15`, border: `1px solid ${dept.color}25` }}>
            <span style={{ color: dept.color }}>{DEPT_ICONS[dept.id]}</span>
          </div>
          <div className="flex-1">
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 500, color: '#F5E6C8', marginBottom: '0.5rem' }}>
              {dept.name}
            </h1>
            <p className="text-sm" style={{ color: 'rgba(245,230,200,0.6)', lineHeight: 1.8, maxWidth: '600px' }}>
              {dept.description}
            </p>
            <div className="flex gap-3 mt-4">
              <span className="badge badge-gold">{dept.useCases.length} use cases</span>
              <span className="badge badge-blue">{prompts.length} ready prompts</span>
              <span className="badge badge-green">{dept.workflows.length} workflow{dept.workflows.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
        {[
          { key: 'overview', label: 'Use Cases', icon: <Lightbulb size={13} /> },
          { key: 'prompts', label: `Prompts (${prompts.length})`, icon: <Play size={13} /> },
          { key: 'workflow', label: 'Sample Workflows', icon: <Workflow size={13} /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm transition-all"
            style={{
              background: activeTab === tab.key ? 'rgba(201,168,76,0.1)' : 'transparent',
              color: activeTab === tab.key ? '#C9A84C' : 'rgba(245,230,200,0.45)',
              border: activeTab === tab.key ? '1px solid rgba(201,168,76,0.2)' : '1px solid transparent',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {dept.useCases.map((useCase, i) => (
              <div key={i} className="rounded-xl p-4 flex gap-3"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-mono"
                  style={{ background: `${dept.color}15`, color: dept.color }}>
                  {(i + 1).toString().padStart(2, '0')}
                </div>
                <div>
                  <div className="text-sm font-medium mb-0.5" style={{ color: '#F5E6C8' }}>
                    {useCase.split(' — ')[0]}
                  </div>
                  <div className="text-xs" style={{ color: 'rgba(245,230,200,0.45)', lineHeight: 1.5 }}>
                    {useCase.split(' — ')[1] || ''}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {dept.guardrails.length > 0 && (
            <div className="rounded-xl p-5" style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.15)' }}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} style={{ color: '#F59E0B' }} />
                <span className="text-sm font-medium" style={{ color: '#F59E0B' }}>What AI Should NOT Do in {dept.shortName}</span>
              </div>
              <ul className="space-y-2">
                {dept.guardrails.map((g, i) => (
                  <li key={i} className="text-xs flex gap-2" style={{ color: 'rgba(245,230,200,0.6)', lineHeight: 1.6 }}>
                    <span style={{ color: '#F59E0B', flexShrink: 0 }}>✕</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Prompts tab */}
      {activeTab === 'prompts' && (
        <div className="space-y-3">
          {prompts.length === 0 ? (
            <div className="text-center py-12 text-sm" style={{ color: 'rgba(245,230,200,0.35)' }}>
              No prompts configured for this department yet.
            </div>
          ) : (
            prompts.map(prompt => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                color={dept.color}
                onLaunch={handleLaunchPrompt}
              />
            ))
          )}
        </div>
      )}

      {/* Workflows tab */}
      {activeTab === 'workflow' && (
        <div className="space-y-4">
          {dept.workflows.map((workflow, i) => (
            <div key={i} className="rounded-xl p-6"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-start justify-between mb-4">
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#F5E6C8' }}>
                  {workflow.title}
                </h3>
                <div className="flex gap-3">
                  <div className="text-right">
                    <div className="text-xs" style={{ color: 'rgba(245,230,200,0.35)' }}>Before AI</div>
                    <div className="text-sm" style={{ color: '#F87171' }}>{workflow.timeBefore}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs" style={{ color: 'rgba(245,230,200,0.35)' }}>With AI</div>
                    <div className="text-sm" style={{ color: '#10B981' }}>{workflow.timeAfter}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {workflow.steps.map((step, j) => (
                  <div key={j} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                      style={{ background: `${dept.color}15`, color: dept.color, border: `1px solid ${dept.color}30`, marginTop: '1px' }}>
                      {j + 1}
                    </div>
                    <div className="text-sm" style={{ color: 'rgba(245,230,200,0.7)', lineHeight: 1.7 }}>
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
