// 'use client'

import Instructions from "./Instructions";

// import { useRouter } from 'next/navigation'
// import { useState } from 'react'
// import { useWebSocket } from '@/components/WebSocket'
// import { v4 as uuid } from 'uuid'

export default function HomePage() {
  // const { ws, connected } = useWebSocket();
  // const [roomId, setRoomId] = useState('');
  // const router = useRouter();

  // if (connected === 'no-connection' || connected === 'in-progress') return;
  // const joinRoom = () => {
  //   if (roomId.trim()) {
  //     router.push(`/room/${roomId.trim()}`);
  //     ws?.send(JSON.stringify({ type: 'join-room', roomId: roomId.trim() }));
  //   }
  // }

  // const createRoom = () => {
  //   // const newRoom = uuid();
  //   // router.push(`/room/${roomId}?creator=true`);
  // }

  return (
    <>
    <main>

      
    </main>
    <Instructions />
    </>
  )
}
