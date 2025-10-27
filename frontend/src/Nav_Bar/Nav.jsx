import { Link, useNavigate } from "react-router-dom";
import "./Nav.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo"></div>
        <div className="nav-menu">
          <Link to="/" className="nav-link">
            HOME
          </Link>
          <Link to="/services" className="nav-link">
            SERVICES
          </Link>
          <Link to="/about" className="nav-link">
            ABOUT US
          </Link>
          <Link to="/reviews" className="nav-link">
            REVIEWS
          </Link>
          <Link to="/contact" className="nav-link">
            CONTACT US
          </Link>
          <button className="login-btn" onClick={handleLoginClick}>
            LOGIN
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
