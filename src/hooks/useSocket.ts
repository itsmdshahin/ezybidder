"use client";

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export default function useSocket() {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const serverUrl = (process.env.NEXT_PUBLIC_SOCKET_SERVER_URL as string) ?? 'http://localhost:4030';
    const socket = io(serverUrl);
    socketRef.current = socket;
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    return () => {
      socket.disconnect();
    };
  }, []);

  return { socket: socketRef.current, connected };
}
