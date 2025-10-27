const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected for Migration'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const Appointment = require('../models/Appointment');

async function migrateAppointments() {
  try {
    console.log('🔄 Starting appointment migration...');

    // Check if appointments collection exists and has documents
    const existingAppointments = await Appointment.find({});
    console.log(`📊 Found ${existingAppointments.length} existing appointments`);

    // Update appointments that don't have a status field
    const appointmentsWithoutStatus = await Appointment.find({ 
      $or: [
        { status: { $exists: false } },
        { status: null },
        { status: '' }
      ]
    });

    console.log(`🔧 Found ${appointmentsWithoutStatus.length} appointments without status`);

    if (appointmentsWithoutStatus.length > 0) {
      // Set default status to 'confirmed' for existing appointments
      const updateResult = await Appointment.updateMany(
        { 
          $or: [
            { status: { $exists: false } },
            { status: null },
            { status: '' }
          ]
        },
        { 
          $set: { 
            status: 'confirmed',
            updatedAt: new Date()
          }
        }
      );

      console.log(`✅ Updated ${updateResult.modifiedCount} appointments with default status 'confirmed'`);
    }

    // Add some sample data if collection is empty
    if (existingAppointments.length === 0) {
      console.log('📝 Adding sample appointment data...');
      
      const sampleAppointments = [
        {
          patientName: 'Sarah Johnson',
          patientEmail: 'sarah.johnson@example.com',
          patientPhone: '+1 (555) 123-4567',
          service: 'dental-cleaning',
          doctor: 'dr-michael-smith',
          date: '2024-11-15',
          time: '10:00 AM',
          notes: 'Regular cleaning appointment',
          status: 'confirmed'
        },
        {
          patientName: 'James Wilson',
          patientEmail: 'james.wilson@example.com',
          patientPhone: '+1 (555) 234-5678',
          service: 'root-canal-treatment',
          doctor: 'dr-emily-davis',
          date: '2024-10-08',
          time: '2:30 PM',
          notes: 'Root canal follow-up',
          status: 'confirmed'
        },
        {
          patientName: 'Maria Garcia',
          patientEmail: 'maria.garcia@example.com',
          patientPhone: '+1 (555) 345-6789',
          service: 'dental-fillings',
          doctor: 'dr-sarah-kim',
          date: '2024-12-20',
          time: '9:15 AM',
          notes: 'Dental filling consultation',
          status: 'pending'
        },
        {
          patientName: 'Robert Chen',
          patientEmail: 'robert.chen@example.com',
          patientPhone: '+1 (555) 456-7890',
          service: 'tooth-whitening',
          doctor: 'dr-michael-smith',
          date: '2025-01-05',
          time: '3:00 PM',
          notes: 'Teeth whitening session',
          status: 'pending'
        }
      ];

      await Appointment.insertMany(sampleAppointments);
      console.log(`✅ Added ${sampleAppointments.length} sample appointments`);
    }

    // Display final statistics
    const finalStats = await Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('\n📈 Final Appointment Statistics:');
    finalStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} appointments`);
    });

    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run migration
migrateAppointments();