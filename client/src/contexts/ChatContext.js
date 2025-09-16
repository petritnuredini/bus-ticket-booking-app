import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

// Create context for managing chat state and Socket.IO connections
const ChatContext = createContext();

/**
 * ChatProvider Component
 * Manages real-time chat functionality using Socket.IO
 * Provides chat context to all child components
 */
export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize Socket.IO connection to the backend server
    // Extract the base URL without '/api' suffix
    const socketURL = process.env.REACT_APP_API_URL
      ? process.env.REACT_APP_API_URL.replace("/api", "")
      : "http://localhost:3001";
    const newSocket = io(socketURL, {
      transports: ["websocket", "polling"],
    });

    // Handle successful connection
    newSocket.on("connect", () => {
      console.log("Connected to chat server");
      setIsConnected(true);
    });

    // Handle connection errors
    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setIsConnected(false);
    });

    // Handle disconnection
    newSocket.on("disconnect", () => {
      console.log("Disconnected from chat server");
      setIsConnected(false);
    });

    setSocket(newSocket);

    // Cleanup function to close socket connection
    return () => {
      newSocket.close();
    };
  }, []);

  /**
   * Join user to their personal room for receiving messages
   * @param {string} userId - The user's unique identifier
   */
  const joinUserRoom = (userId) => {
    if (socket && isConnected) {
      socket.emit("join-user", userId);
    }
  };

  /**
   * Join agent to their personal room for receiving messages
   * @param {string} agentId - The agent's unique identifier
   */
  const joinAgentRoom = (agentId) => {
    if (socket && isConnected) {
      socket.emit("join-agent", agentId);
    }
  };

  /**
   * Send a message to a specific recipient
   * @param {string} chatId - The chat session identifier
   * @param {Object} message - The message object to send
   * @param {string} recipientType - Type of recipient ('user' or 'agent')
   * @param {string} recipientId - The recipient's unique identifier
   */
  const sendMessage = (chatId, message, recipientType, recipientId) => {
    if (socket && isConnected) {
      socket.emit("send-message", {
        chatId,
        message,
        recipientType,
        recipientId,
      });
    }
  };

  /**
   * Send typing indicator to show when user/agent is typing
   * @param {string} chatId - The chat session identifier
   * @param {boolean} isTyping - Whether the user is currently typing
   * @param {string} recipientType - Type of recipient ('user' or 'agent')
   * @param {string} recipientId - The recipient's unique identifier
   */
  const sendTypingIndicator = (
    chatId,
    isTyping,
    recipientType,
    recipientId
  ) => {
    if (socket && isConnected) {
      socket.emit("typing", {
        chatId,
        isTyping,
        recipientType,
        recipientId,
      });
    }
  };

  // Context value containing all chat-related functions and state
  const value = {
    socket,
    isConnected,
    joinUserRoom,
    joinAgentRoom,
    sendMessage,
    sendTypingIndicator,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

/**
 * Custom hook to use chat context
 * Provides access to chat functionality throughout the application
 * @returns {Object} Chat context with socket, connection status, and functions
 */
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
