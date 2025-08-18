import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to chat server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from chat server');
    });

    newSocket.on('new-message', ({ chatId, message }) => {
      setChats(prevChats => 
        prevChats.map(chat => 
          chat._id === chatId 
            ? { ...chat, messages: [...chat.messages, message] }
            : chat
        )
      );

      // Update current chat if it's the active one
      if (currentChat && currentChat._id === chatId) {
        setCurrentChat(prev => ({
          ...prev,
          messages: [...prev.messages, message]
        }));
      }
    });

    newSocket.on('message-sent', ({ chatId, message }) => {
      // Handle message sent confirmation
      console.log('Message sent successfully');
    });

    newSocket.on('user-typing', ({ chatId, isTyping }) => {
      setTypingUsers(prev => ({
        ...prev,
        [chatId]: isTyping
      }));
    });

    newSocket.on('agent-typing', ({ chatId, isTyping }) => {
      setTypingUsers(prev => ({
        ...prev,
        [chatId]: isTyping
      }));
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const joinUserRoom = (userId) => {
    if (socket && userId) {
      socket.emit('join-user', userId);
    }
  };

  const joinAgentRoom = (agentId) => {
    if (socket && agentId) {
      socket.emit('join-agent', agentId);
    }
  };

  const sendMessage = (chatId, message, recipientType, recipientId) => {
    if (socket) {
      socket.emit('send-message', {
        chatId,
        message,
        recipientType,
        recipientId
      });
    }
  };

  const sendTypingIndicator = (chatId, isTyping, recipientType, recipientId) => {
    if (socket) {
      socket.emit('typing', {
        chatId,
        isTyping,
        recipientType,
        recipientId
      });
    }
  };

  const value = {
    socket,
    currentChat,
    setCurrentChat,
    chats,
    setChats,
    isConnected,
    typingUsers,
    joinUserRoom,
    joinAgentRoom,
    sendMessage,
    sendTypingIndicator
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
