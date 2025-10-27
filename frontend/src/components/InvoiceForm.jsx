import React, { useState, useEffect } from 'react';
import './InvoiceForm.css';

const InvoiceForm = ({ appointment, formData, onChange, onPatientDataChange }) => {
  const [services, setServices] = useState([{ service: '', price: '' }]);

  const addService = () => {
    setServices([...services, { service: '', price: '' }]);
  };

  const removeService = (index) => {
    if (services.length > 1) {
      const updated = services.filter((_, i) => i !== index);
      setServices(updated);
      updateTotals(updated);
    }
  };

  const updateTotals = (servicesArray) => {
    const subtotal = servicesArray.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    const discount = subtotal * 0.1; // 10% discount
    const grandTotal = subtotal - discount;
    
    onChange({
      ...formData,
      services: servicesArray,
      subtotal,
      discount,
      grandTotal
    });
  };

  const updateService = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;
    setServices(updated);
    updateTotals(updated);
  };

  const handleChange = (field, value) => {
    onChange({
      ...formData,
      [field]: value
    });
  };

  // Handle patient data changes that should sync between forms
  const handlePatientFieldChange = (field, value) => {
    handleChange(field, value);
    if (onPatientDataChange) {
      onPatientDataChange(field, value);
    }
  };

  // Initialize services from formData
  useEffect(() => {
    if (formData.services) {
      setServices(formData.services);
    }
  }, [formData.services]);

  return (
    <div className="invoice-form template-form">
      <div className="invoice-template">
        <h1>INVOICE</h1>
        
        <div className="invoice-header">
          <p><strong>Invoice ID:</strong> {formData.invoiceId || `INV-${Date.now()}`}</p>
          <p><strong>Date:</strong> {formData.date || new Date().toLocaleDateString()}</p>
        </div>

        <div className="patient-details">
          <p>
            <strong>Patient Name:</strong> 
            <input 
              type="text" 
              value={formData.patientName || ''}
              onChange={(e) => handlePatientFieldChange('patientName', e.target.value)}
              placeholder="Patient name from appointment"
              className="patient-data-field"
            />
          </p>
          <p>
            <strong>Age:</strong> 
            <input 
              type="number" 
              value={formData.age || ''}
              onChange={(e) => handlePatientFieldChange('age', e.target.value)}
              placeholder="Enter age"
            />
          </p>
          <p>
            <strong>Email:</strong> 
            <input 
              type="email" 
              value={formData.email || ''}
              onChange={(e) => handlePatientFieldChange('email', e.target.value)}
              placeholder="Email from appointment"
              className="patient-data-field"
            />
          </p>
          <p>
            <strong>Mobile:</strong> 
            <input 
              type="tel" 
              value={formData.mobile || ''}
              onChange={(e) => handlePatientFieldChange('mobile', e.target.value)}
              placeholder="Mobile from appointment"
              className="patient-data-field"
            />
          </p>
          <p>
            <strong>Sex:</strong> 
            <select 
              value={formData.sex || ''}
              onChange={(e) => handlePatientFieldChange('sex', e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </p>
        </div>

        <p>
          <strong>ASSIGN DOCTOR:</strong> 
          <input 
            type="text" 
            value={formData.doctorName || ''}
            onChange={(e) => handlePatientFieldChange('doctorName', e.target.value)}
            placeholder="Doctor name"
          />
        </p>

        <div className="services-table">
          <table>
            <thead>
              <tr>
                <th>SERVICE</th>
                <th>PRICE</th>
                <th>TOTAL</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={service.service}
                      onChange={(e) => updateService(index, 'service', e.target.value)}
                      placeholder="Service name"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={service.price}
                      onChange={(e) => updateService(index, 'price', e.target.value)}
                      placeholder="0.00"
                    />
                  </td>
                  <td>₹{(parseFloat(service.price) || 0).toFixed(2)}</td>
                  <td>
                    {services.length > 1 && (
                      <button 
                        type="button" 
                        className="remove-service-btn"
                        onClick={() => removeService(index)}
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="add-service-btn" onClick={addService}>
            + Add Service
          </button>
        </div>

        <div className="invoice-totals">
          <p><strong>SUB TOTAL:</strong> : ₹{(formData.subtotal || 0).toFixed(2)}</p>
          <p><strong>DISCOUNT(10%):</strong> : ₹{(formData.discount || 0).toFixed(2)}</p>
          <p className="grand-total"><strong>GRAND TOTAL:</strong> : ₹{(formData.grandTotal || 0).toFixed(2)}</p>
        </div>

        <div className="clinic-info">
          <p>www.denlocarer.com</p>
          <p>9607870953</p>
          <p>dentocareplus@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;