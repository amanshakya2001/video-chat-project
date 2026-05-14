import React, { useContext } from 'react';
import { SocketContext } from '../Context';

/* ── Styles ── */

const wrapStyle = {
  marginTop: '20px',
  borderTop: '1px solid rgba(255,255,255,0.07)',
  paddingTop: '20px',
};

const notifStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '16px',
  background: 'rgba(30,215,190,0.06)',
  border: '1px solid rgba(30,215,190,0.2)',
  borderRadius: '14px',
  padding: '16px 20px',
  fontFamily: 'Inter, sans-serif',
  animation: 'pulse 1.5s infinite',
};

const callerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const avatarStyle = {
  width: 42,
  height: 42,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #6c63ff, #1ed7be)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 18,
  fontWeight: 700,
  color: '#fff',
  flexShrink: 0,
};

const btnGroupStyle = {
  display: 'flex',
  gap: '10px',
};

const declineBtnStyle = {
  padding: '9px 18px',
  background: 'rgba(255,71,87,0.12)',
  border: '1px solid rgba(255,71,87,0.35)',
  borderRadius: '8px',
  color: '#ff6b81',
  fontSize: 13,
  fontWeight: 600,
  fontFamily: 'Inter, sans-serif',
  cursor: 'pointer',
};

const answerBtnStyle = {
  padding: '9px 18px',
  background: 'linear-gradient(135deg, #1ed7be, #6c63ff)',
  border: 'none',
  borderRadius: '8px',
  color: '#fff',
  fontSize: 13,
  fontWeight: 600,
  fontFamily: 'Inter, sans-serif',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(30,215,190,0.3)',
};

/* ── Component ── */

const Notifications = () => {
  const { answerCall, declineCall, call, callAccepted } = useContext(SocketContext);

  if (!call.isReceivingCall || callAccepted) return null;

  return (
    <div style={wrapStyle}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(30,215,190,0.3); }
            50% { box-shadow: 0 0 0 8px rgba(30,215,190,0); }
          }
        `}
      </style>
      <div style={notifStyle}>
        <div style={callerStyle}>
          <div style={avatarStyle}>
            {call.name ? call.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 2, fontFamily: 'Inter, sans-serif' }}>
              {call.name || 'Someone'}
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter, sans-serif' }}>
              Incoming video call…
            </p>
          </div>
        </div>
        <div style={btnGroupStyle}>
          <button type="button" style={declineBtnStyle} onClick={declineCall}>
            Decline
          </button>
          <button type="button" style={answerBtnStyle} onClick={answerCall}>
            Answer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
