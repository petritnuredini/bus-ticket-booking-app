import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import axios from 'axios';
import { MessageCircle, X, Send, User, Phone, MapPin, Clock } from 'react-feather';

/**
 * ChatWidget Component
 * Floating chat interface that allows users to communicate with customer service agents
 * Features topic selection, real-time messaging, and chat history
 */
const ChatWidget = ({ userId, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [agent, setAgent] = useState(null);
  const [topic, setTopic] = useState('general');
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  
  const { 
    socket, 
    isConnected, 
    joinUserRoom, 
    sendMessage, 
    sendTypingIndicator 
  } = useChat();
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (userId && isConnected) {
      // Join user to their personal room for receiving messages
      joinUserRoom(userId);
      loadChatHistory();
      
      // Listen for incoming messages from agents
      socket.on('new-message', (data) => {
        if (data.chatId === currentChatId) {
          setChatHistory(prev => [...prev, data.message]);
        }
      });
      
      // Listen for agent typing indicators
      socket.on('agent-typing', (data) => {
        if (data.chatId === currentChatId) {
          // TODO: Add visual typing indicator
          console.log('Agent is typing...');
        }
      });
    }
    
    // Cleanup event listeners on unmount
    return () => {
      if (socket) {
        socket.off('new-message');
        socket.off('agent-typing');
      }
    };
  }, [userId, isConnected, currentChatId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  /**
   * Load user's existing chat history from the server
   * Finds active chats and sets up the current conversation
   */
  const loadChatHistory = async () => {
    try {
      const response = await axios.get(`/api/chat/user/${userId}`);
      if (response.data.length > 0) {
        const activeChat = response.data.find(chat => chat.status === 'active');
        if (activeChat) {
          setCurrentChatId(activeChat._id);
          setChatHistory(activeChat.messages);
          setAgent(activeChat.agentId);
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  /**
   * Start a new chat session with an available agent
   * Creates chat based on selected topic and assigns appropriate agent
   */
  const startNewChat = async () => {
    if (!topic) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post('/api/chat', {
        userId,
        topic
      });
      
      const newChat = response.data;
      setCurrentChatId(newChat._id);
      setAgent(newChat.agentId);
      setChatHistory([]);
      setShowTopicSelector(false);
      
      // Join the chat room for real-time communication
      if (socket) {
        socket.emit('join-chat', newChat._id);
      }
      
      console.log('Chat started successfully:', newChat);
    } catch (error) {
      console.error('Error starting new chat:', error);
      alert('Unable to start chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Send a message to the current chat
   * Updates local state and sends message via Socket.IO for real-time delivery
   */
  const sendMessageHandler = async () => {
    if (!message.trim() || !currentChatId) return;

    const newMessage = {
      content: message.trim(),
      sender: 'user',
      senderId: userId,
      timestamp: new Date()
    };

    try {
      // Send message via REST API for persistence
      const response = await axios.post(`/api/chat/${currentChatId}/messages`, {
        content: message.trim(),
        sender: 'user',
        senderId: userId
      });

      // Update local chat history immediately
      setChatHistory(prev => [...prev, newMessage]);
      setMessage('');

      // Send typing indicator to show user has stopped typing
      sendTypingIndicator(currentChatId, false, 'agent', agent?._id);
      
      // Emit message via Socket.IO for real-time delivery to agent
      if (socket) {
        socket.emit('send-message', {
          chatId: currentChatId,
          message: newMessage,
          recipientType: 'agent',
          recipientId: agent?._id
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  /**
   * Handle typing input and send typing indicators
   * Shows agent when user is typing for better user experience
   */
  const handleTyping = (e) => {
    setMessage(e.target.value);
    
    // Send typing indicator to agent
    if (currentChatId && agent) {
      sendTypingIndicator(currentChatId, true, 'agent', agent._id);
      
      // Clear previous timeout to prevent multiple indicators
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing indicator after 1 second of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingIndicator(currentChatId, false, 'agent', agent._id);
      }, 1000);
    }
  };

  /**
   * Auto-scroll chat to the bottom to show latest messages
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Handle Enter key press to send messages
   * Allows Shift+Enter for new lines
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessageHandler();
    }
  };

  /**
   * Get appropriate icon for each chat topic
   * @param {string} topic - The chat topic
   * @returns {JSX.Element} Icon component
   */
  const getTopicIcon = (topic) => {
    switch (topic) {
      case 'schedule': return <Clock size={16} />;
      case 'location': return <MapPin size={16} />;
      case 'booking': return <Phone size={16} />;
      default: return <MessageCircle size={16} />;
    }
  };

  /**
   * Get human-readable label for each chat topic
   * @param {string} topic - The chat topic
   * @returns {string} User-friendly topic description
   */
  const getTopicLabel = (topic) => {
    switch (topic) {
      case 'schedule': return 'Schedule & Timing';
      case 'location': return 'Routes & Locations';
      case 'booking': return 'Booking & Tickets';
      default: return 'General Support';
    }
  };

  // Render floating chat button when widget is closed
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110"
          title="Chat with Support"
        >
          <MessageCircle size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <MessageCircle size={20} />
          <span className="font-semibold">Customer Support</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Chat Body */}
      <div className="flex-1 flex flex-col">
        {!currentChatId ? (
          // Topic Selection Interface
          <div className="flex-1 p-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                How can we help you today?
              </h3>
              <p className="text-gray-600 text-sm">
                Choose a topic to start chatting with our support team
              </p>
            </div>
            
            <div className="space-y-3">
              {['schedule', 'location', 'booking', 'general'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                    topic === t
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {getTopicIcon(t)}
                    <span className="font-medium">{getTopicLabel(t)}</span>
                  </div>
                </button>
              ))}
            </div>
            
            <button
              onClick={startNewChat}
              disabled={isLoading}
              className="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Starting chat...' : 'Start Chat'}
            </button>
          </div>
        ) : (
          // Active Chat Interface
          <>
            {/* Agent Information Display */}
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {agent?.name || 'Support Agent'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {agent?.status === 'online' ? '🟢 Online' : '🔴 Offline'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Display */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                  <p>Start the conversation!</p>
                </div>
              ) : (
                chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={handleTyping}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={sendMessageHandler}
                  disabled={!message.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatWidget;
