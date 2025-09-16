# Bus Ticket Booking App

A full-stack application for booking bus tickets with user and admin interfaces, real-time chat support, and payment processing.

## Features

- Separate User Interfaces for Users and Admins
- Search available bookings without authentication
- JWT Authentication and Password Hashing
- Seats Availability Checking
- Stripe Payment Gateway Integration
- Real-time chat with customer service agents
- Ticket validation and management
- Admin panel for managing buses, users, and bookings

## Tech Stack

- **Frontend**: React, Redux, Tailwind CSS, Ant Design
- **Backend**: Node.js, Express
- **Databases**:
  - MongoDB (users, bookings, buses, tickets, chats)
  - PostgreSQL (daily buses schedule)
- **Real-time Communication**: Socket.IO
- **Payment Processing**: Stripe

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- PostgreSQL (optional, for daily buses feature)
- npm or yarn

### Environment Setup

1. **Server Environment**

   Copy the `.env.example` file in the server directory to `.env` and update the values as needed:

   ```
   # Server Configuration
   PORT=3001
   NODE_ENV=development

   # MongoDB Configuration
   mongo_url=mongodb://localhost:27017/bus-booking

   # PostgreSQL Configuration (For daily buses feature)
   DB_DIALECT=postgres
   DB_NAME=bus_booking_daily
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432

   # JWT Secret
   jwt_secret=your_jwt_secret_key

   # Stripe Configuration
   STRIPE_KEY=your_stripe_secret_key

   # Agent Configuration
   AGENT_PASSWORD=your_agent_password
   ```

2. **Client Environment**

   Copy the `.env.example` file in the client directory to `.env` and update the values as needed:

   ```
   # API Configuration
   REACT_APP_API_URL=http://localhost:3001/api  // if you have different port for Backend, change this to your Backend port.

   ```

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd bus-ticket-booking-app
   ```

2. **Install Server Dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies**

   ```bash
   cd ../client
   npm install
   ```

4. **Create Admin User** (Required to manage buses)

   ```bash
   cd ../server
   node scripts/createAdmin.js
   ```

5. **Create Agent User** (Required for chat feature)

   ```bash
   cd ../server
   node scripts/createAgent.js
   ```

### Starting the Application

**Important**: Start the server first, then the client to avoid port conflicts.

1. **Start the Server**

   ```bash
   cd server
   npm start
   ```

   The server will run on port 3001 by default.

2. **Start the Client**

   ```bash
   cd client
   npm start
   ```

   The client will run on port 3000 by default.

3. **Access the Application**

   Open your browser and go to:

   - User Interface: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin
   - Agent Login: http://localhost:3000/agent/login

## Database Configuration

The application uses both MongoDB and PostgreSQL:

- **MongoDB**: Used for most application data including users, bookings, buses, and chat messages
- **PostgreSQL**: Used specifically for the daily buses feature

If you don't have PostgreSQL installed, the application will still work but without the daily buses functionality.

## Testing

Test scripts are available in the server directory:

```bash
cd server
node test-endpoints.js  # Test API endpoints
node test-chat-system.js  # Test chat functionality
```

## API Documentation

API documentation is available at:
https://documenter.getpostman.com/view/19939427/2s847LMr5Q

## Chat Feature

For detailed information about the chat feature, please refer to [CHAT_FEATURE_README.md](/CHAT_FEATURE_README.md).
