# Real-Time Chat Feature for Bus Ticket Booking App

This document describes the implementation of a real-time communication system that allows users to chat with customer service agents about bus schedules, routes, bookings, and other inquiries.

## Features

### For Users
- **Floating Chat Widget**: Accessible from any page with a floating chat button
- **Topic Selection**: Choose from predefined topics (Schedule, Location, Booking, General)
- **Real-time Messaging**: Instant message delivery with Socket.IO
- **Chat History**: View and continue previous conversations
- **Typing Indicators**: See when agents are typing
- **Full Chat Page**: Dedicated page for extended conversations

### For Agents
- **Agent Dashboard**: Manage multiple chat conversations simultaneously
- **Real-time Updates**: Instant notification of new messages
- **Chat Management**: View all active and closed chats
- **Status Management**: Set online/offline status and availability
- **Specialization**: Handle specific topics based on expertise

## Technical Implementation

### Backend (Server)

#### Dependencies Added
- `socket.io`: Real-time bidirectional communication

#### New Models
- **Chat Model** (`server/models/Chat.js`): Stores chat sessions and messages
- **Agent Model** (`server/models/Agent.js`): Manages customer service agents

#### New Routes
- **Chat Routes** (`server/routes/chatRoutes.js`): Handle chat operations
- **Agent Routes** (`server/routes/agentRoutes.js`): Manage agent accounts

#### Socket.IO Integration
- Real-time message delivery
- User and agent room management
- Typing indicators
- Connection status monitoring

### Frontend (Client)

#### Dependencies Added
- `socket.io-client`: Client-side Socket.IO implementation

#### New Components
- **ChatWidget**: Floating chat interface for users
- **AgentDashboard**: Full-screen agent interface
- **ChatPage**: Dedicated chat page for users

#### Context Management
- **ChatContext**: Centralized chat state and Socket.IO management

## Installation & Setup

### 1. Install Dependencies

#### Server
```bash
cd server
npm install socket.io
```

#### Client
```bash
cd client
npm install socket.io-client
```

### 2. Database Setup

The system automatically creates the necessary collections when you first run the application.

### 3. Create Sample Agent

Run the provided script to create a test agent:

```bash
cd server
node scripts/createAgent.js
```

**Default Agent Credentials:**
- Email: `agent@busticket.com`
- Password: `agent123`

### 4. Start the Application

#### Server
```bash
cd server
npm start
```

#### Client
```bash
cd client
npm start
```

## Usage

### For Users

#### Floating Chat Widget
1. Click the chat icon (bottom-right corner) on any page
2. Select a topic for your inquiry
3. Start chatting with an available agent

#### Full Chat Page
1. Navigate to `/chat` in your browser
2. View chat history and start new conversations
3. Manage multiple chat sessions

### For Agents

#### Agent Login
1. Navigate to `/agent/login`
2. Use your agent credentials
3. Access the dashboard

#### Agent Dashboard
1. View all active chats in the sidebar
2. Click on a chat to open the conversation
3. Respond to user messages in real-time
4. Manage your online/offline status

## API Endpoints

### Chat Endpoints
- `GET /api/chat/user/:userId` - Get user's chat history
- `GET /api/chat/agent/:agentId` - Get agent's active chats
- `GET /api/chat/:chatId` - Get specific chat details
- `POST /api/chat` - Create new chat session
- `POST /api/chat/:chatId/messages` - Send message
- `PATCH /api/chat/:chatId/close` - Close chat session
- `PATCH /api/chat/:chatId/read` - Mark messages as read

### Agent Endpoints
- `GET /api/agents` - Get all agents
- `GET /api/agents/available` - Get available agents
- `GET /api/agents/:id` - Get agent details
- `POST /api/agents` - Create new agent
- `POST /api/agents/login` - Agent login
- `POST /api/agents/:id/logout` - Agent logout
- `PATCH /api/agents/:id/status` - Update agent status

## Socket.IO Events

### Client to Server
- `join-user`: User joins their personal room
- `join-agent`: Agent joins their personal room
- `send-message`: Send message to recipient
- `typing`: Send typing indicator

### Server to Client
- `new-message`: Receive new message
- `message-sent`: Confirm message sent
- `user-typing`: User typing indicator
- `agent-typing`: Agent typing indicator

## File Structure

```
├── server/
│   ├── models/
│   │   ├── Chat.js
│   │   └── Agent.js
│   ├── routes/
│   │   ├── chatRoutes.js
│   │   └── agentRoutes.js
│   ├── scripts/
│   │   └── createAgent.js
│   └── server.js (updated)
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── Chat/
│   │   │       ├── ChatWidget.js
│   │   │       └── AgentDashboard.js
│   │   ├── contexts/
│   │   │   └── ChatContext.js
│   │   ├── pages/
│   │   │   ├── ChatPage.js
│   │   │   ├── AgentLoginPage.js
│   │   │   └── AgentDashboardPage.js
│   │   └── App.js (updated)
│   └── package.json (updated)
└── CHAT_FEATURE_README.md
```

## Security Features

- **Authentication**: All chat operations require valid user/agent authentication
- **Authorization**: Users can only access their own chats, agents can only access assigned chats
- **Input Validation**: Message content is validated and sanitized
- **Rate Limiting**: Built-in protection against spam messages

## Performance Considerations

- **Database Indexing**: Optimized queries for chat history and agent availability
- **Real-time Updates**: Efficient Socket.IO room management
- **Message Pagination**: Support for large chat histories
- **Connection Management**: Automatic cleanup of disconnected users

## Troubleshooting

### Common Issues

1. **Socket Connection Failed**
   - Check if server is running on correct port
   - Verify CORS configuration
   - Check browser console for connection errors

2. **Messages Not Delivering**
   - Verify user/agent authentication
   - Check Socket.IO room membership
   - Review server logs for errors

3. **Agent Not Available**
   - Ensure agent is logged in and online
   - Check agent's `isAvailable` status
   - Verify agent hasn't reached maximum chat limit

### Debug Mode

Enable debug logging by setting environment variables:
```bash
DEBUG=socket.io:*
NODE_ENV=development
```

## Future Enhancements

- **File Attachments**: Support for images and documents
- **Chat Transcripts**: Export chat history
- **Automated Responses**: AI-powered quick replies
- **Multi-language Support**: Internationalization
- **Mobile App Integration**: Native mobile chat interface
- **Analytics Dashboard**: Chat performance metrics

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.
