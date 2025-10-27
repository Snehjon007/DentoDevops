const express = require('express');
const router = express.Router();

// Static doctors data (in production, this would come from database)
const doctors = [
  { 
    id: "dr-michael-smith", 
    name: "Dr. Michael Smith", 
    specialization: "General Dentistry",
    experience: "15+ years",
    available: true
  },
  { 
    id: "dr-emily-davis", 
    name: "Dr. Emily Davis", 
    specialization: "Orthodontics",
    experience: "12+ years",
    available: true
  },
  { 
    id: "dr-sarah-kim", 
    name: "Dr. Sarah Kim", 
    specialization: "Oral Surgery",
    experience: "10+ years",
    available: true
  }
];

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Doctors retrieved successfully',
    doctors 
  });
});

// @route   GET /api/doctors/:id
// @desc    Get doctor by ID
// @access  Public
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const doctor = doctors.find(d => d.id === id);
  
  if (!doctor) {
    return res.status(404).json({ 
      success: false,
      message: 'Doctor not found' 
    });
  }
  
  res.json({ 
    success: true,
    message: 'Doctor retrieved successfully',
    doctor 
  });
});

module.exports = router;