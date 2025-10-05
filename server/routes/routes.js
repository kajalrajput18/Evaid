const express = require('express');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const Journey = require('../models/Journey');
const SafetyPin = require('../models/SafetyPin');
const router = express.Router();

// Safety algorithm configuration
const SAFETY_RULES = {
  highwayWeight: 0.8,      // Highways are safer
  mainRoadWeight: 0.6,     // Main roads are moderately safe
  residentialWeight: 0.4,  // Residential areas are less safe
  alleyWeight: 0.1,        // Alleys are least safe
  wellLitWeight: 0.3,      // Well-lit areas get bonus
  crowdedWeight: 0.2,      // Crowded areas get bonus
  isolatedWeight: -0.3     // Isolated areas get penalty
};

// @route   POST /api/routes/calculate
// @desc    Calculate fastest and safest routes
// @access  Private
router.post('/calculate', [
  body('startLocation.lat').isFloat().withMessage('Valid start latitude is required'),
  body('startLocation.lng').isFloat().withMessage('Valid start longitude is required'),
  body('endLocation.lat').isFloat().withMessage('Valid end latitude is required'),
  body('endLocation.lng').isFloat().withMessage('Valid end longitude is required'),
  body('transportMode').optional().isIn(['driving', 'walking', 'transit'])
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

    const { startLocation, endLocation, transportMode = 'driving' } = req.body;

    // Get fastest route from Google Maps
    const fastestRoute = await getFastestRoute(startLocation, endLocation, transportMode);
    
    // Generate safest route using rule-based algorithm
    const safestRoute = await generateSafestRoute(startLocation, endLocation, transportMode);

    // Create journey record
    const journey = new Journey({
      userId: req.user._id,
      startLocation,
      endLocation,
      routes: [fastestRoute, safestRoute],
      selectedRoute: 'fastest'
    });

    await journey.save();

    res.json({
      success: true,
      message: 'Routes calculated successfully',
      data: {
        journeyId: journey._id,
        routes: {
          fastest: fastestRoute,
          safest: safestRoute
        }
      }
    });
  } catch (error) {
    console.error('Route calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating routes'
    });
  }
});

// @route   GET /api/routes/journey/:journeyId
// @desc    Get journey details
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
    console.error('Get journey error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/routes/journey/:journeyId/select-route
// @desc    Select route for journey
// @access  Private
router.put('/journey/:journeyId/select-route', [
  body('routeType').isIn(['fastest', 'safest']).withMessage('Valid route type is required')
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

    const { journeyId } = req.params;
    const { routeType } = req.body;

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

    journey.selectedRoute = routeType;
    await journey.save();

    res.json({
      success: true,
      message: 'Route selected successfully',
      data: {
        journey
      }
    });
  } catch (error) {
    console.error('Select route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/routes/safety-pins
// @desc    Get safety pins in area
// @access  Private
router.get('/safety-pins', [
  body('location.lat').isFloat().withMessage('Valid latitude is required'),
  body('location.lng').isFloat().withMessage('Valid longitude is required'),
  body('radius').optional().isInt({ min: 100, max: 5000 }).withMessage('Radius must be between 100 and 5000 meters')
], async (req, res) => {
  try {
    const { lat, lng, radius = 1000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Location coordinates are required'
      });
    }

    const location = { lat: parseFloat(lat), lng: parseFloat(lng) };
    const safetyPins = await SafetyPin.findNearby(location, parseInt(radius));

    res.json({
      success: true,
      data: {
        safetyPins
      }
    });
  } catch (error) {
    console.error('Get safety pins error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/routes/safety-pins
// @desc    Add safety pin
// @access  Private
router.post('/safety-pins', [
  body('location.lat').isFloat().withMessage('Valid latitude is required'),
  body('location.lng').isFloat().withMessage('Valid longitude is required'),
  body('type').isIn(['safe', 'unsafe', 'well-lit', 'dark', 'crowded', 'isolated', 'emergency']).withMessage('Valid safety type is required'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description too long'),
  body('severity').optional().isIn(['low', 'medium', 'high'])
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

    const { location, type, description, severity = 'medium' } = req.body;

    const safetyPin = new SafetyPin({
      userId: req.user._id,
      location,
      type,
      description,
      severity
    });

    await safetyPin.save();

    res.status(201).json({
      success: true,
      message: 'Safety pin added successfully',
      data: {
        safetyPin
      }
    });
  } catch (error) {
    console.error('Add safety pin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Helper function to get fastest route from Google Maps
async function getFastestRoute(startLocation, endLocation, transportMode) {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin: `${startLocation.lat},${startLocation.lng}`,
        destination: `${endLocation.lat},${endLocation.lng}`,
        mode: transportMode,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status !== 'OK') {
      throw new Error('Google Maps API error: ' + response.data.status);
    }

    const route = response.data.routes[0];
    const leg = route.legs[0];

    return {
      type: 'fastest',
      distance: leg.distance.value,
      duration: leg.duration.value,
      polyline: route.overview_polyline.points,
      waypoints: route.overview_path,
      safetyScore: 50, // Default safety score
      instructions: leg.steps.map(step => ({
        instruction: step.html_instructions,
        distance: step.distance.value,
        duration: step.duration.value
      }))
    };
  } catch (error) {
    console.error('Google Maps API error:', error);
    throw new Error('Failed to get fastest route');
  }
}

// Helper function to generate safest route using rule-based algorithm
async function generateSafestRoute(startLocation, endLocation, transportMode) {
  try {
    // Get multiple route options from Google Maps
    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin: `${startLocation.lat},${startLocation.lng}`,
        destination: `${endLocation.lat},${endLocation.lng}`,
        mode: transportMode,
        alternatives: true,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status !== 'OK') {
      throw new Error('Google Maps API error: ' + response.data.status);
    }

    const routes = response.data.routes;
    let safestRoute = null;
    let highestSafetyScore = 0;

    // Evaluate each route for safety
    for (const route of routes) {
      const safetyScore = await calculateRouteSafetyScore(route, startLocation, endLocation);
      
      if (safetyScore > highestSafetyScore) {
        highestSafetyScore = safetyScore;
        safestRoute = route;
      }
    }

    if (!safestRoute) {
      // Fallback to first route if no safe route found
      safestRoute = routes[0];
      highestSafetyScore = 50;
    }

    const leg = safestRoute.legs[0];

    return {
      type: 'safest',
      distance: leg.distance.value,
      duration: leg.duration.value,
      polyline: safestRoute.overview_polyline.points,
      waypoints: safestRoute.overview_path,
      safetyScore: highestSafetyScore,
      instructions: leg.steps.map(step => ({
        instruction: step.html_instructions,
        distance: step.distance.value,
        duration: step.duration.value
      }))
    };
  } catch (error) {
    console.error('Safest route generation error:', error);
    throw new Error('Failed to generate safest route');
  }
}

// Helper function to calculate safety score for a route
async function calculateRouteSafetyScore(route, startLocation, endLocation) {
  let safetyScore = 50; // Base score

  try {
    // Get safety pins along the route
    const safetyPins = await SafetyPin.findNearby(
      { lat: (startLocation.lat + endLocation.lat) / 2, lng: (startLocation.lng + endLocation.lng) / 2 },
      2000
    );

    // Analyze route steps for safety factors
    for (const step of route.legs[0].steps) {
      const instruction = step.html_instructions.toLowerCase();
      
      // Highway bonus
      if (instruction.includes('highway') || instruction.includes('freeway')) {
        safetyScore += SAFETY_RULES.highwayWeight * 10;
      }
      
      // Main road bonus
      if (instruction.includes('main') || instruction.includes('boulevard') || instruction.includes('avenue')) {
        safetyScore += SAFETY_RULES.mainRoadWeight * 5;
      }
      
      // Residential penalty
      if (instruction.includes('residential') || instruction.includes('neighborhood')) {
        safetyScore += SAFETY_RULES.residentialWeight * 5;
      }
      
      // Alley penalty
      if (instruction.includes('alley') || instruction.includes('backstreet')) {
        safetyScore += SAFETY_RULES.alleyWeight * 10;
      }
    }

    // Factor in safety pins
    for (const pin of safetyPins) {
      switch (pin.type) {
        case 'safe':
          safetyScore += 5;
          break;
        case 'well-lit':
          safetyScore += 3;
          break;
        case 'crowded':
          safetyScore += 2;
          break;
        case 'dark':
          safetyScore -= 3;
          break;
        case 'isolated':
          safetyScore -= 5;
          break;
        case 'unsafe':
          safetyScore -= 10;
          break;
      }
    }

    // Normalize score between 0 and 100
    safetyScore = Math.max(0, Math.min(100, safetyScore));

  } catch (error) {
    console.error('Safety score calculation error:', error);
    // Return base score if calculation fails
    safetyScore = 50;
  }

  return safetyScore;
}

module.exports = router;
