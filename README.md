# Video Chat

A minimal peer-to-peer browser video calling app built with Node.js, Socket.io, and WebRTC — featuring a React / Material-UI client.

## Features

- Peer-to-peer video and audio calls directly between two browser sessions using WebRTC
- Socket.io signalling server that brokers WebRTC offer/answer exchange and call-end notifications
- Each connected client receives a unique socket ID used as their call address
- Call initiation by entering the other user's ID, with incoming call notification and accept/end buttons
- Camera and microphone stream acquisition via `getUserMedia`
- Automatic call-ended notification when the remote peer disconnects
- Responsive layout built with Material-UI

## Tech Stack

**Server**
- Node.js / Express 4
- Socket.io 4
- cors

**Client (`client/`)**
- React (Create React App)
- Material-UI (`@material-ui/core`)
- simple-peer (WebRTC wrapper)
- Socket.io-client

## Getting Started

### Prerequisites

- Node.js 14+
- A modern browser with camera and microphone access

### Installation

```bash
git clone https://github.com/amanshakya2001/video-chat-project.git
cd video-chat-project
npm install
```

Install client dependencies:

```bash
cd client
npm install
```

### Running

Start the signalling server (defaults to port 5000 or `$PORT`):

```bash
npm start
```

In a separate terminal, start the React client:

```bash
cd client
npm start
```

Open [http://localhost:3000](http://localhost:3000) in two browser tabs or on two devices. Copy your socket ID from one window and paste it into the other to initiate a call.

## Project Structure

```
video-chat-project/
  index.js          # Express + Socket.io signalling server
  package.json
  client/
    src/
      App.js          # Root — VideoPlayer, Sidebar, Notifications layout
      Context.js      # SocketContext — socket, peer, stream and call state
      components/
        VideoPlayer/  # Local and remote video feeds with mute/camera controls
        Sidebar/      # Call form (enter ID) and copy-my-ID panel
        Notifications/# Incoming call banner with Accept / End Call buttons
    public/
```

## License

MIT
