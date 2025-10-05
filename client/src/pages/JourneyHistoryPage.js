import { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  Navigation, 
  Shield, 
  Filter,
  Search,
  Calendar,
  Route
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const JourneyHistoryPage = () => {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    // Simulate loading journey history
    setTimeout(() => {
      setJourneys([
        {
          id: 1,
          from: 'Home',
          to: 'Office',
          date: '2024-01-15',
          startTime: '08:30',
          endTime: '09:00',
          duration: '30 min',
          distance: '12.5 km',
          status: 'completed',
          safetyScore: 92,
          routeType: 'safest',
          sosAlerts: 0
        },
        {
          id: 2,
          from: 'Office',
          to: 'Gym',
          date: '2024-01-14',
          startTime: '18:00',
          endTime: '18:25',
          duration: '25 min',
          distance: '8.2 km',
          status: 'completed',
          safetyScore: 88,
          routeType: 'fastest',
          sosAlerts: 0
        },
        {
          id: 3,
          from: 'Gym',
          to: 'Home',
          date: '2024-01-14',
          startTime: '19:30',
          endTime: null,
          duration: null,
          distance: '10.1 km',
          status: 'cancelled',
          safetyScore: 95,
          routeType: 'safest',
          sosAlerts: 1
        },
        {
          id: 4,
          from: 'Home',
          to: 'Airport',
          date: '2024-01-13',
          startTime: '14:00',
          endTime: '14:45',
          duration: '45 min',
          distance: '25.3 km',
          status: 'completed',
          safetyScore: 85,
          routeType: 'fastest',
          sosAlerts: 0
        },
        {
          id: 5,
          from: 'Airport',
          to: 'Hotel',
          date: '2024-01-12',
          startTime: '16:30',
          endTime: '17:15',
          duration: '45 min',
          distance: '18.7 km',
          status: 'completed',
          safetyScore: 90,
          routeType: 'safest',
          sosAlerts: 0
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="status-completed">Completed</span>;
      case 'cancelled':
        return <span className="status-cancelled">Cancelled</span>;
      case 'active':
        return <span className="status-active">Active</span>;
      default:
        return <span className="status-planned">Planned</span>;
    }
  };

  const getSafetyScoreColor = (score) => {
    if (score >= 90) return 'text-safety-600';
    if (score >= 70) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getRouteTypeColor = (type) => {
    return type === 'safest' ? 'text-safety-600' : 'text-primary-600';
  };

  const filteredJourneys = journeys.filter(journey => {
    const matchesSearch = journey.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         journey.to.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || journey.status === statusFilter;
    const matchesDate = dateFilter === 'all' || journey.date === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
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
          <h1 className="text-3xl font-bold text-gray-900">Journey History</h1>
          <p className="mt-2 text-gray-600">
            View your past journeys and safety statistics
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    placeholder="Search journeys..."
                    className="input pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="active">Active</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="input"
                >
                  <option value="all">All Dates</option>
                  <option value="2024-01-15">Today</option>
                  <option value="2024-01-14">Yesterday</option>
                  <option value="2024-01-13">2 days ago</option>
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

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Navigation className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Journeys</p>
                <p className="text-2xl font-bold text-gray-900">{journeys.length}</p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-safety-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-safety-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {journeys.filter(j => j.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Safety Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(journeys.reduce((acc, j) => acc + j.safetyScore, 0) / journeys.length)}%
                </p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-danger-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">SOS Alerts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {journeys.reduce((acc, j) => acc + j.sosAlerts, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Journeys List */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Journeys ({filteredJourneys.length})
            </h2>
          </div>
          <div className="card-body p-0">
            {filteredJourneys.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredJourneys.map((journey) => (
                  <div key={journey.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-lg font-medium text-gray-900">
                                {journey.from} → {journey.to}
                              </h3>
                              {getStatusBadge(journey.status)}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {journey.date}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {journey.startTime} - {journey.endTime || 'N/A'}
                              </div>
                              <div className="flex items-center">
                                <Route className="w-4 h-4 mr-1" />
                                {journey.distance}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className={`text-sm font-medium ${getSafetyScoreColor(journey.safetyScore)}`}>
                                  {journey.safetyScore}% safe
                                </span>
                                <span className={`text-xs font-medium ${getRouteTypeColor(journey.routeType)}`}>
                                  {journey.routeType}
                                </span>
                              </div>
                              {journey.sosAlerts > 0 && (
                                <div className="text-xs text-danger-600 font-medium">
                                  {journey.sosAlerts} SOS alert{journey.sosAlerts > 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Navigation className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No journeys found</h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                    ? 'Try adjusting your filters to see more results.'
                    : 'Start your first journey to see it here.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyHistoryPage;
