import React, { useState, useEffect, useContext } from "react";
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
import { AuthContext } from "@/contexts/AuthContext";

const menuItems = [
	{ to: "/branch/dashboard", label: "Dashboard", icon: <RxDashboard />, hasDropdown: false, permission: "admin-dashboard" },
	{
		label: "Seat Booking",
		icon: <RxDashboard />,
		hasDropdown: true,
		dropdown: [
			{ to: "/branch/floorplan", label: "Floor Plan", permission: "floor-plan" },
			{ to: "/branch/booking/plans", label: "Price Plan", permission: "price-plan" },
			{ to: "/branch/booking/requests", label: "Booking Request", permission: "booking-request" },
			{ to: "/branch/booking/seats-allocation", label: "Seat Card", permission: "seat-card" },
		],
	},
	{
		label: "Booking Management",
		icon: <SlCalender />,
		hasDropdown: true,
		dropdown: [
			{ to: "/branch/booking-schedule", label: "Room Booking", permission: "room-booking" },
			{ to: "/branch/booking-schedule/requests", label: "Booking Requests", permission: "booking-requests" },
		],
	},
	{
		label: "Invoice",
		icon: <SlCalender />,
		hasDropdown: true,
		dropdown: [
			{ to: "/branch/invoice/dashboard", label: "Dashboard", permission: "invoice-dashboard" },
			{ to: "/branch/invoice/create", label: "New Invoice", permission: "new-invoice" },
			{ to: "/branch/invoice/management", label: "Invoice Management", permission: "invoice-management" },
		],
	},
	{
		label: "Member",
		icon: <SlCalender />,
		hasDropdown: true,
		dropdown: [
			{ to: "/branch/floorplan", label: "Add New", permission: "floor-plan" },
			{ to: "/branch/member/companies", label: "Company", permission: "Company" },
			{ to: "/branch/member/users", label: "Users", permission: "users" },
			{ to: "/branch/member/contracts", label: "Contract", permission: "contracts" },
		],
	},
	{
		label: "Employee Management",
		icon: <SlCalender />,
		hasDropdown: true,
		dropdown: [
			{ to: "/branch/employee/dashboard", label: "Dashboard", permission: "employee-dashboard" },
			{ to: "/branch/employee/departments", label: "Departments", permission: "employee-dashboard" },
			{ to: "/branch/employee/attendance", label: "Attendance", permission: "attendance" },
			{ to: "/branch/employee/leave/category", label: "Leave Category", permission: "leave-category" },
			{ to: "/branch/employee/leave/application", label: "Leave Application", permission: "leave-application" },
			{ to: "/branch/employee/leave/management", label: "Leave Management", permission: "leave-management" },
			{ to: "/branch/employee/leave/report", label: "Leave Report", permission: "leave-report" },
			{ to: "/branch/employee/manage/attendance", label: "Manage Attendance", permission: "manage-attendance" },
			{ to: "/branch/employee/attendance/monthly/report", label: "Monthly Report", permission: "monthly-report" },
			{ to: "/branch/employee/attendance/report", label: "Attendance Report", permission: "manage-attendance" },
		],
	},
	// { to: "", label: "Inventory Management", icon: <MdOutlineInventory />, hasDropdown: true },
	// { to: "", label: "Expense Management", icon: <LuListTodo />, hasDropdown: true },
	// { to: "", label: "Financial Report", icon: <GoDatabase />, hasDropdown: true },
	{
		label: "Users Role Management",
		icon: <SlCalender />,
		hasDropdown: true,
		dropdown: [
			{ to: "/branch/users/roles", label: "Roles", permission: "roles" },
			{ to: "/branch/users/management", label: "User", permission: "employee-users" },
		],
	},
	{ to: "", label: "Settings", icon: <RxDashboard />, hasDropdown: false },
];

const Admin = () => {
	const { permissions } = useContext(AuthContext);

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
			{menuItems
				.filter((item) => {
					if (!item.hasDropdown) {
						// Check permission for single item
						return permissions.includes(item.permission);
					}

					// Check if any dropdown item has permission
					return item.dropdown.some((subItem) => permissions.includes(subItem.permission));
				})
				.map((item, index) => (
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
											item.dropdown
												.filter((subItem) => permissions.includes(subItem.permission))
												.map((subItem, subIndex) => (
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
