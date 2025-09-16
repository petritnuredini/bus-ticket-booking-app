import React, { useState, useEffect, useRef } from "react";
import { useChat } from "../../contexts/ChatContext";
import { axiosInstance } from "../../helpers/axiosInstance";
import { MessageCircle, Send, User, Phone, MapPin, Clock } from "react-feather";

/**
 * AgentDashboard Component
 * Full-screen interface for customer service agents to manage multiple chat conversations
 */
const AgentDashboard = ({ agentId, agent }) => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(agent?.status || "offline");
  const [isAvailable, setIsAvailable] = useState(agent?.isAvailable || false);

  const {
    socket,
    isConnected,
    joinAgentRoom,
    sendMessage,
    sendTypingIndicator,
  } = useChat();

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (agentId && isConnected) {
      joinAgentRoom(agentId);
      loadChats();

      // Listen for new messages from users
      socket.on("new-message", (data) => {
        // Update the specific chat with the new message
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === data.chatId
              ? { ...chat, messages: [...chat.messages, data.message] }
              : chat
          )
        );

        // If this is the current chat, update it too
        if (currentChat?._id === data.chatId) {
          setCurrentChat((prev) => ({
            ...prev,
            messages: [...prev.messages, data.message],
          }));
        }
      });

      // Listen for user typing indicators
      socket.on("user-typing", (data) => {
        if (data.chatId === currentChat?._id) {
          // TODO: Add visual typing indicator
          console.log("User is typing...");
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("new-message");
        socket.off("user-typing");
      }
    };
  }, [agentId, isConnected, currentChat?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  // axiosInstance already handles authentication headers automatically

  // Load all chats assigned to this agent
  const loadChats = async () => {
    try {
      const response = await axiosInstance.get(`/chat/agent/${agentId}`);
      setChats(response.data);

      // Set first active chat as current if no current chat
      if (!currentChat && response.data.length > 0) {
        const activeChat = response.data.find(
          (chat) => chat.status === "active"
        );
        if (activeChat) {
          setCurrentChat(activeChat);
        }
      }
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  };

  // Select a chat to view and respond to
  const selectChat = (chat) => {
    setCurrentChat(chat);
    // Mark messages as read when chat is selected
    if (chat.messages.some((msg) => !msg.isRead && msg.sender === "user")) {
      markMessagesAsRead(chat._id);
    }
  };

  // Mark user messages as read
  const markMessagesAsRead = async (chatId) => {
    try {
      await axiosInstance.patch(`/chat/${chatId}/read`, {
        userId: currentChat?.userId,
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  // Send message to user
  const sendMessageHandler = async () => {
    if (!message.trim() || !currentChat) return;

    const newMessage = {
      content: message.trim(),
      sender: "agent",
      senderId: agentId,
      timestamp: new Date(),
    };

    try {
      // Send message via API
      const response = await axiosInstance.post(
        `/chat/${currentChat._id}/messages`,
        {
          content: message.trim(),
          sender: "agent",
          senderId: agentId,
        }
      );

      // Update local state
      setCurrentChat((prev) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
      }));

      // Update chats list
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === currentChat._id
            ? { ...chat, messages: [...chat.messages, newMessage] }
            : chat
        )
      );

      setMessage("");

      // Send typing indicator
      sendTypingIndicator(currentChat._id, false, "user", currentChat.userId);

      // Emit message via Socket.IO for real-time delivery
      if (socket) {
        socket.emit("send-message", {
          chatId: currentChat._id,
          message: newMessage,
          recipientType: "user",
          recipientId: currentChat.userId,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle typing input and send typing indicators
  const handleTyping = (e) => {
    setMessage(e.target.value);

    // Send typing indicator
    if (currentChat) {
      sendTypingIndicator(currentChat._id, true, "user", currentChat.userId);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingIndicator(currentChat._id, false, "user", currentChat.userId);
      }, 1000);
    }
  };

  // Close a chat session
  const closeChat = async (chatId) => {
    try {
      await axiosInstance.patch(`/chat/${chatId}/close`, {});

      // Update local state
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === chatId ? { ...chat, status: "closed" } : chat
        )
      );

      if (currentChat?._id === chatId) {
        setCurrentChat(null);
      }
    } catch (error) {
      console.error("Error closing chat:", error);
    }
  };

  // Update agent availability status
  const updateStatus = async (newStatus, newAvailability) => {
    try {
      const response = await axiosInstance.patch(`/agents/${agentId}/status`, {
        status: newStatus,
        isAvailable: newAvailability,
      });

      setStatus(newStatus);
      setIsAvailable(newAvailability);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle Enter key press to send messages
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessageHandler();
    }
  };

  // Get icon for chat topic
  const getTopicIcon = (topic) => {
    switch (topic) {
      case "schedule":
        return <Clock size={16} />;
      case "location":
        return <MapPin size={16} />;
      case "booking":
        return <Phone size={16} />;
      default:
        return <MessageCircle size={16} />;
    }
  };

  // Count unread messages from users
  const getUnreadCount = (chat) => {
    return chat.messages.filter((msg) => !msg.isRead && msg.sender === "user")
      .length;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with chat list */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header with agent status */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">
              Agent Dashboard
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  updateStatus(
                    status === "online" ? "offline" : "online",
                    !isAvailable
                  )
                }
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  status === "online" && isAvailable
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {status === "online" && isAvailable
                  ? "🟢 Online"
                  : "🔴 Offline"}
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {agent?.name} • {agent?.specialization?.join(", ")}
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto">
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
                  onClick={() => selectChat(chat)}
                  className={`w-full p-3 text-left border-l-4 transition-colors ${
                    currentChat?._id === chat._id
                      ? "bg-blue-50 border-blue-500"
                      : "border-transparent hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      {getTopicIcon(chat.topic)}
                      <span className="font-medium text-gray-800">
                        {chat.userId || "Unknown User"}
                      </span>
                    </div>
                    {getUnreadCount(chat) > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {getUnreadCount(chat)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">
                      {chat.messages[chat.messages.length - 1]?.content ||
                        "No messages yet"}
                    </p>
                    <span className="text-xs text-gray-400">
                      {chat.status === "active" ? "🟢" : "🔴"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            {/* Chat header with user info */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {currentChat.userId || "Unknown User"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {currentChat.userId} • {getTopicIcon(currentChat.topic)}{" "}
                      {currentChat.topic}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => closeChat(currentChat._id)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Close Chat
                  </button>
                </div>
              </div>
            </div>

            {/* Messages display */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {currentChat.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "agent" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === "agent"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === "agent"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="bg-white border-t border-gray-200 p-4">
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
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                Select a chat to start
              </h3>
              <p className="text-sm">
                Choose a conversation from the sidebar to begin chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;
