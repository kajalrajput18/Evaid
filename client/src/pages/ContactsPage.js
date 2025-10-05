import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  Star,
  UserPlus
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ContactsPage = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: 'friend'
  });

  useEffect(() => {
    // Simulate loading contacts
    setTimeout(() => {
      setContacts([
        {
          id: 1,
          name: 'John Doe',
          phone: '+1 (555) 123-4567',
          email: 'john.doe@email.com',
          relationship: 'family',
          isPrimary: true
        },
        {
          id: 2,
          name: 'Jane Smith',
          phone: '+1 (555) 987-6543',
          email: 'jane.smith@email.com',
          relationship: 'friend',
          isPrimary: false
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddContact = () => {
    if (!formData.name || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    const newContact = {
      id: Date.now(),
      ...formData,
      isPrimary: contacts.length === 0
    };

    setContacts(prev => [...prev, newContact]);
    setFormData({
      name: '',
      phone: '',
      email: '',
      relationship: 'friend'
    });
    setShowAddForm(false);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email || '',
      relationship: contact.relationship
    });
    setShowAddForm(true);
  };

  const handleUpdateContact = () => {
    if (!formData.name || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    setContacts(prev => prev.map(contact => 
      contact.id === editingContact.id 
        ? { ...contact, ...formData }
        : contact
    ));

    setFormData({
      name: '',
      phone: '',
      email: '',
      relationship: 'friend'
    });
    setShowAddForm(false);
    setEditingContact(null);
  };

  const handleDeleteContact = (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
    }
  };

  const handleSetPrimary = (contactId) => {
    setContacts(prev => prev.map(contact => ({
      ...contact,
      isPrimary: contact.id === contactId
    })));
  };

  const getRelationshipColor = (relationship) => {
    switch (relationship) {
      case 'family':
        return 'bg-primary-100 text-primary-800';
      case 'friend':
        return 'bg-safety-100 text-safety-800';
      case 'colleague':
        return 'bg-warning-100 text-warning-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Emergency Contacts</h1>
              <p className="mt-2 text-gray-600">
                Manage your trusted contacts for emergency situations
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="card mb-8">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingContact ? 'Edit Contact' : 'Add New Contact'}
              </h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter contact name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship
                  </label>
                  <select
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="family">Family</option>
                    <option value="friend">Friend</option>
                    <option value="colleague">Colleague</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={editingContact ? handleUpdateContact : handleAddContact}
                  className="btn-primary"
                >
                  {editingContact ? 'Update Contact' : 'Add Contact'}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingContact(null);
                    setFormData({
                      name: '',
                      phone: '',
                      email: '',
                      relationship: 'friend'
                    });
                  }}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contacts List */}
        {contacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contacts.map((contact) => (
              <div key={contact.id} className="contact-card">
                <div className="card-body">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {contact.name}
                        </h3>
                        {contact.isPrimary && (
                          <Star className="w-4 h-4 text-warning-500 fill-current" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          <span className="text-sm">{contact.phone}</span>
                        </div>
                        {contact.email && (
                          <div className="flex items-center text-gray-600">
                            <Mail className="w-4 h-4 mr-2" />
                            <span className="text-sm">{contact.email}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRelationshipColor(contact.relationship)}`}>
                            {contact.relationship}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditContact(contact)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Edit contact"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="p-2 text-gray-400 hover:text-danger-600 transition-colors"
                        title="Delete contact"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    {!contact.isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(contact.id)}
                        className="btn-outline text-sm"
                      >
                        Set as Primary
                      </button>
                    )}
                    <button className="btn-outline text-sm">
                      Test Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No emergency contacts</h3>
            <p className="text-gray-600 mb-6">
              Add your trusted contacts to ensure help is available when you need it most.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Contact
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
                <h3 className="font-medium text-gray-900 mb-2">Emergency Contacts</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Add at least 2 emergency contacts</li>
                  <li>• Include family members and close friends</li>
                  <li>• Keep contact information up to date</li>
                  <li>• Test contacts regularly</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">SOS Alerts</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• SOS alerts send your live location</li>
                  <li>• Include a brief message if possible</li>
                  <li>• Contacts receive SMS and email notifications</li>
                  <li>• Use only in genuine emergencies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
