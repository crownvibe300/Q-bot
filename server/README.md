# Q-bot Backend API

A secure Node.js/Express backend for the Q-bot application with authentication, user management, and Google OAuth integration.

## Features

- ✅ **User Registration & Login** with email/password
- ✅ **JWT Authentication** with secure token management
- ✅ **Google OAuth 2.0** integration (configurable)
- ✅ **Password Hashing** with bcrypt
- ✅ **Input Validation** with express-validator
- ✅ **Security Middleware** (helmet, rate limiting, CORS)
- ✅ **MongoDB Integration** with Mongoose
- ✅ **Error Handling** with proper HTTP status codes

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

Required environment variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLIENT_URL` - Frontend URL for CORS

Optional (for Google OAuth):
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

### 3. Start Development Server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/register`
Register a new user
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### POST `/api/auth/login`
Login with email/password
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

#### GET `/api/auth/me`
Get current user (requires authentication)
```
Authorization: Bearer <jwt_token>
```

#### POST `/api/auth/logout`
Logout user (client-side token removal)

#### GET `/api/auth/google`
Initiate Google OAuth login

#### GET `/api/auth/google/callback`
Google OAuth callback

### User Routes (`/api/users`)

#### GET `/api/users/profile`
Get user profile (requires authentication)

#### PUT `/api/users/profile`
Update user profile (requires authentication)

### Health Check

#### GET `/api/health`
Server health status

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in requests:

```
Authorization: Bearer <your_jwt_token>
```

## Database Schema

### User Model
```javascript
{
  email: String (required, unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  googleId: String (for OAuth users),
  avatar: String,
  isEmailVerified: Boolean,
  lastLogin: Date,
  isActive: Boolean,
  role: String (user/admin),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configured for frontend domain
- **Helmet**: Security headers
- **Input Validation**: Email format, password strength
- **JWT Expiration**: 7-day token expiry

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Update `.env` with client ID and secret

## Development

### Scripts
- `npm run dev` - Start with nodemon (auto-restart)
- `npm start` - Start production server
- `node test-api.js` - Test API health endpoint

### Project Structure
```
server/
├── config/
│   └── passport.js       # Passport strategies
├── middleware/
│   └── auth.js          # JWT authentication
├── models/
│   └── User.js          # User schema
├── routes/
│   ├── auth.js          # Authentication routes
│   └── users.js         # User management routes
├── .env                 # Environment variables
├── .env.example         # Environment template
├── index.js             # Main server file
└── package.json         # Dependencies
```

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

## Next Steps

- [ ] Email verification system
- [ ] Password reset functionality
- [ ] File upload endpoints
- [ ] Chat message storage
- [ ] Admin panel routes
- [ ] API documentation with Swagger
