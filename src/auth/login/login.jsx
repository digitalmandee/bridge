import React from "react";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logopic.png';
import profile from '../../assets/profile.png';
import './login.css';


const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Perform any login logic here (e.g., authentication)
    // After successful login, navigate to the home screen
    navigate("/dashboard");
  };

  return (
    <>
      <div className="login-container">
        <div className="logo-container">
          <img src={logo} alt="Welcome to Bridge" className="logo-image" />
        </div>
        <div className="login-card">
          <div className="avatar-container">
            <img src={profile} alt="User" className="avatar-icon" />
          </div>
          <h2 className="login-heading">Log In</h2>
          <form className="login-form">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
            />
            <label htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
            />
            <div className="forgot-password">Forgot password?</div>
            <button type="submit" className="login-button">
              Log in
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;