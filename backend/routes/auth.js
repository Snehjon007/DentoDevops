const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Patient User Schema
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String },
  userType: { type: String, default: 'patient' },
  createdAt: { type: Date, default: Date.now }
});

// Staff User Schema  
const staffSchema = new mongoose.Schema({
  staffId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  userType: { type: String, default: 'staff' },
  createdAt: { type: Date, default: Date.now }
});

// Create Models
const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema);
const Staff = mongoose.models.Staff || mongoose.model('Staff', staffSchema);

// ==================== PATIENT REGISTER ====================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Name, email and password are required' 
      });
    }
    
    // Check if patient already exists
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is already registered' 
      });
    }
    
    // Hash password and create patient
    const hashedPassword = await bcrypt.hash(password, 12);
    const newPatient = new Patient({
      name,
      email,
      password: hashedPassword
    });
    
    await newPatient.save();
    
    res.status(201).json({ 
      success: true,
      message: 'Account created successfully! Please login.' 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Registration failed. Please try again.' 
    });
  }
});

// ==================== PATIENT LOGIN ====================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }
    
    // Find patient
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, patient.password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }
    
    res.status(200).json({ 
      success: true,
      message: 'Login successful',
      user: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        userType: 'patient'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Login failed. Please try again.' 
    });
  }
});

// ==================== STAFF LOGIN ====================
router.post('/staff-login', async (req, res) => {
  try {
    const { staffId, password } = req.body;
    
    if (!staffId || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Staff ID and password are required' 
      });
    }
    
    // Find staff
    const staff = await Staff.findOne({ staffId });
    if (!staff) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid Staff ID or password' 
      });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, staff.password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid Staff ID or password' 
      });
    }
    
    res.status(200).json({ 
      success: true,
      message: 'Staff login successful',
      user: {
        id: staff._id,
        staffId: staff.staffId,
        name: staff.name,
        userType: 'staff'
      }
    });
  } catch (error) {
    console.error('Staff login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Staff login failed. Please try again.' 
    });
  }
});

module.exports = router;