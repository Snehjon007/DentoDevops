import "./Reviews.css";
import facebookIcon from "../assets/images/fb_img.png";
import instagramIcon from "../assets/images/ig_img.png";
import linkedinIcon from "../assets/images/linked_img.png";
import twitterIcon from "../assets/images/x_img.png";

const reviewsData = [
  {
    id: 1,
    name: "Riya Malhotra",
    review:
      "I Had An Amazing Experience At This Clinic. The Doctors Explained Everything Clearly And Ensured I Was Comfortable During My Root Canal. The Equipment Used Was Modern, And Hygiene Was Top-Notch. I Highly Recommend Them For Any Dental Needs.",
  },
  {
    id: 2,
    name: "Arjun Mehra",
    review:
      "This Clinic Has Completely Transformed How I Feel About Visiting The Dentist. I Had Been Anxious About Dental Procedures, But Their Team Guided Me Patiently Through Every Step. From The Reception To The Surgical Process, Everything Was Seamless. They Used The Latest Equipment, Explained The Entire Process In Detail, And Took Extra Care To Ensure Recovery Was Smooth. Even The Support Staff Checked In To Make Sure I Was Doing Well. It's A Full-Service Clinic That Truly Values Its Patients. I Would Trust Them With Any Dental Treatment Moving Forward.",
  },
  {
    id: 3,
    name: "Sneha Kapoor",
    review:
      "The Clinic Team Did A Wonderful Job With My Daughter's Orthodontic Care. Every Appointment Was Well-Organized, And The Staff Made Her Feel Comfortable And Safe, Which Really Helped Ease Her Anxiety. Great Results And Even Better Service.",
  },
  {
    id: 4,
    name: "Vikram Singh",
    review:
      "Had A Painless Experience During My Wisdom Tooth Extraction. The Team Kept Me Calm And Handled The Procedure Quickly. Healing Was Fast And Smooth. They Also Gave Me A Follow-Up Call To Ensure Everything Was Healing Properly, Which Really Showed They Care.",
  },
  {
    id: 5,
    name: "Meenal Vyas",
    review:
      "The Dental Team Here Made Me Feel At Ease From The Moment I Walked In. Their Approach To Patient Care Is Gentle, Detailed, And Focused On Long-Term Health. I Had A Root Canal Done And The Entire Process Was Quick, Efficient, And Pain-Free. I've Never Felt This Comfortable At A Dental Clinic Before. I'll Be Back Soon.",
  },
  {
    id: 6,
    name: "Kunal Bhate",
    review:
      "The Team At This Clinic Is Simply Outstanding And Made Every Visit Comfortable. Their Care And Clarity Throughout My Treatment Impressed Me Deeply. I Came For Scaling And Polishing, And They Handled It With Precision, Ensuring A Bright, Clean Finish. It's Now My Trusted Place For All Dental Care.",
  },
  {
    id: 7,
    name: "Ayesha Naik",
    review:
      "The Clinic Offers Truly Excellent Care With A Warm And Welcoming Staff. From The Moment I Entered, I Felt Reassured By The Team's Expertise. They Handled My Dental Issues With Zero Pain And Explained Each Step Clearly. The Clinic Is Modern, Clean, And Follows Strict Hygiene Protocols.",
  },
  {
    id: 8,
    name: "Samuel D'Souza",
    review:
      "This Clinic Provided Exceptional Care From Consultation To Final Treatment. The Team Explained Everything Well And Ensured I Stayed Relaxed Always. My Tooth Extraction Was Done Quickly And Without Any Discomfort At All. Clean Space, Modern Tools, And Calm Environment Made It A Great Experience. I Highly Recommend Them To Others. The Aftercare Support Was Helpful Too. They Follow Up And Check Your Progress.",
  },
  {
    id: 9,
    name: "Tanvi Deshmukh",
    review:
      "The Entire Dental Team Was Amazing Through Every Stage Of My Treatment. I Had Deep Cleaning And Whitening, And The Results Were Clearly Visible. They Used Advanced Tools And Made Sure I Felt Safe And Informed Always. Appointments Were Quick And Smooth, With Strict Hygiene And Great Results.",
  },
];

function Reviews() {
  return (
    <div className="reviews-page">
      <div className="reviews-header">
        <div className="container">
          <h1>REVIEWS</h1>
          <p className="reviews-subtitle">
            SEE WHAT OUR PATIENTS HAVE TO SAY ABOUT OUR SERVICE
          </p>
        </div>
      </div>

      <div className="reviews-content">
        <div className="container">
          <div className="reviews-grid">
            {reviewsData.map((review) => (
              <div key={review.id} className="review-card">
                <p className="review-text">{review.review}</p>
                <h4 className="reviewer-name">{review.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="reviews-bottom-text">
        <div className="container">
          <p>
            At Our Dental Clinic, Patient Satisfaction Is At The Heart Of
            Everything We Do. With A Team-Based Approach And The Latest
            Technology, We Strive To Make Every Treatment Comfortable, Precise,
            And Tailored To Individual Needs. These Real Stories Reflect Our
            Dedication To Providing Exceptional Care In A Safe, Friendly, And
            Hygienic Environment — Where Every Smile Matters.
          </p>
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

export default Reviews;
