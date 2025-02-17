import React from "react";
import admin from "../../assets/admin.png";
import branch from "../../assets/branch.png";
import invester from "../../assets/investor.png";
import user from "../../assets/user.png";
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
          { name: "Super Admin", img: admin, path: "/super-admin/dashboard" },
          { name: "Branch Login", img: branch, path: "/branch/dashboard" },
          { name: "Investor Login", img: invester, path: "/investor/dashboard" },
          { name: "User", img: user, path: "/user/dashboard" },
        ].map((account, index) => (
          <div key={index} className="account-wrapper">
            <div className="accountType"
              onClick={() => handleNavigation(account.path)}
            >
              <img
                src={account.img}
                alt={account.name}
                className="accountImage"
              />
            </div>
            <p>{account.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Welcome;