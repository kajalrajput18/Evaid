const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: user.profile
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
  body('email').optional().isEmail().withMessage('Invalid email')
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

    const { name, phone, profilePicture } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (profilePicture) updateData.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.profile
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/user/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', [
  body('defaultTransportMode').optional().isIn(['driving', 'walking', 'transit']),
  body('safetyLevel').optional().isIn(['low', 'medium', 'high']),
  body('notifications.email').optional().isBoolean(),
  body('notifications.sms').optional().isBoolean(),
  body('notifications.push').optional().isBoolean()
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

    const { defaultTransportMode, safetyLevel, notifications } = req.body;
    const updateData = {};

    if (defaultTransportMode) updateData['preferences.defaultTransportMode'] = defaultTransportMode;
    if (safetyLevel) updateData['preferences.safetyLevel'] = safetyLevel;
    
    if (notifications) {
      if (notifications.email !== undefined) updateData['preferences.notifications.email'] = notifications.email;
      if (notifications.sms !== undefined) updateData['preferences.notifications.sms'] = notifications.sms;
      if (notifications.push !== undefined) updateData['preferences.notifications.push'] = notifications.push;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/user/contacts
// @desc    Get user's emergency contacts
// @access  Private
router.get('/contacts', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        contacts: user.emergencyContacts
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/user/contacts
// @desc    Add emergency contact
// @access  Private
router.post('/contacts', [
  body('name').notEmpty().withMessage('Contact name is required'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('relationship').optional().isIn(['family', 'friend', 'colleague', 'other'])
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

    const { name, phone, email, relationship } = req.body;

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if contact already exists
    const existingContact = user.emergencyContacts.find(contact => 
      contact.phone === phone
    );

    if (existingContact) {
      return res.status(400).json({
        success: false,
        message: 'Contact with this phone number already exists'
      });
    }

    await user.addEmergencyContact({
      name,
      phone,
      email,
      relationship: relationship || 'friend'
    });

    res.status(201).json({
      success: true,
      message: 'Emergency contact added successfully',
      data: {
        contacts: user.emergencyContacts
      }
    });
  } catch (error) {
    console.error('Add contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/user/contacts/:contactId
// @desc    Update emergency contact
// @access  Private
router.put('/contacts/:contactId', [
  body('name').optional().notEmpty().withMessage('Contact name cannot be empty'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('relationship').optional().isIn(['family', 'friend', 'colleague', 'other'])
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

    const { contactId } = req.params;
    const updateData = req.body;

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.updateEmergencyContact(contactId, updateData);

    res.json({
      success: true,
      message: 'Emergency contact updated successfully',
      data: {
        contacts: user.emergencyContacts
      }
    });
  } catch (error) {
    console.error('Update contact error:', error);
    if (error.message === 'Contact not found') {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/user/contacts/:contactId
// @desc    Delete emergency contact
// @access  Private
router.delete('/contacts/:contactId', async (req, res) => {
  try {
    const { contactId } = req.params;

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.removeEmergencyContact(contactId);

    res.json({
      success: true,
      message: 'Emergency contact deleted successfully',
      data: {
        contacts: user.emergencyContacts
      }
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/user/contacts/:contactId/primary
// @desc    Set primary emergency contact
// @access  Private
router.put('/contacts/:contactId/primary', async (req, res) => {
  try {
    const { contactId } = req.params;

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.setPrimaryContact(contactId);

    res.json({
      success: true,
      message: 'Primary contact updated successfully',
      data: {
        contacts: user.emergencyContacts
      }
    });
  } catch (error) {
    console.error('Set primary contact error:', error);
    if (error.message === 'Contact not found') {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
