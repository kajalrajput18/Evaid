const express = require('express');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Journey = require('../models/Journey');
const router = express.Router();

// Initialize Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Initialize email transporter
const emailTransporter = nodemailer.createTransport({  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// @route   POST /api/sos/alert
// @desc    Send SOS alert to emergency contacts
// @access  Private
router.post('/alert', [
  body('location.lat').isFloat().withMessage('Valid latitude is required'),
  body('location.lng').isFloat().withMessage('Valid longitude is required'),
  body('journeyId').optional().isMongoId().withMessage('Valid journey ID is required'),
  body('message').optional().isLength({ max: 500 }).withMessage('Message too long')
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

    const { location, journeyId, message } = req.body;

    // Get user and their emergency contacts
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.emergencyContacts || user.emergencyContacts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No emergency contacts found. Please add emergency contacts first.'
      });
    }

    // Generate Google Maps link for location
    const mapsLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
    
    // Prepare SOS message
    const sosMessage = message || 'I need help! This is an emergency.';
    const fullMessage = `${sosMessage}\n\nMy current location: ${mapsLink}\n\nSent from Evaid Safety App`;

    // Send alerts to all emergency contacts
    const notificationResults = [];
    
    for (const contact of user.emergencyContacts) {
      try {
        // Send SMS if phone number is available
        if (contact.phone && user.preferences.notifications.sms) {
          const smsResult = await sendSMS(contact.phone, fullMessage);
          notificationResults.push({
            contactId: contact._id,
            contactName: contact.name,
            method: 'SMS',
            success: smsResult.success,
            message: smsResult.message
          });
        }

        // Send email if email is available
        if (contact.email && user.preferences.notifications.email) {
          const emailResult = await sendEmail(contact.email, contact.name, user.name, fullMessage, mapsLink);
          notificationResults.push({
            contactId: contact._id,
            contactName: contact.name,
            method: 'Email',
            success: emailResult.success,
            message: emailResult.message
          });
        }
      } catch (error) {
        console.error(`Error sending alert to ${contact.name}:`, error);
        notificationResults.push({
          contactId: contact._id,
          contactName: contact.name,
          method: 'Unknown',
          success: false,
          message: 'Failed to send notification'
        });
      }
    }

    // Update journey with SOS alert if journeyId is provided
    if (journeyId) {
      try {
        const journey = await Journey.findOne({
          _id: journeyId,
          userId: req.user._id
        });

        if (journey) {
          const contactsNotified = user.emergencyContacts.map(contact => contact.phone).filter(Boolean);
          await journey.triggerSOS(location, contactsNotified);
        }
      } catch (error) {
        console.error('Error updating journey with SOS alert:', error);
      }
    }

    // Log SOS alert for monitoring
    console.log(`SOS Alert triggered by user ${user._id} at ${new Date().toISOString()}`);

    res.json({
      success: true,
      message: 'SOS alert sent successfully',
      data: {
        location,
        mapsLink,
        contactsNotified: user.emergencyContacts.length,
        notificationResults
      }
    });
  } catch (error) {
    console.error('SOS alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send SOS alert'
    });
  }
});

// @route   POST /api/sos/resolve
// @desc    Resolve SOS alert
// @access  Private
router.post('/resolve', [
  body('journeyId').isMongoId().withMessage('Valid journey ID is required')
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

    const { journeyId } = req.body;

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

    await journey.resolveSOS();

    res.json({
      success: true,
      message: 'SOS alert resolved successfully'
    });
  } catch (error) {
    console.error('Resolve SOS error:', error);
    if (error.message === 'No active SOS alert found') {
      return res.status(400).json({
        success: false,
        message: 'No active SOS alert found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/sos/history
// @desc    Get SOS alert history
// @access  Private
router.get('/history', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const journeys = await Journey.find({
      userId: req.user._id,
      'sosAlerts.0': { $exists: true }
    })
    .select('sosAlerts startLocation endLocation createdAt')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const sosHistory = journeys.flatMap(journey => 
      journey.sosAlerts.map(alert => ({
        id: alert._id,
        journeyId: journey._id,
        triggeredAt: alert.triggeredAt,
        location: alert.location,
        status: alert.status,
        contactsNotified: alert.contactsNotified,
        startLocation: journey.startLocation,
        endLocation: journey.endLocation
      }))
    );

    res.json({
      success: true,
      data: {
        sosHistory,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: sosHistory.length
        }
      }
    });
  } catch (error) {
    console.error('Get SOS history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Helper function to send SMS
async function sendSMS(phoneNumber, message) {
  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    return {
      success: true,
      message: 'SMS sent successfully',
      sid: result.sid
    };
  } catch (error) {
    console.error('SMS sending error:', error);
    return {
      success: false,
      message: 'Failed to send SMS'
    };
  }
}

// Helper function to send email
async function sendEmail(contactEmail, contactName, userName, message, mapsLink) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: contactEmail,
      subject: `🚨 SOS Alert from ${userName} - Evaid Safety App`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #dc3545; color: white; padding: 20px; text-align: center;">
            <h1>🚨 SOS ALERT</h1>
          </div>
          <div style="padding: 20px; background-color: #f8f9fa;">
            <h2>Emergency Alert from ${userName}</h2>
            <p><strong>Message:</strong> ${message}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <div style="margin: 20px 0;">
              <a href="${mapsLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                View Location on Google Maps
              </a>
            </div>
            <p style="color: #6c757d; font-size: 12px;">
              This alert was sent automatically from the Evaid Safety App.
            </p>
          </div>
        </div>
      `
    };

    const result = await emailTransporter.sendMail(mailOptions);
    
    return {
      success: true,
      message: 'Email sent successfully',
      messageId: result.messageId
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      message: 'Failed to send email'
    };
  }
}

module.exports = router;
