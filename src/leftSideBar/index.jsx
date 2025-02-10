import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom"
import { Button } from "@mui/material";
import { RxDashboard } from "react-icons/rx"
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
import './style.css';


const Sidebar = () => {

  const [isSeatBookingOpen, setIsSeatBookingOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isMemberOpen, setIsMemberOpen] = useState(false);

  // const toggleDropdown = () => {
  //   setIsDropdownOpen(!isDropdownOpen);
  // };

  const toggleSeatBookingDropdown = () => {
    setIsSeatBookingOpen(!isSeatBookingOpen);
    if (isInvoiceOpen) setIsInvoiceOpen(false); // Close Invoice dropdown if it's open
  };

  const toggleInvoiceDropdown = () => {
    setIsInvoiceOpen(!isInvoiceOpen);
    if (isSeatBookingOpen) setIsSeatBookingOpen(false); // Close Seat Booking dropdown if it's open
  };

  const toggleMemberDropdown = () => {
    setIsMemberOpen(!isMemberOpen);
    if (isMemberOpen) setIsMemberOpen(false); // Close Member dropdown if it's open
  };

  const location = useLocation();

  return (
    <>
      <div className='sidebar'>
        <ul>
          <li>
            <Link to="/branch-admin-dashboard">
              <Button className={`w-100 ${location.pathname === '/branch-admin-dashboard' ? 'active-button' : ''}`}>
                <span className='icon'><RxDashboard /></span>
                Dashboard
                <span className='arrow'>
                  <FaAngleRight />
                </span>
              </Button>
            </Link>
          </li>
        </ul>
        <ul>
          <li>
            <Button className={`w-100 ${isSeatBookingOpen ? 'active-button' : ''}`}
              onClick={toggleSeatBookingDropdown}>
              <span className='icon'><RxDashboard /></span>
              Seat Booking
              <span className={`arrow ${isSeatBookingOpen ? 'rotate' : ''}`}><FaAngleRight /></span>
            </Button>
            {isSeatBookingOpen && (
              <ul className="submenu">
                <li>
                  <Link to="/floorplan">Floor Plan</Link>
                </li>
                <li>
                  <Link to="/booking-request">Booking Request</Link>
                </li>
                <li>
                  <Link to="">Seat Card</Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
        <ul>
          <li>
            <Link to="">
              <Button className='w-100'>
                <span className='icon'><MdOutlineInventory /></span>
                Inventory Management
                <span className='arrow'><FaAngleRight /></span>
              </Button>
            </Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="/booking">
              <Button className={`w-100 ${location.pathname === '/booking' ? 'active-button' : ''}`}>
                <span className='icon'><SlCalender /></span>
                Booking Management
                <span className='arrow'><FaAngleRight /></span>
              </Button>
            </Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="">
              <Button className='w-100'>
                <span className='icon'><LuListTodo /></span>
                Finance Manegement
                <span className='arrow'><FaAngleRight /></span>
              </Button>
            </Link>
          </li>
        </ul>
        <ul>
          <li>
            <Button className={`w-100 ${isInvoiceOpen ? 'active-button' : ''}`}
              onClick={toggleInvoiceDropdown}>
              <span className='icon'><GoDatabase /></span>
              Invoice
              <span className={`arrow ${isInvoiceOpen ? 'rotate' : ''}`}><FaAngleRight /></span>
            </Button>
            {isInvoiceOpen && (
              <ul className="submenu">
                <li>
                  <Link to="/invoice-dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/new-invoice">New Invoice</Link>
                </li>
              </ul>
            )}

          </li>
        </ul>
        <ul>
          <li>
            <Button className={`w-100 ${isMemberOpen ? 'active-button' : ''}`}
              onClick={toggleMemberDropdown}>
              <span className='icon'><BsGraphUpArrow /></span>
              Member
              <span className={`arrow ${isMemberOpen ? 'rotate' : ''}`}><FaAngleRight /></span>
            </Button>
            {isMemberOpen && (
              <ul className="submenu">
                <li>
                  <Link to="">Add New</Link>
                </li>
                <li>
                  <Link to="/member-company">Company</Link>
                </li>
                <li>
                  <Link to="/member-user">Users</Link>
                </li>
                <li>
                  <Link to="/member-contract">Contract</Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
        <ul>
          <li>
            <Link to="/booking-calender">
              <Button className={`w-100 ${location.pathname === '/booking-calender' ? 'active-button' : ''}`}>
                <span className='icon'><MdOutlineDateRange /></span>
                Calender
                <span className='arrow'><FaAngleRight /></span>
              </Button>
            </Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="">
              <Button className='w-100'>
                <span className='icon'><IoMdContact /></span>
                Contact
                <span className='arrow'><FaAngleRight /></span>
              </Button>
            </Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="">
              <Button className='w-100'>
                <span className='icon'><RxDashboard /></span>
                Settings
                <span className='arrow'><FaAngleRight /></span>
              </Button>
            </Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="">
              <Button className='w-100'>
                <span className='icon'><RiLogoutBoxLine /></span>
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
