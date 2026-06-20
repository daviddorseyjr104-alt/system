import React, { useState, useEffect, useRef } from 'react';

const SESSION_KEY = 'sm-access-granted';

interface Props {
  children: React.ReactNode;
}

export default function AccessGate({ children }: Props) {
  const [status, setStatus] = useState<'loading' | 'open' | 'locked' | 'granted'>('loading');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(d => {
        if (!d.requiresCode) {
          setStatus('open');
        } else if (sessionStorage.getItem(SESSION_KEY) === 'true') {
          setStatus('granted');
        } else {
          setStatus('locked');
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      })
      .catch(() => setStatus('open'));
  }, []);

  const submit = async () => {
    if (!code.trim() || checking) return;
    setChecking(true);
    setError('');
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (data.ok) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        setStatus('granted');
      } else {
        setError('Incorrect code — try again');
        setCode('');
        inputRef.current?.focus();
      }
    } catch {
      setError('Cannot reach server');
    } finally {
      setChecking(false);
    }
  };

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#C9A84C', opacity: 0.6, animation: 'pulse 1.4s ease-in-out infinite' }} />
      </div>
    );
  }

  if (status === 'open' || status === 'granted') return <>{children}</>;

  return (
    <div style={{
      minHeight: '100vh', background: '#080808',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Ambient glow */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '30%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <div style={{ width: '380px', padding: '48px 40px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #C9A84C, #E8C870)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', fontWeight: 700,
            color: '#0D0D0D', boxShadow: '0 4px 24px rgba(201,168,76,0.25)',
          }}>SM</div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#F5E6C8', letterSpacing: '0.01em', marginBottom: '6px' }}>
            AI Command Center
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(245,230,200,0.35)', letterSpacing: '0.05em' }}>
            SIMON MILLER · INTERNAL ACCESS
          </div>
        </div>

        {/* Code input */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '11px', color: 'rgba(245,230,200,0.45)', marginBottom: '8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Access Code
          </label>
          <input
            ref={inputRef}
            type="password"
            value={code}
            onChange={e => { setCode(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="Enter your access code"
            style={{
              width: '100%', padding: '12px 16px', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${error ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '10px', outline: 'none',
              color: '#F5E6C8', fontSize: '14px', fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.1em', transition: 'border-color 0.15s',
            }}
            onFocus={e => { if (!error) e.target.style.borderColor = 'rgba(201,168,76,0.4)'; }}
            onBlur={e => { if (!error) e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          />
          {error && (
            <div style={{ fontSize: '11px', color: '#F87171', marginTop: '6px' }}>{error}</div>
          )}
        </div>

        <button
          onClick={submit}
          disabled={!code.trim() || checking}
          style={{
            width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
            background: code.trim() && !checking
              ? 'linear-gradient(135deg, #C9A84C, #E8C870)'
              : 'rgba(255,255,255,0.06)',
            color: code.trim() && !checking ? '#0D0D0D' : 'rgba(245,230,200,0.25)',
            fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, sans-serif',
            cursor: code.trim() && !checking ? 'pointer' : 'default',
            transition: 'all 0.2s', letterSpacing: '0.04em',
          }}
        >
          {checking ? 'Verifying…' : 'Enter'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '11px', color: 'rgba(245,230,200,0.2)', lineHeight: 1.6 }}>
          Contact your team lead for access.
        </div>
      </div>
    </div>
  );
}
