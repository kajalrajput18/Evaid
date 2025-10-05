const express = require('express');
const { body, validationResult } = require('express-validator');
const Journey = require('../models/Journey');
const router = express.Router();

// @route   POST /api/tracking/start
// @desc    Start journey tracking
// @access  Private
router.post('/start', [
  body('journeyId').isMongoId().withMessage('Valid journey ID is required'),
  body('location.lat').isFloat().withMessage('Valid latitude is required'),
  body('location.lng').isFloat().withMessage('Valid longitude is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { journeyId, location } = req.body;

    const journey = await Journey.findOne({
      _id: journeyId,
      userId: req.user._id
    });

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found'
      });
    }

    if (journey.status !== 'planned') {
      return res.status(400).json({
        success: false,
        message: 'Journey is not in planned status'
      });
    }

    // Start the journey
    await journey.startJourney();

    // Add initial location
    await journey.addLocationUpdate({
      lat: location.lat,
      lng: location.lng,
      timestamp: new Date(),
      accuracy: location.accuracy || null,
      speed: location.speed || null,
      heading: location.heading || null
    });

    res.json({
      success: true,
      message: 'Journey tracking started successfully',
      data: {
        journey
      }
    });
  } catch (error) {
    console.error('Start tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/tracking/update
// @desc    Update journey location
// @access  Private
router.post('/update', [
  body('journeyId').isMongoId().withMessage('Valid journey ID is required'),
  body('location.lat').isFloat().withMessage('Valid latitude is required'),
  body('location.lng').isFloat().withMessage('Valid longitude is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { journeyId, location } = req.body;

    const journey = await Journey.findOne({
      _id: journeyId,
      userId: req.user._id
    });

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found'
      });
    }

    if (journey.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Journey is not active'
      });
    }

    // Add location update
    await journey.addLocationUpdate({
      lat: location.lat,
      lng: location.lng,
      timestamp: new Date(),
      accuracy: location.accuracy || null,
      speed: location.speed || null,
      heading: location.heading || null
    });

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: {
        currentLocation: journey.currentLocation,
        totalUpdates: journey.actualRoute.length
      }
    });
  } catch (error) {
    console.error('Update location error:', error);
    if (error.message === 'Journey is not active') {
      return res.status(400).json({
        success: false,
        message: 'Journey is not active'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/tracking/end
// @desc    End journey tracking
// @access  Private
router.post('/end', [
  body('journeyId').isMongoId().withMessage('Valid journey ID is required'),
  body('location.lat').isFloat().withMessage('Valid latitude is required'),
  body('location.lng').isFloat().withMessage('Valid longitude is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { journeyId, location } = req.body;

    const journey = await Journey.findOne({
      _id: journeyId,
      userId: req.user._id
    });

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found'
      });
    }

    if (journey.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Journey is not active'
      });
    }

    // Add final location update
    await journey.addLocationUpdate({
      lat: location.lat,
      lng: location.lng,
      timestamp: new Date(),
      accuracy: location.accuracy || null,
      speed: location.speed || null,
      heading: location.heading || null
    });

    // End the journey
    await journey.endJourney();

    res.json({
      success: true,
      message: 'Journey tracking ended successfully',
      data: {
        journey
      }
    });
  } catch (error) {
    console.error('End tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/tracking/share
// @desc    Share journey with contacts
// @access  Private
router.post('/share', [
  body('journeyId').isMongoId().withMessage('Valid journey ID is required'),
  body('contacts').isArray().withMessage('Contacts array is required'),
  body('contacts.*.contactId').isMongoId().withMessage('Valid contact ID is required'),
  body('contacts.*.contactName').notEmpty().withMessage('Contact name is required'),
  body('contacts.*.contactPhone').isMobilePhone().withMessage('Valid contact phone is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { journeyId, contacts } = req.body;

    const journey = await Journey.findOne({
      _id: journeyId,
      userId: req.user._id
    });

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found'
      });
    }

    // Share with each contact
    for (const contact of contacts) {
      await journey.shareWithContact(contact);
    }

    res.json({
      success: true,
      message: 'Journey shared successfully',
      data: {
        sharedWith: journey.sharedWith
      }
    });
  } catch (error) {
    console.error('Share journey error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/tracking/stop-sharing
// @desc    Stop sharing journey with contact
// @access  Private
router.post('/stop-sharing', [
  body('journeyId').isMongoId().withMessage('Valid journey ID is required'),
  body('contactId').isMongoId().withMessage('Valid contact ID is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { journeyId, contactId } = req.body;

    const journey = await Journey.findOne({
      _id: journeyId,
      userId: req.user._id
    });

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found'
      });
    }

    await journey.stopSharingWithContact(contactId);

    res.json({
      success: true,
      message: 'Journey sharing stopped successfully',
      data: {
        sharedWith: journey.sharedWith
      }
    });
  } catch (error) {
    console.error('Stop sharing error:', error);
    if (error.message === 'Contact not found in shared list') {
      return res.status(404).json({
        success: false,
        message: 'Contact not found in shared list'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/tracking/journey/:journeyId
// @desc    Get journey tracking data
// @access  Private
router.get('/journey/:journeyId', async (req, res) => {
  try {
    const { journeyId } = req.params;

    const journey = await Journey.findOne({
      _id: journeyId,
      userId: req.user._id
    });

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found'
      });
    }

    res.json({
      success: true,
      data: {
        journey
      }
    });
  } catch (error) {
    console.error('Get journey tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/tracking/active
// @desc    Get active journeys
// @access  Private
router.get('/active', async (req, res) => {
  try {
    const activeJourneys = await Journey.find({
      userId: req.user._id,
      status: 'active'
    }).select('_id startLocation endLocation startTime selectedRoute sharedWith');

    res.json({
      success: true,
      data: {
        activeJourneys
      }
    });
  } catch (error) {
    console.error('Get active journeys error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/tracking/history
// @desc    Get journey history
// @access  Private
router.get('/history', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { userId: req.user._id };
    if (status) {
      query.status = status;
    }

    const journeys = await Journey.find(query)
      .select('_id startLocation endLocation startTime endTime status selectedRoute')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Journey.countDocuments(query);

    res.json({
      success: true,
      data: {
        journeys,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get journey history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
