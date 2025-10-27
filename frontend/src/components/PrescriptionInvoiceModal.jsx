import React, { useState, useEffect } from 'react';
import PrescriptionForm from './PrescriptionForm.jsx';
import InvoiceForm from './InvoiceForm.jsx';
import './PrescriptionInvoiceModal.css';

const PrescriptionInvoiceModal = ({ appointment, onClose }) => {
  const [activeTab, setActiveTab] = useState('prescription');
  const [formData, setFormData] = useState({
    prescription: {},
    invoice: {}
  });
  const [loading, setLoading] = useState(false);

  // Auto-populate patient data when appointment changes
  useEffect(() => {
    if (appointment) {
      const patientData = {
        patientName: appointment.patientName || '',
        age: '', // Age might not be in appointment, leave blank for doctor to fill
        sex: '', // Sex might not be in appointment, leave blank for doctor to fill
        email: appointment.patientEmail || '',
        mobile: appointment.patientPhone || '',
        doctorName: appointment.doctor || '' // Pre-fill assigned doctor
      };

      setFormData({
        prescription: {
          ...patientData,
          // Prescription specific fields
          diagnosis: '',
          medicine1: '',

          nextVisit: ''
        },
        invoice: {
          ...patientData,
          // Invoice specific fields
          invoiceId: `INV-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          services: [{ service: '', price: '' }],
          subtotal: 0,
          discount: 0,
          grandTotal: 0
        }
      });
    }
  }, [appointment]);

  const handleFormChange = (formType, data) => {
    setFormData(prev => ({
      ...prev,
      [formType]: data
    }));
  };

  // Sync patient data between forms when it changes in one form
  const handlePatientDataChange = (formType, field, value) => {
    setFormData(prev => ({
      prescription: {
        ...prev.prescription,
        [field]: value
      },
      invoice: {
        ...prev.invoice,
        [field]: value
      }
    }));
  };

  const handleSend = async () => {
    try {
      setLoading(true);
      
      // Use the form data (doctor might have updated patient details)
      const combinedData = {
        appointmentId: appointment._id,
        doctorId: 'staff123',
        
        // Prescription data
        prescriptionData: {
          ...formData.prescription
        },
        
        // Invoice data
        invoiceData: {
          ...formData.invoice
        },
        
        // For email sending - use appointment data
        patientName: appointment.patientName,
        patientEmail: appointment.patientEmail,
        patientPhone: appointment.patientPhone
      };

      console.log('Sending prescription data:', combinedData);

      // Send to backend
      const response = await fetch('http://localhost:3001/api/prescriptions/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(combinedData),
      });

      const result = await response.json();

      if (result.success) {
        alert('Prescription and invoice sent successfully!');
        onClose();
      } else {
        throw new Error(result.message || 'Failed to send prescription');
      }
    } catch (error) {
      console.error('Error sending prescription:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="prescription-modal">
        {/* Tab Navigation */}
        <div className="prescription-tabs">
          <button 
            className={activeTab === 'prescription' ? 'active' : ''}
            onClick={() => setActiveTab('prescription')}
          >
            Prescription
          </button>
          <button 
            className={activeTab === 'invoice' ? 'active' : ''}
            onClick={() => setActiveTab('invoice')}
          >
            Invoice
          </button>
        </div>

        <div className="modal-content">
          {/* Prescription Form */}
          {activeTab === 'prescription' && (
            <PrescriptionForm 
              appointment={appointment}
              formData={formData.prescription}
              onChange={(data) => handleFormChange('prescription', data)}
              onPatientDataChange={(field, value) => handlePatientDataChange('prescription', field, value)}
            />
          )}

          {/* Invoice Form */}
          {activeTab === 'invoice' && (
            <InvoiceForm 
              appointment={appointment}
              formData={formData.invoice}
              onChange={(data) => handleFormChange('invoice', data)}
              onPatientDataChange={(field, value) => handlePatientDataChange('invoice', field, value)}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          <button 
            className="btn-secondary" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="btn-primary"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send PDF & Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionInvoiceModal;