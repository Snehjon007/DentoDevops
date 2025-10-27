const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const staffSchema = new mongoose.Schema({
  staffId: String,
  name: String,
  password: String,
  userType: String
});

const Staff = mongoose.model('Staff', staffSchema);

const seedStaff = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Add sample staff (you can change these credentials)
    const staffMembers = [
      {
        staffId: 'DOC001',
        name: 'Dr. Smith',
        password: await bcrypt.hash('doctor123', 12),
        userType: 'staff'
      },
      {
        staffId: 'DOC002', 
        name: 'Dr. Johnson',
        password: await bcrypt.hash('doctor456', 12),
        userType: 'staff'
      }
    ];

    await Staff.deleteMany({});
    await Staff.insertMany(staffMembers);
    
    console.log('✅ Staff data seeded successfully!');
    console.log('Staff ID: DOC001, Password: doctor123');
    console.log('Staff ID: DOC002, Password: doctor456');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding staff:', error);
  }
};

seedStaff();