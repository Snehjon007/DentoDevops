import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Navbar from "./Nav_Bar/Nav";
import Home from "./components/Home";
import Services from "./components/Services";
import ServiceDetail from "./components/ServiceDetail";
import AboutUs from "./components/AboutUs";
import Reviews from "./components/Reviews";
import ContactUs from "./components/ContactUs";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import AppointmentBooking from "./components/AppointmentBooking";
import PatientDashboard from "./components/PatientDashboard";
import StaffDashboard from "./components/StaffDashboard";

function AppContent() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" || 
    location.pathname === "/signup" || 
    location.pathname === "/patient-dashboard" ||
    location.pathname === "/staff-dashboard";

  return (
    <div className="App">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/service/:serviceId" element={<ServiceDetail />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/appointment" element={<AppointmentBooking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
