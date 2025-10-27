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

async function migrateExistingAppointments() {
  try {
    console.log('🔄 Starting appointment migration for Patient History...');

    // Check current appointment statistics
    const statsBefore = await Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('\n📊 Appointment Status Before Migration:');
    statsBefore.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} appointments`);
    });

    // Strategy: Mark past confirmed appointments as completed
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    
    console.log(`\n📅 Today's date: ${today}`);
    console.log('🔄 Migrating past confirmed appointments to completed status...');

    // Find appointments before today with confirmed status
    const result = await Appointment.updateMany(
      { 
        date: { $lt: today }, // appointments before today
        status: 'confirmed' // only confirmed appointments
      },
      { 
        $set: { 
          status: 'completed',
          isCompleted: true,
          completedAt: new Date(),
          treatmentNotes: 'Automatically migrated from past confirmed appointment',
          amountCharged: 0
        } 
      }
    );

    console.log(`\n✅ SUCCESS: Migrated ${result.modifiedCount} appointments to completed status`);

    // Show final statistics
    const statsAfter = await Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('\n📊 Appointment Status After Migration:');
    statsAfter.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} appointments`);
    });

    const completedCount = await Appointment.countDocuments({ isCompleted: true });
    console.log(`\n🎯 Total appointments in patient history: ${completedCount}`);

    // Show sample of migrated appointments
    const sampleMigrated = await Appointment.find({ isCompleted: true })
      .sort({ completedAt: -1 })
      .limit(5);
    
    console.log('\n📋 Sample of migrated appointments in patient history:');
    sampleMigrated.forEach(apt => {
      console.log(`   - ${apt.patientName} | ${apt.date} | ${apt.service} | ${apt.doctor}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

// Run migration
migrateExistingAppointments();