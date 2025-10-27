const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

// SIMPLE PATIENT VISITS - Just get completed appointments with invoice amounts
router.get('/', async (req, res) => {
  try {
    console.log('📥 Fetching patient visits...');
    
    // Get completed appointments
    const appointments = await Appointment.find({ status: 'completed' }).sort({ date: -1 });
    console.log(`✅ Found ${appointments.length} completed appointments`);

    // Get prescriptions for invoice amounts
    const appointmentIds = appointments.map(apt => apt._id);
    const prescriptions = await Prescription.find({ appointmentId: { $in: appointmentIds } });
    
    // Create prescription map
    const prescriptionMap = {};
    prescriptions.forEach(prescription => {
      if (prescription.appointmentId) {
        prescriptionMap[prescription.appointmentId.toString()] = prescription;
      }
    });

    // SIMPLE: Transform data with invoice amounts
    const visits = appointments.map(appointment => {
      const prescription = prescriptionMap[appointment._id.toString()];
      let amount = 0;

      if (prescription && prescription.invoiceData) {
        amount = prescription.invoiceData.grandTotal || 
                prescription.invoiceData.totalAmount ||
                prescription.invoiceData.amount ||
                0;
      }

      return {
        _id: appointment._id,
        patientName: appointment.patientName,
        patientEmail: appointment.patientEmail,
        service: appointment.service,
        date: appointment.date,
        time: appointment.time,
        doctor: appointment.doctor,
        amountCharged: amount
      };
    });

    console.log(`✅ Returning ${visits.length} patient visits`);
    res.json({ success: true, visits, count: visits.length });

  } catch (error) {
    console.error('❌ Error fetching patient visits:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;