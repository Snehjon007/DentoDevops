import { Link } from "react-router-dom";
import "./Services.css";
import facebookIcon from "../assets/images/fb_img.png";
import instagramIcon from "../assets/images/ig_img.png";
import linkedinIcon from "../assets/images/linked_img.png";
import twitterIcon from "../assets/images/x_img.png";

const servicesData = [
  {
    id: "wisdom-tooth-extraction",
    title: "Wisdom Tooth Extraction",
    description:
      "Professional wisdom tooth extraction services with minimal discomfort and quick recovery.",
  },
  {
    id: "tooth-whitening",
    title: "Tooth Whitening",
    description:
      "Professional teeth whitening services for a brighter, more confident smile.",
  },
  {
    id: "dental-implants",
    title: "Dental Implants",
    description:
      "Permanent tooth replacement solution that looks and feels like natural teeth.",
  },
  {
    id: "root-canal-treatment",
    title: "Root Canal Treatment",
    description:
      "Save your natural tooth with our gentle and effective root canal therapy.",
  },
  {
    id: "orthodontic",
    title: "Orthodontic",
    description:
      "Straighten your teeth and improve your bite with our comprehensive orthodontic services.",
  },
  {
    id: "cosmetic-dentistry",
    title: "Cosmetic Dentistry",
    description:
      "Enhance your smile with our comprehensive cosmetic dental treatments.",
  },
  {
    id: "pediatric-dentistry",
    title: "Pediatric Dentistry",
    description:
      "Specialized dental care for children in a comfortable, child-friendly environment.",
  },
  {
    id: "dental-fillings",
    title: "Dental Fillings",
    description:
      "Restore damaged teeth with our high-quality, natural-looking dental fillings.",
  },
  {
    id: "dental-checkup",
    title: "Dental Checkup",
    description:
      "Comprehensive dental examination and preventive care to maintain optimal oral health and detect issues early.",
  },
  {
    id: "bone-grafting",
    title: "Bone Grafting",
    description:
      "Restore jawbone structure to support dental implants and improve oral health.",
  },
  {
    id: "oral-pathology",
    title: "Oral Pathology",
    description:
      "Diagnosis and treatment of diseases affecting the mouth, jaw, and surrounding tissues.",
  },
  {
    id: "sleep-apnea",
    title: "Sleep Apnea",
    description:
      "Dental solutions for sleep apnea to improve sleep quality and overall health.",
  },
  {
    id: "dental-crowns",
    title: "Dental Crowns",
    description:
      "Restore and protect damaged teeth with custom-made dental crowns.",
  },
  {
    id: "tooth-extraction",
    title: "Tooth Extraction",
    description:
      "Safe and comfortable tooth removal when preservation is not possible.",
  },
  {
    id: "gum-disease-treatment",
    title: "Gum Disease Treatment",
    description:
      "Comprehensive periodontal therapy to restore gum health and prevent tooth loss.",
  },
];

function Services() {
  return (
    <div className="services-page">
      <div className="services-header">
        <h1>SERVICES</h1>
        <p>What We Provide</p>
      </div>

      <div className="services-container">
        <div className="services-grid">
          {servicesData.map((service) => (
            <div key={service.id} className="service-card">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <Link to={`/service/${service.id}`} className="learn-more-btn">
                Learn More
              </Link>
            </div>
          ))}
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

export default Services;