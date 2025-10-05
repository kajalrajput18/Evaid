import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  MapPin, 
  Navigation, 
  Shield, 
  Clock, 
  Route,
  Play,
  Pause,
  Square,
  AlertTriangle,
  Users,
  Settings
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MapPage = () => {
  const { user } = useAuth();
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [routes, setRoutes] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState('fastest');
  const [journeyStatus, setJourneyStatus] = useState('planned'); // planned, active, completed
  const [isTracking, setIsTracking] = useState(false);
  const [safetyPins, setSafetyPins] = useState([]);

  useEffect(() => {
    // Initialize map and get current location
    initializeMap();
    getCurrentLocation();
  }, []);

  const initializeMap = () => {
    // Simulate map initialization
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to default location (San Francisco)
          setCurrentLocation({
            lat: 37.7749,
            lng: -122.4194
          });
        }
      );
    } else {
      // Fallback to default location
      setCurrentLocation({
        lat: 37.7749,
        lng: -122.4194
      });
    }
  };

  const handleCalculateRoutes = async () => {
    if (!startLocation || !endLocation) {
      alert('Please enter both start and end locations');
      return;
    }

    // Simulate route calculation
    setLoading(true);
    setTimeout(() => {
      setRoutes({
        fastest: {
          distance: '12.5 km',
          duration: '25 min',
          safetyScore: 75,
          polyline: 'sample_polyline_fastest'
        },
        safest: {
          distance: '15.2 km',
          duration: '32 min',
          safetyScore: 95,
          polyline: 'sample_polyline_safest'
        }
      });
      setLoading(false);
    }, 2000);
  };

  const handleStartJourney = () => {
    setJourneyStatus('active');
    setIsTracking(true);
    // Start location tracking
    startLocationTracking();
  };

  const handlePauseJourney = () => {
    setIsTracking(false);
  };

  const handleResumeJourney = () => {
    setIsTracking(true);
  };

  const handleEndJourney = () => {
    setJourneyStatus('completed');
    setIsTracking(false);
  };

  const startLocationTracking = () => {
    // Simulate location tracking
    const interval = setInterval(() => {
      if (isTracking) {
        // Update current location
        getCurrentLocation();
      }
    }, 5000);

    return () => clearInterval(interval);
  };

  const handleSOSAlert = () => {
    if (window.confirm('Are you sure you want to send an SOS alert? This will notify your emergency contacts.')) {
      // Send SOS alert
      alert('SOS alert sent to your emergency contacts!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Map Container */}
      <div className="h-screen relative">
        {/* Placeholder for map */}
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Map View</h3>
            <p className="text-gray-600">Google Maps integration will be displayed here</p>
            <p className="text-sm text-gray-500 mt-2">
              Current Location: {currentLocation ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}` : 'Loading...'}
            </p>
          </div>
        </div>

        {/* Route Input Panel */}
        <div className="absolute top-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Location
              </label>
              <input
                type="text"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                placeholder="Enter start location"
                className="location-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Location
              </label>
              <input
                type="text"
                value={endLocation}
                onChange={(e) => setEndLocation(e.target.value)}
                placeholder="Enter destination"
                className="location-input"
              />
            </div>
          </div>
          <button
            onClick={handleCalculateRoutes}
            className="btn-primary w-full"
          >
            <Route className="w-4 h-4 mr-2" />
            Calculate Routes
          </button>
        </div>

        {/* Route Selection Panel */}
        {routes && (
          <div className="absolute top-32 left-4 bg-white rounded-lg shadow-lg p-4 w-80">
            <h3 className="font-semibold text-gray-900 mb-3">Choose Your Route</h3>
            <div className="space-y-3">
              <div
                className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedRoute === 'fastest' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedRoute('fastest')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Fastest Route</h4>
                      <p className="text-sm text-gray-600">{routes.fastest.distance} • {routes.fastest.duration}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {routes.fastest.safetyScore}% safe
                  </span>
                </div>
              </div>

              <div
                className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedRoute === 'safest' ? 'border-safety-500 bg-safety-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedRoute('safest')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-safety-500 rounded-full mr-3"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Safest Route</h4>
                      <p className="text-sm text-gray-600">{routes.safest.distance} • {routes.safest.duration}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-safety-600">
                    {routes.safest.safetyScore}% safe
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {journeyStatus === 'planned' && (
                <button
                  onClick={handleStartJourney}
                  className="btn-success w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Journey
                </button>
              )}

              {journeyStatus === 'active' && (
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    {isTracking ? (
                      <button
                        onClick={handlePauseJourney}
                        className="btn-warning flex-1"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </button>
                    ) : (
                      <button
                        onClick={handleResumeJourney}
                        className="btn-success flex-1"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Resume
                      </button>
                    )}
                    <button
                      onClick={handleEndJourney}
                      className="btn-secondary flex-1"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      End
                    </button>
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-gray-600">
                      {isTracking ? 'Tracking active' : 'Tracking paused'}
                    </span>
                  </div>
                </div>
              )}

              {journeyStatus === 'completed' && (
                <div className="text-center py-2">
                  <span className="text-sm text-safety-600 font-medium">
                    Journey completed successfully!
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Safety Pins Panel */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 w-80">
          <h3 className="font-semibold text-gray-900 mb-3">Safety Pins</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-safety-50 rounded">
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-safety-600 mr-2" />
                <span className="text-sm text-gray-900">Well-lit area</span>
              </div>
              <span className="text-xs text-safety-600">+5</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-warning-50 rounded">
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 text-warning-600 mr-2" />
                <span className="text-sm text-gray-900">Dark alley</span>
              </div>
              <span className="text-xs text-warning-600">-3</span>
            </div>
          </div>
        </div>

        {/* SOS Button */}
        <button
          onClick={handleSOSAlert}
          className="sos-button"
          title="Send SOS Alert"
        >
          <AlertTriangle className="w-6 h-6" />
        </button>

        {/* Journey Status */}
        {journeyStatus === 'active' && (
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-safety-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-900">Journey Active</span>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              Sharing with {user?.emergencyContacts?.length || 0} contacts
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
