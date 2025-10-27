import { useState, useEffect } from "react";
import "./AppointmentBooking.css";
import facebookIcon from "../assets/images/fb_img.png";
import instagramIcon from "../assets/images/ig_img.png";
import linkedinIcon from "../assets/images/linked_img.png";
import twitterIcon from "../assets/images/x_img.png";

function AppointmentBooking() {
  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    service: "",
    doctor: "",
    message: "",
  });

  // State for available time slots
  const [timeSlots, setTimeSlots] = useState([]);
  
  // State for services
  const [services, setServices] = useState([]);
  
  // State for doctors
  const [doctors, setDoctors] = useState([]);
  
  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // API base URL - Updated to port 3001
  const API_BASE = 'http://localhost:3001';

  // Fetch services and doctors from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch services
        console.log('Fetching services...');
        const servicesResponse = await fetch(`${API_BASE}/api/services`);
        console.log('Services response status:', servicesResponse.status);
        
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          console.log('Services data:', servicesData);
          
          if (servicesData.success && servicesData.services) {
            const formattedServices = servicesData.services.map(service => ({
              id: service.id,
              title: service.name
            }));
            setServices(formattedServices);
          }
        } else {
          throw new Error('Failed to fetch services');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        // Fallback to static data if API fails
        setServices([
          { id: "wisdom-tooth-extraction", title: "Wisdom Tooth Extraction" },
          { id: "tooth-whitening", title: "Tooth Whitening" },
          { id: "dental-implants", title: "Dental Implants" },
          { id: "root-canal-treatment", title: "Root Canal Treatment" },
          { id: "orthodontic", title: "Orthodontic" },
          { id: "cosmetic-dentistry", title: "Cosmetic Dentistry" },
          { id: "pediatric-dentistry", title: "Pediatric Dentistry" },
          { id: "dental-fillings", title: "Dental Fillings" },
          { id: "bone-grafting", title: "Bone Grafting" },
          { id: "oral-pathology", title: "Oral Pathology" },
          { id: "sleep-apnea", title: "Sleep Apnea" },
          { id: "dental-crowns", title: "Dental Crowns" },
          { id: "tooth-extraction", title: "Tooth Extraction" },
          { id: "gum-disease-treatment", title: "Gum Disease Treatment" }
        ]);
      }

      try {
        // Fetch doctors
        console.log('Fetching doctors...');
        const doctorsResponse = await fetch(`${API_BASE}/api/doctors`);
        console.log('Doctors response status:', doctorsResponse.status);
        
        if (doctorsResponse.ok) {
          const doctorsData = await doctorsResponse.json();
          console.log('Doctors data:', doctorsData);
          
          if (doctorsData.success && doctorsData.doctors) {
            setDoctors(doctorsData.doctors);
          }
        } else {
          throw new Error('Failed to fetch doctors');
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        // Fallback to static data if API fails
        setDoctors([
          { 
            id: "dr-michael-smith", 
            name: "Dr. Michael Smith", 
            specialization: "General Dentistry",
            experience: "15+ years"
          },
          { 
            id: "dr-emily-davis", 
            name: "Dr. Emily Davis", 
            specialization: "Orthodontics",
            experience: "12+ years"
          },
          { 
            id: "dr-sarah-kim", 
            name: "Dr. Sarah Kim", 
            specialization: "Oral Surgery",
            experience: "10+ years"
          }
        ]);
      }
    };

    fetchData();
  }, []);

  // Fetch available time slots when date changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (formData.date) {
        try {
          console.log('Fetching time slots for date:', formData.date);
          const response = await fetch(`${API_BASE}/api/appointments/slots?date=${formData.date}`);
          console.log('Time slots response status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('Time slots data:', data);
            
            if (data.success && data.availableSlots) {
              setTimeSlots(data.availableSlots);
            } else {
              setTimeSlots([]);
            }
          } else {
            throw new Error('Failed to fetch time slots');
          }
        } catch (error) {
          console.error('Error fetching time slots:', error);
          // Fallback to generated slots if API fails
          const slots = [];
          const selectedDate = new Date(formData.date);
          const dayOfWeek = selectedDate.getDay();
          
          // Clinic hours: 8am-1pm and 4pm-9pm
          // Closed on Sundays (0)
          if (dayOfWeek !== 0) {
            // Morning slots
            for (let hour = 8; hour < 13; hour++) {
              slots.push(`${hour}:00 AM`);
              slots.push(`${hour}:30 AM`);
            }
            
            // Afternoon slots
            for (let hour = 4; hour < 9; hour++) {
              slots.push(`${hour}:00 PM`);
              slots.push(`${hour}:30 PM`);
            }
          }
          
          setTimeSlots(slots);
        }
      }
    };

    fetchTimeSlots();
  }, [formData.date]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      console.log('Submitting appointment with data:', {
        patientName: formData.name,
        patientEmail: formData.email,
        patientPhone: formData.phone,
        service: formData.service,
        doctor: formData.doctor,
        date: formData.date,
        time: formData.time,
        notes: formData.message
      });

      const response = await fetch(`${API_BASE}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientName: formData.name,
          patientEmail: formData.email,
          patientPhone: formData.phone,
          service: formData.service,
          doctor: formData.doctor,
          date: formData.date,
          time: formData.time,
          notes: formData.message
        }),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Success response:', data);
      
      if (data.success) {
        setSubmitSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: "",
          time: "",
          service: "",
          doctor: "",
          message: "",
        });
      } else {
        throw new Error(data.message || 'Booking failed');
      }
      
    } catch (error) {
      console.error('Appointment booking error:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setSubmitError("Unable to connect to the server. Please check if the backend is running and try again.");
      } else {
        setSubmitError(error.message || "There was an error submitting your appointment. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="appointment-booking-page">
      <div className="appointment-header">
        <h1>Book Your Appointment</h1>
        <p>Schedule your visit with our dental experts</p>
      </div>

      <div className="appointment-content">
        <div className="appointment-container">
          <div className="appointment-info">
            <h2>Why Book an Appointment?</h2>
            <p>
              Regular dental check-ups are essential for maintaining optimal oral health.
              Our team of experienced dentists provides comprehensive care tailored to
              your specific needs.
            </p>
            <div className="appointment-benefits">
              <div className="benefit-item">
                <div className="benefit-icon">⏱️</div>
                <div className="benefit-text">
                  <h3>Convenient Scheduling</h3>
                  <p>Choose from morning and evening slots that fit your schedule</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">🦷</div>
                <div className="benefit-text">
                  <h3>Expert Care</h3>
                  <p>Our specialists provide top-quality dental services</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">📱</div>
                <div className="benefit-text">
                  <h3>Appointment Reminders</h3>
                  <p>Receive notifications before your scheduled visit</p>
                </div>
              </div>
            </div>
          </div>

          <div className="appointment-form-container">
            {submitSuccess ? (
              <div className="success-message">
                <h2>Appointment Scheduled!</h2>
                <p>Thank you for booking with DentoCare+. We've sent a confirmation to your email.</p>
                <p>Our team will contact you shortly to confirm your appointment.</p>
                <button 
                  className="book-another-btn"
                  onClick={() => setSubmitSuccess(false)}
                >
                  Book Another Appointment
                </button>
              </div>
            ) : (
              <form className="appointment-form" onSubmit={handleSubmit}>
                <h2>Appointment Details</h2>
                
                <div className="form-group">
                  <label htmlFor="service">Select Service*</label>
                  <select 
                    id="service" 
                    name="service" 
                    value={formData.service}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select a Service --</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="doctor">Select Doctor*</label>
                  <select 
                    id="doctor" 
                    name="doctor" 
                    value={formData.doctor}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select a Doctor --</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                  <small className="form-hint">Choose your preferred doctor for the appointment</small>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">Preferred Date*</label>
                    <input 
                      type="date" 
                      id="date" 
                      name="date" 
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="time">Preferred Time*</label>
                    <select 
                      id="time" 
                      name="time" 
                      value={formData.time}
                      onChange={handleChange}
                      disabled={!formData.date}
                      required
                    >
                      <option value="">-- Select a Time --</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                    {!formData.date && (
                      <small className="form-hint">Please select a date first</small>
                    )}
                    {formData.date && timeSlots.length === 0 && (
                      <small className="form-hint">No appointments available on this date</small>
                    )}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="name">Full Name*</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address*</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number*</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Additional Notes</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    value={formData.message}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Please mention any specific concerns or questions"
                  ></textarea>
                </div>
                
                {submitError && (
                  <div className="error-message">{submitError}</div>
                )}
                
                <button 
                  type="submit" 
                  className="submit-btn" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-column">
            <h3>Navigation</h3>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/services">Services</a>
              </li>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact Us</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Services</h3>
            <ul>
              <li>
                <a href="/service/oral-pathology">Dental Implants</a>
              </li>
              <li>
                <a href="/service/anesthesia">Root Canal</a>
              </li>
              <li>
                <a href="/service/bone-grafting">Orthodontic Treatment</a>
              </li>
              <li>
                <a href="/service/tooth-extraction">Cosmetic Dentistry</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Timing</h3>
            <p>8:00am - 1:00pm</p>
            <p>4:00pm - 9:00pm</p>
          </div>

          <div className="footer-column">
            <h3>Find Us</h3>
            <p>9874563210</p>
            <p>dentocareplus@gmail.com</p>
            <p>Irla, Vile Parle (west), Mumbai-400056</p>
            <div className="footer-social">
              <a href="#" className="footer-social-icon">
                <img src={facebookIcon} alt="Facebook" />
              </a>
              <a href="#" className="footer-social-icon">
                <img src={twitterIcon} alt="Twitter" />
              </a>
              <a href="#" className="footer-social-icon">
                <img src={instagramIcon} alt="Instagram" />
              </a>
              <a href="#" className="footer-social-icon">
                <img src={linkedinIcon} alt="LinkedIn" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Dentocare+. All rights reserved.
          </p>
        </div>
      </footer>
    </div>

  );
}

export default AppointmentBooking;