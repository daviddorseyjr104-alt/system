import React from 'react';

interface State { hasError: boolean; error: Error | null }

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0A0A0A', flexDirection: 'column', gap: '16px' }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', color: 'rgba(201,168,76,0.3)' }}>SM</div>
        <div style={{ color: '#F5E6C8', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem' }}>Something went wrong</div>
        <div style={{ color: 'rgba(245,230,200,0.4)', fontSize: '12px', maxWidth: '500px', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', padding: '12px', borderRadius: '8px' }}>
          {this.state.error?.message}
        </div>
        <button
          onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
          style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
        >
          Reload App
        </button>
      </div>
    );
  }
}
