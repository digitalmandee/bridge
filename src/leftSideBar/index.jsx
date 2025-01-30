import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import { RxDashboard } from "react-icons/rx";
import { AiOutlineProduct } from "react-icons/ai";
import { MdOutlineInventory } from "react-icons/md";
import { MdProductionQuantityLimits } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { LuListTodo } from "react-icons/lu";
import { GoDatabase } from "react-icons/go";
import { BsGraphUpArrow } from "react-icons/bs";
import { MdOutlineDateRange } from "react-icons/md";
import { IoMdContact } from "react-icons/io";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FaAngleRight } from "react-icons/fa6";
import "./style.css";

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const location = useLocation();

  return (
    <>
      <div className="sidebar">
        <ul>
          <li>
            <Link to="/admin-dashboard">
              <Button className={`w-100 ${location.pathname === "/admin-dashboard" ? "active-button" : ""}`}>
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
            <Link to="/booking-calender">
              <Button className={`w-100 ${location.pathname === "/booking-calender" ? "active-button" : ""}`}>
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
            <Link to="/booking">
              <Button className={`w-100 ${location.pathname === "/booking" ? "active-button" : ""}`}>
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
        <ul>
          <li>
            <Link to="">
              <Button className="w-100">
                <span className="icon">
                  <RiLogoutBoxLine />
                </span>
                Log Out
              </Button>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
