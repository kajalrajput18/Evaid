import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinUserRoom(userId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-user-room', userId);
    }
  }

  sendLocationUpdate(userId, location, journeyId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('location-update', {
        userId,
        location,
        journeyId
      });
    }
  }

  sendSOSAlert(userId, location, contacts) {
    if (this.socket && this.isConnected) {
      this.socket.emit('sos-alert', {
        userId,
        location,
        contacts
      });
    }
  }

  onLocationUpdate(callback) {
    if (this.socket) {
      this.socket.on('location-update', callback);
    }
  }

  onSOSAlert(callback) {
    if (this.socket) {
      this.socket.on('sos-alert', callback);
    }
  }

  offLocationUpdate(callback) {
    if (this.socket) {
      this.socket.off('location-update', callback);
    }
  }

  offSOSAlert(callback) {
    if (this.socket) {
      this.socket.off('sos-alert', callback);
    }
  }

  getSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return this.isConnected;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
