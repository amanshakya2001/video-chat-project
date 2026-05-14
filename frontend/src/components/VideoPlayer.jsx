import React, { useContext } from 'react';
import { SocketContext } from '../Context';

/* ── Styles ── */

const outerStyle = {
  width: '100%',
  maxWidth: '900px',
  padding: '12px 20px',
};

const pipContainerStyle = {
  position: 'relative',
  width: '100%',
  aspectRatio: '16/9',
  borderRadius: '18px',
  overflow: 'hidden',
  background: '#0d0d1f',
  boxShadow: '0 12px 48px rgba(0,0,0,0.6)',
  border: '1px solid rgba(255,255,255,0.07)',
};

const remoteVideoStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

const remoteBadgeStyle = {
  position: 'absolute',
  bottom: 56,
  left: 14,
  background: 'rgba(0,0,0,0.5)',
  backdropFilter: 'blur(8px)',
  color: '#fff',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: 13,
  fontWeight: 500,
  fontFamily: 'Inter, sans-serif',
};

const selfOverlayStyle = {
  position: 'absolute',
  top: 14,
  right: 14,
  width: '22%',
  aspectRatio: '16/9',
  borderRadius: '10px',
  overflow: 'hidden',
  border: '2px solid rgba(255,255,255,0.15)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
  background: '#111128',
};

const selfVideoStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

const selfBadgeStyle = {
  position: 'absolute',
  bottom: 4,
  left: 6,
  fontSize: 10,
  color: 'rgba(255,255,255,0.7)',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
  background: 'rgba(0,0,0,0.4)',
  padding: '2px 6px',
  borderRadius: '10px',
};

const camOffStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 24,
  background: '#1a1a2e',
};

const controlBarStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 12,
  padding: '10px 0 14px',
  background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
};

const ctrlBtn = {
  width: 44,
  height: 44,
  borderRadius: '50%',
  border: 'none',
  background: 'rgba(255,255,255,0.12)',
  backdropFilter: 'blur(8px)',
  cursor: 'pointer',
  fontSize: 18,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.2s',
};

const ctrlActive = {
  background: 'rgba(255,71,87,0.35)',
  border: '1px solid rgba(255,71,87,0.5)',
};

const hangupBtn = {
  width: 52,
  height: 52,
  background: 'linear-gradient(135deg, #ff4757, #ff6b81)',
  boxShadow: '0 4px 14px rgba(255,71,87,0.4)',
};

const soloStyle = {
  display: 'flex',
  justifyContent: 'center',
};

const videoWrapStyle = {
  position: 'relative',
  width: '100%',
  maxWidth: 480,
  aspectRatio: '16/9',
  borderRadius: '16px',
  overflow: 'hidden',
  background: '#111128',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
};

const videoStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

const nameBadgeStyle = {
  position: 'absolute',
  bottom: 12,
  left: 12,
  background: 'rgba(0,0,0,0.55)',
  backdropFilter: 'blur(8px)',
  color: '#fff',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: 13,
  fontWeight: 500,
  fontFamily: 'Inter, sans-serif',
};

const placeholderStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
};

const avatarStyle = {
  width: 64,
  height: 64,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, rgba(108,99,255,0.25), rgba(30,215,190,0.25))',
  border: '2px solid rgba(255,255,255,0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 28,
};

const errorStyle = {
  width: '100%',
  maxWidth: 420,
  aspectRatio: '16/9',
  borderRadius: '16px',
  background: 'rgba(255,71,87,0.06)',
  border: '1px solid rgba(255,71,87,0.2)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 14,
  padding: 24,
  fontFamily: 'Inter, sans-serif',
};

const errorTextStyle = {
  fontSize: 13,
  color: 'rgba(255,255,255,0.55)',
  textAlign: 'center',
  lineHeight: 1.6,
  maxWidth: 300,
};

const retryBtnStyle = {
  padding: '8px 20px',
  borderRadius: 8,
  border: '1px solid rgba(255,71,87,0.4)',
  background: 'rgba(255,71,87,0.12)',
  color: '#ff6b81',
  fontSize: 13,
  fontWeight: 600,
  fontFamily: 'Inter, sans-serif',
  cursor: 'pointer',
};

/* ── Component ── */

const VideoPlayer = () => {
  const {
    name, callAccepted, myVideo, userVideo, stream, call,
    isMuted, isCameraOff, toggleMute, toggleCamera, leaveCall, cameraError,
  } = useContext(SocketContext);

  return (
    <div style={outerStyle}>
      {callAccepted ? (
        <div style={pipContainerStyle}>
          <video playsInline ref={userVideo} autoPlay style={remoteVideoStyle} />
          <div style={remoteBadgeStyle}>{call.name || 'Caller'}</div>

          <div style={selfOverlayStyle}>
            {isCameraOff
              ? <div style={camOffStyle}>📷</div>
              : <video playsInline muted ref={myVideo} autoPlay style={selfVideoStyle} />}
            <div style={selfBadgeStyle}>{name || 'You'}</div>
          </div>

          <div style={controlBarStyle}>
            <button
              type="button"
              style={{ ...ctrlBtn, ...(isMuted ? ctrlActive : {}) }}
              onClick={toggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? '🔇' : '🎤'}
            </button>
            <button
              type="button"
              style={{ ...ctrlBtn, ...(isCameraOff ? ctrlActive : {}) }}
              onClick={toggleCamera}
              title={isCameraOff ? 'Turn camera on' : 'Turn camera off'}
            >
              {isCameraOff ? '🚫' : '🎥'}
            </button>
            <button
              type="button"
              style={{ ...ctrlBtn, ...hangupBtn }}
              onClick={leaveCall}
              title="Hang up"
            >
              📵
            </button>
          </div>
        </div>
      ) : (
        <div style={soloStyle}>
          {cameraError ? (
            <div style={errorStyle}>
              <span style={{ fontSize: 36 }}>🚫</span>
              <p style={errorTextStyle}>{cameraError}</p>
              <button type="button" style={retryBtnStyle} onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          ) : (
            <div style={videoWrapStyle}>
              {stream
                ? <video playsInline muted ref={myVideo} autoPlay style={videoStyle} />
                : (
                  <div style={placeholderStyle}>
                    <div style={avatarStyle}>🎥</div>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: 'Inter, sans-serif' }}>
                      Waiting for camera…
                    </span>
                  </div>
                )}
              {stream && <div style={nameBadgeStyle}>{name || 'You'}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
