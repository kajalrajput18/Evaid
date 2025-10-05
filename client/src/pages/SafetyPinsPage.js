import { useState, useEffect } from 'react';
import { 
  Shield, 
  MapPin, 
  Plus, 
  Filter,
  Search,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SafetyPinsPage = () => {
  const [safetyPins, setSafetyPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [formData, setFormData] = useState({
    type: 'safe',
    description: '',
    severity: 'medium'
  });

  useEffect(() => {
    // Simulate loading safety pins
    setTimeout(() => {
      setSafetyPins([
        {
          id: 1,
          type: 'safe',
          description: 'Well-lit parking area with security cameras',
          severity: 'low',
          location: 'Downtown Mall',
          verified: true,
          verificationCount: 5,
          createdAt: '2024-01-15',
          userId: 'user1'
        },
        {
          id: 2,
          type: 'unsafe',
          description: 'Dark alley with poor lighting, avoid at night',
          severity: 'high',
          location: 'Backstreet near Main St',
          verified: true,
          verificationCount: 8,
          createdAt: '2024-01-14',
          userId: 'user2'
        },
        {
          id: 3,
          type: 'well-lit',
          description: 'Bright street with good visibility',
          severity: 'low',
          location: 'Central Avenue',
          verified: false,
          verificationCount: 2,
          createdAt: '2024-01-13',
          userId: 'user3'
        },
        {
          id: 4,
          type: 'crowded',
          description: 'Busy area with lots of people during day',
          severity: 'low',
          location: 'Market Square',
          verified: true,
          verificationCount: 12,
          createdAt: '2024-01-12',
          userId: 'user4'
        },
        {
          id: 5,
          type: 'isolated',
          description: 'Remote area with no people around',
          severity: 'medium',
          location: 'Industrial Zone',
          verified: false,
          verificationCount: 1,
          createdAt: '2024-01-11',
          userId: 'user5'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'safe':
        return <CheckCircle className="w-5 h-5 text-safety-600" />;
      case 'unsafe':
        return <AlertTriangle className="w-5 h-5 text-danger-600" />;
      case 'well-lit':
        return <Shield className="w-5 h-5 text-safety-600" />;
      case 'crowded':
        return <MapPin className="w-5 h-5 text-warning-600" />;
      case 'isolated':
        return <X className="w-5 h-5 text-danger-600" />;
      default:
        return <MapPin className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'safe':
        return 'bg-safety-100 text-safety-800';
      case 'unsafe':
        return 'bg-danger-100 text-danger-800';
      case 'well-lit':
        return 'bg-safety-100 text-safety-800';
      case 'crowded':
        return 'bg-warning-100 text-warning-800';
      case 'isolated':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low':
        return 'text-safety-600';
      case 'medium':
        return 'text-warning-600';
      case 'high':
        return 'text-danger-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPin = () => {
    if (!formData.description.trim()) {
      alert('Please enter a description');
      return;
    }

    const newPin = {
      id: Date.now(),
      ...formData,
      location: 'Current Location', // This would be set from GPS
      verified: false,
      verificationCount: 1,
      createdAt: new Date().toISOString().split('T')[0],
      userId: 'current-user'
    };

    setSafetyPins(prev => [newPin, ...prev]);
    setFormData({
      type: 'safe',
      description: '',
      severity: 'medium'
    });
    setShowAddForm(false);
  };

  const handleVerifyPin = (pinId) => {
    setSafetyPins(prev => prev.map(pin => 
      pin.id === pinId 
        ? { 
            ...pin, 
            verificationCount: pin.verificationCount + 1,
            verified: pin.verificationCount + 1 >= 3
          }
        : pin
    ));
  };

  const filteredPins = safetyPins.filter(pin => {
    const matchesSearch = pin.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pin.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || pin.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Safety Pins</h1>
              <p className="mt-2 text-gray-600">
                Community-driven safety information for your area
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Safety Pin
            </button>
          </div>
        </div>

        {/* Add Pin Form */}
        {showAddForm && (
          <div className="card mb-8">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Add Safety Pin</h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="safe">Safe Area</option>
                    <option value="unsafe">Unsafe Area</option>
                    <option value="well-lit">Well-lit Area</option>
                    <option value="crowded">Crowded Area</option>
                    <option value="isolated">Isolated Area</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity
                  </label>
                  <select
                    name="severity"
                    value={formData.severity}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="input"
                  placeholder="Describe the safety condition..."
                />
              </div>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={handleAddPin}
                  className="btn-primary"
                >
                  Add Pin
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="card mb-8">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search safety pins..."
                    className="input pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="input"
                >
                  <option value="all">All Types</option>
                  <option value="safe">Safe Areas</option>
                  <option value="unsafe">Unsafe Areas</option>
                  <option value="well-lit">Well-lit Areas</option>
                  <option value="crowded">Crowded Areas</option>
                  <option value="isolated">Isolated Areas</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="btn-outline w-full">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Pins List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPins.map((pin) => (
            <div key={pin.id} className="card">
              <div className="card-body">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(pin.type)}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(pin.type)}`}>
                      {pin.type.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getSeverityColor(pin.severity)}`}>
                      {pin.severity} severity
                    </div>
                    {pin.verified && (
                      <div className="text-xs text-safety-600 font-medium">
                        Verified
                      </div>
                    )}
                  </div>
                </div>
                
                <h3 className="font-medium text-gray-900 mb-2">{pin.location}</h3>
                <p className="text-sm text-gray-600 mb-4">{pin.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{pin.createdAt}</span>
                  <span>{pin.verificationCount} verification{pin.verificationCount !== 1 ? 's' : ''}</span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleVerifyPin(pin.id)}
                    className="btn-outline flex-1 text-sm"
                  >
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    Verify
                  </button>
                  <button className="btn-outline flex-1 text-sm">
                    <ThumbsDown className="w-3 h-3 mr-1" />
                    Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPins.length === 0 && (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No safety pins found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || typeFilter !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Be the first to add a safety pin in your area.'}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Safety Pin
            </button>
          </div>
        )}

        {/* Safety Tips */}
        <div className="mt-12 card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">Safety Tips</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Adding Safety Pins</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Be accurate and honest in your descriptions</li>
                  <li>• Include specific details about the location</li>
                  <li>• Update pins if conditions change</li>
                  <li>• Verify other users' pins when possible</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Using Safety Pins</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Check safety pins before planning routes</li>
                  <li>• Consider the verification count</li>
                  <li>• Report outdated or inaccurate pins</li>
                  <li>• Use pins as guidance, not absolute truth</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyPinsPage;
