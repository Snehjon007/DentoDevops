import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientDashboard.css";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedData = JSON.parse(userData);
      // Set patient data with default values
      setPatientData({
        name: parsedData.name || "Patient",
        phone: "+1 (555) 123-4567", // This would come from backend
        email: parsedData.email || "patient@email.com",
        bloodGroup: "A+", // This would come from backend
        status: "Active Patient"
      });
    } else {
      // If no user data, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  if (!patientData) {
    return <div>Loading...</div>;
  }

  const recentVisits = [
    {
      id: 1,
      type: "Routine Cleaning",
      status: "Completed",
      date: "Nov 15, 2024",
      doctor: "Dr. Michael Smith",
      description: "Cleaning and fluoride treatment completed successfully",
      prescription: {
        medication: "Amoxicillin 500mg",
        instructions: "Take 1 capsule every 8 hours"
      }
    },
    {
      id: 2,
      type: "Root Canal",
      status: "Completed",
      date: "Oct 8, 2024",
      doctor: "Dr. Emily Davis",
      description: "Root canal therapy on tooth #14, temporary filling placed",
      prescription: {
        medication: "Ibuprofen 600mg",
        instructions: "Take as needed for pain"
      }
    }
  ];

  const handleDownloadPrescription = (visitId) => {
    alert(`Downloading prescription for visit ${visitId}...`);
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Welcome Header */}
        <div className="welcome-header">
          <div className="header-content">
            <div className="header-text">
              <h1 className="welcome-title">Welcome back, {patientData.name}!</h1>
              <p className="welcome-subtitle">Here's your dental health overview</p>
              <div className="patient-status">
                <span className="status-badge active">{patientData.status}</span>
              </div>
            </div>
            <div className="header-actions">
              <button className="logout-btn" onClick={handleLogout}>
                <span className="logout-icon"></span>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <div className="info-section">
          <div className="section-header">
            <h2 className="section-title">
              My Information
            </h2>
          </div>
          
          <div className="info-grid">
            <div className="info-item">
              <div className="info-content">
                <span className="info-label">Phone</span>
                <span className="info-value">{patientData.phone}</span>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-content">
                <span className="info-label">Email</span>
                <span className="info-value">{patientData.email}</span>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-content">
                <span className="info-label">Blood Group</span>
                <span className="info-value">{patientData.bloodGroup}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Visits */}
        <div className="visits-section">
          <div className="section-header">
            <h2 className="section-title">
              Recent Visits & Prescriptions
            </h2>
          </div>

          <div className="visits-list">
            {recentVisits.map((visit) => (
              <div key={visit.id} className="visit-card">
                <div className="visit-header">
                  <div className="visit-info">
                    <h3 className="visit-type">{visit.type}</h3>
                    <span className={`visit-status ${visit.status.toLowerCase()}`}>
                      {visit.status}
                    </span>
                  </div>
                  <div className="visit-meta">
                    <span className="visit-date">{visit.date}</span>
                    <span className="visit-doctor">{visit.doctor}</span>
                  </div>
                </div>
                
                <p className="visit-description">{visit.description}</p>
                
                {visit.prescription && (
                  <div className="prescription-card">
                    <div className="prescription-header">
                      <div className="prescription-info">
                        <span className="prescription-label">Prescription</span>
                      </div>
                      <button 
                        className="download-btn"
                        onClick={() => handleDownloadPrescription(visit.id)}
                      >
                        Download
                      </button>
                    </div>
                    <div className="prescription-details">
                      <strong>{visit.prescription.medication}</strong> - {visit.prescription.instructions}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;