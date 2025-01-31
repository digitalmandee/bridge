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

const Admin = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const location = useLocation();
  return (
    <>
      <ul>
        <li>
          <Link to="/branch/dashboard">
            <Button className={`w-100 ${location.pathname === "/branch/dashboard" ? "active-button" : ""}`}>
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
          <Button className={`w-100 ${isDropdownOpen ? "active-button" : ""}`} onClick={toggleDropdown}>
            <span className="icon">
              <RxDashboard />
            </span>
            Seat Booking
            <span className={`arrow ${isDropdownOpen ? "rotate" : ""}`}>
              <FaAngleRight />
            </span>
          </Button>
          {isDropdownOpen && (
            <ul className="submenu">
              <li>
                <Link to="/branch/floorplan">Floor Plan</Link>
              </li>
              <li>
                <Link to="/branch/booking/plans">Price Plan</Link>
              </li>
              <li>
                <Link to="/branch/booking/requests">Booking Request</Link>
              </li>
              <li>
                <Link to="/branch/booking/seats-allocation">Seat Card</Link>
              </li>
              <li>
                <Link to="/branch/booking/invoices">Booking Invoice</Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
      <ul>
        <li>
          <Link to="">
            <Button className="w-100">
              <span className="icon">
                <MdOutlineInventory />
              </span>
              Inventory Management
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
          </Link>
        </li>
      </ul>
      <ul>
        <li>
          <Link to="/branch/booking-schedule">
            <Button className={`w-100 ${location.pathname === "/branch/booking-schedule" ? "active-button" : ""}`}>
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
      <ul>
        <li>
          <Link to="/branch/booking">
            <Button className={`w-100 ${location.pathname === "/branch/booking" ? "active-button" : ""}`}>
              <span className="icon">
                <SlCalender />
              </span>
              Booking Management
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
          </Link>
        </li>
      </ul>
      <ul>
        <li>
          <Link to="">
            <Button className="w-100">
              <span className="icon">
                <LuListTodo />
              </span>
              Expense Manegement
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
          </Link>
        </li>
      </ul>
      <ul>
        <li>
          <Link to="">
            <Button className="w-100">
              <span className="icon">
                <GoDatabase />
              </span>
              Financial Report
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
          </Link>
        </li>
      </ul>
      <ul>
        <li>
          <Link to="">
            <Button className="w-100">
              <span className="icon">
                <BsGraphUpArrow />
              </span>
              Revenue Check
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
          </Link>
        </li>
      </ul>
      <ul>
        <li>
          <Link to="">
            <Button className="w-100">
              <span className="icon">
                <IoMdContact />
              </span>
              Contact
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
          </Link>
        </li>
      </ul>
      <ul>
        <li>
          <Link to="">
            <Button className="w-100">
              <span className="icon">
                <RxDashboard />
              </span>
              Settings
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

export default Admin;
