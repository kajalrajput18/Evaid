# Evaid: Travel With Safety and Confidence

A safety-first navigation web application that provides both the fastest and safest routes, along with integrated safety features like trusted contacts, SOS alerts, and live journey sharing.

## 🎯 Features

- **Dual Route Display**: Shows both fastest and safest routes simultaneously
- **Rule-Based Safety Algorithm**: Prioritizes highways and avoids isolated paths
- **Trusted Contacts**: Add and manage emergency contacts
- **Live Journey Tracking**: Real-time location sharing with trusted contacts
- **SOS Alerts**: One-click emergency notifications with live location
- **Authentication**: Secure user login/signup with Firebase Auth

## 🛠️ Tech Stack

- **Frontend**: React.js + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Maps**: Google Maps API
- **Real-time**: WebSockets

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm run install-all
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env` in both `server/` and `client/` directories
   - Add your API keys and configuration

3. **Start development servers**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
evaid-travel-safety/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
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

## 🔧 Configuration

### Required Environment Variables

**Server (.env)**:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT secret for authentication
- `GOOGLE_MAPS_API_KEY`: Google Maps API key
- `TWILIO_ACCOUNT_SID`: Twilio account SID for SMS
- `TWILIO_AUTH_TOKEN`: Twilio auth token
- `EMAIL_USER`: Email service username
- `EMAIL_PASS`: Email service password

**Client (.env)**:
-`REACT_APP_GOOGLE_MAPS_API_KEY`: Google Maps API key
- `REACT_APP_API_URL`: Backend API URL

## 🚨 Security Features

- Encrypted location sharing
- Secure authentication with Firebase
- Protected API routes
- Input validation and sanitization
- Rate limiting for API endpoints

## 📱 Mobile Responsive

The application is fully responsive and optimized for both mobile and desktop devices.

## 🔮 Future Enhancements

- Crowd-sourced safety pins
- Real-time crime data integration
- Advanced safety algorithms
- Offline mode support
- Multi-language support

## 📄 License

MIT License - see LICENSE file for details.
