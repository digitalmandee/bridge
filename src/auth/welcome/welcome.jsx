import React from "react";
import admin from "../../assets/admin.png";
import branch from "../../assets/branch.png";
import invester from "../../assets/invester.png";
import user from "../../assets/user.PNG";
import logopic from "../../assets/logopic.png"
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import './welcome.css'

const Welcome = () => {

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="wcontainer">
      <img src={logopic} alt="" className="container-img" />
      <p className="subHeading">Choose Account Type</p>
      <div className="accountTypeContainer">
        {[
          { name: "Super Admin", img: admin, path: "/admin-dashboard" },
          { name: "Company", img: branch, path: "/company-dashboard" },
          { name: "Investor Login", img: invester, path: "/investor-dashboard" },
          { name: "User", img: user, path: "/user-dashboard" },
        ].map((account, index) => (
          <div key={index} 
          className="accountType"
          onClick={() => handleNavigation(account.path)} 
          >
            <img
              src={account.img}
              alt={account.name}
              className="accountImage"
            />
            <p>{account.name}</p>
          </div>
        ))}
      </div>
      <a href="/admin-login" className="footerLink">
      <Link to="/login">Already have an Admin account? Login</Link>
      </a>
    </div>
  );
};

export default Welcome;