import React, { useState } from "react";
import "./ContactUs.css";
import facebookIcon from "../assets/images/fb_img.png";
import instagramIcon from "../assets/images/ig_img.png";
import linkedinIcon from "../assets/images/linked_img.png";
import twitterIcon from "../assets/images/x_img.png";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to a server
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <div className="contact-page">
      {/* Contact Hero Section */}
      <section className="contact-hero" style={{ backgroundColor: '#2c2c2c', padding: '120px 0 80px', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '4rem', 
          color: 'white', 
          fontWeight: '300', 
          letterSpacing: '0.2em', 
          margin: '0', 
          marginBottom: '20px', 
          textAlign: 'center',
          backgroundColor: 'transparent'
        }}>
          CONTACT US
        </h1>
        <p style={{ 
          fontSize: '18px', 
          maxWidth: '700px', 
          margin: '0 auto', 
          lineHeight: '1.6',
          color: '#ffffff'
        }}>
          We're here to help with all your dental care needs. Reach out to us
          with any questions or to schedule an appointment.
        </p>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="contact-container">
          <div className="contact-info">
            <h2>Get In Touch</h2>
            <p>
              We'd love to hear from you. Fill out the form and our team will
              get back to you as soon as possible.
            </p>

            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="location-icon"></i>
                </div>
                <div className="contact-text">
                  <h3>Address</h3>
                  <p>Irla, Vile Parle (west), Mumbai-400056</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="phone-icon"></i>
                </div>
                <div className="contact-text">
                  <h3>Phone</h3>
                  <p>9874563210</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="email-icon"></i>
                </div>
                <div className="contact-text">
                  <h3>Email</h3>
                  <p>dentocareplus@gmail.com</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="clock-icon"></i>
                </div>
                <div className="contact-text">
                  <h3>Hours</h3>
                  <p>8:00am - 1:00pm</p>
                  <p>4:00pm - 9:00pm</p>
                </div>
              </div>
            </div>

            <div className="social-links">
              <a href="#" className="social-icon">
                <img src={facebookIcon} alt="Facebook" />
              </a>
              <a href="#" className="social-icon">
                <img src={twitterIcon} alt="Twitter" />
              </a>
              <a href="#" className="social-icon">
                <img src={instagramIcon} alt="Instagram" />
              </a>
              <a href="#" className="social-icon">
                <img src={linkedinIcon} alt="LinkedIn" />
              </a>
            </div>
          </div>

          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <h2>Send Us a Message</h2>

              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
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
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-button">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.0123302335897!2d72.83399931490213!3d19.10801638706531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9b888ae67fd%3A0xe0b9538d623ac5d2!2sIrla%2C%20Vile%20Parle%20West%2C%20Mumbai%2C%20Maharashtra%20400056!5e0!3m2!1sen!2sin!4v1628151788463!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Dental Clinic Location"
          ></iframe>
        </div>
      </section>

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
};

export default ContactUs;