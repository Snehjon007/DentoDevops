import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("patients");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    staffId: "",
    staffPassword: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  const validateStaffId = (staffId) => {
    return staffId.length <= 8 && staffId.length > 0;
  };

  const validateForm = () => {
    const newErrors = {};

    if (userType === "patients") {
      const emailOrPhone = formData.email.trim();

      if (!emailOrPhone) {
        newErrors.email = "Email or phone number is required";
      } else {
        // Check if it looks like an email (contains @)
        if (emailOrPhone.includes("@")) {
          if (!validateEmail(emailOrPhone)) {
            newErrors.email = "Please enter a valid email address";
          }
        } else {
          // Check if it's a valid phone number
          const cleanPhone = emailOrPhone.replace(/\D/g, '');
          if (!validatePhoneNumber(cleanPhone)) {
            newErrors.email = "Please enter a valid 10-digit phone number";
          }
        }
      }

      if (!formData.password.trim()) {
        newErrors.password = "Password is required";
      }
    } else {
      // Staff validation
      if (!formData.staffId.trim()) {
        newErrors.staffId = "Staff ID is required";
      } else if (!validateStaffId(formData.staffId.trim())) {
        newErrors.staffId = "Staff ID must be 8 digits or less";
      }

      if (!formData.staffPassword.trim()) {
        newErrors.staffPassword = "Password is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      try {
        let response;
        let apiUrl;
        let requestBody;

        if (userType === "patients") {
          // Patient login
          apiUrl = 'http://localhost:3001/api/auth/login';
          requestBody = {
            email: formData.email,
            password: formData.password
          };
        } else {
          // Staff login
          apiUrl = 'http://localhost:3001/api/auth/staff-login';
          requestBody = {
            staffId: formData.staffId,
            password: formData.staffPassword
          };
        }

        response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (data.success) {
          // Store user data in localStorage
          const userData = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email || data.user.staffId,
            userType: data.user.userType
          };
          localStorage.setItem("userData", JSON.stringify(userData));

          // Redirect based on user type
          if (userType === "patients") {
            navigate("/patient-dashboard");
          } else {
            navigate("/staff-dashboard");
          }
        } else {
          // Show error message - DON'T redirect
          setErrors({ backend: data.message });
          alert(data.message); // Show alert for wrong credentials
        }
      } catch (error) {
        setErrors({ backend: "Login failed. Please try again." });
        alert("Login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* User Type Toggle */}
          <div className="user-type-toggle">
            <button
              type="button"
              className={`toggle-btn ${userType === "patients" ? "active" : ""}`}
              onClick={() => {
                setUserType("patients");
                setErrors({});
                setFormData({
                  email: "",
                  password: "",
                  staffId: "",
                  staffPassword: "",
                  rememberMe: false,
                });
              }}
            >
              Patients
            </button>
            <button
              type="button"
              className={`toggle-btn ${userType === "staff" ? "active" : ""}`}
              onClick={() => {
                setUserType("staff");
                setErrors({});
                setFormData({
                  email: "",
                  password: "",
                  staffId: "",
                  staffPassword: "",
                  rememberMe: false,
                });
              }}
            >
              Dental Staff
            </button>
          </div>

          {userType === "patients" ? (
            // Patient Login Form
            <>
              <h1 className="login-title">Sign In</h1>
              <p className="login-subtitle">Welcome back! Please sign in to your account.</p>

              <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email or Phone Number</label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email or phone number"
                    className={errors.email ? "error" : ""}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={errors.password ? "error" : ""}
                  />
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <button 
                  type="submit" 
                  className="login-button primary"
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>

              <div className="signup-link">
                <span>Don't have an account? </span>
                <Link to="/signup" className="signup-text">
                  Sign up
                </Link>
              </div>
            </>
          ) : (
            // Staff Login Form
            <>
              <h1 className="login-title">Sign in as Staff</h1>
              <p className="login-subtitle">Sign in to access the dental practice management system.</p>

              <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="staffId">Staff ID</label>
                  <input
                    type="text"
                    id="staffId"
                    name="staffId"
                    value={formData.staffId}
                    onChange={handleChange}
                    placeholder="Enter your staff ID (max 8 digits)"
                    className={errors.staffId ? "error" : ""}
                    maxLength="8"
                  />
                  {errors.staffId && <span className="error-message">{errors.staffId}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="staffPassword">Password</label>
                  <input
                    type="password"
                    id="staffPassword"
                    name="staffPassword"
                    value={formData.staffPassword}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={errors.staffPassword ? "error" : ""}
                  />
                  {errors.staffPassword && <span className="error-message">{errors.staffPassword}</span>}
                </div>

                <div className="form-options">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    <span className="checkmark"></span>
                    Remember me
                  </label>
                  <Link to="/forgot-password" className="forgot-link">
                    Forgot password?
                  </Link>
                </div>

                <button 
                  type="submit" 
                  className="login-button staff"
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>

              <div className="staff-help">
                <span>Need access? Contact your practice administrator.</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;