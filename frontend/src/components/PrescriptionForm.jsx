import React, { useState, useEffect } from 'react';
import './PrescriptionForm.css';

const PrescriptionForm = ({ appointment, formData, onChange, onPatientDataChange }) => {
  const [medicines, setMedicines] = useState([{ 
    id: 1, 
    name: '', 
    dosage: '', 
    timing: '', 
    duration: '' 
  }]);

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

  const addMedicine = () => {
    const newId = Date.now(); // Use timestamp for unique IDs
    setMedicines([...medicines, { 
      id: newId, 
      name: '', 
      dosage: '', 
      timing: '', 
      duration: '' 
    }]);
  };

  const removeMedicine = (id) => {
    if (medicines.length > 1) {
      const updatedMedicines = medicines.filter(med => med.id !== id);
      setMedicines(updatedMedicines);
      updateFormData(updatedMedicines);
    }
  };

  const updateMedicine = (id, field, value) => {
    const updatedMedicines = medicines.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    );
    setMedicines(updatedMedicines);
    updateFormData(updatedMedicines);
  };

  const updateFormData = (medicinesArray) => {
    const medicineData = {};
    medicinesArray.forEach((med, index) => {
      medicineData[`medicine${index + 1}`] = `${med.name} | ${med.dosage} | ${med.timing} | ${med.duration}`;
    });
    
    onChange({
      ...formData,
      ...medicineData
    });
  };

  // Initialize medicines from formData
  useEffect(() => {
    if (formData) {
      const medicineEntries = Object.entries(formData)
        .filter(([key]) => key.startsWith('medicine'))
        .sort(([a], [b]) => a.localeCompare(b));
      
      if (medicineEntries.length > 0) {
        const initialMedicines = medicineEntries.map(([key, value], index) => {
          const [name = '', dosage = '', timing = '', duration = ''] = value.split('|').map(item => item.trim());
          return {
            id: index + 1,
            name,
            dosage,
            timing,
            duration
          };
        });
        setMedicines(initialMedicines);
      }
    }
  }, [formData]);

  return (
    <div className="prescription-form template-form">
      <div className="prescription-template">
        <h1>PRESCRIPTION</h1>
        
        <div className="patient-details">
          <p>
            <strong>Patient Name:</strong> 
            <input 
              type="text" 
              value={formData.patientName || ''}
              onChange={(e) => handlePatientFieldChange('patientName', e.target.value)}
              placeholder="Enter patient name"
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
            <strong>Sex:</strong> 
            <select 
              value={formData.sex || ''}
              onChange={(e) => handlePatientFieldChange('sex', e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </p>
          <p>
            <strong>Diagnosis:</strong> 
            <textarea 
              value={formData.diagnosis || ''}
              onChange={(e) => handleChange('diagnosis', e.target.value)}
              placeholder="Enter diagnosis details"
              rows="3"
            />
          </p>
        </div>

        <div className="doctor-assignment">
          <p>
            <strong>ASSIGN DOCTOR:</strong> 
            <input 
              type="text" 
              value={formData.doctorName || ''}
              onChange={(e) => handlePatientFieldChange('doctorName', e.target.value)}
              placeholder="Enter doctor name"
            />
          </p>
        </div>

        <div className="medication-section">
          <div className="medication-header">
            <h3>MEDICATION</h3>
            <button type="button" className="add-medicine-btn" onClick={addMedicine}>
              + Add Medicine
            </button>
          </div>
          
          {medicines.map((medicine, index) => (
            <div key={medicine.id} className="medicine-container">
              <div className="medicine-header">
                <span className="medicine-number">{index + 1})</span>
                {medicines.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-medicine-btn"
                    onClick={() => removeMedicine(medicine.id)}
                    title="Remove medicine"
                  >
                    ×
                  </button>
                )}
              </div>
              
              <div className="medicine-main-input">
                <input 
                  type="text"
                  value={medicine.name}
                  onChange={(e) => updateMedicine(medicine.id, 'name', e.target.value)}
                  placeholder="Medicine name"
                  className="medicine-name-input"
                />
              </div>
              
              <div className="medicine-details-grid">
                <div className="medicine-detail">
                  <input 
                    type="text"
                    value={medicine.dosage}
                    onChange={(e) => updateMedicine(medicine.id, 'dosage', e.target.value)}
                    placeholder="Dosage (e.g., 500mg, 1 tablet)"
                    className="detail-input dosage-input"
                  />
                </div>
                
                <div className="medicine-detail">
                  <input 
                    type="text"
                    value={medicine.timing}
                    onChange={(e) => updateMedicine(medicine.id, 'timing', e.target.value)}
                    placeholder="When to take (e.g., after food, morning)"
                    className="detail-input timing-input"
                  />
                </div>
                
                <div className="medicine-detail">
                  <input 
                    type="text"
                    value={medicine.duration}
                    onChange={(e) => updateMedicine(medicine.id, 'duration', e.target.value)}
                    placeholder="Duration (e.g., 3 days, 1 week)"
                    className="detail-input duration-input"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="next-visit">
          <p><strong>NEXT VISIT</strong></p>
          <input 
            type="date"
            value={formData.nextVisit || ''}
            onChange={(e) => handleChange('nextVisit', e.target.value)}
          />
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

export default PrescriptionForm;