import { Link } from 'react-router-dom';
import { 
  Shield, 
  MapPin, 
  Users, 
  Bell, 
  Route, 
  Smartphone,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Route,
      title: 'Dual Route Display',
      description: 'Get both the fastest and safest routes simultaneously with our intelligent routing system.'
    },
    {
      icon: Shield,
      title: 'Safety Algorithm',
      description: 'Advanced rule-based safety algorithm prioritizes highways and avoids isolated paths.'
    },
    {
      icon: Users,
      title: 'Trusted Contacts',
      description: 'Add emergency contacts and share your live journey with trusted people.'
    },
    {
      icon: Bell,
      title: 'SOS Alerts',
      description: 'One-click emergency button sends instant SMS/email with live location to contacts.'
    },
    {
      icon: MapPin,
      title: 'Live Tracking',
      description: 'Real-time location sharing and journey tracking for enhanced safety.'
    },
    {
      icon: Smartphone,
      title: 'Mobile Responsive',
      description: 'Fully responsive design optimized for both mobile and desktop devices.'
    }
  ];

  const benefits = [
    'Enhanced safety for travelers',
    'Real-time emergency assistance',
    'Intelligent route optimization',
    'Secure location sharing',
    'User-friendly interface',
    '24/7 safety monitoring'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Shield className="w-10 h-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow-lg">
              Travel With Safety and Confidence
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Evaid is a safety-first navigation app that provides both the fastest and safest routes, 
              along with integrated safety features like trusted contacts, SOS alerts, and live journey sharing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Safety-First Navigation Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlike traditional navigation apps, Evaid focuses on safety + navigation + emergency aid in one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Evaid?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Evaid provides comprehensive safety features that go beyond traditional navigation apps. 
                Our platform ensures you reach your destination safely while keeping your loved ones informed.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-safety-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Safety Score: 95/100
                  </h3>
                  <p className="text-gray-600">
                    Your route is optimized for maximum safety
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Route Safety</span>
                    <span className="font-semibold text-safety-600">High</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Emergency Contacts</span>
                    <span className="font-semibold text-safety-600">2 Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Live Tracking</span>
                    <span className="font-semibold text-safety-600">Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Travel Safely?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Join thousands of users who trust Evaid for their daily commutes and travels. 
            Start your safety-first journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center justify-center"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/login"
              className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200"
            >
              Sign In to Continue
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">50K+</div>
              <div className="text-gray-600">Safe Journeys</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-600">Safety Monitoring</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
