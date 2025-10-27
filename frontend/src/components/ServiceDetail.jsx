import { useParams, Link } from "react-router-dom";
import "./ServiceDetail.css";

const serviceDetails = {
  "wisdom-tooth-extraction": {
    title: "Wisdom Tooth Extraction",
    fullDescription: "Wisdom tooth extraction is a common dental procedure that involves removing one or more of the third molars, commonly known as wisdom teeth. These teeth typically emerge in late teens or early twenties and often cause problems due to lack of space in the mouth. Our experienced dental surgeons use the latest techniques and equipment to ensure a comfortable and safe extraction process. We provide comprehensive pre-operative consultation, pain management during the procedure, and detailed post-operative care instructions.",
    benefits: [
      "Relief from pain and discomfort",
      "Prevention of overcrowding",
      "Reduced risk of infection",
      "Improved oral hygiene",
      "Prevention of damage to adjacent teeth"
    ],
    duration: "30-60 minutes per tooth",
    recovery: "3-7 days"
  },
  "tooth-whitening": {
    title: "Tooth Whitening",
    fullDescription: "Professional tooth whitening is a safe and effective cosmetic dental procedure that can significantly brighten your smile. Our advanced whitening treatments can remove years of stains and discoloration caused by coffee, tea, wine, smoking, and natural aging. We offer both in-office and take-home whitening options to suit your lifestyle and preferences. Our professional-grade whitening agents are much more effective than over-the-counter products and provide longer-lasting results.",
    benefits: [
      "Dramatically whiter teeth",
      "Improved self-confidence",
      "Safe and professional treatment",
      "Long-lasting results",
      "Customized treatment plans"
    ],
    duration: "60-90 minutes per session",
    recovery: "No downtime required"
  },
  "dental-implants": {
    title: "Dental Implants",
    fullDescription: "Dental implants are the gold standard for replacing missing teeth. They consist of a titanium post that is surgically placed into the jawbone, acting as an artificial tooth root. Once the implant integrates with the bone, a crown is attached to restore the appearance and function of the missing tooth. Our implant specialists use state-of-the-art technology including 3D imaging and computer-guided surgery to ensure precise placement and optimal results. Dental implants can replace single teeth, multiple teeth, or even support full dentures.",
    benefits: [
      "Permanent solution for missing teeth",
      "Natural look and feel",
      "Preserves jawbone structure",
      "No impact on adjacent teeth",
      "Improved chewing and speaking"
    ],
    duration: "3-6 months total treatment time",
    recovery: "1-2 weeks for initial healing"
  },
  "root-canal-treatment": {
    title: "Root Canal Treatment",
    fullDescription: "Root canal treatment, also known as endodontic therapy, is a procedure designed to save a severely damaged or infected tooth. The treatment involves removing the infected or inflamed pulp from inside the tooth, cleaning and disinfecting the root canals, and then filling and sealing the space. Contrary to popular belief, modern root canal treatment is typically no more uncomfortable than having a large filling. Our advanced techniques and anesthesia ensure a comfortable experience while preserving your natural tooth.",
    benefits: [
      "Saves your natural tooth",
      "Eliminates pain and infection",
      "Prevents spread of infection",
      "Cost-effective compared to extraction",
      "Maintains natural bite and jaw alignment"
    ],
    duration: "60-90 minutes per session",
    recovery: "2-3 days for initial healing"
  },
  "orthodontic": {
    title: "Orthodontic Treatment",
    fullDescription: "Orthodontic treatment involves the use of braces, aligners, and other appliances to gradually move teeth into their proper positions. Our orthodontic services address various issues including crooked teeth, gaps, overbites, underbites, and other bite problems. We offer traditional metal braces, ceramic braces, and clear aligners to suit different preferences and lifestyles. Our experienced orthodontists create personalized treatment plans to achieve optimal results in the shortest time possible.",
    benefits: [
      "Straighter, more attractive smile",
      "Improved bite function",
      "Better oral hygiene",
      "Reduced risk of dental problems",
      "Increased self-confidence"
    ],
    duration: "12-24 months average",
    recovery: "No downtime, adjustment period"
  },
  "cosmetic-dentistry": {
    title: "Cosmetic Dentistry",
    fullDescription: "Cosmetic dentistry focuses on improving the appearance of your teeth, gums, and overall smile. Our cosmetic services include veneers, bonding, contouring, and smile makeovers designed to address various aesthetic concerns. We combine artistry with advanced dental techniques to create beautiful, natural-looking results. Whether you want to fix chipped teeth, close gaps, or completely transform your smile, we have the expertise and technology to help you achieve your goals.",
    benefits: [
      "Enhanced smile appearance",
      "Improved self-confidence",
      "Natural-looking results",
      "Customized treatment plans",
      "Long-lasting improvements"
    ],
    duration: "Varies by treatment",
    recovery: "Minimal to no downtime"
  },
  "pediatric-dentistry": {
    title: "Pediatric Dentistry",
    fullDescription: "Pediatric dentistry focuses on the oral health of children from infancy through the teenage years. Our pediatric specialists are trained to handle the unique dental needs of children and create a positive, comfortable experience that sets the foundation for lifelong oral health. We provide comprehensive dental care including preventive treatments, restorative procedures, and education for both children and parents. Our child-friendly approach helps reduce anxiety and makes dental visits enjoyable.",
    benefits: [
      "Specialized care for children",
      "Child-friendly environment",
      "Early detection of dental issues",
      "Preventive care education",
      "Positive dental experiences"
    ],
    duration: "30-45 minutes",
    recovery: "No downtime required"
  },
  "dental-fillings": {
    title: "Dental Fillings",
    fullDescription: "Dental fillings are used to restore teeth that have been damaged by decay or trauma. We offer various filling materials including composite resin, porcelain, and amalgam to match your specific needs and preferences. Our modern filling techniques ensure optimal comfort during the procedure and long-lasting results. We use tooth-colored materials whenever possible to maintain the natural appearance of your smile while restoring full function to your teeth.",
    benefits: [
      "Restores tooth function",
      "Prevents further decay",
      "Natural appearance",
      "Durable and long-lasting",
      "Minimally invasive procedure"
    ],
    duration: "30-60 minutes",
    recovery: "24-48 hours for sensitivity"
  },
  "dental-checkup": {
    title: "Dental Checkup",
    fullDescription: "Regular dental checkups are essential for maintaining optimal oral health and preventing dental problems before they become serious. Our comprehensive examinations include thorough cleaning, detailed inspection of teeth and gums, and early detection of potential issues. During your checkup, our experienced dentists use advanced diagnostic tools including digital X-rays and intraoral cameras to provide a complete assessment of your oral health. We also provide personalized oral hygiene instructions and preventive care recommendations.",
    benefits: [
      "Early detection of dental problems",
      "Professional teeth cleaning",
      "Preventive care and education",
      "Oral cancer screening",
      "Maintains optimal oral health"
    ],
    duration: "45-60 minutes",
    recovery: "No downtime required"
  },
  "bone-grafting": {
    title: "Bone Grafting",
    fullDescription: "Bone grafting is a surgical procedure that replaces missing bone in the jaw to provide a stable foundation for dental implants or to improve facial structure. This procedure is often necessary when bone loss has occurred due to tooth loss, gum disease, or trauma. We use advanced grafting materials and techniques to promote natural bone regeneration. The procedure helps restore proper jaw function and creates the necessary bone volume for successful implant placement.",
    benefits: [
      "Restores jawbone structure",
      "Enables dental implant placement",
      "Improves facial support",
      "Prevents further bone loss",
      "Enhances oral function"
    ],
    duration: "1-2 hours",
    recovery: "1-2 weeks initial healing"
  },
  "oral-pathology": {
    title: "Oral Pathology",
    fullDescription: "Oral pathology involves the diagnosis and treatment of diseases that affect the oral and maxillofacial region. Our specialists are trained to identify and manage various conditions including oral cancers, cysts, infections, and autoimmune disorders. Early detection and proper treatment of oral pathological conditions are crucial for maintaining oral health and overall well-being. We use advanced diagnostic techniques and work closely with other medical specialists when necessary to provide comprehensive care.",
    benefits: [
      "Early disease detection",
      "Comprehensive diagnosis",
      "Specialized treatment plans",
      "Coordination with medical specialists",
      "Improved oral health outcomes"
    ],
    duration: "Varies by condition",
    recovery: "Depends on treatment"
  },
  "sleep-apnea": {
    title: "Sleep Apnea Treatment",
    fullDescription: "Sleep apnea is a serious sleep disorder where breathing repeatedly stops and starts during sleep. Our dental sleep medicine specialists offer oral appliance therapy as an effective alternative to CPAP machines for treating mild to moderate sleep apnea. Custom-made oral appliances help keep the airway open during sleep by repositioning the jaw and tongue. This treatment can significantly improve sleep quality and reduce the health risks associated with sleep apnea, including daytime fatigue and cardiovascular problems.",
    benefits: [
      "Improved sleep quality",
      "Reduced snoring",
      "Alternative to CPAP",
      "Comfortable and portable",
      "Better overall health"
    ],
    duration: "2-3 appointments",
    recovery: "Adjustment period of 1-2 weeks"
  },
  "dental-crowns": {
    title: "Dental Crowns",
    fullDescription: "Dental crowns are tooth-shaped caps that completely cover a damaged tooth to restore its shape, size, strength, and appearance. Crowns are recommended for teeth that are severely decayed, cracked, or weakened by large fillings. We offer various crown materials including porcelain, ceramic, and metal alloys. Our crowns are custom-made to match your natural teeth in color and shape, providing both functional and aesthetic benefits while protecting your tooth from further damage.",
    benefits: [
      "Restores tooth strength",
      "Improves appearance",
      "Long-lasting protection",
      "Natural look and feel",
      "Prevents further damage"
    ],
    duration: "2 appointments over 2-3 weeks",
    recovery: "Few days for adjustment"
  },
  "tooth-extraction": {
    title: "Tooth Extraction",
    fullDescription: "Tooth extraction is the removal of a tooth from its socket in the bone. While we always try to preserve natural teeth, extraction may be necessary due to severe decay, advanced gum disease, trauma, or overcrowding. Our experienced oral surgeons use gentle techniques and effective anesthesia to ensure patient comfort during the procedure. We provide comprehensive post-operative care instructions to promote proper healing and minimize discomfort during the recovery period.",
    benefits: [
      "Relief from pain and infection",
      "Prevents spread of disease",
      "Creates space for orthodontics",
      "Improves oral health",
      "Minimally invasive techniques"
    ],
    duration: "15-45 minutes",
    recovery: "3-7 days"
  },
  "gum-disease-treatment": {
    title: "Gum Disease Treatment",
    fullDescription: "Gum disease, also known as periodontal disease, is an infection of the tissues that surround and support your teeth. Our periodontal specialists offer comprehensive treatment ranging from non-surgical therapy to advanced surgical procedures. Early intervention is key to preventing tooth loss and maintaining overall oral health. We provide personalized treatment plans based on the severity of the condition and individual patient needs, using the latest techniques to restore gum health.",
    benefits: [
      "Prevents tooth loss",
      "Reduces inflammation",
      "Improves overall health",
      "Eliminates bad breath",
      "Restores gum health"
    ],
    duration: "Multiple appointments",
    recovery: "1-2 weeks per treatment"
  }
};

function ServiceDetail() {
  const { serviceId } = useParams();
  const service = serviceDetails[serviceId];

  if (!service) {
    return (
      <div className="service-detail-container">
        <div className="service-not-found">
          <h2 className="not-found-title">Service Not Found</h2>
          <p className="not-found-text">The requested service could not be found.</p>
          <Link to="/services" className="back-to-services">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="service-detail-container">
      <div className="service-detail-layout">
        {/* Main Content - Left Side */}
        <div className="main-treatment-content">
          <section className="treatment-section">
            <h1 className="treatment-title">About This Treatment</h1>
            <p className="treatment-description">
              {service.fullDescription}
            </p>
          </section>

          <hr className="section-divider" />

          <section className="benefits-section">
            <h2 className="benefits-title">Benefits</h2>
            <ul className="benefits-list">
              {service.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* Sidebar - Right Side */}
        <div className="treatment-sidebar">
          <div className="info-card">
            <h3 className="info-card-title">Treatment Information</h3>
            <div className="treatment-info">
              <div className="info-row">
                <span className="info-label">Duration:</span>
                <span className="info-value">{service.duration}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Recovery:</span>
                <span className="info-value">{service.recovery}</span>
              </div>
            </div>
          </div>

          <div className="consultation-card">
            <h3 className="consultation-title">Schedule Consultation</h3>
            <p className="consultation-text">
              Ready to get started? Book an appointment for your consultation.
            </p>
            <Link to="/appointment" className="schedule-btn">
              Schedule Appointment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetail;