'use client'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

type WebSocketContextType = {
  ws: WebSocket | null;
  connected: string;
};

const WebSocketContext = createContext<WebSocketContextType>({
  ws: null,
  connected: 'no-connection',
});

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [connecting, setConnecting] = useState("no-connection");

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    wsRef.current = ws;
    setConnecting("in-progress");

    ws.onopen = () => {
      console.log('✅ WebSocket connected');
      setConnecting('connected');
    };
    ws.onclose = () => console.log('❌ WebSocket Disconnected');

    return () => ws.close();
  }, []);

  return (
    <WebSocketContext.Provider value={{ ws: wsRef.current, connected: connecting }} >
     {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
