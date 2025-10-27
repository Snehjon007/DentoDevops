const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  patientId: {
    type: String,
    required: false // Made optional
  },
  doctorId: {
    type: String,
    required: true
  },
  prescriptionData: {
    patientName: String,
    age: Number,
    sex: String,
    diagnosis: String,
    doctorName: String,
    medicine1: String,
    medicine2: String,
    medicine3: String,
    medicine4: String,
    medicine5: String,
    nextVisit: Date
  },
  invoiceData: {
    invoiceId: String,
    date: String,
    patientName: String,
    age: Number,
    email: String,
    mobile: String,
    sex: String,
    doctorName: String,
    services: [{
      service: String,
      price: Number
    }],
    subtotal: Number,
    discount: Number,
    grandTotal: Number
  },
  pdfPath: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['sent', 'pending'],
    default: 'sent'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);