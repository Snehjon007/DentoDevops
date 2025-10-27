import React, { useState, useEffect } from "react";
import "./StaffDashboard.css";
import PrescriptionInvoiceModal from "./PrescriptionInvoiceModal.jsx";

const StaffDashboard = () => {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [confirmedAppointments, setConfirmedAppointments] = useState([]);
  const [patientVisits, setPatientVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [treatmentNotes, setTreatmentNotes] = useState("");
  const [amountCharged, setAmountCharged] = useState("");

  // Dashboard Statistics State
  const [revenueStats, setRevenueStats] = useState({
    monthRevenue: 0,
    totalRevenue: 0,
    avgMonthly: 0,
    weekRevenue: 0,
    todayRevenue: 0,
  });
  const [patientStats, setPatientStats] = useState({
    totalPatients: 0,
    activePatients: 0,
    newThisMonth: 0,
    returningRate: 0,
  });
  const [visitStats, setVisitStats] = useState({
    monthVisits: 0,
    todayVisits: 0,
    weekVisits: 0,
    dailyAvg: 0,
  });
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // API base URL
  const API_BASE = "http://localhost:3001";

  // Format Indian Rupees
  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format number with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      setDashboardLoading(true);

      // Fetch all stats in parallel
      const [revenueRes, patientRes, visitRes] = await Promise.all([
        fetch(`${API_BASE}/api/dashboard/revenue-stats`),
        fetch(`${API_BASE}/api/dashboard/patient-stats`),
        fetch(`${API_BASE}/api/dashboard/visit-stats`),
      ]);

      const revenueData = await revenueRes.json();
      const patientData = await patientRes.json();
      const visitData = await visitRes.json();

      if (revenueData.success) setRevenueStats(revenueData.data);
      if (patientData.success) setPatientStats(patientData.data);
      if (visitData.success) setVisitStats(visitData.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setDashboardLoading(false);
    }
  };

  // Fetch appointments based on status
  const fetchAppointments = async (status) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/api/appointments?status=${status}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        return data.appointments || [];
      } else {
        throw new Error(data.message || "Failed to fetch appointments");
      }
    } catch (error) {
      console.error(`Error fetching ${status} appointments:`, error);
      setError(`Failed to load ${status} appointments: ${error.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch patient visits/history
  const fetchPatientVisits = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/api/patient-visits`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const visits = data.visits || [];
        setPatientVisits(visits);
        setFilteredVisits(visits);
      } else {
        throw new Error(data.message || "Failed to fetch patient visits");
      }
    } catch (error) {
      console.error("Error fetching patient visits:", error);
      setError(`Failed to load patient history: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Search patient visits
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredVisits(patientVisits);
    } else {
      const filtered = patientVisits.filter(
        (visit) =>
          visit.patientName.toLowerCase().includes(term.toLowerCase()) ||
          visit.patientEmail.toLowerCase().includes(term.toLowerCase()) ||
          visit.service.toLowerCase().includes(term.toLowerCase()) ||
          visit.doctor.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredVisits(filtered);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setFilteredVisits(patientVisits);
  };

  // Load data when section changes
  useEffect(() => {
    if (activeSection === "Requests") {
      fetchAppointments("pending").then(setPendingAppointments);
    } else if (activeSection === "Appointment") {
      fetchAppointments("confirmed").then(setConfirmedAppointments);
    } else if (activeSection === "Patient") {
      fetchPatientVisits();
    } else if (activeSection === "Dashboard") {
      fetchDashboardStats();
    }
  }, [activeSection]);

  // Reset search when patient visits change
  useEffect(() => {
    if (patientVisits.length > 0) {
      setFilteredVisits(patientVisits);
      setSearchTerm("");
    }
  }, [patientVisits]);

  // Handle accept request
  const handleAcceptRequest = async (appointmentId, patientName) => {
    try {
      if (
        !window.confirm(
          "Are you sure you want to accept this appointment? A confirmation email will be sent to the patient."
        )
      ) {
        return;
      }

      setLoading(true);

      const response = await fetch(
        `${API_BASE}/api/appointments/${appointmentId}/accept`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            acceptedBy: "Staff Member",
            notes:
              "Your appointment has been confirmed. Please arrive 15 minutes early.",
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setPendingAppointments((prev) =>
          prev.filter((apt) => apt._id !== appointmentId)
        );

        if (data.emailSent) {
          alert(
            `✅ Appointment accepted for ${patientName}! Confirmation email sent successfully.`
          );
        } else {
          alert(
            `✅ Appointment accepted for ${patientName}, but email failed to send.`
          );
        }

        fetchAppointments("confirmed").then(setConfirmedAppointments);
      } else {
        throw new Error(data.message || "Failed to accept request");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      alert(`❌ Error accepting request: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle complete appointment
  const handleCompleteAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCompleteModal(true);
  };

  // Submit completion
  const submitCompletion = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE}/api/appointments/${selectedAppointment._id}/complete`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            treatmentNotes,
            amountCharged: parseFloat(amountCharged) || 0,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        fetchAppointments("confirmed").then(setConfirmedAppointments);
        fetchPatientVisits();
        fetchDashboardStats(); // Refresh dashboard stats

        setShowCompleteModal(false);
        setTreatmentNotes("");
        setAmountCharged("");
        setSelectedAppointment(null);

        alert("Appointment completed successfully!");
      } else {
        throw new Error(data.message || "Failed to complete appointment");
      }
    } catch (error) {
      console.error("Error completing appointment:", error);
      alert(`❌ Error completing appointment: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle prescription button click
  const handlePrescription = (appointment) => {
    setSelectedAppointment(appointment);
    setShowPrescriptionModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowPrescriptionModal(false);
    setSelectedAppointment(null);
  };

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    window.location.href = "/login";
  };

  return (
    <div className="staff-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">⚕</div>
            <div className="logo-text">
              <div className="logo-title">DentoCare+</div>
              <div className="logo-subtitle">Professional</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${
              activeSection === "Dashboard" ? "active" : ""
            }`}
            onClick={() => setActiveSection("Dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`nav-item ${
              activeSection === "Patient" ? "active" : ""
            }`}
            onClick={() => setActiveSection("Patient")}
          >
            Patient History
          </button>
          <button
            className={`nav-item ${
              activeSection === "Appointment" ? "active" : ""
            }`}
            onClick={() => setActiveSection("Appointment")}
          >
            Appointments
          </button>
          <button
            className={`nav-item ${
              activeSection === "Requests" ? "active" : ""
            }`}
            onClick={() => setActiveSection("Requests")}
          >
            Requests
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="staff-info">
            <div className="staff-avatar"></div>
            <div className="staff-details">
              <div className="staff-name">Dr. Smith</div>
              <div className="staff-role">Administrator</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon"></span>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <h1 className="page-title">
            {activeSection === "Dashboard" && "Dashboard"}
            {activeSection === "Patient" && "Patient History"}
            {activeSection === "Appointment" && "Appointments"}
            {activeSection === "Requests" && "Appointment Requests"}
          </h1>
          <p className="page-subtitle">
            {activeSection === "Dashboard" &&
              "Overview of your dental practice"}
            {activeSection === "Patient" &&
              "View patient visit history and statistics"}
            {activeSection === "Appointment" && "Manage confirmed appointments"}
            {activeSection === "Requests" &&
              "Handle pending appointment requests"}
          </p>
        </div>
        {/* Dashboard Content */}
        {activeSection === "Dashboard" && (
          <div className="dashboard-content">
            {dashboardLoading && (
              <div className="loading-message">
                Loading dashboard statistics...
              </div>
            )}

            {/* Enhanced Dashboard Cards */}
            <div className="dashboard-cards-grid">
              {/* Revenue Monthly Card */}
              <div className="dashboard-card revenue-monthly">
                <div className="card-header">
                  <div className="card-title-section">
                    <h3 className="card-title">Monthly Revenue</h3>
                    <p className="card-subtitle">Current month earnings</p>
                  </div>
                </div>
                <div className="card-content">
                  <div className="primary-metric">
                    {formatINR(revenueStats.monthRevenue)}
                  </div>

                  {/* Revenue Trend Chart with Proper Legend */}
                  <div className="revenue-trend">
                    <div className="trend-legend">
                      <div className="legend-item">
                        <div className="legend-color current"></div>
                        <span className="legend-label">Current Month</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-color previous"></div>
                        <span className="legend-label">Previous Months</span>
                      </div>
                    </div>
                    <div className="mini-chart">
                      <div className="chart-bars">
                        <div
                          className="bar previous"
                          style={{ height: "60%" }}
                        ></div>
                        <div
                          className="bar previous"
                          style={{ height: "75%" }}
                        ></div>
                        <div
                          className="bar previous"
                          style={{ height: "45%" }}
                        ></div>
                        <div
                          className="bar previous"
                          style={{ height: "65%" }}
                        ></div>
                        <div
                          className="bar current"
                          style={{ height: "100%" }}
                        ></div>
                      </div>
                      <div className="chart-labels">
                        <span>Aug</span>
                        <span>Sep</span>
                        <span>Jul</span>
                        <span>Jun</span>
                        <span>Oct</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue Statistics Card */}
              <div className="dashboard-card revenue-stats">
                <div className="card-header">
                  <div className="card-title-section">
                    <h3 className="card-title">Revenue Statistics</h3>
                    <p className="card-subtitle">Financial overview</p>
                  </div>
                </div>
                <div className="card-content">
                  <div className="stats-grid">
                    <div className="stat-item">
                      <div className="stat-value">
                        {formatINR(revenueStats.totalRevenue)}
                      </div>
                      <div className="stat-label">Total Revenue</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">
                        {formatINR(revenueStats.avgMonthly)}
                      </div>
                      <div className="stat-label">Avg Monthly</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">
                        {formatINR(revenueStats.weekRevenue)}
                      </div>
                      <div className="stat-label">This Week</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">
                        {formatINR(revenueStats.todayRevenue)}
                      </div>
                      <div className="stat-label">Today</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Statistics Card */}
              <div className="dashboard-card patient-stats">
                <div className="card-header">
                  <div className="card-title-section">
                    <h3 className="card-title">Patient Statistics</h3>
                    <p className="card-subtitle">Patient demographics</p>
                  </div>
                </div>
                <div className="card-content">
                  <div className="patient-metrics">
                    <div className="metric-row">
                      <span className="metric-label">Total Patients</span>
                      <span className="metric-value">
                        {formatNumber(patientStats.totalPatients)}
                      </span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-label">Active Patients</span>
                      <span className="metric-value">
                        {formatNumber(patientStats.activePatients)}
                      </span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-label">New This Month</span>
                      <span className="metric-value">
                        {formatNumber(patientStats.newThisMonth)}
                      </span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-label">Returning Rate</span>
                      <span className="metric-value">
                        {patientStats.returningRate}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Visits Card */}
              <div className="dashboard-card patient-visits">
                <div className="card-header">
                  <div className="card-title-section">
                    <h3 className="card-title">Patient Visits</h3>
                    <p className="card-subtitle">Visit tracking & trends</p>
                  </div>
                </div>
                <div className="card-content">
                  <div className="visits-summary">
                    <div className="visit-count">
                      <div className="count-number">
                        {formatNumber(visitStats.monthVisits)}
                      </div>
                      <div className="count-label">Visits This Month</div>
                    </div>
                    <div className="visit-stats">
                      <div className="visit-stat">
                        <span className="stat-dot today"></span>
                        <span>Today: {visitStats.todayVisits} visits</span>
                      </div>
                      <div className="visit-stat">
                        <span className="stat-dot week"></span>
                        <span>This Week: {visitStats.weekVisits} visits</span>
                      </div>
                      <div className="visit-stat">
                        <span className="stat-dot avg"></span>
                        <span>Daily Avg: {visitStats.dailyAvg} visits</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Patient History Section */}
        {activeSection === "Patient" && (
          <div className="patient-history-section">
            {/* Search Bar */}
            <div className="search-section">
              <div className="search-container">
                <div className="search-input-group">
                  <input
                    type="text"
                    placeholder="Search by patient name, email, service, or doctor..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="search-input"
                  />
                  {searchTerm && (
                    <button onClick={clearSearch} className="clear-search-btn">
                      ✕
                    </button>
                  )}
                </div>
                <div className="search-results-info">
                  Showing {filteredVisits.length} of {patientVisits.length}{" "}
                  records
                  {searchTerm && (
                    <span className="search-term"> for "{searchTerm}"</span>
                  )}
                </div>
              </div>
            </div>

            {/* Patient Visits Table */}
            <div className="visits-table">
              <div className="table-header">
                <h3>Patient Visit History</h3>
              </div>

              {loading && (
                <div className="loading-message">
                  Loading patient history...
                </div>
              )}

              {error && <div className="error-message">{error}</div>}

              {!loading && !error && patientVisits.length === 0 && (
                <div className="no-data-message">
                  <h3>No Patient History</h3>
                  <p>No completed appointments found in the system.</p>
                </div>
              )}

              {!loading &&
                !error &&
                patientVisits.length > 0 &&
                filteredVisits.length === 0 && (
                  <div className="no-data-message">
                    <h3>No Matching Records</h3>
                    <p>
                      No patient visits found matching your search criteria.
                    </p>
                    <button
                      onClick={clearSearch}
                      className="clear-search-action"
                    >
                      Clear Search
                    </button>
                  </div>
                )}

              {!loading && filteredVisits.length > 0 && (
                <div className="table-container">
                  <table className="patient-history-table">
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Doctor</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVisits.map((visit) => (
                        <tr key={visit._id} className="table-row">
                          <td className="patient-name-cell">
                            <div className="patient-name">
                              {visit.patientName || "Unknown Patient"}
                            </div>
                            <div className="patient-email">
                              {visit.patientEmail || "No email"}
                            </div>
                          </td>
                          <td className="service-cell">
                            {visit.serviceProvided ||
                              visit.service ||
                              "No service specified"}
                          </td>
                          <td className="date-cell">
                            <div className="visit-date">
                              {visit.dateVisited
                                ? new Date(
                                    visit.dateVisited
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : visit.date
                                ? new Date(visit.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )
                                : "No date"}
                            </div>
                            <div className="visit-time">
                              {visit.timeSlot || visit.time || ""}
                            </div>
                          </td>
                          <td className="doctor-cell">
                            {visit.doctorAttended ||
                              visit.doctor ||
                              "No doctor assigned"}
                          </td>
                          <td className="amount-cell">
                            <strong>₹{visit.amountCharged || 0}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Appointments Section */}
        {activeSection === "Appointment" && (
          <div className="appointments-container">
            {loading && (
              <div className="loading-message">
                Loading confirmed appointments...
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            {!loading && !error && confirmedAppointments.length === 0 && (
              <div className="no-data-message">
                <h3>No Confirmed Appointments</h3>
                <p>No appointments have been confirmed yet.</p>
              </div>
            )}

            {!loading &&
              confirmedAppointments.map((appointment) => (
                <div key={appointment._id} className="appointment-card">
                  <div className="appointment-row">
                    <div className="appointment-name">
                      {appointment.patientName}
                    </div>
                    <div className="appointment-service">
                      {appointment.service}
                    </div>
                    <div className="appointment-time">{appointment.time}</div>
                    <div className="appointment-date">{appointment.date}</div>
                    <div className="appointment-actions">
                      <button
                        className="prescription-btn"
                        onClick={() => handlePrescription(appointment)}
                      >
                        📝 Prescription
                      </button>
                    </div>
                  </div>
                  <div className="appointment-doctor">
                    Assigned to:{" "}
                    <span className="doctor-name">{appointment.doctor}</span>
                  </div>
                  {appointment.notes && (
                    <div className="appointment-notes">
                      <strong>Notes:</strong> {appointment.notes}
                    </div>
                  )}
                  <div className="appointment-contact">
                    <span>📧 {appointment.patientEmail}</span>
                    <span>📞 {appointment.patientPhone}</span>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Requests Section */}
        {activeSection === "Requests" && (
          <div className="requests-container">
            {loading && (
              <div className="loading-message">Loading pending requests...</div>
            )}

            {error && <div className="error-message">{error}</div>}

            {!loading && !error && pendingAppointments.length === 0 && (
              <div className="no-data-message">
                <h3>No Pending Requests</h3>
                <p>All appointment requests have been processed.</p>
              </div>
            )}

            {!loading &&
              pendingAppointments.map((appointment) => (
                <div key={appointment._id} className="request-card">
                  <div className="request-row">
                    <div className="request-name">
                      {appointment.patientName}
                    </div>
                    <div className="request-service">{appointment.service}</div>
                    <div className="request-time">{appointment.time}</div>
                    <div className="request-date">{appointment.date}</div>
                    <div className="request-action">
                      <button
                        className="accept-btn"
                        onClick={() =>
                          handleAcceptRequest(
                            appointment._id,
                            appointment.patientName
                          )
                        }
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "✓ Accept"}
                      </button>
                    </div>
                  </div>
                  {appointment.notes && (
                    <div className="request-notes">
                      <strong>Notes:</strong> {appointment.notes}
                    </div>
                  )}
                  <div className="request-contact">
                    <span>📧 {appointment.patientEmail}</span>
                    <span>📞 {appointment.patientPhone}</span>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Prescription Modal */}
        {showPrescriptionModal && selectedAppointment && (
          <PrescriptionInvoiceModal
            appointment={selectedAppointment}
            onClose={handleCloseModal}
          />
        )}

        {/* Complete Appointment Modal */}
        {showCompleteModal && selectedAppointment && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Complete Appointment</h3>
              <p>
                Complete appointment for{" "}
                <strong>{selectedAppointment.patientName}</strong>
              </p>

              <div className="form-group">
                <label>Treatment Notes:</label>
                <textarea
                  value={treatmentNotes}
                  onChange={(e) => setTreatmentNotes(e.target.value)}
                  placeholder="Enter treatment details..."
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Amount Charged (₹):</label>
                <input
                  type="number"
                  value={amountCharged}
                  onChange={(e) => setAmountCharged(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>

              <div className="modal-actions">
                <button onClick={() => setShowCompleteModal(false)}>
                  Cancel
                </button>
                <button
                  onClick={submitCompletion}
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Complete Appointment"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
