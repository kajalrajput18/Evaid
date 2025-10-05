import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  User, 
  Mail, 
  Phone, 
  Settings, 
  Shield, 
  Bell,
  Save,
  Edit
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profilePicture: ''
  });
  const [preferences, setPreferences] = useState({
    defaultTransportMode: 'driving',
    safetyLevel: 'medium',
    notifications: {
      email: true,
      sms: true,
      push: true
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        profilePicture: user.profilePicture || ''
      });
      setPreferences(user.preferences || preferences);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('notifications.')) {
      const notificationType = name.split('.')[1];
      setPreferences(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationType]: checked
        }
      }));
    } else {
      setPreferences(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Preferences saved successfully!');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-outline"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                  )}
                </div>
              </div>
              <div className="card-body">
                <div className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                      {formData.profilePicture ? (
                        <img
                          src={formData.profilePicture}
                          alt="Profile"
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-primary-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{formData.name}</h3>
                      <p className="text-gray-600">{formData.email}</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Picture URL
                      </label>
                      <input
                        type="url"
                        name="profilePicture"
                        value={formData.profilePicture}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="btn-primary"
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="loading-spinner h-4 w-4 mr-2"></div>
                            Saving...
                          </div>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
              </div>
              <div className="card-body">
                <div className="space-y-6">
                  {/* Transport Mode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Transport Mode
                    </label>
                    <select
                      name="defaultTransportMode"
                      value={preferences.defaultTransportMode}
                      onChange={handlePreferenceChange}
                      className="input"
                    >
                      <option value="driving">Driving</option>
                      <option value="walking">Walking</option>
                      <option value="transit">Public Transit</option>
                    </select>
                  </div>

                  {/* Safety Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Safety Level
                    </label>
                    <select
                      name="safetyLevel"
                      value={preferences.safetyLevel}
                      onChange={handlePreferenceChange}
                      className="input"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  {/* Notifications */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notifications
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="notifications.email"
                          checked={preferences.notifications.email}
                          onChange={handlePreferenceChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Email</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="notifications.sms"
                          checked={preferences.notifications.sms}
                          onChange={handlePreferenceChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">SMS</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="notifications.push"
                          checked={preferences.notifications.push}
                          onChange={handlePreferenceChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Push</span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleSavePreferences}
                    disabled={loading}
                    className="btn-primary w-full"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="loading-spinner h-4 w-4 mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Preferences
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="card mt-6">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">Account Stats</h2>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Member since</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last login</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Emergency contacts</span>
                    <span className="text-sm font-medium text-gray-900">
                      {user.emergencyContacts?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
