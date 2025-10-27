import { useNavigate } from "react-router-dom";
import "./Home.css";
import heroImage from "../assets/images/hero_image.svg";
import aboutImage from "../assets/images/about_image.png";
import reviewImg from "../assets/images/review_img.jpg";
import oralPathologyImage from "../assets/images/oralPathology.png";
import toothExtractionImage from "../assets/images/toothExtraction.png";
import boneGraftingImage from "../assets/images/boneGrafting.png";
import sleepApneaImage from "../assets/images/sleepApnea.png";
import dentalCheckupImage from "../assets/images/dental_checkup.png";
import anesthesiaImage from "../assets/images/Aneasthesia.png";
import reachOutImage from "../assets/images/reach_out_img.avif";
import facebookIcon from "../assets/images/fb_img.png";
import instagramIcon from "../assets/images/ig_img.png";
import linkedinIcon from "../assets/images/linked_img.png";
import twitterIcon from "../assets/images/x_img.png";

function Home() {
  const navigate = useNavigate();

  const handleServiceClick = (serviceId) => {
    navigate(`/service/${serviceId}`);
  };

  return (
    <div className="dental-care-website">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="brand">DENTOCARE+</h1>
            <h2 className="tagline">
              REFINED CARE
              <br />
              RADIANT
              <br />
              SMILES
            </h2>
            <p className="subtitle">BOOK YOUR APPOINTMENT TODAY</p>
            <button
              className="appointment-btn"
              onClick={() => navigate("/appointment")}
            >
              SCHEDULE YOUR APPOINTMENT
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <h2 className="section-title">OUR SERVICES</h2>
        <div className="service-cards">
          <div
            className="service-card"
            onClick={() => handleServiceClick("oral-pathology")}
          >
            <div className="service-icon">
              <img src={oralPathologyImage} alt="Oral Pathology" />
            </div>
            <h3>Oral Pathology</h3>
            <button className="learn-more-btn">Learn More</button>
          </div>
          <div
            className="service-card"
            onClick={() => handleServiceClick("tooth-extraction")}
          >
            <div className="service-icon">
              <img src={toothExtractionImage} alt="Tooth Extraction" />
            </div>
            <h3>Tooth Extraction</h3>
            <button className="learn-more-btn">Learn More</button>
          </div>
          <div
            className="service-card"
            onClick={() => handleServiceClick("bone-grafting")}
          >
            <div className="service-icon">
              <img src={boneGraftingImage} alt="Bone Grafting" />
            </div>
            <h3>Bone Grafting</h3>
            <button className="learn-more-btn">Learn More</button>
          </div>
          <div
            className="service-card"
            onClick={() => handleServiceClick("sleep-apnea")}
          >
            <div className="service-icon">
              <img src={sleepApneaImage} alt="Sleep Apnea" />
            </div>
            <h3>Sleep Apnea</h3>
            <button className="learn-more-btn">Learn More</button>
          </div>
          <div
            className="service-card"
            onClick={() => handleServiceClick("dental-checkup")}
          >
            <div className="service-icon">
              <img
                src={dentalCheckupImage}
                alt="Dental Checkup"
                className="dental-checkup-icon"
              />
            </div>
            <h3>Dental Checkup</h3>
            <button className="learn-more-btn">Learn More</button>
          </div>
          <div
            className="service-card"
            onClick={() => handleServiceClick("anesthesia")}
          >
            <div className="service-icon">
              <img src={anesthesiaImage} alt="Anesthesia" />
            </div>
            <h3>Anesthesia</h3>
            <button className="learn-more-btn">Learn More</button>
          </div>
        </div>
      </section>

      {/* Combined Why Choose Us and About Section */}
      <section className="why-choose-about-section">
        {/* Why Choose Us Section */}
        <div className="why-choose-us-section">
          <h2 className="section-title white">WHY CHOOSE US?</h2>
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-number">3500+</div>
              <div className="stat-icon">👨‍💼</div>
              <div className="stat-text">
                Satisfied
                <br />
                Customers
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-number">10 YEARS</div>
              <div className="stat-icon">🧠</div>
              <div className="stat-text">Experience</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">2X FAST</div>
              <div className="stat-icon">🔧</div>
              <div className="stat-text">
                Modern
                <br />
                Equipment
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="about-section">
          <div className="about-content">
            <h2 className="section-title">ABOUT US</h2>
            <p className="about-text">
              At DentoCare+, We're More Than A Dental Clinic — We're A Team
              Dedicated To Delivering Compassionate Care And Confident Smiles.
              Our Culture Is Built On Trust, Innovation, And A Shared Passion
              For Patient Well-Being.
            </p>
            <button
              className="learn-more-btn"
              onClick={() => navigate("/about")}
            >
              Learn More
            </button>
          </div>
          <div className="about-image">
            <img src={aboutImage} alt="About DentoCare+" />
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <h2 className="section-title">REVIEWS</h2>
        <div className="review-cards">
          <div className="review-card">
            <img src={reviewImg} alt="Patient" className="review-image" />
            <div className="review-content">
              <p className="review-text">
                I Had An Amazing Experience At The Clinic. The Doctors Explained
                Everything Clearly And Ensured I Was Comfortable During My Root
                Canal. The Equipment Used Was Modern, And Hygiene Was Top-Notch.
                I Highly Recommend Them For Any Dental Needs.
              </p>
              <p className="reviewer-name">Riya Malhotra</p>
            </div>
          </div>
          <div className="review-card">
            <img src={reviewImg} alt="Patient" className="review-image" />
            <div className="review-content">
              <p className="review-text">
                The Team At This Clinic Is Simply Outstanding And Made Every
                Visit Comfortable. Their Care And Clarity Throughout My
                Treatment Impressed Me Deeply. I Came For Scaling And Polishing,
                And They Handled It With Precision, Ensuring A Bright, Clean
                Finish. It's Now My Trusted Place For Dental Issues
              </p>
              <p className="reviewer-name">Kunal Bhate</p>
            </div>
          </div>
          <div className="review-card">
            <img src={reviewImg} alt="Patient" className="review-image" />
            <div className="review-content">
              <p className="review-text">
                The Clinic Offers Truly Excellent Care With A Warm And Welcoming
                Staff. From The Moment I Entered, I Felt Reassured By The Team's
                Expertise. They Handled My Dental Fillings With Zero Pain And
                Explained Each Step Clearly. The Clinic Is Modern, Clean, And
                Follows Strict Hygiene Protocols.
              </p>
              <p className="reviewer-name">Ayesha Naik</p>
            </div>
          </div>
        </div>
        <button className="see-more-btn" onClick={() => navigate("/reviews")}>
          SEE MORE REVIEWS
        </button>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="contact-content">
          <div className="contact-text">
            <h2 className="contact-title">
              GET
              <br />
              IN TOUCH
            </h2>
            <div className="contact-illustration">
              <img src={reachOutImage} alt="Get in Touch" />
            </div>
          </div>
          <div className="contact-form">
            <div className="form-group">
              <input type="text" placeholder="Full Name" />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Email" />
            </div>
            <div className="form-group">
              <input type="tel" placeholder="Mobile No." />
            </div>
            <div className="form-group">
              <textarea placeholder="Message"></textarea>
            </div>
            <button className="submit-btn">SUBMIT</button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-column">
            <h3>Navigation</h3>
            <ul>
              <li>
                <button onClick={() => navigate("/")} className="footer-link">
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/services")}
                  className="footer-link"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/about")}
                  className="footer-link"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/contact")}
                  className="footer-link"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Services</h3>
            <ul>
              <li>
                <button
                  onClick={() => navigate("/service/dental-implants")}
                  className="footer-link"
                >
                  Dental Implants
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/service/root-canal-treatment")}
                  className="footer-link"
                >
                  Root Canal
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/service/orthodontic")}
                  className="footer-link"
                >
                  Orthodontic Treatment
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/service/cosmetic-dentistry")}
                  className="footer-link"
                >
                  Cosmetic Dentistry
                </button>
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

export default Home;
