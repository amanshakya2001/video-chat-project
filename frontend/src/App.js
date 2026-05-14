import React, { useContext } from 'react';
import { SocketContext } from './Context';
import VideoPlayer from './components/VideoPlayer';
import Sidebar from './components/Sidebar';
import Notifications from './components/Notifications';
import './styles.css';

/* ── Styles ── */

const wrapStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '100vh',
  paddingBottom: 48,
  gap: 16,
};

const toastStyle = {
  position: 'fixed',
  top: 20,
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(30,30,50,0.9)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,71,87,0.3)',
  borderRadius: '12px',
  padding: '12px 24px',
  color: '#ff6b81',
  fontSize: 14,
  fontWeight: 500,
  fontFamily: 'Inter, sans-serif',
  zIndex: 1000,
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
};

const headerStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '22px 0 4px',
  gap: '10px',
  width: '100%',
};

const logoStyle = {
  fontSize: '26px',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #6c63ff, #1ed7be)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  letterSpacing: '-0.5px',
  fontFamily: 'Inter, sans-serif',
};

const dotStyle = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #6c63ff, #1ed7be)',
};

const statusStyle = {
  position: 'absolute',
  right: 20,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
};

const statusDot = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  transition: 'background 0.4s',
};

const statusLabel = {
  fontSize: 12,
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
  transition: 'color 0.4s',
};

const howStyle = {
  width: '100%',
  maxWidth: '680px',
  padding: '0 20px',
};

const howTitleStyle = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '1.2px',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.25)',
  marginBottom: 12,
  fontFamily: 'Inter, sans-serif',
};

const stepsStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
};

const stepStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 10,
  padding: '10px 14px',
  flex: '1 1 180px',
};

const stepNumStyle = {
  width: 24,
  height: 24,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, rgba(108,99,255,0.4), rgba(30,215,190,0.4))',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 12,
  fontWeight: 700,
  color: '#fff',
  flexShrink: 0,
  fontFamily: 'Inter, sans-serif',
};

const stepLabelStyle = {
  fontSize: 13,
  color: 'rgba(255,255,255,0.45)',
  fontFamily: 'Inter, sans-serif',
  lineHeight: 1.4,
};

/* ── Components ── */

const steps = [
  { n: '1', label: 'Enter your name and copy your ID' },
  { n: '2', label: 'Share your ID with the person you want to call' },
  { n: '3', label: 'They paste your ID and click Call — or you paste theirs' },
];

const HowItWorks = () => (
  <div style={howStyle}>
    <p style={howTitleStyle}>How it works</p>
    <div style={stepsStyle}>
      {steps.map(({ n, label }) => (
        <div key={n} style={stepStyle}>
          <div style={stepNumStyle}>{n}</div>
          <span style={stepLabelStyle}>{label}</span>
        </div>
      ))}
    </div>
  </div>
);

const App = () => {
  const { callAccepted, isCalling, connected, callEndedByPeer } = useContext(SocketContext);

  return (
    <div style={wrapStyle}>
      {callEndedByPeer && (
        <div style={toastStyle}>
          📵&nbsp;&nbsp;Call ended by the other person
        </div>
      )}

      <header style={headerStyle}>
        <div style={dotStyle} />
        <span style={logoStyle}>VidConnect</span>
        <div style={dotStyle} />
        <div style={statusStyle}>
          <span style={{ ...statusDot, background: connected ? '#1ed7be' : '#f9ca24' }} />
          <span style={{ ...statusLabel, color: connected ? '#1ed7be' : '#f9ca24' }}>
            {connected ? 'Connected' : 'Connecting…'}
          </span>
        </div>
      </header>

      <VideoPlayer />

      {!callAccepted && (
        <Sidebar>
          <Notifications />
        </Sidebar>
      )}

      {!callAccepted && !isCalling && <HowItWorks />}
    </div>
  );
};

export default App;
