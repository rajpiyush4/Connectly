'use client'

import { useEffect, useState } from 'react'
import { useWebSocket } from '@/Context/WebSocket'
import { useParams, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    rdc: RTCDataChannel;
    ldc: RTCDataChannel;
  }
}

export default function RoomPage() {
  const { id: roomId } = useParams();
  const searchParams = useSearchParams();
  const {ws, connected} = useWebSocket();
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    if (!roomId) return;
    console.log('🎥 connected:', connected);
    if(connected === 'no-connection' || connected === 'in-progress') return;
    // Creator variables
    let localConnection: RTCPeerConnection;
    let dataChannel: RTCDataChannel;
  
    // Receiver variables
    let remoteConnection: RTCPeerConnection;
  
    const startAsCreator = () => {
      localConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
  
      dataChannel = localConnection.createDataChannel('chat');
      window.ldc = dataChannel;
      
      dataChannel.onopen = () => console.log('📶 Data channel open');
      dataChannel.onmessage = (e) => console.log('💬 Received:', e.data);
  
      localConnection.onicecandidate = (e) => {
        if (e.candidate && ws) {
          ws.send(JSON.stringify({ type: 'ice-candidate', candidate: e.candidate }));
        }
      };
  
      localConnection.createOffer()
        .then(offer => localConnection.setLocalDescription(offer))
        .then(() => {
          console.log('whataaaaaaaaaaaaaaaaaaaaaaaaaa', ws)
          if (ws) {
            ws.send(JSON.stringify({ type: 'offer', offer: localConnection.localDescription }));
          }
        });
    };
  
    const startAsReceiver = async (offer: RTCSessionDescriptionInit) => {
      remoteConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
  
      remoteConnection.ondatachannel = (event) => {
        const channel = event.channel;
        channel.onmessage = (e) => console.log('💬 Received:', e.data);
        channel.onopen = () => console.log('📶 Data channel open');
        window.rdc = channel;
      };
  
      remoteConnection.onicecandidate = (e) => {
        if (e.candidate && ws) {
          ws.send(JSON.stringify({ type: 'ice-candidate', candidate: e.candidate }));
        }
      };
  
      await remoteConnection.setRemoteDescription(offer);
      const answer = await remoteConnection.createAnswer();
      await remoteConnection.setLocalDescription(answer);
  
      if (ws) {
        ws.send(JSON.stringify({ type: 'answer', answer }));
      }
    };
  
    // ws.onopen = () => {
    // console.log('✅ WebSocket connected');
      setLog(prev => [...prev, 'WebSocket connected']);
      if (searchParams.get('creator') === 'true') {
        startAsCreator();
      }
    // };
  
    if(ws) ws.onmessage = async (event) => {
      const text = await event.data.text();
      const message = JSON.parse(text);
      console.log('📨 Received:', message);
  
      switch (message.type) {
        case 'offer':
          await startAsReceiver(message.offer);
          break;
        case 'answer':
          if (localConnection) {
            await localConnection.setRemoteDescription(message.answer);
          }
          break;
        case 'ice-candidate':
          const candidate = new RTCIceCandidate(message.candidate);
          if (searchParams.get('creator') === 'true') {
            localConnection?.addIceCandidate(candidate);
          } else {
            remoteConnection?.addIceCandidate(candidate);
          }
          break;
        default:
          console.log('⚠️ Unknown message type:', message);
          break;
        }

        ws.onclose = () => {
          console.log('🔌 WebSocket disconnected');
          setLog(prev => [...prev, 'Disconnected from signaling server']);
        };
    };
  }, [roomId, connected]);
  
  return (
    <main className="flex flex-col h-screen bg-zinc-900 text-white p-4">
      <h2 className="text-xl mb-2">Room: {roomId}</h2>

      <section className="flex-1 bg-zinc-800 rounded p-4 overflow-auto">
        <h3 className="mb-2 font-semibold">Logs:</h3>
        <ul className="text-sm space-y-1">
           {log.map((line, i) => (
            <li key={i} className="text-zinc-400">→ {line}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}
