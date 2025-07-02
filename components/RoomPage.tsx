'use client'

import { useEffect, useState } from 'react'
import { useWebSocket } from '@/Context/WebSocket'
import { useParams, useSearchParams } from 'next/navigation'
import CLI from './CLI';
import { useCMD } from '@/Context/CMDLogs';
import useOnlineStatus from '@/hooks/useOnline';

declare global {
  interface Window {
    rdc: RTCDataChannel;
    ldc: RTCDataChannel;
  }
}

export default function RoomPage() {
  const { id: roomId } = useParams();
  const searchParams = useSearchParams();
  const { ws, connected } = useWebSocket();
  const [log, setLog] = useState<string[]>([]);
  const cmd = useCMD();
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (!roomId) return;
    console.log(connected, 'connected', ws);
    if (connected === 'no-connection' || connected === 'in-progress') return;
    // Creator variables
    // let localConnection: RTCPeerConnection;
    // let dataChannel: RTCDataChannel;

    // // Receiver variables
    // let remoteConnection: RTCPeerConnection;

    // const startAsCreator = () => {
    //   localConnection = new RTCPeerConnection({
    //     iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    //   });

    //   dataChannel = localConnection.createDataChannel('chat');
    //   window.ldc = dataChannel;
    //   cmd.dcRef.current = dataChannel;

    //   dataChannel.onopen = () => console.log('📶 Data channel open');
    //   dataChannel.onmessage = (e) => console.log('💬 Received:', e.data);

    //   localConnection.onicecandidate = (e) => {
    //     if (e.candidate && ws) {
    //       ws.send(JSON.stringify({ type: 'ice-candidate', candidate: e.candidate }));
    //     }
    //   };

    //   localConnection.createOffer()
    //     .then(offer => localConnection.setLocalDescription(offer))
    //     .then(() => {
    //       console.log('whataaaaaaaaaaaaaaaaaaaaaaaaaa', ws)
    //       if (ws) {
    //         ws.send(JSON.stringify({ type: 'offer', offer: localConnection.localDescription }));
    //       }
    //     });
    // };

    // const startAsReceiver = async (offer: RTCSessionDescriptionInit) => {
    //   remoteConnection = new RTCPeerConnection({
    //     iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    //   });

    //   remoteConnection.ondatachannel = (event) => {
    //     const channel = event.channel;
    //     channel.onmessage = (e) => console.log('💬 Received:', e.data);
    //     channel.onopen = () => console.log('📶 Data channel open');
    //     window.rdc = channel;
    //     cmd.dcRef.current = channel;
    //   };

    //   remoteConnection.onicecandidate = (e) => {
    //     if (e.candidate && ws) {
    //       ws.send(JSON.stringify({ type: 'ice-candidate', candidate: e.candidate }));
    //     }
    //   };

    //   await remoteConnection.setRemoteDescription(offer);
    //   const answer = await remoteConnection.createAnswer();
    //   await remoteConnection.setLocalDescription(answer);

    //   if (ws) {
    //     ws.send(JSON.stringify({ type: 'answer', answer }));
    //   }
    // };

    // setLog(prev => [...prev, 'WebSocket connected']);
    // if (searchParams.get('creator') === 'true') {
    //   startAsCreator();
    // }

    // if (ws) {
    //   ws.onmessage = async (event) => {
    //     const text = await event.data.text();
    //     const message = JSON.parse(text);
    //     console.log('📨 Received:', message);

    //     switch (message.type) {
    //       case 'offer':
    //         await startAsReceiver(message.offer);
    //         break;
    //       case 'answer':
    //         if (localConnection) {
    //           await localConnection.setRemoteDescription(message.answer);
    //         }
    //         break;
    //       case 'ice-candidate':
    //         const candidate = new RTCIceCandidate(message.candidate);
    //         if (searchParams.get('creator') === 'true') {
    //           localConnection?.addIceCandidate(candidate);
    //         } else {
    //           remoteConnection?.addIceCandidate(candidate);
    //         }
    //         break;
    //       default:
    //         console.log('⚠️ Unknown message type:', message);
    //         break;
    //     }

    //   };

    const isCreator = searchParams.get('creator') === 'true';
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    // const setupMedia = async () => {
    //   try {
    //     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    //     const localVideo = document.getElementById('localVideo') as HTMLVideoElement;
    //     if (localVideo) localVideo.srcObject = stream;

    //     stream.getTracks().forEach(track => {
    //       peerConnection.addTrack(track, stream);
    //     });
    //   } catch (err) {
    //     console.error('Failed to get user media:', err);
    //   }
    // };

    // setupMedia();


    if (isCreator) {
      const dataChannel = peerConnection.createDataChannel('chat');
      window.ldc = dataChannel;
      cmd.dcRef.current = dataChannel;

      dataChannel.onopen = () => console.log('📶 Data channel open');
      dataChannel.onmessage = (e) => {
        console.log('💬 Received:', e.data);
        cmd.setLogs(prev => [...prev, { cmd: `Ping`, msg: e.data }]);
      };
    } else {
      peerConnection.ondatachannel = (event) => {
        const channel = event.channel;
        channel.onmessage = (e) => {
          console.log('💬 Received:', e.data);
          cmd.setLogs(prev => [...prev, { cmd: `Ping`, msg: e.data }]);
        };
        channel.onopen = () => console.log('📶 Data channel open');
        window.rdc = channel;
        cmd.dcRef.current = channel;
      };
    }

    peerConnection.onicecandidate = (e) => {
      if (e.candidate) {
        const candidates = JSON.parse(localStorage.getItem(`${roomId}-candidates`) || '[]');
        candidates.push(e.candidate);
        localStorage.setItem(`${roomId}-candidates`, JSON.stringify(candidates));
        if (ws) {
          ws.send(JSON.stringify({ type: 'ice-candidate', candidate: e.candidate }));
        }
      }
    };

    // peerConnection.ontrack = (event) => {
    //   const remoteStream = new MediaStream();
    //   event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
    //   const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
    //   if (remoteVideo) remoteVideo.srcObject = remoteStream;
    // };


    const createOffer = async () => {
      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        localStorage.setItem(`${roomId}-offer`, JSON.stringify(offer));
        ws?.send(JSON.stringify({ type: 'offer', offer }));
        console.log('offer sent')
      } catch (error) {
        console.log('Error creating offer:', error);
      }
    };

    const answerOffer = async (offer: RTCSessionDescriptionInit) => {
      try {
        await peerConnection.setRemoteDescription(offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        localStorage.setItem(`${roomId}-answer`, JSON.stringify(answer));
        ws?.send(JSON.stringify({ type: 'answer', answer }));
        console.log('answer sent');
      } catch (error) {
        console.log('Error answering offer:', error);
      }
    };

    if (isCreator) createOffer();
    else ws?.send(JSON.stringify({ type: 'request-offer', roomId }));

    if (ws) ws.onmessage = async (event) => {
      try {
        const text = await event.data.text();
        const message = JSON.parse(text);

        switch (message.type) {
          case 'offer':
            if (!isCreator && message.offer) {
              console.log('🎯 Received offer:', message.offer);
              await answerOffer(message.offer);
            }
            break;
          case 'answer':
            if (isCreator) await peerConnection.setRemoteDescription(message.answer);
            break;
          case 'ice-candidate':
            await peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
            break;
          case 'request-offer':
            if (isCreator && message.roomId === roomId) {
              const storedOffer = localStorage.getItem(`${roomId}-offer`);
              const storedCandidates = localStorage.getItem(`${roomId}-candidates`);
              if (storedOffer) {
                ws.send(JSON.stringify({ type: 'offer', offer: JSON.parse(storedOffer) }));
              }
              if (storedCandidates) {
                JSON.parse(storedCandidates).forEach((candidate: RTCIceCandidate) => {
                  ws.send(JSON.stringify({ type: 'ice-candidate', candidate }));
                });
              }
            }
            break;
          default:
            console.log('⚠️ Unknown message type:', message);
            break;
        }
      } catch (error) {
        console.log('wsOnmessage Error', error)
      }
    };

    if (ws) ws.onclose = () => {
      setLog(prev => [...prev, 'Disconnected from signaling server']);
    };
  }, [roomId, connected]);

  if(!isOnline) return <div className="text-center w-full h-screen grid place-items-center text-2xl">You are offline</div>;

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
      {/* <div className="flex gap-4 mt-4">
        <video id="localVideo" autoPlay muted playsInline className="w-1/2 rounded" />
        <video id="remoteVideo" autoPlay playsInline className="w-1/2 rounded" />
      </div> */}

      <CLI />
    </main>
  )
}
