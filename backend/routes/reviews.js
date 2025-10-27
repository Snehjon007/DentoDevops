const express = require('express');
const router = express.Router();

// Sample reviews data (in production, this would come from database)
const reviews = [
  {
    id: 1,
    name: 'Sarah Johnson',
    rating: 5,
    comment: 'Excellent service! The staff was very professional and the treatment was painless.',
    service: 'Root Canal',
    date: '2024-01-15',
    verified: true
  },
  {
    id: 2,
    name: 'Mike Chen',
    rating: 5,
    comment: 'Best dental clinic in the area. Highly recommend for anyone looking for quality care.',
    service: 'Dental Cleaning',
    date: '2024-01-10',
    verified: true
  },
  {
    id: 3,
    name: 'Emily Davis',
    rating: 4,
    comment: 'Great experience overall. The dentist explained everything clearly.',
    service: 'Dental Implant',
    date: '2024-01-05',
    verified: true
  }
];

// @route   GET /api/reviews
// @desc    Get all reviews
// @access  Public
router.get('/', (req, res) => {
  res.json({ 
    message: 'Reviews retrieved successfully',
    reviews: reviews.filter(review => review.verified)
  });
});

// @route   POST /api/reviews
// @desc    Submit new review
// @access  Public
router.post('/', (req, res) => {
  const { name, email, rating, comment, service } = req.body;
  
  // TODO: Add validation
  // TODO: Save to database
  // TODO: Send notification to admin for approval
  
  const newReview = {
    id: reviews.length + 1,
    name,
    rating,
    comment,
    service,
    date: new Date().toISOString().split('T')[0],
    verified: false // Reviews need admin approval
  };
  
  res.json({ 
    message: 'Review submitted successfully. It will be published after approval.',
    review: newReview
  });
});

module.exports = router;