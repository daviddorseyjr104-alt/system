import React, { useState } from 'react';
import { Plus, Trash2, Save, BookOpen, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import type { BrandVoice } from '../types';
import { DEFAULT_BRAND_VOICE } from '../data';

interface Props {
  value: BrandVoice;
  onChange: (v: BrandVoice) => void;
}

const CATEGORIES = ['RTW', 'Bags', 'Shoes', 'Swim', 'Jewelry'];
const CHANNELS = ['PDP', 'Email', 'Instagram', 'TikTok', 'Press', 'Customer Service'];

type Tab = 'identity' | 'voice' | 'banned' | 'category' | 'channel' | 'examples';

export default function BrandVoiceEditor({ value, onChange }: Props) {
  const [tab, setTab] = useState<Tab>('identity');
  const [saved, setSaved] = useState(false);
  const [bannedInput, setBannedInput] = useState('');

  const update = (patch: Partial<BrandVoice>) => onChange({ ...value, ...patch });

  const addVoiceRule = () => {
    update({ voiceRules: [...value.voiceRules, { yes: '', no: '' }] });
  };

  const removeVoiceRule = (i: number) => {
    update({ voiceRules: value.voiceRules.filter((_, idx) => idx !== i) });
  };

  const updateVoiceRule = (i: number, field: 'yes' | 'no', v: string) => {
    update({ voiceRules: value.voiceRules.map((r, idx) => idx === i ? { ...r, [field]: v } : r) });
  };

  const addBannedWord = (word: string) => {
    if (word.trim() && !value.bannedWords.includes(word.trim())) {
      update({ bannedWords: [...value.bannedWords, word.trim()] });
    }
  };

  const removeBannedWord = (word: string) => {
    update({ bannedWords: value.bannedWords.filter(w => w !== word) });
  };

  const saveAndExport = () => {
    localStorage.setItem('sm-brand-voice', JSON.stringify(value));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const exportAsText = () => {
    const text = `SIMON MILLER — BRAND VOICE DOCUMENT

1. WHO WE ARE
${value.whoWeAre}

2. WHO WE MAKE FOR
${value.whoWeServe}

3. VOICE IN ONE PARAGRAPH
${value.voiceParagraph}

4. VOICE RULES
${value.voiceRules.map(r => `✓ "${r.yes}"\n✕ "${r.no}"`).join('\n\n')}

5. BANNED WORDS AND PHRASES
${value.bannedWords.join(', ')}

6. VOICE BY CATEGORY
${Object.entries(value.categoryNuance).map(([k, v]) => `${k}: ${v}`).join('\n\n')}

7. VOICE BY CHANNEL
${Object.entries(value.channelNuance).map(([k, v]) => `${k}: ${v}`).join('\n\n')}
`;
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'simon-miller-brand-voice.txt';
    a.click();
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'identity', label: 'Identity' },
    { key: 'voice', label: 'Voice Rules' },
    { key: 'banned', label: 'Banned Words' },
    { key: 'category', label: 'By Category' },
    { key: 'channel', label: 'By Channel' },
    { key: 'examples', label: 'Examples' },
  ];

  const completedSections = [
    value.whoWeAre.length > 50,
    value.voiceRules.length >= 3,
    value.bannedWords.length >= 5,
    Object.values(value.categoryNuance).some(v => v.length > 20),
    Object.values(value.channelNuance).some(v => v.length > 20),
    value.examples.pdps.length > 0,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-header mb-1">Brand Voice Engine</h1>
          <p className="text-sm" style={{ color: 'rgba(245,230,200,0.45)' }}>
            The single highest-leverage artifact in the entire roadmap. Loaded as context into every customer-facing prompt.
          </p>
        </div>
        <button className="btn-ghost text-xs" onClick={exportAsText}>
          <Download size={13} />
          Export .txt
        </button>
      </div>

      {/* Completeness */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BookOpen size={16} style={{ color: '#C9A84C' }} />
            <span className="text-sm font-medium" style={{ color: '#F5E6C8' }}>Document Completeness</span>
          </div>
          <span style={{ color: '#C9A84C', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem' }}>
            {completedSections}/6 sections
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(completedSections / 6) * 100}%` }} />
        </div>
        {completedSections < 4 && (
          <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: '#F59E0B' }}>
            <AlertCircle size={12} />
            Complete at least 4 sections before using brand voice in AI prompts
          </div>
        )}
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 p-1 rounded-xl overflow-x-auto"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex-shrink-0 px-4 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: tab === t.key ? 'rgba(201,168,76,0.1)' : 'transparent',
              color: tab === t.key ? '#C9A84C' : 'rgba(245,230,200,0.45)',
              border: tab === t.key ? '1px solid rgba(201,168,76,0.2)' : '1px solid transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Identity tab */}
      {tab === 'identity' && (
        <div className="space-y-5">
          <div className="voice-section">
            <label className="block text-xs font-medium mb-2" style={{ color: '#C9A84C' }}>
              1. Who We Are
              <span className="ml-2 font-normal" style={{ color: 'rgba(245,230,200,0.35)' }}>3-4 sentences. Not history — identity.</span>
            </label>
            <textarea
              className="sm-textarea"
              rows={4}
              placeholder="What kind of brand is this? What does it stand for? What would be lost if it disappeared tomorrow?"
              value={value.whoWeAre}
              onChange={e => update({ whoWeAre: e.target.value })}
            />
          </div>
          <div className="voice-section">
            <label className="block text-xs font-medium mb-2" style={{ color: '#C9A84C' }}>
              2. Who We Make For
              <span className="ml-2 font-normal" style={{ color: 'rgba(245,230,200,0.35)' }}>Not demographics — psychographics, wardrobe, rejections.</span>
            </label>
            <textarea
              className="sm-textarea"
              rows={6}
              placeholder="Describe her wardrobe, her references, her rejections. Include what she would never wear from us."
              value={value.whoWeServe}
              onChange={e => update({ whoWeServe: e.target.value })}
            />
          </div>
          <div className="voice-section">
            <label className="block text-xs font-medium mb-2" style={{ color: '#C9A84C' }}>
              3. Voice in One Paragraph
              <span className="ml-2 font-normal" style={{ color: 'rgba(245,230,200,0.35)' }}>Tonal fingerprint — pace, posture, warmth, restraint.</span>
            </label>
            <textarea
              className="sm-textarea"
              rows={3}
              placeholder="The Simon Miller voice is..."
              value={value.voiceParagraph}
              onChange={e => update({ voiceParagraph: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* Voice rules tab */}
      {tab === 'voice' && (
        <div className="space-y-3">
          <div className="text-xs" style={{ color: 'rgba(245,230,200,0.4)' }}>
            Paired yes/no examples. These are the most useful inputs for AI prompts. Aim for 6–10 pairs.
          </div>
          {value.voiceRules.map((rule, i) => (
            <div key={i} className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono" style={{ color: 'rgba(245,230,200,0.3)' }}>Rule {i + 1}</span>
                <button onClick={() => removeVoiceRule(i)}>
                  <Trash2 size={13} style={{ color: 'rgba(245,230,200,0.25)' }} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#10B981' }}>✓ We say</label>
                  <textarea
                    className="sm-textarea"
                    rows={2}
                    style={{ borderColor: 'rgba(16,185,129,0.2)' }}
                    placeholder="The leg cuts wide through the thigh."
                    value={rule.yes}
                    onChange={e => updateVoiceRule(i, 'yes', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#F87171' }}>✕ We do not say</label>
                  <textarea
                    className="sm-textarea"
                    rows={2}
                    style={{ borderColor: 'rgba(239,68,68,0.2)' }}
                    placeholder="An effortlessly relaxed wide-leg silhouette."
                    value={rule.no}
                    onChange={e => updateVoiceRule(i, 'no', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
          <button className="btn-ghost w-full justify-center text-xs" onClick={addVoiceRule}>
            <Plus size={13} />
            Add Voice Rule
          </button>
        </div>
      )}

      {/* Banned words tab */}
      {tab === 'banned' && (
        <div className="space-y-4">
          <div className="text-xs" style={{ color: 'rgba(245,230,200,0.4)' }}>
            The honest list — words that have lost meaning through overuse in fashion.
          </div>
          <div className="flex flex-wrap gap-2">
            {value.bannedWords.map(word => (
              <div key={word} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}>
                <span>✕</span>
                <span>{word}</span>
                <button onClick={() => removeBannedWord(word)} className="ml-1 hover:opacity-70">×</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="sm-input flex-1"
              placeholder="Type a word to ban and press Enter"
              value={bannedInput}
              onChange={e => setBannedInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && bannedInput.trim()) {
                  addBannedWord(bannedInput);
                  setBannedInput('');
                }
              }}
            />
          </div>
          <div className="text-xs" style={{ color: 'rgba(245,230,200,0.3)' }}>
            Suggestions: effortless, elevated, must-have, luxurious, timeless, curated, chic, sophisticated, iconic, statement piece
          </div>
        </div>
      )}

      {/* Category nuance tab */}
      {tab === 'category' && (
        <div className="space-y-4">
          <div className="text-xs" style={{ color: 'rgba(245,230,200,0.4)' }}>
            How the voice shifts (or doesn't) between categories. Include one before/after example per category.
          </div>
          {CATEGORIES.map(cat => (
            <div key={cat} className="voice-section">
              <label className="block text-xs font-medium mb-2" style={{ color: '#C9A84C' }}>{cat}</label>
              <textarea
                className="sm-textarea"
                rows={3}
                placeholder={`How does the voice shift for ${cat}?`}
                value={value.categoryNuance[cat] || ''}
                onChange={e => update({ categoryNuance: { ...value.categoryNuance, [cat]: e.target.value } })}
              />
            </div>
          ))}
        </div>
      )}

      {/* Channel nuance tab */}
      {tab === 'channel' && (
        <div className="space-y-4">
          <div className="text-xs" style={{ color: 'rgba(245,230,200,0.4)' }}>
            How PDP differs from email differs from Instagram differs from TikTok.
          </div>
          {CHANNELS.map(ch => (
            <div key={ch} className="voice-section">
              <label className="block text-xs font-medium mb-2" style={{ color: '#C9A84C' }}>{ch}</label>
              <textarea
                className="sm-textarea"
                rows={3}
                placeholder={`How does voice differ in ${ch}?`}
                value={value.channelNuance[ch] || ''}
                onChange={e => update({ channelNuance: { ...value.channelNuance, [ch]: e.target.value } })}
              />
            </div>
          ))}
        </div>
      )}

      {/* Examples tab */}
      {tab === 'examples' && (
        <div className="space-y-4">
          <div className="text-xs" style={{ color: 'rgba(245,230,200,0.4)' }}>
            The reference set. Five product descriptions, email headers, social captions — annotated with what makes them right.
          </div>
          {[
            { key: 'pdps', label: 'Product Descriptions', placeholder: 'e.g. The seam runs straight through the center front...' },
            { key: 'emails', label: 'Email Subject Lines', placeholder: 'e.g. New swim. No announcements.' },
            { key: 'social', label: 'Social Captions', placeholder: 'e.g. The leg is the point.' },
            { key: 'cs', label: 'Customer Service Replies', placeholder: 'e.g. I can see the delay on your order...' },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="voice-section">
              <label className="block text-xs font-medium mb-2" style={{ color: '#C9A84C' }}>{label}</label>
              {(value.examples[key as keyof typeof value.examples] as string[]).map((ex, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <textarea
                    className="sm-textarea flex-1"
                    rows={2}
                    value={ex}
                    onChange={e => {
                      const arr = [...value.examples[key as keyof typeof value.examples] as string[]];
                      arr[i] = e.target.value;
                      update({ examples: { ...value.examples, [key]: arr } });
                    }}
                  />
                  <button onClick={() => {
                    const arr = (value.examples[key as keyof typeof value.examples] as string[]).filter((_, idx) => idx !== i);
                    update({ examples: { ...value.examples, [key]: arr } });
                  }}>
                    <Trash2 size={13} style={{ color: 'rgba(245,230,200,0.25)' }} />
                  </button>
                </div>
              ))}
              <button className="btn-ghost text-xs w-full justify-center mt-1"
                onClick={() => {
                  const arr = [...value.examples[key as keyof typeof value.examples] as string[], ''];
                  update({ examples: { ...value.examples, [key]: arr } });
                }}>
                <Plus size={12} /> Add {label.split(' ')[0]} Example
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Save button */}
      <div className="flex items-center justify-end gap-3">
        <span style={{ fontSize: '11px', color: 'rgba(245,230,200,0.3)' }}>
          Changes are live in AI Workspace as you type
        </span>
        <button className="btn-gold" onClick={saveAndExport}>
          {saved ? <><CheckCircle2 size={15} /> Confirmed</> : <><Save size={15} /> Save Brand Voice</>}
        </button>
      </div>
    </div>
  );
}
