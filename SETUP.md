# Evaid Setup Guide

This guide will help you set up the Evaid travel safety application on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd evaid-travel-safety
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   - Copy `server/env.example` to `server/.env`
   - Copy `client/env.example` to `client/.env`
   - Fill in your API keys and configuration

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Detailed Setup

### 1. Environment Configuration

#### Server Environment (`server/.env`)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/evaid

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Google Maps API
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Twilio (for SMS)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Email Service (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Firebase Admin (for server-side operations)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email

# CORS
CORS_ORIGIN=http://localhost:3000
```

#### Client Environment (`client/.env`)
```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id

# Google Maps API
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Backend API URL
REACT_APP_API_URL=http://localhost:5000/api

# Socket.IO URL
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 2. API Keys Setup

#### Google Maps API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Directions API
   - Geocoding API
4. Create credentials (API Key)
5. Add the API key to both server and client environment files

#### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication with Google provider
4. Get your Firebase configuration
5. Add the configuration to the client environment file

#### Twilio Setup (for SMS)
1. Sign up at [Twilio](https://www.twilio.com/)
2. Get your Account SID and Auth Token
3. Purchase a phone number
4. Add the credentials to the server environment file

#### Email Service Setup
1. For Gmail, enable 2-factor authentication
2. Generate an App Password
3. Add the credentials to the server environment file

### 3. Database Setup

#### MongoDB
1. Install MongoDB locally or use MongoDB Atlas
2. Start MongoDB service
3. Create a database named `evaid`
4. Update the `MONGODB_URI` in your server environment file

### 4. Running the Application

#### Development Mode
```bash
# Start both frontend and backend
npm run dev

# Or start them separately
npm run server  # Backend only
npm run client  # Frontend only
```

#### Production Mode
```bash
# Build the frontend
npm run build

# Start the backend
cd server
npm start
```

## Project Structure

```
evaid-travel-safety/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── store/         # State management
│   │   ├── config/        # Configuration files
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                 # Express backend
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   └── index.js           # Server entry point
└── package.json           # Root package.json
```

## Features

### Implemented Features
- ✅ User authentication with Firebase
- ✅ Dual route display (fastest & safest)
- ✅ Rule-based safety algorithm
- ✅ Emergency contacts management
- ✅ Live journey tracking
- ✅ SOS alerts with SMS/email
- ✅ Safety pins system
- ✅ Responsive UI with Tailwind CSS
- ✅ Real-time updates with WebSockets

### Future Enhancements
- 🔄 Real-time crime data integration
- 🔄 Advanced safety algorithms
- 🔄 Offline mode support
- 🔄 Multi-language support
- 🔄 Mobile app (React Native)

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in `.env`
   - Verify database permissions

2. **Firebase Authentication Error**
   - Check Firebase configuration
   - Ensure Google provider is enabled
   - Verify API keys are correct

3. **Google Maps Not Loading**
   - Check API key validity
   - Ensure required APIs are enabled
   - Verify billing is set up

4. **SMS/Email Not Sending**
   - Check Twilio credentials
   - Verify email service configuration
   - Ensure proper permissions

### Getting Help

If you encounter issues:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all required services are running
4. Check the API documentation for external services

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@evaid.com or create an issue in the repository.
