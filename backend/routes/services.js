const express = require('express');
const router = express.Router();

// Sample services data (in production, this would come from database)
const services = [
  {
    id: 'oral-pathology',
    name: 'Oral Pathology',
    description: 'Comprehensive diagnosis and treatment of oral diseases and conditions.',
    price: 'Starting from ₹2,000',
    duration: '45-60 minutes',
    category: 'Diagnostic'
  },
  {
    id: 'anesthesia',
    name: 'Anesthesia Services',
    description: 'Safe and comfortable anesthesia for all dental procedures.',
    price: 'Starting from ₹500',
    duration: '15-30 minutes',
    category: 'Support'
  },
  {
    id: 'bone-grafting',
    name: 'Bone Grafting',
    description: 'Advanced bone grafting procedures for dental implant preparation.',
    price: 'Starting from ₹15,000',
    duration: '90-120 minutes',
    category: 'Surgical'
  },
  {
    id: 'tooth-extraction',
    name: 'Tooth Extraction',
    description: 'Safe and painless tooth extraction procedures.',
    price: 'Starting from ₹1,500',
    duration: '30-45 minutes',
    category: 'Surgical'
  }
];

// @route   GET /api/services
// @desc    Get all services
// @access  Public
router.get('/', (req, res) => {
  res.json({ 
    message: 'Services retrieved successfully',
    services 
  });
});

// @route   GET /api/services/:id
// @desc    Get service by ID
// @access  Public
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const service = services.find(s => s.id === id);
  
  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }
  
  res.json({ 
    message: 'Service retrieved successfully',
    service 
  });
});

module.exports = router;