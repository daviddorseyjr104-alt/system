import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send, Bot, User, Copy, Trash2, Download, Sparkles, ChevronDown,
  CheckCheck, AlertCircle, X, Plus, Clock, MessageSquare, Play,
  ChevronRight, Zap
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Message } from '../types';
import { ALL_PROMPTS, DEPARTMENTS } from '../data';
import { useToast } from '../context/ToastContext';

interface Conversation {
  id: string;
  title: string;
  department: string;
  messages: Message[];
  createdAt: number;
  model: string;
}

interface Props {
  apiKey: string;
  model: string;
  brandVoice: string;
  onPromptRun: () => void;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
  conversationsClearedAt?: number;
}

const DEPT_COLORS: Record<string, string> = {
  design: '#C9A84C', marketing: '#8B5CF6', sales: '#10B981',
  planning: '#3B82F6', operations: '#F59E0B', ecommerce: '#EC4899', retail: '#06B6D4',
};

const MODELS = [
  { id: 'claude-opus-4-8',          label: 'Opus 4.8',   badge: 'Max',    color: '#8B5CF6' },
  { id: 'claude-sonnet-4-6',        label: 'Sonnet 4.6', badge: 'Fast',   color: '#C9A84C' },
  { id: 'claude-haiku-4-5-20251001',label: 'Haiku 4.5',  badge: 'Quick',  color: '#10B981' },
];

function loadConversations(): Conversation[] {
  try { return JSON.parse(localStorage.getItem('sm-conversations') || '[]'); } catch { return []; }
}
function saveConversations(convos: Conversation[]) {
  localStorage.setItem('sm-conversations', JSON.stringify(convos.slice(0, 20)));
}

function buildSystemPrompt(deptId: string, useBrandVoice: boolean, brandVoice: string) {
  const dept = DEPARTMENTS.find(d => d.id === deptId);
  let sys = `You are an expert AI assistant embedded at Simon Miller, a contemporary 25-person fashion brand with five product categories: ready-to-wear, bags, shoes, swim, and jewelry. You are precise, grounded, and never use generic fashion clichés or filler phrases.

Key operating principles:
- Be specific and concrete — name materials, times, numbers, people
- Do not pad responses with preamble or summaries
- Outputs are drafts — final decisions rest with the human
- Match the department context given`;

  if (dept) {
    sys += `\n\n## Department: ${dept.name}\n${dept.description}`;
    if (dept.guardrails.length) {
      sys += `\n\nGuardrails — do NOT:\n${dept.guardrails.map(g => `- ${g}`).join('\n')}`;
    }
  }
  if (useBrandVoice && brandVoice) {
    sys += `\n\n## Simon Miller Brand Voice\n${brandVoice}`;
  }
  return sys;
}

export default function AIWorkspace({ apiKey, model: defaultModel, brandVoice, onPromptRun, initialPrompt, onClearInitialPrompt, conversationsClearedAt }: Props) {
  const { toast } = useToast();

  // Conversations
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedDept, setSelectedDept] = useState('');
  const [useBrandVoice, setUseBrandVoice] = useState(true);
  const [model, setModel] = useState(defaultModel);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Load initial prompt
  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
      inputRef.current?.focus();
      onClearInitialPrompt?.();
    }
  }, [initialPrompt, onClearInitialPrompt]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
  }, [input]);

  // Sync when conversations are cleared externally (from Settings)
  useEffect(() => {
    if (!conversationsClearedAt) return;
    setConversations([]);
    setActiveConvoId(null);
    setMessages([]);
    setInput('');
  }, [conversationsClearedAt]);

  // Sync model when Settings default changes (only when no active conversation)
  useEffect(() => {
    if (!activeConvoId) setModel(defaultModel);
  }, [defaultModel]);

  const newConversation = () => {
    setMessages([]);
    setActiveConvoId(null);
    setError('');
    setInput('');
    inputRef.current?.focus();
  };

  const loadConversation = (convo: Conversation) => {
    setMessages(convo.messages);
    setActiveConvoId(convo.id);
    setSelectedDept(convo.department);
    setModel(convo.model);
    setShowHistory(false);
  };

  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = conversations.filter(c => c.id !== id);
    setConversations(next);
    saveConversations(next);
    if (activeConvoId === id) newConversation();
    toast('Conversation deleted', 'info');
  };

  const persistMessages = useCallback((msgs: Message[], convoId: string | null, dept: string, mdl: string) => {
    if (msgs.length < 2) return;
    const title = msgs[0]?.content?.slice(0, 60) + (msgs[0]?.content?.length > 60 ? '…' : '') || 'New Conversation';
    setConversations(prev => {
      const existing = prev.find(c => c.id === convoId);
      let next: Conversation[];
      if (existing) {
        next = prev.map(c => c.id === convoId ? { ...c, messages: msgs, title } : c);
      } else {
        const id = Date.now().toString(36);
        setActiveConvoId(id);
        next = [{ id, title, department: dept, messages: msgs, createdAt: Date.now(), model: mdl }, ...prev];
      }
      saveConversations(next);
      return next;
    });
  }, []);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    setError('');
    setInput('');

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    const assistantId = (Date.now() + 1).toString();
    const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '', timestamp: new Date() };

    const nextMessages = [...messages, userMsg, assistantMsg];
    setMessages(nextMessages);
    setIsStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: ctrl.signal,
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          systemPrompt: buildSystemPrompt(selectedDept, useBrandVoice, brandVoice),
          model,
          apiKey,
        }),
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);
      if (!res.body) throw new Error('No response stream');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() ?? '';

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') { streamDone = true; break; }
          try {
            const json = JSON.parse(data);
            if (json.error) throw new Error(json.error);
            if (json.text) {
              fullText += json.text;
              setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: fullText } : m));
            }
          } catch (e: unknown) {
            if ((e as Error).message && !(e as SyntaxError).name?.includes('SyntaxError')) throw e;
          }
        }
      }

      const finalMsgs = nextMessages.map(m => m.id === assistantId ? { ...m, content: fullText } : m);
      setMessages(finalMsgs);
      persistMessages(finalMsgs, activeConvoId, selectedDept, model);
      onPromptRun();

    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') return;
      const msg = (err as Error).message || 'Unknown error';
      setError(msg);
      setMessages(prev => prev.filter(m => m.id !== assistantId));
      toast('AI error: ' + msg, 'error');
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [input, messages, isStreaming, selectedDept, useBrandVoice, model, apiKey, brandVoice, activeConvoId, persistMessages, onPromptRun, toast]);

  const abort = () => { abortRef.current?.abort(); setIsStreaming(false); };

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast('Copied to clipboard', 'success');
  };

  const exportChat = () => {
    const text = messages.map(m => `${m.role === 'user' ? 'You' : 'Claude'}\n${'─'.repeat(40)}\n${m.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `simon-miller-ai-${Date.now()}.txt`;
    a.click();
    toast('Conversation exported', 'success');
  };

  const quickPrompts = ALL_PROMPTS.filter(p => !selectedDept || p.departmentId === selectedDept).slice(0, 4);

  const currentModel = MODELS.find(m => m.id === model) ?? MODELS[0];

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 0, gap: 0, overflow: 'hidden' }}>

      {/* History sidebar */}
      {showHistory && (
        <div style={{ width: '260px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(245,230,200,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>History</span>
            <button onClick={() => setShowHistory(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,230,200,0.3)', display: 'flex' }}><X size={13} /></button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {conversations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: 'rgba(245,230,200,0.25)', fontSize: '12px' }}>No conversations yet</div>
            ) : conversations.map(c => (
              <button
                key={c.id}
                onClick={() => loadConversation(c)}
                style={{
                  width: '100%', textAlign: 'left', padding: '10px 10px', borderRadius: '8px',
                  background: activeConvoId === c.id ? 'rgba(201,168,76,0.08)' : 'transparent',
                  border: `1px solid ${activeConvoId === c.id ? 'rgba(201,168,76,0.2)' : 'transparent'}`,
                  cursor: 'pointer', marginBottom: '2px', transition: 'all 0.1s',
                }}
                onMouseEnter={e => { if (activeConvoId !== c.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={e => { if (activeConvoId !== c.id) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px' }}>
                  <div style={{ fontSize: '12px', color: activeConvoId === c.id ? '#C9A84C' : 'rgba(245,230,200,0.7)', lineHeight: 1.4, flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {c.title}
                  </div>
                  <button onClick={e => deleteConversation(c.id, e)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,230,200,0.2)', padding: '2px', flexShrink: 0, display: 'flex' }}>
                    <Trash2 size={11} />
                  </button>
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(245,230,200,0.3)', marginTop: '4px', display: 'flex', gap: '6px' }}>
                  <span><MessageSquare size={9} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />{c.messages.length} msgs</span>
                  <span>·</span>
                  <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
              </button>
            ))}
          </div>
          <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <button onClick={newConversation} className="btn-gold w-full justify-center text-xs">
              <Plus size={12} /> New Conversation
            </button>
          </div>
        </div>
      )}

      {/* Main chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Toolbar */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.055)', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, background: 'rgba(8,8,8,0.6)', backdropFilter: 'blur(8px)' }}>

          {/* History toggle */}
          <button
            onClick={() => setShowHistory(s => !s)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: showHistory ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${showHistory ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '7px', padding: '5px 10px', cursor: 'pointer', color: showHistory ? '#C9A84C' : 'rgba(245,230,200,0.5)', fontSize: '11px', transition: 'all 0.15s' }}>
            <Clock size={12} /> History {conversations.length > 0 && <span style={{ background: 'rgba(201,168,76,0.2)', borderRadius: '4px', padding: '0 4px', fontSize: '9px' }}>{conversations.length}</span>}
          </button>

          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.07)' }} />

          {/* Department picker */}
          <div style={{ position: 'relative' }}>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              style={{ appearance: 'none', WebkitAppearance: 'none', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '7px', padding: '5px 26px 5px 10px', color: selectedDept ? (DEPT_COLORS[selectedDept] || '#C9A84C') : 'rgba(245,230,200,0.45)', fontSize: '11px', outline: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
            >
              <option value="">No department</option>
              {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.shortName}</option>)}
            </select>
            <ChevronDown size={10} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,230,200,0.3)', pointerEvents: 'none' }} />
          </div>

          {/* Model picker */}
          <div style={{ position: 'relative' }}>
            <select
              value={model}
              onChange={e => setModel(e.target.value)}
              style={{ appearance: 'none', WebkitAppearance: 'none', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '7px', padding: '5px 26px 5px 10px', color: currentModel.color, fontSize: '11px', outline: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
            >
              {MODELS.map(m => <option key={m.id} value={m.id}>{m.label} — {m.badge}</option>)}
            </select>
            <ChevronDown size={10} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,230,200,0.3)', pointerEvents: 'none' }} />
          </div>

          {/* Brand voice toggle */}
          <button
            onClick={() => setUseBrandVoice(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', background: useBrandVoice ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${useBrandVoice ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '7px', padding: '5px 10px', cursor: 'pointer', fontSize: '11px', color: useBrandVoice ? '#C9A84C' : 'rgba(245,230,200,0.35)', transition: 'all 0.15s' }}
          >
            <Sparkles size={11} />
            Brand Voice {useBrandVoice ? 'On' : 'Off'}
          </button>

          <div style={{ flex: 1 }} />

          {/* Actions */}
          {messages.length > 0 && (
            <>
              <button onClick={exportChat} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,230,200,0.35)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', padding: '5px 8px', borderRadius: '6px' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(245,230,200,0.65)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,230,200,0.35)'}>
                <Download size={12} /> Export
              </button>
              <button onClick={newConversation} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,230,200,0.35)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', padding: '5px 8px', borderRadius: '6px' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(245,230,200,0.65)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,230,200,0.35)'}>
                <Plus size={12} /> New
              </button>
            </>
          )}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 8px' }}>
          {messages.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '24px' }}>
              {/* Welcome */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', color: 'rgba(245,230,200,0.6)', lineHeight: 1.2, marginBottom: '8px' }}>
                  What needs doing?
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(245,230,200,0.3)', maxWidth: '360px', lineHeight: 1.6 }}>
                  {selectedDept
                    ? `${DEPARTMENTS.find(d => d.id === selectedDept)?.name} context loaded — ready for work.`
                    : 'Select a department above or start with a prompt below.'}
                </div>
              </div>

              {/* Quick prompts */}
              {quickPrompts.length > 0 && (
                <div style={{ width: '100%', maxWidth: '640px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {quickPrompts.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { setInput(p.prompt); inputRef.current?.focus(); }}
                      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '12px 14px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <Play size={10} style={{ color: DEPT_COLORS[p.departmentId] || '#C9A84C' }} />
                        <span style={{ fontSize: '10px', color: DEPT_COLORS[p.departmentId] || '#C9A84C' }}>{p.department.split(' ')[0]}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(245,230,200,0.7)', lineHeight: 1.4 }}>{p.title}</div>
                      <div style={{ fontSize: '10px', color: 'rgba(245,230,200,0.3)', marginTop: '4px' }}>Saves {p.timeSaved}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {messages.map((msg, i) => {
                const isUser = msg.role === 'user';
                const isLast = i === messages.length - 1;
                const isStreaming_ = isStreaming && isLast && !isUser;

                return (
                  <div key={msg.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexDirection: isUser ? 'row-reverse' : 'row' }}>
                    {/* Avatar */}
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px',
                      background: isUser ? 'rgba(201,168,76,0.12)' : 'rgba(139,92,246,0.12)',
                      border: `1px solid ${isUser ? 'rgba(201,168,76,0.2)' : 'rgba(139,92,246,0.2)'}`,
                    }}>
                      {isUser
                        ? <User size={14} style={{ color: '#C9A84C' }} />
                        : <Bot size={14} style={{ color: '#8B5CF6' }} />
                      }
                    </div>

                    {/* Bubble */}
                    <div style={{ flex: 1, minWidth: 0, maxWidth: '85%' }}>
                      <div style={{
                        borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                        padding: '12px 16px',
                        background: isUser ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isUser ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.06)'}`,
                      }}>
                        {isUser ? (
                          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(245,230,200,0.85)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                        ) : (
                          <div className="ai-response">
                            {msg.content
                              ? <ReactMarkdown>{msg.content}</ReactMarkdown>
                              : isStreaming_ && <span style={{ display: 'inline-block', width: '8px', height: '14px', background: '#8B5CF6', opacity: 0.7, animation: 'blink 1s step-end infinite', borderRadius: '2px' }} />
                            }
                          </div>
                        )}
                      </div>

                      {/* Message actions */}
                      {!isStreaming_ && msg.content && (
                        <div style={{ display: 'flex', gap: '6px', marginTop: '5px', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                          <button
                            onClick={() => copyMessage(msg.id, msg.content)}
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,230,200,0.25)', fontSize: '10px', padding: '3px 6px', borderRadius: '5px', transition: 'color 0.1s' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'rgba(245,230,200,0.6)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,230,200,0.25)'}
                          >
                            {copiedId === msg.id ? <CheckCheck size={11} style={{ color: '#10B981' }} /> : <Copy size={11} />}
                            {copiedId === msg.id ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Error */}
              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '10px 14px' }}>
                  <AlertCircle size={14} style={{ color: '#F87171', flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: '#F87171', flex: 1 }}>{error}</span>
                  <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(239,68,68,0.5)', display: 'flex' }}><X size={12} /></button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div style={{ padding: '12px 24px 20px', flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${isStreaming ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.09)'}`, borderRadius: '14px', padding: '10px 12px', display: 'flex', gap: '10px', alignItems: 'flex-end', transition: 'border-color 0.2s' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
                }}
                placeholder={selectedDept ? `Message ${DEPARTMENTS.find(d => d.id === selectedDept)?.shortName} context…` : 'Ask anything about Simon Miller…'}
                rows={1}
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', resize: 'none', color: 'rgba(245,230,200,0.85)', fontSize: '13px', fontFamily: 'Inter, sans-serif', lineHeight: 1.6, maxHeight: '180px', overflowY: 'auto', scrollbarWidth: 'none' }}
              />
              {isStreaming ? (
                <button onClick={abort} style={{ width: '34px', height: '34px', flexShrink: 0, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#F87171' }}>
                  <X size={14} />
                </button>
              ) : (
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  style={{ width: '34px', height: '34px', flexShrink: 0, background: input.trim() ? 'linear-gradient(135deg, #C9A84C, #E8C870)' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', transition: 'all 0.2s', color: input.trim() ? '#0D0D0D' : 'rgba(245,230,200,0.2)' }}>
                  <Send size={14} />
                </button>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', padding: '0 2px' }}>
              <div style={{ fontSize: '10px', color: 'rgba(245,230,200,0.2)' }}>
                <Zap size={9} style={{ display: 'inline', marginRight: '4px' }} />
                {currentModel.label} · {useBrandVoice ? 'Brand voice on' : 'No brand voice'}
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(245,230,200,0.2)' }}>⏎ send · ⇧⏎ newline</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
