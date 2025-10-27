const mongoose = require('mongoose');

const patientVisitSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  patientEmail: {
    type: String,
    required: true
  },
  patientPhone: {
    type: String,
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  serviceProvided: {
    type: String,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  dateVisited: {
    type: Date,
    required: true
  },
  doctorAttended: {
    type: String,
    required: true
  },
  diagnosis: {
    type: String,
    default: ''
  },
  prescriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  },
  invoiceId: {
    type: String,
    default: ''
  },
  amountCharged: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['completed', 'cancelled', 'no-show'],
    default: 'completed'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PatientVisit', patientVisitSchema);