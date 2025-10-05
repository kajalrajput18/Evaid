const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  accuracy: {
    type: Number
  },
  speed: {
    type: Number
  },
  heading: {
    type: Number
  }
});

const routeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['fastest', 'safest'],
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  polyline: {
    type: String,
    required: true
  },
  waypoints: [{
    lat: Number,
    lng: Number
  }],
  safetyScore: {
    type: Number,
    min: 0,
    max: 100
  },
  instructions: [{
    instruction: String,
    distance: Number,
    duration: Number
  }]
});

const journeySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startLocation: {
    type: locationSchema,
    required: true
  },
  endLocation: {
    type: locationSchema,
    required: true
  },
  routes: [routeSchema],
  selectedRoute: {
    type: String,
    enum: ['fastest', 'safest'],
    default: 'fastest'
  },
  status: {
    type: String,
    enum: ['planned', 'active', 'completed', 'cancelled'],
    default: 'planned'
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  actualRoute: [locationSchema],
  sharedWith: [{
    contactId: {
      type: mongoose.Schema.Types.ObjectId
    },
    contactName: String,
    contactPhone: String,
    sharedAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  sosAlerts: [{
    triggeredAt: {
      type: Date,
      default: Date.now
    },
    location: locationSchema,
    contactsNotified: [String],
    status: {
      type: String,
      enum: ['active', 'resolved'],
      default: 'active'
    }
  }],
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
journeySchema.index({ userId: 1, status: 1 });
journeySchema.index({ createdAt: -1 });
journeySchema.index({ 'sharedWith.contactId': 1 });

// Virtual for journey duration
journeySchema.virtual('duration').get(function() {
  if (this.startTime && this.endTime) {
    return this.endTime - this.startTime;
  }
  return null;
});

// Virtual for current location
journeySchema.virtual('currentLocation').get(function() {
  if (this.actualRoute && this.actualRoute.length > 0) {
    return this.actualRoute[this.actualRoute.length - 1];
  }
  return null;
});

// Method to start journey
journeySchema.methods.startJourney = function() {
  this.status = 'active';
  this.startTime = new Date();
  return this.save();
};

// Method to end journey
journeySchema.methods.endJourney = function() {
  this.status = 'completed';
  this.endTime = new Date();
  return this.save();
};

// Method to cancel journey
journeySchema.methods.cancelJourney = function() {
  this.status = 'cancelled';
  this.endTime = new Date();
  return this.save();
};

// Method to add location update
journeySchema.methods.addLocationUpdate = function(locationData) {
  if (this.status === 'active') {
    this.actualRoute.push(locationData);
    return this.save();
  }
  throw new Error('Journey is not active');
};

// Method to share with contact
journeySchema.methods.shareWithContact = function(contactData) {
  const existingShare = this.sharedWith.find(share => 
    share.contactId.toString() === contactData.contactId.toString()
  );
  
  if (existingShare) {
    existingShare.isActive = true;
    existingShare.sharedAt = new Date();
  } else {
    this.sharedWith.push(contactData);
  }
  
  return this.save();
};

// Method to stop sharing with contact
journeySchema.methods.stopSharingWithContact = function(contactId) {
  const share = this.sharedWith.find(s => s.contactId.toString() === contactId.toString());
  if (share) {
    share.isActive = false;
    return this.save();
  }
  throw new Error('Contact not found in shared list');
};

// Method to trigger SOS
journeySchema.methods.triggerSOS = function(location, contactsNotified) {
  this.sosAlerts.push({
    location,
    contactsNotified,
    status: 'active'
  });
  return this.save();
};

// Method to resolve SOS
journeySchema.methods.resolveSOS = function() {
  const activeSOS = this.sosAlerts.find(alert => alert.status === 'active');
  if (activeSOS) {
    activeSOS.status = 'resolved';
    return this.save();
  }
  throw new Error('No active SOS alert found');
};

// Pre-save middleware
journeySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Transform JSON output
journeySchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Journey', journeySchema);
