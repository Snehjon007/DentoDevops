const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'DentoCare+ Backend API',
    version: '1.0.0',
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/prescriptions', require('./routes/prescriptions'));
app.use('/api/patient-visits', require('./routes/patientVisits'));
app.use('/api/dashboard', require('./routes/dashboard')); // ADDED DASHBOARD ROUTES

// Simple placeholder routes
app.post('/api/contact', (req, res) => {
  res.json({ success: true, message: 'Contact form would be processed here' });
});

app.get('/api/services', (req, res) => {
  res.json({ 
    success: true, 
    services: [
      { id: "wisdom-tooth-extraction", name: "Wisdom Tooth Extraction" },
      { id: "tooth-whitening", name: "Tooth Whitening" },
      { id: "dental-implants", name: "Dental Implants" },
      { id: "root-canal-treatment", name: "Root Canal Treatment" },
      { id: "orthodontic", name: "Orthodontic" },
      { id: "cosmetic-dentistry", name: "Cosmetic Dentistry" },
      { id: "pediatric-dentistry", name: "Pediatric Dentistry" },
      { id: "dental-fillings", name: "Dental Fillings" },
      { id: "bone-grafting", name: "Bone Grafting" },
      { id: "oral-pathology", name: "Oral Pathology" },
      { id: "sleep-apnea", name: "Sleep Apnea" },
      { id: "dental-crowns", name: "Dental Crowns" },
      { id: "tooth-extraction", name: "Tooth Extraction" },
      { id: "gum-disease-treatment", name: "Gum Disease Treatment" }
    ] 
  });
});

app.get('/api/reviews', (req, res) => {
  res.json({ 
    success: true, 
    reviews: [
      { id: 1, patientName: 'John Doe', rating: 5, comment: 'Great service!' }
    ] 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
  console.log(`🔐 Auth routes: http://localhost:${PORT}/api/auth`);
  console.log(`📅 Appointment routes: http://localhost:${PORT}/api/appointments`);
  console.log(`👨‍⚕️ Doctor routes: http://localhost:${PORT}/api/doctors`);
  console.log(`📄 Prescription routes: http://localhost:${PORT}/api/prescriptions`);
  console.log(`📊 Patient Visits routes: http://localhost:${PORT}/api/patient-visits`);
  console.log(`📈 Dashboard routes: http://localhost:${PORT}/api/dashboard`); // ADDED DASHBOARD LOG
});