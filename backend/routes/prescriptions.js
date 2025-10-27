const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Configure nodemailer - FIXED: createTransport not createTransporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate and save prescription PDF
router.post('/generate', async (req, res) => {
  try {
    const {
      appointmentId,
      doctorId,
      prescriptionData,
      invoiceData,
      patientName,
      patientEmail,
      patientPhone
    } = req.body;

    console.log('Received prescription data:', req.body);

    // Get appointment to find patientId
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Use appointment's patientId or create a fallback
    const patientId = appointment.patientId || `patient_${Date.now()}`;

    // Generate PDF
    const pdfBuffer = await generateCombinedPDF(prescriptionData, invoiceData);
    
    // Create prescriptions directory if it doesn't exist
    const prescriptionsDir = path.join(__dirname, '../prescriptions');
    if (!fs.existsSync(prescriptionsDir)) {
      fs.mkdirSync(prescriptionsDir, { recursive: true });
    }

    // Save PDF file
    const fileName = `prescription_${appointmentId}_${Date.now()}.pdf`;
    const filePath = path.join(prescriptionsDir, fileName);
    fs.writeFileSync(filePath, pdfBuffer);

    // Save to database
    const prescriptionRecord = new Prescription({
      appointmentId,
      patientId,
      doctorId,
      prescriptionData,
      invoiceData,
      pdfPath: filePath,
      status: 'sent'
    });

    await prescriptionRecord.save();

    // UPDATE: Auto-complete the appointment with prescription linking
    await Appointment.findByIdAndUpdate(appointmentId, {
      prescriptionId: prescriptionRecord._id,
      status: 'completed',
      isCompleted: true,
      completedAt: new Date(),
      hasPrescription: true
    });
    console.log('✅ Auto-completed appointment:', appointmentId);

    // Send email with PDF attachment
    await sendPrescriptionEmail(patientEmail, patientName, pdfBuffer, prescriptionData, invoiceData);

    res.json({
      success: true,
      message: 'Prescription generated, saved, and emailed successfully',
      prescriptionId: prescriptionRecord._id,
      emailSent: true
    });

  } catch (error) {
    console.error('Error generating prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate prescription',
      error: error.message
    });
  }
});

// Email sending function
async function sendPrescriptionEmail(patientEmail, patientName, pdfBuffer, prescriptionData, invoiceData) {
  try {
    if (!patientEmail) {
      console.log('No email provided, skipping email sending');
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: patientEmail,
      subject: `Your Prescription & Invoice - DentoCare+`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background: #007bff; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
                .section { margin-bottom: 20px; padding: 15px; border-left: 4px solid #007bff; background: #f8f9fa; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>DentoCare+</h1>
                <p>Your Dental Health Partner</p>
            </div>
            
            <div class="content">
                <h2>Dear ${patientName},</h2>
                
                <div class="section">
                    <h3>📋 Your Prescription & Invoice</h3>
                    <p>We have attached your prescription and invoice for your recent dental visit.</p>
                </div>

                <div class="section">
                    <h3>💊 Prescription Summary</h3>
                    <p><strong>Diagnosis:</strong> ${prescriptionData.diagnosis || 'Not specified'}</p>
                    <p><strong>Doctor:</strong> ${prescriptionData.doctorName || 'Not specified'}</p>
                    ${prescriptionData.nextVisit ? `<p><strong>Next Visit:</strong> ${new Date(prescriptionData.nextVisit).toLocaleDateString()}</p>` : ''}
                </div>

                ${invoiceData.grandTotal ? `
                <div class="section">
                    <h3>💰 Invoice Summary</h3>
                    <p><strong>Total Amount:</strong> ₹${invoiceData.grandTotal.toFixed(2)}</p>
                    <p><strong>Invoice ID:</strong> ${invoiceData.invoiceId || 'N/A'}</p>
                </div>
                ` : ''}

                <div class="section">
                    <h3>📞 Contact Information</h3>
                    <p>If you have any questions, please contact us:</p>
                    <p>📞 9607870953 | 📧 dentocareplus@gmail.com</p>
                </div>
            </div>
            
            <div class="footer">
                <p>© 2024 DentoCare+. All rights reserved.</p>
                <p>This is an automated email, please do not reply.</p>
            </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `Prescription_Invoice_${patientName.replace(/\s+/g, '_')}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', patientEmail);
    console.log('Message ID:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

// Appointment Confirmation Email Function
async function sendAppointmentConfirmation(appointment) {
  try {
    if (!appointment.patientEmail) {
      console.log('No email provided, skipping appointment confirmation email');
      return false;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: appointment.patientEmail,
      subject: `Appointment Confirmed - DentoCare+`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background: #007bff; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
                .section { margin-bottom: 20px; padding: 15px; border-left: 4px solid #007bff; background: #f8f9fa; }
                .appointment-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>DentoCare+</h1>
                <p>Your Dental Health Partner</p>
            </div>
            
            <div class="content">
                <h2>Dear ${appointment.patientName},</h2>
                
                <div class="section">
                    <h3>✅ Appointment Confirmed!</h3>
                    <p>Your appointment request has been accepted. Here are your appointment details:</p>
                </div>

                <div class="appointment-details">
                    <h3>📅 Appointment Details</h3>
                    <p><strong>Date:</strong> ${appointment.date}</p>
                    <p><strong>Time:</strong> ${appointment.time}</p>
                    <p><strong>Doctor:</strong> ${appointment.doctor}</p>
                    <p><strong>Service:</strong> ${appointment.service}</p>
                    ${appointment.notes ? `<p><strong>Additional Notes:</strong> ${appointment.notes}</p>` : ''}
                </div>

                <div class="section">
                    <h3>📋 Important Instructions</h3>
                    <ul>
                        <li>Please arrive 15 minutes before your scheduled time</li>
                        <li>Bring your ID and any previous medical records</li>
                        <li>If you need to reschedule, please contact us 24 hours in advance</li>
                        <li>Carry your insurance details if applicable</li>
                    </ul>
                </div>

                <div class="section">
                    <h3>📍 Clinic Address</h3>
                    <p>DentoCare+ Dental Clinic</p>
                    <p>123 Dental Street, Healthcare District</p>
                    <p>City, State - 123456</p>
                </div>

                <p>We look forward to seeing you and taking care of your dental health!</p>
            </div>
            
            <div class="footer">
                <p><strong>Contact Us:</strong> 📞 9607870953 | 📧 dentocareplus@gmail.com</p>
                <p>© 2024 DentoCare+. All rights reserved.</p>
                <p>This is an automated email, please do not reply.</p>
            </div>
        </body>
        </html>
      `
    };

    // Send email using existing transporter
    const info = await transporter.sendMail(mailOptions);
    console.log('Appointment confirmation email sent successfully to:', appointment.patientEmail);
    console.log('Message ID:', info.messageId);
    
    return true;
  } catch (error) {
    console.error('Error sending appointment confirmation email:', error);
    return false;
  }
}

// Get prescriptions by appointment
router.get('/appointment/:appointmentId', async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      appointmentId: req.params.appointmentId
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      prescriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prescriptions',
      error: error.message
    });
  }
});

// Get prescriptions by patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      patientId: req.params.patientId
    })
    .populate('appointmentId')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      prescriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient prescriptions',
      error: error.message
    });
  }
});

// PDF Generation Function
async function generateCombinedPDF(prescriptionData, invoiceData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Prescription Section
      generatePrescriptionSection(doc, prescriptionData);
      
      // Add new page for invoice
      doc.addPage();
      
      // Invoice Section
      generateInvoiceSection(doc, invoiceData);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function generatePrescriptionSection(doc, data) {
  // Header
  doc.fontSize(20).font('Helvetica-Bold').text('PRESCRIPTION', { align: 'center' });
  doc.moveDown();

  // Patient Details
  doc.fontSize(12).font('Helvetica-Bold').text('PATIENT DETAILS:');
  doc.font('Helvetica');
  doc.text(`Patient Name: ${data.patientName || ''}`);
  doc.text(`Age: ${data.age || ''}`);
  doc.text(`Sex: ${data.sex || ''}`);
  doc.text(`Diagnosis: ${data.diagnosis || ''}`);
  doc.moveDown();

  // Doctor
  doc.font('Helvetica-Bold').text('ASSIGN DOCTOR:');
  doc.font('Helvetica').text(`Name: ${data.doctorName || ''}`);
  doc.moveDown();

  // Line separator
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();

  // Medication
  doc.font('Helvetica-Bold').fontSize(14).text('MEDICATION');
  doc.font('Helvetica').fontSize(12);
  
  [1, 2, 3, 4, 5].forEach(num => {
    const medicine = data[`medicine${num}`];
    if (medicine) {
      doc.text(`${num}) ${medicine}`);
    }
  });
  
  doc.moveDown();

  // Line separator
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();

  // Next Visit
  doc.font('Helvetica-Bold').text('NEXT VISIT');
  doc.font('Helvetica').text(`Date: ${data.nextVisit ? new Date(data.nextVisit).toLocaleDateString() : ''}`);
  doc.moveDown(2);

  // Clinic Info
  doc.fontSize(10).text('www.dentocare+.com', { align: 'center' });
  doc.text('9607870553', { align: 'center' });
  doc.text('dentocareplus@gmail.com', { align: 'center' });
}

function generateInvoiceSection(doc, data) {
  // Header
  doc.fontSize(20).font('Helvetica-Bold').text('INVOICE', { align: 'center' });
  doc.moveDown();

  // Invoice Header
  doc.fontSize(12);
  doc.text(`Invoice ID: ${data.invoiceId || 'INV-' + Date.now()}`);
  doc.text(`Date: ${data.date || new Date().toLocaleDateString()}`);
  doc.moveDown();

  // Patient Details
  doc.font('Helvetica-Bold').text('PATIENT DETAILS:');
  doc.font('Helvetica');
  doc.text(`Patient Name: ${data.patientName || ''}`);
  doc.text(`Age: ${data.age || ''}`);
  doc.text(`Email: ${data.email || ''}`);
  doc.text(`Mobile: ${data.mobile || ''}`);
  doc.text(`Sex: ${data.sex || ''}`);
  doc.moveDown();

  // Doctor
  doc.font('Helvetica-Bold').text('ASSIGN DOCTOR:');
  doc.font('Helvetica').text(`Name: ${data.doctorName || ''}`);
  doc.moveDown();

  // Services Table
  const tableTop = doc.y;
  doc.font('Helvetica-Bold');
  doc.text('SERVICE', 50, tableTop);
  doc.text('PRICE', 300, tableTop);
  doc.text('TOTAL', 450, tableTop);
  
  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
  
  let currentY = tableTop + 25;
  doc.font('Helvetica');
  
  (data.services || []).forEach(service => {
    if (service.service && service.price) {
      doc.text(service.service, 50, currentY);
      doc.text(`₹${parseFloat(service.price).toFixed(2)}`, 300, currentY);
      doc.text(`₹${parseFloat(service.price).toFixed(2)}`, 450, currentY);
      currentY += 20;
    }
  });

  // If no services, show a message
  if (!data.services || data.services.length === 0) {
    doc.text('No services added', 50, currentY);
    currentY += 20;
  }

  doc.y = currentY + 10;
  
  // Totals
  doc.text(`SUB TOTAL: : ₹${(data.subtotal || 0).toFixed(2)}`, 400, doc.y, { align: 'right' });
  doc.text(`DISCOUNT(10%): : ₹${(data.discount || 0).toFixed(2)}`, 400, doc.y + 20, { align: 'right' });
  doc.font('Helvetica-Bold').text(`GRAND TOTAL: : ₹${(data.grandTotal || 0).toFixed(2)}`, 400, doc.y + 40, { align: 'right' });
  
  doc.moveDown(3);

  // Clinic Info
  doc.fontSize(10).font('Helvetica');
  doc.text('www.denlocarer.com', { align: 'center' });
  doc.text('9607870953', { align: 'center' });
  doc.text('dentocareplus@gmail.com', { align: 'center' });
}

// Export the function so it can be used in appointments route
module.exports.sendAppointmentConfirmation = sendAppointmentConfirmation;

module.exports = router;