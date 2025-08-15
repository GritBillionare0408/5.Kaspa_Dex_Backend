# Kaspa Backend

A professional-grade backend service for Kaspa blockchain applications with user authentication and MongoDB integration.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **MongoDB Integration**: Robust database operations with proper indexing
- **TypeScript**: Full type safety and modern JavaScript features
- **Express.js**: Fast and flexible web framework
- **Security**: Password hashing with bcrypt and input validation
- **CORS Support**: Cross-origin resource sharing configuration
- **Health Checks**: Monitoring endpoints for service health
- **Graceful Shutdown**: Proper cleanup on server termination

## 📋 Prerequisites

- **Node.js**: v18 or higher
- **MongoDB**: v6.0 or higher
- **npm** or **yarn**: Package manager

## 🛠️ Installation

1. **Clone or copy the project**
```bash
cd Kaspa_Backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB** (if running locally)
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or start your local MongoDB service
mongod
```

## ⚙️ Configuration

Edit the `.env` file with your settings:

```env
MONGO_PATH=kaspa_dex
PORT=5184
MONGODB_URL=mongodb://localhost:27017
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
# or
npm run server
```

### Production Mode
```bash
npm run build
npm start
```

## 📡 API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword",
  "confirmPassword": "securepassword"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Health Checks

#### Server Health
```http
GET /health
```

#### Authentication Service Health
```http
GET /api/auth/health
```

## 📊 Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure authentication tokens
- **Input Validation**: Email and password validation
- **Unique Constraints**: Prevent duplicate users
- **CORS Protection**: Configurable cross-origin policies

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean,
  lastLoginAt: Date
}
```

## 📝 Logging

The application provides structured logging:
- 📡 Request logging with method, path, and timestamp
- ✅ Success operations with user details
- ❌ Error logging with context
- 🗄️ Database operations and health checks

## 🛡️ Error Handling

- **Global Error Handler**: Catches unhandled errors
- **Graceful Shutdown**: Proper cleanup on termination
- **Database Error Handling**: MongoDB connection and operation errors
- **Validation Errors**: Input validation with descriptive messages

## 🔧 Development

### Project Structure
```
src/
├── config/          # Configuration files
├── routes/          # API route handlers
├── services/        # Business logic services
├── types/           # TypeScript type definitions
└── server.ts        # Main application entry
```

### Scripts
- `npm run dev` - Development with auto-reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run server` - Start development server

## 📄 License

MIT License
