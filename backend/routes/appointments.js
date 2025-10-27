const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const nodemailer = require('nodemailer');

// Configure nodemailer
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Appointment Confirmation Email Function
async function sendAppointmentConfirmation(appointment, confirmationNotes = '') {
  try {
    console.log('=== SENDING APPOINTMENT CONFIRMATION EMAIL ===');
    console.log('To:', appointment.patientEmail);
    console.log('Patient:', appointment.patientName);
    console.log('Confirmation Notes:', confirmationNotes);

    if (!appointment.patientEmail) {
      console.log('❌ No email provided, skipping appointment confirmation email');
      return false;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: appointment.patientEmail,
      subject: `Appointment Confirmed - DentoCare+`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background: #007bff; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
                .section { margin-bottom: 20px; padding: 15px; border-left: 4px solid #007bff; background: #f8f9fa; }
                .appointment-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
                .confirmation-notes { background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #007bff; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>DentoCare+</h1>
                <p>Your Dental Health Partner</p>
            </div>
            
            <div class="content">
                <h2>Dear ${appointment.patientName},</h2>
                
                <div class="section">
                    <h3>✅ Appointment Confirmed!</h3>
                    <p>Your appointment request has been accepted. Here are your appointment details:</p>
                </div>

                <div class="appointment-details">
                    <h3>📅 Appointment Details</h3>
                    <p><strong>Date:</strong> ${appointment.date}</p>
                    <p><strong>Time:</strong> ${appointment.time}</p>
                    <p><strong>Doctor:</strong> ${appointment.doctor}</p>
                    <p><strong>Service:</strong> ${appointment.service}</p>
                </div>

                ${confirmationNotes ? `
                <div class="confirmation-notes">
                    <h3>📋 Important Information from Clinic</h3>
                    <p>${confirmationNotes}</p>
                </div>
                ` : ''}

                <div class="section">
                    <h3>📍 Clinic Address</h3>
                    <p>DentoCare+ Dental Clinic</p>
                    <p>123 Dental Street, Healthcare District</p>
                    <p>City, State - 123456</p>
                </div>

                <p>We look forward to seeing you and taking care of your dental health!</p>
            </div>
            
            <div class="footer">
                <p><strong>Contact Us:</strong> 📞 9607870953 | 📧 dentocareplus@gmail.com</p>
                <p>© 2024 DentoCare+. All rights reserved.</p>
                <p>This is an automated email, please do not reply.</p>
            </div>
        </body>
        </html>
      `
    };

    // Send email
    const info = await emailTransporter.sendMail(mailOptions);
    console.log('✅ Appointment confirmation email sent successfully to:', appointment.patientEmail);
    console.log('Message ID:', info.messageId);
    
    return true;
  } catch (error) {
    console.error('❌ Error sending appointment confirmation email:', error);
    return false;
  }
}

// Available time slots (in production, this could be dynamic based on doctor availability)
const availableTimeSlots = [
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', 
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
  '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'
];

// @route   GET /api/appointments
// @desc    Get appointments with optional status filtering
// @access  Private (Admin only in production)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    
    // Build query based on status filter
    let query = {};
    if (status) {
      query.status = status;
    }
    
    // Fetch appointments from database
    const appointments = await Appointment.find(query)
      .sort({ createdAt: -1 }) // Most recent first
      .lean(); // Return plain JavaScript objects for better performance
    
    res.json({ 
      success: true,
      message: 'Appointments retrieved successfully',
      count: appointments.length,
      appointments 
    });
    
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error retrieving appointments',
      error: error.message 
    });
  }
});

// @route   GET /api/appointments/slots
// @desc    Get available time slots for a specific date
// @access  Public
router.get('/slots', async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ 
        success: false,
        message: 'Date parameter is required' 
      });
    }
    
    // Check database for booked slots on the given date
    const bookedAppointments = await Appointment.find({ 
      date: date,
      status: { $in: ['pending', 'confirmed'] } // Don't count cancelled appointments
    }).select('time');
    
    const bookedSlots = bookedAppointments.map(appointment => appointment.time);
    const availableSlots = availableTimeSlots.filter(slot => !bookedSlots.includes(slot));
    
    res.json({ 
      success: true,
      message: 'Available slots retrieved successfully',
      date,
      totalSlots: availableTimeSlots.length,
      bookedSlots: bookedSlots.length,
      availableSlots
    });
    
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error retrieving available slots',
      error: error.message 
    });
  }
});

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { 
      patientName, 
      patientEmail, 
      patientPhone, 
      service,
      doctor,
      date, 
      time, 
      notes 
    } = req.body;
    
    // Validation
    if (!patientName || !patientEmail || !patientPhone || !service || !doctor || !date || !time) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields: patientName, patientEmail, patientPhone, service, doctor, date, time' 
      });
    }
    
    // Check if the slot is available
    const existingAppointment = await Appointment.findOne({ 
      date: date, 
      time: time,
      status: { $in: ['pending', 'confirmed'] }
    });
    
    if (existingAppointment) {
      return res.status(400).json({ 
        success: false,
        message: 'This time slot is no longer available. Please select another time.'
      });
    }
    
    // Create new appointment with 'pending' status
    const newAppointment = new Appointment({
      patientName,
      patientEmail,
      patientPhone,
      service,
      doctor,
      date,
      time,
      notes: notes || '',
      status: 'pending' // All new appointments start as pending
    });
    
    // Save to database
    const savedAppointment = await newAppointment.save();
    
    // TODO: Send confirmation email to patient
    // TODO: Send notification to admin
    
    res.status(201).json({ 
      success: true,
      message: 'Appointment booked successfully. You will receive a confirmation email shortly.',
      appointment: savedAppointment
    });
    
  } catch (error) {
    console.error('Error creating appointment:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: 'Validation error',
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Error creating appointment',
      error: error.message 
    });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
// @access  Private (Admin or appointment owner in production)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return res.status(404).json({ 
        success: false,
        message: 'Appointment not found' 
      });
    }
    
    res.json({ 
      success: true,
      message: 'Appointment retrieved successfully',
      appointment 
    });
    
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error retrieving appointment',
      error: error.message 
    });
  }
});

// @route   PUT /api/appointments/:id/accept
// @desc    Accept appointment and send confirmation email
// @access  Private (Staff only)
router.put('/:id/accept', async (req, res) => {
  try {
    const { id } = req.params;
    const { acceptedBy, notes } = req.body;

    console.log('=== ACCEPT APPOINTMENT REQUEST ===');
    console.log('Appointment ID:', id);
    console.log('Request body:', req.body);

    // Get the current appointment first to preserve original notes
    const currentAppointment = await Appointment.findById(id);
    if (!currentAppointment) {
      console.log('❌ Appointment not found for ID:', id);
      return res.status(404).json({ 
        success: false, 
        message: 'Appointment not found' 
      });
    }

    console.log('Original appointment notes (from patient):', currentAppointment.notes);
    console.log('Confirmation notes (to send to patient):', notes);

    // Update appointment - only store the original patient notes
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      {
        status: 'confirmed',
        acceptedBy: acceptedBy || 'Staff Member',
        acceptedAt: new Date(),
        // Keep only the original notes from patient
        notes: currentAppointment.notes
      },
      { new: true }
    );

    if (!appointment) {
      console.log('❌ Appointment not found for ID:', id);
      return res.status(404).json({ 
        success: false, 
        message: 'Appointment not found' 
      });
    }

    console.log('✅ Appointment updated successfully:', appointment._id);
    console.log('Stored notes (patient notes for doctor):', appointment.notes);

    // Send confirmation email immediately - pass the confirmation notes to email but don't store them
    console.log('Attempting to send confirmation email to:', appointment.patientEmail);
    const emailSent = await sendAppointmentConfirmation(appointment, notes || '');
    console.log('Email sent status:', emailSent);

    res.json({
      success: true,
      message: 'Appointment accepted successfully',
      emailSent: emailSent,
      appointment: appointment
    });

  } catch (error) {
    console.error('❌ Error accepting appointment:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   PUT /api/appointments/:id/complete
// @desc    Mark appointment as completed and add to patient history
// @access  Private (Staff only)
router.put('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { treatmentNotes, amountCharged } = req.body;

    console.log('=== COMPLETING APPOINTMENT ===');
    console.log('Appointment ID:', id);
    console.log('Treatment Notes:', treatmentNotes);
    console.log('Amount Charged:', amountCharged);

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      {
        status: 'completed',
        isCompleted: true,
        completedAt: new Date(),
        treatmentNotes: treatmentNotes || '',
        amountCharged: amountCharged || 0
      },
      { new: true }
    );

    if (!appointment) {
      console.log('❌ Appointment not found for ID:', id);
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    console.log('✅ Appointment marked as completed:', appointment._id);

    res.json({
      success: true,
      message: 'Appointment completed successfully',
      appointment: appointment
    });

  } catch (error) {
    console.error('❌ Error completing appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/appointments/:id/link-prescription
// @desc    Link prescription to appointment and auto-complete
// @access  Private (Staff only)
router.put('/:id/link-prescription', async (req, res) => {
  try {
    const { id } = req.params;
    const { prescriptionId } = req.body;

    console.log('=== LINKING PRESCRIPTION TO APPOINTMENT ===');
    console.log('Appointment ID:', id);
    console.log('Prescription ID:', prescriptionId);

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      {
        prescriptionId: prescriptionId,
        status: 'completed',
        isCompleted: true,
        completedAt: new Date()
      },
      { new: true }
    );

    if (!appointment) {
      console.log('❌ Appointment not found for ID:', id);
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    console.log('✅ Prescription linked and appointment completed:', appointment._id);

    res.json({
      success: true,
      message: 'Prescription linked and appointment completed successfully',
      appointment: appointment
    });

  } catch (error) {
    console.error('❌ Error linking prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PATCH /api/appointments/:id
// @desc    Update appointment (status, etc.)
// @access  Private (Admin only in production)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Find and update the appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, // Return the updated document
        runValidators: true // Run schema validation
      }
    );
    
    if (!updatedAppointment) {
      return res.status(404).json({ 
        success: false,
        message: 'Appointment not found' 
      });
    }
    
    // TODO: Send notification to patient about status change
    
    res.json({ 
      success: true,
      message: 'Appointment updated successfully',
      appointment: updatedAppointment
    });
    
  } catch (error) {
    console.error('Error updating appointment:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: 'Validation error',
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Error updating appointment',
      error: error.message 
    });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment (soft delete)
// @access  Private (Admin or appointment owner in production)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Soft delete: Update status to cancelled instead of removing
    const cancelledAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    );
    
    if (!cancelledAppointment) {
      return res.status(404).json({ 
        success: false,
        message: 'Appointment not found' 
      });
    }
    
    // TODO: Send cancellation notification
    
    res.json({ 
      success: true,
      message: 'Appointment cancelled successfully',
      appointment: cancelledAppointment
    });
    
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error cancelling appointment',
      error: error.message 
    });
  }
});

module.exports = router;