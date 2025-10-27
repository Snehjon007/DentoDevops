const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },
  patientEmail: {
    type: String,
    required: [true, 'Patient email is required'],
    trim: true,
    lowercase: true
  },
  patientPhone: {
    type: String,
    required: [true, 'Patient phone is required'],
    trim: true
  },
  service: {
    type: String,
    required: [true, 'Service is required'],
    trim: true
  },
  doctor: {
    type: String,
    required: [true, 'Doctor selection is required'],
    trim: true
  },
  date: {
    type: String,
    required: [true, 'Appointment date is required']
  },
  time: {
    type: String,
    required: [true, 'Appointment time is required']
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  acceptedBy: {
    type: String,
    trim: true
  },
  acceptedAt: {
    type: Date
  },
  // NEW FIELDS FOR PATIENT HISTORY
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  treatmentNotes: {
    type: String,
    default: ''
  },
  amountCharged: {
    type: Number,
    default: 0
  },
  consultationFee: {
    type: Number,
    default: 0
  },
  prescriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
appointmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update the updatedAt field before updating
appointmentSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);