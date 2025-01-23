import React from "react";
import admin from "../assets/admin.png"
import branch from "../assets/branch.png"
import invester from "../assets/invester.png"
import user from "../assets/user.png"
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const Welcome = () => {

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const styles = {
    container: {
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
      padding: "20px",
    },
    heading: {
      fontSize: "2rem",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    subHeading: {
      fontSize: "1.5rem",
      marginBottom: "30px",
    },
    accountTypeContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      marginBottom: "20px",
    },
    accountType: {
      width: "120px",
      textAlign: "center",
      cursor: "pointer",
    },
    accountImage: {
      width: "80px",
      height: "80px",
      objectFit: "contain",
      marginBottom: "10px",
    },
    footerLink: {
      color: "#007BFF",
      textDecoration: "none",
      fontSize: "0.9rem",
    },
    // logo: {
    //   position: "absolute",
    //   top: "10px",
    //   right: "10px",
    //   width: "50px",
    //   height: "50px",
    //   borderRadius: "50%",
    //   objectFit: "cover",
    // },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>
        Welcome to <span style={{ color: "#FFD700" }}>Bridge</span>
      </h1>
      <p style={styles.subHeading}>Choose Account Type</p>
      <div style={styles.accountTypeContainer}>
        {[
          { name: "Super Admin", img: admin, path: "/admin-dashboard" },
          { name: "Branch Login", img: branch, path: "/branch-dashboard" },
          { name: "Investor Login", img: invester, path: "/investor-dashboard" },
          { name: "User", img: user, path: "/user-dashboard" },
        ].map((account, index) => (
          <div key={index} 
          style={styles.accountType}
          onClick={() => handleNavigation(account.path)} 
          >
            <img
              src={account.img}
              alt={account.name}
              style={styles.accountImage}
            />
            <p>{account.name}</p>
          </div>
        ))}
      </div>
      <a href="/admin-login" style={styles.footerLink}>
      <Link to="/login">Already have an Admin account? Login</Link>
      </a>
    </div>
  );
};

export default Welcome;