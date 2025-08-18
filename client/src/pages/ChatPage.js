import React, { useState, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import axios from 'axios';
import { MessageCircle, Send, User, Phone, MapPin, Clock, ArrowLeft } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ChatPage = () => {
  const { user } = useSelector((state) => state.users);
  const userId = user?._id;
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  const [topic, setTopic] = useState('general');
  
  const { 
    socket, 
    isConnected, 
    joinUserRoom, 
    sendMessage, 
    sendTypingIndicator 
  } = useChat();
  
  const navigate = useNavigate();

  useEffect(() => {
    if (userId && isConnected) {
      joinUserRoom(userId);
      loadChatHistory();
    }
  }, [userId, isConnected]);

  // Show loading if user is not yet loaded
  if (!user || !userId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user information...</p>
        </div>
      </div>
    );
  }

  const loadChatHistory = async () => {
    try {
      const response = await axios.get(`/api/chat/user/${userId}`);
      setChats(response.data);
      
      // Set first active chat as current if no current chat
      if (!currentChat && response.data.length > 0) {
        const activeChat = response.data.find(chat => chat.status === 'active');
        if (activeChat) {
          setCurrentChat(activeChat);
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const startNewChat = async () => {
    if (!topic) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post('/api/chat', {
        userId,
        topic
      });
      
      const newChat = response.data;
      setCurrentChat(newChat);
      setChats(prev => [newChat, ...prev]);
      setShowTopicSelector(false);
      
      // Join the chat room
      if (socket) {
        socket.emit('join-chat', newChat._id);
      }
    } catch (error) {
      console.error('Error starting new chat:', error);
      alert('Unable to start chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessageHandler = async () => {
    if (!message.trim() || !currentChat) return;

    const newMessage = {
      content: message.trim(),
      sender: 'user',
      senderId: userId,
      timestamp: new Date()
    };

    try {
      // Send message via API
      await axios.post(`/api/chat/${currentChat._id}/messages`, {
        content: message.trim(),
        sender: 'user',
        senderId: userId
      });

      // Update local state
      setCurrentChat(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage]
      }));

      // Update chats list
      setChats(prevChats => 
        prevChats.map(chat => 
          chat._id === currentChat._id 
            ? { ...chat, messages: [...chat.messages, newMessage] }
            : chat
        )
      );

      setMessage('');

      // Send typing indicator
      sendTypingIndicator(currentChat._id, false, 'agent', currentChat.agentId?._id || currentChat.agentId);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    
    // Send typing indicator
    if (currentChat) {
      sendTypingIndicator(currentChat._id, true, 'agent', currentChat.agentId?._id || currentChat.agentId);
      
      // Clear typing indicator after delay
      setTimeout(() => {
        sendTypingIndicator(currentChat._id, false, 'agent', currentChat.agentId?._id || currentChat.agentId);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessageHandler();
    }
  };

  const getTopicIcon = (topic) => {
    switch (topic) {
      case 'schedule': return <Clock size={16} />;
      case 'location': return <MapPin size={16} />;
      case 'booking': return <Phone size={16} />;
      default: return <MessageCircle size={16} />;
    }
  };

  const getTopicLabel = (topic) => {
    switch (topic) {
      case 'schedule': return 'Schedule & Timing';
      case 'location': return 'Routes & Locations';
      case 'booking': return 'Booking & Tickets';
      default: return 'General Support';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Customer Support</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Chat History</h2>
                  <button
                    onClick={() => setShowTopicSelector(true)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    New Chat
                  </button>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {chats.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No chats yet</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {chats.map((chat) => (
                      <button
                        key={chat._id}
                        onClick={() => setCurrentChat(chat)}
                        className={`w-full p-3 text-left border-l-4 transition-colors ${
                          currentChat?._id === chat._id
                            ? 'bg-blue-50 border-blue-500'
                            : 'border-transparent hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          {getTopicIcon(chat.topic)}
                          <span className="font-medium text-gray-800">
                            {chat.agentId?.name || 'Support Agent'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">
                            {chat.messages[chat.messages.length - 1]?.content || 'No messages yet'}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            chat.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {chat.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(chat.lastMessage)}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[600px] flex flex-col">
              {!currentChat ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                    <p className="text-sm">Select a chat from the sidebar or start a new one</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <User size={20} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {currentChat.agentId?.name || 'Support Agent'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {getTopicIcon(currentChat.topic)} {getTopicLabel(currentChat.topic)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          currentChat.agentId?.status === 'online' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {currentChat.agentId?.status === 'online' ? '🟢 Online' : '🔴 Offline'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {currentChat.messages.map((msg, index) => (
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
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
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
        </div>
      </div>

      {/* Topic Selector Modal */}
      {showTopicSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              How can we help you today?
            </h3>
            
            <div className="space-y-3 mb-6">
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
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowTopicSelector(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={startNewChat}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Starting chat...' : 'Start Chat'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
