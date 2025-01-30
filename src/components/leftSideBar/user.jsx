import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import { RxDashboard } from "react-icons/rx";
import { MdOutlineInventory } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { LuListTodo } from "react-icons/lu";
import { GoDatabase } from "react-icons/go";
import { BsGraphUpArrow } from "react-icons/bs";
import { MdOutlineDateRange } from "react-icons/md";
import { IoMdContact } from "react-icons/io";
import { FaAngleRight } from "react-icons/fa6";
import "./style.css";

const User = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const location = useLocation();
  return (
    <>
      <ul>
        <li>
          <Link to="/user/dashboard">
            <Button className={`w-100 ${location.pathname === "/user/dashboard" ? "active-button" : ""}`}>
              <span className="icon">
                <RxDashboard />
              </span>
              Dashboard
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
          </Link>
        </li>
      </ul>
      <ul>
        <li>
          <Link to="/user/booking-schedule">
            <Button className={`w-100 ${location.pathname === "/user/booking-schedule" ? "active-button" : ""}`}>
              <span className="icon">
                <MdOutlineDateRange />
              </span>
              Room Booking
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
          </Link>
        </li>
      </ul>
    </>
  );
};

export default User;
