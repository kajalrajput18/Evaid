import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  MapPin, 
  Users, 
  Shield, 
  Clock, 
  Navigation,
  Plus,
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalJourneys: 0,
    activeJourneys: 0,
    emergencyContacts: 0,
    safetyScore: 0
  });
  const [recentJourneys, setRecentJourneys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setStats({
        totalJourneys: 24,
        activeJourneys: 1,
        emergencyContacts: 2,
        safetyScore: 95
      });
      
      setRecentJourneys([
        {
          id: 1,
          from: 'Home',
          to: 'Office',
          date: '2024-01-15',
          status: 'completed',
          safetyScore: 92
        },
        {
          id: 2,
          from: 'Office',
          to: 'Gym',
          date: '2024-01-14',
          status: 'completed',
          safetyScore: 88
        },
        {
          id: 3,
          from: 'Gym',
          to: 'Home',
          date: '2024-01-14',
          status: 'active',
          safetyScore: 95
        }
      ]);
      
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="status-active">Active</span>;
      case 'completed':
        return <span className="status-completed">Completed</span>;
      case 'cancelled':
        return <span className="status-cancelled">Cancelled</span>;
      default:
        return <span className="status-planned">Planned</span>;
    }
  };

  const getSafetyScoreColor = (score) => {
    if (score >= 90) return 'text-safety-600';
    if (score >= 70) return 'text-warning-600';
    return 'text-danger-600';
  };

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
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's your safety dashboard with recent activity and quick actions.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Navigation className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Journeys</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJourneys}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-safety-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-safety-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Journeys</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeJourneys}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Emergency Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.emergencyContacts}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-safety-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-safety-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Safety Score</p>
                <p className={`text-2xl font-bold ${getSafetyScoreColor(stats.safetyScore)}`}>
                  {stats.safetyScore}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <Link
                  to="/map"
                  className="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium text-gray-900">Plan New Journey</h3>
                    <p className="text-sm text-gray-600">Get fastest and safest routes</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </Link>

                <Link
                  to="/contacts"
                  className="flex items-center p-4 bg-safety-50 rounded-lg hover:bg-safety-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-safety-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium text-gray-900">Manage Contacts</h3>
                    <p className="text-sm text-gray-600">Add or update emergency contacts</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </Link>

                <Link
                  to="/safety-pins"
                  className="flex items-center p-4 bg-warning-50 rounded-lg hover:bg-warning-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-warning-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium text-gray-900">Safety Pins</h3>
                    <p className="text-sm text-gray-600">Report safe or unsafe areas</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </Link>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Safety Status</h2>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-safety-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-safety-600" />
                    <span className="ml-2 text-sm font-medium text-gray-900">Emergency Contacts</span>
                  </div>
                  <span className="text-sm text-safety-600">Configured</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-safety-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-safety-600" />
                    <span className="ml-2 text-sm font-medium text-gray-900">Location Services</span>
                  </div>
                  <span className="text-sm text-safety-600">Enabled</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-warning-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-warning-600" />
                    <span className="ml-2 text-sm font-medium text-gray-900">SOS Alerts</span>
                  </div>
                  <span className="text-sm text-warning-600">Test Required</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Journeys */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Journeys</h2>
              <Link
                to="/journey-history"
                className="text-sm text-primary-600 hover:text-primary-500 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="card-body">
            {recentJourneys.length > 0 ? (
              <div className="space-y-4">
                {recentJourneys.map((journey) => (
                  <div key={journey.id} className="journey-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {journey.from} → {journey.to}
                            </h3>
                            <p className="text-sm text-gray-600">{journey.date}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(journey.status)}
                              <span className={`text-sm font-medium ${getSafetyScoreColor(journey.safetyScore)}`}>
                                {journey.safetyScore}% safe
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No journeys yet</h3>
                <p className="text-gray-600 mb-4">Start your first safe journey today!</p>
                <Link
                  to="/map"
                  className="btn-primary inline-flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Plan Journey
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
