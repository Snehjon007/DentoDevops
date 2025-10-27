import "./AboutUs.css";
import facebookIcon from "../assets/images/fb_img.png";
import instagramIcon from "../assets/images/ig_img.png";
import linkedinIcon from "../assets/images/linked_img.png";
import twitterIcon from "../assets/images/x_img.png";
import patientCenteredImage from "../assets/images/patient centered.jpg";
import integratedTechImage from "../assets/images/integrated technology.webp";
import personalizedImage from "../assets/images/personalized.jpeg";
import affordableImage from "../assets/images/affordable.jpg";

function AboutUs() {
  return (
    <div className="about-page">
      <div className="about-header">
        <div className="container">
          <h1>About Us</h1>
          <p className="about-subtitle">
            At DentoCare, We're More Than A Dental Clinic – We're A Team
            Dedicated To Delivering Compassionate Care And Confident Smiles. Our
            Culture Is Built On Trust, Innovation, And A Shared Passion For
            Patient Well-Being.
          </p>
        </div>
      </div>

      <div className="about-content">
        <div className="container">
          {/* Row 1: Image (left) + Text (right) */}
          <div className="about-section-row">
            <div className="about-image">
              <img src={patientCenteredImage} alt="Patient-Centered Care" />
            </div>
            <div className="about-text">
              <h2>Patient-Centered, Expert Care</h2>
              <p>
                We Love Our Patients. Our Entire Practice Is Built Around Their
                Comfort And Well-Being Thoughtfully Designed Operations,
                Welcoming Waiting Areas, Minimal Wait Times. We Provide The
                World's Best Providers With An Environment Where They Can
                Thrive, Because They Deliver Exceptional Care. We Lead With
                Expertise And Compassion.
              </p>
            </div>
          </div>

          {/* Row 2: Text (left) + Image (right) */}
          <div className="about-section-row">
            <div className="about-text">
              <h2>Innovative, Integrated Technology</h2>
              <p>
                We're A Tech-Savvy, Future-Forward Team Equipped With
                First-In-Class Tools—And We Know How To Use Them. At DentoCare,
                Patients Can Easily Enter Their Medical History, Upload
                Insurance Details, And Book Future Appointments, Making Every
                Visit More Efficient, Effective, And Satisfying.
              </p>
            </div>
            <div className="about-image">
              <img src={integratedTechImage} alt="Integrated Technology" />
            </div>
          </div>

          {/* Row 3: Image (left) + Text (right) */}
          <div className="about-section-row">
            <div className="about-image">
              <img src={personalizedImage} alt="Personalized Experience" />
            </div>
            <div className="about-text">
              <h2>Personalized Patient Experience</h2>
              <p>
                We Know Our Patients' Names And Often, Their #Real Feelings
                About The Dentist. We'll Spend Quality Time With You To Really
                Understand Your Dental Needs, Then Send You Home With
                Personalized Recommendations For Taking Great Care Of Your
                Teeth.
              </p>
            </div>
          </div>

          {/* Row 4: Text (left) + Image (right) */}
          <div className="about-section-row">
            <div className="about-text">
              <h2>Affordable, Equitable Services</h2>
              <p>
                We're Transparent About All Pricing And Proposed Treatments, So
                You Always Know What To Expect No Surprises. With Flexible
                Options And Honest Communication, We Make Thoughtfully Designed
                Care Accessible And Affordable. Everyone Deserves A Healthy
                Smile Regardless Of Their Coverage.
              </p>
            </div>
            <div className="about-image">
              <img src={affordableImage} alt="Affordable Services" />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            <div className="faq-item">
              <div className="faq-question">
                <span>Can I Make An Emergency Appointment ?</span>
                <span className="faq-icon">+</span>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <span>How Do I Book Or Reschedule The Appointment ?</span>
                <span className="faq-icon">+</span>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <span>
                  What Are My Options If I Want To Pay In Installments ?
                </span>
                <span className="faq-icon">+</span>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <span>
                  Will I Know The Cost/Fees Before The Treatment Starts ?
                </span>
                <span className="faq-icon">+</span>
              </div>
            </div>
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

export default AboutUs;
