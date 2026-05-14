import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

const socket = io(process.env.REACT_APP_SOCKET_URL);

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [stream, setStream] = useState(null);
  const [name, setNameState] = useState(() => localStorage.getItem('vidconnect_name') || '');
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');
  const [peerId, setPeerId] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [connected, setConnected] = useState(false);
  const [callEndedByPeer, setCallEndedByPeer] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) myVideo.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.error('Media access error:', err);
        setCameraError(
          err.name === 'NotAllowedError'
            ? 'Camera/mic access was denied. Click the camera icon in your browser address bar to allow access, then refresh.'
            : 'Could not access camera or microphone. Check that they are connected and not in use by another app.',
        );
      });

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('me', (id) => { setMe(id); setConnected(true); });

    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      setIsCalling(false);
      if (connectionRef.current) connectionRef.current.signal(signal);
    });

    socket.on('callEnded', () => {
      if (connectionRef.current) {
        connectionRef.current.destroy();
        connectionRef.current = null;
      }
      setCallAccepted(false);
      setIsCalling(false);
      setCall({});
      setPeerId('');
      setIsMuted(false);
      setIsCameraOff(false);
      setCallEndedByPeer(true);
      setTimeout(() => setCallEndedByPeer(false), 3000);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('me');
      socket.off('callUser');
      socket.off('callAccepted');
      socket.off('callEnded');
    };
  }, []);

  // Re-sync self video ref after layout switches (PiP ↔ solo)
  useEffect(() => {
    if (myVideo.current && stream) myVideo.current.srcObject = stream;
  });

  const resetCall = (byPeer = false) => {
    if (connectionRef.current) {
      connectionRef.current.destroy();
      connectionRef.current = null;
    }
    setCallAccepted(false);
    setIsCalling(false);
    setCall({});
    setPeerId('');
    setIsMuted(false);
    setIsCameraOff(false);
    if (stream) stream.getAudioTracks().forEach((t) => { t.enabled = true; });
    if (stream) stream.getVideoTracks().forEach((t) => { t.enabled = true; });
    if (byPeer) {
      setCallEndedByPeer(true);
      setTimeout(() => setCallEndedByPeer(false), 3000);
    }
  };

  const toggleMute = () => {
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; });
    setIsMuted((prev) => !prev);
  };

  const toggleCamera = () => {
    if (!stream) return;
    stream.getVideoTracks().forEach((t) => { t.enabled = !t.enabled; });
    setIsCameraOff((prev) => !prev);
  };

  const answerCall = () => {
    setCallAccepted(true);
    setPeerId(call.from);
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on('signal', (data) => socket.emit('answerCall', { signal: data, to: call.from }));
    peer.on('stream', (currentStream) => {
      if (userVideo.current) userVideo.current.srcObject = currentStream;
    });
    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const declineCall = () => setCall({});

  const callUser = (id) => {
    setIsCalling(true);
    setPeerId(id);
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });
    peer.on('stream', (currentStream) => {
      if (userVideo.current) userVideo.current.srcObject = currentStream;
    });
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    socket.emit('leaveCall');
    resetCall();
  };

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      isCalling,
      myVideo,
      userVideo,
      stream,
      name,
      setName: (val) => { setNameState(val); localStorage.setItem('vidconnect_name', val); },
      me,
      peerId,
      callUser,
      leaveCall,
      answerCall,
      declineCall,
      isMuted,
      isCameraOff,
      toggleMute,
      toggleCamera,
      cameraError,
      connected,
      callEndedByPeer,
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
