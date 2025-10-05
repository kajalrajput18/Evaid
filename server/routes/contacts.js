const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

// @route   GET /api/contacts
// @desc    Get user's emergency contacts
// @access  Private
router.get('/', async (req, res) => {
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

// @route   POST /api/contacts
// @desc    Add emergency contact
// @access  Private
router.post('/', [
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

// @route   PUT /api/contacts/:contactId
// @desc    Update emergency contact
// @access  Private
router.put('/:contactId', [
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

// @route   DELETE /api/contacts/:contactId
// @desc    Delete emergency contact
// @access  Private
router.delete('/:contactId', async (req, res) => {
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

// @route   PUT /api/contacts/:contactId/primary
// @desc    Set primary emergency contact
// @access  Private
router.put('/:contactId/primary', async (req, res) => {
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

// @route   GET /api/contacts/primary
// @desc    Get primary emergency contact
// @access  Private
router.get('/primary', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const primaryContact = user.getPrimaryContact();

    res.json({
      success: true,
      data: {
        contact: primaryContact
      }
    });
  } catch (error) {
    console.error('Get primary contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
