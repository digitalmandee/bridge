import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import { RxDashboard } from "react-icons/rx";
import { MdOutlineInventory } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { LuListTodo } from "react-icons/lu";
import { GoDatabase } from "react-icons/go";
import { BsGraphUpArrow } from "react-icons/bs";
import { IoMdContact } from "react-icons/io";
import { FaAngleRight } from "react-icons/fa6";
("react-icons/all");
import "./style.css";

const menuItems = [
	{ to: "/branch/dashboard", label: "Dashboard", icon: <RxDashboard /> },
	{
		label: "Seat Booking",
		icon: <RxDashboard />,
		dropdown: [
			{ to: "/branch/floorplan", label: "Floor Plan" },
			{ to: "/branch/booking/plans", label: "Price Plan" },
			{ to: "/branch/booking/requests", label: "Booking Request" },
			{ to: "/branch/booking/seats-allocation", label: "Seat Card" },
			// { to: "/branch/booking/invoices", label: "Booking Invoice" },
		],
	},
	{
		label: "Booking Management",
		icon: <SlCalender />,
		dropdown: [
			{ to: "/branch/booking-schedule", label: "Room Booking" },
			{ to: "/branch/booking-schedule/requests", label: "Booking Requests" },
		],
	},
	{
		label: "Invoice",
		icon: <SlCalender />,
		dropdown: [
			{ to: "/branch/invoice/dashboard", label: "Dashboard" },
			{ to: "/branch/invoice/create", label: "New Invoice" },
			{ to: "/branch/invoice/management", label: "Invoice Management" },
		],
	},
	{
		label: "Member",
		icon: <SlCalender />,
		dropdown: [
			{ to: "/branch/floorplan", label: "Add New" },
			{ to: "/branch/member/companies", label: "Company" },
			{ to: "/branch/member/users", label: "Users" },
			{ to: "/branch/member/contracts", label: "Contract" },
		],
	},
	{ to: "", label: "Inventory Management", icon: <MdOutlineInventory /> },
	{ to: "", label: "Expense Management", icon: <LuListTodo /> },
	{ to: "", label: "Financial Report", icon: <GoDatabase /> },
	{ to: "", label: "Revenue Check", icon: <BsGraphUpArrow /> },
	{ to: "", label: "Contact", icon: <IoMdContact /> },
	{ to: "", label: "Settings", icon: <RxDashboard /> },
];

const Admin = () => {
	const [openDropdown, setOpenDropdown] = useState(null);
	const location = useLocation();

	const toggleDropdown = (label) => {
		setOpenDropdown(openDropdown === label ? null : label);
	};

	return (
		<ul>
			{menuItems.map((item, index) => (
				<li key={index}>
					{item.dropdown ? (
						<>
							<Button className={`w-100 ${openDropdown === item.label ? "active-button" : ""}`} onClick={() => toggleDropdown(item.label)}>
								<span className="icon">{item.icon}</span>
								{item.label}
								<span className={`arrow ${openDropdown === item.label ? "rotate" : ""}`}>
									<FaAngleRight />
								</span>
							</Button>
							{openDropdown === item.label && (
								<ul className="submenu">
									{item.dropdown.map((subItem, subIndex) => (
										<li key={subIndex}>
											<Link to={subItem.to}>{subItem.label}</Link>
										</li>
									))}
								</ul>
							)}
						</>
					) : (
						<Link to={item.to}>
							<Button className={`w-100 ${location.pathname === item.to ? "active-button" : ""}`}>
								<span className="icon">{item.icon}</span>
								{item.label}
								<span className="arrow">
									<FaAngleRight />
								</span>
							</Button>
						</Link>
					)}
				</li>
			))}
		</ul>
	);
};

export default Admin;
