const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

// SIMPLE REVENUE STATS - Only from completed appointments with invoices
router.get('/revenue-stats', async (req, res) => {
  try {
    console.log('💰 Calculating SIMPLE revenue stats from invoices...');
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Get start of current week (Monday)
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Monday start
    startOfWeek.setDate(today.getDate() - diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Get end of current week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    // Get start of current month
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);

    // Get ALL prescriptions with invoice amounts
    const allPrescriptions = await Prescription.find({});
    console.log(`📄 Found ${allPrescriptions.length} prescriptions`);

    // Get ALL appointments to get proper dates
    const allAppointments = await Appointment.find({});
    
    // Create maps for easy lookup
    const prescriptionMap = {};
    const appointmentMap = {};
    
    allPrescriptions.forEach(prescription => {
      if (prescription.appointmentId) {
        prescriptionMap[prescription.appointmentId.toString()] = prescription;
      }
    });
    
    allAppointments.forEach(appointment => {
      appointmentMap[appointment._id.toString()] = appointment;
    });

    let totalRevenue = 0;
    let todayRevenue = 0;
    let weekRevenue = 0;
    let monthRevenue = 0;

    // SIMPLE: Use APPOINTMENT dates for filtering, but prescription amounts
    // ONLY COUNT COMPLETED APPOINTMENTS for revenue
    allAppointments.forEach(appointment => {
      // Only count completed appointments for revenue
      if (appointment.status === 'completed') {
        const prescription = prescriptionMap[appointment._id.toString()];
        
        if (prescription && prescription.invoiceData) {
          const amount = prescription.invoiceData.grandTotal || 
                        prescription.invoiceData.totalAmount ||
                        prescription.invoiceData.amount ||
                        0;

          // Use APPOINTMENT date for filtering (not prescription date)
          const appointmentDate = new Date(appointment.date);
          appointmentDate.setHours(0, 0, 0, 0);

          totalRevenue += amount;

          // Today
          if (appointmentDate.getTime() === startOfToday.getTime()) {
            todayRevenue += amount;
            console.log(`✅ TODAY REVENUE: ${appointment.patientName} - ₹${amount}`);
          }

          // This week (Monday to Sunday)
          if (appointmentDate >= startOfWeek && appointmentDate <= endOfWeek) {
            weekRevenue += amount;
            console.log(`✅ THIS WEEK REVENUE: ${appointment.patientName} - ₹${amount}`);
          }

          // This month
          if (appointmentDate.getMonth() === currentMonth && 
              appointmentDate.getFullYear() === currentYear) {
            monthRevenue += amount;
            console.log(`✅ THIS MONTH REVENUE: ${appointment.patientName} - ₹${amount}`);
          }
        }
      }
    });

    console.log('📅 Week Range for Revenue:', {
      monday: startOfWeek.toDateString(),
      sunday: endOfWeek.toDateString(),
      today: today.toDateString()
    });

    const result = {
      totalRevenue: Math.round(totalRevenue),
      todayRevenue: Math.round(todayRevenue),
      weekRevenue: Math.round(weekRevenue),
      monthRevenue: Math.round(monthRevenue),
      avgMonthly: Math.round(monthRevenue) // Simple: current month as avg
    };

    console.log('💰 SIMPLE Revenue Calculation:', result);
    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ Error in revenue stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// SEPARATE VISIT & APPOINTMENT STATS
router.get('/visit-stats', async (req, res) => {
  try {
    console.log('📅 Calculating SEPARATE visit and appointment stats...');
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Get start of current week (Monday)
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Monday start
    startOfWeek.setDate(today.getDate() - diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Get end of current week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);

    // Get ALL appointments
    const allAppointments = await Appointment.find({});
    console.log(`📊 Total appointments in system: ${allAppointments.length}`);

    let todayVisits = 0;
    let todayAppointments = 0;
    let weekVisits = 0;
    let weekAppointments = 0;
    let monthVisits = 0;
    let monthAppointments = 0;

    // SEPARATE: Count VISITS (completed) vs APPOINTMENTS (all)
    allAppointments.forEach(appointment => {
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(0, 0, 0, 0);

      const isToday = appointmentDate.getTime() === startOfToday.getTime();
      const isThisWeek = appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
      const isThisMonth = appointmentDate.getMonth() === currentMonth && 
                          appointmentDate.getFullYear() === currentYear;

      const isCompleted = appointment.status === 'completed';

      // Count ALL appointments (total workload)
      if (isToday) todayAppointments++;
      if (isThisWeek) weekAppointments++;
      if (isThisMonth) monthAppointments++;

      // Count only COMPLETED appointments (actual visits)
      if (isCompleted) {
        if (isToday) todayVisits++;
        if (isThisWeek) weekVisits++;
        if (isThisMonth) monthVisits++;
      }
    });

    const daysPassed = today.getDate();
    const dailyAvg = (monthVisits / daysPassed).toFixed(1);

    const result = {
      // VISITS - Only completed appointments (actual patient visits)
      todayVisits,
      weekVisits, 
      monthVisits,
      dailyAvg: parseFloat(dailyAvg),
      
      // APPOINTMENTS - All scheduled appointments (total workload)
      todayAppointments,
      weekAppointments,
      monthAppointments
    };

    console.log('📊 SEPARATE Visit & Appointment Statistics:', {
      visits: {
        today: todayVisits,
        week: weekVisits,
        month: monthVisits
      },
      appointments: {
        today: todayAppointments,
        week: weekAppointments, 
        month: monthAppointments
      },
      totalAppointments: allAppointments.length
    });
    
    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ Error in visit stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// SIMPLE PATIENT STATS
router.get('/patient-stats', async (req, res) => {
  try {
    console.log('👥 Calculating SIMPLE patient stats...');
    
    // Get all appointments to count unique patients
    const allAppointments = await Appointment.find({});
    
    // Get unique patient emails
    const uniqueEmails = [...new Set(allAppointments.map(apt => apt.patientEmail))];
    const totalPatients = uniqueEmails.length;
    
    // Active patients (had appointment in last 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    const activePatients = new Set();
    allAppointments.forEach(apt => {
      const aptDate = new Date(apt.date);
      if (aptDate >= ninetyDaysAgo) {
        activePatients.add(apt.patientEmail);
      }
    });

    // New patients this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const newPatientsThisMonth = new Set();
    
    allAppointments.forEach(apt => {
      const aptDate = new Date(apt.date);
      if (aptDate.getMonth() === currentMonth && aptDate.getFullYear() === currentYear) {
        newPatientsThisMonth.add(apt.patientEmail);
      }
    });

    const result = {
      totalPatients,
      activePatients: activePatients.size,
      newThisMonth: newPatientsThisMonth.size,
      returningRate: Math.round((activePatients.size / totalPatients) * 100) || 0
    };

    console.log('👥 SIMPLE Patient Statistics:', result);
    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ Error in patient stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;