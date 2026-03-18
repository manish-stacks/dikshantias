"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function useSocket(): SocketContextType {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
}

interface SocketProviderProps {
  children: ReactNode;
  userId: string | null | undefined;
}

export function SocketProvider({ children, userId }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }

      setIsConnected(false);
      return;
    }

    const socketInstance = io(
      process.env.NEXT_PUBLIC_SOCKET_API_URL ?? "",
      {
        query: { userId },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 6,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 10000,
        timeout: 20000,
      }
    );

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("🔴 Socket connection error:", error.message);
      setIsConnected(false);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  const value: SocketContextType = {
    socket,
    isConnected,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}