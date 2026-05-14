import React, { useState, useContext } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SocketContext } from '../Context';

/* ── Styles ── */

const cardStyle = {
  width: '100%',
  maxWidth: '680px',
  margin: '0 20px',
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '20px',
  padding: '28px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  fontFamily: 'Inter, sans-serif',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '24px',
};

const sectionTitleStyle = {
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '1.2px',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.4)',
  marginBottom: '14px',
};

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '10px 14px',
  color: '#fff',
  fontSize: '14px',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  transition: 'border-color 0.2s',
  marginBottom: '12px',
};

const idBoxStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  padding: '8px 12px',
  fontSize: '12px',
  color: 'rgba(255,255,255,0.35)',
  marginBottom: '12px',
  wordBreak: 'break-all',
  fontFamily: 'monospace',
  minHeight: '36px',
  cursor: 'default',
};

const btnBase = {
  width: '100%',
  padding: '11px 16px',
  borderRadius: '10px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 600,
  fontFamily: 'Inter, sans-serif',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
};

const copyBtnStyle = {
  ...btnBase,
  background: 'rgba(108,99,255,0.15)',
  border: '1px solid rgba(108,99,255,0.4)',
  color: '#a59eff',
};

const callBtnStyle = {
  ...btnBase,
  background: 'linear-gradient(135deg, #6c63ff, #1ed7be)',
  color: '#fff',
  boxShadow: '0 4px 15px rgba(108,99,255,0.3)',
};

const cancelBtnStyle = {
  ...btnBase,
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: 'rgba(255,255,255,0.6)',
};

const callingStateStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const spinnerWrapStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginBottom: 8,
};

const pulsingDotStyle = {
  display: 'inline-block',
  width: 10,
  height: 10,
  borderRadius: '50%',
  background: '#1ed7be',
  animation: 'pulseDot 1.2s ease-in-out infinite',
};

/* ── Component ── */

const Sidebar = ({ children }) => {
  const {
    me, callAccepted, name, setName, leaveCall, callUser, isCalling,
  } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState('');
  const [copied, setCopied] = useState(false);

  if (callAccepted) return null;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCall = () => {
    if (idToCall.trim()) callUser(idToCall.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleCall();
  };

  return (
    <div style={cardStyle}>
      <div style={gridStyle}>
        <div>
          <p style={sectionTitleStyle}>Your Info</p>
          <input
            style={inputStyle}
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(108,99,255,0.5)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          />
          <div style={idBoxStyle} title="Your connection ID">{me || 'Connecting…'}</div>
          <CopyToClipboard text={me} onCopy={handleCopy}>
            <button type="button" style={copyBtnStyle}>
              <span>{copied ? '✓' : '⧉'}</span>
              {copied ? 'Copied!' : 'Copy My ID'}
            </button>
          </CopyToClipboard>
        </div>

        <div>
          <p style={sectionTitleStyle}>Make a Call</p>
          {isCalling ? (
            <div style={callingStateStyle}>
              <div style={spinnerWrapStyle}>
                <span style={pulsingDotStyle} />
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                  Calling…
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>
                Waiting for the other person to answer
              </p>
              <button type="button" style={cancelBtnStyle} onClick={leaveCall}>
                Cancel
              </button>
            </div>
          ) : (
            <>
              <input
                style={inputStyle}
                placeholder="Paste ID to call"
                value={idToCall}
                onChange={(e) => setIdToCall(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(108,99,255,0.5)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
              <button
                type="button"
                style={{ ...callBtnStyle, opacity: idToCall.trim() ? 1 : 0.45 }}
                onClick={handleCall}
                disabled={!idToCall.trim()}
              >
                <span>📞</span> Call
              </button>
            </>
          )}
        </div>
      </div>

      {children}
    </div>
  );
};

export default Sidebar;
