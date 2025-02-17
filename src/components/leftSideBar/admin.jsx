import React, { useState, useEffect } from "react";
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
	{ to: "/branch/dashboard", label: "Dashboard", icon: <RxDashboard />, hasDropdown: false },
	{
		label: "Seat Booking",
		icon: <RxDashboard />,
		hasDropdown: true,
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
		hasDropdown: true,
		dropdown: [
			{ to: "/branch/booking-schedule", label: "Room Booking" },
			{ to: "/branch/booking-schedule/requests", label: "Booking Requests" },
		],
	},
	{
		label: "Invoice",
		icon: <SlCalender />,
		hasDropdown: true,
		dropdown: [
			{ to: "/branch/invoice/dashboard", label: "Dashboard" },
			{ to: "/branch/invoice/create", label: "New Invoice" },
			{ to: "/branch/invoice/management", label: "Invoice Management" },
		],
	},
	{
		label: "Member",
		icon: <SlCalender />,
		hasDropdown: true,
		dropdown: [
			{ to: "/branch/floorplan", label: "Add New" },
			{ to: "/branch/member/companies", label: "Company" },
			{ to: "/branch/member/users", label: "Users" },
			{ to: "/branch/member/contracts", label: "Contract" },
		],
	},
	{ to: "", label: "Inventory Management", icon: <MdOutlineInventory />, hasDropdown: true },
	{ to: "", label: "Expense Management", icon: <LuListTodo />, hasDropdown: true },
	{ to: "", label: "Financial Report", icon: <GoDatabase />, hasDropdown: true },
	{
		label: "Employee Management",
		icon: <SlCalender />,
		hasDropdown: true,
		dropdown: [
			{ to: "/branch/employee/dashboard", label: "Employee Dashboard" },
			{ to: "", label: "Personal Detail" },
		],
	},
	// { to: "", label: "Employee Management", icon: <BsGraphUpArrow /> },
	{ to: "", label: "Contact", icon: <IoMdContact />, hasDropdown: false },
	{ to: "", label: "Settings", icon: <RxDashboard />, hasDropdown: false },
];

const Admin = () => {
	const location = useLocation();
	const [selectedButton, setSelectedButton] = useState("");
	const [openDropdown, setOpenDropdown] = useState("");

	useEffect(() => {
		if (!menuItems || !Array.isArray(menuItems)) return; // Ensure menuItems is defined

		let activeLabel = "";

		// Check if a top-level menu item matches the current route
		const activeItem = menuItems.find((item) => item.to && item.to === location.pathname);

		if (activeItem) {
			activeLabel = activeItem.label;
		} else {
			// Check dropdown items to see if a child matches the route
			menuItems.forEach((item) => {
				if (item.hasDropdown && item.dropdown) {
					const activeSubItem = item.dropdown.find((subItem) => subItem.to === location.pathname);
					if (activeSubItem) {
						activeLabel = item.label; // Set the parent button as active
					}
				}
			});
		}

		setSelectedButton(activeLabel); // Update the state with the active button
	}, [location.pathname]);

	const handleButtonClick = (label, to, hasDropdown) => {
		if (hasDropdown) {
			// If clicking an already open dropdown, close it and deselect the button
			if (openDropdown === label) {
				setOpenDropdown("");
				setSelectedButton(""); // Unselect everything when collapsing
			} else {
				setOpenDropdown(label); // Open new dropdown
				setSelectedButton(label); // Set the parent button as active
			}
		} else {
			setSelectedButton(label); // Select the button
			setOpenDropdown(""); // Close any open dropdown
		}
	};

	return (
		<ul>
			{menuItems.map((item, index) => (
				<li key={index}>
					{item.hasDropdown ? (
						<>
							<Button className={`w-100 dropdown-button ${selectedButton === item.label ? "active-button" : ""}`} onClick={() => handleButtonClick(item.label, item.to, item.hasDropdown)}>
								<span className="icon">{item.icon}</span>
								{item.label}
								<span className={`arrow ${openDropdown === item.label ? "rotate" : ""}`}>
									<FaAngleRight />
								</span>
							</Button>
							{openDropdown === item.label && (
								<ul className="submenu">
									{item.dropdown &&
										item.dropdown.map((subItem, subIndex) => (
											<li key={subIndex}>
												<Link to={subItem.to}>
													<Button className={`w-100 ${selectedButton === subItem.label ? "active-button" : ""}`} onClick={() => handleButtonClick(subItem.label, subItem.to, false)}>
														{subItem.label}
													</Button>
												</Link>
											</li>
										))}
								</ul>
							)}
						</>
					) : (
						<Link to={item.to}>
							<Button className={`w-100 ${selectedButton === item.label ? "active-button" : ""}`} onClick={() => handleButtonClick(item.label, item.to, item.hasDropdown)}>
								<span className="icon">{item.icon}</span>
								{item.label}
							</Button>
						</Link>
					)}
				</li>
			))}
		</ul>
	);
};

export default Admin;
