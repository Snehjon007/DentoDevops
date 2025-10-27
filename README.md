# DentoCare+ - Complete Dental Clinic Website

A modern, full-stack web application for a dental clinic featuring appointment booking, service management, customer reviews, and contact forms.

## 🏗️ Project Structure

```
dentocare-plus/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── assets/     # Images and static files
│   │   └── Nav_Bar/    # Navigation component
│   ├── public/         # Static assets
│   └── package.json    # Frontend dependencies
├── backend/            # Node.js/Express backend API
│   ├── routes/         # API routes
│   ├── models/         # Database models
│   ├── config/         # Configuration files
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Utility functions
│   └── server.js       # Main server file
└── README.md           # This file
```

## 🚀 Features

### Frontend (React)

- **Modern UI/UX**: Clean, professional design with smooth animations
- **Responsive Design**: Mobile-first approach, works on all devices
- **Multi-page Application**: Home, Services, About, Reviews, Contact pages
- **Service Showcase**: Detailed information about dental services
- **Appointment Booking**: Interactive booking system
- **Customer Reviews**: Display and submission of testimonials
- **Contact Forms**: Multiple ways to get in touch
- **Social Media Integration**: Links to social platforms

### Backend (Node.js/Express)

- **RESTful API**: Well-structured API endpoints
- **Appointment Management**: Handle booking requests
- **Contact Form Processing**: Store and manage inquiries
- **Service Management**: CRUD operations for services
- **Review System**: Manage customer feedback
- **Email Notifications**: Automated email confirmations
- **Database Integration**: MongoDB with Mongoose

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **CSS3** - Modern styling with flexbox/grid
- **ESLint** - Code quality and consistency

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Nodemailer** - Email sending
- **Express Validator** - Input validation

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Frontend Setup

1. Navigate to frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start development server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser

### Backend Setup

1. Navigate to backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:

   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration

5. Start development server:

   ```bash
   npm run dev
   ```

6. API will be available at `http://localhost:5000`

## 📝 API Endpoints

### Appointments

- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Contact

- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get contact submissions

### Services

- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID

### Reviews

- `GET /api/reviews` - Get approved reviews
- `POST /api/reviews` - Submit review

## 🚀 Development

### Frontend Development

- Components are modular and reusable
- Each component has its own CSS file
- Responsive design with mobile-first approach
- Images optimized for web performance

### Backend Development

- RESTful API design principles
- Proper error handling and validation
- Middleware for authentication and logging
- Database models with Mongoose schemas

## 🚀 Deployment

### Frontend Deployment

1. Build the project: `npm run build`
2. Deploy `dist` folder to:
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3

### Backend Deployment

1. Set up production environment
2. Configure database connection
3. Set up email service
4. Deploy to:
   - Heroku
   - AWS EC2
   - DigitalOcean
   - Railway

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Developed by the DentoCare+ development team.

---

**DentoCare+** - Refined Care, Radiant Smiles ✨
