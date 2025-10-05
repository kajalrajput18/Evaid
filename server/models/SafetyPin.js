const mongoose = require('mongoose');

const safetyPinSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  type: {
    type: String,
    enum: ['safe', 'unsafe', 'well-lit', 'dark', 'crowded', 'isolated', 'emergency'],
    required: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationCount: {
    type: Number,
    default: 1
  },
  verifiedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: {
      type: Date,
      default: Date.now
    }
  }],
  reports: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reportType: {
      type: String,
      enum: ['inaccurate', 'spam', 'outdated', 'other']
    },
    description: String,
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Safety pins expire after 30 days
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
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

// Geospatial index for location-based queries
safetyPinSchema.index({ location: '2dsphere' });
safetyPinSchema.index({ type: 1, isActive: 1 });
safetyPinSchema.index({ createdAt: -1 });
safetyPinSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for safety score
safetyPinSchema.virtual('safetyScore').get(function() {
  const baseScore = this.type === 'safe' ? 80 : 
                   this.type === 'well-lit' ? 70 :
                   this.type === 'crowded' ? 60 :
                   this.type === 'dark' ? 30 :
                   this.type === 'isolated' ? 20 :
                   this.type === 'unsafe' ? 10 : 50;
  
  const verificationBonus = Math.min(this.verificationCount * 5, 20);
  const severityPenalty = this.severity === 'high' ? -20 : 
                         this.severity === 'medium' ? -10 : 0;
  
  return Math.max(0, Math.min(100, baseScore + verificationBonus + severityPenalty));
});

// Method to verify pin
safetyPinSchema.methods.verifyPin = function(userId) {
  // Check if user already verified this pin
  const alreadyVerified = this.verifiedBy.some(verification => 
    verification.userId.toString() === userId.toString()
  );
  
  if (!alreadyVerified) {
    this.verifiedBy.push({ userId });
    this.verificationCount += 1;
    
    // Mark as verified if enough people have verified it
    if (this.verificationCount >= 3) {
      this.isVerified = true;
    }
    
    return this.save();
  }
  
  throw new Error('User has already verified this pin');
};

// Method to report pin
safetyPinSchema.methods.reportPin = function(userId, reportData) {
  // Check if user already reported this pin
  const alreadyReported = this.reports.some(report => 
    report.userId.toString() === userId.toString()
  );
  
  if (!alreadyReported) {
    this.reports.push({
      userId,
      ...reportData
    });
    
    // Deactivate pin if too many reports
    if (this.reports.length >= 5) {
      this.isActive = false;
    }
    
    return this.save();
  }
  
  throw new Error('User has already reported this pin');
};

// Static method to find nearby safety pins
safetyPinSchema.statics.findNearby = function(location, radius = 1000, type = null) {
  const query = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [location.lng, location.lat]
        },
        $maxDistance: radius
      }
    },
    isActive: true,
    expiresAt: { $gt: new Date() }
  };
  
  if (type) {
    query.type = type;
  }
  
  return this.find(query).populate('userId', 'name email');
};

// Static method to get safety statistics for an area
safetyPinSchema.statics.getAreaSafetyStats = function(location, radius = 1000) {
  return this.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [location.lng, location.lat]
        },
        distanceField: 'distance',
        maxDistance: radius,
        spherical: true
      }
    },
    {
      $match: {
        isActive: true,
        expiresAt: { $gt: new Date() }
      }
    },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        avgVerificationCount: { $avg: '$verificationCount' }
      }
    }
  ]);
};

// Pre-save middleware
safetyPinSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Transform JSON output
safetyPinSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('SafetyPin', safetyPinSchema);
